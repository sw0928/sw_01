/**
 * 2018/01/02
 * 搜索绩效模块
 */

var vm = new Vue({
    el: "#search_perform",
    data: {
        topCurrent: 4,
        sellerid: ""
    },
    created() {
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
    }
})