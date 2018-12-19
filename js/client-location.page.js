/**
 * 刘俊
 * 2017/09/29
 * 客群定位模块实例化
 */

//组件通信
var bus = new Vue();

//整体实例化
var vm = new Vue({
    el: "#clientCont",
    data: {

        //公用数据 
        sellerid: "",
        auction_id: "", // 宝贝 id
        topCurrent: 3, // 导航栏选中项
        current: 0, // 菜单选中项

        platform: 0, // 左侧平台选中项
        dateCurrent: 1, // 右侧时间选中项
        tabCurrent: 0, // 大模块选项卡选中项
        dateSection: '', //时间区间，点击了自定义后，传递过来的开始时间和结束时间，用来监听
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
        }],
        search: {
            moreData: [], // 十组数据
            searchOne: [], // 下方一个展示
        }, // 顶端搜索框数据
        remark: '', // 搜索框双向绑定的值

        //第一模块数据，宝贝来源渠道
        echarts: {
            farData: [], //饼图内侧父集数据
            sonData: [], //饼图外侧子集数据
        },
        target: [], // 指标数据
        tabArr: [], // 选中的指标数组
        tabThName: '', // 表头名称 或者 处理后的选中指标名称
        tabSortName: '', // 表头排序名称
        tableDate: {
            columns: [],
            rows: [],
            tName: '', //表格大标题名称
            pageno: 1, //当前页码
            pagesize: 10, //分页大小，每页显示多少条
            count: 0, //总数据量,总数据来源
            allpage: 0, //总页数
            dataShow: true, //表格无数据面板不显示
        }, //表格数据
        downLoadFir: {
            columns: [],
            rows: [],
            tName: '', //表格大标题名称
        }, //表格数据

        //第二模块数据，搜索标题分析
        creKeyWordName: "入店", // 推荐关键词选项卡
        creKeyWord: [], //推荐关键词数据
        tipShow: true, //推荐关键词默认显示，，无数据面板隐藏
        colorFont: [{
            top: "UV",
            bot: "成交金额"
        }, {
            top: "无线端UV",
            bot: "无线端成交金额"
        }, {
            top: "PC端UV",
            bot: "PC端成交金额"
        }], // 彩色字数据

        //第三模块数据，宝贝购买明细
        downLoad: false, //组件复用，宝贝购买明细中表格下载按钮隐藏
        treaTabData: {
            title: "当前宝贝订购列表",
            count: 10,
            thead: [],
            tbody: [],
            pageno: 1, //当前页码
            pagesize: 10, //分页大小，每页显示多少条
            count: 0, //总数据量,总数据来源
            allpage: 0, //总页数
            noDataShow: true, //表格默认显示
        },

        //第四模块，客户访问路径
        pathData: {
            left: [],
            right: []
        }
    },
    created() {
        // var $this = this;

        // //模拟数据
        // setTimeout(() => {
        //     $this.sellerid = 1036319921;
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

        // 头部 ajax 请求

    },
    watch: {

        // 监听 sellerid
        sellerid: function() {
            this.addData();
        },

        //监听模糊查询的参数
        remark: function() {
            this.addData();
        },

        //监听 auction_id ，模糊查询函数执行之后才会有 auction_id
        auction_id: function() {
            this.allData();
        },

        //监听四个大的选项卡按钮
        tabCurrent: function() {
            this.allData();
        },

        //监听左侧平台选择
        platform: function() {
            this.allData();
        },

        //监听右侧日期选择项（未选中自定义项）
        dateCurrent: function() {

            //如果点击了自定义选项
            if (this.dateCurrent == 3) {
                return;
            }
            this.allData();
        },

        //监听时间区间，选中自定义后，手动选择的日期
        dateSection: function() {
            this.allData();
        },

        //搜索标题分析---内部监听事件----推荐关键词按钮点击监听
        creKeyWordName: function() {
            if (!this.tipShow) {
                return
            }
            this.cliReKeyWord(); //搜索标题分析---推荐关键词请求
        }

    },
    methods: {

        // 顶部商品 执行函数
        addData: function() {
            var $this = this;
            if (!$this.sellerid) {
                return;
            }

            // 执行模糊查询函数 , 初始化
            this.clientSearch(this.remark);
        },

        //总执行函数
        allData: function() {
            var $this = this;
            if (!$this.auction_id) {
                return;
            }

            if ($this.tabCurrent == "0") {

                //切换选项，其当前页数统一刷新为第一页
                $this.tableDate.pageno = 1;
                this.sourceScale(); // 宝贝来源渠道---来源统计占比图请求
                this.sourceTarget('2', '1'); //宝贝来源渠道---来源指标请求

            } else if ($this.tabCurrent == "1") {

                //切换选项，其当前页数统一刷新为第一页
                $this.tableDate.pageno = 1;

                //推荐关键词无数据，函数不执行，关联点击切换事件
                this.cliReKeyWord(); //搜索标题分析---推荐关键词请求
                this.sourceTarget('1', '2'); //搜索标题分析---来源指标请求

            } else if ($this.tabCurrent == "2") {

                // //切换选项，其当前页数统一刷新为第一页
                $this.treaTabData.pageno = 1;

                this.cliTreaBuy(); //当前宝贝订购列表

            } else if ($this.tabCurrent == "3") {
                this.cliCustorVis();
            }
        },

        // 模糊查询请求,包含初始化和查询
        clientSearch: function(remark) {
            var $this = this;
            $.ajax({
                url: $api.clientSearch + "?seller_id=" + $this.sellerid + "&remark=" + remark,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    if (data.count) {

                        $this.search.moreData = [];
                        $this.search.searchOne = [];

                        //处理数据并且给 $this.search 分别赋值
                        for (var i = 0; i < data.column.length; i++) {
                            $this.search.moreData.push({
                                authionID: data.column[i]['宝贝ID'],
                                auPic: data.column[i]['宝贝图片'],
                                authionName: data.column[i]['宝贝名字']
                            })
                        }
                        $this.search.searchOne.push($this.search.moreData[0]); // 下方一个展示赋值
                        $this.auction_id = $this.search.searchOne[0].authionID; // auction_id赋值
                    } else {
                        alert("没有数据或传入参数不正确！");
                        return;
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },

        //宝贝来源渠道------第一部分，来源统计占比图请求
        sourceScale: function() {
            var $this = this;
            $.ajax({
                url: $api.clientCome,
                type: "POST",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction: $this.auction_id,
                    platform: $this.platform,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime
                },
                success: function(data) {

                    //清空数据，防止数据叠加
                    $this.echarts.farData = [];
                    $this.echarts.sonData = [];

                    //有数据的情况
                    if (data.count) {
                        var far = [];
                        var son = [];

                        //按照父子集进行拆分
                        for (var i = 0; i < data.column.length; i++) {
                            if (data.column[i].src_parent_name == "") {
                                far.push(data.column[i]);
                            } else {
                                son.push(data.column[i]);
                            }
                        }

                        //父子集统一转化成图表所需的统一格式
                        for (var j = 0; j < far.length; j++) {
                            $this.echarts.farData.push({
                                value: far[j].uv,
                                name: far[j].src_id_name
                            })
                        }

                        for (var k = 0; k < son.length; k++) {
                            $this.echarts.sonData.push({
                                value: son[k].uv,
                                name: son[k].src_parent_name + "-" + son[k].src_id_name
                            })
                        }


                        //因为ajax是异步请求，直接将数据直接传递到模板中
                        var echart = {
                            echarts: $this.echarts, // 传递饼图数据
                            auction_id: $this.auction_id, // 传递商品 id
                            echartShow: false, //无数据面板不显示
                            platform: $this.platform, //传递当前平台选中项
                            timeIndex: $this.dateCurrent, //传递右侧日期选中项
                            dateSection: $this.dateSection // 用来监听的时间区间（选中自定义）
                        }
                        bus.$emit("echart_Data", echart); // 触发器传递数据

                    } else {

                        //无数据的情况
                        var echart = {
                            echartShow: true, //无数据面板不显示
                        }
                        bus.$emit("echart_Data", echart); // 触发器传递数据
                    }
                },
                error: function(xhr) {
                    console.log(xhr)
                }
            });
        },

        //宝贝来源渠道---搜索标题分析--指标公用请求接口
        sourceTarget: function(name, data) {
            var $this = this;
            $.ajax({
                url: $api.clientTarget,
                type: "POST",
                dataType: "json",
                data: {
                    platform: $this.platform,
                    nametype: name, //来源渠道
                    datatype: data, //来源渠道--宝贝
                    flowtype: "1,2,3"
                },
                success: function(data) {

                    //清空数据，防止数据叠加
                    $this.target = []; //全部指标数据
                    $this.tabArr = []; //选中指标数据

                    if (data.count) {

                        // 默认所有指标全部显示, 
                        for (var i = 0; i < data.column.length; i++) {

                            //将汉字字段全部转换成英文,并且添加字段
                            $this.target.push({
                                platform: data.column[i]["平台"],
                                tarCont: data.column[i]["指标"],
                                tarList: data.column[i]["指标分类"],
                                select: false,
                                isShow: true
                            });
                        }

                        //默认选中前五项 ，并且有  成交金额/ UV 的项选中
                        for (var l = 0; l < $this.target.length; l++) {
                            if (l < 5) {
                                $this.target[l].select = true;
                            }
                            if ($this.target[l].tarCont.indexOf("UV") > -1 || $this.target[l].tarCont.indexOf("成交金额") > -1) {
                                $this.target[l].select = true;
                            }
                        }

                        //指标参数--触发器传递
                        var target = $this.target;
                        bus.$emit("gatTarget", target);

                        //下方表格接口请求所需参数处理

                        //所有选中指标
                        for (var k = 0; k < $this.target.length; k++) {
                            if ($this.target[k].select == true) {
                                $this.tabArr.push($this.target[k].tarCont);
                            }
                        }

                        // 下方表格需要传入的参数
                        $this.tabThName = $this.tabArr.join(","); //表头名称和指标名
                        $this.tabSortName = $this.tabArr[0]; // 排序指标参数

                        if (name == "2") { //如果 是来源渠道调用接口，则执行
                            $this.sourceTable(); //刷新表格
                            $this.downLoadcliTab(); //刷新下载表格
                        } else if (name == "1") { //如果是搜索标题分析调用接口
                            $this.cliKeyWordTab(); //刷新关键词表格
                            $this.downloadKeyWord(); //刷新关键词表格下载接口
                            $this.cliSearchTitle($this.colorFont[$this.platform].top); //执行 标题效果分析（彩色关键字）
                            $this.cliSearchTitle($this.colorFont[$this.platform].bot);
                        }

                        // 无数据的情况
                    } else {

                    }

                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },

        //宝贝来源渠道----来源列表表格执行函数
        sourceTable: function() {
            var $this = this;
            $.ajax({
                url: $api.clientTable,
                type: "GET",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction_id: $this.auction_id,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    platform: $this.platform,
                    name: $this.tabThName,
                    sortname: $this.tabSortName,
                    sorttype: "desc",
                    page: $this.tableDate.pageno,
                    src_parent_name: ""
                },
                success: function(data) {

                    // 清空数据，数组要注意 push
                    $this.tableDate.columns = [];
                    $this.tableDate.rows = [];
                    $this.tableDate.tName = "来源列表"; //表格大标题

                    if (data.count && data.count != "0") {

                        //表格无数据面板不显示
                        $this.tableDate.dataShow = true;

                        // 设置表头,将表头数据放入 $this.tableDate
                        for (var x in data.columns[0]) {
                            $this.tableDate.columns.push(x);
                        }

                        // 将表头的最后一项（来源列表）添加到数组的开头，然后删除表头数组的最后一项
                        var last = $this.tableDate.columns[$this.tableDate.columns.length - 1];
                        $this.tableDate.columns.unshift(last);
                        $this.tableDate.columns.pop();

                        //设置表格内容数据,将来源名字提到最前面，最后面的来源名字删除
                        for (var m = 0; m < data.columns.length; m++) {

                            //在表头放入来源名字的值
                            $this.tableDate.rows.push(
                                [data.columns[m]["来源名字"]]
                            );

                            // 将原先的对象变成数组，便于循环
                            for (var x in data.columns[m]) {
                                $this.tableDate.rows[m].push(data.columns[m][x]);
                            }
                        }

                        // 将最后一项的来源名字删除
                        for (var i = 0; i < $this.tableDate.rows.length; i++) {
                            $this.tableDate.rows[i].pop();
                        }

                        // 分页处理
                        $this.tableDate.count = data.count; //总条数
                        $this.tableDate.allpage = Math.ceil($this.tableDate.count / $this.tableDate.pagesize); //计算总页数

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            tableDate: $this.tableDate, //表格数据
                        };
                        bus.$emit("getTable", table);

                        //无数据的情况
                    } else {

                        //表格无数据面板显示
                        $this.tableDate.dataShow = false;

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            tableDate: $this.tableDate, //表格数据
                        };
                        bus.$emit("getTable", table);
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },

        //宝贝来源渠道----来源列表表格下载函数
        downLoadcliTab: function() {
            var $this = this;
            $.ajax({
                url: $api.clientTable,
                type: "GET",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction_id: $this.auction_id,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    platform: $this.platform,
                    name: $this.tabThName,
                    sortname: $this.tabSortName,
                    sorttype: "desc",
                    src_parent_name: ""
                },
                success: function(data) {

                    // 清空数据，数组要注意 push
                    $this.downLoadFir.columns = [];
                    $this.downLoadFir.rows = [];
                    $this.downLoadFir.tName = "来源列表"; //表格大标题

                    if (data.count && data.count != "0") {

                        // 设置表头,将表头数据放入 $this.tableDate
                        for (var x in data.columns[0]) {
                            $this.downLoadFir.columns.push(x);
                        }

                        // 将表头的最后一项（来源列表）添加到数组的开头，然后删除表头数组的最后一项
                        var last = $this.downLoadFir.columns[$this.downLoadFir.columns.length - 1];
                        $this.downLoadFir.columns.unshift(last);
                        $this.downLoadFir.columns.pop();

                        //设置表格内容数据,将来源名字提到最前面，最后面的来源名字删除
                        for (var m = 0; m < data.columns.length; m++) {

                            //在表头放入来源名字的值
                            $this.downLoadFir.rows.push(
                                [data.columns[m]["来源名字"]]
                            );

                            // 将原先的对象变成数组，便于循环
                            for (var x in data.columns[m]) {
                                $this.downLoadFir.rows[m].push(data.columns[m][x]);
                            }
                        }

                        // 将最后一项的来源名字删除
                        for (var i = 0; i < $this.downLoadFir.rows.length; i++) {
                            $this.downLoadFir.rows[i].pop();
                        }

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            downLoadFir: $this.downLoadFir, //表格数据
                        };
                        bus.$emit("getFirDpwn", table);

                        //无数据的情况
                    } else {

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            downLoadFir: $this.downLoadFir, //表格数据
                        };
                        bus.$emit("getFirDpwn", table);
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },

        //搜索标题分析---标题效果分析请求 (彩色关键字)
        cliSearchTitle: function(pos) {
            var $this = this;
            $.ajax({
                url: $api.cliSearchTitle,
                type: "GET",
                dataType: "html",
                data: {
                    // seller_id: "2902647485",
                    // auction_id: "544194960884",
                    // begintime: "20170102",
                    // endtime: "20171018",
                    seller_id: $this.sellerid,
                    auction_id: $this.auction_id,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    platform: $this.platform,
                    name: $this.tabThName,
                    sortname: pos,
                    sorttype: "desc",
                    remark: ""
                },
                success: function(data) {
                    if (data.indexOf("result") == -1) {
                        var colorFont = {
                            data: data,
                            pos: pos
                        };
                        bus.$emit("colorFon", colorFont);
                    } else {

                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },

        //搜索标题分析---推荐关键词请求（十个框框）
        cliReKeyWord: function() {
            var $this = this;
            $.ajax({
                url: $api.cliReKeyWord,
                type: "GET",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction_id: $this.auction_id,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    // seller_id: "743524358",
                    // auction_id: "22349808348",
                    // begintime: "20161228",
                    // endtime: "20170104",
                    name: $this.creKeyWordName,
                },
                success: function(data) {

                    //清空数据
                    $this.creKeyWord = [];

                    if (data.count) {

                        //处理数据
                        for (var i = 0; i < data.column.length; i++) {
                            $this.creKeyWord.push({
                                enter: data.column[i]["入店"],
                                keyWord: data.column[i]["关键词"],
                                bargin: data.column[i]["成交"],
                            });
                        }

                        //有数据的情况，推荐关键词显示，此处用于在有数据时候，重新激活监听事件
                        $this.tipShow = true;

                        //推荐关键词数据----触发器传递到模板中
                        var creKeyWord = {
                            keyWord: $this.creKeyWord,
                            tipShow: $this.tipShow
                        };
                        bus.$emit("creKey", creKeyWord)
                    } else {

                        //无数据的情况，推荐关键词显示，此处用于在无数据时候，阻止监听事件
                        $this.tipShow = false;

                        //推荐关键词数据----触发器传递到模板中
                        var creKeyWord = {
                            keyWord: '',
                            tipShow: $this.tipShow
                        };
                        bus.$emit("creKey", creKeyWord)

                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        },

        //搜索标题分析---关键词列表请求
        cliKeyWordTab: function() {
            var $this = this;
            $.ajax({
                url: $api.cliKeyWordTab,
                type: "GET",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction_id: $this.auction_id,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    platform: $this.platform,
                    name: $this.tabThName,
                    sortname: $this.tabSortName,
                    sorttype: "desc",
                    page: $this.tableDate.pageno,
                },
                success: function(data) {

                    // 清空数据，数组要注意 push
                    $this.tableDate.columns = [];
                    $this.tableDate.rows = [];
                    $this.tableDate.tName = "关键词列表"; //表格大标题

                    if (data.count && data.count != "0") {

                        //表格无数据面板显示
                        $this.tableDate.dataShow = true;

                        // 设置表头 ，抽取关键词，放在第一项
                        for (var x in data.columns[0]) {
                            if (x != "关键词") {
                                $this.tableDate.columns.push(x);
                            }
                        }
                        $this.tableDate.columns.unshift("关键词"); //放在第一项

                        //因为数据顺序不可控，所以将关键词这一项抽出来，放在每个数组的最前面
                        for (var j = 0; j < data.columns.length; j++) {

                            // rows内部放十个数组，关键词项的值放在最前面
                            $this.tableDate.rows.push(
                                [data.columns[j]["关键词"]]
                            );

                            //将其他的值放进来，剔除关键词项的值
                            for (var x in data.columns[j]) {
                                if (x != "关键词") {
                                    $this.tableDate.rows[j].push(data.columns[j][x]);
                                }
                            }
                        }

                        // 分页处理
                        $this.tableDate.count = data.count; //总条数
                        $this.tableDate.allpage = Math.ceil($this.tableDate.count / $this.tableDate.pagesize); //计算总页数

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            tableDate: $this.tableDate, //表格数据
                        };
                        bus.$emit("getTable", table);

                        //无数据的情况
                    } else {

                        //表格无数据面板显示
                        $this.tableDate.dataShow = false;
                        $this.tableDate.count = data.count; //总条数

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            tableDate: $this.tableDate, //表格数据
                        };
                        bus.$emit("getTable", table);
                    }

                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },

        //搜索标题分析---关键词列表下载接口
        downloadKeyWord: function() {
            var $this = this;
            $.ajax({
                url: $api.downLoadKeyWord,
                type: "GET",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction_id: $this.auction_id,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    platform: $this.platform,
                    name: $this.tabThName,
                    sortname: $this.tabSortName,
                    sorttype: "desc",
                },
                success: function(data) {

                    // 清空数据，数组要注意 push
                    $this.downLoadFir.columns = [];
                    $this.downLoadFir.rows = [];
                    $this.downLoadFir.tName = "关键词列表"; //表格大标题
                    if (data.count && data.count != "0") {

                        // 设置表头 ，抽取关键词，放在第一项
                        for (var x in data.column[0]) {
                            if (x != "关键词") {
                                $this.downLoadFir.columns.push(x);
                            }
                        }
                        $this.downLoadFir.columns.unshift("关键词"); //放在第一项

                        //因为数据顺序不可控，所以将关键词这一项抽出来，放在每个数组的最前面
                        for (var j = 0; j < data.column.length; j++) {

                            // rows内部放十个数组，关键词项的值放在最前面
                            $this.downLoadFir.rows.push(
                                [data.column[j]["关键词"]]
                            );

                            //将其他的值放进来，剔除关键词项的值
                            for (var x in data.column[j]) {
                                if (x != "关键词") {
                                    $this.downLoadFir.rows[j].push(data.column[j][x]);
                                }
                            }
                        }

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            downLoadFir: $this.downLoadFir, //表格数据
                        };
                        bus.$emit("getFirDpwn", table);

                    } else {

                        //表格数据-----触发器传递，让模板接收
                        var table = {
                            downLoadFir: $this.downLoadFir, //表格数据
                        };
                        bus.$emit("getFirDpwn", table);
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        },

        //宝贝购买明细----当前宝贝订购列表
        cliTreaBuy: function() {
            var $this = this;
            $.ajax({
                url: $api.clitreaBuy,
                type: "POST",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction: $this.auction_id,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                    page: $this.treaTabData.pageno,
                },
                success: function(data) {
                    // var data = ""; //无数据测试
                    // return;

                    //清空数据
                    $this.treaTabData.tbody = [];
                    $this.treaTabData.thead = [];

                    if (data.count && data.count != "0") {

                        //有数据，表格默认显示
                        $this.treaTabData.noDataShow = true;
                        $this.treaTabData.pageShow = true;

                        //表格内容和表头赋值
                        $this.treaTabData.tbody = data.data.rows;
                        $this.treaTabData.thead = data.data.columns;

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
        },

        //客户访问路径
        cliCustorVis: function() {
            var $this = this;
            $.ajax({
                url: $api.cliCustorVis,
                type: "POST",
                dataType: "json",
                data: {
                    seller_id: $this.sellerid,
                    auction_id: $this.auction_id,
                    platform: $this.platform,
                    begintime: $this.dateData[$this.dateCurrent].begintime,
                    endtime: $this.dateData[$this.dateCurrent].endtime,
                },
                success: function(data) {

                    //清空数据
                    $this.pathData.left = [];
                    $this.pathData.right = [];
                    if (data.count && data.count != "0") {

                        //数组拆分
                        for (var i = 0; i < data.column.length; i++) {
                            if (data.column[i].Status == 1) {
                                $this.pathData.left.push(data.column[i]);
                            } else {
                                $this.pathData.right.push(data.column[i]);
                            }
                        }

                        //塞入到顶部的距离
                        for (var j = 0; j < $this.pathData.left.length; j++) {
                            $this.pathData.left[j].topPos = (j * 80) + "px";
                        }

                        for (var k = 0; k < $this.pathData.right.length; k++) {
                            $this.pathData.right[k].topPos = (k * 80) + "px";
                        }

                        var pathData = $this.pathData;
                        bus.$emit("path", pathData);

                    } else {

                        //无数据的情况
                        var pathData = $this.pathData;
                        bus.$emit("path", pathData);
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

        //接收模糊查询的参数
        bus.$on("searchCon", function(text) {
            $this.remark = text;
        });

        //接收更改的 authion_id，为监听做铺垫
        bus.$on("changeAid", function(l) {
            $this.auction_id = l.authionID;
        });

        //接收点击模块按钮后的索引值, 为监听做铺垫
        bus.$on("tabCut", function(i) {
            $this.tabCurrent = i; // 模块按钮索引--为后期表格分页刷新做铺垫
        });

        // 宝贝来源渠道---点击指标生成列表--接收传过来的参数
        bus.$on("makeTable", function(tabParams) {

            // 下方表格需要传入的参数
            $this.tabThName = tabParams.tableArr.join(","); //表头名称和指标名
            $this.tabSortName = tabParams.tableArr[0]; // 排序指标参数

            //根据点击的按钮判断，刷新对应的表格
            if (tabParams.tName == "来源列表") {
                $this.sourceTable(); //刷新来源列表表格
                $this.downLoadcliTab(); //刷新来源列表下载表格
            } else if (tabParams.tName == "关键词列表") {
                $this.cliKeyWordTab(); //刷新关键词列表表格
                $this.downloadKeyWord(); //刷新关键词下载列表表格
            }
        });

        //搜索标题分析 ----推荐关键词
        bus.$on("lType", function(l) {

            //点击了流量规模 和 成交效能之后，
            //将带过来的 type 值 赋给 creKeyWordName
            $this.creKeyWordName = l.type;
        });

        //触发器接收  ---宝贝来源渠道----搜索标题分析列表页码  
        bus.$on("changepn", function(pn) {

            //页码赋值
            $this.tableDate.pageno = pn;

            //根据不同页码，刷新不同的表格
            if ($this.tabCurrent == "0") {
                $this.sourceTable(); //来源列表表格
            } else if ($this.tabCurrent == "1") {
                $this.cliKeyWordTab(); //关键词列表表格
            }
        });

        //触发器接收----宝贝购买明细- 和 地理分析表格  页码
        bus.$on("treaPage", function(pn) {

            //页码赋值，再次请求接口，
            $this.treaTabData.pageno = pn;
            $this.cliTreaBuy(); //刷新表格
        });

    }
});