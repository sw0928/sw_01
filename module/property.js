/**
 * 伟伟
 * 2018/11/21
 * 模快三
 */
function getSid($this) {
  var sellerid = sessionStorage.getItem('sellerId');
  var shopname = sessionStorage.getItem('shopname');
  $(".user-a").html('');
  var datStr =
    '<span>' + shopname + '</span>' +
    '<div class="help-box">' +
    '<div class="help-date" data-start="2013-04-24">' +
    '<div><span></span> 到期 </div><a href="https://fuwu.taobao.com/ser/detail.html?service_code=ts-18350" target="_blank">续费升级</a></div>' +
    '<div class="help-num">021-65400080</div>' +
    '<div class="help-more">' +
    '<a class="help-contact" target="_blank" href="http://www.taobao.com/webww/ww.php?ver=3&amp;touid=%E4%B8%8A%E6%B5%B7%E6%99%8F%E9%BC%A0%3A%E8%8A%92%E6%9E%9C&amp;siteid=cntaobao&amp;status=1&amp;charset=utf-8">技术支持</a>' +
    '<a class="help-explain" href="Help.aspx">使用说明</a>' +
    '</div>' +
    '</div>';
  $(".user-a").html(datStr);

}


/*属性分析*/
Vue.component('v-property-echart', {
  template: `
  <div>
  <img style="width: 100px;float: left;margin: 35px;" src="../img/001.jpg" alt="">
  <select name="" id="select" style="position: absolute;left: 160px;top: 120px;z-index: 99;" v-model="selectedId">
    <option v-for="li in select" :value='li.title'>{{li.title}}</option>
        
      </select>
       <table style="width: 95%;margin: 30px auto;">
       <tbody>
          <tr>
            <th>关键词</th>
            <th>推荐星级</th>
            <th>搜索使用</th>
            <th>其他宝贝</th>
          </tr>
          <tr v-for="(li, index) in allData">
          <td>{{li.title}}</td>
          <td>
          <img src="../img/star_y.png" alt="" v-for='l in li.star'>
          <img src="../img/star_h.png" alt="" v-for='l in 5-li.star'>
          </td>

          <td v-if="li.shi == '1'">
          <img src="../img/dui.png" alt="" >
          </td>
          <td v-else>

          </td>
          <td style="color: #1181e4;" @click="del()">{{li.boby}}</td>
        </tr>
        </tbody>
      </table>
  </div>
  
  `,
  //id
  props: ["sellerid"],
  data: function () {
    return {
      sellerid: '',
      url: $api.SPTarget,
      selectedId: '路径层qwweqw',
      select: [{
        title: "路径层qwweqw",
      }, {
        title: "路径层qweqw",        
      }, {
        title: "路径层qeqweqwweqw",       
      }],
      allData: [{
        title: "路径层qweqweqw",
        star: 3,
        shi: '1',
        boby: '3'
      }, {
        title: "路径层qweqweqw",
        star: 4,
        shi: '1',
        boby: '3'
      }, {
        title: "路径层qweqweqw",
        star: 2,
        shi: '0',
        boby: '3'
      }], //处理后的数据结构
      mapShow: true, //显示无数据图片
    };
  },
  mounted() {
    var $this = this;
    setTimeout(() => {

    }, 100)

  },
  methods: {
    del() {
      bus.$emit("getpc", this.pcFlow);
      $("#slove_fixed_box").show();
      $(".fixed_box").show();
    },

   

  },
  created() {
    var $this = this;

    //接收器，接收上面的两个ID
    bus.$on("getAid", function (updata) { //注意this指向问题
      $this.sellerid = updata.sellerid;
      $this.auctionid = updata.auctionid;

    });



  },
  watch: {
    //事件监听
    analyzeArr: function () {
      var $this = this;

      watchdata(); //开始渲染图表

      //处理两个eChart图表
      function watchdata() {

        // 基于准备好的dom，初始化echarts实例

      }
    },
    selectedId: {
			handler:function() {  
              //这里如果不使用箭头函数，需要注意this的指向
			   var $this = this;
            updata();
            //下拉框改变事件，获取到当前选中的下拉框的  店铺ID 和商品ID
            function updata() {
                //if ($this.t !== 1) { // 如果下拉框改变，则取改变后的  sellerid  和  auctionid
                //    $this.selected.auctionid = $('#select_ted').find("option:selected").attr("auctionid");
                //    $this.selected.sellerid = $('#select_ted').find("option:selected").attr("sellerid");
					
               // }
				
                ++$this.t; // 依赖值改变
                var updata = {
                    auctionid: $this.selectedId,                    
                };
                console.log(updata);
                // 将选中的ID放到触发器的盆子里，下面拿着用
                bus.$emit("getAid", updata);
				
            };
          },
		  deep:true
		}

  },
});

/* 详情 */
Vue.component('v-property-adjust', {
  template: `
  <div>
  <div>
  <div class="fixed_box" style="display: none;"></div>
  <div id="slove_fixed_box" style="display: none;">
    <div class="slove_box_cont">
      <div class="delete_Btn" @click="del()"><img src="../img/删除筛选项 (1).png" alt=""></div>
      <table style="margin-top: 20px;">
        <tbody>
           <tr>
             <th>eqwe</th>
             <th>eqwe</th>
             <th>eqwe</th>
             <th>eqwe</th>
           </tr>
        
         
           <tr>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
           </tr>
           <tr>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
           </tr>
           <tr>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
           </tr>
 
           <tr>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
             <td>wewq</td>
           </tr>
         </tbody>
       </table>
       <div id="page" style="text-align: center;margin: 30px 0"></div>
    </div>
  </div>
</div>
  </div>
  
  `,
  //id
  props: ["sellerid"],
  data: function () {
    return {
      url: $api.SPTarget,
      sellerid: '',
      auctionid: '',
      aa: []
    }
  },
  mounted() {
    var $this = this;
    setTimeout(() => {
      $this.page()
    }, 100)

  },
  methods: {
    page() {
      layui.use(['laypage', 'element',], function () {
        var laypage = layui.laypage //分页           
          , element = layui.element //元素操作
        //自定义样式
        laypage.render({
          elem: 'page'
          , count: 100
          , theme: '#1E9FFF'
        });

      })
    },
    del() {

      $("#slove_fixed_box").hide();
      $(".fixed_box").hide();
    }

  },
  created() {
    var $this = this;

    //接收器，接收上面的两个ID
    bus.$on("getpc", function (data) { //注意this指向问题
      $this.aa = data;
      console.log($this.aa)

    });



  },
  watch: {
    //事件监听


  },
});