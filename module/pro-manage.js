
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
//促销星级模块
Vue.component("v-pro-star", {
    template: `
        <div id="pro_star" class="b1">
            <h2 class="hot_module_title" style="margin-top:0; margin-bottom:20px;">促销星级</h2> 
            <div class="yestoday_pro_star pro_star_wrap">
                <p class="pro_star_title">昨天促销星级:</p>
                <div class="star" v-bind:dataScore="dataScore" ></div>

                <p v-if="dataScore >=5" class="pro_star_alert green_alert" style="background:#d8eadc; color:#18af37;">记得提升常态销售哦！</p>
                <p v-else class="pro_star_alert red_alert" style="background:#ffe5e5; color:#ff3939;">呀！生意不够激情！加把火！</p>
            </div>
            <div class="week_pro_star pro_star_wrap">
                <p class="pro_star_title">近7天促销星级:</p>
                <div class="star1" v-bind:weekSatrCount="weekSatrCount" ></div>
               
                <p v-if="weekSatrCount >=5" class="pro_star_alert green_alert" style="background:#d8eadc; color:#18af37;">记得提升常态销售哦！</p>
                <p v-else class="pro_star_alert red_alert" style="background:#ffe5e5; color:#ff3939;">呀！生意不够激情！加把火！</p>
            </div>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            url: $api.SPTarget, //sp地址
            dataScore: '', //昨天促销星级
            weekSatrCount: '', //近七天促销星级
        }
    },
	 
    watch: {
        sellerid: function() {
            this.starData();
        }
    },
	created() {
        
        this.starData();
        
    },
    methods: {
        starData: function() {
            var $this = this;
			
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_StarLevel_Plot',
                    params: $this.sellerid
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    //给星级赋值
                    console.log(data)
                    if (data) {
                        $this.dataScore = data.data[0].T1_StarLevel;
                        $this.weekSatrCount = data.data[0].T7_StarLevel;
                    };
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            }) 
        }
    },
	
});

//30天店铺促销节点提醒
Vue.component('v-after-node-remind', {
    template: `
        <div class="calendar_wrap b1">
            <h2 class="hot_module_title" style=" margin-bottom:30px;">30天店铺促销节点提醒</h2>
            <div v-show='showCalen'>
                <div class="calendar_box">
                    <div id="calendar" class="calendar">
                        <v-calendar-second :sellerid="sellerid"></v-calendar-second>
                    </div>
                    <div class="calendar_remind">
                        <ul>
                            <li class="clearfix" v-for="(l,index) in planData" >
                                <p class="calendar_remind_text">提醒</p>
                                <div class="fl">
                                <p class="data"><span>{{toDate(l.stratdate,l.enddate)}}</span>促销</p>
                                    <div>
                                        <span class="fl">活动促销星级：</span>
                                        <div class="starTwo" v-bind:dataScore="l.StarLevel"></div>										
                                    </div>
                                </div>
                                
                            </li>
                           
                        </ul>
                    </div>
                </div>
            </div>
            <img class="noData_img" src="../img/vNodata.png" v-show='!showCalen'>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            url: $api.SPTarget,
            showCalen: true, //无数据图片
            planData: [], //策划的数据条数
			sellerid:''
        }
    },
    created() {
		var $this = this;
		//console.log(sellerid);
        //请求数据
		 $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_before_Month_Reminder_Plot',
                    params: $this.sellerid
                },
                dataType: "json",
                async: false,
                success: function(data) {
						console.log(data);
                    //若无数据，则显示无数据图片
                    if (data.data == "") {
                        $this.showCalen = false;
                    } else {
                        $this.showCalen = true;
                    }
                    //将请求的数据赋值给replyData
                    $this.planData = data.data;
                },
                error: function(xhr) {
                   
                }
            }); 
    },
   
    methods: {
			
        //点击活动策划按钮，跳转页面
        activePlan: function(subject, type, date) {
            //将值存储在对象中
            var planCookie = {
                "activity_subject": subject,
                "activity_type": type,
                "stratdate": date
            };
            //cookie存储 点击时候获取的 内容
            //cookie只能存储键值对，所以强转类型
            setCookie("planCookie", JSON.stringify(planCookie), "h1");
            //跳转页面
            location.href = "activity-plan.html?sellerid=" + this.sellerid + "&source=1"
        },
        //时间戳转换
        toDate: function(startDate, endDate) {
            // 传入两个参数，开始时间和结束时间
            // 如果开始和结束时间相等 ，只输出一个时间
			startDate = startDate + (24 * 60 * 60 * 1000);
            if (endDate - startDate == 0) {
                return (toDate(startDate) + "-" + toDate(endDate))
            } else {
                return toDate(endDate)
            };
            //时间戳转换 
            function toDate(date) {
                if (date == null) {
                    return "";
                }
                var ndate = new Date(date);
                var Y = ndate.getFullYear() + '-';
                var M = ndate.getMonth() + 1 + '月';
                // var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + '月';
                var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate()) + '日';
                var h = (ndate.getHours() < 10 ? '0' + (ndate.getHours()) : ndate.getHours()) + ':';
                var m = (ndate.getMinutes() < 10 ? '0' + (ndate.getMinutes()) : ndate.getMinutes()) + ':';
                var s = (ndate.getSeconds() < 10 ? '0' + (ndate.getSeconds()) : ndate.getSeconds());
                ndate = M + D; // 输出 8月11日
                return ndate;
            }
        }
    }
});

//单独日历组件2
Vue.component('v-calendar-second', {
     template: `
        <div>
            <div id="calendar_content">
               <div class="layui-inline" id="test"></div>
            </div>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            currentDay: 1,
            currentMonth: 1,
            currentYear: 1970,
            currentWeek: 1,
            days: [],
            addDay: [],
            url: $api.SPTarget,
            sellerid: '',
            auctionid: '',
			dataSelect:[]
        }
    },
	 created: function() {
        //this.initData(null);
        var $this = this;
        //接收器，接收sellerid 和 auctionid            			
			//$('#test').html('');
            calAddDate();
			ddd();
			 setTimeout(() => {
		      $('.laydate-day-mark').parent().css('background','red');
			}, 100)
			
       
		function  ddd(){
			if($this.dataSelect.length == 0){
				return '';
			}else{
				laydate.render({
				elem: '#test' //指定元素
				, min: -30
				, max: 0
				, format: 'yyyy/MM/dd'
				,mark:$this.dataSelect
				 ,showBottom: false
				,position: 'static'
				, btns: ['confirm']
				,change: function(value, date, endDate){
					$('.laydate-day-mark').parent().css('background','red');
				  }
				
				});
				
			}
			
		};		
        function calAddDate() {
            //请求数据
            $.ajax({
                 url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Month_Reminder_Plot',
                    params: $this.sellerid 
                },
                dataType: "json",
                async: false,
                success: function(data) {					
                    $this.addDay = data.data;
					$this.dataSelect = [];					
						if($this.addDay.length != 0){	
							for (var i=0;i<$this.addDay.length;i++){
																
								$this.dataSelect.push($this.toData($this.addDay[i].enddate));
								
							}
							
							
						}
					$this.dataSelect = $this.sellected($this.dataSelect);
					  
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        }
    },
    methods: {
        toData: function (date) {
            if (date == null) {
                return "";
            }
            var ndate = new Date(date);
            var Y = ndate.getFullYear() + '-';
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + '-';
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());           
            ndate =Y + M + D;
			//console.log(ndate);
            return ndate;
        },
		sellected:function(data){
			if (data == null ||data.length == 0) {
                return {};
            }
			var r = new Object();
				for (var i = 0; i < data.length; i++){

					r[data[i]] = '';
				}
			 return r;
		}
	},
   
   
});

//下30天促销活动时间节点提醒
Vue.component('v-node-remind', {
    template: `
        <div class="calendar_wrap b1">
            <h2 class="hot_module_title" style=" margin-bottom:30px;">下30天促销活动时间节点提醒</h2>
            <div v-show='showCal'>
                <div class="calendar_box">
                    <div id="calendar" class="calendar">
                        <v-calendar :sellerid="sellerid"></v-calendar>
                    </div>
                    <div class="calendar_remind">
                        <ul>
                            <li class="clearfix" v-for="(l,index) in replyData">
                                <p class="calendar_remind_text">促销推荐时间节点</p>
                                <div class="fl">
                                    <p><span>{{toDate(l.stratdate,l.enddate)}}</span>促销</p>
                                    <div>
                                        <span class="fl">活动促销力度：</span>
                                        <div class="starTwo" v-bind:dataScore="l.StarLevel"></div>
                                    </div>
                                </div>
                               
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
            <img class="noData_img" src="../img/vNodata.png" v-show='!showCal'>           
            <div class="_fixed_box" v-show="fixedShow"></div>
        </div>
    `,
    //接收店铺id
    props: ["sellerid"],
    data: function() {
        return {
            url: $api.SPTarget,
            showCal: true, //是否显示无数据图片
            replyData: [], //复盘的条数
            noReShow: false, //无复盘活动确认
            fixedShow: false, // 遮罩层是否显示
        
        }
    },
    created() {
        var $this = this;
        $this.remindData(); //请求数据
    },
    methods: {
        remindData: function() {
            //请求数据
            var $this = this;
             $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Month_Reminder_Plot',
                    params: $this.sellerid
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    //若无数据，则显示无数据图片
                    if (data.data == "") {
                        $this.showCal = false;
                    } else {
                        $this.showCal = true;
                    }
                    //将请求的数据赋值给replyData
                    $this.replyData = data.data;
                },
                error: function(xhr) {
                   
                }
            }); 
        },
        //点击活动复盘，跳转到活动复盘页面
        activityReply: function(i, aid) {
            var $this = this;
            // 如果未进行活动策划，，则不可以进行复盘，出现弹出框
            if (typeof aid == 'undefined') {
                // 弹出提示框 遮罩层显示
                $this.noReShow = true;
                $this.fixedShow = true;
            } else {
                //若进行过策划，则直接跳转复盘页面
                var sentData = JSON.stringify($this.replyData[i]);
                $.cookie('replydata', sentData);
                location.href = "activity-reply.html?sellerid=" + this.sellerid;
            }

        },
        //无复盘活动确认
        noReplay: function() {
            // 弹出框关闭  遮罩层关闭
            this.noReShow = false;
            this.fixedShow = false;
        },
        // 判断两个日期是否相等，相等则显示一个，否则显示两个
        toDate: function(startDate, endDate) {
            // 传入两个参数，开始时间和结束时间
            // 如果开始和结束时间相等 ，只输出一个时间
            if (endDate - startDate == 0) {
                return toDate(startDate)
            } else {
                return (toDate(startDate) + "-" + toDate(endDate))
            };
            //时间戳转换 
            function toDate(date) {
                if (date == null) {
                    return "";
                }
                var ndate = new Date(date);
                var Y = ndate.getFullYear() + '-';
                var M = ndate.getMonth()*1 + 2 > 12 ? (ndate.getMonth()*1 + 2 - 12)+ '月' : (ndate.getMonth()*1 + 2 ) + '月';
                // var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + '月';
                var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate()) + '日';
                var h = (ndate.getHours() < 10 ? '0' + (ndate.getHours()) : ndate.getHours()) + ':';
                var m = (ndate.getMinutes() < 10 ? '0' + (ndate.getMinutes()) : ndate.getMinutes()) + ':';
                var s = (ndate.getSeconds() < 10 ? '0' + (ndate.getSeconds()) : ndate.getSeconds());
                ndate = M + D; // 输出 8月11日
                return ndate;
            }
        }
    }
 });


//单独日历组件
Vue.component('v-calendar', {
    template: `
        <div>
            <div id="calendar_content">
               <div class="layui-inline" id="test1"></div>
            </div>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            currentDay: 1,
            currentMonth: 1,
            currentYear: 1970,
            currentWeek: 1,
            days: [],
            addDay: [],
            url: $api.SPTarget,
            sellerid: '',
            auctionid: '',
			dataSelect:[]
        }
    },
	 created: function() {
        //this.initData(null);
        var $this = this;
        //接收器，接收sellerid 和 auctionid            			
			//$('#test').html('');
            calAddDate();
			ddd();
			
			 setTimeout(() => {
				
		      $('.laydate-day-mark').parent().css('background','red');
			}, 100)
			
       
		function  ddd(){
			if($this.dataSelect.length == 0){
				return '';
			}else{
				laydate.render({
				elem: '#test1' //指定元素
				,value: $this.toMon()
				//, min:  -0
				//, max:  30
				, format: 'yyyy/MM/dd'
				
				,mark:$this.dataSelect
				 ,showBottom: false
				,position: 'static'
				, btns: ['confirm']
				,change: function(value, date, endDate){
					$('td').css('background','#fff');
					$('.laydate-day-mark').parent().css('background','red');
				  }
				
				});
				
			}
			
		};		
        function calAddDate() {
            //请求数据
            $.ajax({
                 url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Month_Reminder_Plot',
                    params: $this.sellerid 
                },
                dataType: "json",
                async: false,
                success: function(data) {					
                    $this.addDay = data.data;
					$this.dataSelect = [];					
						if($this.addDay.length != 0){	
							console.log(data.data);
							for (var i=0;i<$this.addDay.length;i++){
															
								$this.dataSelect.push($this.toData($this.addDay[i].enddate));
								
							}
							
							
						}
					$this.dataSelect = $this.sellected($this.dataSelect);
					  
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        }
    },
    methods: {
        toData: function (date) {
            if (date == null) {
                return "";
            }
            var ndate = new Date(date);
            var Y = ndate.getFullYear();
            var M = (ndate.getMonth()+ 2 < 10 ? '0' + (ndate.getMonth() + 2) : ndate.getMonth()+ 2);
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate()); 
				Y =	M > 12 ? (Y + 1) + '-':Y + '-';
				M = M > 12 ? '0' + (M - 12) + '-':M + '-';
            ndate =Y + M + D;
			//console.log(ndate); 
            return ndate;
        },
		 toMon: function () {           
            var ndate = new Date();
            var Y = ndate.getFullYear();
            var M = (ndate.getMonth() + 2 < 10 ? '0' + (ndate.getMonth() + 2) : ndate.getMonth() + 2);
            var D = 01;        
				Y =	M > 12 ? (Y + 1) + '/':Y + '/';
				M = M > 12 ? '0' + (M - 12) + '/':M + '/';
            ndate =Y + M + D;
			console.log(ndate);
            return ndate;
        },
		sellected:function(data){
			if (data == null ||data.length == 0) {
                return {};
            }
			var r = new Object();
				for (var i = 0; i < data.length; i++){

					r[data[i]] = '';
				}
			 return r;
		}
	},
});


//促销单品推荐
Vue.component("v-single-product", {
    template: `
        <div class="b1">
            <div class="clearfix" style="margin-top:50px;">
                <h1 class="single_title" style=" margin-bottom:30px;">促销单品推荐</h1>
                <ul class='single_box'>
                    <li v-for="item in singleData">
                        <img :src='"../img/"+item.row_id+".png"' alt='' class='gold_top' />
                        <a style="cursor:text;">
                            <img :src="item.auction_picture" class="single_img">
                        </a>
                        <p style="color:#666">{{item.auction_name}}</p>
                        
                    </li>
                   
                </ul>
            </div>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            url: $api.SPTarget,
            singleData: [],
            time_motion: 10, //
            top: 3, //排行
            
        }
    },
    created() {
        this.singleDat(); //请求SP
    },
    watch: {
        sellerid: function() {
            this.singleDat();
        }
    },
    methods: {
        //请求SP函数
        singleDat: function() {
            var $this = this;
             $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: "SP_Auction_ReapTop",
                    params: $this.sellerid + ',' + $this.time_motion + ',' + $this.top
                },
                dataType: "json",
                async: false,
                success: function(data) {
					
					console.log(data)
                    //将请求回来的数据赋值给data里的singleData
					
                    $this.singleData = data.data;
                    // console.log(data);
                },
                error: function(xhr) {
                    
                }
            }); 
        },
        //点击活动策划按钮
        activityPlan: function(aid, name, pic) {
            var singleCookie = {
                "auctionName": name,
                "auctionPicture": pic,
                "authionId": aid,
                "sellerId": this.sellerid
            };
            // console.log(singleCookie);
            //cookie存储 点击时候获取的 内容
            //cookie只能存储键值对，所以强转类型
            setCookie("singleCookie", JSON.stringify(singleCookie), "h1");
            location.href = "activity-plan.html?sellerid=" + this.sellerid + "&source=2"
        }
    }
});

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
				return year + "/" + month + "/" + today;
			}
//近期活动
/* Vue.component("v-recent-active", {
    template: `
        <div class="b1">
            <h2 class="hot_module_title" style=" margin-bottom:30px;">近期活动</h2>
            <table id="recent_table">
                <colgroup>
                    <col width="5%">
                    <col width="45%">
                    <col width="15%">
                    <col width="15%">
                    <col width="20%">
                </colgroup>
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>活动主题</th>
                        <th>活动时间</th>
                        <th>活动营收</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background:#fff;" v-for="(l,index) in tableData">
                        <td>{{l.Introwcount-Number(l.rownum)+1}}</td>
                        <td>{{l.activity_subject}}</td>
                        <td>{{toDate(l.activity_date)}}</td>
                        <td>{{l.activity_amt}}</td>
                        <td>
                            <button class="bomb_btn" @click="planBtn(l.status,index,l.aid)">{{l.status}}</button>
                            <button class="bomb_btn">取消</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <v-page :count='count' :allpage='allpage' :pageno="pageno" @pn="changepn"></v-page>
        </div>
    `,
    props: ["sellerid"],
    data: function() {
        return {
            url: $api.SPTarget,
            pageno: 1, //当前页码
            pagesize: 5, //分页大小，每页显示多少条
            count: 0, //总数据量
            allpage: 0, //总页数
            tableData: [], //请求过来的数据
            type: ''
        }
    },
    created() {
        //判断是在主页面还是策划页面
        if (window.location.href.indexOf("activity-plan.html") > -1) {
            this.type = 2 //策划页面
        } else {
            this.type = 1 //主页面
        }
        this.recentData(); //请求SP
    },
    watch: {
        sellerid: function() {
            this.recentData();
        }
    },
    mounted() {
        bus.$on("updata", () => {
            this.recentData();
        });
    },
    methods: {
        //请求SP
        recentData: function() {
            var $this = this; //this指向
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: "SP_PlotActivity",
                    params: $this.sellerid + "," + $this.pageno + "," + $this.pagesize + "," + $this.type
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    //总条数
                    if (data.length != 0) {
                        $this.count = data[0].Introwcount;
                    } else {
                        $this.count = 1;
                    }
                    //将 tableData 赋值
                    $this.tableData = data;
                    $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },
        //接收分页组件页码
        changepn: function(pn) {
            this.pageno = pn;
            var $this = this;
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: "SP_PlotActivity",
                    params: $this.sellerid + "," + $this.pageno + "," + $this.pagesize + "," + $this.type
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    //野马更新，数据对应更新
                    $this.tableData = data;
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },
        //将时间戳转化成所需要的格式
        toDate: function(date) {
            if (date == null) {
                return "";
            }
            var ndate = new Date(date);
            var Y = ndate.getFullYear() + "-";
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + "-";
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
            ndate = Y + M + D;
            return ndate;
        },
        planBtn: function(status, i, aid) {
            var $this = this;
            console.log(i, aid);
            if (status == "计划") {
                //点击计划，将之前用户信息获取，重新填写
                $.ajax({
                    url: $this.url,
                    type: "POST",
                    data: {
                        name: "SP_PlotActivity_info",
                        params: aid
                    },
                    dataType: "json",
                    async: false,
                    success: function(data) {
                        console.log(data);
                        var tableCookie = data[0];
                        tableCookie.aid = aid; //把aid带过去
                        // console.log(tableCookie);
                        // return;
                        setCookie("tableCookie", JSON.stringify(tableCookie), "h1");
                    },
                    error: function(xhr) {
                        console.log(xhr);
                    }
                });
                // return;
                location.href = "activity-plan.html?sellerid=" + this.sellerid + "&source=3"

            } else if (status == "战报") {
                var $this = this;
                // console.log($this.tableData[i]);
                var sentData = JSON.stringify($this.tableData[i]);
                $.cookie('replydata', sentData);
                location.href = "activity-reply.html?sellerid=" + this.sellerid + "&source=1"
            } else if (status == "复盘") {
                var $this = this;
                var sentData = JSON.stringify($this.tableData[i]);
                $.cookie('replydata', sentData);
                location.href = "activity-reply.html?sellerid=" + this.sellerid + "&source=2"
            } else if (status == "归档") {
                var $this = this;
                var sentData = JSON.stringify($this.tableData[i]);
                $.cookie('replydata', sentData);
                location.href = "activity-reply.html?sellerid=" + this.sellerid + "&source=3"
            }
        }
    }
}); */

//报名活动
/* Vue.component("v-apply-active", {
    template: `
        <div class="b1">
            <h2 class="hot_module_title" style=" margin-bottom:30px;">报名活动</h2>
            <div class="activity_wrap">
                <div id="iframe_wrap">
                    <iframe src="https://yingxiao.taobao.com/" scrolling="no" width=1180 height=470></iframe>
                </div>
            </div>
            <div class="industry_list_wrap">
                <p>行业类目</p>
                <ul class="industry_list clearfix">
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10002_10421" target="_blank">女装</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10195_10454_10543" target="_blank">男装</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10003" target="_blank">女鞋</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10004" target="_blank">男鞋</a></li>                    
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10005_10463" target="_blank">内衣</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10006" target="_blank">箱包</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10007_10522" target="_blank">服饰市场</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10311_10532" target="_blank">服装配件</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10009" target="_blank">珠宝配饰</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10162_10459" target="_blank">运动户外</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10160" target="_blank">母婴</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10011" target="_blank">家居百货</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10018" target="_blank">家电</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10020_10021_10022" target="_blank">数码</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10015" target="_blank">房产</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10016" target="_blank">生活服务</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10161" target="_blank">婚庆</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10087_10088_10089_10090" target="_blank">游戏</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10185_10085" target="_blank">教育</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10197_10198" target="_blank">花鸟</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10027_10273_10457" target="_blank">文娱</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10967" target="_blank">餐饮卡券</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10968" target="_blank">淘宝卡券</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10486_10571" target="_blank">中国质造</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10456" target="_blank">质＋市场</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10421_10463_10532_10543_10563_10564" target="_blank">抢新市场</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10462_10464_10735" target="_blank">极有家</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10479_10484_10696" target="_blank">小微快采</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10528" target="_blank">批发量贩</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10545" target="_blank">潮电街</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10102_10229" target="_blank">淘宝美食</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10338_10387" target="_blank">农村淘宝</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10063" target="_blank">新农业</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10585" target="_blank">农资</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10064_10065" target="_blank">特色中国</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10093_10094_10096_10097_10051_10801_10802" target="_blank">全民抢拍</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10060_10238" target="_blank">全球购</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10029_10030_10033" target="_blank">天天特价</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10530_10531" target="_blank">淘金币</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10389" target="_blank">海外直邮</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10150" target="_blank">淘宝动漫</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10186" target="_blank">周末淘宝</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10268" target="_blank">淘宝公益</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10332" target="_blank">阿里影业</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10340" target="_blank">阿里通信</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10230" target="_blank">淘女郎</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=10183_10377" target="_blank">淘宝达人</a></li>
                    <li><a href="https://yingxiao.taobao.com/content/list.htm?groupId=11103_11104" target="_blank">淘宝海外</a></li>
                </ul>
            </div>
        </div>
    `,
}); */