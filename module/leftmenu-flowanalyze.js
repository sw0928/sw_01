//流量分析左侧导航栏
Vue.component("v-left-menu-flow", {
    template: `
    <div id="leftMenu" class="r12-2-menu">
        <div class="left-menu-box">
            <dl v-for='li in navList' class='left-menu-list'>
                <dt class="left-menu-box-a" @click="li.ishow=!li.ishow" @click=changeurl(li.url,$event)>{{li.name}}</dt>
               
                <dd v-for='l in li.cnav' v-show='li.ishow' >                  
                    <span  @click="changeurl(l.url,$event)" @click="l.ishow=!l.ishow" style='display:block;' class='left-menu-box-a'>{{l.name}}</span>
                    <div v-for='t in l.ccnav' class='left-menu-box-a' v-show='l.ishow' style='display:block;'  @click="changeurl(t.url,$event)">
                        {{t.name}}
                    </div>
                </dd>
                
                
                      
            </dl>
            <!--<div class="leftBox_img">
                <img src="../img/article1.png" alt="">
                <p>新手一个月利用标题优化引爆免费流量</p>
                <img src="../img/article4.png" alt="">
                <p>90天产品经理养成计划</p>
            </div>-->
        </div>
    </div>
`,
    data: function() {
        return {
            current: 0,
            navList: [{
                ishow: false,
                name: "可控流量",
                cnav: [{
                    ishow: false,
                    name: "搜索优化",
                    url: "http://mouse.molesoft.cn/SearchExperts/SearchReport.aspx",
                    ccnav: [{
                        name: "搜索标题分析",
                        url: "http://mouse.molesoft.cn/SearchExperts/ItemKeyword.aspx"
                    }, {
                        name: "关键词流量",
                        url: "http://mouse.molesoft.cn/SearchExperts/ShopKeyword.aspx"
                    }]
                }, {
                    ishow: false,
                    name: "直通车",
                    url: ""
                }, {
                    ishow: false,
                    name: "活动推广",
                    url: ""
                }],
                ishow: false,
                url: "http://mouse.molesoft.cn/SearchExperts/SearchReport.aspx"
            }, {
                name: "不可控流量",
                cnav: [],
                ishow: false,
                url: ""
            }, {
                name: "流量布局",
                cnav: [],
                ishow: false,
                url: "http://mouse.molesoft.cn/SearchExperts/ShopSource.aspx"
            }]
        }
    },

    methods: {
        changeurl: function(u, e) {
            if (u == '') {
                u = 'building.html'
            };
            $("#iframe_web iframe").attr("src", u);
            $(".left-menu-box-a").removeClass("active")
            $(e.target).addClass("active");
        }
    },
    mounted() {
        $(".left-menu-box-a").eq(0).addClass("active");
    }
});


/**
 * &#x5F53;&#x4F60;&#x770B;&#x5230;&#x8FD9;&#x4E32;&#x4EE3;&#x7801;&#x7684;&#x65F6;&#x5019;
 * 1.&#x6211;&#x5DF2;&#x7ECF;&#x79BB;&#x804C;&#x4E86;
 * 2.&#x8FD9;&#x4E2A;&#x516C;&#x53F8;&#x6CA1;&#x6709;&#x5E74;&#x7EC8;&#x5956;
 * 3.&#x8FD9;&#x4E2A;&#x9879;&#x76EE;&#x6709;&#x5F88;&#x591A;&#x9057;&#x7559;bug
 * 4.&#x76F8;&#x4FE1;&#x4F60;&#x4E5F;&#x575A;&#x6301;&#x4E0D;&#x4E86;&#x591A;&#x4E45;
 */