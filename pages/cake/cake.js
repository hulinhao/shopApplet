var base = getApp();
var jzData = require('../../utils/jzData.js')
Page({
    data: {
        tab:1,
        list: [],
        type:null,
        typeList:[],
        productList:[],
    },
    onLoad: function () {
        var _this = this;
        var that = this;
        base.post({},base.path.shop.cake+"type","...",function(data){
            var type = data.data || [];
            that.setData({
                type: type[0],
                typeList: type.slice(1,type.length),
                tab:type[0].id
            });
        });
    },
    onShow: function (e) {
        var that = this;
        if (base.cake.tab != null) {
            this.setData({ "tab": base.cake.tab });
            base.cake.tab = null;
        }
        that.getCake();
    },
    initData: function () {
        var _this = this;
        base.get({ c: "Product", m: "GetAllProduct", City: "上海" }, function (d) {
            var data = d.data;
            if (data.Status == "ok") {
                base.cake.setCache(data.Tag);
                _this.setlist(data.Tag);
            }
        })

    },
    setlist: function (dic) {
        var _list = [];
        for (var i in dic) {
            _list.push({
                name: i,
                price: dic[i].CakeType[0].CurrentPrice + ".00",
                des: dic[i].Means,
                //imgUrl: base.path.res + "images/ksk/mlist/item/" + i + ".jpg"
                imgUrl: base.path.res + "/images-2/index-3/jdcake/w_240/" + encodeURI(i) + ".png"
            })
        }
        this.setData({ "list": _list });
    },
    ing: function (e) {
        var price = e.currentTarget.dataset.price;
        base.modal({
            title: '是否需要购买优惠券？',
            showCancel: true,
            confirmText: "去购买",
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: "../buy/buy?type=1&price=" + price
                    })
                }
            }
        })
    },
    changeTab: function (e) {
        var d = e.currentTarget.dataset.index;
        this.setData({ tab: d });
        this.getCake();
    },
    getCake:function(){
        var that = this;
        base.post({"typeId":that.data.tab},base.path.shop.cake+"product","...",function(data){
            var p = data.data || [];
            that.setData({ productList: p });
        });
    },
    goDetail: function (e) {
        var pNo = e.currentTarget.dataset.pno;
        var pId = e.currentTarget.dataset.pid;
        if (pId) {
            wx.navigateTo({
                url: '../cakeDetail/cakeDetail?pNo=' + pNo + "&pId=" + pId
            })
        }
    }
});