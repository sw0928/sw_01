/**
 * 2017/09/26
 * 刘俊
 * 客群定位-用户来源
 */

// 日期 和 平台选择组件
Vue.component("v-client-nav", {
    template: `
        <div id="fixedMenu" class="r12-10r">
            <div class="fixed-menu-box">
                <div class="fixed-menu-main">
                    <div class="filter">
                        <div v-for="(l,index) in filterData" class="filter-btn" :class="{'filter-btn-sel':filCurrent==index}" :data-val="l.val" @click="filterChange(index)">{{l.name}}</div>
                    </div>
                    <div class="date">
                        <div v-for="(p,index) in dateData" class="date-btn" :class="{'date-btn-sel':dateCurrent==index}" :data-val="p.val" @click="dateChange(index,p.val)">{{p.name}}</div>
                        <div class="date-more fr" v-show="dateShow">
                            <input type="text" id="date_start" value="" class="date-txt" readonly="readonly" placeholder="开始时间">
                            <div class="date-gap">-</div>
                            <input type="text" id="date_end" class="date-txt" readonly="readonly" placeholder="结束时间">
                            <div id="date-btn" class="date-more-btn" @click="dateMore">确定</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            filCurrent: 0, // 左侧索引
            dateCurrent: 1, // 右侧索引
            dateShow: false, //自定义时间显示块

            //未点击确定的时候，左侧按钮是无法点击的
            dateSure: false, //标记开关---右侧日期确定按钮是否点击
            updata: {
                platform: '',
                timeIndex: '',
                setDate: ''
            }, //传递下去的值
            //左侧数据
            filterData: [{
                name: '全平台',
                val: 0
            }, {
                name: '无线端',
                val: 1
            }, {
                name: 'PC端',
                val: 2
            }],
            //右侧时间选择
            dateData: [{
                name: '昨天',
                val: 1,
                begintime: changeDate2(1), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                name: '近七天',
                val: 7,
                begintime: changeDate2(7), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                name: '近30天',
                val: 30,
                begintime: changeDate2(30), //开始时间
                endtime: changeDate2(1), //结束时间
            }, {
                name: '自定义',
                val: 0,
                begintime: '',
                endtime: ''
            }],
        }
    },
    created() {},
    methods: {

        //左侧平台点击事件
        filterChange: function(i) {
            this.filCurrent = i;

            // 声明变量
            var updata = {
                platform: '',
                timeIndex: '',
                setDate: ''
            }

            //将两边的索引传递到父组件上
            this.updata.platform = this.filterData[this.filCurrent].val;

            // 判断是否点击了自定义，自动选择日期
            if (this.dateCurrent != 3) { // 未点击自定义项

                this.updata.timeIndex = this.dateCurrent; // 传递当前索引即可

            } else { //点击了自定义项

                //如果未点击确定，左侧按钮无法点击
                if (!this.dateSure) {
                    alert("请确定选择日期");
                    return;
                }

                //点击确定后，日期已经带过去，直接传递索引即可
                this.updata.timeIndex = this.dateCurrent;
            }
            updata = this.updata;

            // 平台选择参数----触发器传递
            bus.$emit("clientPlat", updata);
        },

        // 右侧日期 选项卡点击切换事件
        dateChange: function(i, val) {

            this.dateCurrent = i; // 选项卡效果
            this.dateSure = false; // 点击右侧其他，开关关闭

            //点击自定义，则打开选择时间面板, 点击其他，面板消失
            if (i == 3) {

                this.dateShow = true; // 日期面板展示

                //开始时间实例化
                laydate.render({
                    elem: '#date_start'
                });

                //结束时间实例化
                laydate.render({
                    elem: '#date_end'
                });

                //未点击自定义
            } else {
                this.dateShow = false; // 日期面板不展示

                // 点击其他日期选项卡的时候，清空两个日期输入框
                $("#date_start").val("");
                $("#date_end").val("");

                //把日期索引通过出发器传递过去 // 声明变量
                var updata = {
                    platform: '',
                    timeIndex: '',
                    setDate: ''
                }
                this.updata.platform = this.filterData[this.filCurrent].val; //平台索引
                this.updata.timeIndex = this.dateCurrent; // 传递当前索引即可
                updata = this.updata;

                // 平台选择参数----触发器传递
                bus.$emit("clientPlat", updata);
            }
        },

        //点击确定
        dateMore: function() {

            //日期选择框不能为空
            if ($("#date_start").val() == "" || $("#date_end").val() == "") {
                alert("请选择日期");
                return;
            }

            //开始日期不能大于结束日期
            var start = Number(this.toStr($("#date_start").val())); // 开始时间
            var end = Number(this.toStr($("#date_end").val())); // 结束时间

            if (start > end) {
                alert("起始时间不能大于结束时间！");
                return;
            }

            this.dateSure = true; // 开关打开,表示点击了确定按钮,并且给 开始时间和结束时间赋值
            this.dateData[this.dateCurrent].begintime = this.toStr($("#date_start").val());
            this.dateData[this.dateCurrent].endtime = this.toStr($("#date_end").val());

            // 声明变量
            var updata = {
                platform: '',
                timeIndex: '',
                setDate: ''
            }
            this.updata.platform = this.filterData[this.filCurrent].val;
            this.updata.timeIndex = 3;
            this.updata.setDate = this.dateData[this.dateCurrent];
            updata = this.updata;

            // 平台选择参数----触发器传递
            bus.$emit("clientPlat", updata);
        },

        //日期插件去  "-" 处理
        toStr: function(str) {
            var toStr = str.split("-").join("");
            return toStr;
        },
    },
    mounted() {}
});

//主组件---------搜索和选项卡组件
Vue.component("v-client-cont", {
    template: `
        <div>
            <div class="search">
                <input id="search-txt" type="text" @click="searchPro()" v-model="searchText">
                <span class="search-btn-icon" @click="searchBtn()"></span>
                <div class="search-list" v-show="searchShow" @mouseover="showPro()" @mouseout="hiddenPro()">
                    <div v-for="l in search.moreData" :data-id="l.authionID" @click="proClick(l)">
                        <img class="td-img" :src="l.auPic">   
                        <span>{{l.authionName}}</span>
                    </div>
                </div>
            </div>
            <div class="item" v-for="p in search.searchOne">
                <img class="td-img" :src="p.auPic"><span>{{p.authionName}}</span>
            </div>
            <div class="tab">
                <a class="tab-btn" v-for="(l,index) in btnData" :class="{'tab-btn-sel':tabCurrent==index}" @click="changeModule(index)">{{l.name}}</a>
            </div>
            <hr/>
            <div id="client_cont">
                <!-- 宝贝来源组件 -->
                <v-treasure-src v-if="tabCurrent==0"></v-treasure-src>

                <!-- 搜索标题组件 -->
                <v-search-title v-if="tabCurrent==1"></v-search-title>

                <!-- 宝贝购买组件 -->
                <v-treasure-buy v-if="tabCurrent==2" :trea-tab-data="treaTabData"></v-treasure-buy>

                <!-- 客户访问组件 -->
                <v-client-visit v-if="tabCurrent==3" :search="search"></v-client-visit>
            </div>
        </div>
    `,
    props: ["treaTabData", "search"],
    data: function() {
        return {
            searchShow: false, // 搜索框下方宝贝图片是否显示
            searchText: '请输入商品ID或名称进行搜索', // 搜索框内容双向绑定
            tabCurrent: 0, // 选项卡选中状态
            btnData: [{ // 选项卡数据
                name: '宝贝来源渠道'
            }, {
                name: '搜索标题分析'
            }, {
                name: '宝贝购买明细'
            }, {
                name: '客户访问路径'
            }]
        }
    },
    methods: {

        //搜索框聚焦 弹出框出现
        searchPro: function() {
            if (!this.searchShow) {
                this.searchShow = !this.searchShow;
            }
        },

        //点击当前的商品图片 ，点击过后，商品面板消失
        proClick: function(l) {

            //将点击的商品数据赋值给 search.searchOne[0]，更改下方图片
            this.search.searchOne[0] = l;
            bus.$emit("changeAid", l);
            if (this.searchShow) {
                this.searchShow = !this.searchShow;
            }
        },

        //鼠标移入弹出商品面板， 面板显示
        showPro: function() {
            this.searchShow = true;
        },

        //鼠标移出弹出商品面板， 面板隐藏
        hiddenPro: function() {
            this.searchShow = false;
        },

        //点击搜索框后面的搜索按钮
        searchBtn: function() {
            var text = this.searchText;

            // 传递模糊查询的参数
            bus.$emit("searchCon", text);
            this.searchShow = false;
        },

        // tab选项卡点击
        changeModule: function(i) {
            this.tabCurrent = i;

            //点击过后将索引值传递到父组件
            bus.$emit("tabCut", i);
        }
    },
    mounted() {}
});


/*
 *第一模块
 *宝贝来源渠道主组件
 */
Vue.component("v-treasure-src", {
    template: `
    <div class="one">

        <!--饼图组件-->
        <v-echart-circle></v-echart-circle>

        <!--指标表格组件-->
        <v-target-tab></v-target-tab>
        
    </div>
    `,
    props: [],
    mounted() {}
});

//宝贝来源渠道饼图组件
Vue.component("v-echart-circle", {
    template: `
        <div>
            <div class="module-title">
                <h1>来源统计占比图</h1>
                <div class="module-title-tip">
                    <div class="module-title-tip-text">
                        点击饼图项进行来源下钻，点击已选中的饼图项返回全部来源
                    </div>
                </div>
            </div>
            <div class="client-echart clearfix">
                <div class="center_echart clearfix" style="height:450px;" id="center_echart"></div>
                <div v-if="echartShow" class="noData_wrap">
                    <img src="../img/vNodata.png" class="noData">
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            farData: [], //饼图内侧父集数据
            sonData: [], //饼图外侧子集数据
            auction_id: '', //商品id
            platform: 0, // 平台选择参数
            timeIndex: 1, //右侧日期选择参数
            echartShow: false, //无数据面板默认不显示
            dateSection: '', //时间区间，自定义项选中后的日期参数，用于监听
        }
    },
    watch: {

        //监听 auction_id ，有变化，则执行函数
        auction_id: function() {
            this.echarT();
        },

        //监听平台选中项
        platform: function() {
            this.echarT();
        },

        //监听日期变化
        timeIndex: function() {

            //如果是点击了自定义，则利用具体时间监听
            if (this.timeIndex == 3) {
                return;
            }
            this.echarT();
        },

        //监听点击了自定义后，具体的时间区间
        dateSection: function() {
            this.echarT();
        }
    },
    methods: {

        //饼图请求接口
        echarT: function() {
            var $this = this;

            var chartRate = echarts.init(document.getElementById('center_echart'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)",
                },
                title: {
                    text: '来源占比',
                    x: 'center'
                },
                series: [{
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '45%'],
                        selectedMode: 'single', //选中模式
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'inner',
                                formatter: "{b}({d}%)"
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: $this.farData
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['55%', '75%'],
                        selectedMode: 'single',
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                formatter: "{b}({d}%)",
                            }
                        },
                        data: $this.sonData
                    }
                ]
            };
            chartRate.setOption(option);
        },
    },
    mounted() {
        var $this = this;

        // 接收饼图请求的数据，接收authion__id,分批处理
        bus.$on("echart_Data", function(echart) {

            //清空数据，防止数据重复叠加
            $this.farData = [];
            $this.sonData = [];

            //无数据的情况，面板显示
            if (echart.echartShow == true) {
                $this.echartShow = echart.echartShow; // 无数据面板显示
            } else {

                //有数据的情况
                for (var k = 0; k < echart.echarts.farData.length; k++) {
                    $this.farData.push(echart.echarts.farData[k]);
                }
                for (var l = 0; l < echart.echarts.sonData.length; l++) {
                    $this.sonData.push(echart.echarts.sonData[l]);
                }
                $this.echartShow = echart.echartShow; // 无数据面板不显示
                $this.auction_id = echart.auction_id; // auction_id赋值，用于监听数据
                $this.platform = echart.platform; // 用来监听平台是否发生变化
                $this.timeIndex = echart.timeIndex; // 用来监听日期选项是否发生变化(未点击自定义)
                $this.dateSection = echart.dateSection; // 用来监听时间区间是否发生变化(选中自定义)
            }
        });
    }
});

//宝贝来源渠道指标表格组件
Vue.component("v-target-tab", {
    template: `
        <div>
            <div class="clearfix">
                <div id="table-title" class="module-title fl">
                    <h1>{{tName}}</h1>
                    <p>共有<span>{{count}}</span>个来源入店</p>
                </div>
                <div class="module-tool">
                    <div class="module-tool-more"><span>指标</span>
                        <div id="index-list" data-flow="1,2,3" data-pf="1" class="module-tool-box">
                            <div class="module-tool-flow">
                                流量类型：
                                <label v-for="(l,index) in flowType" class="fr" style="margin-right:12px;">
                                    <div class="select_box" @click="selectItem(index)" :class="{selected:l.selected}"></div>{{l.name}}
                                </label>
                            </div>
                            <div class="module-tool-chk-box">
                                <label v-for="(p,index) in targetData" v-if="p.isShow">
                                    <div class="select_box" @click="select(index)" :class="{selected:p.select}"></div>{{p.tarCont}}
                                </label>
                            </div>
                            <div class="module-tool-tip">
                                已选择<span>5</span>个（注：每次最多选择8个指标）</div>
                            <div class="module-tool-table" @click="makeTable()">生成列表</div>
                        </div>
                    </div>
                    <div class="module-download" @click="download(tName)">下载</div>
                </div>
            </div>
            <div id="client_table_wrap">
                <div id="client_table" v-if="noDataShow">
                    <table>
                        <tbody>
                            <tr class="column">
                                <th v-for="(l,index) in tableDate.columns" :data-val="l" :title="l">{{l}}</th>
                            </tr>
                            <tr v-for="p in tableDate.rows">
                                <td class="td-name"><span :title="p[0]">{{p[0]}}</span></td>
                                <td v-for="(td,index) in p" v-if="index!=0">{{td}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="display:none;">
                        <table id="cli_fir_tab">
                            <tbody>
                                <tr class="column">
                                    <th v-for="(l,index) in downLoadFir.columns" :data-val="l" :title="l">{{l}}</th>
                                </tr>
                                <tr v-for="p in downLoadFir.rows">
                                    <td class="td-name"><span :title="p[0]">{{p[0]}}</span></td>
                                    <td v-for="(td,index) in p" v-if="index!=0">{{td}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-if="!noDataShow" class="client_nodata">
                    <img src="../img/vNodata.png" class="noData_img" alt="">
                </div>
                <v-page :count='count' :allpage='allpage' :pageno="pageno" @pn="changepn" v-if="pageShow"></v-page>
            </div>
        </div>
    `,
    props: [],
    data: function() {
        return {
            flowType: [{
                name: "规模与趋势",
                selected: true
            }, {
                name: "效率与质量",
                selected: true
            }, {
                name: "结果与价值",
                selected: true
            }], //流量类型数据
            targetData: '', // 指标展示数据
            tName: '', //表格大标题名称
            tableDate: {
                columns: '',
                rows: ''
            }, //表格数据
            pageno: 1, //当前页码
            pagesize: 10, //分页大小，每页显示多少条
            count: 0, //总数据量,总数据来源
            allpage: 0, //总页数
            noDataShow: true, //表格是否显示
            pageShow: true, //分页是否显示
            downLoadFir: { //下载表格数据（全部）
                columns: [],
                rows: [],
            }, //下载表格数据
        }
    },
    methods: {

        //指标流量类型点击，（上方三个分类）
        selectItem: function(i) {

            //点击来回切换
            this.flowType[i].selected = !this.flowType[i].selected;

            //点击的时候判断下方数据的分类索引是否跟上面一致,来显示隐藏
            for (var j = 0; j < this.targetData.length; j++) {
                if (this.targetData[j].tarList == (i + 1)) {
                    this.targetData[j].isShow = !this.targetData[j].isShow;
                }
            }
        },

        //点击指标内容 （下方内容）
        select: function(l) {
            this.targetData[l].select = !this.targetData[l].select; //点击选中项来回切换
        },

        //点击生成列表
        makeTable: function() {
            var $this = this;
            var tabParams = {
                tableArr: [], //指标数组
                tName: $this.tName //表格标题名称
            }

            // 先查询显示的指标 然后找到选中项
            for (var i = 0; i < this.targetData.length; i++) {
                if (this.targetData[i].isShow == true && this.targetData[i].select == true) {
                    tabParams.tableArr.push(this.targetData[i].tarCont);
                }
            }

            //如果指标一个都没选中，表格不展示，则阻止执行
            if (tabParams.tableArr.length == 0 || !$this.noDataShow) {
                return;
            }

            //触发器传递 ,点击生成列表后的参数，再次请求表格接口
            bus.$emit("makeTable", tabParams);

        },

        //来源列表 和 关键词列表 接收分页组件页码
        changepn: function(pn) {

            //触发器传递---当前页码
            bus.$emit("changepn", pn);
        },

        //下载表格
        download: function(tName) {

            if (tName == "来源列表") {
                inputExcel("#cli_fir_tab", tName + ".xls");
            } else if (tName == "关键词列表") {
                inputExcel("#cli_fir_tab", tName + ".xls");
            }
        }


    },
    mounted() {

        var $this = this;

        //指标参数--触发器接收
        bus.$on("gatTarget", function(target) {

            //指标赋值
            $this.targetData = target;

            //点击刷新之后，让所有的再次选上
            for (var i = 0; i < $this.flowType.length; i++) {
                $this.flowType[i].selected = true;
            }
        });

        //表格数据 ---触发器接收
        bus.$on("getTable", function(table) {

            $this.tableDate.columns = table.tableDate.columns; // 表格 th 所需数据
            $this.tableDate.rows = table.tableDate.rows; // 表格 td 所需数据
            $this.tName = table.tableDate.tName; //表格大标题赋值
            $this.pageno = table.tableDate.pageno;
            $this.count = table.tableDate.count; //总条数
            $this.allpage = table.tableDate.allpage; //计算总页数
            $this.noDataShow = table.tableDate.dataShow; //无数据面板是否显示
            $this.pageShow = table.tableDate.dataShow; //分页是否显示
        });

        //下载表格--触发器接收 宝贝来源渠道 和 搜索标题分析的表格
        bus.$on("getFirDpwn", function(table) {
            console.log(table);
            $this.downLoadFir.columns = table.downLoadFir.columns; // 表格 th 所需数据
            $this.downLoadFir.rows = table.downLoadFir.rows; // 表格 td 所需数据
        });


    }
});


/*
 *第二模块
 *搜索标题分析组件
 */
Vue.component("v-search-title", {
    template: `
        <div class="two">
        
            <!--标题效果分析-->
            <v-title-effect></v-title-effect>

            <!--推荐关键词-->
            <v-keyword></v-keyword>
            
            <!--关键词列表-->
            <v-target-tab></v-target-tab>
        </div>
    `,
});

//搜索标题分析-标题效果分析组件(彩色的字)
Vue.component("v-title-effect", {
    template: `
        <div style="margin-bottom:20px;">
            <div class="module-title">
                <h1>标题效果分析</h1>
            </div>
            <div id="titleBox" class="title-box" v-if="tipShow">
                <div class="clearfix" v-for="(l,index) in titleEffect">
                    <p>{{l.name}}</p>
                    <div class="title-info" v-html="l.cont" title=""></div>
                    <div class="title-tip">
                        <span class="color-block" style="color: #ffc97a; width: auto;">{{l.before}}</span>
                        <span class="color-block" style="background-color: #ffc97a;"></span>
                        <span class="color-block" style="background-color: #ffa45c;"></span>
                        <span class="color-block" style="background-color: #ff763d;"></span>
                        <span class="color-block" style="background-color: #ff401e;"></span>
                        <span class="color-block" style="background-color: #ff0000;"></span>
                        <span class="color-block" style="color: #ff0000; width: auto;">{{l.after}}</span>
                    </div>
                </div>
            </div>
            <div v-show="!tipShow" id="tip" style="width: 100%; line-height: 200px; text-align: center; font-size: 20px; clear: both;">该宝贝暂无标题效果分析</div>
        </div>
    `,
    data: function() {
        return {
            titleEffect: [{
                name: "引流词效果",
                before: "流量小",
                after: "流量大",
                cont: ""
            }, {
                name: "成交词效果",
                before: "成交小",
                after: "成交大",
                cont: ""
            }], //标题数据
            tipShow: true, //无数据面板是否显示
        }
    },
    mounted() {
        var $this = this;

        //接收彩色字请求
        bus.$on("colorFon", function(colorFont) {
            if (colorFont.pos.indexOf("UV") > -1) {
                $this.titleEffect[0].cont = colorFont.data;
            }
            if (colorFont.pos.indexOf("成交金额") > -1) {
                $this.titleEffect[1].cont = colorFont.data;
            }
        });
    }
});

//搜索标题分析-推荐关键词组件（十个框框）
Vue.component("v-keyword", {
    template: `
        <div style="margin-bottom:20px;">
            <div class="clearfix">
                <div class="module-title fl">
                    <h1>推荐关键词</h1>
                    <p id="recommend-tip"></p>
                    <div class="module-title-tip">
                        <div class="module-title-tip-text">
                            推荐关键词根据当前类目关键词近7天数据进行算法得出
                        </div>
                    </div>
                </div>
                <div class="module-tool" id="recommendBtn">
                    <template v-for="(l,index) in keyWordBtn">
                        <span class="cliSearchBtn" v-bind:style="{background:l.bgColor}"></span>
                        <div class="module-btn" :class="{'module-btn-sel':btnCurrent==index}" @click="changeKey(l,index)" :data-val="l.name">{{l.name}}</div>
                    </template>
                </div>
            </div>
            <div class="clearfix" id="recommend" v-show="tipShow">
                <div class="b5" v-for="(l,index) in keyWordCon">
                    <p class="recommend-keyword" :title="l.keyWord">
                        <img v-if="index<3" alt="" src="../img/666.png">{{l.keyWord}}
                    </p>
                    <span v-bind:style="{width:l.enter+'%'}" class="recommend-view"></span>
                    <span v-bind:style="{width:l.bargin+'%'}" class="recommend-trade"></span>
                </div>
            </div>
            <div v-show="!tipShow" id="tip" style="width: 100%; line-height: 200px; text-align: center; font-size: 20px; clear: both;">该宝贝类目不属于淘宝重点类目，暂不推荐关键词，如有需要，请联系客服</div>
        </div>
    `,
    data: function() {
        return {
            tipShow: true, //推荐关键词无数据显示
            btnCurrent: 0, //关键词选中项索引
            keyWordBtn: [{
                name: "流量规模",
                type: "入店",
                bgColor: "#db8d9b"
            }, {
                name: "成交效能",
                type: "成交",
                bgColor: "#76A6D3"
            }], //关键词按钮数据
            keyWordCon: '', //关键词内容数据
        }
    },
    created() {

    },
    methods: {

        //点击切换关键词
        changeKey: function(l, i) {
            this.btnCurrent = i;

            //点击关键词按钮，触发器传递选中项
            bus.$emit("lType", l);
        }
    },
    mounted() {
        var $this = this;

        //关键词内容数据 -----触发器接收
        bus.$on("creKey", function(creKeyWord) {
            $this.keyWordCon = creKeyWord.keyWord;
            $this.tipShow = creKeyWord.tipShow; //无数据面板是否显示
        });
    }
});


/*
 *第三模块
 *宝贝购买明细组件   
 */
Vue.component("v-treasure-buy", {
    template: `
        <div>
            <div class="clearfix">
                <div id="table-title" class="module-title fl">
                    <h1>{{treaTabData.title}}</h1>
                    <p>共找到<span>{{treaTabData.count}}</span>单</p>
                </div>
                <div class="module-tool" v-if="downLoad">
                    <div class="module-download">下载</div>
                </div>
            </div>
            <div id="treasureTabBox">
                <div style="min-height:551px;margin-top:10px;">
                    <table v-if="treaTabData.noDataShow">
                        <thead>
                            <tr>
                                <th v-for="l in treaTabData.thead">{{l}}</th>
                            </tr>
                        </thead>
                        <tbody id="treaTbody">
                            <tr v-for="(rows,index) in treaTabData.tbody">
                                <td v-for="tab in rows">{{tab}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="!treaTabData.noDataShow" class="client_nodata">
                        <img src="../img/vNodata.png" class="noData_img" alt="">
                    </div>
                </div>
                <v-page :count='treaTabData.count' :allpage='treaTabData.allpage' :pageno="treaTabData.pageno" @pn="changepn" v-if="treaTabData.pageShow"></v-page>
            </div>
        </div>
    `,
    props: ["downLoad", "treaTabData"],
    data: function() {
        return {}
    },
    methods: {

        //接收分页组件代码
        changepn: function(pn) {
            // this.treaTabData.pageno = pn;

            //触发器传递页码
            bus.$emit("treaPage", pn);
        }
    },
    mounted() {}
});


/*
 *第四模块
 *客户访问路径组件
 */
Vue.component("v-client-visit", {
    template: `
        <div>
            <div class="clearfix">
                <div id="table-title" class="module-title fl">
                    <h1>页面路径分析</h1>
                </div>
                <div class="module-tool" style=" line-height:26px;">
                    访问量小<img alt="" src="../img/tipbar.png" style="vertical-align: middle; padding:0 5px;">访问量大
                </div>
            </div>
            <div id="pathBox" class="clearfix">
                <div class="path-box">
                    <div class="path-block-center" v-for="l in search.searchOne">
                        <img class="td-img" :src="l.auPic">
                        <a class="path-block-txt" href="" :data-id="l.authionID">{{l.authionName}}</a>
                    </div>
                    <div id="path-list">
                        <template v-for="(l,index) in pathData.left">
                            <div class="path-block" :style="{top:l.topPos , left: 0}">{{l.auction_picture == "" ? l.Page : ""}}
                                <img class="td-img" :src="l.auction_picture" v-if="l.auction_picture">
                                <a class="path-block-txt" target="_blank" href="" v-if="l.auction_picture">{{l.auction_name}}</a>
                            </div>
                        </template>
                        <template v-for="(p,index) in pathData.right">
                            <div class="path-block" :style="{top:p.topPos,left: 735+'px'}">{{p.auction_picture == "" ? p.Page : ""}}
                                <img class="td-img" :src="p.auction_picture" v-if="p.auction_picture">
                                <a class="path-block-txt" target="_blank" href="" v-if="p.auction_picture">{{p.auction_name}}</a>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ["search"],
    data: function() {
        return {
            pathData: {
                left: '',
                right: ''
            }, //页面路径数据
        }
    },
    created() {},
    mounted() {
        var $this = this;

        //接收页面路径的数据
        bus.$on("path", function(pathData) {
            $this.pathData.left = pathData.left;
            $this.pathData.right = pathData.right;
        });

        // 接收点击了最上方小图片的ID
        bus.$on("changeAid", function(l) {
            console.log(l);
        })
    }
});