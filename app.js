//app.js
App({
    version: {
        key: "version",
        current: "1.0.0",
        getValue: function () {
            return wx.getStorageSync(this.key);
        }
    },
    token:"",
    userInfo:"",
    path: {
        res: "https://res.bestcake.com/",
        www:"http://localhost:9419/",
        shop:{
            weixin:"http://localhost:8888/appletApi/weixin/",
            index:"http://localhost:8888/appletApi/index/",
            cake:"http://localhost:8888/appletApi/product/",
            user:"http://localhost:8888/appletApi/auth/user/",
            cart:"http://localhost:8888/appletApi/auth/cart/",
            addr:"http://localhost:8888/appletApi/auth/addr/",
            order:"http://localhost:8888/appletApi/auth/order/",
        }
        // shop:{
        //     weixin:"https://173ca97752.51mypc.cn/appletApi/weixin/",
        //     index:"https://173ca97752.51mypc.cn/appletApi/index/",
        //     cake:"http://localhost:8888/appletApi/product/",
        //     user:"https://173ca97752.51mypc.cn/appletApi/auth/user/",
        //     cart:"https://173ca97752.51mypc.cn/appletApi/auth/cart/",
        //     addr:"http://localhost:8888/appletApi/auth/addr/",
        //     order:"http://localhost:8888/appletApi/auth/order/",
        // }
    },
    onLaunch: function () {
        //调用API从本地缓存中获取数据     

    },
    onLoad: function () {

    },
    onShow: function () {
        
    },
    onHide: function () {
        
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null
    },
    current: function () {
        var list = getCurrentPages();
        return list[list.length - 1];
    },
    load: function (p) {
        p = p ? p : {};
        var _obj = {//标准化
            data: {
            },
        };
        var base = { "onLoad": function () { }, "onReady": function () { }, "onShow": function () { }, "onHide": function () { }, "onUnload": function () { } };
        for (var i in base) {
            _obj[i] = (function (etype) {
                var _etype = "_" + etype;
                if (etype in p) {
                    _obj[_etype] = p[i];//重写局部定义
                };
                return function (e) {
                    base[etype]();//执行 global
                    _obj[_etype] && _obj[_etype](e);
                }
            })(i)
        };
        for (var o in p) {
            if (!(o in base)) {
                if (o == "data") {
                    for (var d in p[o]) {
                        _obj.data[d] = p[o][d];
                    }
                } else {
                    _obj[o] = p[o];
                }
            }
        };
        Page(_obj);
    },
    modal: function (p) {
        wx.showModal(p);
    },
    toast: function (p) {
        wx.showToast(p);
    },
    loading: (function () {
        return {
            show: function (p) {
                p = p ? p : {};
                wx.showToast({
                    title: p.title || '加载中',
                    icon: 'loading',
                    duration: p.duration || 10000
                })
            },
            hide: function () {
                wx.hideToast();
            }
        }
    })(),
    checkLogin:function(){
        var _this = this;
        if(_this.token == null || _this.token == '' || _this.token.length == 0){
            wx.navigateTo({
                url: '../phone/phone'
            });
            return false;
        }
        return true;           
    },
    isLogin:function(){
        var _this = this;
        if(_this.token == null || _this.token == '' || _this.token.length == 0){
            return false;
        }
        return true;           
    },
    get: function (par,url,tit,fun) {
        var _this = this;
        var loaded = false;//请求状态
        setTimeout(function () {
            if (!loaded) {
                _this.loading.show({ title: tit });
            }
        }, 300);
        wx.request({
            url: url,
            data: par,
            header: {
                'Content-Type': 'application/json',
                "token":_this.token
            },
            method: "GET",
            success: function (res) {
                fun(res.data);
            },
            fail: function (e) {
                _this.toast({ title: "请求出错！" })
            },
            complete: function () { // 请求完成后最终执行参数
                loaded = true;//完成
                _this.loading.hide();
            }
        })
    },
    post: function (par,url,tit,fun) {
        var _this = this;
        var loaded = false;//请求状态
        setTimeout(function () {
            if (!loaded) {
                _this.loading.show({ title: tit });
            }
        }, 300);
        wx.request({
            url: url,
            data: _this.json2Form(par),
            header: {
                // 'Content-Type': 'application/json'
                "Content-Type": "application/x-www-form-urlencoded",
                "token":_this.token
            },
            method: "POST",
            success: function (res) {
                //判断登录状态
                // console.info(res.data)
                // if(res.data == ''||res.data == undefined || res.data == null){
                //     wx.navigateTo({
                //         url: '../phone/phone'
                //     });
                //     return;
                // }
                fun(res.data);
            },
            fail: function (e) {
                _this.toast({ title: "请求出错！" })
            },
            complete: function () {
                loaded = true;//完成
                _this.loading.hide();
            }
        })
    },
    json2Form: function (json) {
        var str = [];
        for (var p in json) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
        return str.join("&");
    }
});