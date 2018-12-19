//var url1 = "http://mouse.molesoft.cn";
var url1 = "http://localhost:30005/searchmouse-admin";
 //var url1 = "http://192.168.2.104:8080/searchmouse-admin";

var $api = {
    //用户信息ajax
    GetShopInfomation: "http://mouse.molesoft.cn/api.aspx?invokeName=GetShopInfomation",

    //获取店铺ID
    querySeller: url1 + "/shopWarn/querySeller",

    //获取SP数据
    SPTarget: url1 + "/spmag/callSp",

    //获取表单数据
    findTarget: url1 + "/spmag/callSp",


    //获取SP数据
    OperatingKanban: url1 + "/shopWarn/SP_OutPutTarget",

    //获取表单数据
    // findTarget: url1 + "/shopWarn/SP_OutPutTarget",

    //调整日志
    queryLog: url1 + "/yanShulcsy0/queryLog",

    //获取计划表内容
    plainContent: url1 + "/yanShulcsy/plainContent",

    //获取计划发起人信息
    plainMan: url1 + "/yanShulcsy/plainMan",

    //上传调整日志
    addLog: url1 + "/yanShulcsy0/addLog",

    //当天日志查询
    tSPTargetodayLog: url1 + "/yanShulcsy0/queryCDLog",

    //获取菜单
    getmenus: url1 + "/yanShulcsyData1/getmenus",

    //爆款计划添加单品   服务市场订购
    serverMarket: url1 + "/demo/nums",

    //将选中的商品数带到主页面
    toMainPage: url1 + "/yanShulcsy/addAuction",

    //不可控流量---左侧饼图
    noControlLeft: url1 + "/yanShulcsyData1/bing",

    //不可控流量---右侧柱状图和折线图
    noControlRight: url1 + "/yanShulcsyData1/zhe",

    //不可控流量---指标接口
    noControlIndex: url1 + "/yanShulcsyData1/flowcrud",

    //不可控流量---细分来源接口
    noControlTable: url1 + "/yanShulcsyData1/xftable",

    //不可控流量---细分来源接口
    noContDownLoad: url1 + "/bootdownload/download",

    //流量布局---折线图接口
    flowLayout1: url1 + "/yanShulcsyData1/serven",

    //流量布局---饼图接口
    flowLayout2: url1 + "/yanShulcsyData1/findbing",

    //中间指标接口
    flowLayout3: url1 + "/yanShulcsyData1/servencount",

    //宝贝主表格接口
    flowBabyMTable: url1 + "/yanShulcsyData1/find2",

    //宝贝弹出表格接口
    flowBabySubTab: url1 + "/yanShulcsyData1/find3",

    //宝贝数据透视接口
    flowDataRay: url1 + "/yanShulcsyData1/get1",

    //来源主表接口
    flowComeMTab: url1 + "/yanShulcsyData1/find7",

    //来源下各宝贝情况
    flowComeBaby: url1 + "/yanShulcsyData1/find7",

    //弹出对比搜索
    flowBabySearch: url1 + "/yanShulcsyData1/get2",

    //商品购买明细
    Inforshow: url1 + '/bootPrice1/Inforshow',

    //全店流量构成
    flowshow1: url1 + '/bootPrice1/flowshow1',

    //流量TOP5关键词数据
    flowtopshow1: url1 + '/bootPrice1/flowtopshow1',

    //折线图三个选项
    getmoney1: url1 + '/bootPrice1/getmoney1',

    //搜索指标折线图
    getvolu1: url1 + '/bootPrice1/getvolu1',

    //核心关键词30天数据--表格
    wideshow1: url1 + '/bootPrice1/wideshow1',

    //核心关键词30天数据--右侧饼图
    wipshow1: url1 + '/bootPrice1/wipshow1',

    //搜索指标饼图
    pishow22: url1 + '/bootPrice1/pishow22',

    //搜索指标表格
    prishow: url1 + '/bootPrice1/prishow2',

    //2.0点击活动策划
    actPlan2: url1 + "/yanShulcsyData1/version",

    //客群定位--用户来源界面--模糊查询接口
    clientSearch: url1 + "/bootapi/showBabyRemark",

    //宝贝来源渠道---来源占比接口
    clientCome: url1 + "/bootapi/showBabyProportion",

    //宝贝来源渠道---来源列表指标接口
    clientTarget: url1 + "/bootapi/babySourceIndex",

    //宝贝来源渠道---来源列表表格接口
    clientTable: url1 + "/bootapi/showBabySource",

    //宝贝来源渠道---来源列表表格下载接口
    downLoadcliTab: url1 + "/bootapi/babydownload",

    //搜索标题分析---标题效果分析接口
    cliSearchTitle: url1 + "/bootapi/ItemsTitles",

    //搜索标题分析---推荐关键词接口
    cliReKeyWord: url1 + "/bootapi/keywordRecommend",

    //搜索标题分析---关键词列表接口
    cliKeyWordTab: url1 + "/bootapi/keyWordNew",

    //搜索标题分析---关键词列表下载接口
    downLoadKeyWord: url1 + "/bootapi/keywordDowload",

    //宝贝购买明细---当前宝贝订购列表接口
    clitreaBuy: url1 + "/bootapi/babyInformation",

    //客户访问路径 ---页面路径分析接口
    cliCustorVis: url1 + "/bootapi/auctionUrl",

    //客群定位--地理分析接口
    geograAnalyze: url1 + "/bootapi/trafficMaps",
	
	//分平台流量趋势
	subPlatformTraffic:url1+"/search-admin/flowtrade",
	
	//分平台流量占比
	subPlatformView : url1+"/search-admin/shopViewPro",
	
	//分平台成交占比
	subPlatformTrade : url1+"/search-admin/shopTradePro",
	
	//一键分析
	sp_auction_analyze : url1+"/search-admin/sp_auction_analyze",
	
	//流量质量分析
	trafficQualityAnalysis : url1 +"/search-admin/trafficQualityAnalysis",
	
	//分平台搜索趋势
	sp_shop_platform_search_trend : url1 +"/search-admin/sp_shop_platform_search_trend",
	
	//分平台搜索占比
	sp_shop_view_proportion : url1 +"/search-admin/sp_shop_view_proportion",
	
	sp_shop_trade_proportion : url1+"/search-admin/sp_shop_trade_proportion",
	
	//店平台 top10
	sp_shop_search_top : url1 +"/search-admin/sp_shop_search_top",
	
	//店平台top10 关键字
	store_search_correlation_analysis : url1+"/search-admin/store_search_correlation_analysis",
	
	//宝贝级搜索优化  搜索趋势
	sp_auction_platform_search_trend : url1 +"/search-admin/sp_auction_platform_search_trend",
	
	//宝贝级搜索优化  搜索占比
	sp_auction_search_proportion : url1 +"/search-admin/sp_auction_search_proportion",
	
	//宝贝级搜索优化  成交占比
	sp_auction_trade_proportion : url1 +"/search-admin/sp_auction_trade_proportion",
	
	//标题搜索分析  pc
	sp_auction_pc_title_search : url1 +"/search-admin/sp_auction_pc_title_search",
	
	//标题搜索分析 app
	sp_auction_app_title_search : url1 +"/search-admin/sp_auction_app_title_search",
	
	//宝贝级搜索优化  搜索分析
	sp_auction_search_analyze : url1 +"/search-admin/sp_auction_search_analyze",
	
	//宝贝级搜索优化  关键词分析
	sp_keyword_analyze : url1 + "/search-admin/sp_keyword_analyze",
	
	//宝贝名称
	sp_GetAuction : url1 + "/search-admin/sp_GetAuction",
	
	sp_shop_pc_search_source_name : url1+"/search-admin/sp_shop_pc_search_source_name",
	
	sp_shop_wifi_search_source_name : url1+"/search-admin/sp_shop_wifi_search_source_name",
	
	sellerCount : url1+"/search-admin/sellerCount",
	
	//top10
	
	sp_shop_wifi_top10_keyword : url1+"/search-admin/sp_shop_wifi_top10_keyword",
	
	sp_shop_wifi_top10_auction : url1+"/search-admin/sp_shop_wifi_top10_auction",
	
	sp_shop_pc_top10_keyword : url1 +"/search-admin/sp_shop_pc_top10_keyword",
	
	sp_shop_pc_top10_auction : url1 +"/search-admin/sp_shop_pc_top10_auction",
	
	//关键词分析  pc 成交
	sp_pc_trade_keyword_analyze : url1+"/search-admin/sp_pc_trade_keyword_analyze",
	
	sp_pc_keyword_analyze : url1 +"/search-admin/sp_pc_keyword_analyze",
	
	sp_wifi_trade_keyword_analyze : url1+"/search-admin/sp_wifi_trade_keyword_analyze",
	
	sp_wifi_keyword_analyze : url1+"/search-admin/sp_wifi_keyword_analyze",
	
	//搜索简报  流量
	sp_search_all : url1+"/search-admin/sp_search_all",
	
	//搜索简报  成交
	sp_shop_trade : url1 +"/search-admin/sp_shop_trade",
	
	//流量质量分析  pc
	sp_shop_source_analyze_pc : url1 +"/search-admin/sp_shop_source_analyze_pc",
	
	//流量质量分析  wifi
	sp_shop_source_analyze_wifi : url1 +"/search-admin/sp_shop_source_analyze_wifi",
	//
	sp_getAuction_1:url1 +"/search-admin/sp_getAuction_1",
	//
	sp_getAuction_1_info:url1 +"/search-admin/sp_getAuction_1_info",
	//
	sp_getAuction_2:url1 +"/search-admin/sp_getAuction_2",
	//
	sp_getIndex_pc:url1 +"/search-admin/sp_getIndex_pc",
	//
	sp_getIndex_wifi:url1 +"/search-admin/sp_getIndex_wifi",
	//
	sp_getIndexByTrade_pc:url1 +"/search-admin/sp_getIndexByTrade_pc",
	//
	sp_getIndexByTrade_wifi:url1 +"/search-admin/sp_getIndexByTrade_wifi",
}


//克隆数据源
function cloneFun(obj) {
    if (!obj || "object" != typeof obj) {
        return null;
    }
    var result = (obj instanceof Array) ? [] : {};
    for (var i in obj) {
        result[i] = ("object" != typeof obj[i]) ? obj[i] : cloneFun(obj[i]);
    }
    return result;
};


//验证是否为空 ，若为空  返回true   反之，返回 false
function isNull(str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

function changeDate(date) {
    if (date == null) {
        return "";
    }
    var ndate = new Date(date);
    var Y = ndate.getFullYear() + "-";
    var M = (ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : ndate.getMonth() + 1) + "-";
    var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate() + " ");
    var h = (ndate.getHours() < 10 ? '0' + (ndate.getHours()) : ndate.getHours()) + ':';
    var m = (ndate.getMinutes() < 10 ? '0' + (ndate.getMinutes()) : ndate.getMinutes());
    var s = (ndate.getSeconds() < 10 ? '0' + (ndate.getSeconds()) : ndate.getSeconds());
    ndate = Y + M + D + h + m; //
    return ndate;
}

//流量入口封装
function activityUV(node) {
    var str;
    if (node.siblings(".checkBox").hasClass("select")) {
        str = node.val()
    } else {
        str = "";
    }
    return str
}


//存储cookie
//如果需要设定自定义过期时间
function setCookie(name, value, time) {
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}
//这是有设定过期时间的使用示例：
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30
//跳转页面


//获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};


//删除cookie
// delCookie("planCookie");
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}


function changeDate2(val) {
    var date = new Date().getTime() - (val * 24 * 60 * 60 * 1000);
    var ndate = new Date(date);
    var Y = ndate.getFullYear();
    var M = ndate.getMonth() + 1 < 10 ? '0' + (ndate.getMonth() + 1) : (ndate.getMonth() + 1) + "";
    var D = (ndate.getDate() < 10 ? '0' + (ndate.getDate()) : ndate.getDate() + "");
    ndate = Y + M + D;
    return ndate;
}

// 导出表格
function inputExcel(id, name) {
    $(id).table2excel({
        exclude: ".noExl", // 不想导出的行加上class='noExl'即可
        name: "Excel Document Name.xls", // excel文档名
        filename: name // excel文件名
    });
}
                               