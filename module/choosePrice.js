//流量分析左侧导航栏
Vue.component("v-left-menu-price", {
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
                name: "单品定价",
                cnav: [],
                ishow: false,
                url: "http://mouse.molesoft.cn/SearchExperts/ItemList.aspx"
            }, {
                name: "组合策略",
                cnav: [],
                ishow: false,
                url: ""
            }, {
                ishow: false,
                name: "任选策略",
                cnav: [],
                ishow: false,
                url: ""
            }, {
                name: "行业定价",
                cnav: [],
                ishow: false,
                url: ""
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

        },

    },
    mounted() {
        $(".left-menu-box-a").eq(0).addClass("active");
    }
});