/**
 * 刘俊
 * 2017/1023
 * 客群定位---地理分析页面
 */

//组件通信
var bus = new Vue();

var geogre = new Vue({
    el: "#geogreCont",
    data: {
        sellerid: '',
        topCurrent: 3, // 头部索引所在位置
        current: 1, // 左侧导航所在位置

        platform: 0, // 左侧平台选中项
        dateCurrent: 1, // 右侧时间选中项
        selectGeo: "UV", //右侧按钮选中的值
        clickBtn: false, //右侧的黄色按钮是否点击，防止函数二次执行
        dateSection: '', //时间区间，点击了自定义后，传递过来的开始时间和结束时间，用来监听
        topFlag: false, //看地图诗句是否含有top1

        downLoad: true, // 组件复用，宝贝购买明细中表格下载按钮隐藏
        dateData: [{
            name: '昨天',
            val: 1,
            begintime: changeDate2(1), //开始时间
            endtime: changeDate2(1), //结束时间
        }, {
            name: '近七天',
            val: 7,
            begintime: changeDate2(7), //开始时间
            endtime: changeDate2(1), //结束时间
        }, {
            name: '近30天',
            val: 30,
            begintime: changeDate2(30), //开始时间
            endtime: changeDate2(1), //结束时间
        }, {
            name: '自定义',
            val: 0,
            begintime: '',
            endtime: ''
        }], //右侧时间选择
        geograData: {
            coord: '', //坐标数据
            energy: [], //能量指标
            rightDate: '', //右侧日期选择
            centerCity: '', //中心城市
        },
        treaTabData: { // 地理分析数据，组件复用数据，格式必须一致
            title: "地域列表",
            count: 10,
            thead: [], //表头
            tbody: [], //表内容
            pageno: 1, //当前页码
            pagesize: 10, //分页大小，每页显示多少条
            count: 0, //总数据量,总数据来源
            allpage: 0, //总页数
            noDataShow: true, //表格默认显示
        }
    },
    created() {
        // var $this = this;

        // //模拟数据
        // setTimeout(() => {
        //     // $this.sellerid = 195051840;
        //     // $this.sellerid = 1036319921;
        //     $this.sellerid = 2039898385;
        // }, 500);


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





        //接收头部导航------平台和日期的参数
        bus.$on("clientPlat", function(updata) {

            //如果来源是自定义按钮 ，给 $this.dateData 赋值
            if (updata.timeIndex == 3) {
                $this.dateData[updata.timeIndex].begintime = updata.setDate.begintime;
                $this.dateData[updata.timeIndex].endtime = updata.setDate.endtime;

                // 时间区间，合并成一个字符串，用于监听
                $this.dateSection = updata.setDate.begintime + updata.setDate.endtime;
            }
            $this.platform = updata.platform; //平台赋值
            $this.dateCurrent = updata.timeIndex; // 日期选中项
        });



    },
    watch: {

        //监听sellerid
        sellerid: function() {
            this.addData();
        },

        //监听platform
        platform: function() {

            //点击左侧平台选择的时候，黄色按钮也会随着发着改变，所以 
            //每次点击后，把  this.clickBtn  变成 false
            //根据不同的平台， selectGeo 赋不同的值
            if (this.platform == '0') {
                this.selectGeo = "UV";
            } else if (this.platform == '1') {
                this.selectGeo = "无线端UV";
            } else if (this.platform == '2') {
                this.selectGeo = "PC端UV";
            }
            this.addData();
        },

        //监听右侧黄色按钮的值，是否发生改变，改变有两种情况
        selectGeo: function() {

            //若是由平台带动的值改变，则中断此监听
            if (!this.clickBtn) {
                return;
            }
            this.addData();
        },

        //监听右侧日期选择项（未选中自定义项）
        dateCurrent: function() {

            //如果点击了自定义选项
            if (this.dateCurrent == 3) {
                return;
            }
            this.addData();
        },

        //监听时间区间，选中自定义后，手动选择的日期
        dateSection: function() {
            this.addData();
        },




    },
    methods: {

        //总执行函数
        addData: function() {
            var $this = this;
            if (!$this.sellerid) {
                return;
            }
            this.treaTabData.pageno = 1; //初始化分页
            this.geograAnalyze(); //地理分析请求
            this.geograTable(); //地域列表
        },

        //地理分析地图数据请求
        geograAnalyze: function() {
            var $this = this;
            $.ajax({
                url: $api.geograAnalyze,
                type: "GET",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    platform: $this.platform,
                    name: $this.selectGeo,
                    sortname: "",
                    sorttype: "desc",
                    page: 1,
                    type: 1
                },
                success: function(data) {
                    // console.log(data);
                    if (data) {
                        var dataCon = []; // 剔除 top1 之后的数据，清空
                        $this.geograData.energy = []; //清空能量数据

                        //判断是否含有 top1
                        for (var x in data) {
                            if (x == "top1") {
                                $this.topFlag = true; //判断依据
                            }
                        }

                        //有top1的情况
                        if ($this.topFlag) {
                            var top1 = "" //单独提取出来的 top1
                            var top1Arr = []; //  top1 中心城市的值

                            //将top1提出来单独处理
                            for (var x in data) {
                                if (x != "top1") {
                                    dataCon.push({
                                        name: x,
                                        value: data[x]
                                    });
                                } else {
                                    top1 = data[x];
                                }
                            }

                            //提取出来的 top1 的数组只有两项，所以添加一项
                            for (var p in top1) {
                                top1[p].push(1); // 潮州市: (3) [116.62, 23.67, 1]---坐标需要
                                top1Arr.push(p); //中心城市---["潮州市"]
                            }


                            //原始数组中删除 top1 数据---坐标项铺垫
                            //把处理后的top1再次放到数据中
                            delete data.top1;
                            for (var k in top1) {
                                data[k] = top1[k]
                            }

                            //设置区域能量项
                            for (var i = 0; i < dataCon.length; i++) {
                                $this.geograData.energy.push([{
                                    name: top1Arr[0]
                                }, {
                                    name: dataCon[i].name,
                                    value: (dataCon[i].value[2]) / 1000
                                }]);
                            }

                            $this.geograData.coord = data; //设置坐标项
                            $this.geograData.rightDate = $this.dateCurrent; //右侧日期选择
                            $this.geograData.centerCity = top1Arr[0]; //中心城市赋值
                            var updata = $this.geograData;
                            bus.$emit("geograAllData", updata);

                        } else {

                            //没有top1的情况
                            //处理第一个数据，把最后一项删除
                            for (var x in data) {
                                dataCon.push({
                                    name: x,
                                    value: data[x]
                                });
                            }

                            //设置区域能量项
                            for (var i = 0; i < dataCon.length; i++) {
                                $this.geograData.energy.push([{
                                    name: "上海"
                                }, {
                                    name: dataCon[i].name,
                                    value: (dataCon[i].value[2]) / 1000
                                }]);
                            }
                            $this.geograData.coord = data; //设置坐标项
                            $this.geograData.rightDate = $this.dateCurrent; //右侧日期选择
                            $this.geograData.centerCity = "上海"; //中心城市赋值
                            var updata = $this.geograData;
                            bus.$emit("geograAllData", updata);
                        }
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },

        //地域列表请求
        geograTable: function() {
            var $this = this;
            $.ajax({
                url: $api.geograAnalyze,
                type: "GET",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    platform: $this.platform,
                    name: "",
                    sortname: $this.selectGeo,
                    sorttype: "desc",
                    page: $this.treaTabData.pageno,
                    type: 2
                },
                success: function(data) {

                    //清空数据
                    $this.treaTabData.thead = [];
                    $this.treaTabData.tbody = [];
                    if (data.count) {

                        //有数据，表格默认显示
                        $this.treaTabData.noDataShow = true;
                        $this.treaTabData.pageShow = true;

                        //处理表头
                        for (var x in data.columns[0]) {
                            if (x != "地域名称") {
                                $this.treaTabData.thead.push(x);
                            }
                        }
                        $this.treaTabData.thead.unshift("地域名称"); //表头第一个字符

                        //处理表格内容
                        for (var j = 0; j < data.columns.length; j++) {
                            $this.treaTabData.tbody.push([
                                data.columns[j]["地域名称"]
                            ]);

                            for (var x in data.columns[j]) {
                                if (x != "地域名称") {
                                    $this.treaTabData.tbody[j].push(data.columns[j][x])
                                }
                            }
                        }

                        // 分页处理
                        $this.treaTabData.count = data.count; //总条数
                        $this.treaTabData.allpage = Math.ceil($this.treaTabData.count / $this.treaTabData.pagesize); //计算总页数

                    } else {

                        //无数据，表格不显示
                        $this.treaTabData.noDataShow = false;
                        $this.treaTabData.pageShow = false;
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        }

    },
    mounted() {
        var $this = this;

        //触发器接收---左侧平台点击切换--为监听做铺垫
        bus.$on("clientPlat", function(updata) {
            $this.clickBtn = false;
            $this.platform = updata.platform;
        });

        //触发器接收----点击右侧黄色按钮带过来的值，
        bus.$on("selectGeo", function(chanPlat) {
            $this.selectGeo = chanPlat.select; //右侧黄色按钮选中内容
            $this.clickBtn = chanPlat.clickBtn; //黄色按钮下方内容是否点击-点击后变为true，
        });

        //触发器接收----宝贝购买明细- 和 地理分析表格  页码
        bus.$on("treaPage", function(pn) {

            //页码赋值，再次请求接口，
            $this.treaTabData.pageno = pn;
            $this.geograTable(); //刷新表格
        })


    }
});