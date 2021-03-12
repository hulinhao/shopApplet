var base = getApp();
Page({
    data: {
        loading:false, //登录样式
        userInfo: undefined,
        cb: "15.00", //彩币
        loaded: false,
        exp: 260,  // 经验值
        levels: 3, //等级
        coupon: 5, //优惠券
        headimg: "https://m.bestcake.com/images/icon_user.jpg",
        login:false,
    },

    exist: function () {
        base.user.userid = 0;
        base.user.sessionid = "";
        base.user.clear();     
        wx.redirectTo({
            url: '../phone/phone'
        });
    },
    onReady: function () {
        // 页面渲染完成

    },
    tomyorder: function () {
        wx.navigateTo({
            url: '../user/myorder/myorder'
        })
    },
    tomyaddress: function () {
        wx.navigateTo({
            url: '../user/myaddress/myaddress'
        })
    },
    changeimg: function () {//更改头像
        var _this = this;
        wx.showModal({
            title: '',
            content: '确定要更换头像？',
            success: function (res) {
                if (res.confirm) {
                    _this.up();
                }
            }
        })
    },
    up: function () {
        var _this = this;
        wx.chooseImage({
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: base.path.www+"upload.ashx", //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: function (res) {
                        var data = JSON.parse(res.data);                       
                        data.Tag += '?v='+Math.random();
                        base.user.headimg = data.Tag;
                       //缓存数据更新
                       var objuser = {};
                        objuser.userid = base.user.userid;
                        objuser.sessionid = base.user.sessionid;
                        objuser.jzb = base.user.jzb;
                        objuser.exp = base.user.exp;
                        objuser.phone = base.user.phone;
                        objuser.levels = base.user.levels;
                        objuser.headimg = data.Tag;
                        base.user.setCache(objuser);
                        _this.setData({
                            headimg: data.Tag
                        });
                        if (data.Status == "ok") {
                            base.get({ c: "UserCenter", m: "UpdateMemberHeadImage", imgurl: data.Tag }, function (d) { 
                                var d = d.data;if (d.Status == "ok") {}});
                        }
                        else {
                            wx.showModal({
                                showCancel: false,
                                title: '',
                                content: data.Msg
                            })
                        }
                    },
                    faile: function (res) {
                        var data = JSON.parse(res.data);
                        wx.showModal({
                            showCancel: false,
                            title: '',
                            content: data.Msg
                        })
                    }
                })
            }
        })
    },
    onLoad: function () {
        base.checkLogin();
    },
    onShow:function(){
        if(!base.isLogin()){
            this.setData({login:false})
        }else{
            this.setData({login:true})
        }
        var that = this;
        // 获取用户信息
        that.setData({
            userInfo:base.userInfo
        })
    }
});