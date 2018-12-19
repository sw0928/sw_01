//商品订购组件
Vue.component("v-add-order", {
    template: `    
        <div class='select_shop_box' style='position:relative'>
            <div class='select_shop_title'>
                <span>增加订阅</span>
                <span style="color:red; fr">只有订阅单品后才能查看爆款计划</span>
                <div style="float:right" class='search_box'>
                    <input type='text' placeholder='请输入您想要查询的商品' v-model='auctionName' style='width:270px;border:1xp solid #999;line-height:2em;'>
                    <button class='search_button' @click='search()'>搜索</button>
                </div>
            </div>
            <div class='selected_box'>
                <ul>
                    <li v-for='li in tabledata'>                   
                        <span class='select_box' @click='selectItem(li.auction_id,li.seller_id,li,li.auction_name,li.auction_picture)' :class='{selected:li.selected==true}'></span>
                        <span class='img_box' :data-id="li.auction_id"><img :src='li.auction_picture' style='max-width:40px;max-height:40px'></span>
                        <span class='order_title' :data-id="li.auction_id" :title='li.auction_name'>{{li.auction_name}}</span>                  
                    </li>
                </ul>
            </div>
            <!--商品订购分页-->
            <v-page-addorder :count='count' :allpage='allpage' :pageno='PageIndex' @pn="changepn" :searchpageno="searchpageno"></v-page-addorder>
            <div class='select_figure_box clearfix'>
                <div class='right'>
                    <span>已选宝贝：<i>{{arrlength()+"件"}}</i></span>
                    <span>合计：<i class='money'>{{allmuch()}}</i></span>
                    <button @click='submitOrder()' class='sure_add_btn'>确定订购</button>
                </div>
            </div>
            <transition name="bounce">
                <v-tip :tip="tip" v-show='istip'></v-tip>
            </transition>
            <div class="pay_tips pay_before" v-show="payBeShow">
                <div class="pay_tips_top">
                    <img src="../img/smile_03.png" alt="" />
                    <p>对不起！您的单品数不足！</p>
                    <p>您还需要订购<span>{{needCount}}</span>个单品才能完成本次操作！</p>
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
            <div class="most_fixed_box"></div>
        </div>
    `,
    data: function() {
        return {
            url: $api.SPTarget, //请求地址
            orderlist: [], //商品列表
            selectorder: [], //已选择商品列表
            id: '', //请求参数
            PageSize: 10, //分页大小
            sellerid: '',
            PageIndex: 1,
            tabledata: [],
            allpage: 0,
            count: 0,
            auctionName: null, //搜索框输入内容
            tip: "",
            istip: false,
            clickAable: true, //弹出框出现禁止提交
            searchpageno: 1,
            payBeShow: false, //支付前询问是否订购弹出框
            payAfShow: false, //支付后询问是否付款完成弹出框
            needCount: 0, //还需订购的数量
            singleAid: '', //单独一条的商品id
        }
    },

    watch: {
        PageIndex: function() {
            this.seller();
        }
    },

    created() {
        var test = window.location.search;
        if (test != "") {
            var singleBefor = test.substring(1, test.indexOf('&')); //authionId
            this.singleAid = Number(singleBefor.substr(singleBefor.indexOf('=') + 1));
        }
        var $this = this;
        $.ajax({
            url: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data == false) {
                    window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
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
                    $.ajax({
                        url: $api.querySeller + data.shopname,
                        type: "GET",
                        dataType: "json",
                        success: function(data) {
                            $this.sellerid = data[0].SellerId;
                            $this.seller();
                        },
                        error: function(xhr) {
                            console.log(xhr);
                        }
                    });
                }
            },
            error: function(xhr) {
                window.location.href = "http://mouse.molesoft.cn/SearchExperts/Hint.aspx";
            },
        });


        // // 传入参数赋值
        // var $this = this;
        // setTimeout(function() {
        //     $this.sellerid = 195051840;
        //     $this.seller();
        // }, 10)



        bus.$on("tip", (tipReturn) => {
            $this.istip = tipReturn.istip;
            $this.clickAable = tipReturn.clickAable;
        });


        //判断地址是否有商品ID


        // 跳转直接请求的那一个
        function search() {
            var auth = test.substring(1, test.indexOf('&')); //authionId
            var sell = test.substr(test.indexOf('&') + 1); //sellerId
            var authion_id = Number(auth.substr(auth.indexOf('=') + 1));
            var seller_id = Number(sell.substr(auth.indexOf('=')));

            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Subscription_V2_Page',
                    params: seller_id + ',' + authion_id
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    $this.selectorder.push({
                        auctionid: authion_id,
                        sellerid: seller_id,
                        auctionname: data[0].auction_name,
                        auctionpicture: data[0].auction_picture,
                    });
                    // $this.PageIndex = data[0].pageid;
                    // $this.changepn(data[0].pageid);
                    // $this.searchpageno = data[0].pageid;

                    $this.PageIndex = 1;
                    $this.changepn(1);
                    $this.searchpageno = 1;

                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        }
    },
    methods: {

        //搜索关键词
        search: function() {
            if (this.auctionName == "") {
                this.auctionName = null;
            }
            this.PageIndex = 1;
            var $this = this;
            this.seller($this);
        },

        //接收分页组件页码
        changepn: function(pn) {
            var $this = this;
            this.PageIndex = pn;
            // var $this = this;
            // seller($this);
        },

        //选中商品事件
        selectItem: function(aid, sid, l, name, img) {
            //变更商品选中状态
            l.selected = !l.selected;
            //如果选中商品
            if (l.selected) {
                this.selectorder.push({
                    auctionid: aid,
                    sellerid: sid,
                    auctionname: name,
                    auctionpicture: img,
                });
                // console.log(this.selectorder);
            } else {
                //取消选中商品
                for (var i = 0; i < this.selectorder.length; i++) {
                    if (this.selectorder[i].auctionid == aid) {
                        this.selectorder.splice(i, 1);
                    }
                }
            }

        },

        //合计多少件
        arrlength: function() {
            return this.selectorder.length;
        },

        //总价格
        allmuch: function() {
            return this.selectorder.length * 30;
        },

        //选中项提交表单
        submitOrder: function() {
            var $this = this;
            if (this.selectorder.length == 0) {
                this.tip = "请至少选择一种商品才可以查看爆款计划";
                this.clickAable = false;
                this.istip = true;
                return
            };
            if (!this.clickAable) {
                return
            };
            var postdata = this.selectorder;
            // console.log(postdata.length); //已经选择的商品数组
            //点击订阅 跳转至服务市场付款页面
            //接口返回的已经订购的数量
            function salesCount() {
                $.ajax({
                    url: $api.serverMarket + "?sellerid=" + $this.sellerid,
                    // url: "http://192.168.2.126:8080/yanShulcsyData/nums?sellerid=" + $this.sellerid,
                    type: "GET",
                    dataType: "json",
                    async: false,
                    success: function(data) {
                        console.log(data);
                        if (data) {
                            if (postdata.length > data.result) { //选择的商品 大于 订购过的商品数量
                                $this.payBeShow = true; //是否订购服务弹出框出现
                                $(".most_fixed_box").show(); //遮罩层出现
                                $this.needCount = postdata.length - data.result; //还差订购商品数赋值

                            } else if (postdata.length <= data.result) { //选择的商品 大于 订购过的商品数量
                                //跳转到主页面，进行查看
                                $.ajax({
                                    url: $api.toMainPage,
                                    type: "POST",
                                    data: JSON.stringify(postdata),
                                    dataType: "text",
                                    contentType: 'application/json',
                                    async: false,
                                    success: function(data) {
                                        //刷新表格
                                        // $("body").append("<div class='ovfHiden'><div>添加成功，即将返回之前页面</div></div>");
                                        history.go(-1);
                                    },
                                    error: function(xhr) {
                                        console.log(xhr)
                                    }
                                });
                            }
                        }
                    },
                    error: function(xhr) {
                        console.log(xhr)
                    }
                });
            };
            salesCount();
        },

        // 1 号弹窗  点击确定订购，根据 商品数 跳转不同 服务市场页面
        sure_pay: function() {
            this.payBeShow = false; //是否订购服务弹出框消失
            if (this.needCount == 1) { //订购一个月
                window.open("https://tb.cn/E6ghYbw", "_blank");

            } else if (this.needCount > 1 && this.needCount <= 3) { //订购一个季度
                window.open("https://tb.cn/vUq8Ybw", "_blank");

            } else if (this.needCount > 3 && this.needCount <= 6) { //订购半年
                window.open("https://tb.cn/Rke8Ybw", "_blank");

            } else if (this.needCount > 6) { //订购一年
                window.open("https://tb.cn/IPd8Ybw", "_blank");

            }
            this.payAfShow = true; //付款遇到问题弹出框出现
        },

        // 1 号弹窗  点击取消，弹出层消失，不跳转
        del_pay: function() {
            this.payBeShow = false; //是否订购服务 弹出框 消失
            $(".most_fixed_box").hide(); //遮罩层消失
        },

        // 2 号弹窗   弹出框---完成付款（绿色） //刷新页面
        finsh_pay: function() {
            this.payAfShow = false; // 付款遇到问题 弹出框 消失
            $(".most_fixed_box").hide(); //遮罩层消失
        },

        // 2 号弹窗   弹出框---付款遇到问题（红色）
        ques_pay: function() {
            this.payAfShow = false; // 付款遇到问题 弹出框消失
            $(".most_fixed_box").hide(); // 遮罩层 消失
        },

        seller() {
            var $this = this;
            var str = $this.sellerid + ',' + $this.PageIndex + ',' + $this.PageSize + "," + $this.auctionName + "," + ' ';
            if ($this.singleAid != "") {
                str = $this.sellerid + ',' + "1" + ',' + $this.PageSize + "," + "" + "," + $this.singleAid;
            };
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Subscription_V2',
                    params: str
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    if ($this.singleAid != "") {
                        $this.selectorder.push({
                            auctionid: data[0].auction_id,
                            sellerid: data[0].seller_id,
                            auctionname: data[0].auction_name,
                            auctionpicture: data[0].auction_picture,
                        });
                    };
                    if (data == '') {
                        $this.tabledata = data;
                        $this.count = 0;
                        $this.allpage = 0;
                        return
                    };
                    data.forEach((obj) => {
                        obj.selected = false;
                    });
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < $this.selectorder.length; j++) {
                            if ($this.selectorder[j].auctionid == data[i].auction_id) {
                                data[i].selected = true;
                            }
                        }
                    }

                    $this.count = data[0].Introwcount;
                    $this.allpage = Math.ceil($this.count / $this.PageSize) < 1 ? 1 : Math.ceil($this.count / $this.PageSize);
                    $this.tabledata = data;


                },
                error: function(xhr) {
                    console.log(xhr);

                }
            })
        }

    },

    mounted() {
        //鼠标移入显示大图
        var $this = this;
        $("img").hover(function() {
            if ($(".big-img").length <= 0) {
                $("body").append("<div class='big-img'><img alt='' src='' /></div>");
            }
            $(".big-img").show();
            if ((document.documentElement.clientHeight - ($(this).offset().top - $(document).scrollTop())) > $(".big-img").height()) {
                $(".big-img").css("top", $(this).offset().top - $(document).scrollTop() - 0);
            } else {
                $(".big-img").css("top", $(this).offset().top - $(document).scrollTop() - $(".big-img").height() + $(this).height() - 4);
            }
            if ((document.documentElement.clientWidth - ($(this).offset().left - $(document).scrollLeft())) > $(".big-img").width()) {
                $(".big-img").css("left", $(this).offset().left - $(document).scrollLeft() + $(this).width() + 5);
            } else {
                $(".big-img").css("left", $(this).offset().left - $(document).scrollLeft() - $(".big-img").width() - 9);
            }
            $(".big-img img").attr("src", $(this).attr("src"));
        }, function() {
            $(".big-img").hide();
        });
        //添加按键事件
        $("body").keydown(function(event) {
            if (event.keyCode == 13) {
                $this.PageIndex = 1;
                seller($this);
            }

        })

    },


});

//提示框
Vue.component("v-tip", {
    template: `
    <div style='position:absolute;width:50%;height:40%;border:1px solid #999999;top:50%;left:50%;transform: translate(-50%,-50%);background:white' class='tip_box'>
        <p :title='tip'>{{tip}}</p>
        <div style='text-align:center'>
            <button @click='goOn()'>继续订阅</button> 
        </div>
        <div class='tip_close' style='position:absolute;right:0;top:0;background:url("../img/删除筛选项 (1).png") no-repeat;width:24px;height:24px;background-size:cover;' @click='goOn()'></div>       
    </div>
    `,
    props: ["tip"],
    methods: {
        goOn: function() {
            var tipReturn = {
                istip: false,
                clickAable: true,
            };
            bus.$emit("tip", tipReturn);
        }
    }
});

//分页组件
Vue.component("v-page-addorder", {
    template: `
                <div class='b1'> 
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
    data: function() {
        return {
            current: 1,
            showItem: 5
        }
    },
    created() {
        this.current = this.searchpageno;
        // console.log(this.allpage, this.current)
    },
    props: ["count", "allpage", "pageno", "searchpageno"],
    computed: {
        pages: function() {
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
        goto: function(index) {
            //  console.log(index);
            // if (index == this.current) return;
            this.current = index;
            this.pageno = index;
            this.$emit('pn', this.pageno)
        },
        gotoNext: function(index) {
            if (index == this.allpage) {
                return
            } else {
                ++index;
                this.current = index;
                this.pageno = index;
                this.$emit('pn', this.pageno);
            }
        },
        gotoPre: function(index) {
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