/**
 * 伟伟
 * 2018/11/21
 * 模快三
 */
function getSid($this) {
  var sellerid = sessionStorage.getItem('sellerId');
  var shopname = sessionStorage.getItem('shopname');
  $(".user-a").html('');
  var datStr =
    '<span>' + shopname + '</span>' +
    '<div class="help-box">' +
    '<div class="help-date" data-start="2013-04-24">' +
    '<div><span></span> 到期 </div><a href="https://fuwu.taobao.com/ser/detail.html?service_code=ts-18350" target="_blank">续费升级</a></div>' +
    '<div class="help-num">021-65400080</div>' +
    '<div class="help-more">' +
    '<a class="help-contact" target="_blank" href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%8A%E6%B5%B7%E6%99%8F%E9%BC%A0%3A%E8%8A%92%E6%9E%9C&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8">技术支持</a>' +
    '<a class="help-explain" href="Help.aspx">使用说明</a>' +
    '</div>' +
    '</div>';
  $(".user-a").html(datStr);

}


/*搜索简报*/
Vue.component('v-optimize-echart', {
  template: `
  <div>
  <img style="width: 100px;float: left;margin: 35px;" src="../img/001.jpg" alt="">
  <select name="" id="select" style="position: absolute;left: 160px;top: 120px;z-index: 1111;" v-model="selectedId">
        <option v-for="li in select" :value='li.auction_id'>{{li.auction_name}}</option>
      </select>
  <div class="but">
  <button class="com" @click="click_yesterday()">昨日</button>
  <button class="com"  @click="click_sever()">近7天</button>
  <button class="com"  @click="click_thirty()">近30天</button>
  <button class="other" @click="click_custom()">自定义</button>
  <input type="text" class="active" placeholder="请选择日期" id="test1">
  <div id="main" ref="chart" style="width:100%; height:600px;padding-top: 80px;"></div>    
</div>
<div id="proportion">
    <p>全店搜索占比</p>
    <div class="fl" id="echart_left"></div>
    <div class="fl" id="echart_right"></div>
    <div class="but2">
      <a @click="flow_seek()">流量</a>
      <a @click="trade_seek()">成交</a>
    </div>
</div>
<div class="optimize fl">
          <h4>标题搜索分析</h4>
          <p class="color1">流量分析  <span v-for='(li,index) in auction_name'>{{li}}</span></p>
          <p class="color2">成交分析  <span v-for='(li,index) in auction_name'>{{li}}</span></p>
        </div>
  </div>
  
  `,
  //id
  props: ["sellerid"],
  data: function () {
    return {
      url: $api.SPTarget,
      sellerid: '',
      auctionid: '',
	  selectedId:'',
      analyzeArr: [],
	  select :'',
      pcFlow: [120, 432, 213, 54, 160, 730, 910],
      pcMoney: [101, 122, 321, 54, 260, 430, 710],
      wirelessFlow: [10, 12, 21, 54, 260, 830, 710],
      wirelessMoney: [401, 322, 421, 154, 160, 1430, 410],
      timeData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      PC_proportion: 1212,
      wireless_proportion: 2222,
	  data : [],
	  dataStr : [],
      onOff: true,
      showCal: true,
	  dataA:[],
	  dataB:[],
	  colorArr:[],
	  colorArr1:[],
	  auction_name:'',
		start : getDay(-8),
		end : getDay(-1)
    }
  },
  mounted() {
    var $this = this;
    setTimeout(() => {
      $this.addChange(false);
	  $this.addPing();
      
    }, 100)

  },
  methods: {
	  
    echart(pcFlow, pcMoney, wirelessFlow, wirelessMoney, timeData, show) {
      var $this = this;

      var myChart = echarts.init(document.getElementById('main'));

      var option = {
        title: {
          text: '搜索趋势',
          x: 'center',
          textStyle: {
            fontSize: 25
          }

        },
        grid: {
          bottom: '100',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: true,
            label: {
              backgroundColor: '#505765'
            }
          }
        },

        legend: {
          y: 'bottom',
          inactiveColor: '#000',
          itemGap: 20,
          selected: {
            "PC端成交金额": show,
            "无线端成交金额": show
          },
          data: [
            {
              name: 'PC端流量',

              textStyle: {
                padding: [10, 30],
                backgroundColor: '#61a0a8',
                fontSize: '16',
                color: '#fff'
              },
              icon: "path://m"
            },
            {
              name: 'PC端成交金额',
              selectedMode: false,
              textStyle: {
                padding: [10, 30],
                backgroundColor: '#f19898',
                fontSize: '16',
                color: '#fff'
              },
              icon: "path://m"
            }, {
              name: '无线端流量',
              textStyle: {
                padding: [10, 30],
                backgroundColor: '#80baff',
                fontSize: '16',
                color: '#fff'
              },
              icon: "path://m"
            }, {
              name: '无线端成交金额',
              textStyle: {
                padding: [10, 30],
                backgroundColor: '#94efa7',
                fontSize: '16',
                color: '#fff'
              },
              icon: "path://m"
            }],

        },

        xAxis: [
          {
            type: 'category',
            boundaryGap: false,

            data: timeData
          }
        ],
        yAxis: [
          {
            name: 'UV',
            splitNumber: 5,
            type: 'value',
            nameTextStyle: {
              fontSize: 20,

            }

          },
          {
            name: '成交金额',
            splitNumber: 5,
            //max: 500,

            type: 'value',
            nameTextStyle: {
              fontSize: 20,

            }

          }
        ],
        series: [
          {
            name: 'PC端流量',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              color: "#61a0a8",
            },
            areaStyle: {
              color: "#61a0a8",
            },

            data: pcFlow
          }, {
            name: 'PC端成交金额',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            lineStyle: {
              color: "#f19898",
            },
            areaStyle: {
              color: "#f19898",
            },

            data: pcMoney
          },
          {
            name: '无线端流量',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              color: "#80baff",
            },
            areaStyle: {
              color: "#80baff",
            },

            data: wirelessFlow
          }, {
            name: '无线端成交金额',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            lineStyle: {
              color: "#94efa7",
            },
            areaStyle: {
              color: "#94efa7",
            },

            data: wirelessMoney
          }
        ]
      };
      myChart.clear();
	  //var sd 
      myChart.setOption(option);
      /*  myChart.on('legendselectchanged', function (obj) {
         for (var i = 0; i < option.series.length; i++) {
           var element = option.series[i];
           if (element.name == obj.name && element.data == '') {
				
             element.data = [101, 122, 321, 54, 260, 430, 710];
           }
         }
         option.legend.selected = obj.selected;
         //myChart.clear();
         myChart.setOption(option);
       });
  */
    },

    echart_left(PC_proportion, wireless_proportion) {
		var $this = this;
      var myChart = echarts.init(document.getElementById('echart_left'));
      var option = {
        title: {

        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          textStyle: {
            fontSize: '16',
            color: '#000'
          },
          data: ['搜索', '其他']

        },
        series: [
          {
            name: '数据',
            type: 'pie',
            radius: '80%',
            center: ['40%', '50%'],
            data: [
              { value: PC_proportion, name: '搜索' },

              { value: wireless_proportion, name: '其他' }
            ],
            label: {
              normal: {
                show: false,

              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.clear();
      myChart.setOption(option);
	  myChart.off('click');
	  myChart.on('click',function(params){	
		  console.log(params.name)
		  if(params.name == '搜索'){
			  $this.echart_right($this.dataA)
		  }else{
			  $this.echart_right($this.dataB)
		  }
		  
	  });
    },
    echart_right(dataStr) {
		var $this = this;
      var myChart = echarts.init(document.getElementById('echart_right'));
      var option = {
        title: {

        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          textStyle: {
            fontSize: '16',
            color: '#000'
          },
          data: ['PC','无线']
        },
        series: [
          {
            name: '数据',
            type: 'pie',
            radius: '80%',
            center: ['40%', '50%'],
            data: dataStr,
            label: {
              normal: {
                show: false,

              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.clear();
      myChart.setOption(option);
	  myChart.off('click');
	  myChart.on('click',function(params){	
		   var aa = {
				name: params.name,
				start : $this.start,
				end : $this.end
			};
			bus.$emit("getAa", aa);
			if(params.name == '无线'){
				$this.changeColor1();
				$this.changeColor3();
			}else{
				$this.changeColor();
				$this.changeColor2();
			}
		  
	  });
    },
    click_yesterday() {
		var $this = this;
		$this.start = getDay(-2);
	  $this.end = getDay(-1);
	   var aa = {
				start : $this.start,
				end : $this.end,
				name:'PC'
			};
									
		bus.$emit("getAa", aa);
      //昨日流量
		$this.addChange(true);
		$this.addPing();
    },
    click_sever() {
      //七日流量
      var $this = this;
	  
	  $this.start = getDay(-8);
	  $this.end = getDay(-1);
	    var aa = {
				start : $this.start,
				end : $this.end,
				name:'PC'
			};
									
		bus.$emit("getAa", aa);
     $this.addChange(true);
	$this.addPing();
    },
    click_thirty() {
      //三十天流量
      var $this = this;
	  $this.start = getDay(-31);
	  $this.end = getDay(-1);
	    var aa = {
				start : $this.start,
				end : $this.end,
				name:'PC'
			};
									
		bus.$emit("getAa", aa);
		$this.addChange(true);
		$this.addPing();
    },
    click_custom() {
		var $this = this;
      //自定义流量
      $('.but .other').addClass('addColor').siblings().removeClass("addColor");
      $('#test1').removeClass('active');
      //执行一个laydate实例   
      laydate.render({
        elem: '#test1' //指定元素
        , min: -30
        , max: -0
        , format: 'yyyy/MM/dd'
        , range: true
        , btns: ['confirm']
        , done: function (value, date, endDate) {
          $(this).removeClass('active')
          $('#test1').addClass('active');
          //console.log(value); //得到日期生成的值，如：2017-08-18
         // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
          //console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
		   var a = value.split("-");
		  var start = a[0].split("/");
			  var end = a[1].split("/");
			  var startTime1 = start[0]+""+start[1]+""+start[2];
			  var endTime2 = end[0]+""+end[1]+""+end[2];
			  $this.start = startTime1;
			  $this.end = endTime2;
			   var aa = {
				start : $this.start,
				end : $this.end,
				name:'PC'
				};
									
				bus.$emit("getAa", aa);
			
		;
		$this.addChange(true);
		$this.addPing();
		
        }
      });
    },
    addChange(val){
		var $this = this;
		$.ajax({
		url : $api.sp_auction_platform_search_trend,
		type : 'post',
		dataType : 'json',
		async: false,
		data : {
			sellerId : $this.sellerid,
			startTime : $this.start,
			endTime : $this.end,
			auctionId : $this.auctionid
		},
		success : function(data){
				$this.pcFlow = [];				
				$this.pcMoney = [];
				$this.wirelessFlow = [];
				$this.wirelessMoney = [];
				$this.timeData = [];
				if(data.data.length != 0){
					for (var i=0;i<data.data.length;i++){
							$this.pcFlow.push(data.data[i].pc_uv);
							$this.pcMoney.push(data.data[i].pc_trade);
							$this.wirelessFlow.push(data.data[i].wifi_uv);
							$this.wirelessMoney.push(data.data[i].wifi_trade);
							$this.timeData.push(data.data[i].thedate);
						}
					//console.log($this.pcFlow)
				}
		},
		error : function(err){
			console.log(err);
			
		}
	});	
	$this.echart($this.pcFlow,$this.pcMoney,$this.wirelessFlow,$this.wirelessMoney,$this.timeData,val);
	},
	addPing(){
		var $this = this;
		$.ajax({
			url : $api.sp_auction_search_proportion,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : $this.start,
				endTime : $this.end,
				auctionId : $this.auctionid
			},
			success : function(data){
				$this.PC_proportion = null;
				$this.wireless_proportion = null;
				$this.dataA = [];
				$this.dataB = [];
				if(data.data.length != 0){
					//console.log(data);
					$this.PC_proportion = data.data[0].uv;
					$this.wireless_proportion = data.data[0].else_uv;
					var temp = new Object();
					temp.value = data.data[0].pc_uv;
					temp.name="PC";
					var temp2 = new Object();
					temp2.value = data.data[0].wifi_uv;
					temp2.name = "无线";
					$this.dataA.push(temp);
					$this.dataA.push(temp2);
					var temp3 = new Object();
					temp3.value = data.data[0].pc_else_uv;
					temp3.name="PC";
					var temp4 = new Object();
					temp4.value = data.data[0].wifi_else_uv;
					temp4.name = "无线";
					$this.dataB.push(temp3);
					$this.dataB.push(temp4);
				}							
				 $this.echart_left($this.PC_proportion,$this.wireless_proportion);
				 $this.echart_right($this.dataA);
			},
			error : function(err){
				console.log(err);
			}
		});
	
		
	},
	flow_seek(){
		var $this = this;
		$this.addPing();
	},
	trade_seek(){
		var $this = this;
		$.ajax({
			url : $api.sp_auction_trade_proportion,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : $this.start,
				auctionId : $this.auctionid,
				endTime : $this.end								
			},
			success : function(data){
				$this.PC_proportion = null;
				$this.wireless_proportion = null;
				$this.dataA = [];
				$this.dataB = [];
				if(data.data.length != 0){
					console.log(data);
					$this.PC_proportion = data.data[0].trade;
					$this.wireless_proportion = data.data[0].else_trade;				
					var temp = new Object();
					temp.value = data.data[0].pc_trade;
					temp.name="PC";
					var temp2 = new Object();
					temp2.value = data.data[0].wifi_trade;
					temp2.name = "无线";
					$this.dataA.push(temp);
					$this.dataA.push(temp2);
					var temp3 = new Object();
					temp3.value = data.data[0].pc_else_trade;
					temp3.name="PC";
					var temp4 = new Object();
					temp4.value = data.data[0].wifi_else_trade;
					temp4.name = "无线";
					$this.dataB.push(temp3);
					$this.dataB.push(temp4);
				}
				 $this.echart_left($this.PC_proportion,$this.wireless_proportion);
				 $this.echart_right($this.dataA);
				 
			},
			error : function(err){
				console.log(err);
			}
		});
	},
	//流量分析
	changeColor(){
		var $this = this;
		$.ajax({
			url : $api.sp_getIndex_pc,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : $this.start,
				endTime : $this.end,
				auctionId : $this.auctionid
			},
			success : function(data){
				console.log(data.data);
				var data =data.data;
				 var color = ['#ff0000','#FF0066','#FFCC99','#FFCC66'];
					$('#shop_analyze .optimize p.color1 span').css('color','#333')
					var list = $('#shop_analyze .optimize p.color1 span');
					
					var chunk = function(arr, num){
							  num = num*1 || 1;
							  $this.colorArr1 = [];
							  arr.forEach(function(item, i){
								if(i % num === 0){
								  $this.colorArr1.push([]);
								}
								$this.colorArr1[$this.colorArr1.length - 1].push(item);
							  });
							  
							  return $this.colorArr1;
							};
					chunk(data, 3);
					
					
					for (let i = 0; i < $this.colorArr1.length; i++) {
						for(let n=0; n<$this.colorArr1[i].length; n++){
							var arr = $this.colorArr1[i];
							for (let j = 0; j < list.length; j++) {
								if(arr[n].detail == list[j].innerHTML){
									$(list[j]).css('color',color[i]);
									continue 
								}
					 
					 
						}
						}
						
					 
					 
					}
			},
			error : function(err){
				console.log(err);
			}
		});
	},
	changeColor2(){
		var $this = this;
		$.ajax({
			url : $api.sp_getIndexByTrade_pc,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : $this.start,
				endTime : $this.end,
				auctionId : $this.auctionid
			},
			success : function(data){
				console.log(data.data);
				var data =data.data;
				 var color = ['#ff0000','#FF0066','#FFCC99','#FFCC66'];
				//var color1 = ['#339900','#00CC00','#33CC33','#33CC99','#33CCCC','#33FF00','#33FF33','#33FF66','#33FF99','#33FFCC'];
					var list = $('#shop_analyze .optimize p.color2 span');
					$('#shop_analyze .optimize p.color2 span').css('color','#333')
					var chunk = function(arr, num){
							  num = num*1 || 1;
							  $this.colorArr = [];
							  arr.forEach(function(item, i){
								if(i % num === 0){
								  $this.colorArr.push([]);
								}
								$this.colorArr[$this.colorArr.length - 1].push(item);
							  });
							  
							  return $this.colorArr;
							};
					chunk(data, 3);
					
					
					for (let i = 0; i < $this.colorArr.length; i++) {
						for(let n=0; n<$this.colorArr[i].length; n++){
							var arr = $this.colorArr[i];
							for (let j = 0; j < list.length; j++) {
								if(arr[n].detail == list[j].innerHTML){
									$(list[j]).css('color',color[i]);
									continue 
								}
					 
					 
						}
						}
						
					 
					 
					}
			},
			error : function(err){
				console.log(err);
			}
		});
	},
	
	//成交分析
	changeColor1(){
		var $this = this;
		$.ajax({
			url : $api.sp_getIndex_wifi,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : $this.start,
				endTime : $this.end,
				auctionId : $this.auctionid
			},
			success : function(data){
				console.log(data.data);
				var data =data.data;
				 var color = ['#ff0000','#FF0066','#FFCC99','#FFCC66'];
				//var color1 = ['#339900','#00CC00','#33CC33','#33CC99','#33CCCC','#33FF00','#33FF33','#33FF66','#33FF99','#33FFCC'];
					var list = $('#shop_analyze .optimize p.color1 span');
					$('#shop_analyze .optimize p.color1 span').css('color','#333')
					var chunk = function(arr, num){
							  num = num*1 || 1;
							  $this.colorArr1 = [];
							  arr.forEach(function(item, i){
								if(i % num === 0){
								  $this.colorArr1.push([]);
								}
								$this.colorArr1[$this.colorArr1.length - 1].push(item);
							  });
							  
							  return $this.colorArr1;
							};
					chunk(data, 3);
					
					
					for (let i = 0; i < $this.colorArr1.length; i++) {
						for(let n=0; n<$this.colorArr1[i].length; n++){
							var arr = $this.colorArr1[i];
							for (let j = 0; j < list.length; j++) {
								if(arr[n].detail == list[j].innerHTML){
									$(list[j]).css('color',color[i]);
									continue 
								}
					 
					 
						}
						}
						
					 
					 
					}
			},
			error : function(err){
				console.log(err);
			}
		});
	},
	changeColor3(){
		var $this = this;
		$.ajax({
			url : $api.sp_getIndexByTrade_wifi,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : $this.start,
				endTime : $this.end,
				auctionId : $this.auctionid
			},
			success : function(data){
				console.log(data.data);
				var data =data.data;
				 var color = ['#ff0000','#FF0066','#FFCC99','#FFCC66'];
				//var color1 = ['#339900','#00CC00','#33CC33','#33CC99','#33CCCC','#33FF00','#33FF33','#33FF66','#33FF99','#33FFCC'];
					var list = $('#shop_analyze .optimize p.color2 span');
					$('#shop_analyze .optimize p.color2 span').css('color','#333')
					var chunk = function(arr, num){
							  num = num*1 || 1;
							  $this.colorArr = [];
							  arr.forEach(function(item, i){
								if(i % num === 0){
								  $this.colorArr.push([]);
								}
								$this.colorArr[$this.colorArr.length - 1].push(item);
							  });
							  
							  return $this.colorArr;
							};
					chunk(data, 3);
					
					
					for (let i = 0; i < $this.colorArr.length; i++) {
						for(let n=0; n<$this.colorArr[i].length; n++){
							var arr = $this.colorArr[i];
							for (let j = 0; j < list.length; j++) {
								if(arr[n].detail == list[j].innerHTML){
									$(list[j]).css('color',color[i]);
									continue 
								}
					 
					 
						}
						}
						
					 
					 
					}
			},
			error : function(err){
				console.log(err);
			}
		});
	},
  },
  created() {
    var $this = this;

    //接收器，接收上面的两个ID
    bus.$on("getAid", function (updata) { //注意this指向问题
      $this.sellerid = updata.sellerid;	 
      $this.auctionid = updata.auctionid;
	  $this.addChange(true);
	  $this.addPing();
	  //console.log($('#select option:selected').text());
	 $this.auction_name = $('#select option:selected').text();
	  setTimeout(() => {
		 $this.changeColor();
		 $this.changeColor2();
      
    }, 10)
	 
    });
	
	

	
	//宝贝名称
	$.ajax({
		url : $api.sp_GetAuction,
		type : 'post',
		dataType : 'json',
		async: false,
		data : {
			//1030739267
			//$this.sellerid
			sellerId : $this.sellerid,
		},
		success : function(data){
			//console.log(data);
			if(data.data.length != 0){
				$this.select =data.data
				$this.selectedId = data.data[0].auction_id
				$this.auction_name = data.data[0].auction_name.toString().split("")				
			}
			 
		},
		error : function(err){
			console.log(err);
		}
	});
	
  },
  watch: {
    //事件监听
    analyzeArr: function () {
      var $this = this;

      watchdata(); //开始渲染图表

      //处理两个eChart图表
      function watchdata() {

        // 基于准备好的dom，初始化echarts实例

      }
    },
	selectedId: {
			handler:function() {  
              //这里如果不使用箭头函数，需要注意this的指向
			   var $this = this;
            updata();
            //下拉框改变事件，获取到当前选中的下拉框的  店铺ID 和商品ID
            function updata() {
                //if ($this.t !== 1) { // 如果下拉框改变，则取改变后的  sellerid  和  auctionid
                //    $this.selected.auctionid = $('#select_ted').find("option:selected").attr("auctionid");
                //    $this.selected.sellerid = $('#select_ted').find("option:selected").attr("sellerid");
					
               // }
                ++$this.t; // 依赖值改变
                var updata = {
                    auctionid: $this.selectedId, 
					sellerid:$this.sellerid
                };
                //console.log(updata);
                // 将选中的ID放到触发器的盆子里，下面拿着用
                bus.$emit("getAid", updata);
				
            };
          },
		  deep:true
    },

  },
});
//填写数字获取日期，参数为0 代表今天日期
function getDay(day) {
				//Date()返回当日的日期和时间。
				var days = new Date();
				//getTime()返回 1970 年 1 月 1 日至今的毫秒数。
				var gettimes = days.getTime() + 1000 * 60 * 60 * 24 * day;
				//setTime()以毫秒设置 Date 对象。
				days.setTime(gettimes); 
				var year = days.getFullYear();
				var month = days.getMonth()+1;
				if(month<10){
					month="0"+month;
				}
				var today = days.getDate();
				if(today<10){
					today="0"+today;
				}
				return year + "" + month + "" + today;
			}
//关键词分析
Vue.component('v-antistop-analyze', {
  template: `
  <div>
      <p>关键词分析</p>
      <div class="ten_col">
      <div  class="seek"  style="position: absolute;left: 0;" >
      <span value="0" class="addColor3" @click="drainage(0)">引流分析</span><span value="1" @click="knockdown(1)">成交分析</span>
      </div>
      <button class="more" @click="more()">更多指标</button><button class="export">导出表格</button>
			<form id="nav" class="layui-form active" action="">
      <img class="del" src="../img/删除筛选项 (1).png" alt="" @click="del()">
      <div class="confirm" lay-submit lay-filter="form" @click="wacth()">确定</div>
    <div class="layui-form-item " pane="">
      <div class="checkbox1" lay-filter="aa" style=" width: 350px;  padding:40px 10px; border: 1px solid #ccc;box-shadow: 0 2px 5px 0 rgb(0,0,0);">
          
          <label v-for='(li,index) in nav_data'><input :name="li.name" type="checkbox" :value="li.title" />{{li.title}}</label>
         
      </div>
    </div>

      </form>
    	</div>
      <table class="layui-hide" id="test" lay-filter="test"></table>
      
  </div>
  
  `,
  //id
  props: ["sellerid"],
  data: function () {
    return {
      url: $api.SPTarget,
      sellerid: '',
      auctionid: '',
      valueId: '1',
      addStr: [],
      analyzeArr: [],	  
	  sear_name : 'PC',
      arr: [
        { field: 'keyword', title: '关键词', align: 'center' }
        , { field: 'pv', title: 'PV', align: 'center' }
        , { field: 'uv', title: 'UV', align: 'center' }
        , { field: 'numberusers', title: '拍下用户数', align: 'center' }
        , { field: 'takewriting', title: '拍下笔数', align: 'center' },
			],
	 nav_data : [
              { 'name': 'keyword', 'title': '关键词' },
              { 'name': 'pv', 'title': 'PV' },
              { 'name': 'uv', 'title': 'UV' },
              { 'name': 'numberusers', 'title': '拍下用户数' },
              { 'name': 'takewriting', 'title': '拍下笔数' },
              { 'name': 'snapcount', 'title': '拍下商品数' },
              { 'name': 'takeamount', 'title': '拍下金额' },
              { 'name': 'numbertransactions', 'title': '成交商品数' },
              { 'name': 'clinchamount', 'title': '成交笔数' },
              { 'name': 'numbercustomers', 'title': '支付用户数' },	
              { 'name': 'clinchnumber', 'title': '成交金额' },
              
            ],
      onOff: true,
      showCal: true,
	  start : getDay(-8),
	  end : getDay(-1)
    }
  },
  created() {
    var $this = this;
	//接收器，接收上面的两个ID
    bus.$on("getAid", function (updata) { //注意this指向问题
     $this.sellerid = updata.sellerid;
      $this.auctionid = updata.auctionid;
		//console.log($this.auctionid);
		keyword_analyze($api.sp_pc_keyword_analyze)
		$this.add($this.arr, $this.addStr)
    });
	bus.$on("getAa", function (aa) { //注意this指向问题
		 $this.start = aa.start;
		 $this.end = aa.end;
		 $this.sear_name = aa.name;
		 var val = $('.ten_col .seek .addColor3').attr('value');
		 if(val == '0'){
			 if($this.sear_name == 'PC'){
				  keyword_analyze($api.sp_pc_keyword_analyze);
			 }else{
				  keyword_analyze($api.sp_wifi_keyword_analyze);
			 }
		 }
		 if(val == '1'){
			 if($this.sear_name == 'PC'){
				  keyword_analyze($api.sp_pc_trade_keyword_analyze);
			 }else{
				  keyword_analyze($api.sp_wifi_trade_keyword_analyze);
			 }
		 }
		$this.add($this.arr, $this.addStr) 
		 
    });
	function keyword_analyze(url){
		$.ajax({
			url : url,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				//1030739267
				//$this.sellerid
				sellerId : $this.sellerid,
				startTime : $this.start,
				endTime : $this.end,
				auctionId : $this.auctionid
			},
			success : function(data){
				$this.addStr = [];
				//console.log(data);
				if(data.data.length != 0){
					//console.log(data);
					$this.addStr = data.data;
				}
				 $this.addStr = data.data;
			},
			error : function(err){
				console.log(err);
			}
		});
	};
  },
  mounted() {
    var $this = this;
    setTimeout(() => {
      //console.log($this.addStr);
      $this.add($this.arr, $this.addStr)
    }, 100)

  },
  methods: {
    add(arr,str) {
      var $this = this;
       layui.use('table', function () {
        let table = layui.table; //表格
		
		
        table.render({
          elem: '#test'
          , title: '用户数据表'
          , cols: [arr]
          , data: str

        });


      });
		},
    del(){
      $('#shop_top_ten .ten_col .layui-form').hide();
		},
	wacth() {
      var $this = this
      layui.use('form', function () {
        var form = layui.form;
        //监听确定
        form.on('submit(form)', function (data) {
          console.log(data);
         
          $('#shop_top_ten .ten_col .layui-form').hide();
          var out_arr = [];	//创建一个数组
          for (var key in data.field) {
            var temp = {};			//创建临时对象
            temp.field = key;		//存储对象的Key为name
            temp.title = data.field[key];	//存储value
            temp.align = 'center'
            out_arr.push(temp);

          }

          console.log(out_arr);
		$this.add(out_arr, $this.addStr)
          return false;
        });


      })

    },
	//引流分析
    drainage(val){
      var $this = this;
	  //console.log($this.sear_name);
		if('PC' == $this.sear_name){
			$.ajax({
				url : $api.sp_pc_keyword_analyze,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					
					sellerId : $this.sellerid,
					startTime : $this.start,
					endTime : $this.end,
					auctionId : $this.auctionid
				},
				success : function(data){
					$this.addStr = [];
					if(data.data.length != 0){
						console.log(data);
						$this.addStr = data.data;
					}
					$this.addStr = data.data;
					$this.add($this.arr, $this.addStr)
					 
				},
				error : function(err){
					console.log(err);
				}
			});
		}else{
			$.ajax({
				url : $api.sp_wifi_keyword_analyze,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					//1030739267
					//$this.sellerid
					sellerId : $this.sellerid,
					startTime : $this.start,
					endTime : $this.end,
					auctionId : $this.auctionid
				},
				success : function(data){
					$this.addStr = [];
					if(data.data.length != 0){
						console.log(data);
						$this.addStr = data.data;
					}
					$this.addStr = data.data;
					$this.add($this.arr, $this.addStr)
					 
				},
				error : function(err){
					console.log(err);
				}
			});
		}
	 
    },
	//成交分析
    knockdown(val){
        var $this = this;
		if('PC' == $this.sear_name){
			$.ajax({
				url : $api.sp_pc_trade_keyword_analyze,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					//1030739267
					//$this.sellerid
					sellerId : $this.sellerid,
					startTime : $this.start,
					endTime : $this.end,
					auctionId : $this.auctionid
				},
				success : function(data){
					$this.addStr = [];
					if(data.data.length != 0){
						console.log(data);
						$this.addStr = data.data;
					}
					$this.addStr = data.data;
					$this.add($this.arr, $this.addStr)
					 
				},
				error : function(err){
					console.log(err);
				}
			});
		}else{
			$.ajax({
				url : $api.sp_wifi_trade_keyword_analyze,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					//1030739267
					//$this.sellerid
					sellerId : $this.sellerid,
					startTime : $this.start,
					endTime : $this.end,
					auctionId : $this.auctionid
				},
				success : function(data){
					$this.addStr = [];
					if(data.data.length != 0){
						console.log(data);
						$this.addStr = data.data;
					}
					$this.addStr = data.data;
					$this.add($this.arr, $this.addStr)
					 
				},
				error : function(err){
					console.log(err);
				}
			});
		}
    },
    more(){
      $('#shop_top_ten .ten_col .layui-form').show();
          //默认选中的列
          $('.layui-form-item .checkbox1 input').prop('checked', false);
          $('.layui-form-item .checkbox1 input').attr("disabled", false);
          $('.layui-form-item .checkbox1 input').parent().css('color', '#333')

          $('.layui-form-item .checkbox1 label').eq(0).css('display', 'none');
    }
  },

  watch: {


  }
})

