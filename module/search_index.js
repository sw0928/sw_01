//切换平台选择
Vue.component("v-select-plat", {
    template: `
    <div id="fixedMenu" class="r12-10r">
        <div class="fixed-menu-box">
            <div class="fixed-menu-main">
                <div class="filter">
                    <div class="filter-btn" data-val="1" v-for='(li,index) in listdata' :class='{"filter-btn-sel":current==index}' @click='changeCurrent(index)'>{{li.name}}</div>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function() {
        return {
            selectedPT: '',
            current: 1,
            listdata: [{
                name: "全平台",
                value: 0
            }, {
                name: "无线端",
                value: 1
            }, {
                name: "PC端",
                value: 2
            }]
        }
    },
    created() {
        var selectedPT;
        this.selectedPT = this.listdata[this.current].value;
        selectedPT = this.selectedPT;
        setTimeout(() => {
            bus.$emit("choosePT", selectedPT);
        });
    },
    methods: {
        changeCurrent: function(i) {
            this.current = i;
            var selectedPT;
            this.selectedPT = this.listdata[this.current].value;
            selectedPT = this.selectedPT;
            bus.$emit("choosePT", selectedPT);
        }
    }
});


//搜索布局概况
Vue.component("v-search-place", {
    template: `
    <div class="module-title">
        <h1>搜索布局概况</h1>
        <div class="date">
            <div class="date-btn" data-val="30" v-for='(li,index) in datelists' :class='{"date-btn-sel":current==index}' @click='changeDate(index)'>{{li.name}}</div>
        </div>
        <div class='div'>
            <div class="b2">
                <div class="module-tool">
                </div>
                <div id="chartTL" class="chart100">
                </div>
            </div>
            <div class="b2">
                <div class="module-tool">
                </div>
                <div id="chartTR" class="chart100">
                </div>
            </div>
        </div>
    </div>
    
    `,
    props: ["sellerid"],
    created() {
        this.adddata();
    },
    data: function() {
        return {
            platform: 1,
            current: 0,
            datelists: [{
                name: "近7天",
                enddate: this.nowData(1).n,
                startdate: this.nowData(8).m
            }, {
                name: '近30天',
                enddate: this.nowData(1).n,
                startdate: this.nowData(31).m,
            }],
            url: $api.flowshow1,
            urlR: $api.flowtopshow1,
            dataN: '', //内圈数据
            dataW: '', //外圈数据
            dataX: '', //X轴数据
            dataY: '', //Y轴数据
        }
    },
    watch: {
        sellerid: function() {
            this.adddata();
        },
        current: function() {
            this.adddata();
        }
    },
    methods: {
        adddata: function() {
            var $this = this;
            if (!$this.sellerid) {
                return
            }

            //左侧饼图
            this.chartTL();

            //右侧柱状图
            this.chartTR();

        },
        changeDate: function(i) {
            this.current = i
        },

        //全店流量构成
        chartTL: function() {
            var $this = this;
            $.ajax({
                url: $this.url + '?sellerid=' + $this.sellerid + '&platform=' + $this.platform + '&begintime=' + $this.datelists[$this.current].startdate + '&endtime=' + $this.datelists[$this.current].enddate,
                type: "GET",
                dataType: "json",
                async: false,
                success: function(data) {
                    if (data) {

                        //左侧饼图
                        var arr = [],
                            arrR = [],
                            newarrR = [],
                            newarr = [];

                        for (var i = 0; i < data.data.rows.length; i++) {
                            if (!data.data.rows[i][1]) {
                                arr.push(data.data.rows[i]);
                            } else {
                                arrR.push(data.data.rows[i]);
                            }
                        };

                        for (var i = 0; i < arr.length; i++) {
                            newarr.push({
                                name: arr[i][0],
                                value: arr[i][2]
                            });
                        };

                        for (var i = 0; i < arrR.length; i++) {
                            newarrR.push({
                                name: arrR[i][1] + "-" + arrR[i][0],
                                value: arrR[i][2]
                            })
                        };
                        //右侧柱状图
                        $this.dataN = newarr;
                        $this.dataW = newarrR;
                        var myChart = echarts.init(document.getElementById('chartTL'));
                        var option = {
                            title: {
                                text: '全店流量构成',
                                x: 'center',
                                top: '10%'
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: "UV <br/>{b}: {c} ({d}%)"
                            },

                            series: [{
                                name: '访问来源',
                                type: 'pie',
                                selectedMode: 'single',
                                radius: [0, '30%'],
                                label: {
                                    normal: {
                                        position: 'inner'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: $this.dataN
                            }, {
                                type: 'pie',
                                radius: ['40%', '55%'],

                                data: $this.dataW
                            }]
                        };


                        myChart.clear();
                        myChart.setOption(option);
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });
        },

        //流量top5关键词数据
        chartTR: function() {
            var $this = this;
            $.ajax({
                url: $this.urlR + '?sellerid=' + $this.sellerid + '&platform=' + $this.platform + '&begintime=' + $this.datelists[$this.current].startdate + '&endtime=' + $this.datelists[$this.current].enddate,
                type: "GET",
                dataType: "json",
                async: false,
                success: function(data) {
                    var arrX = [],
                        arrY = [];

                    if (data) {
                        for (var i = 0; i < data.data.rows.length; i++) {
                            arrY.push(data.data.rows[i][0]);
                            arrX.push(data.data.rows[i][1]);
                        }
                    };
                    $this.dataX = arrX;
                    $this.dataY = arrY;
                    var myChart = echarts.init(document.getElementById('chartTR'));
                    var option = {
                        title: {
                            text: '流量TOP5关键词数据',
                            x: 'center',
                        },
                        color: ['#3398DB'],

                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis: [{
                            type: 'category',
                            data: $this.dataY,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }],
                        xAxis: [{
                            type: 'value'
                        }],
                        series: [{
                            name: '直接访问',
                            type: 'bar',
                            barWidth: '45%',
                            data: $this.dataX
                        }]
                    };
                    myChart.setOption(option);

                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });

        },

        nowData: function(daynum) {
            var n = new Date().getTime();
            var m = n - 86400000 * daynum;
            return {
                n: this.fdata(n),
                m: this.fdata(m)
            };
        },

        fdata: function(d) {
            var ndate = new Date(d);
            var Y = ndate.getFullYear() + '';
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1);
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
            return Y + M + D;
        }
    },

    mounted() {
        var $this = this;
        bus.$on("choosePT", function(data) {
            $this.platform = data;
            $this.adddata();
        });
    },

});


//搜索指标
Vue.component("v-search-index", {
    template: `
    <div>
        <div class="module-title">
            <h1>搜索指标</h1>
        </div>
        <div class="div main_chart">
            <div id="main" style="width: 100%;height:450px;"></div>
        </div>

        <div class="div" id="indexs">
           

            <div class="b3" v-for='(li,index) in indexData' :class='{"shop-mini-sel":indexCurrent==index}' @click='changeIndex(index)'>
                <div class="shop-mini-left">
                    <div class="shop-mini-title">{{li.name}}</div>
                    <div :id='"chart"+(index+1)' class="shop-mini-chart">
                    </div>
                </div>
                <div class="shop-mini-right">
                    <div class="shop-val-now">
                        <div>{{li.data.value}}</div></div>
                    <div class="shop-val-ago">前30天 ：{{li.data.pre30}}</div>
                    <div class="shop-mini-rate-box">
                        <div class="shop-mini-rate" :class='{"shop-mini-rate-down":li.data.isup<0,"shop-mini-rate-up":li.data.isup>=0}'>月环比<span>{{li.data.average}}</span></div>
                    </div>
                </div>
            </div>
          
           
        </div>

    </div>   
    `,
    data: function() {
        return {
            indexCurrent: 0, //选中的指标索引
            url: $api.getmoney1,
            url2: $api.getvolu1, //折线图数据来源
            platform: 1,
            begintime: this.nowData(31).m,
            endtime: this.nowData(31).n,
            selectedIndex: '', //选中的指标
            indexData: [{ //指标数据
                indexName: "成交金额",
                name: "搜索成交金额",
                data: {
                    value: '',
                    pre30: '',
                    average: '',
                    isup: ''
                },

            }, {
                indexName: "UV",
                name: "搜索UV",
                data: {
                    value: '',
                    pre30: '',
                    average: '',
                    isup: ''
                },

            }, {
                indexName: "支付转化率",
                name: "搜索支付转化率",
                data: {
                    value: '',
                    pre30: '',
                    average: '',
                    isup: ''
                },
            }],

            charts: [{ //成交金额
                x: [], //折线图X轴坐标
                y1: [], //折线图Y轴坐标---全平台
                y2: [], //折线图Y轴坐标---无线端
                y3: [], //折线图Y轴坐标---PC端
            }, { //UV
                x: [], //折线图X轴坐标
                y1: [], //折线图Y轴坐标---全平台
                y2: [], //折线图Y轴坐标---无线端
                y3: [], //折线图Y轴坐标---PC端
            }, { //支付转化率
                x: [], //折线图X轴坐标
                y1: [], //折线图Y轴坐标---全平台
                y2: [], //折线图Y轴坐标---无线端
                y3: [], //折线图Y轴坐标---PC端
            }],



        }
    },
    props: ["sellerid"],
    created() {
        this.selectedIndex = this.indexData[0].indexName;
        setTimeout(() => {
            bus.$emit("searchIndex", this.indexData[0].indexName);
        })

        this.adddata();
        for (var i = 0; i < this.indexData.length; i++) {
            this.addminiData(this.indexData[i].indexName);
        };
        this.chartMain()

    },
    watch: {
        sellerid: function() {
            this.adddata();
            for (var i = 0; i < this.indexData.length; i++) {
                this.addminiData(this.indexData[i].indexName);
            };
            this.chartMain()
        },

        platform: function() {
            this.adddata();
            for (var i = 0; i < this.indexData.length; i++) {
                this.addminiData(this.indexData[i].indexName);
            };
            this.chartMain()
        }
    },

    methods: {
        //获取搜索指标数据
        adddata: function() {
            var $this = this;
            if (!this.sellerid) {
                return
            }

            $.ajax({
                url: $this.url + '?sellerid=' + $this.sellerid + '&platform=' + $this.platform + '&begintime=' + $this.begintime + '&endtime=' + $this.endtime + '&name=&type=1',
                type: "GET",
                dataType: "json",
                async: false,
                success: function(data) {
                    if (data) {
                        for (var i = 0; i < data.data.columns.length; i++) {
                            if (data.data.columns[i] == '昨日成交金额') {
                                $this.indexData[0].data.value = data.data.rows[0][i] + '元'
                            } else if (data.data.columns[i] == '前日成交金额') {
                                $this.indexData[0].data.pre30 = data.data.rows[0][i] + '元'
                            } else if (data.data.columns[i] == '较前日成交金额的占比') {
                                $this.indexData[0].data.average = Math.abs(data.data.rows[0][i]) + '%'
                            } else if (data.data.columns[i] == '较前日成交金额的幅度') {
                                $this.indexData[0].data.isup = data.data.rows[0][i]
                            } else if (data.data.columns[i] == '昨日UV') {
                                $this.indexData[1].data.value = data.data.rows[0][i] + '人'
                            } else if (data.data.columns[i] == '前日UV') {
                                $this.indexData[1].data.pre30 = data.data.rows[0][i] + '人'
                            } else if (data.data.columns[i] == '较前日UV的占比') {
                                $this.indexData[1].data.average = Math.abs(data.data.rows[0][i]) + '%'
                            } else if (data.data.columns[i] == '较前日UV的幅度') {
                                $this.indexData[1].data.isup = data.data.rows[0][i]
                            } else if (data.data.columns[i] == '昨日支付转化率') {
                                $this.indexData[2].data.value = data.data.rows[0][i] + '%'
                            } else if (data.data.columns[i] == '前日支付转化率') {
                                $this.indexData[2].data.pre30 = data.data.rows[0][i] + '%'
                            } else if (data.data.columns[i] == '较前日支付转化率的占比') {
                                $this.indexData[2].data.average = Math.abs(data.data.rows[0][i]) + '%'
                            } else if (data.data.columns[i] == '较前日支付转化率的幅度') {
                                $this.indexData[2].data.isup = data.data.rows[0][i]
                            }
                        }

                    }


                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });
        },

        //获取搜索指标mini图数据
        addminiData: function(indexName) {
            var $this = this;
            if (!this.sellerid) {
                return
            }
            $.ajax({
                url: $this.url2 + '?sellerid=' + $this.sellerid + '&platform=' + $this.platform + '&begintime=' + $this.begintime + '&endtime=' + $this.endtime + '&name=' + indexName + '&type=2',
                type: "GET",
                dataType: "json",
                async: false,
                success: function(data) {
                    if (indexName == "成交金额") {
                        $this.charts[0].x.length = $this.charts[0].y1.length = $this.charts[0].y2.length = $this.charts[0].y3.length = 0;
                        for (var i = 0; i < data.data.rows.length; i++) {
                            if (data.data.rows[i][1] == 0) {
                                $this.charts[0].x.push(data.data.rows[i][0]);
                                $this.charts[0].y1.push(data.data.rows[i][2]);
                            } else if (data.data.rows[i][1] == 1) {
                                $this.charts[0].y2.push(data.data.rows[i][2]);
                            } else if (data.data.rows[i][1] == 2) {
                                $this.charts[0].y3.push(data.data.rows[i][2]);
                            }
                        };
                        $this.chartNum(1)
                    } else if (indexName == "UV") {
                        $this.charts[1].x.length = $this.charts[1].y1.length = $this.charts[1].y2.length = $this.charts[1].y3.length = 0;
                        for (var i = 0; i < data.data.rows.length; i++) {
                            if (data.data.rows[i][1] == 0) {
                                $this.charts[1].x.push(data.data.rows[i][0]);
                                $this.charts[1].y1.push(data.data.rows[i][2]);
                            } else if (data.data.rows[i][1] == 1) {
                                $this.charts[1].y2.push(data.data.rows[i][2]);
                            } else if (data.data.rows[i][1] == 2) {
                                $this.charts[1].y3.push(data.data.rows[i][2]);
                            }
                        };
                        $this.chartNum(2)
                    } else if (indexName == "支付转化率") {
                        $this.charts[2].x.length = $this.charts[2].y1.length = $this.charts[2].y2.length = $this.charts[2].y3.length = 0;
                        for (var i = 0; i < data.data.rows.length; i++) {
                            if (data.data.rows[i][1] == 0) {
                                $this.charts[2].x.push(data.data.rows[i][0]);
                                $this.charts[2].y1.push(data.data.rows[i][2]);
                            } else if (data.data.rows[i][1] == 1) {
                                $this.charts[2].y2.push(data.data.rows[i][2]);
                            } else if (data.data.rows[i][1] == 2) {
                                $this.charts[2].y3.push(data.data.rows[i][2]);
                            }
                        };
                        $this.chartNum(3)
                    };

                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });
        },

        nowData: function(daynum) {
            var n = new Date().getTime();
            var m = n - 86400000 * daynum;
            return {
                n: this.fdata(n),
                m: this.fdata(m)
            };
        },

        fdata: function(d) {
            var ndate = new Date(d);
            var Y = ndate.getFullYear() + '';
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1);
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
            return Y + M + D;
        },

        changeIndex(i) {
            this.indexCurrent = i;
            this.chartMain();
            bus.$emit("searchIndex", this.indexData[this.indexCurrent].indexName);
        },
        //缩略图
        chartNum(num) {
            var $this = this;
            var myChart = echarts.init(document.getElementById('chart' + num));
            --num;
            var option = {
                color: ['#76A6D3', '#90C177', '#E592A2'],
                backgroundColor: '#fff',
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: "5%",
                    containLabel: false
                },
                xAxis: [{
                    type: 'category',
                    data: $this.charts[num].x,
                    show: false
                }],
                yAxis: [{
                    type: 'value',
                    show: false
                }],
                series: [{
                    name: '全平台',
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    data: $this.charts[num].y1,
                    lineStyle: {
                        normal: {
                            type: ($this.platform == 0 ? "solid" : "dotted")
                        }
                    }
                }, {
                    name: '无线端',
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    data: $this.charts[num].y2,
                    lineStyle: {
                        normal: {
                            type: ($this.platform == 1 ? "solid" : "dotted")
                        }
                    }
                }, {
                    name: 'PC端',
                    type: 'line',
                    symbol: 'none',
                    smooth: true,
                    data: $this.charts[num].y3,
                    lineStyle: {
                        normal: {
                            type: ($this.platform == 2 ? "solid" : "dotted")
                        }
                    }
                }]
            };
            myChart.setOption(option);
        },

        //渲染折线图
        chartMain() {
            var $this = this;
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: $this.indexData[$this.indexCurrent].name,
                    subtext: '实线为当前所选平台数据，虚线为其它对比平台数据',
                    itemGap: 20
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['全平台', '无线端', 'PC端'],
                    bottom: 0,
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: $this.charts[$this.indexCurrent].x
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '全平台',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    data: $this.charts[$this.indexCurrent].y1,
                    lineStyle: {
                        normal: {
                            type: ($this.platform == 0 ? "solid" : "dotted")
                        }
                    }
                }, {
                    name: '无线端',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    data: $this.charts[$this.indexCurrent].y2,
                    lineStyle: {
                        normal: {
                            type: ($this.platform == 1 ? "solid" : "dotted")
                        }
                    }
                }, {
                    name: 'PC端',
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    data: $this.charts[$this.indexCurrent].y3,
                    lineStyle: {
                        normal: {
                            type: ($this.platform == 2 ? "solid" : "dotted")
                        }
                    }
                }]
            };
            myChart.setOption(option);
        }

    },

    mounted() {
        var $this = this;
        bus.$on("choosePT", function(data) {
            // console.log(data)
            $this.platform = data;
        });

    }
});

//核心关键词30天数据
Vue.component("v-keywords30", {
    template: `
    <div class="div">
        <div id="tableKeyword" class="b5-3" style=" height:601px;">
            <table>
                <tbody>
                    <tr>
                        <th rowspan="2" style="width: 50px;">排名</th>
                        <th :colspan="tableCell">{{platName[platform]}}</th>
                    </tr>
                    <tr>
                        <th v-for='li in tableColumns'>{{li}}</th>                     
                    </tr>
                    <tr v-for='(li,index) in tableRows'>
                        <td>{{index+1}}</td>
                        <td class="td-name-center" :title='l' v-for='l in li'>{{l}}</td>
                        
                    </tr>
                    
                </tbody>
            </table>
        </div>
        <div class="b5-2">
            
            <div id="chartKeyword" class="chart100" style="height: 570px; -webkit-tap-highlight-color: transparent; user-select: none; position: relative; background: transparent;">

            </div>
        </div>
    </div> 
    `,
    props: ["sellerid"],
    created() {

    },
    data: function() {
        return {
            tableCell: 3,
            platName: ["全平台", "无线端", "PC端"],
            platform: 1,
            indexName: '',
            url: $api.wideshow1,
            url1: $api.wipshow1,
            begintime: this.nowData(31).m,
            endtime: this.nowData(31).n,
            tableColumns: [],
            tableRows: [],
            dataR: [],
        }
    },
    watch: {
        sellerid: function() {
            this.adddata();
            this.chartR();
        },
        platform: function() {
            this.adddata();
            this.chartR();
        },
        indexName: function() {
            this.adddata();
            this.chartR();
        }
    },
    mounted() {
        var $this = this;
        bus.$on("choosePT", function(data) {
            $this.platform = data;

        });
        bus.$on("searchIndex", function(data) {
            $this.indexName = data;
        });

        this.chartR();
    },

    methods: {
        //左侧表格数据加载
        adddata: function() {
            var $this = this;
            if (!this.sellerid) {
                return
            };

            $.ajax({
                url: $this.url + '?sellerid=' + $this.sellerid + '&platform=' + $this.platform + '&begintime=' + $this.begintime + '&endtime=' + $this.endtime + '&name=' + $this.indexName + '&type=2',
                type: "GET",
                dataType: "json",

                success: function(data) {
                    data.data.columns[0] = '关键词';
                    if (data.data.rows[0][2]) {
                        $this.tableCell = 3;
                        for (var i = 0; i < data.data.rows.length; i++) {
                            data.data.rows[i][2] = data.data.rows[i][2] + '%'
                        };
                    } else {
                        $this.tableCell = 2;
                        for (var i = 0; i < data.data.rows.length; i++) {
                            data.data.rows[i][1] = data.data.rows[i][1] + '%'
                        };
                    }


                    $this.tableColumns = data.data.columns;
                    $this.tableRows = data.data.rows;

                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });
        },

        nowData: function(daynum) {
            var n = new Date().getTime();
            var m = n - 86400000 * daynum;
            return {
                n: this.fdata(n),
                m: this.fdata(m)
            };
        },

        fdata: function(d) {
            var ndate = new Date(d);
            var Y = ndate.getFullYear() + '';
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1);
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
            return Y + M + D;
        },

        //右侧饼图加载
        chartR() {
            var $this = this;
            if (!this.sellerid) {
                return
            };
            $.ajax({
                url: $this.url1 + '?sellerid=' + $this.sellerid + '&platform=' + $this.platform + '&begintime=' + $this.begintime + '&endtime=' + $this.endtime + '&name=' + $this.indexName + '&type=2',
                type: "GET",
                dataType: "json",

                success: function(data) {
                    var newarr = [];
                    for (var i = 0; i < data.data.rows.length; i++) {
                        newarr.push({
                            name: data.data.rows[i][0],
                            value: data.data.rows[i][1]
                        })
                    };
                    $this.dataR = newarr;
                    var myChart = echarts.init(document.getElementById('chartKeyword'));
                    var option = {
                        title: {
                            text: $this.platName[$this.platform] + '-' + $this.indexName,
                            x: 'center',
                            top: '20%'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },

                        series: [{
                            name: $this.indexName,
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: $this.dataR,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);

                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });

        },

    }

})