var sellerid = sessionStorage.getItem('sellerId');
var shopname = sessionStorage.getItem('shopname');

//组件通信  测试组件--运营看板--核心预警
var bus1 = new Vue();

//组件通信  核心预警--调整计划表
var bus = new Vue();

//测试组件实例化
var _testVm = new Vue({
    el: "#operate-test_btn",
});

//左侧菜单组件实例化
var leftMenu = new Vue({
    el: "#leftMenu_Box",
    data:{
        current:0
    }
});

//运营看板实例化
var _vm = new Vue({
    el: "#operate-top",
    data: {
        onOff: true,
        url: $api.OperatingKanban,
        id: '',
        tableTop: [],
        selectTime: "2017-07-14",
    },
    created() {
        // //获取店铺id
         var $this = this;
		 //console.log('2222');
        // $.ajax({
            // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            // type: "POST",
            // dataType: "json",
            // contentType: "application/json",
            // success: function(data) {
				// console.log(data);
                // var shopname = data.shopname;
                // // if (data == false) {
                // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                // // } else {
                // var $str = data.shopname;
                // //添加用户数据
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

                // //获取店铺ID
                // $.ajax({
                    // url: $api.querySeller,
                    // type: "GET",
                    // data: {
                        // shopname: shopname
                    // },
                    // dataType: "json",

                    // success: function(data) {
                        // $this.id = data.data[0].sellerId;
                        // adddata($this.id);
                    // },
                    // error: function(xhr) {
                        // //   console.log(xhr);
                    // }
                // });
                // // }
            // },
            // // error: function(xhr) {
            // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            // // },
        // });

        // var $this = this;
        // adddata(195051840); 

       
            
                //  $this.id = id;

            
            $.ajax({
                url: "http://localhost:30005/searchmouse-admin/shopWarn/SP_OutPutTarget",
                type: "get",
                data: {
                    sellerid: sellerid
                },
                dataType: "json",
                async: false,
                success: function(data) {
					console.log(data);
				if(data.data == null || data.data == ''){
					$this.onOff = false; //若数据加载比较慢出现图片
				}
                    //	var doc_html ='';
                    //$('#operate-top').hide();
                    var target = new Array("访客数",
                        "新访客数",
                        "回头客数",
                        "新访客占比",
                        "无线访客占比",
                        "一次留存率", "页面到达率",
                        "平均访问深度",
                        "页面收藏率",
                        "页面加购率",
                        "店铺拍下笔数",
                        "店铺拍下金额",
                        "店铺下单率",
                        "下单客单件",
                        "下单客单价",
                        "店铺成交金额",
                        "下单支付率",
                        "订单支付率",
                        "支付客单件",
                        "支付客单价",
                        "已收款金额",
                        "交易成功笔数",
                        "已收货商品数",
                        "退款成功金额",
                        "七天订单完结率")
                    var title = new Array("<b>访客数：</b>你的店铺页面或产品详情页被访问的人数，排除重复人数，一个人在一个自然天内访问多次记为一次。",
                        "<b>新访客数：</b>一个自然天内，访问您店铺中的新访客数。本次访问前6天内曾经来访过店铺，记做老访客，否则为新访客。",
                        "<b>回头客数：</b>浏览回头客人数",
                        "<b>新访客占比：</b>统计时间内，新访客数占总访客数的百分比",
                        "<b>无线访客占比：</b>一个自然天内，店铺的无线端访客数占比（即：自然天无线端访客数/（自然天PC端访客数+自然天无线端访客数））。",
                        "<b>一次留存率：</b>来访店铺浏览量大于1的访客数占总访客数的百分比。",
                        "<b>详情页到达率：</b>商品详情页的访客数与店铺总访客数的比值。",
                        "<b>平均访问深度：</b>访问深度为用户在一次访问内访问店铺内页面的次数，平均访问深度即所有用户每次访问时访问深度的平均值。跨天查看时，该指标是一个自然天内的平均值。",
                        "<b>详情页收藏率：</b>所有商品页被收藏的次数占店铺总访客数的比值。另据我们统计发现店铺首页收藏次数占总收藏次数的比例很小（超半数的情况店铺首页收藏次数与总收藏次数占比都不到百分之十），所以不另做店铺首页收藏的统计。",
                        "<b>详情页加购率：</b>将商品添加至购物车的用户数占店铺总访客数的比值。",
                        "<b>店铺拍下笔数：</b>店铺中宝贝被拍下的总次数（一次拍下多件宝贝，算拍下一笔）。",
                        "<b>店铺拍下金额：</b>店铺中宝贝被拍下的总金额。",
                        "<b>店铺下单率：</b>一个自然天内，店铺拍下笔数与店铺访客数的比值。",
                        "<b>下单客单件：</b>店铺商品被拍下的总件数与拍下笔数的比值。",
                        "<b>下单客单价：</b>店铺商品被拍下的总金额与拍下笔数的比值。",
                        "<b>店铺成交金额：</b>一个自然天内，进入店铺的用户，拍下且通过支付宝交易的成交金额总和（含运费）。<br/>店铺成交金额=直接成交金额+间接成交金额。",
                        "<b>下单支付率：</b>完成支付宝支付的总金额占拍下总金额的比值。",
                        "<b>订单支付率：</b>支付订单数占下单订单数的百分比，支付率=支付订单数/下单订单数",
                        "<b>支付客单件：</b>店铺商品支付总件数/店铺支付人数",
                        "<b>支付客单价：</b>支付宝成交金额/店铺支付人数。单日“客单价”指单日每成交用户产生的成交金额。",
                        "<b>已收款金额：</b>一个自然天内，显示已收货的商品总金额。",
                        "<b>交易成功笔数：</b>一个自然天内，完成交易的总笔数。",
                        "<b>已收货商品数：</b>一个自然天内，显示已收货的商品数量。",
                        "<b>退款成功金额：</b>一个自然天内完成退款申请流程的退款总金额。",
                        "<b>七天订单完结率：</b>七天内交易成功的笔数占支付买家数的百分比。")
                    // var data_list = data.data.arrary
                    // var dataForTable = [];
                    // for (var i = 0; i < data_list.length; i++) {
                        // var obj = {};;
                        // obj.target = target[i];
                        // obj.rank = "";
                        // obj.value = "";
                        // obj.isActive = false;
                        // obj.title = title[i];
                        // /*	dataForTable[i].target=target[i];
                        	// dataForTable[i].rank="";
                        	// dataForTable[i].value="";
                        	// dataForTable[i].isActive=false;
                        	// dataForTable[i].title=title[i]; */
                        // dataForTable.push(obj)
                    // }
                    /*	if(data.retValue.data1[1].dataarrowid=1){
                    		//for(var i = 0 ; i<data_list.length;i++){
                            doc_html += '<tr class="operateAI_board_table_title">';
                    		doc_html += '<td class="operate_top_title">跟踪项目</td>';
                    		doc_html += '<td>data.retValue.data1[1].operate'+'data.retValue.data1[1].operate';
                    		doc_html += '<div value="&lt;b&gt;访客数：&lt;/b&gt;你的店铺页面或产品详情页被访问的人数，排除重复人数，一个人在一个自然天内访问多次记为一次。" class="target_samll_box"></div></td>';
                    		doc_html += '<td>New_UV';
                    		doc_html += '<div value="&lt;b&gt;新访客数：&lt;/b&gt;一个自然天内，访问您店铺中的新访客数。本次访问前6天内曾经来访过店铺，记做老访客，否则为新访客。" class="target_samll_box"></div></td>';
                    		doc_html += '<td>visit_repeat_num';
                    		doc_html += '<div value="&lt;b&gt;回头客数：&lt;/b&gt;浏览回头客人数" class="target_samll_box"></div></td>';
                    		doc_html += '<td>New_UV_Rate';
                    		doc_html += '<div value="&lt;b&gt;新访客占比：&lt;/b&gt;统计时间内，新访客数占总访客数的百分比。" class="target_samll_box"></div></td>';
                    		doc_html += '<td>Wireless_UV_Rate ';
                    		doc_html += '<div value="&lt;b&gt;无线访客占比：&lt;/b&gt;一个自然天内，店铺的无线端访客数占比（即：自然天无线端访客数/（自然天PC端访客数+自然天无线端访客数））。" class="target_samll_box"></div></td> ';
                    		doc_html += '<td rowspan="2" class="character_box flow_chara">流量特征</td>';
                    		doc_html += '</tr> ';
                    		doc_html += '<tr>';
                    		doc_html += '<td class="operate_top_title">数值（日环比）</td> ';
                    		doc_html += '<td><p title=""></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		doc_html += '<td><p></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		doc_html += '<td><p title="1">2</p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		doc_html += '<td><p title=""></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		doc_html += '<td><p title=""></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		doc_html += '</tr>';
                    		
                    	} 
                    	$('#tbody_load_list').html(doc_html);*/
                    // var arrowLeft = []; //left  剔除箭头数组
                    // var arrowRight = []; //right 箭头数组

                    // //将数据进行格式转化 ，分别放入两个数组
                    // for (var x in data.data.arrary) {
                        // var $arrow = {
                            // target: target[x],
                            // value: x,
                        // };
                        // arrowLeft.push($arrow);
                    // }

                    // //将数据进行格式转化 ，分别放入两个数组
                    // for (var x in data.data.arraryArrow) {
                        // var $noarrow = {
                            // target: target[x],
                            // rank: x
                        // }
                        // arrowRight.push($noarrow);
                    // }
                    // // console.log(arrowLeft);
                    // // console.log(arrowRight);

                    // //将数值放入匹配，放入对象
                    // for (var i = 0; i < dataForTable.length; i++) {
                        // for (var k = 0; k < arrowLeft.length; k++) {
                            // if (dataForTable[i].target == arrowLeft[k].target) {
                                // dataForTable[i].value = arrowLeft[k].value;
                            // }
                        // }
                    // }
                    // //将箭头指数放入对象中
                    // for (var n = 0; n < dataForTable.length; n++) {
                        // for (var m = 0; m < arrowRight.length; m++) {
                            // if (dataForTable[n].target == arrowRight[m].target) {
                                // dataForTable[n].rank = arrowRight[m].rank;
                            // }
                        // }
                    // }

                    // console.log('-----------------------------');
                    // console.log(dataForTable);
                    // 如果数据中， 所有的value值为0； 则代表无数据， 显示数据正在加载中图片
                    // var dataForTableLength = 0;
                    // for (var k = 0; k < dataForTable.length; k++) {
                        // if (parseInt(dataForTable[k].value) == 0) {
                            // dataForTableLength++;
                        // };
                    // }
                    // // console.log(dataForTableLength);
                    // if (dataForTable.length == dataForTableLength) {
                        // $this.onOff = false;
                        // return;
                    // }
                    // $this.onOff = true;
                    // //根据名称添加单位
                    // var data = dataForTable;
                    //    for (var i = 0; i < data.length; i++) {
                    //    if (data[i].target.indexOf("金额") > -1 || data[i].target.indexOf("单价") > -1) {
                    //      data[i].value = "￥" + data[i].value.toFixed(2);
                    // } else if (data[i].target.indexOf("率") > -1 || data[i].target.indexOf("占比") > -1) {
                    //    data[i].value = (data[i].value * 100).toFixed(2) + "% ";
                    //}
                    // }

                    // arrowLeft[11].value= "￥" + arrowLeft[11].value.toFixed(2);

                    // arrowLeft[15]= "￥" + arrowLeft[15].toFixed(2);
                    // arrowLeft[20]= "￥" + arrowLeft[20].toFixed(2);
                    //arrowLeft[23]= "￥" + arrowLeft[23].toFixed(2);
                    // arrowLeft[14]= "￥" + arrowLeft[14].toFixed(2);
                    //arrowLeft[19]= "￥" + arrowLeft[19].toFixed(2);

                    //   arrowLeft[3]= (arrowLeft[3] * 100).toFixed(2) + "%";;
                    //arrowLeft[4]= (arrowLeft[4] * 100).toFixed(2) + "%";;
                    //arrowLeft[5]= (arrowLeft[5] * 100).toFixed(2) + "%";;
                    //   arrowLeft[6]= (arrowLeft[6] * 100).toFixed(2) + "%";;
                    //将data拆分为五个数组
                    var b = [];
                    var result = [];
                    var k = 0;
                    for (var i = 0; i < data.length; ++i) {
                        if (i % 5 == 0) {
                            b = [];
                            for (var j = 0; j < 5; ++j) {
                                if (data[i + j] == undefined) {
                                    continue;
                                } else {
                                    b[j] = data[i + j];
                                }
                            }
                            result[k] = b;
                            k++;
                        }
                    }
                    $this.tableTop = result;
                    // console.log($this.tableTop); 
                },
                error: function(xhr) {
                    $this.onOff = false;
                    console.log(xhr);
                },
            });
        
    },
});



//调整日志 实例化
// var vm2 = new Vue({
    // el: "#adjust-info",
    // data: {
        // // onOff: true,
        // url: $api.queryLog,
        // pageno: 1, //当前页码
        // pagesize: 10, //分页大小
        // tableData: [], //表格数据
        // count: 0, //总数据量
        // allpage: 0, //总页数
        // sellerid: "", //店铺ID
    // },
    // created() {
        // //获取店铺id
        // var $this = this;
        // $.ajax({
            // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            // type: "POST",
            // dataType: "json",
            // contentType: "application/json",
            // success: function(data) {

                // // if (data == false) {
                // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                // // } else {
                // var $str = data.shopname;
                // //添加用户数据
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

                // //获取店铺ID
                // //获取店铺ID
                // $.ajax({
                    // url: $api.querySeller,
                    // type: "GET",
                    // data: {
                        // shopname: shopname
                    // },
                    // type: "GET",
                    // dataType: "json",
                    // success: function(data) {
                        // console.log(data.data);
                        // // console.log(data);
                        // // bus1.$emit("sentID",data[0].SellerId);

                        // $this.sellerid = data.data.sellerId;
                        // $.ajax({
                            // url: $this.url,
                            // type: "POST",
                            // data: {
                                // sellerid: $this.sellerid,
                                // pageNo: $this.pageno,
                                // pagesiZe: $this.pagesize
                            // },
                            // dataType: "json",
                            // async: false,
                            // success: function(data) { //若为新店，可能存在无日志的情况
                                // $this.count = data[0].Count;
                                // addData();
                            // },
                            // error: function(xhr) {
                                // console.log(xhr);
                            // },
                        // });
                    // },
                    // error: function(xhr) {
                        // console.log(xhr);
                    // }
                // });
                // // }
            // },
            // // error: function(xhr) {
            // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            // // },
        // });

        // // var $this = this;
        // // $this.sellerid = 195051840; //钧安堂
        // // $this.sellerid = 1062340001; //无数据
        // // addData();

        // function addData() {
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // data: {
                    // // onOff: true,
                    // sellerid: $this.sellerid,
                    // pageNo: $this.pageno,
                    // pagesiZe: $this.pagesize
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // // console.log(data);
                    // if (data.length != 0) {
                        // $this.count = data[0].Count;
                    // } else {
                        // $this.count = 1;
                    // }
                    // $this.tableData = data;
                    // $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                // },
                // error: function(xhr) {
                    // console.log(xhr);
                // },
            // });
        // };
        // //表格刷新
        // bus1.$on("reflash", (onOff) => {
            // if (onOff) {
                // var $this = this;
                // // $this.onOff = true;
                // addData();
            // }
        // });
    // },
    // methods: {
        // //接收分页组件页码
        // changepn: function(pn) {
            // var $this = this;
            // this.pageno = pn;
            // var $this = this;
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // data: {
                    // sellerid: $this.sellerid,
                    // pageNo: $this.pageno,
                    // pagesiZe: $this.pagesize
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // $this.tableData = data;
                // },
                // error: function(xhr) {
                    // console.log(xhr)
                // }
            // });
        // },
    // }
// });

//核心预警组件 调整计划表格组件 实例化
// var vm = new Vue({
    // el: "#main-warning",
    // data: {
        // noData: false,
        // tableis: true,
        // loadis: false,
        // url: $api.findTarget,
        // id: '',
        // tableData: [],
        // selected: "2017-07-14",
        // orignData: [],
    // },
	// methods:{
		
	// },
    // created() {
        // //获取店铺id
        // var $this = this;
        // // $.ajax({
            // // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            // // type: "POST",
            // // dataType: "json",
            // // contentType: "application/json",
            // // success: function(data) {
                // // var shopname = data.shopname;
                // // // if (data == false) {
                // // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                // // // } else {
                // // var $str = data.shopname;
                // // //添加用户数据
                // // function dat() {
                    // // $(".user-a").html('');
                    // // var datStr =
                        // // '<span>' + data.shopname + '</span>' +
                        // // '<div class="help-box">' +
                        // // '<div class="help-date" data-start="2013-04-24">' +
                        // // '<div><span>' + data.enddate + '</span> 到期 </div><a href="https://fuwu.taobao.com/ser/detail.html?service_code=ts-18350" target="_blank">续费升级</a></div>' +
                        // // '<div class="help-num">021-65400080</div>' +
                        // // '<div class="help-more">' +
                        // // '<a class="help-contact" target="_blank" href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%8A%E6%B5%B7%E6%99%8F%E9%BC%A0%3A%E8%8A%92%E6%9E%9C&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8">技术支持</a>' +
                        // // '<a class="help-explain" href="Help.aspx">使用说明</a>' +
                        // // '</div>' +
                        // // '</div>';
                    // // $(".user-a").html(datStr);
                // // }
                // // dat();

                // // //获取店铺ID
                // // $.ajax({
                    // // url: $api.querySeller,
                    // // type: "GET",
                    // // data: {
                        // // shopname: shopname
                    // // },
                    // // type: "GET",
                    // // dataType: "json",
                    // // success: function(data) {
                        // // console.log(data);
                        // // // console.log(data);
                        // // // bus1.$emit("sentID",data[0].SellerId);

                        // // $this.id = data.data[0].sellerId;
                        // // addData();
                    // // },
                    // // error: function(xhr) {
                        // // console.log(xhr);
                    // // }
                // // });
                // // // }
            // // },
            // // // error: function(xhr) {
            // // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            // // // },
        // // });


        // // var $this = this;
        // // $this.id = 195051840; //原来的
        // // // $this.id = 1062340001;//无数据
        // // addData(); //驼峰

        // function addData() {
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // // data: {
                // //      id: $this.id,
                // //sort: true
                // //     },
                // data: {
                    // name: 'sp_show_thunder',
                    // params: $this.sellerid
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // console.log("chenggongle");
                    // // console.log(data);
                    // var data = data;
                    // $.ajax({
                        // url: $api.todayLog,
                        // type: "POST",
                        // data: {
                            // sellerid: $this.id,
                        // },
                        // dataType: "json",
                        // async: false,
                        // success: function(result) {
                            // // console.log(result);
                            // //将两个数据进行对比，如果相同，则剔除
                            // for (var j = 0; j < result.length; j++) {
                                // for (var k = 0; k < data.length; k++) {
                                    // if (result[j].Pl_Index == data[k].target) {
                                        // data.splice(k, 1);
                                    // }
                                // }
                            // };
                            // // console.log(data);
                            // //克隆源数据
                            // function cloneFun(obj) {
                                // if (!obj || "object" != typeof obj) {
                                    // return null;
                                // }
                                // var result = (obj instanceof Array) ? [] : {};
                                // for (var i in obj) {
                                    // result[i] = ("object" != typeof obj[i]) ? obj[i] : cloneFun(obj[i]);
                                // }
                                // return result;
                            // };
                            // var orignData = cloneFun(data);
                            // for (var i = 0; i < data.length; i++) {
                                // if (data[i].target.indexOf("金额") > -1 || data[i].target.indexOf("单价") > -1) {
                                    // data[i].shopValue.today = "￥" + data[i].shopValue.today.toFixed(2);
                                    // data[i].shopValue.yesterday = "￥" + data[i].shopValue.yesterday.toFixed(2);
                                // } else if (data[i].target.indexOf("率") > -1 || data[i].target.indexOf("占比") > -1) {
                                    // data[i].shopValue.today = (data[i].shopValue.today * 100).toFixed(2) + "%";
                                    // data[i].shopValue.yesterday = (data[i].shopValue.yesterday * 100).toFixed(2) + "%";
                                // }
                            // };
                            // data = data.splice(0, 10);
                            // orignData = orignData.splice(0, 10);
                            // for (var i = 0; i < data.length; i++) {
                                // if (data[i].rank <= -70) {
                                    // data[i].level = 4
                                // } else if (data[i].rank <= -30 && -70 < data[i].rank) {
                                    // data[i].level = 3
                                // } else if (data[i].rank < 0 && data[i].rank > -30) {
                                    // data[i].level = 2
                                // } else {
                                    // data[i].level = 1
                                // }
                            // };
                            // $this.tableData = data;
                            // $this.orignData = orignData.splice(0, 10);
                            // // console.log($this.tableData, $this.orignData);

                            // if ($this.tableData.length == 0) {
                                // $this.noData = true;
                                // $this.loadis = false;
                                // $this.tableis = false;
                            // };
                        // },
                        // error: function(xhr) {
                            // console.log(xhr);
                        // }
                    // });
                // },
                // error: function(xhr) {
                    // console.log($this.id);
                    // console.log(xhr);
                    // //若数据加载失败，显示正在加载数据图片
                    // $this.tableis = false;
                    // $this.loadis = true;
                    // $this.noData = false;
                    // return;
                // },
            // });
        // };

        // bus1.$on("reflashTable", (onOff) => {
            // var $this = this;
            // addData();
        // });

    // }
	
// });

//产品转化地图模块  组件实例化
// var transform = new Vue({
    // el: "#transform_map",
	
    // data: {
        // sellerid: '',
        // url: $api.SPTarget,
        // allData: [{
            // type: "PV",
            // title: "路径层",
            // arr: []
        // }, {
            // type: "下单子订单数",
            // title: "下单层",
            // arr: []
        // }, {
            // type: "支付子订单数",
            // title: "支付层",
            // arr: []
        // }], //处理后的数据结构
        // mapShow: true, //显示无数据图片
    // },
    // created() {
        // var $this = this;
		


        // // var $this = this;
        // // $this.sellerid = 195051840; //原来的
        // // // $this.sellerid = 1062340001; //无数据
        

        // //请求接口
			
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // data: {
                    // name: "SP_Auction_Translation",
                    // params: sellerid
                   
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                     // console.log(data); //将数据处理成三大块
					 // var data = data.data;
                    // if (data.length != 0) {
                        // for (var i = 0; i < data.length; i++) {
                            // for (var j = 0; j < $this.allData.length; j++) {
                                // if (data[i].level == $this.allData[j].type) {
                                    // $this.allData[j].arr.push(data[i]);
                                // }
                            // }
                        // }
                    // } else {
                        // $this.mapShow = false;
                    // }
					// console.log($this.allData);
                // },
                // error: function(xhr) {
                    // console.log(xhr);
                // }
            // });
        
		
    // }
// }); 
//组件通信  测试组件--运营看板--核心预警
var bus1 = new Vue();

//组件通信  核心预警--调整计划表
var bus = new Vue();

//测试组件实例化
var _testVm = new Vue({
    el: "#operate-test_btn",

});

//左侧菜单组件实例化
var leftMenu = new Vue({
    el: "#leftMenu_Box",
});

//运营看板实例化
// var _vm = new Vue({
    // el: "#operate-top",
    // data: {
        // onOff: true,
        // url: $api.OperatingKanban,
        // id: '',
        // tableTop: [],
        // selectTime: "2017-07-14",
    // },
    // created() {
        // //获取店铺id
        // var $this = this;
        // $.ajax({
            // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            // type: "POST",
            // dataType: "json",
            // contentType: "application/json",
            // success: function(data) {
                // var shopname = data.shopname;
                // // if (data == false) {
                // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                // // } else {
                // var $str = data.shopname;
                // //添加用户数据
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

                // //获取店铺ID
                // $.ajax({
                    // url: $api.querySeller,
                    // type: "GET",
                    // data: {
                        // shopname: shopname
                    // },
                    // dataType: "json",

                    // success: function(data) {
                        // $this.id = data.data[0].sellerId;
                        // adddata($this.id);
                    // },
                    // error: function(xhr) {
                        // //   console.log(xhr);
                    // }
                // });
                // // }
            // },
            // // error: function(xhr) {
            // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            // // },
        // });

        // // var $this = this;
        // // adddata(195051840); 

        // function adddata(id) {
            // console.log(id)
                // //  $this.id = id;

            // $this.onOff = false; //若数据加载比较慢出现图片
            // $.ajax({
                // url: $this.url,
                // type: "get",
                // data: {
                    // id: id
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // //	var doc_html ='';
                    // //$('#operate-top').hide();
                    // var target = new Array("访客数",
                        // "新访客数",
                        // "回头客数",
                        // "新访客占比",
                        // "无线访客占比",
                        // "一次留存率", "页面到达率",
                        // "平均访问深度",
                        // "页面收藏率",
                        // "页面加购率",
                        // "店铺拍下笔数",
                        // "店铺拍下金额",
                        // "店铺下单率",
                        // "下单客单件",
                        // "下单客单价",
                        // "店铺成交金额",
                        // "下单支付率",
                        // "订单支付率",
                        // "支付客单件",
                        // "支付客单价",
                        // "已收款金额",
                        // "交易成功笔数",
                        // "已收货商品数",
                        // "退款成功金额",
                        // "七天订单完结率")
                    // var title = new Array("<b>访客数：</b>你的店铺页面或产品详情页被访问的人数，排除重复人数，一个人在一个自然天内访问多次记为一次。",
                        // "<b>新访客数：</b>一个自然天内，访问您店铺中的新访客数。本次访问前6天内曾经来访过店铺，记做老访客，否则为新访客。",
                        // "<b>回头客数：</b>浏览回头客人数",
                        // "<b>新访客占比：</b>统计时间内，新访客数占总访客数的百分比",
                        // "<b>无线访客占比：</b>一个自然天内，店铺的无线端访客数占比（即：自然天无线端访客数/（自然天PC端访客数+自然天无线端访客数））。",
                        // "<b>一次留存率：</b>来访店铺浏览量大于1的访客数占总访客数的百分比。",
                        // "<b>详情页到达率：</b>商品详情页的访客数与店铺总访客数的比值。",
                        // "<b>平均访问深度：</b>访问深度为用户在一次访问内访问店铺内页面的次数，平均访问深度即所有用户每次访问时访问深度的平均值。跨天查看时，该指标是一个自然天内的平均值。",
                        // "<b>详情页收藏率：</b>所有商品页被收藏的次数占店铺总访客数的比值。另据我们统计发现店铺首页收藏次数占总收藏次数的比例很小（超半数的情况店铺首页收藏次数与总收藏次数占比都不到百分之十），所以不另做店铺首页收藏的统计。",
                        // "<b>详情页加购率：</b>将商品添加至购物车的用户数占店铺总访客数的比值。",
                        // "<b>店铺拍下笔数：</b>店铺中宝贝被拍下的总次数（一次拍下多件宝贝，算拍下一笔）。",
                        // "<b>店铺拍下金额：</b>店铺中宝贝被拍下的总金额。",
                        // "<b>店铺下单率：</b>一个自然天内，店铺拍下笔数与店铺访客数的比值。",
                        // "<b>下单客单件：</b>店铺商品被拍下的总件数与拍下笔数的比值。",
                        // "<b>下单客单价：</b>店铺商品被拍下的总金额与拍下笔数的比值。",
                        // "<b>店铺成交金额：</b>一个自然天内，进入店铺的用户，拍下且通过支付宝交易的成交金额总和（含运费）。<br/>店铺成交金额=直接成交金额+间接成交金额。",
                        // "<b>下单支付率：</b>完成支付宝支付的总金额占拍下总金额的比值。",
                        // "<b>订单支付率：</b>支付订单数占下单订单数的百分比，支付率=支付订单数/下单订单数",
                        // "<b>支付客单件：</b>店铺商品支付总件数/店铺支付人数",
                        // "<b>支付客单价：</b>支付宝成交金额/店铺支付人数。单日“客单价”指单日每成交用户产生的成交金额。",
                        // "<b>已收款金额：</b>一个自然天内，显示已收货的商品总金额。",
                        // "<b>交易成功笔数：</b>一个自然天内，完成交易的总笔数。",
                        // "<b>已收货商品数：</b>一个自然天内，显示已收货的商品数量。",
                        // "<b>退款成功金额：</b>一个自然天内完成退款申请流程的退款总金额。",
                        // "<b>七天订单完结率：</b>七天内交易成功的笔数占支付买家数的百分比。")
                    // var data_list = data.data.arrary
                    // var dataForTable = [];
                    // for (var i = 0; i < data_list.length; i++) {
                        // var obj = {};;
                        // obj.target = target[i];
                        // obj.rank = "";
                        // obj.value = "";
                        // obj.isActive = false;
                        // obj.title = title[i];
                        // /*	dataForTable[i].target=target[i];
                        	// dataForTable[i].rank="";
                        	// dataForTable[i].value="";
                        	// dataForTable[i].isActive=false;
                        	// dataForTable[i].title=title[i]; */
                        // dataForTable.push(obj)
                    // }
                    // /*	if(data.retValue.data1[1].dataarrowid=1){
                    		// //for(var i = 0 ; i<data_list.length;i++){
                            // doc_html += '<tr class="operateAI_board_table_title">';
                    		// doc_html += '<td class="operate_top_title">跟踪项目</td>';
                    		// doc_html += '<td>data.retValue.data1[1].operate'+'data.retValue.data1[1].operate';
                    		// doc_html += '<div value="&lt;b&gt;访客数：&lt;/b&gt;你的店铺页面或产品详情页被访问的人数，排除重复人数，一个人在一个自然天内访问多次记为一次。" class="target_samll_box"></div></td>';
                    		// doc_html += '<td>New_UV';
                    		// doc_html += '<div value="&lt;b&gt;新访客数：&lt;/b&gt;一个自然天内，访问您店铺中的新访客数。本次访问前6天内曾经来访过店铺，记做老访客，否则为新访客。" class="target_samll_box"></div></td>';
                    		// doc_html += '<td>visit_repeat_num';
                    		// doc_html += '<div value="&lt;b&gt;回头客数：&lt;/b&gt;浏览回头客人数" class="target_samll_box"></div></td>';
                    		// doc_html += '<td>New_UV_Rate';
                    		// doc_html += '<div value="&lt;b&gt;新访客占比：&lt;/b&gt;统计时间内，新访客数占总访客数的百分比。" class="target_samll_box"></div></td>';
                    		// doc_html += '<td>Wireless_UV_Rate ';
                    		// doc_html += '<div value="&lt;b&gt;无线访客占比：&lt;/b&gt;一个自然天内，店铺的无线端访客数占比（即：自然天无线端访客数/（自然天PC端访客数+自然天无线端访客数））。" class="target_samll_box"></div></td> ';
                    		// doc_html += '<td rowspan="2" class="character_box flow_chara">流量特征</td>';
                    		// doc_html += '</tr> ';
                    		// doc_html += '<tr>';
                    		// doc_html += '<td class="operate_top_title">数值（日环比）</td> ';
                    		// doc_html += '<td><p title=""></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		// doc_html += '<td><p></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		// doc_html += '<td><p title="1">2</p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		// doc_html += '<td><p title=""></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		// doc_html += '<td><p title=""></p> <h2><img src="../img/line.png" alt="" /></h2></td>';
                    		// doc_html += '</tr>';
                    		
                    	// } 
                    	// $('#tbody_load_list').html(doc_html);*/
                    // var arrowLeft = []; //left  剔除箭头数组
                    // var arrowRight = []; //right 箭头数组

                    // //将数据进行格式转化 ，分别放入两个数组
                    // for (var x in data.data.arrary) {
                        // var $arrow = {
                            // target: target[x],
                            // value: x,
                        // };
                        // arrowLeft.push($arrow);
                    // }

                    // //将数据进行格式转化 ，分别放入两个数组
                    // for (var x in data.data.arraryArrow) {
                        // var $noarrow = {
                            // target: target[x],
                            // rank: x
                        // }
                        // arrowRight.push($noarrow);
                    // }
                    // // console.log(arrowLeft);
                    // // console.log(arrowRight);

                    // //将数值放入匹配，放入对象
                    // for (var i = 0; i < dataForTable.length; i++) {
                        // for (var k = 0; k < arrowLeft.length; k++) {
                            // if (dataForTable[i].target == arrowLeft[k].target) {
                                // dataForTable[i].value = arrowLeft[k].value;
                            // }
                        // }
                    // }
                    // //将箭头指数放入对象中
                    // for (var n = 0; n < dataForTable.length; n++) {
                        // for (var m = 0; m < arrowRight.length; m++) {
                            // if (dataForTable[n].target == arrowRight[m].target) {
                                // dataForTable[n].rank = arrowRight[m].rank;
                            // }
                        // }
                    // }

                    // // console.log('-----------------------------');
                    // // console.log(dataForTable);
                    // // 如果数据中， 所有的value值为0； 则代表无数据， 显示数据正在加载中图片
                    // var dataForTableLength = 0;
                    // for (var k = 0; k < dataForTable.length; k++) {
                        // if (parseInt(dataForTable[k].value) == 0) {
                            // dataForTableLength++;
                        // };
                    // }
                    // // console.log(dataForTableLength);
                    // if (dataForTable.length == dataForTableLength) {
                        // $this.onOff = false;
                        // return;
                    // }
                    // $this.onOff = true;
                    // //根据名称添加单位
                    // var data = dataForTable;
                    // //    for (var i = 0; i < data.length; i++) {
                    // //    if (data[i].target.indexOf("金额") > -1 || data[i].target.indexOf("单价") > -1) {
                    // //      data[i].value = "￥" + data[i].value.toFixed(2);
                    // // } else if (data[i].target.indexOf("率") > -1 || data[i].target.indexOf("占比") > -1) {
                    // //    data[i].value = (data[i].value * 100).toFixed(2) + "%";
                    // //}
                    // // }

                    // // arrowLeft[11].value= "￥" + arrowLeft[11].value.toFixed(2);

                    // // arrowLeft[15]= "￥" + arrowLeft[15].toFixed(2);
                    // // arrowLeft[20]= "￥" + arrowLeft[20].toFixed(2);
                    // //arrowLeft[23]= "￥" + arrowLeft[23].toFixed(2);
                    // // arrowLeft[14]= "￥" + arrowLeft[14].toFixed(2);
                    // //arrowLeft[19]= "￥" + arrowLeft[19].toFixed(2);

                    // //   arrowLeft[3]= (arrowLeft[3] * 100).toFixed(2) + "%";;
                    // //arrowLeft[4]= (arrowLeft[4] * 100).toFixed(2) + "%";;
                    // //arrowLeft[5]= (arrowLeft[5] * 100).toFixed(2) + "%";;
                    // //   arrowLeft[6]= (arrowLeft[6] * 100).toFixed(2) + "%";;
                    // //将data拆分为五个数组
                    // var b = [];
                    // var result = [];
                    // var k = 0;
                    // for (var i = 0; i < data.length; ++i) {
                        // if (i % 5 == 0) {
                            // b = [];
                            // for (var j = 0; j < 5; ++j) {
                                // if (data[i + j] == undefined) {
                                    // continue;
                                // } else {
                                    // b[j] = data[i + j];
                                // }
                            // }
                            // result[k] = b;
                            // k++;
                        // }
                    // }
                    // $this.tableTop = result;
                    // // console.log($this.tableTop); 
                // },
                // error: function(xhr) {
                    // $this.onOff = false;
                    // console.log(xhr);
                // },
            // });
        // };
    // },
// });



//调整日志 实例化
// var vm2 = new Vue({
    // el: "#adjust-info",
    // data: {
        // // onOff: true,
        // url: $api.queryLog,
        // pageno: 1, //当前页码
        // pagesize: 10, //分页大小
        // tableData: [], //表格数据
        // count: 0, //总数据量
        // allpage: 0, //总页数
        // sellerid: "", //店铺ID
    // },
    // created() {
        // //获取店铺id
        // var $this = this;
        // $.ajax({
            // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            // type: "POST",
            // dataType: "json",
            // contentType: "application/json",
            // success: function(data) {

                // // if (data == false) {
                // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                // // } else {
                // var $str = data.shopname;
                // //添加用户数据
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

                // //获取店铺ID
                // //获取店铺ID
                // $.ajax({
                    // url: $api.querySeller,
                    // type: "GET",
                    // data: {
                        // shopname: shopname
                    // },
                    // type: "GET",
                    // dataType: "json",
                    // success: function(data) {
                        // console.log(data.data);
                        // // console.log(data);
                        // // bus1.$emit("sentID",data[0].SellerId);

                        // $this.sellerid = data.data.sellerId;
                        // $.ajax({
                            // url: $this.url,
                            // type: "POST",
                            // data: {
                                // sellerid: $this.sellerid,
                                // pageNo: $this.pageno,
                                // pagesiZe: $this.pagesize
                            // },
                            // dataType: "json",
                            // async: false,
                            // success: function(data) { //若为新店，可能存在无日志的情况
                                // $this.count = data[0].Count;
                                // addData();
                            // },
                            // error: function(xhr) {
                                // console.log(xhr);
                            // },
                        // });
                    // },
                    // error: function(xhr) {
                        // console.log(xhr);
                    // }
                // });
                // // }
            // },
            // // error: function(xhr) {
            // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            // // },
        // });

        // // var $this = this;
        // // $this.sellerid = 195051840; //钧安堂
        // // $this.sellerid = 1062340001; //无数据
        // // addData();

        // function addData() {
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // data: {
                    // // onOff: true,
                    // sellerid: $this.sellerid,
                    // pageNo: $this.pageno,
                    // pagesiZe: $this.pagesize
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // // console.log(data);
                    // if (data.length != 0) {
                        // $this.count = data[0].Count;
                    // } else {
                        // $this.count = 1;
                    // }
                    // $this.tableData = data;
                    // $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                // },
                // error: function(xhr) {
                    // console.log(xhr);
                // },
            // });
        // };
        // //表格刷新
        // bus1.$on("reflash", (onOff) => {
            // if (onOff) {
                // var $this = this;
                // // $this.onOff = true;
                // addData();
            // }
        // });
    // },
    // methods: {
        // //接收分页组件页码
        // changepn: function(pn) {
            // var $this = this;
            // this.pageno = pn;
            // var $this = this;
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // data: {
                    // sellerid: $this.sellerid,
                    // pageNo: $this.pageno,
                    // pagesiZe: $this.pagesize
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // $this.tableData = data;
                // },
                // error: function(xhr) {
                    // console.log(xhr)
                // }
            // });
        // },
    // }
// });

//核心预警组件 调整计划表格组件 实例化
// var vm = new Vue({
    // el: "#main-warning",
    // data: {
        // noData: false,
        // tableis: true,
        // loadis: false,
        // url: $api.findTarget,
        // id: '',
        // tableData: [],
        // selected: "2017-07-14",
        // orignData: [],
    // },
    // created() {
        // //获取店铺id
        // var $this = this;
        // $.ajax({
            // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            // type: "POST",
            // dataType: "json",
            // contentType: "application/json",
            // success: function(data) {
                // var shopname = data.shopname;
                // // if (data == false) {
                // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                // // } else {
                // var $str = data.shopname;
                // //添加用户数据
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

                // //获取店铺ID
                // $.ajax({
                    // url: $api.querySeller,
                    // type: "GET",
                    // data: {
                        // shopname: shopname
                    // },
                    // type: "GET",
                    // dataType: "json",
                    // success: function(data) {
                        // console.log(data);
                        // // console.log(data);
                        // // bus1.$emit("sentID",data[0].SellerId);

                        // $this.id = data.data[0].sellerId;
                        // addData();
                    // },
                    // error: function(xhr) {
                        // console.log(xhr);
                    // }
                // });
                // // }
            // },
            // // error: function(xhr) {
            // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            // // },
        // });


        // // var $this = this;
        // // $this.id = 195051840; //原来的
        // // // $this.id = 1062340001;//无数据
        // // addData(); //驼峰

        // function addData() {
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // // data: {
                // //      id: $this.id,
                // //sort: true
                // //     },
                // data: {
                    // name: 'sp_show_thunder',
                    // params: $this.sellerid
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // console.log("chenggongle");
                    // // console.log(data);
                    // var data = data;
                    // $.ajax({
                        // url: $api.todayLog,
                        // type: "POST",
                        // data: {
                            // sellerid: $this.id,
                        // },
                        // dataType: "json",
                        // async: false,
                        // success: function(result) {
                            // // console.log(result);
                            // //将两个数据进行对比，如果相同，则剔除
                            // for (var j = 0; j < result.length; j++) {
                                // for (var k = 0; k < data.length; k++) {
                                    // if (result[j].Pl_Index == data[k].target) {
                                        // data.splice(k, 1);
                                    // }
                                // }
                            // };
                            // // console.log(data);
                            // //克隆源数据
                            // function cloneFun(obj) {
                                // if (!obj || "object" != typeof obj) {
                                    // return null;
                                // }
                                // var result = (obj instanceof Array) ? [] : {};
                                // for (var i in obj) {
                                    // result[i] = ("object" != typeof obj[i]) ? obj[i] : cloneFun(obj[i]);
                                // }
                                // return result;
                            // };
                            // var orignData = cloneFun(data);
                            // for (var i = 0; i < data.length; i++) {
                                // if (data[i].target.indexOf("金额") > -1 || data[i].target.indexOf("单价") > -1) {
                                    // data[i].shopValue.today = "￥" + data[i].shopValue.today.toFixed(2);
                                    // data[i].shopValue.yesterday = "￥" + data[i].shopValue.yesterday.toFixed(2);
                                // } else if (data[i].target.indexOf("率") > -1 || data[i].target.indexOf("占比") > -1) {
                                    // data[i].shopValue.today = (data[i].shopValue.today * 100).toFixed(2) + "%";
                                    // data[i].shopValue.yesterday = (data[i].shopValue.yesterday * 100).toFixed(2) + "%";
                                // }
                            // };
                            // data = data.splice(0, 10);
                            // orignData = orignData.splice(0, 10);
                            // for (var i = 0; i < data.length; i++) {
                                // if (data[i].rank <= -70) {
                                    // data[i].level = 4
                                // } else if (data[i].rank <= -30 && -70 < data[i].rank) {
                                    // data[i].level = 3
                                // } else if (data[i].rank < 0 && data[i].rank > -30) {
                                    // data[i].level = 2
                                // } else {
                                    // data[i].level = 1
                                // }
                            // };
                            // $this.tableData = data;
                            // $this.orignData = orignData.splice(0, 10);
                            // // console.log($this.tableData, $this.orignData);

                            // if ($this.tableData.length == 0) {
                                // $this.noData = true;
                                // $this.loadis = false;
                                // $this.tableis = false;
                            // };
                        // },
                        // error: function(xhr) {
                            // console.log(xhr);
                        // }
                    // });
                // },
                // error: function(xhr) {
                    // console.log($this.id);
                    // console.log(xhr);
                    // //若数据加载失败，显示正在加载数据图片
                    // $this.tableis = false;
                    // $this.loadis = true;
                    // $this.noData = false;
                    // return;
                // },
            // });
        // };

        // bus1.$on("reflashTable", (onOff) => {
            // var $this = this;
            // addData();
        // });

    // }
// });

//产品转化地图模块  组件实例化
// var transform = new Vue({
    // el: "#transform_map",
    // data: {
        // sellerid: '',
        // url: $api.SPTarget,
        // allData: [{
            // type: "PV",
            // title: "路径层",
            // arr: []
        // }, {
            // type: "下单子订单数",
            // title: "下单层",
            // arr: []
        // }, {
            // type: "支付子订单数",
            // title: "支付层",
            // arr: []
        // }], //处理后的数据结构
        // mapShow: true, //显示无数据图片
    // },
    // created() {
        // var $this = this;
        // $.ajax({
            // url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            // type: "POST",
            // dataType: "json",
            // contentType: "application/json",
            // success: function(data) {
                // // if (data == false) {
                // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                // // } else {
                // var $str = data.shopname;
                // //添加用户数据
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

                // //获取店铺ID
                // $.ajax({
                    // url: $api.querySeller + data.shopname,
                    // type: "GET",
                    // dataType: "json",
                    // success: function(data) {
                        // // console.log(data);
                        // // bus1.$emit("sentID",data[0].SellerId);

                        // $this.sellerid = data.data.sellerId;
                        // sellerid = data.data.sellerId;
                        // tranMap();
                    // },
                    // error: function(xhr) {
                        // console.log(xhr);
                    // }
                // });
                // // }
            // },
            // // error: function(xhr) {
            // //     window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            // // },
        // });


        // // var $this = this;
        // // $this.sellerid = 195051840; //原来的
        // // // $this.sellerid = 1062340001; //无数据
        // // tranMap();

        // //请求接口
        // function tranMap() {
            // $.ajax({
                // url: $this.url,
                // type: "POST",
                // data: {
                    // name: "SP_Auction_Translation",
                    // //params: $this.sellerid
                    // params: 1683073417
                // },
                // dataType: "json",
                // async: false,
                // success: function(data) {
                    // // console.log(data); //将数据处理成三大块
                    // if (data.length != 0) {
                        // for (var i = 0; i < data.length; i++) {
                            // for (var j = 0; j < $this.allData.length; j++) {
                                // if (data[i].level == $this.allData[j].type) {
                                    // $this.allData[j].arr.push(data[i]);
                                // }
                            // }
                        // }
                    // } else {
                        // $this.mapShow = false;
                    // }
                // },
                // error: function(xhr) {
                    // console.log(xhr);
                // }
            // });
        // }
    // }
//});