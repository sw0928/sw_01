//活动复盘组件
Vue.component("v-activity-reply", {
    template: `
        <div class='clearfix'>
            <div class="b1" id="reply_first">
                <h2 class="hot_module_title" style="margin-top:0px;margin-bottom:30px;">活动复盘</h2>
                <div class="reply_time_type clearfix">
                    <label class="fl">活动时间：<input type="text" disabled :value='time'/></label>
                    <label class="fr">活动类型：<input type="text" :value='getcookie.activity_type' disabled/></label>
                </div>
                <div class="reply_theme clearfix">
                    <label>活动主题：<input type="text" :value='getcookie.activity_subject' disabled/></label>
                </div>
            </div>
            <div class="activity_data b1">
                <div class="activity_data_content">
                    <h3 class="most_pro_title">店铺主要促销活动</h3>
                    <div id="data_table">
                        <table class="data_table">
                            <colgroup>
                                <col width="25%">
                                <col width="25%">
                                <col width="25%">
                                <col width="25%">
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>核心指标</th>
                                    <th>实际数值</th>
                                    <th>结果评估</th>
                                    <th>延伸解读</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="li in listData">
                                    <td>{{li.kernel_index}}</td>
                                    <td>{{li.reality_val}}</td>
                                    <td>{{li.assessment}}</td>
                                    <td></td>
                                </tr>
                               
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="b1 do_process">
                <div class="do_process_content">
                    <h3 class="most_pro_title">执行过程复盘</h3>
                    <div class="most_pro_list">
                        <ul>
                            <li>
                                <p class="clearfix">
                                    <span class="fl">活动策划报名期工作:</span>
                                    <span class="fr">报名、排期、主题、活动策划</span>
                                </p>
                                <textarea v-model='postData.actwork1' :disabled='status=="归档"'></textarea>
                            </li>
                            <li>
                                <p class="clearfix">
                                    <span class="fl">活动准备与筹备期工作:</span>
                                    <span class="fr">备货、预包装、文案、设计、页面（更换、撤销、备份）</span>
                                </p>
                                <textarea v-model='postData.actwork2' :disabled='status=="归档"'></textarea>
                            </li>
                            <li>
                                <p class="clearfix">
                                    <span class="fl">活动后期工作:</span>
                                    <span class="fr">发货、售后、评价、平销</span>
                                </p>
                                <textarea v-model='postData.actwork3' :disabled='status=="归档"'></textarea>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="b1 activity_summary">
                <h2 class="hot_module_title" style="margin-bottom:30px;">活动复盘</h2>
                <div class="summary_textarea">
                    <textarea v-model='postData.actwork4' :disabled='status=="归档"'></textarea>
                </div>
                <div class="submit_btn_wrap" v-show='status!="归档"'>
                    <button class="orange_btn" @click='submit(1)'>暂存</button>
                    <button class="repeat_btn" @click='submit(2)'>提交</button>
                    
                </div>
            </div>
            <transition name="show_tip">
                <v-success :hold='hold' v-show='showtip'></v-success>
            </transition>
            
        </div>
    `,
    data: function() {
        return {
            showtip: false,
            hold: false,
            status: '',
            time: "",
            aid: "",
            sellerid: '',
            getcookie: {},
            postData: {
                actwork1: "", //活动策划报名期工作
                actwork2: "", //活动准备于筹备期工作
                actwork3: "", //活动后期工作
                actwork4: "", //活动复盘
            },
            load_source: "",
            pdata: [],
            url: $api.SPTarget, //请求地址
            listData: [],
        }
    },
    created() {
        this.sellerid = this.getQueryString("sellerid");
        this.getcookie = JSON.parse($.cookie('replydata'));
        this.time = this.formatDate(this.getcookie.stratdate) + " 至 " + this.formatDate(this.getcookie.enddate);
        this.aid = this.getcookie.aid;
        this.getList();
        this.getStatus();

    },
    methods: {
        //判断信息状态
        getStatus: function() {
            var $this = this;
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_PlotActivity_secondcount_info',
                    params: $this.aid,
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    if (data) {
                        $this.status = data[0].status;
                        $this.postData.actwork1 = data[0].apply_work;
                        $this.postData.actwork2 = data[0].prepare_work;
                        $this.postData.actwork3 = data[0].LateStage_work;
                        $this.postData.actwork4 = data[0].activity_summary;
                    }
                },
                error: function(xhr) {
                    console.log(xhr);

                }
            })
        },
        //获取列表信息
        getList: function() {
            var $this = this;
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_Plot_SecondCount',
                    params: $this.sellerid + ',' + $this.aid,
                },
                dataType: "json",
                async: false,
                success: function(data) {

                    for (var i = 0; i < data.length; i++) {
                        if (!data[i].assessment) {
                            data[i].assessment = 0;
                        }
                        data[i].assessment = (data[i].assessment * 100).toFixed(2) + "%";
                    };
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].kernel_index.indexOf("成交额") > -1) {
                            data[i].reality_val = "￥" + data[i].reality_val
                        } else if (data[i].kernel_index.indexOf("率") > -1 || data[i].kernel_index.indexOf("占比") > -1) {
                            data[i].reality_val = (data[i].reality_val * 100).toFixed(2) + "%";
                        }
                    }
                    $this.listData = data;
                },
                error: function(xhr) {
                    console.log(xhr);

                }
            })
        },
        //读取url信息
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        //时间格式化
        formatDate: function(now) {
            now = new Date(now);
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            return year + "-" + month + "-" + date;
        },
        strs: function(s) {
            return "'" + s + "'"
        },
        //提交表单
        submit: function(t) {
            var $this = this;
            $.ajax({
                url: $this.url,
                type: "POST",
                data: {
                    name: 'SP_PlotActivity_secondcount',
                    params: $this.aid + "," + $this.postData.actwork1 + "," + $this.postData.actwork2 + "," + $this.postData.actwork3 + "," + $this.postData.actwork4 + "," + t,
                },
                dataType: "json",
                async: false,
                success: function(data) {
                    $this.showtip = true;
                    $this.hold = true;
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },
        // submit: function() {
        //     var $this = this;
        //     this.pdata = [];
        //     this.pdata.push(this.getcookie.aid)
        //     for (k in this.postData) {
        //         this.pdata.push(this.postData[k]);
        //     };
        //     var pushstr = "'" + this.pdata.join(",") + "'";

        //     var adata = {
        //         Tb_Name: "lcsy_PlotActivity_secondcount",
        //         Fields: ["aid", "apply_work", "prepare_work", "LateStage_work", "activity_summary"],
        //         Values: $this.pdata
        //     };
        //     $.ajax({
        //         //http://localhost:8080/yanShulcsyData/intable 
        //         url: "http://223.6.252.143:30005/yanShulcsyData/intable",
        //         dataType: "json",
        //         type: "POST",
        //         traditional: true,
        //         contentType: "application/x-www-form-urlencoded; charset=utf-8",
        //         // data : mydata,
        //         data: {
        //             Tb_Name: "lcsy_PlotActivity_secondcount",
        //             Fields: "aid,apply_work,prepare_work,LateStage_work,activity_summary",
        //             Values: $this.pdata,
        //         },
        //         success: function(data) {
        //             alert('提交成功');
        //         }
        //     });

        // }
    },


});


//提交成功弹出提示框
Vue.component("v-success", {
    template: `
        <div class='success_tip_box'>
            <p>提交成功</p>
            <p>
                <i>{{num}}</i>s后返回之前页面
            </p>
            <button @click='history.go(-1)'>
                直接跳转
            </button>
        </div>   
    `,
    props: ["hold"],
    data: function() {
        return {
            num: 3
        }
    },
    watch: {
        hold: function() {
            if (this.hold == false) {
                return
            } else {
                setInterval(() => {
                    this.num--;
                    if (this.num == 0) {
                        history.go(-1);
                    }
                }, 1000)
            }
        }
    }
})