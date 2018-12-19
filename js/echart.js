 //EChart公共JSON
 function EChart() {
     return { //根据实际图标进行修改
         color: [ '#76A6D3', '#90C177', '#747AB4', '#E4995B', '#E592A2', '#d1b838', '#a16aa3', '#5abcd5',
             '#bf6d6d', '#6dbf96'
         ],
         title: {
             text: '',
             x: 'center'
         },
         tooltip: {
             trigger: 'item',
             formatter: ''
         },
         legend: {
             data: [],
             bottom: '1%',
             show: true
         },
         grid: {
             left: '0%',
             right: '0%',
             bottom: '0%',
             top: '0%',
             containLabel: true
         },
         xAxis: [], //饼图不需要
         yAxis: [], //饼图不需要
         series: []
     };
 }
 //饼图JSON，依附于EChart公共JSON
 function Pie() {
     var pie = EChart();
     delete pie[ "xAxis" ];
     delete pie[ "yAxis" ];
     pie.title.text = "饼图";
     pie.tooltip.formatter = "{a} <br/>{b}: {c}" + ( verge.Param.indexName == "支付转化率" ? "%" : "" ) + " ({d}%)";
     pie.legend.data = [];
     pie.legend.show = false;
     pie.series = [ {
         name: verge.Param.indexName,
         type: 'pie',
         radius: [ '0%', '70%' ],
         selectedMode: 'single',
         avoidLabelOverlap: false,
         data: []
     } ];
 }



 //双饼图
 option = {
     color: [ '#76A6D3', '#90C177', '#747AB4', '#E4995B', '#E592A2' ],
     title: {
         text: '全店流量构成',
         x: 'center'
     },
     tooltip: {
         trigger: 'item',
         formatter: "{a} <br/>{b}: {c} ({d}%)"
     },
     legend: {
         data: dates,
         bottom: '1%',
         show: false
     },
     series: [ {
         name: tip,
         type: 'pie',
         radius: [ '0%', '45%' ],
         selectedMode: 'single',
         avoidLabelOverlap: false,
         label: {
             normal: {
                 show: true,
                 position: 'inner'
             }
         },
         data: v1
     }, {
         name: tip,
         type: 'pie',
         radius: [ '55%', '75%' ],
         selectedMode: 'single',
         data: v2
     } ]
 };

 //单饼图
 option = {
     color: [ '#76A6D3', '#90C177', '#747AB4', '#E4995B', '#E592A2', '#d1b838', '#a16aa3', '#5abcd5', '#bf6d6d', '#6dbf96' ],
     title: {
         text: tip,
         x: 'center'
     },
     tooltip: {
         trigger: 'item',
         formatter: "{a} <br/>{b}: {c}" + ( MS.JSON.indexName == "支付转化率" ? "%" : "" ) + " ({d}%)"
     },
     legend: {
         data: dates,
         bottom: '1%',
         show: false
     },
     series: [ {
         name: MS.JSON.indexName,
         type: 'pie',
         radius: [ '0%', '70%' ],
         selectedMode: 'single',
         avoidLabelOverlap: false,
         data: v1
     } ]
 };

 //条形图
 option = {
     color: [ '#76A6D3', '#90C177', '#747AB4', '#E4995B', '#E592A2' ],
     title: {
         text: '流量TOP5关键词数据',
         x: 'center'
     },
     tooltip: {
         trigger: 'axis'
     },
     legend: {
         data: [ tip ],
         bottom: '1%'
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '7%',
         top: '10%',
         containLabel: true
     },
     xAxis: {
         type: 'value',
         boundaryGap: [ 0, 0.01 ]
     },
     yAxis: {
         type: 'category',
         data: dates,
         axisLabel: {
             formatter: function ( value, index ) {
                 if ( value.length > 5 )
                     return value.substr( 0, 3 ) + "...";
                 else
                     return value;
             }
         }
     },
     series: [ {
         name: tip,
         type: 'bar',
         barCategoryGap: '75%',
         data: v1
     } ]
 };
 //折线图
 option = {
     color: [ '#76A6D3', '#90C177', '#E592A2' ],
     backgroundColor: '#fff',
     grid: {
         left: '5%',
         right: '5%',
         bottom: '5%',
         top: "5%",
         containLabel: false
     },
     xAxis: [ {
         type: 'category',
         data: dates,
         show: false
     } ],
     yAxis: [ {
         type: 'value',
         show: false
     } ],
     series: [ {
         name: '全平台',
         type: 'line',
         symbol: 'none',
         smooth: true,
         data: v1,
         lineStyle: {
             normal: {
                 type: ( MS.JSON.platform == 0 ? 'solid' : 'dotted' )
             }
         }
     }, {
         name: '无线端',
         type: 'line',
         symbol: 'none',
         smooth: true,
         data: v2,
         lineStyle: {
             normal: {
                 type: ( MS.JSON.platform == 1 ? 'solid' : 'dotted' )
             }
         }
     }, {
         name: 'PC端',
         type: 'line',
         symbol: 'none',
         smooth: true,
         data: v3,
         lineStyle: {
             normal: {
                 type: ( MS.JSON.platform == 2 ? 'solid' : 'dotted' )
             }
         }
     } ]
 };

 //柱状图
 option = {
     color: [ '#76A6D3', '#90C177', '#747AB4', '#E4995B', '#E592A2' ],
     title: {
         text: tip,
         x: 'center'
     },
     tooltip: {
         trigger: 'axis',
         formatter: "{a} <br/>{b}: {c}%"
     },
     legend: {
         data: [ MS.JSON.indexName ],
         bottom: '1%'
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '7%',
         top: '10%',
         containLabel: true
     },
     xAxis: [ {
         type: 'category',
         data: dates,
         axisLabel: {
             formatter: function ( value, index ) {
                 if ( value.length > 5 )
                     return value.substr( 0, 3 ) + "...";
                 else
                     return value;
             },
             interval: 0,
             rotate: 15
         }
     } ],
     yAxis: [ {
         type: 'value',
         scale: true,
         minInterval: 0.01
     } ],
     series: [ {
         name: MS.JSON.indexName,
         type: 'bar',
         barCategoryGap: '75%',
         data: v1,
         label: {
             normal: {
                 show: true,
                 position: 'top',
                 formatter: "{c}%"
             }
         }
     } ]
 };
 //多轴折线柱状图
 option = {
     color: [ '#76A6D3', '#90C177', '#747AB4', '#E4995B', '#E592A2' ],
     title: {
         text: "流量成交效果",
         x: 'center'
     },
     tooltip: {
         trigger: 'axis'
     },
     legend: {
         data: [ 'UV', '支付转化率', '成交金额' ],
         bottom: '1%'
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '7%',
         top: '15%',
         containLabel: true
     },
     xAxis: [ {
         type: 'category',
         data: dates
     } ],
     yAxis: [ {
             type: 'value',
             name: '支付转化率'
         }, {
             type: 'value',
             name: 'UV'
         },
         {
             type: 'value',
             name: '成交金额',
             position: 'right',
             offset: 50
         }
     ],
     series: [ {
             name: 'UV',
             type: 'line',
             barCategoryGap: '50%',
             yAxisIndex: 1,
             smooth: true,
             data: v2
         },
         {
             name: '支付转化率',
             type: 'line',
             barCategoryGap: '50%',
             smooth: true,
             data: v3
         },
         {
             name: '成交金额',
             type: 'bar',
             barCategoryGap: '50%',
             yAxisIndex: 2,
             smooth: true,
             data: v1
         }
     ]
 };
 //地图
 option = {
     backgroundColor: '#fff',
     title: {
         left: 'center',
         textStyle: {
             color: '#fff'
         }
     },
     tooltip: {
         trigger: 'item',
         formatter: function ( params ) {
             var regS = new RegExp( '/', "gi" );
             var v = params.data.value.toString().replace( regS, '-' );
             v1 = v.split( ',' );
             if ( params.name == '钓鱼岛' ) return '';
             else {
                 if ( $( ".module-select>span" ).html() == "UV" )
                     return '入店访客情况<br/>' + params.name + '地区的访客数共有 ' + v1[ 2 ] + ' 人';
                 else
                     return '成交情况<br/>' + params.name + '地区一共成交 ' + v1[ 2 ] + ' 笔';
             }
         }
     },
     legend: {
         show: false,
         orient: 'vertical',
         top: 'bottom',
         left: 'right',
         data: [ '地点', '线路' ],
         textStyle: {
             color: '#fff'
         }
     },
     geo: {
         map: 'china',
         label: {
             emphasis: {
                 show: false
             }
         },
         roam: true,
         itemStyle: {
             normal: {
                 areaColor: '#eeeded',
                 borderColor: '#333'
             },
             emphasis: {
                 areaColor: '#ccc'
             }
         }
     },
     series: [ {
         name: '地点',
         type: 'effectScatter',
         coordinateSystem: 'geo',
         zlevel: 3,
         rippleEffect: {
             brushType: 'stroke'
         },
         label: {
             normal: {
                 show: true,
                 position: 'right',
                 formatter: '{b}'
             },
             emphasis: {
                 show: true,
                 position: 'right',
                 formatter: '{b}'
             }
         },
         symbolSize: 5,
         showEffectOn: 'render',
         itemStyle: {
             normal: {
                 color: '#01162a'
             }
         },
         data: allData.citys
     }, {
         name: '线路',
         type: 'lines',
         coordinateSystem: 'geo',
         zlevel: 2,
         large: true,
         silent: true,
         effect: {
             show: true,
             constantSpeed: 200,
             symbol: 'rect',
             symbolSize: 3,
             trailLength: 0,
         },
         lineStyle: {
             normal: {
                 color: new echarts.graphic.LinearGradient( 0, 0, 0, 1, [ {
                     offset: 0,
                     color: '#01162a'
                 }, {
                     offset: 1,
                     color: '#01162a'
                 } ], false ),
                 width: 1,
                 opacity: 0.2,
                 curveness: 0.1
             }
         },
         data: allData.moveLines
     }, {
         name: '钓鱼岛',
         type: 'effectScatter',
         coordinateSystem: 'geo',
         zlevel: 3,
         rippleEffect: {
             brushType: 'stroke'
         },
         animation: false,
         label: {
             normal: {
                 show: true,
                 position: 'right',
                 formatter: '{b}'
             },
             emphasis: {
                 show: true,
                 position: 'right',
                 formatter: '{b}'
             }
         },
         symbolSize: 5,
         showEffectOn: '',
         silent: true,
         itemStyle: {
             normal: {
                 color: '#46bee9'
             }
         },
         data: [ {
             "name": "钓鱼岛",
             "value": [ 123.483376, 25.752216, 0 ],
             "silent": true,
             "symbol": "image://./img/China.jpg",
             "symbolSize": [ 36, 24 ],
             "itemStyle": {
                 "normal": {
                     "color": "#ff0000"
                 }
             }
         } ]
     } ]
 };