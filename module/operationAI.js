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



//运营看板组件
Vue.component("v-operate-top-table", {
    template: `
                <div>
                    <div class="b1">
                        <table class="operationAI_tab_1">
                            <tbody>
                                <template v-for='(li,index) in tableTop'>
                                    <tr class="operateAI_board_table_title">
                                        <td class="operate_top_title">跟踪项目</td>
                                        <td v-for='(l,index) in li'>{{toPage(l.target),index}}
                                            <div class="target_samll_box" :class='{"target_samll_box_active":l.isActive}' :value="l.title" @click="descri(l,index,l.title)"></div>
                                        </td>
                                        <td rowspan="2" class="character_box" v-bind:class="bgColor(index)">{{text(index)}}</td>
                                    </tr>
                                    <tr>
                                        <td class="operate_top_title">数值（日环比）</td>
                                        <td v-for="(l,index) in li">
                                            <p v-bind:title="l.value">{{l.value}}</p>
                                            <h2><img :src="imgSrc(l.rank)" alt=""></h2>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    <div class="b1">
                        <p class="fl operation_bot_title">运营看板指标解读</p>
                        <p class="fl operation_bot_des" v-html="descriCont"></p>
                    </div>
                    <div class="b1"></div>
                </div>
            `,
    props: ["tableTop"],
    data: function() {
        return {
            descriCont: '<b style="color:red;">请点击指标右侧问号查看指标解读！</b>', //指标解读单项绑定
        }
    },
    methods: {
        //根据数值判断上下箭头
        imgSrc: function(val) {
            var vall = Number(val);
            if (vall < 0) {
                return "../img/down.png"
            } else if (vall == 0) {
                return "../img/line.png"
            } else {
                return "../img/up.png"
            }
        },
        bgColor: function(i) {
            if (i == 0) {
                return "flow_chara"
            } else if (i == 1) {
                return "visitor_chara"
            } else if (i == 2) {
                return "order_chara"
            } else if (i == 3) {
                return "pay_chara"
            } else if (i == 4) {
                return "over_chara"
            }
        },
        text: function(j) {
            if (j == 0) {
                return "流量特征"
            } else if (j == 1) {
                return "访客特征"
            } else if (j == 2) {
                return "下单特征"
            } else if (j == 3) {
                return "支付特征"
            } else if (j == 4) {
                return "完结特征"
            }
        },
        //修改页面为详情页
        toPage: function(p) {
            if (p == "页面收藏率" || p == "页面加购率" || p == "页面到达率") {
                p = "详情页" + p.substr(2, p.length - 1);
            }
            return p;
        },

        //点击问号，修改下方的指标解读
        descri: function(l, index, title) {

            //遍历数据，先将其他的问号变成灰色
            for (var i = 0; i < this.tableTop.length; i++) {
                for (var j = 0; j < this.tableTop[i].length; j++) {
                    this.tableTop[i][j].isActive = false;
                }
            }

            //如果是未点击状态，则变红色，l.isActive = true;
            //指标解读内容改变
            if (!l.isActive) {
                l.isActive = !l.isActive;
                this.descriCont = title; //指标赋值
            }
        }
    }
});


//核心预警组件
Vue.component("v-main-warning-table", {
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
                                       <a href="javascript:;" class="black" v-bind:data1='li.yesterday_value' v-bind:data2='li.day_before_yesterday_value' v-bind:title='li.point'>去解决</a>									  
                                    </td>
                                </tr>
                            </tbody>
                        </table>

						<img class="noData_img" src="../img/vNodata.png" v-show="!noData">
                    </div>
                    <div class="b1"></div>                                       
                </div>       
            `,
    props: ["tableData", "noData"],
	
	mounted() {
    var $this = this;
    setTimeout(() => {
			var tdLis = $('#hexinyujing tr .black');
			for (let i = 0; i < tdLis.length; i++) {
			
			   (function(arg){
				tdLis[arg].onclick = function(){
					
					var val = $(this).attr('title');
					var yesterday = $(this).attr('data1');
					var tomorrow = $(this).attr('data2');
					 var data = {
						id: val,
						yesterday:yesterday,
						tomorrow:tomorrow
					};
					bus.$emit('target', data);
					$("#slove_fixed_box").show();
					$(".fixed_box").show();
				};
   })(i)  
			
		}
    }, 100)

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
        goSlove: function(val) {
			console.log(val);
            var data = {
                id: val,
              
            };
            bus.$emit('target', data);
            $("#slove_fixed_box").show();
            $(".fixed_box").show();
            $(".plan_textArea").val(''); //清空textarea
        },
		

        
    }
});


//调整计划表格组件
Vue.component("v-adjust-form", {
    template: `
            <div>
                <div class="fixed_box"></div>
                <div id="slove_fixed_box">
                    <div class="slove_box_cont">
                        <div class="delete_Btn" @click="cancle()"><img src="../img/删除筛选项 (1).png" alt=""></div>
                      
                        
                        <h1 class="slove_title">预警指标应急调整计划</h1>
                        <div class="slove_content">
                            <div class="slove_param">
                                <p class="average_deep fl">{{target.id}}</p>
                                <span class="alert_num fr">{{level}}级</span>
                                <span class="slove_yesTodeyValue fr">{{target.tomorrow}}</span>
                                <span class="slove_todeyValue fr">{{target.yesterday}}</span>
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
			val:'',
            current: [{
                selected: ''
            }],
            level: '', //级别
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
             $this.val = data.id;
			 $this.target = data;
			console.log($this.target);
            
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


//调整日志组件
Vue.component("v-adjust-info", {
    template: `
                <div>
                    <div class="b1" style="position:relative;">
                        <div>
                            <v-read-plan :read-plan="readPlan"></v-read-plan>
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
                                        {{li.Count-Number(li.RowNumber)+1}}    
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
            var ndate = date.substring(0, date.length - 2);
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
            //请求之前的值，
            $.ajax({
                url: $api.SPTarget,
                type: "POST",
                data: {
                    name: 'SP_PlanLog',
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
Vue.component("v-read-plan", {
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
        readPlan: function() {
            var $this = this;
        }
    },
    methods: {
        //取消
        cancle: function() {
            $("#read_fixed_box").hide();
            $(".fixed_box").hide();
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
    },
});


//分页组件
Vue.component("v-page", {
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
            showItem: 10,
            platform: 0, //分页初始化判断依据
            timeIndex: 1, //日期选项索引
            auction_id: '', //监听 auction_id,分页初始化
            dateStr: '', //自定义日期选项监听
        }
    },
    props: ["count", "allpage", "pageno"],
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
    watch: {

        //platform---分页初始化监听
        platform: function() {
            this.current = 1;
        },

        //监听authionid---分页初始化监听
        auction_id: function() {
            this.current = 1;
        },

        //timeIndex---分页初始化监听
        timeIndex: function() {
            if (this.timeIndex == 3) {
                return;
            }
            this.current = 1;
        },

        //dateStr---分页初始化监听
        dateStr: function() {
            this.current = 1;
        },
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
    },
    mounted() {
        var $this = this;

        //接收客群定位页面--用户来源页面--头部日期选项
        bus.$on("clientPlat", function(updata) {

            //如果点击了自定义选项
            if (updata.timeIndex == 3) {
                $this.dateStr = updata.setDate.begintime + updata.setDate.endtime;
            }
            $this.platform = updata.platform;
            $this.timeIndex = updata.timeIndex;
        });

        //接收客群定位页面--用户来源页面，为监听做铺垫
        bus.$on("changeAid", function(l) {
            $this.auction_id = l.authionID;
        });

    }
});

//产品转化地图 :class="toNum(l.arr.iratio)== 0%?'addImg':''"
Vue.component("v-transform-map", {
    template: `
        <div class="b1 transform_cont">
            <ul>
                <li v-for="l in allData">
                    <p class="trans_left_title">{{l.title}}</p>
                    <div class="gradient_wrap" >
                        <span v-for="p in l.arr" v-bind:style="'width:'+toNum(p.iratio)">
                            <a :href="'https://item.taobao.com/item.htm?id='+p.auction_id" target="_blank">
                                <p :title="p.name">{{p.name}}</p>
                                <p :title="p.level+':'+p.num">{{p.level+"："+p.num}}</p>
                                <p :title="'占比：'+toNum(p.ratio)">占比：{{toNum(p.ratio)}}</p>
                            </a>
                        </span>
                    </div>
                </li>
            </ul>
            <div class="b1"></div>
        </div>
    `,
    props: ["allData"],
	
    methods: {
        //转化百分比，添加 % 
		
        toNum: function(n) {
            var num = n * 100;
            return num.toFixed(2) + "%";
        },
		
			
    }
});
//日期渲染
var active = function (ele, ary) {
    var lis = $(ele)
    for (let i = 0; i < ary.length; i++) {
        const num = ary[i];
        for (let j = 0; j < lis.length; j++) {

            const eleNum = lis[j].innerHTML;
            if (num == eleNum) {
                lis[eleNum].style.backgroundColor = 'red';
            }


        }
    }

}  