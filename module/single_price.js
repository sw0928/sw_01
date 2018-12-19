Vue.component("v-single-price", {
    template: `
        <div>
            <div id="fixedMenu" class="r12-10r">
                <div class="fixed-menu-box">
                    <div class="fixed-menu-main">
                        <div class="filter">
                            <div class="filter-btn" v-for='(li,index) in datelists' :class='{"filter-btn-sel":index==currentDate}' @click='chageDate(index)'>{{li.name}}</div>                           
                        </div>
                    </div>
                </div>
            </div>
            <div class="r12-10r">
                <div class="module-title">
                    <h1>商品价值分布图</h1>
                </div>

                <div class="div main_chart">
                    <div id="price_echart" style="width: 100%;height:450px;"></div>
                </div>
            </div>
            <div class="r12-10r">
                <div class="module-title clearfix" style='margin-bottom:20px'>
                    <h1>宝贝列表</h1>
                    <p>共找到{{count}}个宝贝</p>
                </div>
                <div id="table" data-max="19.8">
                    <table>
                        <tbody>
                            <tr class="column">
                                <th>宝贝</th>
                                <th v-for='(li,index) in tableColumns' v-if='index>2'>{{li}}</th>                             
                                <!--<th>操作</th>-->
                            </tr>
                            <tr v-for='li in tableRows'>
                                <td class="td-name" :title='li[1]'>
                                    <a :href='"https://item.taobao.com/item.htm?id="+li[0]' target="_blank"><img class="td-img" :src='li[2]'>{{li[1]}}</span></a>
                                </td>
                                <td v-for='(l,index) in li' v-if='index>2'>{{l}}</td>
                                <!--<td>
                                    <div class="td-btn-box">
                                        <div class="td-btn-list"><a class="td-btns" :href='"search_detail.html?id="+li[0]'>搜索详细</a></div>
                                    </div>
                                </td>-->
                            </tr>                            
                        </tbody>
                    </table>
                </div>
                <v-page :count='count' :pageno='page' :allpage='allpage' @pn="changepn"></v-page>
            </div>    
        </div>
    
    `,
    props: ["sellerid"],
    data: function() {
        return {
            allpage: 0,
            pagesize: 10,
            count: 0,
            page: 1,
            currentDate: 1, //默认选中时间
            datelists: [{
                name: "昨天",
                enddate: this.nowData(1).n,
                startdate: this.nowData(1).m
            }, {
                name: "近7天",
                enddate: this.nowData(1).n,
                startdate: this.nowData(8).m
            }, {
                name: '近30天',
                enddate: this.nowData(1).n,
                startdate: this.nowData(31).m,
            }],

            url1: $api.pishow22, //饼图接口
            url2: $api.prishow, //表格接口

            chartData1: [], //饼图数据
            tableColumns: [], //表格数据
            tableRows: []
        }
    },
    watch: {
        sellerid: function() {
            this.chartA();
            this.tableData();
            this.showPic()
        },
        currentDate: function() {
            this.chartA();
            this.tableData();
            this.showPic()
        },
        page: function() {
            this.tableData();
            this.showPic();
        }
    },

    methods: {
        changepn(data) {
            this.page = data
        },
        chageDate(i) {
            this.currentDate = i
        },

        nowData: function(daynum) {
            var n = new Date().getTime();
            var m = n - 86400000 * daynum;
            return {
                n: this.fdata(n),
                m: this.fdata(m)
            };
        },

        fdata: function(d) {
            var ndate = new Date(d);
            var Y = ndate.getFullYear() + '';
            var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1);
            var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate());
            return Y + M + D;
        },

        //获取饼图数据
        chartA() {
            var $this = this;
            if (!this.sellerid) {
                return
            };

            $.ajax({
                url: $this.url1 + '?sellerid=' + $this.sellerid + '&begintime=' + $this.datelists[$this.currentDate].startdate + '&endtime=' + $this.datelists[$this.currentDate].enddate + '&sortname=&sorttype=&type=1&remark=&page=',
                type: "GET",
                dataType: "json",

                success: function(data) {
                    var arr = [];
                    if (data) {
                        for (var i = 0; i < data.data.rows.length; i++) {
                            arr.push({
                                name: data.data.rows[i][2],
                                value: data.data.rows[i][1],
                            })
                        }
                    };
                    $this.chartData1 = arr;
                    $this.priceEchart()
                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });

        },

        //获取表格数据
        tableData() {
            var $this = this;
            if (!this.sellerid) {
                return
            };

            $.ajax({
                url: $this.url2 + '?sellerid=' + $this.sellerid + '&begintime=' + $this.datelists[$this.currentDate].startdate + '&endtime=' + $this.datelists[$this.currentDate].enddate + '&sortname=宝贝页PV&sorttype=desc&type=2&remark=&page=' + $this.page,
                type: "GET",
                dataType: "json",

                success: function(data) {

                    $this.count = data.count;
                    $this.allpage = Math.ceil($this.count / $this.pagesize)
                    $this.tableColumns = data.data.columns;
                    $this.tableRows = data.data.rows;

                },
                error: function(xhr) {
                    console.log(xhr);
                },
            });
        },

        priceEchart() {
            var myChart = echarts.init(document.getElementById('price_echart'));
            var option = {

                tooltip: {
                    trigger: 'item',
                    formatter: "访问来源 <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: ['有流量、有销售的宝贝数', '有流量、无销量的宝贝数', '无流量、无销售的宝贝数']
                },
                series: [{
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: this.chartData1,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            myChart.setOption(option);

        },

        showPic() {
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
        }
    },

    mounted() {

    }
});