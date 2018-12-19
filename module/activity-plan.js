//活动策划组件
Vue.component("v-activity-plan", {
    template: `
        <div>
            <div class="b1" id="activity_first">
                <h2 class="hot_module_title" style="margin-top:0px;">活动策划</h2>
                <div class="time_type clearfix">
                    <div class="fl" style="position:relative; width:440px;height:32px;">
                        <label class="fl" style="margin-right:10px;">活动时间：</label>
                        <div id="activityTimeSel" onClick="laydate()">{{toDate(actTime[0].day)}}</div>
                        <span class="fl">至</span>
                        <div id="activityTimeEnd" onClick="laydate()">{{toDate(actTime[1].day)}}</div>
                        <span style="color:red; font-size:16px; font-weight:bold; position:absolute;right:-22px;">*</span>
                    </div>
                    <div class="fr">
                        <label>活动类型：</label>
                        <select id="activityTypeSel">
                            <option>单品类型</option>
                            <option>品类类型</option>
                            <option>店铺类型</option>
                            <option>平台类型</option>
                        </select>
                    </div>
                </div>
                <div class="clearfix theme">
                    <label>活动主题：</label>
                    <input id="activityThemeInput" type="text" @blur="proBlur(actTheme,3)" @focus="proFocus(actTheme,3)" :class="{theme_border:theRedBorder}" v-model="actTheme" value="" placeholder="请输入活动主题"/>
                    <p class="formValidate" v-show="themeShow">*活动主题为必填项</p>
                </div>
                <div class="clearfix">
                    <label class="fl">推广入口：</label>
                    <ul class="fr input_list">
                        <li>
                            <div class="input_left fl">
                                <div class="checkBox fl" @click="selected(0)" :class="{'select':selectBox[0].isselected}"></div>
                                <label>活动专题流量</label>
                                <span>流量预期（UV）</span>
                                <input type="number" class="activitySpecialUV"  v-model='selectBox[0].v'>
                            </div>
                            <div class="input_right fr">
                                <div class="checkBox fl" @click="selected(1)" :class="{'select':selectBox[1].isselected}"></div>
                                <label>自然免费流量</label>
                                <span>流量预期（UV）</span>
                                <input type="number" class="natureFreeUV" value="" v-model='selectBox[1].v'>
                            </div>
                        </li>
                        <li>
                            <div class="input_left fl">
                                <div class="checkBox fl" @click="selected(2)" :class="{'select':selectBox[2].isselected}"></div>
                                <label>付费推广流量</label>
                                <span>流量预期（UV）</span>
                                <input type="number" class="payPopuUV" value="" v-model='selectBox[2].v'>
                            </div>
                            <div class="input_right fr">
                                <div class="checkBox fl" @click="selected(3)" :class="{'select':selectBox[3].isselected}"></div>
                                <label>老客唤醒流量</label>
                                <span>流量预期（UV）</span>
                                <input type="number" class="oldUV" value="" v-model='selectBox[3].v'>
                            </div>
                        </li>
                        <li>
                            <div class="input_left fl">
                                <div class="checkBox fl" @click="selected(4)" :class="{'select':selectBox[4].isselected}"></div>
                                <label>其他渠道流量</label>
                                <span>流量预期（UV）</span>
                                <input type="number" class="otherMethodUV" value="" v-model='selectBox[4].v'>
                            </div>
                            <div class="input_right fr">
                                <span style="margin-left:50px;"></span>
                                <label>整体活动流量预期（UV）</label>
                                <input type="number" class="overallUV" :value='tonum'>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="clearfix ecpext_input">
                    <label class="fl">预期营收：
                        <input type="number" value="0" class="earnInput" @focus="earnFocus(earn,1)" @blur="earnBlur(earn,1)" v-model="earn">&nbsp;元&nbsp;&nbsp;<b style="color:red;">*</b>
                        <p class="formValidate" v-show="yuqiShow">*预期营收为必填项</p>
                        <p class="formValiFocus" v-show="yuqiType">*该项只能以数字形式输入</p>
                    </label>
                    <label class="fr">预期转化率：
                        <input type="number" value="0" :class="{import_prompt:isRed}" class="expectInput" @focus="exceptFocus(except)" @blur="exceptBlur(except)" v-model="except">&nbsp;%&nbsp;<b style="color:red;">*</b>
                        <p :class="{ formValidate:expectColor , formValiFocus: !expectColor}">{{tipArr.tips}}</p>
                    </label>
                </div>
            </div>
            <div class="b1" id="most_pro_activity">
                <div class="most_pro_content">
                    <h3 class="most_pro_title">店铺主要促销活动</h3>
                    <div class="most_product">
                        <div style="position:relative;">
                            <label class="fl">主推产品：</label>
                            <button class="mostProSel fl" @click="mostProduct()">选择主推产品</button>
                            <span style="color:red; font-size:16px; font-weight:bold; position:absolute;right:-22px;top:5px;">*</span>
                            <div>
                                <v-most-product :sellerid="sellerid" :selte_p="selected_p.left"></v-most-product>
                            </div>
                        </div>
                        <div>
                            <label class="fl">辅推产品：</label>
                            <button class="otherProSel fl" @click="selectProSec()">选择辅推产品</button>
                            <div>
                                <v-most-product :sellerid="sellerid" :selte_p="selected_p.right"></v-most-product>
                            </div>
                        </div>
                    </div>
                    <div class="most_pro_cont clearfix">
                        <div class="fl">
                            <span class="fl">已选主推品：</span>
                            <div class="sel_pro_wrap clearfix">
                                <div class="sel_img" v-for="l in selected_p.left.s">
                                    <img :src="l.auctionPicture" :title="l.auctionName"/>
                                </div>
                            </div>
                        </div>
                        <div class="fr">
                            <span class="fl">已选辅推品：</span>
                            <div class="sel_pro_wrap clearfix">
                                <div class="sel_img" v-for="l in selected_p.right.s">
                                    <img :src="l.auctionPicture" :title="l.auctionName"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="methods_list">
                        <ul>
                            <li>
                                <p>促销方案：<b style="font-size:16px;color:red; line-height:16px;">*</b></p>
                                <textarea class="proProject" @blur="proBlur(proProject,1)" @focus="proFocus(proProject,1)" :class="{import_textArea:isProRed}" v-model="proProject" maxlength="200" placeholder="请输入内容，不超过200字"></textarea>
                                <p class="formValidate" v-show="isPro">*促销方案为必填项</p>
                            </li>
                            <li>
                                <p>促销方式：<b style="font-size:16px;color:red; line-height:16px;">*</b></p>
                                <textarea class="proMethods" @blur="proBlur(proMethods,2)" @focus="proFocus(proMethods,2)" :class="{import_textArea:isMethRed}" v-model="proMethods"  maxlength="200" placeholder="请输入内容，不超过200字"></textarea>
                                <p class="formValidate" v-show="isMeth">*促销方式为必填项</p>
                            </li>
                            <li>
                                <p>辅助促销：</p>
                                <textarea class="otherPromotion" v-model="proAssist" maxlength="200" placeholder="请输入内容，不超过200字"></textarea>
                            </li>
                        </ul>
                    </div>
                    <div class="most_gifts">
                        <label>追加礼品：<input type="text" value="" v-model="giftName" class="add_gift"/></label>
                        <label>礼品数量：
                            <input type="number" value="" class="gift_count" @focus="earnFocus(gift,2)" @blur="earnBlur(gift,2)" v-model="gift"/>
                            <p class="formValiFocus" v-show="isGift">该项只能以数字形式输入</p>
                        </label>
                    </div>
                </div>
                <div class="submit_btn_wrap">
                    <button class="grey_btn" @click="quxiao()">取消</button>
                    <button class="repeat_btn" @click="submit()">提交</button>
                </div>
            </div>
            <v-recent-active :sellerid="sellerid"></v-recent-active>
        </div>
    `,
    data: function() {
        return {
            url: $api.SPTarget, //请求地址
            timeShow: false, //提示时间不能为空汉字
            selectBox: [{
                v: 0,
                isselected: true
            }, {
                v: 0,
                isselected: true
            }, {
                v: 0,
                isselected: true
            }, {
                v: 0,
                isselected: true
            }, {
                v: 0,
                isselected: true
            }], //推广入口是否选中
            firstData: [], //从按钮带过来的时间，类型和主题
            actTime: [], //活动时间存储数组
            sellerid: '', //店铺id
            themeShow: false, //活动主题未填写提示
            theRedBorder: false, //活动主题是否显示红色边框
            actTheme: '', //活动主题双向绑定
            mainProduct: [], //已选主推产品数组
            assistProduct: [], //已选辅推产品数组
            earn: '0', //预期营收双向绑定
            except: '0', //预期转化率双向绑定
            yuqiShow: false, //预期营收必填提示
            yuqiType: false, //预期营收只能输入数字提示
            tipArr: {
                tips: ""
            }, //预期转化率输入提示
            expectColor: false, //预期转化率显示黄色
            isRed: false, //预期转化率边框是否变红
            proProject: '', //促销方案双向绑定
            isProRed: false, //促销方案边框是否变红
            isPro: false, //促销方案必填提示
            proMethods: '', //促销方式双向绑定
            proAssist: '', //辅助促销双向绑定
            isMethRed: false, //促销方式边框是否变红
            isMeth: false, //促销方式必填提示
            giftName: '', //追加礼品双向绑定
            gift: '', //礼品数量双向绑定
            isGift: false, //礼品数量输入提示
            src: '',
            selected_p: {
                left: {
                    cn: "cn1",
                    btn: 1,
                    s: [],
                    fun: function() {

                    }
                },
                right: {
                    cn: "cn2",
                    btn: 2,
                    s: [],
                    fun: function() {

                    }
                }
            }
        }
    },
    created() {
        var $this = this;

        //获取跳转过来的id ，并且将id 赋值给  sellerid
        //不同来源 
        var url = location.search;
        var b = url.substring(url.indexOf("=") + 1, url.indexOf("&"));
        this.src = url.substr(url.indexOf("&") + 1);

        //sellerid赋值
        $this.sellerid = Number(b);

        //source=1,从日历按钮跳转过来
        if (this.src == "source=1") {

            //读取cookie
            var str = getCookie("planCookie");

            //将带过来的数据赋值给  firstData 时间
            this.firstData = JSON.parse(str);

            //向前推 3 天时间,并且将时间存入数组
            var a = this.firstData.stratdate - (72 * 60 * 60 * 1000);
            var c = this.firstData.stratdate - (24 * 60 * 60 * 1000);
            this.actTime.push({
                day: a,
            }, {
                day: c
            });

            //删除cookie
            // delCookie("planCookie");
        } else if (this.src == "source=2") {

            //从促销单品按钮跳转
            //读取cookie,解析cookie
            var str = getCookie("singleCookie");
            this.firstData = JSON.parse(str);

            //填充当前日期
            var a = new Date();
            this.actTime.push({
                day: a.getTime(),
            }, {
                day: a.getTime()
            });

            //填充主题
            this.actTheme = this.firstData.auctionName;

            //选中主推产品
            this.selected_p.left.s.push(this.firstData);
        } else if (this.src == "source=3") {

            //从近期活动跳转
            //读取cookie,解析cookie
            var str = getCookie("tableCookie");
            this.firstData = JSON.parse(str);
            console.log(this.firstData);

            //填充日期
            this.actTime.push({
                day: this.firstData.begin_date,
            }, {
                day: this.firstData.end_date,
            });

            //填充活动主题
            this.actTheme = this.firstData.activity_subject;

            //推广入口
            this.selectBox[0].v = this.firstData.events_uv;
            this.selectBox[1].v = this.firstData.gratis_uv;
            this.selectBox[2].v = this.firstData.pay_uv;
            this.selectBox[3].v = this.firstData.regular_uv;
            this.selectBox[4].v = this.firstData.other_uv;

            //预期营收
            this.earn = this.firstData.expectation_amt;

            //预期转化率
            this.except = this.firstData.expectation_CVR;

            //促销方案
            this.proProject = this.firstData.activity_plan;

            //促销方式
            this.proMethods = this.firstData.activity_manner;

            //辅助促销
            this.proAssist = this.firstData.activity_auxiliary;

            //追加礼品
            this.giftName = this.firstData.gift_AddTo;

            //礼品数量
            this.gift = this.firstData.gift_num;

            //填充选中商品
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: "SP_PlotActivity_auction_info",
                    params: $this.firstData.aid
                },
                dataType: "json",
                async: false,
                success: function(data) {

                    // console.log(data);
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].type == "main") {
                                $this.selected_p.left.s.push(data[i]);
                            } else if (data[i].type == "auxiliary") {
                                $this.selected_p.right.s.push(data[i]);
                            }
                        }
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        } else if (this.src == "source=4") {

            //读取cookie
            var str = getCookie("hotCookie");

            //将带过来的数据赋值给  firstData 时间
            this.firstData = JSON.parse(str);

            //向前推 3 天时间,并且将时间存入数组
            var a = this.firstData.stratdate - (72 * 60 * 60 * 1000);
            var c = this.firstData.stratdate - (24 * 60 * 60 * 1000);
            this.actTime.push({
                day: a,
            }, {
                day: c
            });
        }

        //点击主推产品后，接收选择的商品
        bus.$on("selData", (selectReturn) => {
            console.log($this.selected_p.left.s);
        });

    },
    computed: {
        tonum: function() {
            var a = 0;
            var $this = this;
            for (var i = 0; i < $this.selectBox.length; i++) {
                if ($this.selectBox[i].isselected) {
                    a += Number($this.selectBox[i].v)
                }
            }
            return a
        }
    },
    methods: {

        //点击选择主推产品,出现弹出层
        mostProduct: function() {
            $(".most_fixed_box").show();
            $(".cn1").show();
        },

        //点击选择辅推产品,出现弹出层
        selectProSec: function() {
            $(".most_fixed_box").show();
            $(".cn2").show();
        },

        //推广入口点击切换状态
        selected: function(sel) {
            this.selectBox[sel].isselected = !this.selectBox[sel].isselected;
        },

        //转化时间戳
        toDate: function(date) {
            if (date == null) {
                return "";
            }
            var ndate = new Date(date);
            var Y = ndate.getFullYear();
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1);
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
            var h = (ndate.getHours() < 10 ? '0' + (ndate.getHours()) : ndate.getHours()) + ':';
            var m = (ndate.getMinutes() < 10 ? '0' + (ndate.getMinutes()) : ndate.getMinutes()) + ':';
            var s = (ndate.getSeconds() < 10 ? '0' + (ndate.getSeconds()) : ndate.getSeconds());
            ndate = Y + M + D; //
            return ndate;
        },

        //预期营收 he 礼品数量 聚焦事件
        earnFocus: function(l, n) {
            if (n == 1) { //预期营收
                this.yuqiType = true; //黄色字体，显示只能输入数字
                this.yuqiShow = false; //红色字体，不能为空
                $(".earnInput").removeClass("import_prompt"); //输入框回复常态
            } else if (n == 2) { //礼品数量
                this.isGift = true; //显示提示框
            }
        },

        //预期营收 he 礼品数量 失焦事件
        earnBlur: function(l, n) {
            if (n == 1) { //预期营收
                this.yuqiType = false; //黄色字体去除
                if (l === "") { //如果输入为空， 
                    this.yuqiShow = true; //红色字体，提示不能为空
                    $(".earnInput").addClass("import_prompt"); //输入框变红
                }
            } else if (n == 2) { //礼品数量
                this.isGift = false; //提示框消失
            }
        },

        //预期转化率聚焦事件
        exceptFocus: function(l) {
            this.tipArr.tips = "*该项只能以数字形式输入";
            this.expectColor = false; //字体样式为黄色
            this.isRed = false; //输入框恢复原样
        },

        //预期转化率失焦事件
        exceptBlur: function(l) {
            if (l === "") { //若为空
                this.tipArr.tips = "*该项不能为空";
                this.expectColor = true; //字体样式为红色
                this.isRed = true; //输入框变红
            } else { //若不为空，不显示任何提示
                this.tipArr.tips = "";
                this.isRed = false; //输入框恢复原样
            }
        },

        //促销方案 he 促销方式 聚焦事件
        proFocus: function(pro, l) {
            if (l == 1) { //促销方案
                this.isProRed = false; //文本框恢复
                this.isPro = false; //红色字体提示消失
            } else if (l == 2) { //促销方式
                this.isMethRed = false; //文本框恢复
                this.isMeth = false; //红色字体提示消失
            } else if (l == 3) {
                this.theRedBorder = false; //文本框恢复
                this.themeShow = false; //红色字体提示消失
            }
        },

        //促销方案 he 促销方式 失焦事件
        proBlur: function(pro, l) {
            if (l == 1) { //促销方案

                //如果验证为空，则出现提示
                if (isNull(pro) == true) {
                    this.isProRed = true; //文本框变红
                    this.isPro = true; //红色字体提示出现
                }
            } else if (l == 2) { //促销方式

                //如果验证为空，则出现提示
                if (isNull(pro) == true) {
                    this.isMethRed = true; //文本框变红
                    this.isMeth = true; //红色字体提示出现
                }
            } else if (l == 3) {
                if (isNull(pro) == true) {
                    this.theRedBorder = true; //文本框变红
                    this.themeShow = true; //红色字体提示出现
                }
            }
        },
        quxiao: function() {
            window.history.go(-1);
        },

        //提交按钮
        submit: function() {
            //监测活动时间是否为空
            var startTime = $("#activityTimeSel").html();
            var endTime = $("#activityTimeEnd").html();
            var $this = this;
            var leftPro = []; //左侧多选主推产品
            var rightPro = []; //右侧多选辅推产品
            var leftString;
            var rightString;

            //循环左侧主推产品 用空格分割
            for (var i = 0; i < $this.selected_p.left.s.length; i++) {
                leftPro.push($this.selected_p.left.s[i].auctionName);
            }
            leftString = leftPro.join(" ");

            //循环右侧辅推产品 用空格分割
            for (var i = 0; i < $this.selected_p.right.s.length; i++) {
                rightPro.push($this.selected_p.right.s[i].auctionName);
            }
            rightString = rightPro.join(" ");
            var newDate = new Date(); //获取当前时间
            // return;
            if (this.earn !== "" && this.except !== "" && isNull(this.proProject) != true && isNull(this.proMethods) != true && leftString != "" && startTime != "" && endTime != "" && this.actTheme != "") {
                if (Number(startTime) > Number(endTime)) {
                    alert("开始时间不能大于结束时间");
                    return;
                }

                //变量存储所有获得到的值
                var subParams = {
                    sellerid: $this.sellerid,
                    activityThemeInput: $("#activityThemeInput").val(), //活动 主题
                    activityTypeSel: $("#activityTypeSel option:selected").val(), //活动类型
                    activityTimeSel: $("#activityTimeSel").html(), //活动开始时间
                    activityTimeEnd: $("#activityTimeEnd").html(), //活动结束时间
                    operation_time: changeDate(newDate), //当前时间
                    activitySpecialUV: activityUV($(".activitySpecialUV")), //活动专题
                    natureFreeUV: activityUV($(".natureFreeUV")), //自然免费流量
                    payPopuUV: activityUV($(".payPopuUV")), //支付推广流量
                    oldUV: activityUV($(".oldUV")), //老客唤醒流量
                    otherMethodUV: activityUV($(".otherMethodUV")), //其他渠道
                    overallUV: $(".overallUV").val(), //整体流量
                    earnInput: $(".earnInput").val(), //预期营收
                    expectInput: $(".expectInput").val(), //预期转化率
                    leftSelect: leftString, //左侧主推产品下拉框
                    rightSelect: rightString, //右侧辅推产品下拉框
                    proProject: $(".proProject").val(), //促销方案
                    proMethods: $(".proMethods").val(), //促销方式
                    otherPromotion: $(".otherPromotion").val(), //辅助促销
                    add_gift: $(".add_gift").val(), //追加礼品
                    gift_count: $(".gift_count").val(), //礼品数量
                    plan: "计划"
                };

                //处理提交的字对象，转化为字符串形式
                var p = [];
                for (var j in subParams) {
                    p.push(subParams[j]);
                }

                // console.log(p); //输出传递的参数
                //提交
                function submit(aid) {
                    $.ajax({
                        url: $this.url,
                        type: "POST",
                        data: {
                            name: "SP_PlotActivity_insert",
                            params: subParams.sellerid + "," + subParams.activityThemeInput + "," + subParams.activityTypeSel + "," +
                                subParams.activityTimeSel + "," + subParams.activityTimeEnd + "," + subParams.activitySpecialUV + "," + subParams.natureFreeUV + "," +
                                subParams.payPopuUV + "," + subParams.oldUV + "," + subParams.otherMethodUV + "," + subParams.overallUV + "," + subParams.earnInput + "," +
                                subParams.expectInput + "," + subParams.leftSelect + "," + subParams.rightSelect + "," + subParams.proProject + "," + subParams.proMethods + "," +
                                subParams.otherPromotion + "," + subParams.add_gift + "," + subParams.gift_count + "," + aid
                        },
                        dataType: "json",
                        async: false,
                        success: function(data) {
                            console.log(data);
                            window.location.href = "pro-manage.html"
                        },
                        error: function(xhr) {
                            console.log(xhr);
                        }
                    });
                }

                //如果是表格点击跳转
                if (this.src == "source=3") {
                    submit($this.firstData.aid);
                } else {
                    submit("-1");
                }
            } else {
                alert("部分值未填写，无法提交");
            }
        },


    }
});


//主推产品弹出层组件
Vue.component("v-most-product", {
    template: `
        <div>
            <div class="most_fixed_box"></div>
            <div :class="selte_p.cn">
                <div class='select_shop_box' style='position:relative;width:920px;'>
                    <p class="product_title">请选择产品<span @click="most_delete()"><img src="../img/删除筛选项 (1).png"/></span></p>
                    <div class='selected_box'>
                        <ul>
                            <li v-for="l in Product">
                                <span class='select_box' @click="selectItem(l.auction_id,l.auction_name,l,l.auction_picture,l.seller_id)" :class='{selected:l.selected==true}'></span>
                                <span class='img_box'><img :src='l.auction_picture' style='max-width:40px;max-height:40px'></span>
                                <span class='order_title'>{{l.auction_name}}</span>
                            </li>
                        </ul>
                    </div>
                    <v-page :count='count' :allpage='allpage' :pageno="pageno" @pn="changepn"></v-page>
                    <div>
                        <!--<button class="grey_btn fr" @click="most_delete()">取消</button>-->
                        <button class="repeat_btn fr" @click="most_sure()">确认</button>
                    </div>
                    <transition name="bounce">
                        <v-tip :tip="tip" v-show='istip'></v-tip>
                    </transition>
                </div>
            </div>
        </div>
    `,
    props: ["sellerid", "selte_p"],
    data: function() {
        return {
            url: $api.SPTarget, //请求地址
            Product: [], //主推产品数组
            otherProduct: [], //辅推产品数组
            selectedLeftPro: [], //选中的主推产品
            selectedRightPro: [], //选中的辅推产品
            leftShow: false,
            rightShow: false,
            pageno: 1, //当前页码
            pagesize: 10, //分页大小，每页显示多少条
            count: 0, //总数据量
            allpage: 0, //总页数
            selectorder: [], //已选择商品列表数组
            tip: "", //未选中商品弹出框内容提示
            istip: false, //未选中商品弹出框显示隐藏
            clickAable: true, //弹出框出现禁止提交，true可以提交  false 不可提交
            isOne: true,
            isTwo: false,
        }
    },
    created() {
        var $this = this;
        remindData();
        //接收未选商品弹出框的参数
        bus.$on("tip", (tipReturn) => {
            $this.istip = tipReturn.istip; //弹出框是哪个是否显示
            $this.clickAable = tipReturn.clickAable; //确定按钮是否可以提交
        });
        //请求数据函数
        function remindData() {
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_PlotGetAuction',
                    params: $this.sellerid + "," + $this.pageno + "," + $this.pagesize,
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    data.forEach((obj) => {
                        obj.selected = false;
                    });
                    //将请求的数据赋值给Product
                    $this.Product = data;

                    //将选中的商品记录，即使翻页夜不消失
                    //如果记录的选中项和数据中的某项一致，则该项被选中
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < $this.selectorder.length; j++) {
                            if ($this.selectorder[j].authionId == data[i].auction_id) {
                                data[i].selected = true;
                            }
                        }
                    }
                    //分页总条数
                    if (data.length != 0) {
                        $this.count = data[0].Introwcount;
                    } else {
                        $this.count = 1;
                    }
                    $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        };
    },
    methods: {
        //接收分页组件页码， 没点击一次分页，刷新页面
        changepn: function(pn) {
            var $this = this;
            this.pageno = pn;
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_PlotGetAuction',
                    params: $this.sellerid + "," + $this.pageno + "," + $this.pagesize
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    data.forEach((obj) => {
                        obj.selected = false;
                    });
                    //将请求的数据赋值给Product
                    $this.Product = data;
                    $this.otherProduct = cloneFun(data);
                    //将选中的商品记录，即使翻页夜不消失
                    //如果记录的选中项和数据中的某项一致，则该项被选中
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < $this.selectorder.length; j++) {
                            if ($this.selectorder[j].authionId == data[i].auction_id) {
                                data[i].selected = true;
                            }
                        }
                    }
                    //分页总条数
                    if (data.length != 0) {
                        $this.count = data[0].Introwcount;
                    } else {
                        $this.count = 1;
                    }
                    $this.allpage = Math.ceil($this.count / $this.pagesize); //计算总页数
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },
        //点击取消按钮
        most_delete: function() {
            // //如果商品数组为空，执行以下操作
            if (this.selte_p.cn == "cn1") {
                if (this.selte_p.s.length == 0) {
                    this.tip = "请至少选择一种商品才可以进行活动策划";
                    this.clickAable = false; //禁止提交
                    this.istip = true; //弹出提示框
                    return
                } else {
                    var selectReturn = this.selte_p.s;
                    bus.$emit("selData", selectReturn);
                    $(".most_fixed_box").hide(); //遮罩消失
                    $(".cn2,.cn1").hide(); //弹出层消失
                };
            } else if (this.selte_p.cn == "cn2") {
                $(".most_fixed_box").hide(); //遮罩消失
                $(".cn2,.cn1").hide(); //弹出层消失
            }

            //如果this.clickAable 为false 则禁止提交
            if (!this.clickAable) {
                return
            };

        },
        //商品选中事件
        selectItem: function(aid, aName, l, aPicture, sid) {
            //变更商品选中状态
            l.selected = !l.selected;
            //记录选中项,选中则放入数组，
            if (l.selected) {
                this.selte_p.s.push({
                    authionId: aid,
                    auctionName: aName,
                    auctionPicture: aPicture,
                    sellerId: sid
                });
            } else {
                //取消选中商品
                for (var i = 0; i < this.selte_p.s.length; i++) {
                    if (this.selte_p.s[i].authionId == aid) {
                        this.selte_p.s.splice(i, 1);
                    }
                }
            }
        },
        //点击确定按钮
        most_sure: function() {
            if (this.selte_p.cn == "cn1") {
                //如果商品数组为空，执行以下操作
                if (this.selte_p.s.length == 0) {
                    this.tip = "请至少选择一种商品才可以进行活动策划";
                    this.clickAable = false; //禁止提交
                    this.istip = true; //弹出提示框
                    return
                } else {
                    var selectReturn = this.selte_p.s;
                    bus.$emit("selData", selectReturn);
                    $(".most_fixed_box").hide(); //遮罩消失
                    $(".cn2,.cn1").hide(); //弹出层消失
                };
            } else if (this.selte_p.cn == "cn2") {
                var selectReturn = this.selte_p.s;
                bus.$emit("selData", selectReturn);
                $(".most_fixed_box").hide(); //遮罩消失
                $(".cn2,.cn1").hide(); //弹出层消失
            }

            //如果this.clickAable 为false 则禁止提交
            if (!this.clickAable) {
                return
            };

        }
    }
});

//未选中商品提示框
Vue.component("v-tip", {
    template: `
    <div style='position:absolute;width:50%;height:327px;border:1px solid #999999;top:50%;left:50%;transform: translate(-50%,-50%);background:white;padding-bottom:30px;' class='tip_box'>
        <p :title='tip'>{{tip}}</p>
        <div style='text-align:center'>
            <button @click='goOn()'>继续选择</button>
        </div>
        <div class='tip_close' style='position:absolute;right:0;top:0;background:url("../img/删除筛选项 (1).png") no-repeat;width:24px;height:24px;background-size:cover;' @click='goOn()'></div>       
    </div>
    `,
    props: ["tip"],
    methods: {
        //点击继续选择按钮，回到选择页面，
        goOn: function() {
            var tipReturn = {
                istip: false, //提示框消失
                clickAable: true, //点击确定可提交内容
            };
            //用触发器存储，传递到上个组件
            bus.$emit("tip", tipReturn);
        }
    }
});