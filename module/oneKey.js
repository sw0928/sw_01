/**
 * 伟伟
 * 2018/11/26
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


/*一键分析*/
Vue.component('v-one-key', {
  template: `
  <div>
  <div class="but">
  <button class="com" @click="click_yesterday()">昨日</button>
  <button class="com" @click="click_sever()">近7天</button>
  <button class="com" @click="click_thirty()">近30天</button>
  <button class="other" @click="click_custom()">自定义</button>
  <input type="text" class="active" placeholder="请选择日期" id="test1">

</div>
<div class="tab_col" v-show='showCalen'>
  <table border="1" >
    <tr>
      <td>序号</td>
      <td>宝贝</td>
      <td>销售</td>
      <td>销售额</td>
      <td>iPV</td>
      <td>iUV</td>
      <td>拍下件数</td>
      <td>拍下金额</td>
      <td>加购人数</td>
      <td>支付转化率</td>

    </tr>
    <tr v-for="(li, index) in allData">
      <td>{{index+1}}</td>
      <td>
      <img class="fl" :src="li.pic_url" alt="">
      <div class="fl ">
        <p>{{li.name}}</p>
        <a href="property.html">属</a>
        <a href="seek_optimize.html">词</a>
        <a href="relevance.html">联</a>
      </div>
      </td>
      <td>{{li.gmv_auction_num}}</td>
      <td>{{li.gmv_trade_amt}}</td>
      <td>{{li.ipv}}</td>
      <td>{{li.iuv}}</td>
      <td>{{li.alipay_trade_amt}}</td>
      <td>{{li.same_day_trade_amt}}</td>
      <td>{{li.add_cart_user_num}}</td>
      <td>{{li.alipay_order_rate}}</td>
    </tr>
  </table>
  <div style="text-align:center" id="page"></div>
</div>
	<img class="noData_img" src="../img/vNodata.png" v-show='!showCalen'>
  </div>
  
  `,
  //id
  props: ["sellerid"],
  data:function()
  {
      return {
        sellerid: '',
        url: $api.SPTarget,
		showCalen:true,
		total : 0,
        allData: [{
            img: "../img/001.jpg",
            title: "路径层qweqweqw",
            num:'3333',
            销售额:'3333',
            iPV:'3333',
            iUV:'3333',
            拍下件数:'3333',
            拍下金额:'3333',
            加购人数:'3333',
            支付转化率:'3333',
           
        },{
          img: "../img/001.jpg",
          title: "路径层qweqweqw",
          num:'32333',
          销售额:'33133',
          iPV:'33313',
          iUV:'33133',
          拍下件数:'31333',
          拍下金额:'33133',
          加购人数:'33133',
          支付转化率:'33133',
         
      },{
        img: "../img/001.jpg",
        title: "路径层qweqweeqw",
        num:'33213',
        销售额:'333223',
        iPV:'344333',
        iUV:'33133',
        拍下件数:'3333',
        拍下金额:'33323',
        加购人数:'33233',
        支付转化率:'33233',
       
    }], //处理后的数据结构
        mapShow: true, //显示无数据图片
		//分页条  日期  参数
		defaultStartTime : getDay(-7),
		defaultEndTime : getDay(-1)
      };
  },
  mounted() {
    var $this = this;
    setTimeout(() => {
      $this.page()
    }, 100)

  },
  methods: {
    page(){
	  var $this = this;	
	  $this.doPage($this.sellerid,getDay(-7),getDay(-1));
      layui.use([ 'laypage', 'element', ], function () {
        var  laypage = layui.laypage //分页           
          , element = layui.element ;//元素操作
        //自定义样式
		
				
        laypage.render({
          elem: 'page'
          , count: $this.total
          , theme: '#1E9FFF',
		  limit : 5
		  ,jump: function(obj, first){		
			var curr = obj.curr;
			$this.addData($this.sellerid,$this.defaultStartTime,$this.defaultEndTime,curr)
				
			
		}
        });
		
      })
    },
    click_yesterday() {
		var $this = this;
	  $this.doPage($this.sellerid,getDay(-2),getDay(-1));
		layui.use([ 'laypage', 'element', ], function () {
        var  laypage = layui.laypage //分页           
          , element = layui.element ;//元素操作
        //自定义样式						
        laypage.render({
          elem: 'page'
          , count: $this.total
          , theme: '#1E9FFF',
		  limit : 5
		  ,jump: function(obj, first){		
			var curr = obj.curr;
			$this.addData($this.sellerid,getDay(-2),getDay(-1),curr)							
		}
        });
		
      })
    },
    
    click_sever() {
      var $this = this;
	  $this.doPage($this.sellerid,getDay(-8),getDay(-1));
		layui.use([ 'laypage', 'element', ], function () {
        var  laypage = layui.laypage //分页           
          , element = layui.element ;//元素操作
        //自定义样式						
        laypage.render({
          elem: 'page'
          , count: $this.total
          , theme: '#1E9FFF',
		  limit : 5
		  ,jump: function(obj, first){		
			var curr = obj.curr;
			$this.addData($this.sellerid,getDay(-8),getDay(-1),curr)							
		}
        });
		
      })
    },
    click_thirty() {
      var $this = this;
	  $this.doPage($this.sellerid,getDay(-31),getDay(-1));
		layui.use([ 'laypage', 'element', ], function () {
        var  laypage = layui.laypage //分页           
          , element = layui.element ;//元素操作
        //自定义样式						
        laypage.render({
          elem: 'page'
          , count: $this.total
          , theme: '#1E9FFF',
		  limit : 5
		  ,jump: function(obj, first){		
			var curr = obj.curr;
			$this.addData($this.sellerid,getDay(-31),getDay(-1),curr)							
		}
        });
		
      })
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
          console.log(value); //得到日期生成的值，如：2017-08-18
          //console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
         // console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
		   var a = value.split("-");
		  var start = a[0].split("/");
			  var end = a[1].split("/");
			  var startTime1 = start[0]+""+start[1]+""+start[2];
			  var endTime2 = end[0]+""+end[1]+""+end[2];
			
		$this.doPage($this.sellerid,startTime1,endTime2);
		layui.use([ 'laypage', 'element', ], function () {
        var  laypage = layui.laypage //分页           
          , element = layui.element ;//元素操作
        //自定义样式						
        laypage.render({
          elem: 'page'
          , count: $this.total
          , theme: '#1E9FFF',
		  limit : 5
		  ,jump: function(obj, first){		
			var curr = obj.curr;
			$this.addData($this.sellerid,startTime1,endTime2,curr)							
		}
        });
		
      })
		}
      });
    },
	doPage(sellerId,startTime,endTime){
		var $this = this;
		$.ajax({
						url : $api.sellerCount,
						type : 'post',
						dataType : 'json',
						async: false,
						data : {
							//27191771
							//$this.sellerid
							sellerId : sellerId,
							startTime : startTime ,
							endTime : endTime,
							//577078628759
							//$this.auctionid
							//auctionId : 577078628759,
						},
						success : function(data){
							
							 $this.total =  data.data[0].totals;
						},
						error : function(err){
							console.log(err);
						}
					});
	},
	addData(sellerId,startTime,endTime,curr){
		var $this = this;
		//一键分析
				$.ajax({
						url : $api.sp_auction_analyze,
						type : 'post',
						dataType : 'json',
						async: false,
						data : {
							//27191771
							//$this.sellerid
							sellerId : sellerId,
							startTime : startTime ,
							endTime : endTime,
							//577078628759
							//$this.auctionid
							//auctionId : 577078628759,
							pageSize :	5,
							currPage : curr
						},
						success : function(data){
							$this.allData = [];
							if(data.data.length == 0 || data.data == null){
								$this.showCalen = false
							}else{
								$this.allData = data.data
								$this.showCalen = true;
							}
							console.log($this.allData);
						},
						error : function(err){
							console.log(err);
						}
					});
	}
  },
  created() {
    var $this = this;

    //接收器，接收上面的两个ID
    bus.$on("getAid", function (updata) { //注意this指向问题
      $this.sellerid = updata.sellerid;
      $this.auctionid = updata.auctionid;

    });
	$.ajax({
						url : $api.sellerCount,
						type : 'post',
						dataType : 'json',
						async: false,
						data : {
							//27191771
							//$this.sellerid
							sellerId : $this.sellerid,
							startTime : $this.defaultStartTime ,
							endTime : $this.defaultEndTime,
							//577078628759
							//$this.auctionid
							//auctionId : 577078628759,
						},
						success : function(data){
							total = data.data[0].totals;
						},
						error : function(err){
							console.log(err);
						}
					});
	//一键分析
	// $.ajax({
			// url : $api.sp_auction_analyze,
			// type : 'post',
			// dataType : 'json',
			// async: false,
			// data : {
				// //27191771
				// //$this.sellerid
				// sellerId : $this.sellerid,
				// startTime : getDay(-7),
				// endTime : getDay(-1),
				// //577078628759
				// //$this.auctionid
				// //auctionId : 577078628759,
				// pageSize :	5,
				// currPage : 1
			// },
			// success : function(data){
				// console.log(data.data);
				// $this.allData = [];
				// if(data.data.length == 0 ||data.data == null){
					// $this.showCalen = false
				// }else{
					// $this.allData =data.data;
					// $this.showCalen = true;
				// }
				// $this.defaultEndTime = getDay(-8);
				// $this.defaultEndTime = getDay(-1);
			// },
			// error : function(err){
				// console.log(err);
			// }
		// });


  },
  watch: {
  
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

