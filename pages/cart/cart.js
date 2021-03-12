var base = getApp();
var preview=require('../../utils/preview.js');
Page({
    data: {
        plist: [],
        total: 0,
        login:false
    },
    onLoad: function (e) {
        base.checkLogin();
    },
    onShow: function (e) {
        if(!base.isLogin()){
            this.setData({login:false})
        }else{
            this.setData({login:true})
        }
        var that = this;
        base.post({},base.path.shop.cart+"list","加载购物车...",function(data){
            var l = data.data || [];
            for (var i = 0; i < l.length; i++) {
                l[i].index = i;
            }
            that.setData({ plist: l });
            that.changeTotal();
        });

    },
    previewImg: function (e) {
        preview.show(e.currentTarget.dataset.name,e.currentTarget.dataset.brand,e.currentTarget.dataset.index)
    },
    changeTotal: function () {
        var l = this.data.plist;
        var t = 0;
        for (var i = 0; i < l.length; i++) {
            if (!l[i].del) {//排除删除选项
                t += l[i].price * l[i].num;
            }
        }
        this.setData({ total: t });
    },
    changeNum: function (e) {
        var that = this;
        var t = e.currentTarget.dataset.type;
        var index = e.currentTarget.dataset.index;
        var re = this.data.plist[index].num + parseInt(t);
        var cartid = e.currentTarget.dataset.cartid;
        if(re < 1){
            wx.showModal({
                title: '',
                content: '数量不多啦，确认删除？',
                cancelColor:'#ccc',
                confirmColor:'red',
                success (res) {
                  if (res.confirm) {
                    //删除
                    that.del(e);
                  }
                }
              })              
        }else{
            base.post({"id":cartid,"num":re},base.path.shop.cart+"updateCart","",function(data){
                if (data.code === "S0000") {
                    var key = "plist[" + index + "].num";
                    var obj = {}; 
                    obj[key] = re;
                    that.setData(obj);
                    that.changeTotal();
                }
            });       
        }
    },
    del: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var cartid = e.currentTarget.dataset.cartid;
        base.post({"id":cartid},base.path.shop.cart+"delCart","",function(data){
            if (data.code === "S0000") {
                var key1 = "plist[" + index + "].del";
                var obj = {};
                obj[key1] = true;
                that.setData(obj);
                that.changeTotal();
            }
        });        
    },

    clearCart: function () {
        var _this = this;
        if (this.data.total > 0) {
            base.modal({
                title: "确认清空所有商品？", confirmText: "清空", success: function (res) {
                    if (res.confirm) {
                        base.post({},base.path.shop.cart+"clearCart","",function(data){
                            if (data.code === "S0000") {
                                _this.setData({ plist: [], total: 0 });       
                            }
                        });                      
                    }
                }
            })
        }
    },
    goOrder: function () {
        if (this.data.plist.length > 0 && this.data.total > 0) {
            var plist= this.data.plist;
            wx.navigateTo({
                url: '../order/order?plist='+JSON.stringify(plist)
            })
        } else {
            base.modal({
                title: '去添加更多商品吧',
                showCancel: false
            })
        }
    },
    p: {
        currentIndex: -1,
        eventOk: true,
        eventStartOk: true,
        aniOk: true,
        len: 0,//当前位置
        ani: wx.createAnimation(),
        _ani: wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-out'//
        }),
        max: 80,
        size: 40
    },
    moveTo: function (index, x) {
        this.p.eventOk = false;//停止事件
        if (x == 0) {
            this.p.currentIndex = -1;
            if (this.p.len > 0 - this.p.max / 2) {
                if (this.p.len > 0) {
                    this.p.ani.translateX(this.p.size).step({
                        duration: 100,
                        timingFunction: 'ease-out'
                    });

                }
                this.p.ani.translateX(0 - this.p.size).step({
                    duration: 200,
                    timingFunction: 'ease'
                });
            }
        }
        if (x == 0 - this.p.max) {
            this.p.currentIndex = index;
            this.p.ani.translateX(x - this.p.size).step({
                duration: 200,
                timingFunction: 'ease'
            });
        }
        this.p.ani.translateX(x).step({
            duration: 200,
            timingFunction: 'ease-out'
        });
        var obj = {};
        var key = "plist[" + index + "].ani";
        obj[key] = this.p.ani.export();
        this.setData(obj);
    },
    ptouchsatrt: function (e) {
        var index = e.currentTarget.dataset.index;
        if (this.p.currentIndex >= 0) {
            this.moveTo(this.p.currentIndex, 0);
            return;
        }
        if (this.p.eventStartOk) {
            this.p.eventOk = true;
            this.p.len = 0;
            var pt = e.changedTouches[0];
            pt.aaaaaaa = 11111;
            this.p.x = pt.pageX;
            this.p.y = pt.pageY;
            console.log("start")
        }
    },
    ptouchend: function (e) {
        if (this.p.eventOk) {
            var pt = e.changedTouches[0];
            var len = pt.pageX - this.p.x;//预计目标位置
            var ht = pt.pageY - this.p.y;
            if (len != 0 && Math.abs(ht) / Math.abs(len) < 0.3) {//滑动倾斜度限制
                this.p.len = len;
                var index = e.currentTarget.dataset.index;
                if (len > 0 - this.p.max / 2) {
                    this.moveTo(index, 0);
                } else {
                    this.moveTo(index, 0 - this.p.max);
                }
            }
        }
        this.p.eventOk = false;
        this.p.eventStartOk = false;
        var _this = this;
        if (this.p.tm) {
            clearTimeout(this.p.tm);
        }
        this.p.tm = setTimeout(function () {
            _this.p.eventStartOk = true;
        }, 300);
    }
});