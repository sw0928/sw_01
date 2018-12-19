/**
 * 刘俊
 * 2017/09/29
 * 客群定位，地理分析模块
 */

//全国地图模块
Vue.component("v-china-map", {
    template: `
        <div style="margin-bottom:20px;">
            <div class="clearfix">
                <div class="module-title fl">
                    <h1>全国流量成交分布</h1>
                    <div class="module-title-tip">
                        <div class="module-title-tip-text">
                            可在右侧下拉框选择指标
                        </div>
                    </div>
                </div>
                <div class="module-tool">
                    <div class="module-select">
                        <span id="keyword">{{geogra.selectGeo}}</span>
                        <ul class="module-select-cont">
                            <li data-val="0" v-for="(l,index) in geogra.btnData" @click="changePlat(l)">{{l}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="echartMap" class="clearfix"></div>
        </div>
     `,
    data: function() {
        return {
            geogra: {
                selectGeo: "UV", //地图右侧按钮选中项
                btnData: ["UV", "成交人数"], //地图右侧按钮内容
            },
            clickBtn: false, //是否点击了右侧的按钮
            geoCoordMap: '', //坐标内容
            SHData: '', //地方能量值
            cirBig: 300, //地图坐标散点比例值
            centerCity: '', //中心城市
            platform: 0, //平台
        }
    },
    created() {
        var $this = this;

        //接收头部日期参数
        bus.$on("clientPlat", function(updata) {
            console.log(updata);

            $this.geogra.btnData = []; //清空数据
            if ($this.platform != updata.platform) { //点击左侧平台

                //根据平台显示不同内容，给右侧按钮赋值
                if (updata.platform == "0") {
                    $this.geogra.btnData.push("UV", "成交人数");
                    $this.geogra.selectGeo = "UV";
                } else if (updata.platform == "1") {
                    $this.geogra.btnData.push("无线端UV", "无线端成交人数");
                    $this.geogra.selectGeo = "无线端UV";
                } else if (updata.platform == "2") {
                    $this.geogra.btnData.push("PC端UV", "PC端成交人数");
                    $this.geogra.selectGeo = "PC端UV";
                }
            } else { //点击右侧日期

                //根据平台显示不同内容，给右侧按钮赋值
                if (updata.platform == "0") {
                    $this.geogra.btnData.push("UV", "成交人数");
                } else if (updata.platform == "1") {
                    $this.geogra.btnData.push("无线端UV", "无线端成交人数");
                } else if (updata.platform == "2") {
                    $this.geogra.btnData.push("PC端UV", "PC端成交人数");
                }
            }
            $this.platform = updata.platform;
        });

        //接收地图数据
        bus.$on("geograAllData", function(updata) {
            $this.SHData = []; //清空数据
            $this.geoCoordMap = updata.coord; //坐标赋值
            $this.SHData = updata.energy; //能量区域赋值
            $this.centerCity = updata.centerCity; //中心城市赋值

            //根据日期选中项，给 $this.cirBig 赋不同的值
            if (updata.rightDate == 0) { //昨天
                $this.cirBig = 10;
            } else if (updata.rightDate == 1) { //近七天
                $this.cirBig = 30;
            } else if (updata.rightDate == 2) { //近30天
                $this.cirBig = 100;
            } else { //自定义
                $this.cirBig = 100;
            }
            $this.map();
        });
    },
    methods: {

        //地图实例化
        map: function() {
            var $this = this;
            var convertData = function(data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var fromCoord = $this.geoCoordMap[dataItem[0].name];
                    var toCoord = $this.geoCoordMap[dataItem[1].name];
                    if (fromCoord && toCoord) {
                        res.push([{
                            coord: fromCoord
                        }, {
                            coord: toCoord
                        }]);
                    }
                }
                return res;
            };
            var color = ['#ffa022', '#a6c84c', '#46bee9'];
            var myChart = echarts.init(document.getElementById('echartMap'));
            var series = [];
            [
                [$this.centerCity, $this.SHData]

            ].forEach(function(item, i) {

                // type:'lines', 用于带有起点和终点信息的线数据的绘制，主要用于地图上的航线，路线的可视化。
                series.push({ // 从开始到结束的特效尾迹线段
                    name: item[0] + ' Top',
                    type: 'lines',
                    zlevel: 1,
                    effect: { // 线特效的配置
                        show: true,
                        period: 6, // 特效动画时间 -- 单位 s
                        trailLength: 0.7, //特效尾迹的长度
                        color: '#a6c84c',
                        symbolSize: 2, //特效标记的大小
                    },
                    lineStyle: { // 线条样式
                        normal: {
                            color: color[i],
                            width: 0,
                            curveness: 0.2, //边的曲度，线条的弯度
                        }
                    },
                    data: convertData(item[1])
                }, { //从起始到结束的路径连线，和特效图形标记
                    name: item[0] + ' Top',
                    type: 'lines',
                    zlevel: 2,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: 'arrow',
                        symbolSize: 6
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.4,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                }, { //散点图设置
                    name: item[0] + ' Top',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function(val) {
                        return val[2] / 800
                    },
                    itemStyle: {
                        normal: {
                            color: color[i]
                        }
                    },
                    data: item[1].map(function(dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: $this.geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                });
            });

            // 附件模块
            option = {
                backgroundColor: '#404a59',
                title: {
                    text: '',
                    subtext: '',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    top: 'bottom',
                    left: 'right',
                    data: [$this.centerCity + ' Top'],
                    textStyle: {
                        color: '#fff'
                    },
                    selectedMode: 'single'
                },

                // geo  地理坐标系组件
                geo: {
                    map: 'china',
                    label: { // 图形上的文本标签
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true, // 鼠标缩放，平移漫游
                    itemStyle: { // 地域样式
                        normal: { // 默认状态下样式
                            areaColor: '#323c48', // 地图区域颜色
                            borderColor: '#404a59'
                        },
                        emphasis: { // 高亮状态下样式
                            areaColor: '#2a333d'
                        }
                    }
                },
                series: series
            };
            myChart.setOption(option);
            // myChart.on('click', function(params) {
            //     console.log(params);
            // });
        },

        //地图右侧弹出按钮点击
        changePlat: function(l) {
            var $this = this;

            //点击到哪个，按钮就显示哪个的值
            $this.geogra.selectGeo = l;
            $this.clickBtn = true; //点击过这个按钮

            var chanPlat = {
                select: l,
                clickBtn: $this.clickBtn
            };

            //触发器传递参数---按钮的值也是一个参数
            bus.$emit("selectGeo", chanPlat);
        }
    },
    mounted() {}
});