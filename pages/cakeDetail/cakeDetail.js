var base = getApp();
var jzData = require('../../utils/jzData.js');
var preview=require('../../utils/preview.js');
Page({
    data: {
        pNo: null,
        pId: null,
        detail:null,
        cartNum: 0,
        selAttr:0,
        num:0,
        btn:{
            disabled:false,
            text:'加入购物车'
        },
    },
    onLoad: function (e) {
        var pNo = e.pNo;
        var pId = e.pId;
        this.setData({ pNo: pNo,pId:pId});
        this.initCake();
    },
    initCake: function () {
        var that = this;
        base.post({"pId":that.data.pId},base.path.shop.cake+"detail","...",function(data){
            var p = data.data || [];
            that.setData({ detail: p,selAttr: p.pattrs[0].id});
            wx.setNavigationBarTitle({ title: p.name });
        });
    },
    onShow: function (e) {
        this.setData({ cartNum: base.cart.getNum() });
    },
    previewImg: function (e) {
        preview.show(this.data.name,this.data.brand,e.currentTarget.dataset.index)
    },
    changeCurrent: function (e) {
        var that = this;
        var s = e.currentTarget.dataset.size;
        var p = e.currentTarget.dataset.price;
        var attid = e.currentTarget.dataset.selattr;
        if (s && p && attid) {
            that.setData({selAttr: attid})
        }
    },
    addCart: function () {
        base.checkLogin();
        var that = this;
        base.post({"pId":that.data.pId,"attrId":that.data.selAttr,"num":that.data.num},base.path.shop.cart+"addCart","",function(data){
            if (data.code === "S0000") {
                that.setData({ cartNum: that.data.cartNum+1});
                that.setData({
                    btn:{
                        disabled:true,
                        text:'已加入购物车'
                    }
                })
            }
        });
    },
    goCart: function () {
        if (!base.cart.exist(this.data.current.supplyno)) {
            base.cart.add({
                supplyno: this.data.current.supplyno,
                name: this.data.name,
                size: this.data.current.size,
                price: this.data.current.price,
                num: this.data.num
            })
        }
        this.goc();
    },
    goc: function () {
        var _this = this;
        base.cart.ref = "../cakeDetail/cakeDetail?pname=" + _this.data.name + "&brand=" + _this.data.brand;
        wx.switchTab({
            url: "../cart/cart"
        })
    }
});