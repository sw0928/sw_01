// //左侧菜单组件
Vue.component("v-flow-left", {
    template: `
        <div id="leftMenu" class="r12-2-menu">
            <div class="left-menu-box">
                <a v-for="(l,index) in leftData" :href="l.url" class="left-menu-box-a" :class='{"active":current==index}'>
                    <span class='left-menu-box-span'></span>{{l.name}}
                </a>
            </div>
        </div>
    `,
    props: ["current"],
    data: function() {
        return {
            leftData: [{
                name: '流量布局',
                url: 'flow-layout.html'
            }, {
                name: '可控流量',
                url: 'search_index.html'
            }, {
                name: '不可控流量',
                url: 'no-control.html'
            }]
        }
    }
});




//导航栏部分
Vue.component("v-fixed-menu", {
    template: `
        <div id="fixedMenu" class="r12-10r">
            <div class="fixed-menu-box">
                <div class="fixed-menu-main">
                    <div class="filter">
                        <div v-for="(l,index) in filter" class="filter-btn" :data-val="l.data_val" @click="leftFilter(index)" :class='{"filter-btn-sel":current==index}'>{{l.name}}</div>
                    </div>
                    <div class="date">
                        <div v-for="(p,index) in data_btn" class="date-btn" :data-val="p.data_val" @click="rightDate(index)" :class='{"date-btn-sel":current2==index}'>{{p.name}}</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            current: 1, //左侧全局，无线端等索引
            current2: 1, //右侧日期， 近七天等索引
            updata: {
                platform: '',
                timeIndex: ''
            }, //传递下去的值
            filter: [{
                name: "全平台",
                data_val: 0,
            }, {
                name: "无线端",
                data_val: 1,
            }, {
                name: "PC端",
                data_val: 2,
            }], //左侧
            data_btn: [{
                name: "昨天",
                data_val: 0,
                begintime: changeDate2(1), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                name: "近七天",
                data_val: 1,
                begintime: changeDate2(7), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                name: "近30天",
                data_val: 2,
                begintime: changeDate2(30), //开始时间
                endtime: changeDate2(1), //结束时间
            }], //右侧日期
        }
    },
    created() {
        //传递
        var updata = {
            platform: '',
            timeIndex: ''
        }
        this.updata.platform = this.filter[this.current].data_val; //对应索引
        this.updata.timeIndex = this.data_btn[this.current2].data_val; //对应索引
        updata = this.updata;
        setTimeout(() => {
            bus.$emit("params", updata);
        });
    },
    methods: {
        //左侧点击传值
        leftFilter: function(i) {
            this.current = i;
            var updata = {
                platform: '',
                timeIndex: ''
            }
            this.updata.platform = this.filter[this.current].data_val;
            this.updata.timeIndex = this.data_btn[this.current2].data_val;
            updata = this.updata;
            bus.$emit("params", updata);
        },
        //右侧点击传值
        rightDate: function(l) {
            this.current2 = l;
            var updata = {
                platform: '',
                timeIndex: ''
            }
            this.updata.platform = this.filter[this.current].data_val;
            this.updata.timeIndex = this.data_btn[this.current2].data_val;
            updata = this.updata;
            bus.$emit("params", updata);
        },
    },
});

//柱状图和饼图组件
Vue.component("v-echart", {
    template: `
        <div style="margin-bottom:20px;">
            <div class="module-title">
                <h1>流量布局情况</h1>
                <div class="module-title-tip">
                    <div class="module-title-tip-text">
                        点击饼图项进行来源下钻，点击已选中的饼图项返回全部来源
                    </div>
                </div>
            </div>
            <div class="echart_wrap clearfix">
                <div id="chartRate"></div>
                <div id="chartCount"></div>
                <div v-if="echartShow" class="noData_wrap">
                    <img src="../img/vNodata.png" class="noData">
                </div>
            </div>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            echartShow: false, //饼图和柱状图显示
            platform: '', //左侧时间变化
            timeIndex: 1, //右侧日期变化
            eachartLeft: {
                data1: [],
                data2: []
            }, //左侧饼图
            eachartRight: {
                data1: [], //x轴坐标
                data2: [], //柱状图UV
                data3: [], //折线图，成交笔数
            }, //右侧柱状图
            data_btn: [{
                begintime: changeDate2(1), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                begintime: changeDate2(7), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                begintime: changeDate2(30), //开始时间
                endtime: changeDate2(1), //结束时间
            }], //右侧日期
        }
    },
    created() {
        var $this = this;
        //接收参数
        bus.$on("params", function(updata) {
            $this.platform = updata.platform;
            $this.timeIndex = updata.timeIndex;
            // this.addData(); //若监听了函数，则不需要在这里写渲染
        });
    },
    watch: { //监听
        sellerid: function() {
            this.addData(); //开始渲染
        },
        //监听左侧
        platform: function() {
            this.addData();
        },
        //监听右侧
        timeIndex: function() {
            this.addData();
        }
    },
    methods: {
        //执行函数
        addData: function() {
            var $this = this;
            if (!$this.sellerid) {
                return;
            }
            this.echarTL();
            this.echarTR();
        },
        //左侧饼图请求接口
        echarTL: function() {
            var $this = this;
            $.ajax({
                url: $api.noControlLeft,
                type: "POST",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    begintime: $this.data_btn[$this.timeIndex].begintime,
                    endtime: $this.data_btn[$this.timeIndex].endtime,
                    platform: $this.platform,
                    type: 1
                },
                success: function(data) {
                    // console.log(data);
                    if (data.count) {

                        //显示图表
                        $this.echartShow = false;

                        //清空缓存
                        $this.eachartLeft.data1 = [];
                        $this.eachartLeft.data2 = [];
                        for (var i = 0; i < data.data.rows.length; i++) {
                            $this.eachartLeft.data1.push(data.data.rows[i][0]);
                            $this.eachartLeft.data2.push({
                                name: data.data.rows[i][0],
                                value: data.data.rows[i][1],
                            });
                        }
                        //左侧饼图
                        var chartRate = echarts.init(document.getElementById('chartRate'));
                        var option = {
                            title: {
                                text: '流量渠道占比',
                                x: 'center',
                                top: '2%'
                            },
                            grid: {
                                left: '15%'
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            legend: {
                                data: $this.eachartLeft.data1,
                                bottom: "2%",
                            },
                            series: [{
                                name: '淘内免费',
                                type: 'pie',
                                radius: '60%',
                                center: ['50%', '50%'],
                                data: $this.eachartLeft.data2,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }]
                        };
                        chartRate.clear(); //清空缓存
                        chartRate.setOption(option);
                    } else if (data.result == "0") {
                        $this.echartShow = !$this.echartShow;
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },
        //右侧柱状图请求接口
        echarTR: function() {
            var $this = this;
            //请求接口
            $.ajax({
                url: $api.noControlRight,
                type: "POST",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    begintime: $this.data_btn[$this.timeIndex].begintime,
                    endtime: $this.data_btn[$this.timeIndex].endtime,
                    platform: $this.platform,
                    type: 2
                },
                success: function(data) {
                    if (data.count) {
                        //清空缓存，防止数据叠加
                        $this.eachartRight.data1 = [];
                        $this.eachartRight.data2 = [];
                        $this.eachartRight.data3 = [];
                        //处理数据
                        for (var i = 0; i < data.data.rows.length; i++) {
                            $this.eachartRight.data1.push(data.data.rows[i][0]);
                            $this.eachartRight.data2.push(data.data.rows[i][2]);
                            $this.eachartRight.data3.push(data.data.rows[i][1]);
                        }
                        //右侧柱状图
                        var chartCount = echarts.init(document.getElementById('chartCount'));
                        var option2 = {
                            title: {
                                text: '流量渠道访客成交图',
                                x: 'center',
                                top: '2%'
                            },
                            tooltip: {
                                trigger: 'axis',
                            },
                            legend: {
                                data: ['UV', '成交笔数'],
                                bottom: '2%',
                            },
                            grid: {
                                left: '12%',
                            },
                            xAxis: [{
                                type: 'category',
                                data: $this.eachartRight.data1,
                                axisPointer: {
                                    type: 'shadow'
                                }
                            }],
                            yAxis: [{
                                    type: 'value',
                                    name: 'UV',
                                    min: 0,
                                },
                                {
                                    type: 'value',
                                    name: '成交笔数',
                                    min: 0,
                                }
                            ],
                            series: [{
                                    name: 'UV',
                                    type: 'bar',
                                    data: $this.eachartRight.data2,
                                    barWidth: '30%',
                                    itemStyle: {
                                        normal: {
                                            color: '#76a6d3'
                                        }
                                    },
                                },
                                {
                                    name: '成交笔数',
                                    type: 'line',
                                    yAxisIndex: 1,
                                    data: $this.eachartRight.data3,
                                    itemStyle: {
                                        normal: {
                                            color: '#90c177'
                                        }
                                    },
                                    smooth: true
                                }
                            ]
                        };
                        chartCount.clear(); //清空数据缓存
                        chartCount.setOption(option2);
                    } else if (data.result == "0") {

                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        }
    }
});

//细分来源列表指标模块
Vue.component("v-targrt", {
    template: `
        <div class="clearfix">
            <div id="table-title" class="module-title fl">
                <h1>细分来源列表</h1>
                <p>共有<span>{{count}}</span>个入店来源</p>
            </div>
            <div class="module-tool">
                <div class="module-tool-more">
                    <span>指标</span>
                    <div id="index-list" class="module-tool-box" data-flow="1,2,3" data-pf="1">
                        <div class="module-tool-flow">
                            流量类型：
                            <label v-for="(l,index) in flowType" class="fr" style="margin-right:12px;">
                                <div class="select_box" @click="selectItem(index)" :class="{selected:l.selected}"></div>{{l.name}}
                            </label>
                        </div>
                        <div class="module-tool-chk-box">
                            <label v-for="(l,index) in targetDate" v-show="l.isShow">
                                <div class="select_box" @click="select(index)" :class="{selected:l.select}"></div>{{l.arr[0]}}
                            </label>
                        </div>
                        <div class="module-tool-tip">
                            已选择<span>5</span>个（注：每次最多选择8个指标）</div>
                        <div class="module-tool-table" @click="makeTable()">生成列表</div>
                    </div>
                </div>
                <div class="module-download" @click="downLoadNo()">下载</div>
            </div>
            <div id="com_list">
                <table v-if="noDataShow">
                    <tbody>
                        <tr>
                            <th v-for="l in tableDate.columns" draggable="true" :data-val="l" :title="l">{{l}}</th>
                        </tr>
                        <tr v-for="p in tableDate.rows">
                            <td class="td-name"><span :title="p[0]">{{p[0]}}</span></td>
                            <td v-for="(l,index) in p" v-if="index!=0">{{l}}</td>
                        </tr>
                    </tbody>
                </table>
                <div  style="display:none;">
                    <table id="noControl_down">
                        <tbody>
                            <tr>
                                <th v-for="l in downLoad.columns" draggable="true" :data-val="l" :title="l">{{l}}</th>
                            </tr>
                            <tr v-for="p in downLoad.rows">
                                <td class="td-name"><span :title="p[0]">{{p[0]}}</span></td>
                                <td v-for="(l,index) in p" v-if="index!=0">{{l}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <img src="../img/vNodata.png" v-if="!noDataShow" class="noData_img" alt="">
            </div>
            <v-page :count='count' :allpage='allpage' :pageno="pageno" @pn="changepn" v-if="pageShow"></v-page>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            platform: 1, // 左侧切换
            timeIndex: 1, // 右侧日期切换
            target: [], // 所有指标数据(处理前)
            targetDate: [], // 指标展示数据
            tableDate: [], // 下方表格数据
            downLoad: [], //表格下载数据
            flowType: [{
                name: "规模与趋势",
                selected: true
            }, {
                name: "效率与质量",
                selected: true
            }, {
                name: "结果与价值",
                selected: true
            }], //流量类型

            pageno: 1, //当前页码
            pagesize: 10, //分页大小，每页显示多少条
            count: 0, //总数据量,总数据来源
            allpage: 0, //总页数

            all: [], // 全平台
            wifi: [], // 无线端数据
            pc: [], // pc端数据
            data_btn: [{
                begintime: changeDate2(1), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                begintime: changeDate2(7), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                begintime: changeDate2(30), //开始时间
                endtime: changeDate2(1), //结束时间
            }], //右侧日期

            //下方表格需要传的参数
            tableThName: '', //表头名称
            tableArr: [], //指标选中数组
            tableSortName: '', //表头排序名称
            noDataShow: true, //表格无数据展现， 默认显示
            pageShow: true, //分页无数据展现， 默认显示
        }
    },
    watch: {
        sellerid: function() {
            this.addData();
        },
        platform: function() {
            this.addData();
        },
        timeIndex: function() {
            this.addData();
        }
    },
    methods: {
        addData: function() {
            var $this = this;
            if (!$this.sellerid) {
                return;
            }
            this.indexAjax(); //指标函数
            // this.comList(); //表格函数
        },

        //指标函数
        indexAjax: function() {
            var $this = this;
            $.ajax({
                url: $api.noControlIndex,
                type: "GET",
                dataType: "json",
                success: function(data) {

                    //清空数据
                    $this.target = [];
                    $this.targetDate = [];
                    $this.all = [];
                    $this.wifi = [];
                    $this.pc = [];
                    $this.tableArr = []; //清空表格数据

                    //全部指标数据处理
                    for (var i = 0; i < data.data.rows.length; i++) {
                        $this.target.push({
                            arr: data.data.rows[i],
                            select: '',
                            isShow: true
                        });
                    }

                    //根据数据平台分类, 全平台，无线端，PC端
                    for (var j = 0; j < $this.target.length; j++) {
                        if ($this.target[j].arr[2] == "0") {
                            $this.all.push($this.target[j]);
                        } else if ($this.target[j].arr[2] == "1") {
                            $this.wifi.push($this.target[j]);
                        } else if ($this.target[j].arr[2] == "2") {
                            $this.pc.push($this.target[j]);
                        }
                    }

                    //根据当前状态判断指标数据显示  指标分类
                    if ($this.platform == 0) {
                        $this.targetDate = $this.all;
                    } else if ($this.platform == 1) {
                        $this.targetDate = $this.wifi;
                    } else if ($this.platform == 2) {
                        $this.targetDate = $this.pc;
                    }

                    //默认选中前五项
                    for (var i = 0; i < $this.targetDate.length; i++) {
                        if (i < 5) {
                            $this.targetDate[i].select = true;
                        } else {
                            $this.targetDate[i].select = false;
                        }
                    }

                    //将选中的指标内容拿到
                    for (var i = 0; i < $this.targetDate.length; i++) {
                        if ($this.targetDate[i].select == true) {
                            $this.tableArr.push($this.targetDate[i].arr[0]);
                        }
                    }

                    //设置表
                    $this.tableThName = $this.tableArr.join(','); // 处理传参
                    $this.tableSortName = $this.tableArr[0]; // 排序指标参数
                    $this.comList(); //表格函数
                    $this.noContDownLoad(); // 导出表格执行
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //表格函数
        comList: function() {
            var $this = this;
            $.ajax({
                url: $api.noControlTable,
                typr: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    seller_id: $this.sellerid,
                    begintime: $this.data_btn[$this.timeIndex].begintime,
                    endtime: $this.data_btn[$this.timeIndex].endtime,
                    platform: $this.platform,
                    name: $this.tableThName,
                    sortname: $this.tableSortName,
                    sorttype: 'desc',
                    page: $this.pageno,
                    src_parent_name: ''
                },
                success: function(data) {
                    if (data.count != "0") {

                        //有数据的情况，表格显示，分页显示
                        $this.noDataShow = true;
                        $this.pageShow = true;

                        $this.tableDate = data.data; //表格赋值
                        $this.count = data.count; //总页数赋值
                        $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                    } else {

                        // 如果返回的数据为 0  表格不显示显示，分页不显示
                        $this.noDataShow = !$this.noDataShow;
                        $this.pageShow = !$this.pageShow;
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //下载表格
        noContDownLoad: function() {
            var $this = this;
            $.ajax({
                url: $api.noContDownLoad,
                typr: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    sellerid: $this.sellerid,
                    begintime: $this.data_btn[$this.timeIndex].begintime,
                    endtime: $this.data_btn[$this.timeIndex].endtime,
                    platform: $this.platform,
                    name: $this.tableThName,
                    sortname: $this.tableSortName,
                    sorttype: 'desc',
                    srcparentname: ''
                },
                success: function(data) {
                    if (data.count != "0") {
                        $this.downLoad = data.data; //表格赋值
                    } else {}
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //指标流量类型点击
        selectItem: function(i) {

            this.flowType[i].selected = !this.flowType[i].selected; //点击来回切换

            //点击的时候判断下方数据的分类索引是否跟上面一致,来显示隐藏
            for (var j = 0; j < this.targetDate.length; j++) {
                if (this.targetDate[j].arr[1] == (i + 1)) {
                    this.targetDate[j].isShow = !this.targetDate[j].isShow;
                }
            }
        },

        //指标内容点击 
        select: function(i) {
            this.targetDate[i].select = !this.targetDate[i].select; //点击来回切换
        },

        //点击生成列表按钮
        makeTable: function() {
            var $this = this;
            $this.tableArr = []; //push  所以需要清空

            // 先查询显示的指标 然后找到选中项
            for (var i = 0; i < this.targetDate.length; i++) {
                if (this.targetDate[i].isShow == true && this.targetDate[i].select == true) {
                    $this.tableArr.push(this.targetDate[i].arr[0]);
                }
            }

            //如果一个都没选中，并且表格不展示，则阻止执行
            if ($this.tableArr.length == 0 || !$this.noDataShow) {
                return;
            }
            $this.tableThName = $this.tableArr.join(",");
            $this.tableSortName = $this.tableArr[0];
            this.comList(); //表格函数
            this.noContDownLoad(); //执行导出表格函数
        },

        //接收分页组件页码
        changepn: function(pn) {
            this.pageno = pn;
            var $this = this;
            $.ajax({
                url: $api.noControlTable,
                typr: "POST",
                dataType: "json",
                contentType: 'application/json',
                data: {
                    seller_id: $this.sellerid,
                    begintime: $this.data_btn[$this.timeIndex].begintime,
                    endtime: $this.data_btn[$this.timeIndex].endtime,
                    platform: $this.platform,
                    name: $this.tableThName,
                    sortname: $this.tableSortName,
                    sorttype: 'desc',
                    page: $this.pageno,
                    src_parent_name: ''
                },
                success: function(data) {
                    $this.tableDate = data.data; //表格赋值
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //点击下载，导出表格
        downLoadNo: function() {
            inputExcel("#noControl_down", "细分来源列表.xls");
        }
    },
    mounted() {
        var $this = this;

        //接收上面传下来的数据
        bus.$on("params", function(updata) {
            $this.platform = updata.platform;
            $this.timeIndex = updata.timeIndex;
            $this.pageno = 1; //刷新表格，页码要刷新

            //点击刷新之后，让所有的再次选上
            for (var i = 0; i < $this.flowType.length; i++) {
                $this.flowType[i].selected = true;
            }
        });
    }
});