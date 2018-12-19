/**
 * 2017/09/14
 * 流量把控-流量布局
 * 
 */

//日期选择模块
Vue.component("v-choose-date", {
    template: `
        <div id="fixedMenu" class="r12-10r">
            <div class="fixed-menu-box">
                <div class="fixed-menu-main">
                    <div id="flow-date" class="flow-date">
                        <div class="date-txt" data-tip="起始日:">
                            <input id="date-start" type="text" readonly="readonly" :value="thedate.startDate">
                        </div>
                        <div class="date-gap">-</div>
                        <div class="date-txt" data-tip="截止日:">
                            <input id="date-end" type="text" readonly="readonly" :value="thedate.endDate">
                        </div>
                        <div id="date-btn" class="date-btn" @click="sureBtn()">确定</div>
                    </div>
                </div>
            </div>
        </div>
     `,
    data: function() {
        return {
            thedate: {
                startDate: '',
                endDate: '',
            }
        }
    },
    created() {
        var $this = this;
        var newdate = new Date(); // 初始化显示当前日期
        var thedate = {
            startDate: '',
            endDate: '',
        }
        $this.thedate.startDate = this.changeDate(7);
        $this.thedate.endDate = this.changeDate(1);

        // $this.thedate.startDate = "2017-09-13";
        // $this.thedate.endDate = "2017-09-19";
        thedate = $this.thedate;
        //0延迟发送
        setTimeout(() => {
            bus.$emit("getDate", thedate);
        });
    },
    methods: {
        //点击确定按钮，获取时间
        sureBtn: function() {
            var $this = this;
            var thedate = {
                startDate: $("#date-start").val(),
                endDate: $("#date-end").val(),
            }

            //起始日时间不能大于截止日时间
            if (Number(this.toStr(thedate.startDate)) > this.toStr(thedate.endDate)) {
                alert("起始日时间不能大于截止日时间");
                return;
            }
            bus.$emit("getDate", thedate);
        },
        changeDate: function(val) {
            var date = new Date().getTime() - (val * 24 * 60 * 60 * 1000);
            var ndate = new Date(date);
            var Y = ndate.getFullYear() + "-";
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + "-";
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
            ndate = Y + M + D;
            return ndate;
        },

        //日期插件去  "-" 处理
        toStr: function(str) {
            var toStr = str.split("-").join("");
            return toStr;
        },
    }
});

//图表模块
Vue.component("v-top-echart", {
    template: `
        <div class="b1 flowEchart">
            <div id="chart-tst" class="fl"></div>
            <div id="chart-cir" class="fr"></div>
            <div id="tss" style="height:125px;clear: both;">
                <div class="b4bg" v-for="p in b5bg">
                    <div class="index-value">{{p.value}}</div>
                    <div class="index-title">{{p.name}}</div>
                </div>
            </div>
            <div v-if="echartShow" class="flow_echart_wrap">
                <img src="../img/vNodata.png" class="noData">
            </div>
        </div>  
    `,
    props: ["sellerid"],
    data: function() {
        return {
            b5bg: [],
            thedate: '', //开始时间和结束时间
            begintime: '', // 饼图开始时间
            endtime: '', // 饼图结束时间
            echartShow: false, // 上方无数据显示
        }
    },
    created() {

    },
    watch: {
        sellerid: function() {
            this.addData();
        },
        thedate: function() {
            this.addData();
        }
    },
    methods: {
        addData: function() {
            var $this = this;
            if (!$this.sellerid) {
                return;
            }
            this.echarTL();
            this.echarTR();
            this.targetCenter();
        },

        //折线图  以折线图做判断依据 
        echarTL: function() {
            var $this = this;
            $.ajax({
                url: $api.flowLayout1,
                type: "POST",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    thedate: $this.thedate
                },
                success: function(data) {
                    if (data.count != "0") {

                        //有数据，遮罩消失
                        $this.echartShow = false;
                        var chartLeft = echarts.init(document.getElementById('chart-tst'));
                        var line = {
                            color: ['#76A6D3', '#90C177', '#747AB4', '#E4995B', '#E592A2', '#d1b838', '#a16aa3', '#5abcd5',
                                '#bf6d6d', '#6dbf96'
                            ],
                            title: {
                                text: '',
                                x: 'center'
                            },
                            tooltip: {
                                trigger: 'axis',
                                formatter: ''
                            },
                            legend: {
                                data: ['访客数', '浏览量', '新访客数'],
                                bottom: '1%',
                                show: true
                            },
                            grid: {
                                left: '1%',
                                right: '1%',
                                bottom: '10%',
                                top: '5%',
                                containLabel: true
                            },
                            xAxis: [{
                                type: 'category',
                                boundaryGap: true,
                                data: data.date,
                                show: true
                            }],
                            yAxis: [{
                                type: 'value',
                                show: true
                            }],
                            series: [{
                                    name: '访客数',
                                    data: data.v1,
                                    type: 'line',
                                    smooth: true
                                },
                                {
                                    name: '浏览量',
                                    data: data.v2,
                                    type: 'line',
                                    smooth: true
                                },
                                {
                                    name: '新访客数',
                                    data: data.v3,
                                    type: 'line',
                                    smooth: true
                                }
                            ]
                        };
                        chartLeft.setOption(line);
                    } else {

                        //无数据的时候 ,无数据遮罩显示
                        $this.echartShow = !$this.echartShow;

                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            })


        },

        //饼图
        echarTR: function() {
            //右侧环形饼图
            var $this = this;
            $.ajax({
                url: $api.flowLayout2,
                type: "POST",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    begintime: $this.begintime,
                    endtime: $this.endtime
                },
                success: function(data) {
                    var chartRight = echarts.init(document.getElementById('chart-cir'));
                    var pie = {
                        color: ['#90C177', '#E4995B', '#E592A2', '#6DBF96'],
                        title: {
                            text: '',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        legend: {
                            data: data.src,
                            bottom: '1%'
                        },
                        grid: {
                            left: '1%',
                            right: '1%',
                            bottom: '10%',
                            top: '3%',
                            containLabel: true
                        },
                        series: [{
                            name: "UV",
                            type: 'pie',
                            radius: ['40%', '70%'],
                            selectedMode: 'single',
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    formatter: "{b}({d}%)",
                                    position: 'inner',
                                    textStyle: {
                                        color: '#666'
                                    }
                                }
                            },
                            data: data.v1
                        }]
                    };
                    chartRight.setOption(pie);
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },
        targetCenter: function() {
            var $this = this;
            $.ajax({
                url: $api.flowLayout3,
                type: "POST",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    thedate: $this.thedate
                },
                success: function(data) {
                    $this.b5bg = data.b5bg;
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },

        //日期插件去  "-" 处理
        toStr: function(str) {
            var toStr = str.split("-").join("");
            return toStr;
        },
    },
    mounted() {
        var $this = this;
        bus.$on("getDate", function(thedate) {
            $this.thedate = $this.toStr(thedate.startDate) + "," + $this.toStr(thedate.endDate);
            $this.begintime = $this.toStr(thedate.startDate);
            $this.endtime = $this.toStr(thedate.endDate);
        });
    }
});

//下方表格
Vue.component("v-bot-table", {
    template: `
        <div>
            <div class="tab-fill">
                <div class="tab-btn" v-for="(l,index) in fillBtn" :class='{"tab-btn-sel":current==index}' @click="changeClick(index)">{{l.name}}</div>
            </div>
            <div class="b1">
                <div v-if="current==0" class="treasure_wrap_fir">    
                    <div class="search-box">
                        <input id="search-txt" v-model="searchText" type="text" placeholder="输入宝贝ID或者名字">
                        <div id="search-btn" class="search-box-btn" @click="babySearch"></div>
                    </div>
                    <div id="itemContrast" class="btn" @click="dataRay">宝贝数据透视</div>
                    <div id="tit" style="min-height:701px;" class="" data-ids="" data-max="">
                        <table>
                            <tbody>
                                <tr>
                                    <th v-for="l in tableHead" :data-val="l">{{l}}</th>
                                </tr>
                                <template v-for="(p,index) in tableBody">
                                    <tr>
                                        <td class="td-name">
                                            <div class="sub-btn" @click="subTable(index,p.aid)" :class='{"sub-btn-show":p.babySbShow}' :data-val="p.aid"></div>
                                            <div class="td-chk"  @click="checkedSale(p,p.aid,p.checkedBox,p.图片路径,p.标题)" :class='{"td-chk-sel":p.checkedBox==true}' :data-val="p.aid"></div>
                                            <a :href="'https://item.taobao.com/item.htm?id='+p.宝贝ID" target="_blank"><img class="td-img" :src="p.图片路径">
                                                <span :title="p.标题">{{p.标题}}</span>
                                            </a>
                                        </td>
                                        <td>{{p.访客数}}</td>
                                        <td>{{p.浏览量}}</td>
                                        <td>{{p.浏览量比访客数}}</td>
                                        <td>{{p.成交人数}}</td>
                                        <td>{{p.成交金额}}</td>
                                    </tr>
                                    <tr class="sub-tr" v-show="p.subTabShow">
                                        <td colspan="6">
                                            <table class="sub-table">
                                                <tbody>
                                                    <tr v-for="s in p.subTable">
                                                        <td class="td-name">
                                                            <div class="td-gap"></div>
                                                            <div class="td-gap"></div>
                                                            {{s.来源路径}}
                                                        </td>
                                                        <td>{{s.访客数}}</td>
                                                        <td>{{s.浏览量}}</td>
                                                        <td>{{s.浏览量比访客数}}</td>
                                                        <td>{{s.成交人数}}</td>
                                                        <td>{{s.成交金额}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                        <hr>
                        <v-page :count='count' :allpage='allpage' :pageno="pageno" @pn="changepn"></v-page>
                    </div>
                    <v-data-ray v-if="daRay" :sellerid="sellerid" :select-all="selectAll" :time="time"></v-data-ray>
                    <div v-if="treasureShow" class="flow_echart_wrap">
                        <img src="../img/vNodata.png" class="noData" style="margin-top:230px;">
                    </div>
                </div>
                <div v-if="current==1" class="treasure_wrap_fir">
                    <div class="search-box">
                        <input id="search-txt" type="text" v-model="searchComeText" placeholder="输入宝贝ID或者名字">
                        <div id="search-btn" class="search-box-btn" @click="comeSearch"></div>
                    </div>
                    <div id="tit2" style="min-height:701px;" class="" data-ids="" data-max="">
                        <table>
                            <tbody>
                                <tr>
                                    <th v-for="p in tableHead" :data-val="p">{{p}}</th>
                                </tr>
                                <template v-for="(l,index) in tableCome">
                                    <tr>
                                        <td class="td-name">
                                            <div class="sub-btn" @click="comeTable(index)" :class='{"sub-btn-show":l.comeSbShow}' :data-val="l.来源路径"></div>
                                            {{l.来源路径}}
                                        </td>
                                        <td>{{l.访客数}}</td>
                                        <td>{{l.浏览量}}</td>
                                        <td>{{l.浏览量比访客数}}</td>
                                        <td>{{l.成交人数}}</td>
                                        <td>{{l.成交金额}}</td>
                                    </tr>
                                    <tr class="sub-tr" v-show="l.comeShow">
                                        <td colspan="6">
                                            <table class="sub-table">
                                                <tbody>
                                                    <tr v-for="s in l.subTable">
                                                        <td class="td-name">
                                                            <div class="td-gap"></div>
                                                            <a :href="'https://item.taobao.com/item.htm?id='+s.宝贝ID" target="_blank"><img class="td-img" :src="s.图片路径">
                                                                <span :title="s.标题">{{s.标题}}</span>
                                                            </a>
                                                        </td>
                                                        <td>{{s.访客数}}</td>
                                                        <td>{{s.浏览量}}</td>
                                                        <td>{{s.浏览量比访客数}}</td>
                                                        <td>{{s.成交人数}}</td>
                                                        <td>{{s.成交金额}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="treasureShow2" class="flow_echart_wrap">
                        <img src="../img/vNodata.png" class="noData" style="margin-top:230px;">
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            searchText: '', // 搜索宝贝
            searchComeText: '', // 来源搜索宝贝
            time: {
                begintime: '',
                endtime: '',
            },
            thedate: '', //开始时间和结束时间
            current: 0, //宝贝按钮状态
            fillBtn: [{ // 主页大按钮
                name: "宝贝"
            }, {
                name: "来源"
            }],
            tabShow: true, // 宝贝主表格  显示/隐藏
            tableHead: ["宝贝", "访客数", "浏览量", "浏览量/访客数", "成交人数", "成交金额"], //表头数据
            tableBody: [], // 宝贝页主表内容  需要分页

            pageno: 1, // 当前页码
            pagesize: 10, // 分页大小，每页显示多少条
            count: 0, // 总数据量,总数据来源
            allpage: 0, // 总页数
            tableCome: [], // 来源主表内容 不需要分页
            selectAll: [], // 已选择宝贝列表数组
            daRay: false, //对比弹出层关闭
            treasureShow: false, //宝贝页无数据显示
            treasureShow2: false, //来源页无数据显示
        }
    },
    watch: {
        sellerid: function() {
            this.addData();
        },
        thedate: function() {
            this.addData();
        }
    },
    methods: {

        //主执行函数
        addData: function() {
            var $this = this;
            if (!$this.sellerid) {
                return;
            }

            //宝贝主表格执行  来源主表格执行
            this.mostTable();
            this.ComeMTab();
        },

        //点击宝贝和来源按钮
        changeClick: function(i) {
            this.current = i;
        },

        // 宝贝页点击蓝色图标 展示 / 隐藏下方表格
        subTable: function(i, aid) {

            // 先请求接口，再展开下方表格
            this.babySubTab(i, aid);
        },

        //来源页点击蓝色图标 展示 / 隐藏下方表格
        comeTable: function(i) {
            this.comeSubTab(i);
        },

        //宝贝表格前面复选框选中事件
        checkedSale: function(p, aid, check, src, title) {

            //记录选中项,选中则放入数组，  (先是未选中状态)
            if (!p.checkedBox) {

                //如果长度 = 2，则中断函数
                if (this.selectAll.length == 2) {
                    return
                }
                this.selectAll.push({
                    authionId: aid,
                    img: src,
                    name: title,
                    show: true
                });
                p.checkedBox = !p.checkedBox; // 复选框选中
            } else {
                p.checkedBox = !p.checkedBox; // 复选框选中

                //取消选中商品
                for (var i = 0; i < this.selectAll.length; i++) {
                    if (this.selectAll[i].authionId == aid) {
                        this.selectAll.splice(i, 1);
                    }
                }
            }
        },

        //日期插件去  "-" 处理
        toStr: function(str) {
            var toStr = str.split("-").join("");
            return toStr;
        },

        //宝贝主表格内容  ajax请求 tp=2
        mostTable: function() {
            var $this = this;
            $.ajax({
                url: $api.flowBabyMTable,
                type: "POST",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    auctionid: "",
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: "",
                    sortname: "",
                    sorttype: "desc",
                    page: $this.pageno,
                    tp: 2
                },
                success: function(data) {
                    if (data.count != "0") {

                        //有数据，关闭显示面板
                        $this.treasureShow = false;

                        //添加标识字段
                        for (var i = 0; i < data.columns.length; i++) {
                            data.columns[i].subTabShow = false;
                            data.columns[i].babySbShow = false;
                            data.columns[i].checkedBox = false;
                            data.columns[i].subTable = [];

                            //储存状态， 如果之前选中，点击回去后任然选中
                            for (var j = 0; j < $this.selectAll.length; j++) {
                                if ($this.selectAll[j].authionId == data.columns[i].aid) {
                                    data.columns[i].checkedBox = true
                                }
                            }
                        }
                        $this.tableBody = data.columns;
                        $this.count = data.count; //总页数赋值
                        $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                    } else {

                        //如果没数据的情况
                        $this.treasureShow = !$this.treasureShow;
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //接收分页组件页码  ajax请求
        changepn: function(pn) {
            this.pageno = pn;
            var $this = this;
            $.ajax({
                url: $api.flowBabyMTable,
                type: "POST",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    auctionid: "",
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: "",
                    sortname: "",
                    sorttype: "desc",
                    page: $this.pageno,
                    tp: 2
                },
                success: function(data) {
                    if (data.count) {

                        //分页后添加标识字段
                        for (var i = 0; i < data.columns.length; i++) {
                            data.columns[i].subTabShow = false;
                            data.columns[i].babySbShow = false;
                            data.columns[i].checkedBox = false;
                            data.columns[i].subTable = [];

                            //储存状态， 如果之前选中，点击回去后任然选中
                            for (var j = 0; j < $this.selectAll.length; j++) {
                                if ($this.selectAll[j].authionId == data.columns[i].aid) {
                                    data.columns[i].checkedBox = true
                                }
                            }
                        }
                        $this.tableBody = data.columns; // 赋值
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //宝贝弹出表格内容   ajax请求
        babySubTab: function(i, aid) {
            var $this = this;

            // 如果下方表格为打开状态，不执行请求函数，只做状态改变
            if ($this.tableBody[i].subTabShow) {
                $this.tableBody[i].subTabShow = !$this.tableBody[i].subTabShow; // 展示下方表格
                $this.tableBody[i].babySbShow = !$this.tableBody[i].babySbShow; //宝贝表格前面的蓝色按钮加减号来回切换
                return;
            }

            //判断是否请求过，只请求一次，若不需要，则注释该段
            if ($this.tableBody[i].subTable.length != 0) {
                $this.tableBody[i].subTabShow = !$this.tableBody[i].subTabShow; // 展示下方表格
                $this.tableBody[i].babySbShow = !$this.tableBody[i].babySbShow; //宝贝表格前面的蓝色按钮加减号来回切换
                return;
            }
            $.ajax({
                url: $api.flowBabySubTab,
                type: "POST",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    auctionid: aid,
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: "",
                    sortname: "",
                    sorttype: "desc",
                    page: $this.pageno,
                    tp: 3
                },
                success: function(data) {
                    if (data.count) {
                        $this.tableBody[i].subTable = data.column; // 赋值
                        $this.tableBody[i].subTabShow = !$this.tableBody[i].subTabShow; // 展示下方表格
                        $this.tableBody[i].babySbShow = !$this.tableBody[i].babySbShow; //宝贝表格前面的蓝色按钮加减号来回切换
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //来源主表接口   ajax请求
        ComeMTab: function() {
            var $this = this;
            $.ajax({
                url: $api.flowComeMTab,
                type: "POST",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    srcname: "",
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: "",
                    sortname: "",
                    sorttype: "desc",
                    tp: 1
                },
                success: function(data) {
                    if (data.count) {

                        //如果有数据的情况， 关闭面板
                        $this.treasureShow2 = false;

                        // 添加判断标识
                        for (var i = 0; i < data.column.length; i++) {
                            data.column[i].comeShow = false;
                            data.column[i].comeSbShow = false;
                            data.column[i].subTable = [];
                        }
                        $this.tableCome = data.column; // 赋值

                    } else if (data.result == "0") {

                        //如果没数据的情况
                        $this.treasureShow2 = !$this.treasureShow2;
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            })
        },

        //来源下宝贝情况接口 ajax请求
        comeSubTab: function(i) {
            var $this = this;

            // 如果下方表格为打开状态，不执行请求函数，只做状态改变
            if ($this.tableCome[i].comeShow) {
                $this.tableCome[i].comeShow = !$this.tableCome[i].comeShow; // 展示下方表格
                $this.tableCome[i].comeSbShow = !$this.tableCome[i].comeSbShow; //来源表格前面的蓝色按钮加减号来回切换
                return;
            }

            //判断是否请求过，只请求一次，若不需要，则注释该段
            if ($this.tableCome[i].subTable.length != "0") {
                $this.tableCome[i].comeShow = !$this.tableCome[i].comeShow; // 展示下方表格
                $this.tableCome[i].comeSbShow = !$this.tableCome[i].comeSbShow; //来源表格前面的蓝色按钮加减号来回切换
                return;
            }

            $.ajax({
                url: $api.flowComeBaby,
                type: "GET",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    srcname: "直通车",
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: "",
                    sortname: "",
                    sorttype: "",
                    tp: 2
                },
                success: function(data) {
                    if (data.count) {

                        $this.tableCome[i].subTable = data.column;
                        $this.tableCome[i].comeShow = !$this.tableCome[i].comeShow; // 展示下方表格
                        $this.tableCome[i].comeSbShow = !$this.tableCome[i].comeSbShow; //来源表格前面的蓝色按钮加减号来回切换

                    } else if (data.result == "0") {
                        alert("该项无下拉宝贝");
                        return;
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            })
        },

        //宝贝搜索接口  ajax tp=1
        babySearch: function() {
            var $this = this;
            $.ajax({
                url: $api.flowBabyMTable,
                type: "POST",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    auctionid: '',
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: $this.searchText,
                    sortname: '',
                    sorttype: '',
                    page: $this.pageno,
                    tp: 2
                },
                success: function(data) {
                    console.log(data);
                    if (data.count) {

                        //添加标识字段
                        for (var i = 0; i < data.columns.length; i++) {
                            data.columns[i].subTabShow = false;
                            data.columns[i].babySbShow = false;
                            data.columns[i].checkedBox = false;
                            data.columns[i].subTable = [];
                        }
                        $this.tableBody = data.columns;
                        $this.count = data.count; //总页数赋值
                        $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },

        //来源搜索接口
        comeSearch: function() {
            var $this = this;
            $.ajax({
                url: $api.flowComeBaby,
                type: "GET",
                dataType: "json",
                data: {
                    // sellerid: "736522816",
                    // srcname: '直通车',
                    // begintime: "20170219",
                    // endtime: "20170228",
                    sellerid: $this.sellerid,
                    srcname: '直通车',
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: $this.searchComeText,
                    sortname: '',
                    sorttype: '',
                    tp: 2
                },
                success: function(data) {
                    if (data.count) {
                        for (var i = 0; i < $this.tableCome.length; i++) {
                            $this.tableCome[i].subTable = data.column;
                        }
                    } else if (data.result == "0") {

                        alert("该宝贝不存在，请重新搜索");
                        return;
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },

        //点击宝贝数据透视按钮
        dataRay: function() {

            //弹出层显示
            this.daRay = !this.daRay;

            //不足两项宝贝的情况
            if (this.selectAll.length < 2) {
                alert("请选中两项宝贝进行对比！");
                this.daRay = false
                return;
            }
        },
    },
    mounted() {

        // 接收数据
        var $this = this;
        bus.$on("getDate", function(thedate) {

            // 两种时间变化格式
            $this.thedate = $this.toStr(thedate.startDate) + "," + $this.toStr(thedate.endDate);
            $this.time.begintime = $this.toStr(thedate.startDate);
            $this.time.endtime = $this.toStr(thedate.endDate);
        });

        //父子集之间的值传递，接收子集关闭按钮传来的值，关闭弹出框
        bus.$on("sendDaray", function(daRay) {
            $this.daRay = daRay;
        });
    }
});

//弹出对比模块
Vue.component("v-data-ray", {
    template: `
        <div>
            <div class="fixed-box-ray">
                <div class="fixed-content">
                    <div class="fixed-title">
                        <h1>宝贝数据透视</h1>
                        <div class="fixed-voice"></div>
                        <div class="fixed-exit" @click="closeDataRay()">×</div>
                    </div>
                    <div class="fixed-block">
                        <div class="search-box">
                            <input id="itemContrastSearchTxt" v-model="searchCont" type="text" placeholder="搜索宝贝">
                            <div id="itemContrastSearchBtn" class="search-box-btn" @click="searchBtn"></div>
                            <div id="itemContrastSearchList" class="search-box-list">
                                <div v-for="(l,index) in searContent" class="search-box-a" :data-val="l.宝贝ID">
                                    <img class="td-img" :src="l.图片路径">{{l.标题}}
                                </div>
                            </div>
                        </div>
                        <div class="item-box">
                            <table>
                                <tbody>
                                    <tr id="itemContrastList">
                                        <td v-for="(l,index) in selectAll" class="td-name">
                                            <template v-if="l.show">
                                                <img class="td-img" :src="l.img">
                                                <span :title="l.name">{{l.name}}</span>
                                                <div class="item-clear" :data-val="l.authionId" @click="miniBaby(l,l.show)">×</div>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="itemContrastView" style="position: relative; clear: both;" data-message="请选择两个宝贝进行对比（最多两个）">
                            <table>
                                <tbody>
                                    <tr style="height:35px;">
                                        <th colspan="2" rowspan="2">指标</th>
                                        <th style="height:35px;">宝贝1</th>
                                        <th style="height:35px;">宝贝2</th>
                                        <th rowspan="2">宝贝指标对比条</th>
                                    </tr>
                                    <tr style="height:35px;">
                                        <td v-for="l in selectAll" class="td-name">
                                            <img class="contrast-img" :src="l.img" :title="l.name">
                                        </td>
                                    </tr>

                                    <template v-for="l in all">
                                        <tr style="height:35px;">
                                            <td rowspan="3">{{l.name}}</td>
                                            <td>访客数</td>
                                            <td v-for="p in l.car">{{p.visitor}}</td>
                                            <td>
                                                <div class="contrast-bg">
                                                    <span class="contrast-bg-i1" v-bind:style="'width:'+l.line.a+'%'" title="宝贝1访客数:26460占比：51.55%"></span>
                                                    <span class="contrast-bg-i2" v-bind:style="'width:'+l.line.b+'%'" title="宝贝2访客数:24869占比：48.45%"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr style="height:35px;">
                                            <td>浏览量</td>
                                            <td v-for="p in l.car">{{p.pageview}}</td>
                                            <td>
                                                <div class="contrast-bg">
                                                    <span class="contrast-bg-i1" v-bind:style="'width:'+l.line.c+'%'" title="宝贝1浏览量:48840占比：60.85%"></span>
                                                    <span class="contrast-bg-i2" :style="'width:'+l.line.d+'%'" title="宝贝2浏览量:31420占比：39.15%"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr style="height:35px;">
                                            <td>成交人数</td>
                                            <td v-for="p in l.car">{{p.salepeople}}</td>
                                            <td>
                                                <div class="contrast-bg">
                                                    <span class="contrast-bg-i1" v-bind:style="'width:'+l.line.e+'%'" title="宝贝1浏览量:24占比：92.31%"></span>
                                                    <span class="contrast-bg-i2" v-bind:style="'width:'+l.line.f+'%'" title="宝贝2浏览量:2占比：7.69%"></span>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ["sellerid", "selectAll", "time"],
    data: function() {
        return {
            time: {
                begintime: '',
                endtime: '',
            },
            all: [{
                name: "直通车",
                car: [],
                line: {
                    a: '',
                    b: '',
                    c: '',
                    d: '',
                    e: '',
                    f: ''
                }
            }, {
                name: "自然搜索",
                car: [],
                line: {
                    a: '',
                    b: '',
                    c: '',
                    d: '',
                    e: '',
                    f: ''
                }
            }, {
                name: "自主访问",
                car: [],
                line: {
                    a: '',
                    b: '',
                    c: '',
                    d: '',
                    e: '',
                    f: ''
                }
            }, ],
            searchCont: "", //搜索框
            searContent: [], //搜索出的宝贝内容
        }
    },
    created() {
        console.log(this.selectAll)
        this.dataRay();
    },
    methods: {

        //宝贝透视接口请求
        dataRay: function() {
            var $this = this;
            $.ajax({
                url: $api.flowDataRay,
                type: "POST",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    auctionid1: $this.selectAll[0].authionId,
                    auctionid2: $this.selectAll[1].authionId,
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                },
                success: function(data) {
                    if (data.count) {

                        //表格内容添加
                        for (var i = 0; i < data.column.length; i++) {
                            for (var j = 0; j < $this.all.length; j++) {
                                if (data.column[i].comesrc == $this.all[j].name) {
                                    $this.all[j].car.push(data.column[i]);
                                }
                            }
                        }

                        //指标对比条数据
                        $this.all[0].line = data.car;
                        $this.all[1].line = data.nature;
                        $this.all[2].line = data.auto;
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            })
        },

        //搜索宝贝
        searchBtn: function() {
            var $this = this;
            $.ajax({
                url: $api.flowBabySearch,
                type: "GET",
                dataType: "json",
                data: {
                    sellerid: $this.sellerid,
                    begintime: $this.time.begintime,
                    endtime: $this.time.endtime,
                    remark: $this.searchCont
                        // sellerid: "736522816",
                        // begintime: "20170219",
                        // endtime: "20170228",
                        // remark: $this.searchCont
                },
                success: function(data) {
                    if (data.count) {
                        $this.searContent = data.column;
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            })
        },

        //点击取消缩略图宝贝
        miniBaby: function(l) {
            l.show = !l.show;
        },

        //点击关闭
        closeDataRay: function() {
            var daRay = false;
            bus.$emit("sendDaray", daRay);
        }
    }
});