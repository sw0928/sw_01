/**
 * 伟伟
 * 2018/11/08
 * 模快三
 */
function getSid($this) {
	var sellerid = sessionStorage.getItem('sellerId');
	//console.log("店铺Id"+sellerid);
	var shopname = sessionStorage.getItem('shopname');
	// console.log("店铺名称"+shopname);

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


/*分平台流量*/
Vue.component('v-shop-echart', {
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
    <p>分平台流量占比与构成</p>
    <div class="fl" id="echart_left"></div>
    <div class="fl" id="echart_right"></div>
    <div class="but2">
      <a @click="shop_alay_flow()" class="addColor2">流量</a>
      <a @click="shop_alay_deal()">成交</a>
    </div>
</div>
  </div>
  
  `,
	//id
	props: ["sellerid"],
	data: function () {
		return {
			url: $api.subPlatformTraffic,
			sellerId: '',
			auctionid: '',
			analyzeArr: [],
			pcFlow: [120, 432, 213, 54, 160, 730, 910],
			pcMoney: [101, 122, 321, 54, 260, 430, 710],
			wirelessFlow: [10, 12, 21, 54, 260, 830, 710],
			wirelessMoney: [401, 322, 421, 154, 160, 1430, 410],
			timeData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			pcName: [],
			wifiName: [],
			wifiUv: [],
			wifiTrade: [],
			pcUv: [],
			pcTrade: [],			
			PC_proportion: 1212,
			value: '0',
			wireless_proportion: 2222,
			onOff: true,
			showCal: true,
			start: getDay(-8),
			end: getDay(-1)
		}
	},
	mounted() {
		var $this = this;
		setTimeout(() => {
			$this.echart($this.pcFlow, $this.pcMoney, $this.wirelessFlow, $this.wirelessMoney, $this.timeData, false);
			//$this.echart_left($this.PC_proportion, $this.wireless_proportion);
			//$this.echart_right($this.name, $this.dataStr);
			$this.wifi_search();
			$this.pc_search();
			$this.shop_alay_flow();
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
				],
				animationDuration: 2000
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
						color: '#0099FF'
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
							{ value: PC_proportion, name: 'PC' },

							{ value: wireless_proportion, name: '无线' }
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
				],
				animationDuration: 2000
			};
			myChart.clear();
			myChart.setOption(option);
			myChart.off('click');
			myChart.on('click', function (params) {

				var time = {
					name: params.name,
					start: $this.start,
					end: $this.end
				};
				//console.log($this.wifiTrade);
				// 将选中的ID放到触发器的盆子里，下面拿着用
				bus.$emit("getTime", time);
				if ("无线" == params.name) {
					if($this.value =='0'){
						$this.echart_right($this.wifiName, $this.wifiUv);
					}else{
						$this.echart_right($this.wifiName, $this.wifiTrade);
					}
					
					
				} else {
					if($this.value =='0'){
						$this.echart_right($this.pcName, $this.pcUv);
					}else{
						$this.echart_right($this.pcName, $this.pcTrade);
					}
				}
			});
		},
		wifi_search() {
			var $this = this;
			$.ajax({
				url: $api.sp_shop_wifi_search_source_name,
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					//1683073417
					//$this.sellerid
					sellerId: $this.sellerid,
					startTime: $this.start,
					endTime: $this.end
				},
				success: function (data) {
					console.log(data);
					$this.wifiName = [];
					$this.wifiUv = [];
					$this.wifiTrade=[];
					if (data.data.length != 0) {
						for (var i = 0; i < data.data.length; i++) {
							$this.wifiName.push(data.data[i].src_id_name);
							var temp = { value: data.data[i].iuv, name: data.data[i].src_id_name };
							var str = 	{ value: data.data[i].pay_ord_cnt_holotree_lastbe_guide, name: data.data[i].src_id_name };
							$this.wifiUv.push(temp);
							$this.wifiTrade.push(str);
						}
					}
					//$this.echart_right($this.name, $this.dataStr);
					//console.log($this.dataStr);
				},
				error: function (err) {
					console.log(err);
				}
			});

		},
		pc_search() {
			var $this = this;
			$.ajax({
				url: $api.sp_shop_pc_search_source_name,
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					//1683073417
					//$this.sellerid
					sellerId: $this.sellerid,
					startTime: $this.start,
					endTime: $this.end
				},
				success: function (data) {
					console.log(data);
					$this.pcName = [];
					$this.pcUv = [];
					$this.pcTrade=[];
					if (data.data.length != 0) {
						for (var i = 0; i < data.data.length; i++) {
							$this.pcName.push(data.data[i].src_id_name);
							var temp = { value: data.data[i].iuv, name: data.data[i].src_id_name };
							var str = 	{ value: data.data[i].pay_ord_cnt_holotree_lastbe_guide, name: data.data[i].src_id_name };
							$this.pcUv.push(temp);
							$this.pcTrade.push(str);
						}
					}
					
				},
				error: function (err) {
					console.log(err);
				}
			});

		},
		echart_right(arr, dataStr) {
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
						color: '#0099FF'
					},
					data: arr
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
				],
				animationDuration: 2000
			};
			myChart.clear();
			myChart.setOption(option);

		},
		subPlat(){
			var $this = this;
				//分平台流量趋势
			$.ajax({
				url: $api.subPlatformTraffic,
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					sellerId: $this.sellerid,
					startTime: $this.start,
					endTime: $this.end
				},
				success: function (data) {
					$this.pcFlow = [];
					$this.pcMoney = [];
					$this.wirelessFlow = [];
					$this.wirelessMoney = [];
					$this.timeData = [];
					if (data.data.length != 0) {
						for (var i = 0; i < data.data.length; i++) {
							$this.pcFlow.push(data.data[i].pc_uv);
							$this.pcMoney.push(data.data[i].pc_alipay_trade_amt);
							$this.wirelessFlow.push(data.data[i].app_uv);
							$this.wirelessMoney.push(data.data[i].app_alipay_trade_amt);
							$this.timeData.push(data.data[i].thedate);
						}
					}
					console.log($this.pcFlow)

				},
				error: function (err) {
					console.log(err);
				}
			});
			$this.echart($this.pcFlow, $this.pcMoney, $this.wirelessFlow, $this.wirelessMoney, $this.timeData, true);
		},
		click_yesterday() {
			//昨日流量
			$('#shop_analyze .but2 a:nth-child(1)').addClass("addColor2");
			$('#shop_analyze .but2 a:nth-child(2)').removeClass("addColor2");
			var $this = this;
			$this.start = getDay(-2);
			$this.end = getDay(-1);
			$this.subPlat();
			$this.wifi_search();
			$this.pc_search();
			$this.shop_alay_flow();
		},
		click_sever() {
			//七日流量
			$('#shop_analyze .but2 a:nth-child(1)').addClass("addColor2");
			$('#shop_analyze .but2 a:nth-child(2)').removeClass("addColor2");
			var $this = this;
			$this.start = getDay(-8);
			$this.end = getDay(-1);
			$this.subPlat();
			$this.wifi_search();
			$this.pc_search();
			$this.shop_alay_flow();

		},
		click_thirty() {
			//三十天流量
			$('#shop_analyze .but2 a:nth-child(1)').addClass("addColor2");
			$('#shop_analyze .but2 a:nth-child(2)').removeClass("addColor2");
			var $this = this;
			$this.start = getDay(-31);
			$this.end = getDay(-1);

			$this.subPlat();
			$this.wifi_search();
			$this.pc_search();
			$this.shop_alay_flow();
		},
		click_custom() {
			$('#shop_analyze .but2 a:nth-child(1)').addClass("addColor2");
			$('#shop_analyze .but2 a:nth-child(2)').removeClass("addColor2");
			//自定义流量
			var $this = this;
			$(this).addClass('active');
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
					var startTime1 = start[0] + "" + start[1] + "" + start[2];
					var endTime2 = end[0] + "" + end[1] + "" + end[2];
					$this.start = startTime1;
					$this.end = endTime2;
					$this.subPlat();
					$this.wifi_search();
					$this.pc_search();
					$this.shop_alay_flow();
				},
			

			});
		},
		//流量按钮
		shop_alay_flow() {
			var $this = this;
			$this.value = '0';
			//搜索简报  全店搜索占比
			$.ajax({
				url: $api.sp_shop_view_proportion,
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					//27191771
					sellerId: $this.sellerid,
					startTime: $this.start,
					endTime: $this.end
				},
				success: function (data) {
					console.log(data);
					$this.PC_proportion = null;
					$this.wireless_proportion = null;
					if (data.data.length != 0) {
						$this.PC_proportion = data.data[0].pc_uv;
						$this.wireless_proportion = data.data[0].wifi_uv;
					}
					$this.echart_left($this.PC_proportion, $this.wireless_proportion);
					//console.log($this.PC_proportion);
				},
				error: function (err) {
					console.log(err);
				}
			});

			//来源名称
			$this.echart_right($this.wifiName, $this.wifiUv);


		},
		//成交按钮
		shop_alay_deal() {
			var $this = this;
			$this.value = '1';
			//来源名称
			$.ajax({
				url: $api.sp_shop_trade_proportion,
				type: 'post',
				dataType: 'json',
				async: false,
				data: {
					//1683073417
					//$this.sellerid
					sellerId: $this.sellerid,
					startTime: $this.start,
					endTime: $this.end
				},
				success: function (data) {
					//console.log(data);					
					$this.PC_proportion = data.data[0].pc_trade;
					$this.wireless_proportion = data.data[0].wifi_trade;
					
					$this.echart_left($this.PC_proportion, $this.wireless_proportion);
					
				},
				error: function (err) {
					console.log(err);
				}
			});
			
			//来源名称
			$this.echart_right($this.pcTrade, $this.wifiTrade);
		}
	},
	//页面初始化数据 默认展示过去七天的数据
	created() {

		var $this = this;

		//接收器，接收上面的两个ID
		bus.$on("getAid", function (updata) { //注意this指向问题
			$this.sellerid = updata.sellerid;
			$this.auctionid = updata.auctionid;

		});

		//搜索简报 分平台搜索趋势
		$.ajax({
			url: $api.subPlatformTraffic,
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				sellerId: $this.sellerid,
				startTime: $this.start,
				endTime: $this.end
			},
			success: function (data) {
				$this.pcFlow = [];
				$this.pcMoney = [];
				$this.wirelessFlow = [];
				$this.wirelessMoney = [];
				$this.timeData = [];
				if (data.data.length != 0) {
					for (var i = 0; i < data.data.length; i++) {
						$this.pcFlow.push(data.data[i].pc_uv);
						$this.pcMoney.push(data.data[i].pc_alipay_trade_amt);
						$this.wirelessFlow.push(data.data[i].app_uv);
						$this.wirelessMoney.push(data.data[i].app_alipay_trade_amt);
						$this.timeData.push(data.data[i].thedate);
					}
				}
				//console.log($this.pcFlow)

			},
			error: function (err) {
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
})
//填写数字获取日期，参数为0 代表今天日期
//流量质量分析
Vue.component('v-shop-quality', {
	template: `
  <div>
      <p>流量质量分析</p>
      <div class="ten_col">
      
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
	  <table class="layui-hide" id="test2" lay-filter="test2"></table>
      
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
			dataStr: [],
			start: getDay(-8),
			end: getDay(-1),
			arr: [
				{ field: 'src_id_name', title: '来源名称', align: 'center' },
				{ field: 'pay_ord_amt_holotree_lastbe_guide', title: '支付金额', align: 'center' }
				, { field: 'pay_ord_byr_cnt_holotree_lastbe_guide', title: '支付买家数', align: 'center' }				
				, { field: 'pay_ord_item_qty_holotree_lastbe_guide', title: '支付商品', align: 'center' }
				, { field: 'vst_pay_byr_rate_holotree_lastbe_guide', title: '转化率', align: 'center' }
			],
			arr1: [
				{ field: 'src_id_name', title: '来源名称', align: 'center' },
				{ field: 'pay_ord_amt_holotree_lastbe_guide', title: '支付金额', align: 'center' }
				, { field: 'crt_ord_byr_cnt_holotree_lastbe_guide', title: '下单买家数', align: 'center' }
				, { field: 'pay_ord_byr_cnt_holotree_lastbe_guide', title: '支付买家数', align: 'center' }
				, { field: 'iuv', title: '独立访客数', align: 'center' }
				, { field: 'crt_ord_amt_holotree_lastbe_indirectbe', title: '下单金额', align: 'center' }
				, { field: 'pay_ord_cnt_holotree_lastbe_guide', title: '子订单数', align: 'center' }
				, { field: 'one_price', title: '一次客单价', align: 'center' }
				, { field: 'crt_ord_cnt_holotree_lastbe_guide', title: '下单子订单', align: 'center' }
				, { field: 'pay_ord_item_qty_holotree_lastbe_guide', title: '支付商品', align: 'center' }
				, { field: 'vst_pay_byr_rate_holotree_lastbe_guide', title: '转化率', align: 'center' }
				, { field: 'crt_ord_item_qty_holotree_lastbe_guide', title: '下单商品数', align: 'center' }
			],
			nav_data: [
				{ 'name': 'src_id_name', 'title': '来源名称' },
				{ 'name': 'pay_ord_amt_holotree_lastbe_guide', 'title': '支付金额' },
				{ 'name': 'crt_ord_byr_cnt_holotree_lastbe_guide', 'title': '下单买家数' },
				{ 'name': 'pay_ord_byr_cnt_holotree_lastbe_guide', 'title': '支付买家数' },
				{ 'name': 'iuv', 'title': '独立访客数' },
				{ 'name': 'crt_ord_amt_holotree_lastbe_indirectbe', 'title': '下单金额' },
				{ 'name': 'pay_ord_cnt_holotree_lastbe_guide', 'title': '子订单数' },
				{ 'name': 'one_price', 'title': '一次客单价' },
				{ 'name': 'crt_ord_cnt_holotree_lastbe_guide', 'title': '下单子订单' },
				{ 'name': 'pay_ord_item_qty_holotree_lastbe_guide', 'title': '支付商品' },
				{ 'name': 'vst_pay_byr_rate_holotree_lastbe_guide', 'title': '转化率' },
				{ 'name': 'crt_ord_item_qty_holotree_lastbe_guide', 'title': '下单商品数' },

			],
			onOff: true,
			showCal: true,

		}
	},
	created() {
		var $this = this;
		bus.$on("getTime", function (time) { //注意this指向问题
			$this.start = time.start;
			$this.end = time.end;
			$this.sear_name = time.name;
			console.log($this.end, $this.sear_name, $this.start);
			if ('PC' == $this.sear_name) {
				$.ajax({
					url: $api.sp_shop_source_analyze_pc,
					type: 'post',
					dataType: 'json',
					async: false,
					data: {
						sellerId: $this.sellerid,
						startTime: $this.start,
						endTime: $this.end
					},
					success: function (data) {
						console.log(data);
						if (data.data.length == 0 || data.data == null) {
							$this.add($this.arr, '');
							//console.log(data);
						} else {
							$this.add($this.arr, data.data);
							$this.addData($this.arr1, $this.dataStr)
						}


					},
					error: function (err) {
						console.log(err);
					}
				});
			};
			if ('无线' == $this.sear_name) {
				$.ajax({
					url: $api.sp_shop_source_analyze_wifi,
					type: 'post',
					dataType: 'json',
					async: false,
					data: {
						sellerId: $this.sellerid,
						startTime: $this.start,
						endTime: $this.end
					},
					success: function (data) {
						console.log(data);
						if (data.data.length == 0 || data.data == null) {
							$this.add($this.arr, '');
							//console.log(data);
						} else {
							$this.add($this.arr, data.data);
							$this.addData($this.arr1, $this.dataStr)
						}

					},
					error: function (err) {
						console.log(err);
					}
				});
			}
		});
		//首次渲染
		$.ajax({
			url: $api.sp_shop_source_analyze_pc,
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				sellerId: $this.sellerid,
				startTime: $this.start,
				endTime: $this.end
			},
			success: function (data) {
				console.log(data);
				var temp = [];
				if (data.data.length != 0) {
					$this.dataStr = data.data;
				}

			},
			error: function (err) {
				console.log(err);
			}
		});
	},
	mounted() {
		var $this = this;
		setTimeout(() => {
			$this.add($this.arr, $this.dataStr);
			$this.addData($this.arr1, $this.dataStr)
		}, 100)

	},
	methods: {
		add(arr, data) {
			layui.use('table', function () {
				let table = layui.table; //表格


				table.render({
					elem: '#test'
					, title: '用户数据表'
					, cols: [arr]
					, data: data

				});


			});
		},
		addData(arr, data) {
			//流量质量分析  pc
			layui.use('table', function () {
				let table = layui.table; //表格


				table.render({
					elem: '#test2'
					, title: '用户数据表'
					, cols: [arr]
					, data: data
					, done: function (res, curr, count) {
						$("[lay-id='test2']").css('display', 'none');
					}

				});


			});

		},
		more() {
			$('#shop_top_ten .ten_col .layui-form').show();
			//默认选中的列
			$('.layui-form-item .checkbox1 input').prop('checked', false);
			$('.layui-form-item .checkbox1 input').attr("disabled", false);
			$('.layui-form-item .checkbox1 input').parent().css('color', '#333')

			$('.layui-form-item .checkbox1 label').eq(0).css('display', 'none');
		},
		del() {
			$('#shop_top_ten .ten_col .layui-form').hide();
		},
		wacth() {
			var $this = this
			layui.use('form', function () {
				var form = layui.form;
				//监听确定
				form.on('submit(form)', function (data) {
					console.log(data);
					var value = $('#select').val();
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
					$this.add(out_arr, $this.dataStr);
					//$this.MergeCells(0);
					return false;
				});


			})

		},
		//合并单元格函数(cellIndex  代表合并td的索引)
		MergeCells(cellIndex) {
			var $tr = $(".layui-table-body table tbody tr");
			var companyList = new Array();

			//获得所有公司的名称
			$.each($tr, function (index, ele) {
				var text = $(ele).find("td").eq(cellIndex).text();
				companyList.push(text);
			});

			//公司名称分组统计
			var hist = {};
			companyList.map(function (a) {
				if (a in hist)
					hist[a]++;
				else
					hist[a] = 1;
			});

			//记录操作表格信息（起始TR索引，结束TR索引，合并行数，公司名称）
			var list = new Array();
			var temp = "";
			$.each(companyList, function (index, ele) {
				var obj = new Object();
				if (temp != ele) {
					temp = ele;
					obj.FirstIndex = index;
					obj.RowSpan = hist[ele];
					obj.EndIndex = index + obj.RowSpan - 1;
					obj.Name = ele;
					list.push(obj);
				}
			});

			//合并表格
			$.each(list, function (index, ele) {
				//设置rowspan
				$("table tbody tr:eq(" + ele.FirstIndex + ") td:eq(" + cellIndex + ")").attr("rowspan", ele.RowSpan);
				//清除多余行数
				var $removeTr = $("table tbody tr:gt(" + ele.FirstIndex + "):lt(" + ele.EndIndex + ")");
				$.each($removeTr, function (removeIndex, removeEle) {
					if ($(removeEle).children("td:eq(" + cellIndex + ")").text() == ele.Name) {
						$(removeEle).children("td:eq(" + cellIndex + ")").remove();
					}
				});
			});
		}
	},
})

function getDay(day) {
	//Date()返回当日的日期和时间。
	var days = new Date();
	//getTime()返回 1970 年 1 月 1 日至今的毫秒数。
	var gettimes = days.getTime() + 1000 * 60 * 60 * 24 * day;
	//setTime()以毫秒设置 Date 对象。
	days.setTime(gettimes);
	var year = days.getFullYear();
	var month = days.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	var today = days.getDate();
	if (today < 10) {
		today = "0" + today;
	}
	return year + "" + month + "" + today;
}


