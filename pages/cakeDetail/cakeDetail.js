var base = getApp();
var jzData = require('../../utils/jzData.js');
var preview=require('../../utils/preview.js');
Page({
    data: {
        pNo: null,
        pId: null,
        detail:null,
        cartNum: 0,
    },
    onLoad: function (e) {
        var pNo = e.pNo;
        var pId = e.pId;
        this.setData({ pNo: pNo,pId:pId});
        var _this = this;
        this.initCake();
    },
    initCake: function () {
        var that = this;
        base.post({"pId":that.data.pId},base.path.shop.cake+"detail","...",function(data){
            var p = data.data || [];
            that.setData({ detail: p });
            wx.setNavigationBarTitle({ title: p.name });
            console.log(JSON.stringify(p));
        });
    },
    onShow: function (e) {
        this.setData({ cartNum: base.cart.getNum() });
    },
    previewImg: function (e) {
        preview.show(this.data.name,this.data.brand,e.currentTarget.dataset.index)
    },
    changeCurrent: function (e) {
        var s = e.currentTarget.dataset.size;
        var p = e.currentTarget.dataset.price;
        var sno = e.currentTarget.dataset.supplyno;
        if (s && p && this.data.current.size != s) {
            this.setData({ "current.size": s, "current.price": p, "current.supplyno": sno })
        }
    },
    addCart: function () {
        var _this = this;
        if (base.cart.add({
            supplyno: this.data.current.supplyno,
            name: this.data.name,
            size: this.data.current.size,
            price: this.data.current.price,
            num: this.data.num,
            brand:this.data.brand
        })) {
            this.setData({ cartNum: base.cart.getNum() })
            base.modal({
                title: '加入成功！',
                content: "跳转到购物车或留在当前页",
                showCancel: true,
                cancelText: "留在此页",
                confirmText: "去购物车",
                success: function (res) {
                    if (res.confirm) {
                        _this.goc();
                    }
                }
            })
            // base.toast({
            //     title: '加入成功',
            //     icon: 'success',
            //     duration: 1500
            // })
        }
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
    },
    _go: function () {
        var _this = this;
        wx.navigateTo({
            url: "../buy/buy?type="+_this.data.brand+"&price=" + _this.data.current.price
        })
    }
});