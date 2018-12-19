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
var _vm = new Vue({
    el: "#operate-top",
    data: {
        onOff: true,
        url: $api.SPTarget,
        id: '',
        tableTop: [],
        selectTime: "2017-07-14",
    },
    created() {
        //获取店铺id
        var $this = this;
        $.ajax({
            url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data == false) {
              //      window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                } else {
                 //   var $str = data.shopname;
					  var $str = "潮州砂锅帮";
                    //添加用户数据
                    function dat() {
                        $(".user-a").html('');
                        var datStr =
                            '<span>' + data.shopname + '</span>' +
                            '<div class="help-box">' +
                            '<div class="help-date" data-start="2013-04-24">' +
                            '<div><span>' + data.enddate + '</span> 到期 </div><a href="https://fuwu.taobao.com/ser/detail.html?service_code=ts-18350" target="_blank">续费升级</a></div>' +
                            '<div class="help-num">021-65400080</div>' +
                            '<div class="help-more">' +
                            '<a class="help-contact" target="_blank" href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%8A%E6%B5%B7%E6%99%8F%E9%BC%A0%3A%E8%8A%92%E6%9E%9C&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8">技术支持</a>' +
                            '<a class="help-explain" href="Help.aspx">使用说明</a>' +
                            '</div>' +
                            '</div>';
                        $(".user-a").html(datStr);
                    }
                    dat();

                    //获取店铺ID
                    /*$.ajax({
                        url: $api.querySeller + "潮州砂锅帮",
                        type: "GET",
                        dataType: "json",
                        success: function(data) {
                            $this.id = data[0].SellerId;
                            adddata($this.id);
                        },
                        error: function(xhr) {
                            console.log(xhr);
                        }
                    });*/
                }
            },
            error: function(xhr) {
                window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            },
        });

        // var $this = this;
        // adddata(195051840); 




        function adddata(id) {
            $this.id = id;
            $this.onOff = false; //若数据加载比较慢出现图片
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: "SP_OutPutTarget",
                    params: $this.id
                },
                dataType: "json",
                async: false,
                success: function(data) {
						var dataForTable=new Arrary();
						for(int i=0;i<data.table.size;i++){
							dataForTable[i].target=data[i].target;
							dataForTable[i].rank="";
							dataForTable[i].value="";
							dataForTable[i].isActive=false;
							dataForTable[i].title=data[i].title;
						}
        
                    var arrowLeft = []; //left  剔除箭头数组
                    var arrowRight = []; //right 箭头数组
                    var theData = [{
                        target: '访客数',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>访客数：</b>你的店铺页面或产品详情页被访问的人数，排除重复人数，一个人在一个自然天内访问多次记为一次。'
                    }, {
                        target: '新访客数',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>新访客数：</b>一个自然天内，访问您店铺中的新访客数。本次访问前6天内曾经来访过店铺，记做老访客，否则为新访客。'
                    }, {
                        target: '回头客数',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>回头客数：</b>浏览回头客人数'
                    }, {
                        target: '新访客占比',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>新访客占比：</b>统计时间内，新访客数占总访客数的百分比。'
                    }, {
                        target: '无线访客占比',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>无线访客占比：</b>一个自然天内，店铺的无线端访客数占比（即：自然天无线端访客数/（自然天PC端访客数+自然天无线端访客数））。'
                    }, {
                        target: '一次留存率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>一次留存率：</b>来访店铺浏览量大于1的访客数占总访客数的百分比。'
                    }, {
                        target: '页面到达率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>详情页到达率：</b>商品详情页的访客数与店铺总访客数的比值。'
                    }, {
                        target: '平均访问深度',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>平均访问深度：</b>访问深度为用户在一次访问内访问店铺内页面的次数，平均访问深度即所有用户每次访问时访问深度的平均值。跨天查看时，该指标是一个自然天内的平均值。'
                    }, {
                        target: '页面收藏率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>详情页收藏率：</b>所有商品页被收藏的次数占店铺总访客数的比值。另据我们统计发现店铺首页收藏次数占总收藏次数的比例很小（超半数的情况店铺首页收藏次数与总收藏次数占比都不到百分之十），所以不另做店铺首页收藏的统计。'
                    }, {
                        target: '页面加购率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>详情页加购率：</b>将商品添加至购物车的用户数占店铺总访客数的比值。'
                    }, {
                        target: '店铺拍下笔数',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>店铺拍下笔数：</b>店铺中宝贝被拍下的总次数（一次拍下多件宝贝，算拍下一笔）。'
                    }, {
                        target: '店铺拍下金额',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>店铺拍下金额：</b>店铺中宝贝被拍下的总金额。'
                    }, {
                        target: '店铺下单率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>店铺下单率：</b>一个自然天内，店铺拍下笔数与店铺访客数的比值。'
                    }, {
                        target: '下单客单件',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>下单客单件：</b>店铺商品被拍下的总件数与拍下笔数的比值。'
                    }, {
                        target: '下单客单价',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>下单客单价：</b>店铺商品被拍下的总金额与拍下笔数的比值。'
                    }, {
                        target: '店铺成交金额',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>店铺成交金额：</b>一个自然天内，进入店铺的用户，拍下且通过支付宝交易的成交金额总和（含运费）。<br/>店铺成交金额=直接成交金额+间接成交金额。'
                    }, {
                        target: '下单支付率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>下单支付率：</b>完成支付宝支付的总金额占拍下总金额的比值。'
                    }, {
                        target: '订单支付率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>订单支付率：</b>支付订单数占下单订单数的百分比，支付率=支付订单数/下单订单数。'
                    }, {
                        target: '支付客单件',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>支付客单件：</b>店铺商品支付总件数/店铺支付人数'
                    }, {
                        target: '支付客单价',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>支付客单价：</b>支付宝成交金额/店铺支付人数。单日“客单价”指单日每成交用户产生的成交金额。'
                    }, {
                        target: '已收款金额',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>已收款金额：</b>一个自然天内，显示已收货的商品总金额。'
                    }, {
                        target: '交易成功笔数',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>交易成功笔数：</b>一个自然天内，完成交易的总笔数。'
                    }, {
                        target: '已收货商品数',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>已收货商品数：</b>一个自然天内，显示已收货的商品数量。'
                    }, {
                        target: '退款成功金额',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>退款成功金额：</b>一个自然天内完成退款申请流程的退款总金额。'
                    }, {
                        target: '七天订单完结率',
                        rank: '',
                        value: '',
                        isActive: false,
                        title: '<b>七天订单完结率：</b>七天内交易成功的笔数占支付买家数的百分比。'
                    }]



                    //将数据进行格式转化 ，分别放入两个数组
                    for (var x in data[0]) {
                        if (x.indexOf('箭头') == -1 && x.indexOf('卖家ID') == -1 && x.indexOf('日期') == -1) {
                            var $arrow = {
                                target: x,
                                value: data[0][x],
                            };
                            arrowLeft.push($arrow);
                        } else if (x.indexOf('箭头') > -1) {
                            var $noarrow = {
                                target: x.substring(0, x.length - 2),
                                rank: data[0][x]
                            }
                            arrowRight.push($noarrow);
                        }
                    }
                    // console.log(arrowLeft);
                    // console.log(arrowRight);

                    //将数值放入匹配，放入对象
                    for (var i = 0; i < dataForTable.length; i++) {
                        for (var k = 0; k < arrowLeft.length; k++) {
                            if (dataForTable[i].target == arrowLeft[k].target) {
                                dataForTable[i].value = arrowLeft[k].value;
                            }
                        }
                    }
                    //将箭头指数放入对象中
                    for (var i = 0; i < dataForTable.length; i++) {
                        for (var k = 0; k < arrowRight.length; k++) {
                            if (dataForTable[i].target == arrowRight[k].target) {
                                dataForTable[i].rank = arrowRight[k].rank;
                            }
                        }
                    }
                    // console.log('-----------------------------');
                    // console.log(dataForTable);
                    // 如果数据中， 所有的value值为0； 则代表无数据， 显示数据正在加载中图片
                    var dataForTableLength = 0;
                    for (var k = 0; k < dataForTable.length; k++) {
                        if (dataForTable[k].value == 0) {
                            dataForTableLength++;
                        };
                    }
                    // console.log(dataForTableLength);
                    if (dataForTable.length == dataForTableLength) {
                        $this.onOff = false;
                        return;
                    }
                    $this.onOff = true;
                    //根据名称添加单位
                    var data = dataForTable;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].target.indexOf("金额") > -1 || data[i].target.indexOf("单价") > -1) {
                            data[i].value = "￥" + data[i].value.toFixed(2);
                        } else if (data[i].target.indexOf("率") > -1 || data[i].target.indexOf("占比") > -1) {
                            data[i].value = (data[i].value * 100).toFixed(2) + "%";
                        }
                    }
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
        };
    },
});


     



//产品转化地图模块  组件实例化
var transform = new Vue({
    el: "#transform_map",
    data: {
        sellerid: '',
        url: $api.SPTarget,
        allData: [{
            type: "PV",
            title: "路径层",
            arr: []
        }, {
            type: "下单子订单数",
            title: "下单层",
            arr: []
        }, {
            type: "支付子订单数",
            title: "支付层",
            arr: []
        }], //处理后的数据结构
        mapShow: true, //显示无数据图片
    },
    created() {
        var $this = this;
        $.ajax({
            url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data == false) {
          //          window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
                } else {
                    var $str = data.shopname;
                    //添加用户数据
                    function dat() {
                        $(".user-a").html('');
                        var datStr =
                            '<span>' + data.shopname + '</span>' +
                            '<div class="help-box">' +
                            '<div class="help-date" data-start="2013-04-24">' +
                            '<div><span>' + data.enddate + '</span> 到期 </div><a href="https://fuwu.taobao.com/ser/detail.html?service_code=ts-18350" target="_blank">续费升级</a></div>' +
                            '<div class="help-num">021-65400080</div>' +
                            '<div class="help-more">' +
                            '<a class="help-contact" target="_blank" href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%8A%E6%B5%B7%E6%99%8F%E9%BC%A0%3A%E8%8A%92%E6%9E%9C&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8">技术支持</a>' +
                            '<a class="help-explain" href="Help.aspx">使用说明</a>' +
                            '</div>' +
                            '</div>';
                        $(".user-a").html(datStr);
                    }
                    dat();

                    //获取店铺ID
                    // $.ajax({
                    //     url: $api.querySeller + data.shopname,
                    //     type: "GET",
                    //     dataType: "json",
                    //     success: function(data) {
                    //         // console.log(data);
                    //         // bus1.$emit("sentID",data[0].SellerId);

                    //         $this.sellerid = data[0].SellerId;
                    //         tranMap();
                    //     },
                    //     error: function(xhr) {
                    //         console.log(xhr);
                    //     }
                    // });
                }
            },
            error: function(xhr) {
          //      window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            },
        });


        // var $this = this;
        // $this.sellerid = 195051840; //原来的
        // // $this.sellerid = 1062340001; //无数据
        // tranMap();

        //请求接口
        function tranMap() {
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: "SP_Auction_Translation",
                    params: $this.sellerid
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    // console.log(data); //将数据处理成三大块
                    if (data.length != 0) {
                        for (var i = 0; i < data.length; i++) {
                            for (var j = 0; j < $this.allData.length; j++) {
                                if (data[i].level == $this.allData[j].type) {
                                    $this.allData[j].arr.push(data[i]);
                                }
                            }
                        }
                    } else {
                        $this.mapShow = false;
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        }
    }
});