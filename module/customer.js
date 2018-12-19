//头部组件
Vue.component("v-custom-top", {
    template: `
        <div class="top">
            <div class="box">
                <div v-for="(l,index) in topData" class="top-a-box" :class='{"top-a-box-sel":top==index}'>
                    <a class="top-a" :href="l.url">{{l.name}}</a>
                </div>
                <div class="user-a"></div>
            </div>
        </div>
    `,
    props: ["top"],
    data: function() {
        return {
            topData: [{
                name: "店铺报告",
                url: ""
            }, {
                name: "运营计划",
                url: "operationAI.html"
            }, {
                name: "店铺分析",
                url: "shop-analyze.html"
            }
			]
        }
    }
});
//左侧菜单组件
Vue.component("v-left-menu", {
    template: `
        <div id="leftMenu" class="r12-2-menu">
            <div class="left-menu-box">
                <a v-for="(left,index) in menus" class="left-menu-box-a" v-bind:href="left.url" :class='{active:current==index}'>
                    <span v-bind:class="left.Class" class='left-menu-box-span'></span>
                    {{left.name}}
                </a>
                <div class="leftBox_img">
                    <img src="../img/article1.png" alt="">
                    <p>新手一个月利用标题优化引爆免费流量</p>
                    <img src="../img/article4.png" alt="">
                    <p>90天产品经理养成计划</p>
                </div>
            </div>
        </div>  
    `,
    props:["current"],
    data: function() {
        return {
            id: '',
            current: 0,
            menus: [
                {
                name: "每日预警",
                Class: "",
                url: "operationAI.html"
            },{
                name: "爆款计划",
                Class: "",
                url: "hotcake-plan.html"
            },{
                name: "促销管理",
                Class: "",
                url: "pro-manage.html"
            }
        
        ]
        }
    },
    created() {
        var $this = this;
        //getSid($this);
        // this.id = 195051840; // 钧 安 堂
        // this.addData();
    },
    methods: {
        addData: function() {
            var $this = this;
            $.ajax({
                url: $api.getmenus + "?sellerid=" + $this.id,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    if (data) {
                        var rdata = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].previous_menu == '店铺预警') {
                                data[i].Class = data[i].class;
                                rdata.push(data[i]);
                            }
                        };
                        $this.menus = rdata;
                        var url = window.location.href;
                        for (var i = 0; i < rdata.length; i++) {
                            if (url.indexOf(rdata[i].url) > -1) {
                                $this.current = i;
                                return
                            }
                        };
                        if (url.indexOf("hotcake-plan-addorder") > -1) {
                            for (var i = 0; i < rdata.length; i++) {
                                if (rdata[i].url.indexOf("hotcake-plan.html") > -1) {
                                    $this.current = i;
                                    return
                                }
                            }
                        }
                        if (url.indexOf("activity-plan") > -1 || url.indexOf("activity-reply") > -1) {
                            for (var i = 0; i < rdata.length; i++) {
                                if (rdata[i].url.indexOf("pro-manage.html") > -1) {
                                    $this.current = i;
                                    return
                                }
                            }
                        }
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        }
    }
});

//左侧菜单组件
Vue.component("v-left-menu-two", {
  template: `
        <div id="leftMenu" class="r12-2-menu">
            <div class="left-menu-box">
                <a v-for="(left,index) in menus" class="left-menu-box-a" v-bind:href="left.url" :class='{active:current==index}'>
                    <span v-bind:class="left.Class" class='left-menu-box-span'></span>
                    {{left.name}}
                </a>
                
                <div class="leftBox_img">
                    <img src="../img/article1.png" alt="">
                    <p>新手一个月利用标题优化引爆免费流量</p>
                    <img src="../img/article4.png" alt="">
                    <p>90天产品经理养成计划</p>
                </div>
            </div>
        </div>  
    `,
  props: ["current"],
  data: function () {
    return {
      id: '',

      menus: [
        {
          name: "分平台流量",
          Class: "",
          url: "shop-analyze.html"
        }, {
          name: "搜索简报",
          Class: "",
          url: "search_bulletin.html"
        }, {
          name: "一键分析",
          Class: "",
          url: "oneKey.html"
        }, {
          name: "属性分析",
          Class: "",
          url: "property.html"
        }, {
          name: "搜索优化",
          Class: "",
          url: "seek_optimize.html"
        }, {
          name: "关联分析",
          Class: "",
          url: "relevance.html"
        }

      ]
    }
  },
  created() {
    var $this = this;
    getSid($this);
    // this.id = 195051840; // 钧 安 堂
    // this.addData();
  },
  methods: {
    addData: function () {
      var $this = this;
      $.ajax({
        url: $api.getmenus + "?sellerid=" + $this.id,
        type: "GET",
        dataType: "json",
        success: function (data) {
          if (data) {
            var rdata = [];
            for (var i = 0; i < data.length; i++) {
              if (data[i].previous_menu == '店铺预警') {
                data[i].Class = data[i].class;
                rdata.push(data[i]);
              }
            };
            $this.menus = rdata;
            var url = window.location.href;
            for (var i = 0; i < rdata.length; i++) {
              if (url.indexOf(rdata[i].url) > -1) {
                $this.current = i;
                return
              }
            };
            if (url.indexOf("hotcake-plan-addorder") > -1) {
              for (var i = 0; i < rdata.length; i++) {
                if (rdata[i].url.indexOf("hotcake-plan.html") > -1) {
                  $this.current = i;
                  return
                }
              }
            }
            if (url.indexOf("activity-plan") > -1 || url.indexOf("activity-reply") > -1) {
              for (var i = 0; i < rdata.length; i++) {
                if (rdata[i].url.indexOf("pro-manage.html") > -1) {
                  $this.current = i;
                  return
                }
              }
            }
          }
        },
        error: function (xhr) {
          console.log(xhr);
        }
      });
    }
  }
});

// //左侧菜单组件
/* Vue.component("v-left-menu-customer", {
    template: `
        <div id="leftMenu" class="r12-2-menu">
            <div class="left-menu-box">
                <a v-for="(l,index) in leftData" :href="l.url" class="left-menu-box-a" :class='{"active":current==index}'>
                    <span class='left-menu-box-span'></span>{{l.name}}
                </a>
            </div>
        </div>
    `,
    props: ["current"],
    data: function() {
        return {
            leftData: [{
                name: '用户来源',
                url: 'client-location.html'
            }, {
                name: '地理分析',
                url: 'geogra-analyze.html'
            }]
        }
    }
}); */