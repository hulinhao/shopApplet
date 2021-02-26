//index.js
//获取应用实例
var base = getApp();
Page({
  data: {
    path:base.path.res+"smallexe/index/",
    index: 0,
    product:null,
    types:[],
    imgs:[]
  },
  getData:function(){
    var that = this
    base.post({},base.path.shop.index+"list","加载数据.....",function(data){
      var l = data.data || [];
      var product = l.productVo;
      var imgs = [];
      var i = 0;
      if(product.img != null && product.img.length>0){
        while(imgs.length<6){
          product.img.forEach(img => {
            imgs.push(img);
          });
        }
      }
      imgs = imgs.splice(0,6);
      that.setData({ product: product,types:l.typeList,imgs:imgs });
      wx.stopPullDownRefresh() //停止刷新
    });
  },
  goCake: function (e) {
    var brand = e.currentTarget.dataset.brand;
    if(brand){
      base.cake.tab=brand;
    }
    wx.switchTab({ url: '../cake/cake' });
  },
  goDetail: function (e) {
    var pNo = e.currentTarget.dataset.pno;
    var pId = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../cakeDetail/cakeDetail?pNo=' + pNo+"&pId="+(pId||0)
    })
  },

  //事件处理函数
  bindViewTap: function () {
    var that = this;
    wx.showActionSheet({ //唤起微信选择
      itemList: that.types,
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex+1)
        }else{
          console.log(res)
        }
      }
    })
  },
  onLoad: function (e) {
    this.getData()
  },
  //下拉刷新   
  onPullDownRefresh: function () { 
    this.getData()
  },
})
