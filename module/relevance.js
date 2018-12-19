/**
 * 伟伟
 * 2018/11/21
 * 模快三
 */
 var sellerid = sessionStorage.getItem('sellerId');
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


/*关联分析*/
Vue.component('v-relevance-echart', {
  template: `
  <div>
  <img style="width: 100px;float: left;margin: 35px;" :src=" imgone " alt="">
  <select name="" id="select" style="position: absolute;left: 160px;top: 120px;z-index: 1111;" v-model="selectedId">
  <option v-for="li in selectA" :value='li.auction_id_1'>{{li.name}}</option>
      </select>
  <div class="but">
  <button class="com" @click="click_yesterday()">昨日</button>
  <button class="com"  @click="click_sever()">近7天</button>
  <button class="com"  @click="click_thirty()">近30天</button>
  <button class="other" @click="click_custom()">自定义</button>
  <input type="text" class="active" placeholder="请选择日期" id="test1">
  <div id="main" ref="chart" style="width:100%; height:600px;padding-top: 80px;"></div>    
</div>
       <table style="width: 80%;margin: 30px auto;">
        <thead>
          <tr>				
                <td>UV</td>
				<td>PV</td>
                <td>销量</td>
                <td>销售额</td>
				<td>支付父订单</td>
				<td>付款人数</td>
          </tr>
        </thead>
        <tbody v-for="li in tableA">
			<tr>
                <td>{{ li.uv }}</td>
				<td>{{ li.pv }}</td>
                <td>{{ li.sales_volume }}</td>
                <td>{{ li.alipay_auction_num }}</td>
				<td>{{ li.alipay_order_num }}</td>
				<td>{{ li.alipay_winner_num }}</td>
			</tr>
        </tbody>
      </table>
      <p>关联宝贝解析</p>
      <img style="width: 100px;float: left;margin: 35px;" :src="imgtwo" alt="">
      <select name="" id="select1" style="position: relative; left: 0;top: 100px;z-index: 1111;" v-model="selectedIdB">
      <option v-for="li in selectB" :value='li.auction_id_2'>{{li.name}}</option>
          </select>
      <div class="but">
      
      <div id="main1" ref="chart" style="width:100%; height:600px;padding-top: 80px;"></div>    
    </div>
           <table style="width: 80%;margin:30px auto;">
            <thead>
              <tr>                               
				<td>UV</td>
				<td>PV</td>
                <td>销量</td>
                <td>销售额</td>
				<td>支付父订单</td>
				<td>付款人数</td>
              </tr>
            </thead>
            <tbody v-for="li in tableB">
              <tr>									
					<td>{{ li.uv }}</td>
					<td>{{ li.pv }}</td>
					<td>{{ li.sales_volume }}</td>
					<td>{{ li.alipay_auction_num }}</td>
					<td>{{ li.alipay_order_num }}</td>
					<td>{{ li.alipay_winner_num }}</td>
              </tr>
            </tbody>
          </table>
  </div>
  
  `,
  //id
  props: ["sellerid"],
  data: function () {
    return {
      url: $api.SPTarget,
      sellerid: '',
      auctionid: '',
	  auctionid1:'',
      analyzeArr: [],
      selectedId: '',
      selectedIdB:'',
	  start :getDay(-8),
	  end : getDay(-1),
      selectA: [],
	  selectB: [],
      pcFlow: [120, 432, 213, 54, 160, 730, 910],
      pcMoney: [101, 122, 321, 54, 260, 430, 710],
      timeData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
	  pcFlow1: [120, 432, 213, 54, 160, 730, 910],
      pcMoney1: [101, 122, 321, 54, 260, 430, 710],
      timeData1: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      onOff: true,
      showCal: true,
	   tableA : [],
	   tableB : [],
	   imgone : null,
	   imgtwo : null
    }
  },
  mounted() {
    var $this = this;
    setTimeout(() => {
		
      $this.echart($this.pcFlow, $this.pcMoney, $this.timeData);
      $this.echart2($this.pcFlow1, $this.pcMoney1, $this.timeData1);
    }, 100)

  },
  methods: {
    echart2(pcFlow, pcMoney, timeData) {
      var $this = this;

      var myChart = echarts.init(document.getElementById('main1'));

      var option = {
        title: {
          text: '',
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
       
          data: [
            {
              name: 'UV',

              textStyle: {
                padding: [10, 30],
                backgroundColor: '#61a0a8',
                fontSize: '16',
                color: '#fff'
              },
              icon: "path://m"
            },
            {
              name: '成交金额',
              
              textStyle: {
                padding: [10, 30],
                backgroundColor: '#f19898',
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
            name: 'UV',
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
            name: '成交金额',
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
    echart(pcFlow, pcMoney, timeData) {
      var $this = this;

      var myChart = echarts.init(document.getElementById('main'));

      var option = {
        title: {
          text: '',
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
       
          data: [
            {
              name: 'UV',

              textStyle: {
                padding: [10, 30],
                backgroundColor: '#61a0a8',
                fontSize: '16',
                color: '#fff'
              },
              icon: "path://m"
            },
            {
              name: '成交金额',
              
              textStyle: {
                padding: [10, 30],
                backgroundColor: '#f19898',
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
            name: 'UV',
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
            name: '成交金额',
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
          }
         
        ]
      };
      myChart.clear();
      myChart.setOption(option);
     
    },
    click_yesterday() {
		var $this = this;
		$this.start = getDay(-2);
		$this.end = getDay(-1);
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : getDay(-8),
						endTime : getDay(-1),
						auctionId : $this.auctionid
					},
					success : function(data){
									$this.pcFlow=[];
									$this.pcMoney=[];
									$this.timeData=[];
									$this.tableA = [];
							//console.log(data);
							if(data.data.length != 0){
								$this.tableA = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow.push(data.data[i].pv);
									$this.pcMoney.push(data.data[i].alipay_trade_amt);
									$this.timeData.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart($this.pcFlow,$this.pcMoney,$this.timeData);
   
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : getDay(-8),
						endTime : getDay(-1),
						auctionId : $this.auctionid1
					},
					success : function(data){
									$this.pcFlow1=[];
									$this.pcMoney1=[];
									$this.timeData1=[];
									$this.tableB = [];
							console.log(data);
							if(data.data.length != 0){
								$this.tableB = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow1.push(data.data[i].pv);
									$this.pcMoney1.push(data.data[i].alipay_trade_amt);
									$this.timeData1.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart2($this.pcFlow1,$this.pcMoney1,$this.timeData1);
  
		console.log("------------"+$this.tableA);
	console.log("++++++++"+$this.tableB);	
  },
    click_sever() {
      //七日流量
      var $this = this;
		$this.start = getDay(-8);
		$this.end = getDay(-1);
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid
					},
					success : function(data){
									$this.pcFlow=[];
									$this.pcMoney=[];
									$this.timeData=[];
									$this.tableA = [];
							//console.log(data);
							if(data.data.length != 0){
								$this.tableA = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow.push(data.data[i].pv);
									$this.pcMoney.push(data.data[i].alipay_trade_amt);
									$this.timeData.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart($this.pcFlow,$this.pcMoney,$this.timeData);
   
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid1
					},
					success : function(data){
									$this.pcFlow1=[];
									$this.pcMoney1=[];
									$this.timeData1=[];
									$this.tableB = [];
							console.log(data);
							if(data.data.length != 0){
								$this.tableB = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow1.push(data.data[i].pv);
									$this.pcMoney1.push(data.data[i].alipay_trade_amt);
									$this.timeData1.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart2($this.pcFlow1,$this.pcMoney1,$this.timeData1);
    },
    click_thirty() {
      var $this = this;
		$this.start = getDay(-31);
		$this.end = getDay(-1);
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid
					},
					success : function(data){
									$this.pcFlow=[];
									$this.pcMoney=[];
									$this.timeData=[];
									$this.tableA = [];
							//console.log(data);
							if(data.data.length != 0){
								$this.tableA = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow.push(data.data[i].pv);
									$this.pcMoney.push(data.data[i].alipay_trade_amt);
									$this.timeData.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart($this.pcFlow,$this.pcMoney,$this.timeData);
   
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid1
					},
					success : function(data){
									$this.pcFlow1=[];
									$this.pcMoney1=[];
									$this.timeData1=[];
									$this.tableB = [];
							console.log(data);
							if(data.data.length != 0){
								$this.tableB = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow1.push(data.data[i].pv);
									$this.pcMoney1.push(data.data[i].alipay_trade_amt);
									$this.timeData1.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart2($this.pcFlow1,$this.pcMoney1,$this.timeData1);
    },
    click_custom() {
		$this = this;
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
			$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid
					},
					success : function(data){
									$this.pcFlow=[];
									$this.pcMoney=[];
									$this.timeData=[];
									$this.tableA = [];
							//console.log(data);
							if(data.data.length != 0){
								$this.tableA = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow.push(data.data[i].pv);
									$this.pcMoney.push(data.data[i].alipay_trade_amt);
									$this.timeData.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart($this.pcFlow,$this.pcMoney,$this.timeData);
   
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid1
					},
					success : function(data){
									$this.pcFlow1=[];
									$this.pcMoney1=[];
									$this.timeData1=[];
									$this.tableB = [];
							console.log(data);
							if(data.data.length != 0){
								$this.tableB = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow1.push(data.data[i].pv);
									$this.pcMoney1.push(data.data[i].alipay_trade_amt);
									$this.timeData1.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
			$this.echart2($this.pcFlow1,$this.pcMoney1,$this.timeData1);
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
	  for(var i = 0;i<$this.selectA.length;i++){
		  if($this.selectA[i].auction_id_1 == $this.auctionid){
			  $this.imgone = $this.selectA[i].picture;
		  }
	  }
	  for(var i = 0;i<$this.selectB.length;i++){
		  if($this.selectB[i].auction_id_2 == $this.auctionid1){
			  $this.imgtwo = $this.selectB[i].picture;
		  }
	  }
	  console.log($this.auctionid);
		addA();
		addB();
		$this.echart($this.pcFlow, $this.pcMoney, $this.timeData);
    });
	bus.$on("getBid", function (updata) { //注意this指向问题
      $this.sellerid = updata.sellerid;
	  $this.auctionid1 = updata.auctionid1;
	  //console.log($this.auctionid1);
	  addC();
	  $this.echart2($this.pcFlow1, $this.pcMoney1, $this.timeData1);
    });
	//宝贝名称
	$.ajax({
					url : $api.sp_getAuction_1,
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
							console.log(data.data);
							$this.selectA=[];
							if(data.data.length != 0){
								$this.selectA = data.data;
								$this.selectedId = data.data[0].auction_id_1;
								$this.imgone = data.data[0].picture;
							}
					},
					error : function(err){
						console.log(err);
					}
			});

	//趋势图1
	function addA(){
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid
					},
					success : function(data){
									$this.pcFlow=[];
									$this.pcMoney=[];
									$this.timeData=[];
									$this.tableA = [];
							//console.log(data);
							if(data.data.length != 0){
								$this.tableA = data.data;
								for (var i=0;i<data.data.length;i++){
									$this.pcFlow.push(data.data[i].uv);
									$this.pcMoney.push(data.data[i].alipay_trade_amt);
									$this.timeData.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
	};
		function addC(){
		$.ajax({
					url : $api.sp_getAuction_1_info,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid1
					},
					success : function(data){
									$this.pcFlow1=[];
									$this.pcMoney1=[];
									$this.timeData1=[];
							//console.log(data);
							if(data.data.length != 0){
								$this.tableB = [];
								for (var i=0;i<data.data.length;i++){
									$this.tableB = data.data;
									$this.pcFlow1.push(data.data[i].uv);
									$this.pcMoney1.push(data.data[i].alipay_trade_amt);
									$this.timeData1.push(data.data[i].thedate);
								}
							}
					},
					error : function(err){
						console.log(err);
					}
			});
	};
	function addB(){
		$.ajax({
					url : $api.sp_getAuction_2,
					type : 'post',
					dataType : 'json',
					async: false,
					data : {
						//4140170749
						//$this.sellerid
						sellerId : $this.sellerid,
						startTime : $this.start,
						endTime : $this.end,
						auctionId : $this.auctionid
					},
					success : function(data){
							$this.selectB = [];
							//console.log(data.data);
							if(data.data.length != 0){
								$this.selectB = data.data;
								$this.selectedIdB = data.data[0].auction_id_2;
								$this.imgtwo = data.data[0].picture;
							}
					},
					error : function(err){
						console.log(err);
					}
			});
	};
	
	//console.log("------------"+$this.tableA);
	//console.log("++++++++"+$this.tableB);	
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
					sellerid  : $this.sellerid
                };
				
                //console.log(updata);
                // 将选中的ID放到触发器的盆子里，下面拿着用
                bus.$emit("getAid", updata);
				
            };
          },
		  deep:true
    },
    selectedIdB: {
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
					
                    auctionid1: $this.selectedIdB,
					sellerid  : $this.sellerid                 
                };
                //console.log(updata);
                // 将选中的ID放到触发器的盆子里，下面拿着用
                bus.$emit("getBid", updata);
				
            };
          },
		  deep:true
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
