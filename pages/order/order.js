var base = getApp();
var common=require('../../utils/common.js');
Page({
    data: {
        addr: undefined,
        addresslist: [],
        addrShow: false,
        scrollTop: 100,
        selectedID: -1,
        oinfo: {
            province: "",
            city: "",
            area: "",
            detailAddr: "",
            phone: "",
            name:"",
            remark: "",
            paidPrice: 0,
            plist:undefined
        },
    },

    myaddrChange: function () {//触摸选择地址
        this.setData({ addrShow: true });
    },
    myaddrCancel: function () {//点击地址簿中取消按钮
        this.setData({ addrShow: false });
    },
    closeaddr:function(){//触摸遮罩层关闭地址选项
          this.setData({ addrShow: false });
    },
    toSelect: function (e) {//选中地址
        var _this = this;
        var id = e.currentTarget.dataset.aid;
        _this.setData({ selectedID: id });
        for (var i = 0; i < _this.data.addresslist.length; i++) {
            if (_this.data.addresslist[i].id == id) {
                _this.setData({
                    "oinfo.province": _this.data.addresslist[i].province,
                    "oinfo.city": _this.data.addresslist[i].city,
                    "oinfo.area": _this.data.addresslist[i].area,
                    "oinfo.detailAddr": _this.data.addresslist[i].detailAddr,
                    "oinfo.phone": _this.data.addresslist[i].phone,
                    'oinfo.name':_this.data.addresslist[i].name,
                    "oinfo.address": _this.data.addresslist[i].province + _this.data.addresslist[i].city + _this.data.addresslist[i].area + _this.data.addresslist[i].detailAddr,
                    addrShow: false
                });
                break;
            }
        }
    },
    onLoad: function (e) {
        this.getAddressList();
        var plist = JSON.parse(e.plist);
        this.setData({
            'oinfo.plist':plist
        });
        this.getTotalPrice();
    },
    getAddressList: function () {
        var that = this;
        base.post({},base.path.shop.addr+"getAddr","",function(data){
            if(data.code == 'S0000'){
                var l = data.data || [];
                that.setData({ addresslist: l});
                if(l && l[0]){
                    that.setData({
                        "oinfo.province": l[0].province,
                        "oinfo.city": l[0].city,
                        "oinfo.area": l[0].area,
                        "oinfo.detailAddr": l[0].detailAddr,
                        "oinfo.phone": l[0].phone,
                        "oinfo.name":l[0].name,
                        "oinfo.address": l[0].province + l[0].city + l[0].area + l[0].detailAddr,
                        selectedID:l[0].id
                    });
                }
            }
        });
    },
    onShow: function (e) {

    },

    getTotalPrice: function () {//应付金额
        var _this = this;
        var pl = _this.data.oinfo.plist;
        var alltotal = 0;
        for (var i = 0; i < pl.length; i++) {
            if (!isNaN(pl[i].price)) {
                alltotal += parseFloat(pl[i].price*pl[i].num);
            }
        }
        this.setData({
            "oinfo.paidPrice": alltotal
        });
    },
    valid: function () {
        var _this = this;
        var err = "";
        if (!_this.data.oinfo.address) {
            err = "请选择收货人信息";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
        return true;
    },
    submit: function () {
        var _this = this;
        if (_this.valid()) {      
            base.post({'param':JSON.stringify(_this.data.oinfo)},base.path.shop.order+"create","",function(data){
                if(data.code == 'S0000'){
                    console.info(data.data);
                    //唤起支付
                    // wx.requestPayment(
                    //     {
                    //     'timeStamp': '1490840662',
                    //     'nonceStr': '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
                    //     'package': 'prepay_id=wx2017033010242291fcfe0db70013231072',
                    //     'signType': 'MD5',
                    //     'paySign': '22D9B4E54AB1950F51E0649E8810ACD6',
                    //     'success':function(res){
                    //         console.info(1);
                    //         console.info(res);
                    //     },
                    //     'fail':function(res){
                    //         console.info(2);
                    //         console.info(res);
                    //     },
                    //     'complete':function(res){
                    //         console.info(3);
                    //         console.info(res);
                    //     }
                    //     })
                    wx.showModal({                        
                        content: '微信支付',
                        confirmText:'支付',
                        success (res) {
                          if (res.confirm) {
                            wx.showToast({
                                title: '支付成功',
                                icon: 'success',
                                duration: 2000
                              })
                          } else if (res.cancel) {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'error',
                                duration: 2000
                              })
                          }
                        }
                    })
                    wx.navigateTo({
                        url: '../cart/cart'
                    })
                }else{
                    wx.showToast({
                        title: '系统错误',
                        icon: 'error',
                        duration: 2000
                      })
                }
            })      
        }
    }
})