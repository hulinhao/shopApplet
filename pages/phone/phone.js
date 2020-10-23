var base = getApp();
var log = require('../../log.js');
Page({
    data: {
        tab: 1,
        btnStatus: true,//倒计时已结束
        sec: 0,
        phone: "",
        phoneOk: false,
        code: "",
        codeOk: false,
        pwd: "",
        canIUse: wx.canIUse('button.open-type.getUserInfo'), //微信更新
    },
    key: "",
    onLoad: function () {
        var _this = this;
    },
    //微信授权的点击事件
    bindGetUserInfo: function (res) {
        var that = this;
        let info = res;
        if (info.detail.userInfo) {
            //后台登录
            that.userLogin();
        } else {
            log.info('拒绝授权')
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '拒绝了授权',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                if (res.confirm) {
                    log.info('用户点击了“返回授权”')
                }
                }
            })
        }
    },
        /**
     * 登录
     */
    userLogin:function(){
        var self = base;
        var that = this;
        //登录样式
        that.setData({
        loading : !that.data.loading
        })
        wx.getSetting({
        success(res){
            if (res.authSetting['scope.userInfo']) {
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    var Params = {
                    code: res.code, //临时登录凭证
                    //明文,加密数据
                    encryptedData: '',
                    //加密算法的初始向量
                    iv:''
                    };
                    if(res.code){
                    //获取用户信息
                    wx.getUserInfo({
                        success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        Params.encryptedData =  res.encryptedData;
                        Params.iv = res.iv;
                        wx.request({
                            url: self.path.shop.weixin + '/decodeUserInfo', //请求后台接口获取openid
                            data:Params,
                            header: {
                            'content-type': 'application/json'
                            },
                            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            success: function(res) {    
                                var result = res.data;                        
                                if(result.status == 1){ //接口请求成功             
                                    var user = result.user;               
                                    log.info('登陆成功：userId:'+ user.id + ";userName:"+user.name);
                                    console.log('登陆成功：userId:'+ user.id + ";userName:"+user.name+";token:"+result.token);
                                    //保存token到全局
                                    self.token = result.token;                       
                                    self.userInfo=result.user;
                                    // 关闭当前页面
                                    wx.navigateBack({})
                                } else {
                                    wx.showToast({
                                    title: '登录失败',
                                    icon: 'none',
                                    duration: 1500
                                    })
                                    log.info('登录失败')
                                }            
                                that.setData({
                                    loading : !that.data.loading
                                })
                            },
                            fail: function () {
                                wx.showToast({
                                title: '系统错误',
                                icon: 'none',
                                duration: 1500
                                })
                                log.info('系统错误！')
                                that.setData({
                                loading : !that.data.loading
                                })
                            }
                        })
                        },
                        fail: function () {
                        log.info('获取用户信息失败')
                        that.setData({
                            loading : !that.data.loading
                        })
                        }
                    })
                    } else {
                    log.info('获取用户登录态失败！' + r.errMsg)
                    that.setData({
                        loading : !that.data.loading
                    })
                    }
                },
                fail: function () {
                    log.info('wx授权登录失败')
                    that.setData({
                    loading : !that.data.loading
                    })
                }
                })
            } else {          
            log.info('获取用户信息失败')
            //console.log('获取用户信息失败')
            }
        }
        })
        
    },
    checkPhone: function (e) {
        var v = e.detail.value;
        if (v && v.length == 11) {
            this.setData({
                phone: v,
                phoneOk: true
            });
        } else {
            this.setData({
                phone: "",
                phoneOk: false
            });

        }
    },
    checkCode: function (e) {
        var v = e.detail.value;
        if (v && v.length > 2) {
            this.setData({
                code: v,
                codeOk: true
            });
        } else {
            this.setData({
                code: "",
                codeOk: false
            });
        }
    },
    sendCode: function () {
        var _this = this;
        // if (this.key) {
        if (this.data.phoneOk) {
            this.setData({
                sec: 90,
                btnStatus: false
            });
            var tm = setInterval(function () {
                if (_this.data.sec > 0) {
                    _this.setData({ sec: _this.data.sec - 1 });
                    if (_this.data.sec == 0) {
                        _this.setData({ btnStatus: true });
                        clearInterval(tm);
                    }
                }
            }, 1000);
            base.get({ m: "SendPhoneCode", c: "User", phone: this.data.phone, ImageCode: this.key }, function (res) {
                var data = res.data;
                if (data.Status == "ok") {
                    base.toast({ tilte: "已发送", icon: "success", duration: 2000 });
                }
            })
        }
        //  }
    },
    changeTab: function (e) {
        var d = e.currentTarget.dataset.index;
        this.setData({ tab: d });
    },
    changepwd: function (e) {
        this.setData({
            pwd: e.detail.value
        });
    },
    login: function () {
        //   if (this.key) {
        var flag = true;
        var err = "";
        if (this.data.phoneOk) {
            if (this.data.tab == 1) {
                if (!this.data.pwd) {
                    flag = false;
                    err = "请输入密码！";
                }
            }
            else {
                if (!this.data.code) {
                    flag = false;
                    err = "请输入手机验证码";
                }

            }
            if (flag) {
                base.post({ c: "User", m: "Login", phone: this.data.phone, pwd: this.data.pwd, code: this.data.code, types: this.data.tab }, function (res) {
                    var dt = res.data;
                    if (dt.Status == "ok") {
                        base.user.userid = dt.Tag.Uid;
                        base.user.sessionid = dt.Tag.SessionId;
                        base.user.jzb = dt.Tag.Money;
                        base.user.exp = dt.Tag.Exp;
                        base.user.phone = dt.Tag.Phone;
                        base.user.levels = dt.Tag.Levels;
                        base.user.headimg = dt.Tag.HeadImgPath;
                        var objuser = {};
                        objuser.userid = dt.Tag.Uid;
                        objuser.sessionid = dt.Tag.SessionId;
                        objuser.jzb = dt.Tag.Money;
                        objuser.exp = dt.Tag.Exp;
                        objuser.phone = dt.Tag.Phone;
                        objuser.levels = dt.Tag.Levels;
                        objuser.headimg = dt.Tag.HeadImgPath;
                        base.user.setCache(objuser);
                        wx.switchTab({
                            url: '../user/user'
                        })
                    } else {
                        base.modal({ title: dt.Msg })
                    }
                })
            } else {
                base.modal({ title: err })
            }
        }
    }

});