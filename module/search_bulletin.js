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
Vue.component('v-bulletin-echart', {
  template: `
  <div>
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
      <a @click="flow_bull()">流量</a>
      <a @click="trade_bull()">成交</a>
    </div>
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
      analyzeArr: [],
      pcFlow: [120, 432, 213, 54, 160, 730, 910],
      pcMoney: [101, 122, 321, 54, 260, 430, 710],
      wirelessFlow: [10, 12, 21, 54, 260, 830, 710],
      wirelessMoney: [401, 322, 421, 154, 160, 1430, 410],
      timeData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      PC_proportion: 1212,
      wireless_proportion: 2222,
      onOff: true,
      showCal: true,
	  platform:'',
	  pc_trade : 0,
	  app_trade : 0,
	  start : getDay(-8),
	  end : getDay(-1),
	  selectId : 0
    }
  },
  mounted() {
    var $this = this;
    setTimeout(() => {
      $this.echart($this.pcFlow, $this.pcMoney, $this.wirelessFlow, $this.wirelessMoney, $this.timeData, false);
      $this.echart_left($this.PC_proportion, $this.wireless_proportion);
      $this.echart_right($this.pc_trade,$this.app_trade);
    }, 100)

  },
  methods: {

    echart(pcFlow, pcMoney, wirelessFlow, wirelessMoney, timeData, show) {
      var $this = this;

      var myChart = echarts.init(document.getElementById('main'));

      var option = {
        title: {
          text: '分平台流量趋势',
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
	  $this = this;
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
			if("搜索" == params.name){
				//搜索 流量
				if($this.selectId == 0){
					$.ajax({
					url : $api.sp_search_all,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end
					},
					success : function(data){
							
							if(data.data.length != 0){
								$this.pc_trade = data.data[0].pc_uv;
								$this.app_trade = data.data[0].wifi_uv;
								//$this.echart_left($this.PC_proportion ,$this.wireless_proportion);
								$this.echart_right($this.pc_trade,$this.app_trade);
								//console.log($this.pcFlow)
							}
					},
					error : function(err){
						console.log(err);
					}
				});
				}else{
					//搜索  成交
					$.ajax({
					url : $api.sp_shop_trade,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end
					},
					success : function(data){
							
							if(data.data.length != 0){
								$this.pc_trade = data.data[0].pc_trade;
								$this.app_trade = data.data[0].wifi_trade;
								//$this.echart_left($this.PC_proportion ,$this.wireless_proportion);
								$this.echart_right($this.pc_trade,$this.app_trade);
								//console.log($this.pcFlow)
							}
					},
					error : function(err){
						console.log(err);
					}
				});
				}
			}else{
				if($this.selectId == 0){
					//其他 流量
					$.ajax({
					url : $api.sp_search_all,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end
					},
					success : function(data){
							
							if(data.data.length != 0){
								$this.pc_trade = data.data[0].pc_else_uv;
								$this.app_trade = data.data[0].wifi_else_uv;
								//$this.echart_left($this.PC_proportion ,$this.wireless_proportion);
								$this.echart_right($this.pc_trade,$this.app_trade);
								//console.log($this.pcFlow)
							}
					},
					error : function(err){
						console.log(err);
					}
				});
				}else{
					//其他  成交
					$.ajax({
					url : $api.sp_shop_trade,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end
					},
					success : function(data){
							
							if(data.data.length != 0){
								$this.pc_trade = data.data[0].pc_else_trade;
								$this.app_trade = data.data[0].wifi_else_trade;
								//$this.echart_left($this.PC_proportion ,$this.wireless_proportion);
								$this.echart_right($this.pc_trade,$this.app_trade);
								//console.log($this.pcFlow)
							}
					},
					error : function(err){
						console.log(err);
					}
				});
				}
			}
			//console.log("--------"+$this.start+"---"+$this.end);
		});
    },
    echart_right(pc_trade,app_trade) {
		$this = this;
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
          data: ['PC', '无线']
        },
        series: [
          {
            name: '数据',
            type: 'pie',
            radius: '80%',
            center: ['40%', '50%'],
            data: [
              { value: pc_trade, name: 'PC' },
              { value: app_trade, name: '无线' },
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
		  //console.log(params);
		  //存储平台名
		  var updata = {
                     platform: params.name,
					 start:$this.start,
					 end:$this.end
                 };
               
                bus.$emit("getPlatform", updata);
	  });
    },
    click_yesterday() {
      //昨日搜索趋势
	  //分平台搜索趋势
	  var $this = this;
	  $this.start = getDay(-2);
	 $this.end = getDay(-1);
	  var updata = {
                     
					 start:$this.start,
					 end:$this.end
                 };
               
      bus.$emit("getPlatform", updata);
		$.ajax({
			url : $api.sp_shop_platform_search_trend,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : getDay(-8),
				endTime : getDay(-1)
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
				}
				console.log($this.pcFlow)
				
			},
			error : function(err){
				console.log(err);
			}
		});
		$this.echart($this.pcFlow, $this.pcMoney, $this.wirelessFlow, $this.wirelessMoney, $this.timeData, true);
		//分平台流量占比
		$.ajax({
			url : $api.sp_shop_search_proportion,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : getDay(-2),
				endTime : getDay(-1)
			},
			success : function(data){
				$this.PC_proportion = null;
				$this.wireless_proportion = null;
				$this.pc_trade = null;
				$this.app_trade = null;
				if(data.data.length != 0){
					$this.PC_proportion = data.data[0].uv;
					$this.wireless_proportion = data.data[0].else_uv;
					$this.pc_trade = data.data[0].pc_uv;
					$this.app_trade = data.data[0].wifi_uv;
				}
				 console.log($this.PC_proportion);
			},
			error : function(err){
				console.log(err);
			}
		});
		$this.echart_left($this.PC_proportion,$this.wireless_proportion);
		$this.echart_right($this.pc_trade,$this.app_trade);
    },
    click_sever() {
      //七日流量
      var $this = this;
	  $this.start = getDay(-8);
	 $this.end = getDay(-1);
	  var updata = {
                     
					 start:$this.start,
					 end:$this.end
                 };
               
      bus.$emit("getPlatform", updata);
      //分平台搜索趋势
		$.ajax({
			url : $api.sp_shop_platform_search_trend,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : getDay(-8),
				endTime : getDay(-1)
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
				}
				console.log($this.pcFlow)
				
			},
			error : function(err){
				console.log(err);
			}
		});
		$this.echart($this.pcFlow, $this.pcMoney, $this.wirelessFlow, $this.wirelessMoney, $this.timeData, true);
		//分平台流量占比
		$.ajax({
			url : $api.sp_shop_search_proportion,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : getDay(-8),
				endTime : getDay(-1)
			},
			success : function(data){
				$this.PC_proportion = null;
				$this.wireless_proportion = null;
				$this.pc_trade = null;
				$this.app_trade = null;
				if(data.data.length != 0){
					$this.PC_proportion = data.data[0].uv;
					$this.wireless_proportion = data.data[0].else_uv;
					$this.pc_trade = data.data[0].pc_uv;
					$this.app_trade = data.data[0].wifi_uv;
				}
				 console.log($this.PC_proportion);
			},
			error : function(err){
				console.log(err);
			}
		});
		$this.echart_left($this.PC_proportion,$this.wireless_proportion);
		$this.echart_right($this.pc_trade,$this.app_trade);
    },
    click_thirty() {
      //三十天流量
      var $this = this;
	  $this.start = getDay(-31);
	  $this.end = getDay(-1);
	   var updata = {
                     
					 start:$this.start,
					 end:$this.end
                 };
               
      bus.$emit("getPlatform", updata);
      $.ajax({
			url : $api.sp_shop_platform_search_trend,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : getDay(-31),
				endTime : getDay(-1)
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
				}
				console.log($this.pcFlow)
				
			},
			error : function(err){
				console.log(err);
			}
		});
		$this.echart($this.pcFlow, $this.pcMoney, $this.wirelessFlow, $this.wirelessMoney, $this.timeData, true);
		//分平台流量占比
		$.ajax({
			url : $api.sp_shop_search_proportion,
			type : 'post',
			dataType : 'json',
			async: false,
			data : {
				sellerId : $this.sellerid,
				startTime : getDay(-31),
				endTime : getDay(-1)
			},
			success : function(data){
				$this.PC_proportion = null;
				$this.wireless_proportion = null;
				$this.pc_trade = null;
				$this.app_trade = null;
				if(data.data.length != 0){
					$this.PC_proportion = data.data[0].uv;
					$this.wireless_proportion = data.data[0].else_uv;
					$this.pc_trade = data.data[0].pc_uv;
					$this.app_trade = data.data[0].wifi_uv;
				}
				 console.log($this.PC_proportion);
			},
			error : function(err){
				console.log(err);
			}
		});
		$this.echart_left($this.PC_proportion,$this.wireless_proportion);
		$this.echart_right($this.pc_trade,$this.app_trade);
    },
    click_custom() {
      //自定义流量
      $('.but .other').addClass('addColor').siblings().removeClass("addColor");
      $('#test1').removeClass('active');
	  var $this = this;
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
          console.log(value); //得到日期生成的值，如：2017-08-18
          console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
          console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
		  var a = value.split("-");
		  var start = a[0].split("/");
			  var end = a[1].split("/");
			  var startTime1 = start[0]+""+start[1]+""+start[2];
			  var endTime2 = end[0]+""+end[1]+""+end[2];
			  $this.start = startTime1;
			  $this.end = endTime2;
			 var updata = {
                     
					 start:$this.start,
					 end:$this.end
                 };
               
			bus.$emit("getPlatform", updata);  
			$.ajax({
				url : $api.sp_shop_platform_search_trend,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					sellerId : $this.sellerid,
					startTime : startTime1,
					endTime : endTime2
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
					}
					
				},
				error : function(err){
					console.log(err);
				}
			});
		  $this.echart($this.pcFlow, $this.pcMoney, $this.wirelessFlow, $this.wirelessMoney, $this.timeData, true);
			$.ajax({
				url : $api.sp_shop_search_proportion,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					sellerId : $this.sellerid,
					startTime : startTime1,
					endTime : endTime2
				},
				success : function(data){
					$this.PC_proportion = null;
					$this.wireless_proportion = null;
					$this.pc_trade = null;
					$this.app_trade = null;
					if(data.data.length != 0){
						$this.PC_proportion = data.data[0].uv;
						$this.wireless_proportion = data.data[0].else_uv;
						$this.pc_trade = data.data[0].pc_uv;
						$this.app_trade = data.data[0].wifi_uv;
					}
					 console.log($this.PC_proportion);
				},
				error : function(err){
					console.log(err);
				}
			});
		$this.echart_left($this.PC_proportion,$this.wireless_proportion);
		$this.echart_right($this.pc_trade,$this.app_trade);
        }
      });
    },
	//流量按钮
	flow_bull(){
		var $this = this;
		$this.selectId = 0;
		$.ajax({
		url : $api.sp_search_all,
		type : 'post',
		dataType : 'json',
		async: false,
		data : {
			//4140170749
			//$this.sellerid
			sellerId : $this.sellerid,
			startTime : $this.start,
			endTime : $this.end
		},
		success : function(data){
				
				if(data.data.length != 0){
					$this.PC_proportion = data.data[0].uv;
					$this.wireless_proportion = data.data[0].else_uv;
					$this.pc_trade = data.data[0].pc_uv;
					$this.app_trade = data.data[0].wifi_uv;
					$this.echart_left($this.PC_proportion ,$this.wireless_proportion);
					$this.echart_right($this.pc_trade,$this.app_trade);
					//console.log($this.pcFlow)
				}
		},
		error : function(err){
			console.log(err);
		}
	});
	},
	//成交按钮
	trade_bull(){
		var $this = this;
		$this.selectId = 1;
		$.ajax({
		url : $api.sp_shop_trade,
		type : 'post',
		dataType : 'json',
		async: false,
		data : {
			//$this.sellerid
			sellerId : $this.sellerid,
			startTime : $this.start,
			endTime : $this.end
		},
		success : function(data){
				
				if(data.data.length != 0){
					$this.PC_proportion = data.data[0].trade;
					$this.wireless_proportion = data.data[0].else_trade;
					$this.pc_trade = data.data[0].pc_trade;
					$this.app_trade = data.data[0].wifi_trade;
					$this.echart_left($this.PC_proportion ,$this.wireless_proportion);
					$this.echart_right($this.pc_trade,$this.app_trade);
					//console.log($this.pcFlow)
				}
		},
		error : function(err){
			console.log(err);
		}
	});
	}
 },
  //页面初始化数据 默认展示过去七天的数据
  created() {
    var $this = this;
	$this.start = getDay(-30);
	 $this.end = getDay(-1);
    //接收器，接收上面的两个ID
    bus.$on("getAid", function (updata) { //注意this指向问题
      $this.sellerid = updata.sellerid;
      $this.auctionid = updata.auctionid;
		
    });
	//搜索简报 分平台搜索趋势
	$.ajax({
		url : $api.sp_shop_platform_search_trend,
		type : 'post',
		dataType : 'json',
		async: false,
		data : {
			//4140170749
			//$this.sellerid
			sellerId : $this.sellerid,
			startTime : getDay(-8),
			endTime : getDay(-1)
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
							$this.pcMoney.push(data.data[i].pc_alipay_trade_amt);
							$this.wirelessFlow.push(data.data[i].app_uv);
							$this.wirelessMoney.push(data.data[i].app_alipay_trade_amt);
							$this.timeData.push(data.data[i].thedate);
						}
					console.log($this.pcFlow)
				}
		},
		error : function(err){
			console.log(err);
		}
	});
	
	//搜索简报  全店搜索占比
	$.ajax({
		url : $api.sp_shop_search_proportion,
		type : 'post',
		dataType : 'json',
		async: false,
		data : {
			sellerId : $this.sellerid,
			startTime : getDay(-30),
			endTime : getDay(-1)
		},
		success : function(data){
			$this.PC_proportion = null;
			$this.wireless_proportion = null;
			$this.pc_trade = null;
			$this.app_trade = null;
			if(data.data.length != 0){
				$this.PC_proportion = data.data[0].uv;
				$this.wireless_proportion = data.data[0].else_uv;
				$this.pc_trade = data.data[0].pc_uv;
				$this.app_trade = data.data[0].wifi_uv;
			}
			// console.log($this.PC_proportion);
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
    }

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


//店铺搜索top10
Vue.component('v-shop-top-ten', {
  template: `
  <div>
      <p>店铺搜索top 10</p>
      <div class="ten_col">
      <select name="" id="select" style="position: absolute;left: 0;" v-model="valueId">
		<option value="1" >店铺搜索TOP10关键词</option>
        <option value="0">店铺搜索TOP10宝贝</option>
      </select>
      <button class="more" @click="more()">更多指标</button><button class="export">导出表格</button>
      <form id="nav" class="layui-form active" action="">
		 <img class="del" src="../img/删除筛选项 (1).png" alt="" @click="del()">
      <div class="confirm" lay-submit lay-filter="form" @click="watch()">确定</div>
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
	  valueId:'1',
	  addStr:[],
	  start : getDay(-8),
	  end : getDay(-1),
	  platform:'',
      analyzeArr: [],
      arr :[
        { field: 'name', title: 'top10宝贝',  align: 'center' }
		, { field: 'pay_ord_amt_holotree_allbe_guide', title: '销售额',  align: 'center' }
		 , { field: 'crt_ord_byr_cnt_holotree_allbe_guide', title: '拍下用户数',  align: 'center' } 
		 ,{ field: 'pay_ord_byr_cnt_holotree_allbe_guide', title: '成交用户数',align: 'center' }
        , { field: 'crt_ord_amt_holotree_allbe_guide', title: '拍下金额', align: 'center' }                     	  			   
      ],
      arr1 : [
        { field: 'keyword', title: 'top10关键词',  align: 'center' }
		, { field: 'pay_ord_amt_holotree_allbe_guide', title: '销售额',  align: 'center' }
		 , { field: 'crt_ord_byr_cnt_holotree_allbe_guide', title: '拍下用户数',  align: 'center' } 
		 ,{ field: 'pay_ord_byr_cnt_holotree_allbe_guide', title: '成交用户数',align: 'center' }
        , { field: 'crt_ord_amt_holotree_allbe_guide', title: '拍下金额', align: 'center' }                     	  			   
      ],
	  nav_data : [
              { 'name': 'name', 'title': 'top10宝贝' },
              { 'name': 'keyword', 'title': 'top10关键词' },
              { 'name': 'pay_ord_amt_holotree_allbe_guide', 'title': '销售额' },
              { 'name': 'crt_ord_byr_cnt_holotree_allbe_guide', 'title': '拍下用户数' },
              { 'name': 'pay_ord_byr_cnt_holotree_allbe_guide', 'title': '成交用户数' },
              { 'name': 'crt_ord_amt_holotree_allbe_guide', 'title': '拍下金额' },
              { 'name': 'pay_ord_item_cnt_holotree_allbe_guide', 'title': '成交商品数' },
              { 'name': 'one_price', 'title': '客单价' },
              { 'name': 'crt_ord_cnt_holotree_allbe_guide', 'title': '拍下笔数' },
              { 'name': 'pay_ord_cnt_holotree_allbe_guide', 'title': '成交笔数' },
              { 'name': 'translate_rate', 'title': '转化率' },	
              { 'name': 'pay_ord_item_qty_holotree_allbe_guide', 'title': '拍下商品数' },
              
            ],
          
      onOff: true,
      showCal: true,

    }
  },
 created() {
	  var $this = this;
	   //接收器，
		bus.$on("getValueId", function (updata) { //注意this指向问题	  
		  $this.valueId = updata.valueId;
		  console.log($this.valueId);
		  if($this.valueId == '0'){
			  auction($api.sp_shop_pc_top10_auction);
			  $this.add($this.arr,$this.addStr)
		  }else{
			  key($api.sp_shop_pc_top10_keyword);
			  $this.add($this.arr1,$this.addStr)
		  }
		});
		 //接收器，接收上面的平台
		bus.$on("getPlatform", function (updata) { //注意this指向问题	  
		  $this.platform = updata.platform;
		   $this.start = updata.start;
		    $this.end = updata.end;
			//console.log($this.end,$this.platform);
			if($this.platform =='无线'){
				if($this.valueId == '1'){
					key($api.sp_shop_wifi_top10_keyword);
					$this.add($this.arr1,$this.addStr)
				}else{
					auction($api.sp_shop_wifi_top10_auction);
					$this.add($this.arr,$this.addStr)
				}
				
			}else{
				if($this.valueId == '1'){
					key($api.sp_shop_pc_top10_keyword);
					$this.add($this.arr1,$this.addStr)
				}else{
					auction($api.sp_shop_pc_top10_auction);
					$this.add($this.arr,$this.addStr)
				}
				
			}
		
		});
		function key(url){
			 $.ajax({
				url : url,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					//27191771
					//$this.sellerid
					sellerId : $this.sellerid,
					startTime : $this.start,
					endTime : $this.end
				},
				success : function(data){
					if(data.data.length != 0){
						//console.log(data.data);
						$this.addStr = data.data;
					}
					
				},
				error : function(err){
					console.log(err);
				}
			});
		};
		key($api.sp_shop_pc_top10_keyword);
		function auction(url){
			$.ajax({
				url : url,
				type : 'post',
				dataType : 'json',
				async: false,
				data : {
					//27191771
					//$this.sellerid
					sellerId : $this.sellerid,
					startTime : $this.start,
					endTime : $this.end
				},
				success : function(data){
					if(data.data.length != 0){
						//console.log(data.data);
						$this.addStr = data.data;
					}
					
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
     $this.add($this.arr1,$this.addStr)
    }, 100)

  },
  methods :{
    add(arr,str){
      var $this = this;
      layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'form', 'laytpl'], function () {
        let laydate = layui.laydate //日期
          , laypage = layui.laypage //分页
          , layer = layui.layer //弹层
          , table = layui.table //表格
          , carousel = layui.carousel //轮播
          , upload = layui.upload //上传
          , element = layui.element //元素操作
          , slider = layui.slider //滑块
          , form = layui.form //表单
          , laytpl = layui.laytpl

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
	more(){
		 $('#shop_top_ten .ten_col .layui-form').show();
          //默认选中的列
          $('.layui-form-item .checkbox1 input').prop('checked', false);
          $('.layui-form-item .checkbox1 input').attr("disabled", false);
          $('.layui-form-item .checkbox1 input').parent().css('color', '#333')

          $('.layui-form-item .checkbox1 label').eq(0).css('display', 'none');
          $('.layui-form-item .checkbox1 label').eq(1).css('display', 'none');
          
	},
	 watch(){
		var $this = this;
		layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'form', 'laytpl'], function () {
		  let laydate = layui.laydate //日期
			, laypage = layui.laypage //分页
			, layer = layui.layer //弹层
			, table = layui.table //表格
			, carousel = layui.carousel //轮播
			, upload = layui.upload //上传
			, element = layui.element //元素操作
			, slider = layui.slider //滑块
			, form = layui.form //表单
			, laytpl = layui.laytpl

			form.on('submit(form)', function (data) {
			  //console.log(data);
			  //console.log($this.valueId);
			  $('#shop_top_ten .ten_col .layui-form').hide();
			  var out_arr = [];	//创建一个数组
			  if($this.valueId == 0){
				for (var key in data.field) {
				var temp = {};			//创建临时对象
				temp.field = key;		//存储对象的Key为name
				temp.title = data.field[key];	//存储value
				temp.align = 'center'
				out_arr.push(temp);

			  }
			  }else{
				for (var key in data.field) {
				var temp = {};			//创建临时对象
				temp.field = key;		//存储对象的Key为name
				temp.title = data.field[key];	//存储value
				temp.align = 'center'
				out_arr.push(temp);

			  }
			  }            
			  console.log(out_arr);
			 $this.add(out_arr,$this.addStr)

			  return false;
			});


		});
  }
	   
  },

 watch:{
	 valueId: {
			handler:function() {  
              //这里如果不使用箭头函数，需要注意this的指向
			   var $this = this;
			   //console.log("----------"+$this.valueId);
				updata();
            //下拉框改变事件，获取到当前选中的下拉框的  店铺ID 和商品ID
             function updata() {
                // //if ($this.t !== 1) { // 如果下拉框改变，则取改变后的  sellerid  和  auctionid
                // //    $this.selected.auctionid = $('#select_ted').find("option:selected").attr("auctionid");
                // //    $this.selected.sellerid = $('#select_ted').find("option:selected").attr("sellerid");
					
               // // }
				
                // ++$this.t; // 依赖值改变
                 var updata = {
                     valueId: $this.valueId,                    
                 };
                // console.log(updata);
                // // 将选中的ID放到触发器的盆子里，下面拿着用
                bus.$emit("getValueId", updata);
				
             };
          },
		  deep:true
    },
 }
})

