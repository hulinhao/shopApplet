//index.js
//获取应用实例
var base = getApp();
Page({
  data: {
    path:base.path.res+"smallexe/index/",
    motto: '你好、晶彩！',
    userInfo: {},
    array: ['元宵节', '端午节', '中秋节', '春节'],
    index: 0,
    dataList:[],
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    })

    //wx.navigateTo({
    //url: '../socket/socket'
    //})
  },
  onLoad: function () {
    var that = this
    base.post({},base.path.shop.index+"list","加载数据.....",function(data){
      var l = data.data || [];
      that.setData({ dataList: l });
  
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: '晶彩包装（体验版）',
      desc: '',
      path: '/pages/index/index?id=123'
    }
  }
})
