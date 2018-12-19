var sellerid = sessionStorage.getItem('sellerId');
//组件通信  测试组件--运营看板--核心预警
var bus1 = new Vue();
//组件通信  核心预警--调整计划表
var bus = new Vue();
 //头部
var hotPlan = new Vue({
    el: "#hotPlan",
    data: {
        topCurrent: 2
    }
})
//左侧菜单组件实例化
var leftMenu = new Vue({
    el: "#leftMenu_Box",
    data:{
        current:1
    }
});
//搜索简报
var shopAnalyze = new Vue({
    el: "#shop_analyze",
    data:{
        sellerid:sellerid
    }
});
//店铺搜索top10
var searchBulletin = new Vue({
  el: "#shop_top_ten",
  data:{
    sellerid:sellerid
  }
});