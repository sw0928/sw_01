/**
 * 刘俊
 * 2017/08/08
 * 改动调整计划表格，弹出框部分
 */

/*下拉框组件  */
Vue.component('v-select', {
    template: `
    <div>
        <select class="fl" id='select_ted' name="" v-model="selectedId" >
            <option v-for="li in selectData" :value='li.auction_id' :sellerid='li.seller_id'>{{li.auction_name}}</option>
        </select>
        <button class="btn fr" @click="bookAution()">+增加订阅</button>
    </div>
    `,
	props: ["sellerid"],
    data: function () {
        return {
            t: 1, // 判断下拉框是否改动
            url: $api.SPTarget,
            
            selectData: [],
            selectedId: "",
            selected: {
                name: "",
                auctionid: "",
                sellerid: ""
            }, // 下拉框的具体值
        }
    },
    //监听事件
    watch: {
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
                    sellerid: $this.sellerid
                };
				 sessionStorage.setItem("auctionid", $this.selectedId);
                //console.log(updata);
                // 将选中的ID放到触发器的盆子里，下面拿着用
                bus.$emit("getAid", updata);
				
            };
          },
		  deep:true
		}
			
		  
		 
    }, 
    created() {
        var $this = this;
		this.firaddData();
		
          // $.ajax({
             // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
             // type: "POST",
             // dataType: "json",
             // contentType: "application/json",
             // success: function(data) {
                 // if (data == false) {
                     // window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                 // } else {
                     // var $str = data.shopname;
                   //  添加用户数据
                     // function dat() {
                         // $(".user-a").html('');
                         // var datStr =
                             // '<span>' + data.shopname + '</span>' +
                             // '<div class="help-box">' +
                             // '<div class="help-date" data-start="2013-04-24">' +
                             // '<div><span>' + data.enddate + '</span> 到期 </div><a href="https://fuwu.taobao.com/ser/detail.html?service_code=ts-18350" target="_blank">续费升级</a></div>' +
                             // '<div class="help-num">021-65400080</div>' +
                             // '<div class="help-more">' +
                             // '<a class="help-contact" target="_blank" href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%8A%E6%B5%B7%E6%99%8F%E9%BC%A0%3A%E8%8A%92%E6%9E%9C&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8">技术支持</a>' +
                             // '<a class="help-explain" href="Help.aspx">使用说明</a>' +
                             // '</div>' +
                             // '</div>';
                         // $(".user-a").html(datStr);
                     // }
                     // dat();
 
                     //获取店铺ID
                     // $.ajax({
                         // url: $api.querySeller + data.shopname,
                         // type: "GET",
                         // dataType: "json",
                         // success: function(data) {
                           //  console.log(data);
                             // if (data.length == 0) {
                               // location.href = "hotcake-plan-addorder.html"
                             // }
                             // $this.sellerid = data[0].SellerId;
                             // firaddData();
                         // },
                         // error: function(xhr) {
                             // console.log(xhr);
                             // location.href = "hotcake-plan-addorder.html"
                         // }
                     // });
                 // }
             // },
             // error: function(xhr) {
                 // window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
             // },
         // }); 

        // setTimeout(() => { // 模拟服务器加载
        //     $this.sellerid = 1803676435;
        //     firaddData();
        // }, 3000);

       


    },
    methods: {
        //点击订阅跳转到订阅页面
        bookAution: function () {
            location.href = "hotcake-plan-addorder.html"
        },
		
		 //请求接口，获取店铺ID 和 商品ID
         firaddData: function() {
			 $this = this;
			 
              $.ajax({
                 url: $this.url,
                 type: "POST",
                 data: {
                     name: 'SP_GetAuction',
                     params: $this.sellerid
                 },
                 dataType: "json",
                 async: false,
                 success: function(data) {
					 
					 // console.log(data);
                     //如果data为空，直接跳转订阅页面
                     if (data.data == null) {
                       // location.href = "hotcake-plan-addorder.html"
                     };
                     //data赋值
                     $this.selectData = data.data;
					 $this.selectedId = $this.selectData[0].auction_id;
                     //$this.selected.name = $this.selectData[0].auction_name; //默认选中第一个
                     $this.selected.auctionid = $this.selectData[0].auction_id; //给下拉框赋值 auction_id
                     $this.selected.sellerid = $this.selectData[0].seller_id; //给下拉框赋值 seller_id
					
                 },
                 error: function(xhr) {
					 
                     console.log(xhr);
                 }
             }); 
        }
    },
    mounted: function () {
        var $this = this;

        //接收器，接收底部传过来的图片商品ID，此接收器要在点击了图片之后才执行
        bus.$on("getAuthid", function (authData) {

            var selFlag = true;
            for (var i = 0; i < $this.selectData.length; i++) {
                console.log($this.selectData[i].auction_id);
                if ($this.selectData[i].auction_id == authData.authion_id) {
                    selFlag = false;
                    $this.selectedname = $this.selectData[i].auction_name;
                    $("#select_ted option").eq(i).attr("selected", "selected");
                }
            }
            if (selFlag == true) {
                location.href = "hotcake-plan-addorder.html?authion_id=" + authData.authion_id + "&seller_id=" + authData.seller_id
            }
            // console.log(selFlag);
        });
    }
});


/*首个产品描述组件*/
Vue.component('v-product-first', {
    template: `
        <div>
            <div class="b1 firstProDes" v-show='showCal'>
                <div class="fallow_sale_box clearfix" id="fallow_sale_box">
                    <v-select :sellerid="sellerid"></v-select>
                </div>
                <div class="sales_name_box clearfix">
                    <div class="sales_img"><img :src="firstData[0].pic_url" alt=""></div>
                    <p>产品名称：{{firstData[0].auction_name}}</p>
                </div>
                <div class="sales_count_box">
                    <ul>
                        <li>
                            <h1>{{firstData[0].yest_trade}}</h1>
                            <p>昨日销量（件）</p>
                        </li>
                        <li>
                            <h1>{{firstData[0].thirty_trade}}</h1>
                            <p>30天销量（件）</p>
                        </li>
                        <li>
                            <h1>{{firstData[0].yest_order}}</h1>
                            <p>昨日子订单量（单）</p>
                        </li>
                        <li>
                            <h1>{{firstData[0].thirty_order}}</h1>
                            <p>30天子订单量（单）</p>
                        </li>
                    </ul>
                </div>
            </div>
            <img class="noData_img" src="../img/vNodata.png" v-show='!showCal'>
        </div>
    `,
	//id
	props: ["sellerid"],
    data: function () {
        return {
            url: $api.SPTarget,
            sellerid: '',
            auctionid: '',
            onOff: true,
            showCal: true,
            firstData: [{
                '30 天订单量': '',
                '30 天销量': '',
                '卖家ID': '',
                '商品ID': '',
                '商品名称': '',
                '商品图片': '',
                '昨日子订单量': '',
                '昨日销量': '',
            }],
        }
    },
    created() {
        var $this = this;
		
        //接收器，接收上面的两个ID
        bus.$on("getAid", function (updata) { //注意this指向问题
            $this.sellerid = updata.sellerid;
            $this.auctionid = updata.auctionid;
           $this.addData();
        });
       
		
    },
	methods: {
		
		 //添加数据
         addData: function() {
			var $this =this;
			 
              $.ajax({
                 url: $this.url,
                 type: "POST",
                 data: {
                     name: 'SP_AuctionInfo',
                     params: $this.sellerid + ',' + $this.auctionid
                 },
                 dataType: "json",
                 async: false,
                 success: function(data) {
                     //根据数据显示图片
					 //console.log(data.data);
                     if (data.length == 0) {
                         $this.showCal = false;
                     } else if (data.length != 0) {
                         $this.showCal = true;
                     }
                     $this.firstData = data.data;
                 },
                 error: function(xhr) {
                     console.log(xhr);
                 }
             }) 
        }
    },
});


/*螺旋曲线增长通道组件*/
Vue.component('v-curve-grow', {
    template: `
        <div class="b1 grow_box" style='position:relative;'>
            <div v-show='showCal'>
                <div class="legend">
                    <ul>
                        <li>
                            <div style='background:blue;'></div>
                            <span>近30天</span>
                        </li>
                        <li>
                            <div style='background:goldenrod;'></div>
                            <span>增长下限</span>
                        </li>
                        <li>
                            <div style='background:red;'></div>
                            <span>增长上限</span>
                        </li>
                    </ul>
                </div>
                <div class="curve_grow_box">
                    <div class="curve_cover_box" v-show='left>0'>
                        <img src='../img/22.gif' alt="" />
                        <p class="last_day">{{'还剩'+ left +'天'}}</p>
                    </div>
                    <div>
                        <h4>30天销售件数跟踪与增长通道</h4>
                        <div class="curve_img" id="echartLeft"></div>
                    </div>
                    <div>
                        <h4>30天销售订单数跟踪与增长通道</h4>
                        <div class="curve_img" id="echartRight"></div>
                    </div>
                </div>
                <p class="curve_descrip_text">说明：<br/>
                    螺旋曲线增长通道是依据所跟踪的单品过去30天的历史有效成交，结合平台爆款卡位的核心重点指标要求加权计算所得。<br/>
                    目前版本中仅供参考指引，后续升级版本后将会有更加精准的引导与跟踪功能。
                </p>
            </div>
            <img class="noData_img" src="../img/vNodata.png" v-show='!showCal'>
        </div>
    `,
	props: ["sellerid"],
    data: function () {
        return {
            url: $api.SPTarget,
            auctionid: '',
			sellerid:'',
            saleCountArr: [], //件数
            saleOrderArr: [], //订单数量
            left: '',
            showCal: true
        }
    },
    created() {

        var $this = this;
        //接收器 传递 sellerid 和  auctionid注意this指向问题
        bus.$on("getAid", function (updata) {
            $this.saleCountArr = []; //清空数据缓存
            $this.saleOrderArr = []; //清空数据缓存
            $this.sellerid = updata.sellerid;
            $this.auctionid = updata.auctionid;
			add($this.sellerid,$this.auctionid);

        });
		
		function add(sellerid,auctionid){
			 $.ajax({
           url: $this.url,
           type: "POST",
           data: {
               name: 'SP_helical_line',
               params: sellerid + ',' + auctionid,
           },
           dataType: "json",
           async: false,
           success: function(data) {
			  
				
               //判断data是否为空，若为空，则插入无数据图片
               if (data.data == '') {
                   $this.showCal = false;
               } else {
                   $this.showCal = true;
               };
 
               //显示遮罩层还剩多少天
               // $this.left = 30 - data.data.length;
 
               //如果长度不足，小于30，遮罩层显示
               if (data.length < 30) {
                   $this.ismask = true;
               } else if (data.length == 0) {
                   $this.showCal = false; //插入无数据图片
               };
 
               var saleCountArr = []; //销售件数总数组
               var saleOrderArr = []; //销售订单数总数组
 
               //构造函数，创建销售件数数组
               function leftArr() {
                   this.red = '';
                   this.yellow = '';
                   this.blue = '';
                   this.deg = '';
               }
 
               //构造函数，创建销售订单数数组
               function rightArr() {
                   this.redOrder = '';
                   this.yellowOrder = '';
                   this.blueOrder = '';
                   this.deg = '';
               }
				//console.log(data.data);
               for (var i = 0; i < data.data.length; i++) {
                   var a = new leftArr();
				   var str = data.data[i];
                   a.deg = str["X"];
                   a.red = str["销售件数_红"];
                   a.blue = str["销售件数_蓝"];
                   a.yellow = str["销售件数_黄"];
                   $this.saleCountArr.push(a);
 
                   var b = new rightArr();
                   b.deg = str["X"];
                   b.redOrder = str["销售订单数_红"];
                   b.blueOrder = str["销售订单数_蓝"];
                   b.yellowOrder = str["销售订单数_黄"];
                   $this.saleOrderArr.push(b);
               }
               // console.log($this.saleCountArr);
                //console.log('----------');
                //console.log($this.saleOrderArr);
           },
           error: function(xhr) {
               console.log(xhr);
           }
       }); 
		}
         

    },
    
    watch: {
        //事件监听
        saleCountArr: function () {
            var $this = this;

            watchdata(); //开始渲染图表

            //处理两个eChart图表
            function watchdata() {
                var dataRed = []; //红色数据
                var dataBlue = []; //蓝色数据
                var dataYellow = []; //黄色数据

                var dataOrderRed = []; //红色销售件数数据
                var dataOrderBlue = []; //蓝色销售件数数据
                var dataOrderYellow = []; //黄色销售件数数据

                //处理销售件数数据
                for (var k = 0; k < $this.saleCountArr.length; k++) {
                    dataRed.push([$this.saleCountArr[k].red, $this.saleCountArr[k].deg]);
                    dataBlue.push([$this.saleCountArr[k].blue, $this.saleCountArr[k].deg]);
                    dataYellow.push([$this.saleCountArr[k].yellow, $this.saleCountArr[k].deg]);
                }

                //处理销售订单数数据
                for (var l = 0; l < $this.saleOrderArr.length; l++) {
                    dataOrderRed.push([$this.saleOrderArr[l].redOrder, $this.saleOrderArr[l].deg]);
                    dataOrderBlue.push([$this.saleOrderArr[l].blueOrder, $this.saleOrderArr[l].deg]);
                    dataOrderYellow.push([$this.saleOrderArr[l].yellowOrder, $this.saleOrderArr[l].deg]);
                }

                // 基于准备好的dom，初始化echarts实例
                echart(dataRed, dataBlue, dataYellow, true, 'echartLeft');
                echart(dataOrderRed, dataOrderBlue, dataOrderYellow, false, 'echartRight');

                /*渲染echart表格 极坐标图*/
                function echart(redData, blueData, yellowData, clockwise, echartId) {
                    var myChart = echarts.init(document.getElementById(echartId));

                    var option = {
                        title: {
                            text: ''
                        },
                        legend: {},
                        polar: {
                            center: ['50%', '50%']
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross'
                            }
                        },
                        angleAxis: {
                            type: 'value',
                            startAngle: 90,
                            splitNumber: 30, //坐标轴分割段数
                            clockwise: clockwise, //是否逆时针
                            axisLine: { //坐标轴轴线设置
                                lineStyle: {
                                    color: '#ccc',
                                }
                            },
                            axisTick: { //坐标轴刻度设置
                                show: false
                            },
                            splitLine: { //分割线设置
                                show: false,
                            },
                            axisLabel: { //刻度标签设置
                                textStyle: {
                                    color: '#333'
                                }
                            }
                        },
                        radiusAxis: {
                            min: 0,
                            axisLine: { //坐标轴轴线设置
                                show: false,
                                // lineStyle: {
                                //     color: "#ccc"
                                // }
                            },
                            axisTick: { //坐标轴刻度设置
                                show: false
                            },
                            axisLabel: { //刻度标签设置
                                margin: 0, //刻度与坐标轴之间的距离
                                textStyle: {
                                    color: '#333'
                                }
                            }
                        },
                        series: [{
                            coordinateSystem: 'polar',
                            name: '近30天',
                            type: 'line',
                            showSymbol: false,
                            smooth: true,
                            data: redData, //红线数据参数
                            lineStyle: {
                                normal: {
                                    color: '#f00'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f00',
                                }
                            }
                        }, {
                            coordinateSystem: 'polar',
                            name: '增长下限',
                            type: 'line',
                            showSymbol: false,
                            smooth: true,
                            data: blueData, //蓝线数据参数
                            lineStyle: {
                                normal: {
                                    color: '#0000ff'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#0000ff',
                                }
                            }
                        }, {
                            coordinateSystem: 'polar',
                            name: '增长上限',
                            type: 'line',
                            showSymbol: false,
                            smooth: true,
                            data: yellowData, //黄线数据参数
                            lineStyle: {
                                normal: {
                                    color: 'goldenrod'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: 'goldenrod',
                                }
                            }
                        }],
                        animationDuration: 2000
                    };

                    myChart.clear(); //清空数据缓存
                    myChart.setOption(option);
                }
            }
        }
    }
});


/*30天单品重点爆点提醒*/
Vue.component('v-important-point', {
    template: `
        <div class="b1 calendar_wrap">
            <div v-show='showCal'>
                <div class="calendar_box">
                    <div id="calendar" class="calendar">
                        <v-calendar></v-calendar>
                    </div>
                    <div class="calendar_remind">
                        <ul>
                            <li class="clearfix" v-for="(li,index) in bombData" >
                                <p class="calendar_remind">提醒</p>
                                <div class="fl">
                                <p><span>{{toData(li['提示日期'])}}</span>成交爆发点请于<span>{{toData(li['日历日期'])}}</span>前予以重点补差</p>
                                <div>
                                <span class="bargin_piece" style="margin-right:25px;">当日成交件数：<span>{{li['销售件数']+'件'}}</span></span>
                                <span class="bargin_sign">当日成交笔数：<span>{{li['成交笔数']+'单'}}</span></span>
                                    </div>
                                </div>
                                
                            </li>
                            
                        </ul>
                    </div>
                </div>
                <p class="curve_descrip_text">
                    说明：<br/>平台爆款的各种计量，多以最近30天的成交相应指标来进行评定为主。<br/>
                    为了防止出现单品在上一个30天内的突然爆发点在后续的30天内没有及时予以补差，从而产生一次大的产品指标飞落，<br/>
                    对于过去30天内出现单品重点爆点做了下一个30天内最迟的补差时间点（已在日历中标红，并在右则予以了说明）
                </p>
            </div>
            <img class="noData_img" src="../img/vNodata.png" v-show='!showCal'>

            <div class="pay_tips pay_before" v-show="payBeShow">
                <div class="pay_tips_top">
                    <img src="../img/smile_03.png" alt="" />
                    <p>对不起！您尚未订购促销管理！</p>
                    <p>是否前往订购？</p>
                </div>
                <div class="pay_tips_bot">
                    <button class="repeat_btn" @click="sure_pay()" style="margin-right:20px;">确定</button>
                    <button class="grey_btn" @click="del_pay()">取消</button>
                </div>
            </div>
            <div class="pay_tips pay_after" v-show="payAfShow">
                <div class="pay_tips_top">
                    <img src="../img/circle_03.png" alt="" />
                    <p>支付完成前，请不要关闭当前窗口</p>
                    <p>请根据实际支付情况点击下面的按钮</p>
                </div>
                <div class="pay_tips_bot">
                    <button class="repeat_btn" @click="finsh_pay()" style="margin-right:20px">已完成付款</button>
                    <button class="grey_btn ques_btn" @click="ques_pay()" style="background:red;color:#fff;">付款遇到问题</button>
                </div>
            </div>
            <div v-if="fixedShow" class="plan_fixed_box"></div>
        </div>
    `,
	props: ["sellerid"],
    data: function () {
        return {
            url: $api.SPTarget,
            sellerid: '',
            auctionid: '',
            bombData: [],
            showCal: true,
            payBeShow: false, // 订购前弹出层，询问是否跳转
            payAfShow: false, // 订购后弹出层，询问跳转问题
            fixedShow: false, //遮罩是否显示
            items: [{
                data2:'10月13日',
                data1:'10月12日',
                num1:'5',
                num2:'6'

            },{
                data2:'10月14日',
                data1:'10月12日',
                num1:'5',
                num2:'6'
            },{
                data2:'10月15日',
                data1:'10月13日',
                num1:'5',
                num2:'6'
            }]

        }
    },
    created() {
        var $this = this;
        bus.$on("getAid", function (updata) { //注意this指向问题
            $this.sellerid = updata.sellerid;
            $this.auctionid = updata.auctionid;
            addData();
        });

        function addData() {
            //请求数据
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Month_Reminder',
                    params: $this.sellerid + "," + $this.auctionid,
                },
                dataType: "json",
                async: false,
                success: function (data) {
                    //若数据为0，则显示无数据图片
					//console.log(data);
                    if (data.data.length == 0) {
                        $this.showCal = false;
						
                    } else if (data.data.length != 0) {
                        $this.showCal = true;
                    }
                    $this.bombData = data.data;
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
        }
    },
    methods: {
        //点击活动策划按钮
        active_plan: function (date) {
            this.actPlanAjax(date);
        },

        //将时间向前推一个月
        toData: function (date) {
            if (date == null) {
                return "";
            }
            var ndate = new Date(date);
            var Y = ndate.getFullYear() + '-';
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + '月';
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate()) + '日';
            var h = (ndate.getHours() < 10 ? '0' + (ndate.getHours()) : ndate.getHours()) + ':';
            var m = (ndate.getMinutes() < 10 ? '0' + (ndate.getMinutes()) : ndate.getMinutes()) + ':';
            var s = (ndate.getSeconds() < 10 ? '0' + (ndate.getSeconds()) : ndate.getSeconds());
            ndate = M + D;
            return ndate;
        },

        //活动策划 ajax请求
        actPlanAjax: function (date) {
            var $this = this;
            /*  $.ajax({
                 url: $api.actPlan2,
                 type: "POST",
                 dataType: "json",
                 data: {
                     sellerid: $this.sellerid
                 },
                 success: function(data) {
                     // data.result = "0"; // 测试用
 
                     //如果未订购，1号面板打开
                     if (data.result == "0") {
 
                         $this.payBeShow = true; //询问是否订购提示框显示
                         $this.fixedShow = true; //遮罩层显示
 
                     } else if (data.result == "1") {
                         var hotCookie = {
                             "stratdate": date
                         };
 
                         //cookie只能存储键值对，所以强转类型
                         setCookie("hotCookie", JSON.stringify(hotCookie), "h1");
 
                         //跳转页面
                         location.href = "activity-plan.html?sellerid=" + $this.sellerid + "&source=4"
                     }
                 },
                 error: function(xhr) {
                     console.log(xhr)
                 }
             }) */
        },

        //点击  1号 订购前 确定订购按钮
        sure_pay: function () {

            //跳转服务市场
            window.open("https://tb.cn/h1C6haw", "_blank");


            this.payBeShow = false; // 1号弹窗关闭，
            this.payAfShow = true; // 2号弹窗打开
            this.fixedShow = true; // 遮罩层显示
        },

        // 1 号弹窗  点击取消，弹出层消失，不跳转
        del_pay: function () {
            this.payBeShow = false; //是否订购服务 弹出框 消失
            this.fixedShow = false; //遮罩层消失
        },

        // 2号弹出框，绿色，完成付款
        finsh_pay: function () {
            this.payAfShow = false; //2号弹出框消失
            this.fixedShow = false; //遮罩层消失
        },

        // 2号弹出框，红色按钮 付款遇到问题
        ques_pay: function () {
            this.payAfShow = false; //2号弹出框消失
            this.fixedShow = false; //遮罩层消失
        }

    }
});


//单独日历组件
// Vue.component('v-calendar', {
    // template: `
        // <div>
            // <div id="calendar_content">
                // <div class="month">
                    // <ul>
                        // <li class="year-month" @click="pickYear(currentYear,currentMonth)">
                            // <span class="choose-year">{{ currentYear +'年'+currentMonth + '月'}}</span>
                        // </li>
                    // </ul>
                // </div>
                // <ul class="weekdays">
                    // <li>一</li>
                    // <li>二</li>
                    // <li>三</li>
                    // <li>四</li>
                    // <li>五</li>
                    // <li style="color:red">六</li>
                    // <li style="color:red">日</li>
                // </ul>
                // <ul class="daysRed">
                    // <li @click="pick(day)" v-for="day in days">
                        // <span v-if="day.getMonth()+1 != currentMonth" class="other-month">{{ day.getDate() }}</span>
                        // <span v-else>
                            // <span class="true" :class="{active:j(day.getFullYear(),day.getMonth()+1,day.getDate())}">{{ day.getDate() }}</span>
                        // </span>
                    // </li>
                // </ul>
            // </div>
        // </div>
    // `,
    // props: ["sellerid"],
    // data: function () {
        // return {
            // currentDay: 1,
            // currentMonth: 1,
            // currentYear: 1970,
            // currentWeek: 1,
            // days: [],
            // addDay: [],
            // url: $api.SPTarget, //接口地址
            // calenDate: [], //请求回来的时间数据
        // }
    // },
    // created: function () {
        // this.initData(null);
        // this.remindData();
    // },
    // watch: {
        // sellerid: function () {
            // this.remindData();
        // }
    // },
    // methods: {
        // remindData: function () {
            // var $this = this;
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // data: {
                    // name: 'SP_Month_Reminder_Plot',
                    // params: $this.sellerid
                // },
                // dataType: "json",
                // async: false,
                // success: function (data) {
					
                    // // 若数据为0，则显示无数据图片
                    // if (data.length == 0) {
                        // $this.showCal = false;
                    // } else if (data.length != 0) {
                        // $this.showCal = true;
                    // }
                    // // console.log(data);
                    // // 将请求回来的参数赋值给 calenDate
                    // $this.calenDate = data;
                // },
                // error: function (xhr) {

                // }
            // });
        // },
        // j: function (y, m, d) {
            // // 将传入的参数转换成字符串，作比较
            // var Y = y.toString();
            // var M = m < 10 ? '0' + m : m.toString();
            // var D = d < 10 ? '0' + d : d.toString();
            // // 判断日历日期跟数据返回日期做对比
            // for (var i = 0; i < this.calenDate.length; i++) {
                // // 如果总天数为   1  ,则直接显示， 否则显示  区间
                // if (this.calenDate[i].count_day == 1) {
                    // if (toData(this.calenDate[i].stratdate) == (Y + M + D)) {
                        // return true
                    // }
                // } else {
                    // if ((Number(toData(this.calenDate[i].stratdate)) <= Number(Y + M + D)) && (Number(toData(this.calenDate[i].enddate)) >= Number(Y + M + D))) {
                        // return true
                    // }
                // }
            // }
            // // console.log(Number(Y + M + D));
            // function toData(date) { //将时间戳转化成
                // if (date == null) {
                    // return "";
                // }
                // var ndate = new Date(date);
                // var Y = ndate.getFullYear();
                // var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1);
                // var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
                // ndate = Y + M + D;
                // return ndate;
            // }
        // },
        // initData: function (cur) {
            // var date;
            // // 若没有数据，则显示当前日期
            // if (cur) {
                // date = new Date(cur);
            // } else {
                // date = new Date();
            // }
            // this.currentDay = date.getDate();
            // this.currentYear = date.getFullYear();
            // this.currentMonth = date.getMonth() + 2;
            // this.currentMonth = this.currentMonth >= 13 ? this.currentMonth - 12 : this.currentMonth;
            // this.currentWeek = date.getDay(); // 1...6,0
            // if (this.currentWeek == 0) {
                // this.currentWeek = 7;
            // }
            // // var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);//从当前日期开始
            // var str = this.formatDate(this.currentYear, this.currentMonth, 1); //日历整月显示
            // this.days.length = 0;
            // // 今天是周日，放在第一行第7个位置，前面6个
            // for (var i = this.currentWeek - 1; i >= 0; i--) {
                // var d = new Date(str);
                // d.setDate(d.getDate() - i);
                // this.days.push(d);
            // }
            // for (var i = 1; i <= 35 - this.currentWeek; i++) {
                // var d = new Date(str);
                // d.setDate(d.getDate() + i);
                // this.days.push(d);
            // }
        // },
        // pick: function (date) {
            // // console.log(this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
        // },
        // pickPre: function (year, month) {
            // // setDate(0); 上月最后一天
            // // setDate(-1); 上月倒数第二天
            // // setDate(dx) 参数dx为 上月最后一天的前后dx天
            // var d = new Date(this.formatDate(year, month, 1));
            // d.setDate(0);
            // this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        // },
        // pickNext: function (year, month) {
            // var d = new Date(this.formatDate(year, month, 1));
            // d.setDate(35);
            // this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        // },
        // pickYear: function (year, month) {
            // // console.log(year + "," + month);
        // },

        // // 返回 类似 2016-01-02 格式的字符串
        // formatDate: function (year, month, day) {
            // var y = year;
            // var m = month;
            // if (m < 10) m = "0" + m;
            // var d = day;
            // if (d < 10) d = "0" + d;
            // return y + "-" + m + "-" + d
        // },
    // }
// });

Vue.component('v-calendar', {
    template: `
        <div>
            <div id="calendar_content">
               <div class="layui-inline" id="test"></div>
            </div>
        </div>
    `,
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
        bus.$on("getAid", function(updata) { //注意this指向问题
            $this.sellerid = updata.sellerid;
            $this.auctionid = updata.auctionid;			
			$('#test').html('');
            calAddDate();
			ddd();
			$('.laydate-day-mark').parent().css('background','red');
        });
		function  ddd(){
			if($this.dataSelect.length == 0){
				return '';
			}else{
				laydate.render({
				elem: '#test' //指定元素
				, min: -0
				, max: 30
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
                    name: 'SP_Month_Reminder',
                    params: $this.sellerid + "," + $this.auctionid,
                },
                dataType: "json",
                async: false,
                success: function(data) {					
                    $this.addDay = data.data;
					$this.dataSelect = [];					
						if($this.addDay.length != 0){	
							for (var i=0;i<$this.addDay.length;i++){
																
								$this.dataSelect.push($this.toData($this.addDay[i]['日历日期']));
								
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


//核心预警组件

Vue.component("v-main-warning-table-v2", {
    template: `
                <div class="clearfix bomb_wrap">
                    <div class="ignore_fixed_box"></div>
                    <div class="b1" style="position:relative;">
                        <div>
                           
                        </div>          
                        <table id="hexinyujing" v-show="noData">
                            <colgroup>
                                <col width="37%">
                                <col width="19%">
                                <col width="14%">
                                <col width="14%">
                                <col width="16%">
                            </colgroup>
                            <tbody>
                                <tr v-for='(li,index) in tableData'>
                                    <td>                     
                                            <span v-for='l in li.count'><img :src="bomb(li.color)" alt=""></span>
                                            <span v-for='m in (10-li.count)'><img :src="leftBomb(li.color)" alt=""></span>                                                                                                      
                                    </td>
                                    <td>
                                        <p class="importParam" v-bind:title='li.point'>核心指标 : {{li.point}}</p>
                                    </td>
                                    <td>
                                        <p class="todayValue" v-bind:title='li.yesterday_value'>昨日值 : {{li.yesterday_value}}</p>
                                    </td>
                                    <td>
                                        <p class="yestodayValue" v-bind:title='li.day_before_yesterday_value'>前日值 : {{li.day_before_yesterday_value}}</p>
                                    </td>
                                    <td>
                                       <a href="javascript:;" class="black" @click="goSlove(li.point,li.yesterday_value,li.day_before_yesterday_value)">去解决</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
						<img class="noData_img" src="../img/vNodata.png" v-show="!noData">
                    </div>
                    <div class="b1"></div>                                       
                </div>       
            `,
    props: ["tableData", "id", "orignData", "sellerid", "auctionid"],
	 data: function () {
    return {
       noData: false,
        tableis: true,
        loadis: false,
        url: $api.SPTarget,
         sellerid: '',
        auctionid: '',
        id: '',
        tableData: [],
        orignData: [],
        dataArr: [],
        pageIndex: '',
        ttype: ''
    }
  },
	mounted() {
    var $this = this;
    setTimeout(() => {
      //console.log($this.tableData);
    }, 100)

  },
  created() {
        var $this = this;
        bus.$on("getAid", function(updata) { //注意this指向问题
            $this.sellerid = updata.sellerid;
            $this.auctionid = updata.auctionid;
			//console.log($this.sellerid,$this.auctionid);
            addData($this.sellerid,$this.auctionid);
        });

        function addData(sellerid,auctionid) {
             $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Auction_Mine',
                    params: sellerid + ',' + auctionid
                },
                dataType: "json",
                async: false,
                success: function(data) {
					//console.log(data);
                    if (data.data.length == 0 ||data.data == null) {
                        setTimeout(function() {
                            $this.noData = false;
                            return;
                        }, 10);
                    }else{
						$this.tableData = data.data
						//console.log($this.tableData)
						$this.noData = true;
					}
						
					
				}
			 });
		}
  },
    methods: {
	
        //判断雷的颜色
        bomb: function(n) {
            n = Number(n);
            if (n == 1) {
                return "../img/fackBomb.png";
            } else if (n == 2) {
                return "../img/orangeBomb.png";
            } else if (n == 3) {
                return "../img/redBomb.png";
            } else if (n == 4) {
                return "../img/blackBomb.png"
            }
        },
        //剩下雷的颜色
        leftBomb: function(n) {
            n = Number(n);
            if (n == 1) {
                return "../img/fackBomb.png";
            } else if (n == 2) {
                return "../img/fackBomb.png";
            } else if (n == 3) {
                return "../img/orangeBomb.png";
            } else if (n == 4) {
                return "../img/redBomb.png"
            }
        },
        //去解决按键颜色
        btnColor: function(n, m) {
            if (n == 4) {
                return "black";
            } else if (n == 3) {
                return "red";
            } else if (n == 2) {
                return "orange";
            } else return "grey";
        },

        //去解决
        goSlove: function(t,yesterday, today) {
            var data = {
                
                t: t,
                today: today,
                yesterday: yesterday,
               
            };
            bus.$emit('target', data);
            $("#slove_fixed_box").show();
            $(".fixed_box").show();
            $(".plan_textArea").val(''); //清空textarea
        },

        //忽略掉
        ignore: function(e, level, plid, target, index, auctionid, sellerid) {
            // console.log(this.auctionid);
            // return;
            var logList = [{
                sellerId: this.sellerid,
                plIndex: target,
                pccontent: "忽略啦",
                pmname: "-",
                prioritynum: level,
                pccategory: "忽略掉",
                createid: 1,
                enabled: true,
                remark: "忽略掉",
                before: this.orignData[index].shopValue.today,
                auctionId: this.auctionid,
                t1_values: this.orignData[index].shopValue.today, //昨日值原始数据;
                t2_values: this.orignData[index].shopValue.yesterday //前日值原始数据;
            }];
            // console.log(logList);
            //点击忽略掉，插入忽略弹出框
            $('.ignore_fixed_box').show(); //遮罩层出现
            $(".bomb_wrap").append("<div class='confirm_ignore'><p style='margin:40px 0 30px 0; font-size:22px;'>确认忽略？</p><button class='sub_btn' id='sure_ignore_btn'>确认</button><button class='cancle_btn' id='cancle_btn'>取消</button></div>");
            //点击确认忽略，
            $('#sure_ignore_btn').click(function() {
                $.ajax({
                    url: "http://223.6.252.143:30005/yanShulcsy/addLog1",
                    type: "POST",
                    data: JSON.stringify(logList), //将对象序列化成JSON字符串
                    dataType: "text",
                    contentType: 'application/json',
                    async: false,
                    success: function(data) {
						
                        $(".confirm_ignore").remove(); //移除忽略框
                        $('.ignore_fixed_box').hide(); //遮罩层消失
                        //成功后调整日志刷新
                        var onOff = true;
                        bus1.$emit("reflash", onOff);
                        bus1.$emit("reflashTable", onOff);
                    },
                    error: function(xhr) {
                        console.log(xhr)
                    }
                });
            });
            //点击取消忽略
            $('.cancle_btn').click(function() {
                $(".confirm_ignore").remove(); //移除忽略框
                $('.ignore_fixed_box').hide(); //遮罩层消失
            });

        },
    }
});

//调整计划表格组件

Vue.component("v-adjust-form-two", {
    template: `
            <div>
                <div class="fixed_box"></div>
                <div id="slove_fixed_box">
                    <div class="slove_box_cont">
                        <div class="delete_Btn" @click="cancle()"><img src="../img/删除筛选项 (1).png" alt=""></div>
                      
                        
                        <h1 class="slove_title">预警指标应急调整计划</h1>
                        <div class="slove_content">
                            <div class="slove_param">
                                <p class="average_deep fl">{{target.t}}</p>
                                <span class="alert_num fr">{{level}}级</span>
                                <span class="slove_yesTodeyValue fr">{{target.yesterday}}</span>
                                <span class="slove_todeyValue fr">{{target.today}}</span>
                            </div>
                              <ul class="manage_select_box">
                                <li v-for='(li,index) in optionData'>
                                    <div class="top_select_box">
                                        <label>调整策略参考{{index+1}}：</label>                                      
                                        <span style="font-size:18px" class="">{{li.PcContent}}</span>
                                        <label class="fr">负责人：{{li.PcCategory}}</label>
										
                                    </div>
                                    
                                </li>
                            </ul>
                           
                        </div>
                      
                    </div>
                </div>            
            </div>     
            `,
    data: function() {
        return {
            selectData: [],
            sellerId: "",
            num: 1,
			url: $api.SPTarget,
            target: {}, //接收的对象
            people: [],
            optionData: [], //原始数据，后台部分需要接收原始数据
            selected: '',
            count: 1,
            current: [{
                selected: ''
            }],
			val:'',
            level: 0, //级别
            before: "", //调整前
            borderAct: [{
                active: false
            }],
            toNumber: 0,
            yesNumber: 0
        }
    },
    created() {
        //核心预警模块传递数据接收
		  bus.$on("target", (data) => {
			 var $this = this;
             $this.val = data.t;
			 $this.target = data;
			
            
           $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'sp_get_planIndex',
                    params: $this.val
                },
                dataType: "json",
                async: false,
                success: function(data) {
					//console.log(data);
                    if (data.data.length == 0 ||data.data == null) {
						return ""
						
                    }else{
						$this.optionData = data.data;
						$this.level = data.data[0].Regulation_level;
					}
						
					
				}
			 });
         });
        //计划发起人信息数据
        var $this = this;
        // $.ajax({
            // url: $api.plainMan,
            // type: "POST",
            // data: {},
            // dataType: "json",
            // success: function(data) {
                // $this.people = data;
            // },
            // error: function(xhr) {
                // console.log(xhr)
            // }
        // });
    },
    methods: {
        //右侧数据随动
        select: function(e) {
            var message = $(e.target).find("option:selected").attr("data-select");
            $(e.target).siblings(".manage_plan_select").html(message);
        },
        //添加计划
        addPlan: function() {
            ++this.target.current;
            this.current.push({
                selected: '运营'
            });
            this.selectData.push(this.selectData[0]);

            //添加计划，保存状态
            this.borderAct.push({
                active: false
            })
        },
        //取消
        cancle: function() {
            $("#slove_fixed_box").hide();
            $(".fixed_box").hide();
            // $('html,body').removeClass('ovfHiden');
            $('.submit_success_box').hide();
            $('.second_confirm_submit').hide(); //空值二次确认框
        },

        //二次提交框取消
        secondCancle: function() {
            $('.second_confirm_submit').hide(); //空值二次确认框
            $('.third_confirm_submit').hide(); //有值情况确认框消失
        },

        //确认提交 将多个计划文本域的值放入数组，判断是否为空，若为空，则出现提示框
        confirmSubmit: function() {
            var flag = true; //验证开关
            var logText = []; //存放多个文本域内容的数组
            var plan_textArea = $(".plan_textArea").val(); //文本域内容
            function textArea() { //创建构造函数，将多个文本域内容放入数组
                this.plan = '';
            }

            //文本域内容放入数组
            for (var i = 0; i < $(".manage_select_box>li").length; i++) {
                var newlog = new textArea(); //实例化构造函数
                newlog.plan = $.trim($(".manage_select_box>li").eq(i).find(".plan_textArea").val());
                logText.push(newlog);
            }

            //循环，判断flag为true 还是 false,
            for (var j = 0; j < logText.length - 1; j++) {
                if (logText[j].plan == '') {
                    this.borderAct[j].active = true;
                    flag = false;
                }
            }
            if (!flag) { //如果有一个为空，则显示警告
                $('.second_confirm_submit').show(); //没有值的提交框
            } else {
                $('.third_confirm_submit').show(); //有值的提交框
            }
        },

        //文本域聚焦事件
        removeBorder: function(i) {
            this.borderAct[i].active = false
        },

        //提交表单
        submit: function() {
            var $this = this;
            var average_deep = $("#slove_fixed_box .average_deep").text(); //核心指标
            var manage_plan_select = $("#slove_fixed_box .manage_plan_select").children("option:selected").text(); //调整策略参考  右
            var strategy_select = $("#slove_fixed_box .strategy_select").children("option:selected").text(); //调整计划  左
            var plan_textArea = $("#slove_fixed_box .plan_textArea").val(); //文本域内容
            var add_plan_select = $("#slove_fixed_box .add_plan_select").children("option:selected").text(); //计划发起人
            var level = parseInt($("#slove_fixed_box .alert_num").text());

            function logListStr() {
                this.sellerId = $this.sellerId;
                this.plIndex = average_deep;
                this.pccontent = '';
                this.pmname = add_plan_select;
                this.prioritynum = level;
                this.pccategory = "";
                this.createid = 1;
                this.enabled = true;
                this.remark = "";
                this.before = $this.before;
                this.t1_values = $this.toNumber;
                this.t2_values = $this.yesNumber;
            }
            var logList = [];
            for (var i = 0; i < $(".manage_select_box>li").length - 1; i++) {
                var newLog = new logListStr();
                newLog.remark = $("#slove_fixed_box .manage_select_box>li").eq(i).find(".strategy_select").children("option:selected").text();
                newLog.pccategory = $("#slove_fixed_box .manage_select_box>li").eq(i).find(".manage_plan_select").text();
                newLog.pccontent = $.trim($("#slove_fixed_box .manage_select_box>li").eq(i).find(".plan_textArea").val());
                if (newLog.pccontent == "") {
                    newLog.pccontent = "忽略啦";
                }
                logList.push(newLog);
            }
            $.ajax({
                url: $api.addLog,
                type: "POST",
                data: JSON.stringify(logList), //将对象序列化成JSON字符串
                dataType: "text",
                contentType: 'application/json',
                async: false,
                success: function(data) {
                    $(".submit_success_box").show(); //提交成功提示框显示
                    $('.second_confirm_submit').hide(); //二次空值确认框消失
                    $('.third_confirm_submit').hide(); //有值情况确认框消失
                    //成功后调整日志刷新
                    var onOff = true;
                    bus1.$emit("reflash", onOff);
                    bus1.$emit("reflashTable", onOff);
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        }
    },
});
//调整日志组件 纯粹的展示
Vue.component("v-adjust-info-v2", {
    template: `
                <div class="daily_wrap">
                    <div class="b1" style="position:relative;">
                        <div>
                            <v-read-plan-two :read-plan="readPlan"></v-read-plan-two>
                        </div>
                        <table id="arrangeDariy">
                            <colgroup>
                                <col width="5%">
                                <col width="15%">
                                <col width="10%">
                                <col width="20%">
                                <col width="10%">
                                <col width="20%">
                                <col width="10%">
                                <col width="10%">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>序号</th>
                                    <th>待调整运营指标</th>
                                    <th>预警级别</th>
                                    <th>调整计划</th>
                                    <th>操作人</th>
                                    <th>时间</th>
                                    <th>调整前</th>
                                    <th>调整后</th>
                                </tr>
                                <tr v-for='(li,index) in tableData'>
                                    <td>
                                        {{li.Introwcount-Number(li.rownum)+1}}    
                                    </td>
                                    <td :title="li.Pl_Index">
                                        {{li.Pl_Index}}
                                    </td>
                                    <td>
                                        {{level(li.PriorityNum)}}
                                    </td>
                                    <td>
                                        <a @click="read(li.ID)">{{li.PcContent}}</a>
                                    </td>
                                    <td>
                                        {{li.PmName}}
                                    </td>
                                    <td>
                                        {{toData(li.CreateTime)}}    
                                    </td>
                                    <td>
                                        {{fun(li.Pl_Index,li.Before)}}
                                    </td>
                                    <td>
                                        {{fun(li.Pl_Index,li.After)}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>    
                </div>
            `,
    data: function() {
        return {
            readPlan: [{
                ID: '',
                PcCategory: '',
                PcContent: '',
                Pl_Index: '',
                PmName: '',
                PriorityNum: '',
                Remark: '',
                T1_Values: '',
                T2_Values: ''
            }]
        }
    },
    props: ["tableData", "pageno"],
    methods: {
        //时间戳转化
        toData: function(date) {
            //console.log(date.length);
            if (date == null) {
                return "";
            }
            var ndate = new Date(date);
            var Y = ndate.getFullYear() + '-';
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + '-';
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate()) + ' ';
            var h = (ndate.getHours() < 10 ? '0' + (ndate.getHours()) : ndate.getHours()) + ':';
            var m = (ndate.getMinutes() < 10 ? '0' + (ndate.getMinutes()) : ndate.getMinutes()) + ':';
            var s = (ndate.getSeconds() < 10 ? '0' + (ndate.getSeconds()) : ndate.getSeconds());
            ndate = Y + M + D + h + m + s;
            // var ndate = date.substring(0, date.length - 2);
            // var ndate = new Date(date);
            return ndate;
        },
        //数字百分比转化
        toNum: function(num) {
            var str = Number(num * 100).toFixed(1);
            str += "%";
            return str;
        },
        //返回级数
        level: function(i) {
            if (i) {
                return i + "级"
            } else {
                return 0 + "级"
            }
        },
        //根据日志单位，添加 ‘ % ’，'￥'，
        fun: function(x, y) {
            if (y == undefined) {
                return '-';
            }
            if (x.indexOf("金额") > -1 || x.indexOf("单价") > -1) {
                y = "￥" + Number(y).toFixed(2);
            } else if (x.indexOf("率") > -1 || x.indexOf("占比") > -1) {
                y = (y * 100).toFixed(2) + "%";
            } else if (x.indexOf("数") > -1) {
                y = Number(y).toFixed(0);
            }
            return y;
        },
        //点击调整计划内容，查看之前的计划
        read: function(pid) {
            var $this = this;
            // console.log(this.tableData);
            $.ajax({
                url: $api.SPTarget,
                type: "POST",
                data: {
                    name: 'SP_AuctionPlanLog',
                    params: pid
                },
                dataType: "json",
                async: true,
                success: function(data) {
                    // console.log(data);
                    $this.readPlan = data;
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
            $("#read_fixed_box").show();
            $(".fixed_box").show();
        }
    }
});

//点击查看原来计划
Vue.component("v-read-plan-two", {
    template: `
        <div>
            <div class="fixed_box"></div>
            <div id="read_fixed_box">
                <div class="slove_box_cont">
                    <div class="delete_Btn" @click="cancle()"><img src="../img/删除筛选项 (1).png" alt=""></div>
                    <h1 class="slove_title">预警指标应急调整计划</h1>
                    <div class="slove_content">
                        <div class="slove_param">
                            <p class="average_deep fl" :title="readPlan[0].Pl_Index">{{readPlan[0].Pl_Index}}</p>
                            <span class="alert_num fr">{{readPlan[0].PriorityNum}}级</span>
                            <span class="slove_yesTodeyValue fr">{{fun(readPlan[0].Pl_Index,readPlan[0].T2_Values)}}</span>
                            <span class="slove_todeyValue fr">{{fun(readPlan[0].Pl_Index,readPlan[0].T1_Values)}}</span>
                        </div>
                        <ul class="manage_select_box">
                            <li>
                                <div class="top_select_box">
                                    <label>调整计划1：</label>
                                    <span class="strategy_select_read" style="margin-right:72px;">{{readPlan[0].Remark}}</span>
                                    <label>调整策略参考：</label>
                                    <span class="manage_plan_select fr" style="background:#e5e5e5; font-size: 12px;">{{readPlan[0].PcCategory}}</span>
                                </div>
                                <div class="readonly_textArea">{{readPlan[0].PcContent}}</div>
                            </li>
                        </ul>
                        <div class="add_plan_box">
                            <label>计划发起人：</label>
                            <span class="add_plan_select_read">{{readPlan[0].PmName}}</span>
                            <button class="add_plan_btn fr" style="background:#ddd; color:#333;">+增加计划</button>
                        </div>
                    </div>
                    <div class="slove_bottom">
                        <div class="slove_bottom_btn_box">
                            <button class="sub_btn fr" style="background:#ddd; color:#333;">提交</button>
                            <button class="clearing_btn fr" @click='cancle()'>取消</button>
                        </div>
                    </div>
                </div>
            </div>            
        </div>     
        `,
    props: ["readPlan"],
    watch: {
        readPlan: function () {
            var $this = this;
            // console.log($this.readPlan);
        }
    },
    methods: {
        //取消
        cancle: function () {
            $("#read_fixed_box").hide();
            $(".fixed_box").hide();
        },
        //根据日志单位，添加 ‘ % ’，'￥'，
        fun: function (x, y) {
            if (y == undefined) {
                return '-';
            }
            if (x.indexOf("金额") > -1 || x.indexOf("单价") > -1) {
                y = "￥" + Number(y).toFixed(2);
            } else if (x.indexOf("率") > -1 || x.indexOf("占比") > -1) {
                y = (y * 100).toFixed(2) + "%";
            } else if (x.indexOf("数") > -1) {
                y = Number(y).toFixed(0);
            }
            return y;
        },
    },
});


//分页组件
Vue.component("v-page-v2", {
    template: `
                <div class='b1 page_wrap'> 
                    <div class="page">     
                        <div class="page-box" >
                            <div class="page-list">
                                <!--<span class="page-btn" @click="goto(1)">首页</span>-->                      
                                <span @click="gotoPre(current)" class="page-btn">
                                    &lt;上一页
                                </span>
                                <span v-for="index in pages" @click="goto(index)" :class="{'page-now':current == index}" class="page-btn">
                                    {{index}}
                                </span>
                                <span @click="gotoNext(current)" class="page-btn">
                                    下一页&gt
                                </span>
                                <!--<span class="page-btn" @click="goto(allpage)">尾页</span>-->
                            </div>
                        </div>
                    </div>                
                </div>`,
    data: function () {
        return {
            current: 1,
            showItem: 10
        }
    },
    props: ["count", "allpage", "pageno"],
    computed: {
        pages: function () {
            var pag = [];
            if (this.current < this.showItem) { //如果当前的激活的项 小于要显示的条数
                //总页数和要显示的条数那个大就显示多少条
                var i = Math.min(this.showItem, this.allpage);
                while (i) {
                    pag.unshift(i--);
                }
            } else { //当前页数大于显示页数
                var middle = this.current - Math.floor(this.showItem / 2), //从哪里开始
                    i = this.showItem;
                if (middle > (this.allpage - this.showItem)) {
                    middle = (this.allpage - this.showItem) + 1
                }
                while (i--) {
                    pag.push(middle++);
                }
            }
            return pag
        }
    },

    methods: {
        goto: function (index) {
            //  console.log(index);
            // if (index == this.current) return;
            this.current = index;
            this.pageno = index;
            this.$emit('pn', this.pageno)
        },
        gotoNext: function (index) {
            if (index == this.allpage) {
                return
            } else {
                ++index;
                this.current = index;
                this.pageno = index;
                this.$emit('pn', this.pageno);
            }
        },
        gotoPre: function (index) {
            if (index == "1") {
                return
            } else {
                --index;
                this.current = index;
                this.pageno = index;
                this.$emit('pn', this.pageno);
            }
        }
    }
});

//单品营销角色推荐榜
Vue.component("v-single-marketing", {
    template: `
        <div>
		
            <div class="b1 clearfix"  v-for='(l,index) in singleData'>
                <h1 class="single_title">{{dataTitle[index].title}}</h1>
				<ul class='single_box'>
					<li v-for='list in l'>
						<img :src='"../img/"+list.row_id+".png"' alt='' class='gold_top' />
						<a href='#select_ted'>
							<img :src="list.auction_picture" class="single_img" v-bind:auctionId='list.auction_id' @click='single(list.auction_id,list.auction_name,list.seller_id)'>
						</a>
						<p>{{list.auction_name}}</p>
					</li>
				</ul>
                <div class='single_discribe'>
                    <p>上榜理由：{{dataTitle[index].p1}}</p>
                    <p>角色策略：{{dataTitle[index].p2}}</p>
                    <p>风险管理：{{dataTitle[index].p3}}</p>
                </div>
            </div>
        </div>
    `,
	props: ["sellerid"],
    data: function () {
        return {
            sellerid: "",
            url: $api.SPTarget,
            time_motion: 10,
            top: 3,
            singleData: [],
            dataTitle: [{
                title: '最强实力榜',
                p1: '店铺近30天成交笔数最多的前三个单品',
                p2: '店铺既有爆款，通过及时优化标题，强占相应精准有效的重要搜索排位，给店铺带来流量资源。',
                p3: '实力榜商品警惕动态评分、售后评价及违规问题'
              
            }, {
                title: '最大潜力榜',
                p1: '店铺近30天成交笔数环比增量最稳定的前三个单品',
                p2: '店铺既有潜在爆款，通过一定的店内外流量配比，协助既有爆款抢占品类核心排位',
                p3: '警惕售后评价、动态评分及违规问题'
                
            }, {
                title: '最佳转化榜',
                p1: '店铺近30天页面转化率均值最高的前三个单品',
                p2: '店铺页面封套、最佳关联销售和可选对象，通常也可做新客首单尝试的引导',
                p3: '流量导入后，警惕转化严重下降的情况'
            }, {
                title: '最佳收割榜',
                p1: '店铺近30天页面单品IUV价值均值最高的前三个单品',
                p2: '店铺流量变现价值最大的商品，重点在于流量聚集',
                p3: '流量导入后，警惕转化严重下降的情况',
            }]
        }
    },

    methods: {
        //请求SP函数
		
        singleDat: function(sp) {
			var $this = this;
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: sp,
                    params: $this.sellerid + ',' + $this.time_motion + ',' + $this.top
                },
                dataType: "json",
                async: false,
                success: function (data) {
					//console.log(data);
                    //将请求回来的数据赋值给data里的singleData
                   $this.singleData.push(data.data);
					
                },
                error: function (xhr) {
                    console.log(xhr);
                   
                }
            });
        },
        //点击图片后，将当前的商品ID放在触发器里，带到第一个下拉框处，进行对比判断，看是否有该商品
        single: function (authionId, auctionName, sellerId) {
            //将商品ID存在对象里，用触发器出发，送出去
            var authData = {
                authion_id: authionId,
                auction_name: auctionName,
                seller_id: sellerId
            };
            //触发器存放authData 当前商品ID

            bus.$emit("getAuthid", authData);

        }
    },
	
    created() {
        
        var $this = this;
		
        //接收器接收数据
        bus.$on("getAid", function (updata) { //注意this指向问题
            $this.singleData = []; //清空数据
            $this.sellerid = updata.sellerid;
            //实例化SP
            $this.singleDat('SP_Auction_HotTop');
            $this.singleDat('SP_Auction_Potential');
            $this.singleDat('SP_Auction_CVR');
            $this.singleDat('SP_Auction_ReapTop');
			//console.log($this.singleData);
        });

       
    },
});