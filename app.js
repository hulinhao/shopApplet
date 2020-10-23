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
            weixin:"http://localhost:8080/appletApi/weixin/",
            user:"http://localhost:8080/appletApi/user/",
            cart:"http://localhost:8080/appletApi/cart/",
            
        }
    },
    user: {
        islogin: function (tp) {
            var re = false;
            if (this.token != null) {
                re = true;
            } else {
                if (tp == true) {
                    wx.navigateTo({
                        url: '../phone/phone'
                    })
                }
            }
            return re;
        },
        key: "userkey",
        setCache: function (obj) {
            wx.setStorageSync(this.key, obj);
        },
        getCache: function () {
            return wx.getStorageSync(this.key);
        },        
        clear: function () {
            wx.removeStorageSync(this.key);
        }
    },
    city: {

    },
    cart: {
        key: "cart",
        ref: "", // 购物车返回的页面
        add: function (p) {
            var re = false;
            if (p.supplyno && p.price && p.size && p.name && p.num) {
                var dic = wx.getStorageSync(this.key) || {};
                if (p.supplyno in dic) {
                    dic[p.supplyno].num += p.num;
                } else {
                    dic[p.supplyno] = { name: p.name, price: p.price, size: p.size, num: p.num, brand: p.brand }
                }
                wx.setStorageSync(this.key, dic);
                re = true;
            }
            return re;
        },
        exist: function (sno) {
            var re = false;
            var dic = wx.getStorageSync(this.key) || {};
            if (sno in dic) {
                re = true;
            }
            return re;
        },
        remove: function (sno) {
            var dic = wx.getStorageSync(this.key) || {};
            if (sno in dic) {
                delete dic[sno];
                wx.setStorageSync(this.key, dic);
            }
        },
        getNum: function () {
            var n = 0;
            var dic = wx.getStorageSync(this.key) || {}
            for (var i in dic) {
                n += dic[i].num;
            }
            return n;
        },
        num: function (sno, n) {
            var dic = wx.getStorageSync(this.key) || {};
            if (sno in dic) {
                if (n > 0) {
                    dic[sno].num = n;
                } else {
                    delete dic[sno];
                }
                wx.setStorageSync(this.key, dic);
            }
        },
        getList: function () {
            var list = [];
            var dic = wx.getStorageSync(this.key);
            for (var p in dic) {
                list.push({ supplyno: p, name: dic[p].name, price: dic[p].price, size: dic[p].size, num: dic[p].num, brand: dic[p].brand });
            }
            return list;
        },
        clear: function () {
            wx.removeStorageSync(this.key);
        }
    },
    cake: {
        tab: null,
        key: "cake",
        setCache: function (obj) {
            wx.setStorageSync(this.key, obj);
            var vs = getApp().version;
            wx.setStorageSync(vs.key, vs.current);//设置当前版本号
        },
        getCache: function () {
            return wx.getStorageSync(this.key);
        },
        getByName: function (nm) {
            var p = null;
            var dic = wx.getStorageSync(this.key) || {};
            if (nm in dic) {
                p = dic[nm];
            }
            return p;
        }
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
        }           
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