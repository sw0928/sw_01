var sellerid = sessionStorage.getItem('sellerId');
//组件通信  测试组件--运营看板--核心预警
var bus1 = new Vue();
//组件通信  核心预警--调整计划表
var bus = new Vue();
 //头部
var hotPlan = new Vue({
    el: "#hotPlan",
    data: {
        topCurrent: 1
    }
})
//左侧菜单组件实例化
var leftMenu = new Vue({
    el: "#leftMenu_Box",
    data:{
        current:1
    }
});

/*首个产品描述组件实例化*/
var hotProduct = new Vue({
    el: "#hot_product",
	data: {
                sellerid: sellerid
            },
});


/*螺旋曲线增长通道组件实例化*/
var curveGrow = new Vue({
    el: "#curve_grow_line",
});


/*30天单品重点爆点提醒组件实例化*/
var importantPoint = new Vue({
    el: "#important_point"
});

var adjust = new Vue({
    el: "#adjust"
});
//核心预警组件 调整计划表格组件 实例化
var vm = new Vue({
    el: "#main-warning",
});
 // // var vm = new Vue({
    // // el: "#main-warning",
    // // data: {
        // // noData: false,
        // // tableis: true,
        // // loadis: false,
        // // url: $api.SPTarget,
         // // sellerid: '',
        // // auctionid: '',
        // // id: '',
        // // tableData: [],
        // // orignData: [],
        // // dataArr: [],
        // // pageIndex: '',
        // // ttype: ''
    // // },
    // // created() {
        // // var $this = this;
        // // $this.pageIndex = 1;
        // // $this.ttype = 1;

        // // bus.$on("getAid", function(updata) { //注意this指向问题
            // // $this.sellerid = updata.sellerid;
            // // $this.auctionid = updata.auctionid;
            // // addData();
        // // });

        // // function addData() {
             // // $.ajax({
                // // url: $this.url,
                // // type: "POST",
                // // data: {
                    // // name: 'SP_Auction_Mine',
                    // // params: $this.sellerid + ',' + $this.auctionid
                // // },
                // // dataType: "json",
                // // async: false,
                // // success: function(data) {
					// // console.log(data);
                    // // if (data.data.length == 0 ||data.data == null) {
                        // // setTimeout(function() {
                            // // $(".bomb_wrap").html('<img class="noData_img" src="../img/vNodata.png">');
                            // // return;
                        // // }, 10);
                    // // }else{
						// // $this.tableData = data.data
						// // console.log($this.tableData)
					// // }

                    // 构造函数创建数组模型
                    // function dataArr() {
                        // this.target = '';
                        // this.plid = '';
                        // this.trend = '';
                        // this.shopValue = {
                            // today: '',
                            // yesterday: ''
                        // };
                        // this.weight = '';
                        // this.bcolor = '';
                    // }

                    // //声明数组，接收数据
                    // var n = [0, 1, 11, 111, 1111];
                    // var t1 = [];
                    // var t2 = [];
                    // var color = [];
                    // var count = [];
                    // var plid = [];
                    // var returndata = []; //间接存储数组
                    // //循环数据
                    // for (var i = 0; i < data.data.length; i++) {
                        // for (var p in data[i]) {
                            // if (p != '卖家ID' && p != '商品ID') {
                                // //第一步，将数据拆开，进行分类,分为五个数组
                                // if (p.indexOf('_T1') > -1) {
                                    // t1.push({
                                        // target: p.substr(0, p.indexOf('_')),
                                        // t1: data[i][p]
                                    // });
                                // }
                                // if (p.indexOf('_T2') > -1) {
                                    // t2.push({
                                        // target: p.substr(0, p.indexOf('_')),
                                        // t2: data[i][p]
                                    // });
                                // }
                                // if (p.indexOf('_colour') > -1) {
                                    // color.push({
                                        // target: p.substr(0, p.indexOf('_')),
                                        // color: data[i][p]
                                    // });
                                // }
                                // if (p.indexOf('_count') > -1) {
                                    // count.push({
                                        // target: p.substr(0, p.indexOf('_')),
                                        // count: data[i][p]
                                    // });
                                // }
                                // if (p.indexOf('_plid') > -1) {
                                    // plid.push({
                                        // target: p.substr(0, p.indexOf('_')),
                                        // plid: data[i][p]
                                    // });
                                // }
                            // }
                        // }
                    // }
                    // // console.log(t1);
                    // // console.log(t2);
                    // // console.log(color);
                    // // console.log(count);
                    // // console.log(plid);
                    // //第二步，分别循环五个数组，

                    // //将今日值和target塞进数组
                    // for (var i = 0; i < t1.length; i++) {
                        // var a = new dataArr();
                        // a.target = t1[i].target;
                        // a.shopValue.today = t1[i].t1;
                        // returndata.push(a);
                    // };

                    // //将昨日值塞进数组
                    // for (var j = 0; j < t2.length; j++) {
                        // for (var k = 0; k < returndata.length; k++) {
                            // if (returndata[k].target == t2[j].target) {
                                // returndata[k].shopValue.yesterday = t2[j].t2
                            // }
                        // }
                    // };

                    // //将颜色值塞进数组
                    // for (var l = 0; l < color.length; l++) {
                        // for (var k = 0; k < returndata.length; k++) {
                            // if (returndata[k].target == color[l].target) {
                                // returndata[k].bcolor = color[l].color
                            // }
                        // }
                    // }

                    // //将雷的个数塞进数组
                    // for (var l = 0; l < count.length; l++) {
                        // for (var k = 0; k < returndata.length; k++) {
                            // if (returndata[k].target == count[l].target) {
                                // returndata[k].trend = count[l].count
                            // }
                        // }
                    // }

                    // //将plid塞进数组
                    // for (var l = 0; l < plid.length; l++) {
                        // for (var k = 0; k < returndata.length; k++) {
                            // if (returndata[k].target == plid[l].target) {
                                // returndata[k].plid = plid[l].plid;
                                // returndata[k].weight = n[returndata[k].bcolor] * returndata[k].trend;
                            // }
                        // }
                    // }

                    // //冒泡排序，按照降序排列
                    // for (var i = 0; i < returndata.length - 1; i++) {
                        // for (var j = 0; j < returndata.length - 1; j++) {
                            // if (returndata[j].weight < returndata[j + 1].weight) {
                                // var temp = returndata[j];
                                // returndata[j] = returndata[j + 1];
                                // returndata[j + 1] = temp;
                            // }
                        // }
                    // }
                    // // console.log(returndata);
                    // // $this.dataArr = returndata; //将值赋给data里面的值

                    // var data = returndata;

                    // //请求当天日志 雷里面的 作比较，往日志表格里面插入
                    // $.ajax({
                        // url: "http://localhost:30005/searchmouse-admin/spmag/callSp",
                        // type: "POST",
                        // data: {
							// name: "sp_show_shop_thunder",
                            // params: sellerid
                           // // name: 'SP_GetAuctionPlan_Log',
                           // // params: $this.sellerid + ',' + $this.auctionid + ',' + $this.pageIndex + ',' + $this.ttype
                        // },
                        // dataType: "json",
                        // async: false,
                        // success: function(result) {
                             
							 // var result = result.data
							 // console.log(result);
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

                            // // console.log(data);
                            // for (var i = 0; i < data.length; i++) {
                                // if (data[i].bcolor == 4) {
                                    // data[i].level = 4
                                // } else if (data[i].bcolor == 3) {
                                    // data[i].level = 3
                                // } else if (data[i].bcolor == 2) {
                                    // data[i].level = 2
                                // } else {
                                    // data[i].level = 1
                                // }
                            // };
                           // // $this.tableData = data;
							
                           // // $this.orignData = orignData.splice(0, 10);
                             // console.log($this.tableData, $this.orignData);

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
                // // },
                // // error: function(xhr) {
                    // // console.log(xhr);
                    // 若数据加载失败，显示正在加载数据图片
                    // // $this.tableis = false;
                    // // $this.loadis = true;
                    // // $this.noData = false;
                    // // return;
                // // },
            // // }); 
        // // };

        // // bus1.$on("reflashTable", (onOff) => {
            // // var $this = this;
            // // addData();
        // // });
    // // }
// // });
 

 //调整日志 实例化
/* var vm2 = new Vue({
    el: "#adjust-info",
    data: {
        // onOff: true,
        url: $api.SPTarget,
        pageno: 1, //当前页码
        pagesize: 10, //分页大小
        tableData: [], //表格数据
        count: 0, //总数据量
        allpage: 0, //总页数
        sellerid: '', //店铺ID
        auctionid: '',
        pageIndex: '',
        ttype: ''
    },
    created() {
        var $this = this;
        $this.pageIndex = 1;
        $this.ttype = 0; //全部日志 

        bus.$on("getAid", function(updata) { //注意this指向问题
            $this.sellerid = updata.sellerid;
            $this.auctionid = updata.auctionid;
            addData();
        });

        function addData() {
            //请求全部日志
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_GetAuctionPlan_Log',
                    params: $this.sellerid + ',' + $this.auctionid + ',' + $this.pageIndex + ',' + $this.ttype
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    // if (data.length == 0) {
                    //     setTimeout(function() {
                    //         $(".daily_wrap").html('<img class="noData_img" src="../img/vNodata.png">');
                    //         $(".page_wrap").html('');
                    //         return;
                    //     }, 10);
                    // }
                    // console.log(data);
                    if (data.length != 0) {
                        $this.count = data[0].Introwcount;
                    } else {
                        $this.count = 1;
                    }
                    $this.tableData = data;
                    $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });
        };
        //表格刷新
        bus1.$on("reflash", (onOff) => {
            if (onOff) {
                var $this = this;
                // $this.onOff = true;
                addData();
            }
        });
    },
    methods: {
        //接收分页组件页码
        changepn: function(pn) {
            var $this = this;
            this.pageIndex = pn;
            var $this = this;
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_GetAuctionPlan_Log',
                    params: $this.sellerid + ',' + $this.auctionid + ',' + $this.pageIndex + ',' + $this.ttype
                },
                dataType: "json",
                async: false,

                success: function(data) {
                    $this.tableData = data;
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },
    }
}); */


