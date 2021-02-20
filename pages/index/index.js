//index.js
//获取应用实例
var base = getApp();
Page({
  data: {
    path:base.path.res+"smallexe/index/",
    index: 0,
    product:null,
    types:[]
  },
  getData:function(){
    var that = this
    base.post({},base.path.shop.index+"list","加载数据.....",function(data){
      var l = data.data || [];
      that.setData({ product: l.productVo,types:l.typeList });
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
    wx.showActionSheet({ //唤起微信选择
      itemList: ['A', 'B', 'C'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex+1)
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
