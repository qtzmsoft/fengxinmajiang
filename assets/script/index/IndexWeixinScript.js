var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
        textureURL: {
            default: "",
            url: cc.Texture2D
        },
        button: { default: null, type: cc.Button },
        user_plugin: null,
        wxCode: ""
    },
    onLoad: function () {
        var self = this;
        self.button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.getUserData();
        });
    },

    getUserData: function () {
        var self = this;

        var userdata = cc.sys.localStorage.getItem("userData");
        if (userdata != null) {
            var userdata_json = JSON.parse(userdata);
            if (userdata_json.hasOwnProperty("user_token")) {
                self.gotoPlayScene();
            }
            else {
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                        "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "title", "hahahahha");

                    var anniu = cc.find("Canvas/weixindenglu");
                    anniu.active = false;
                }


                else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("AppController",
                        "callNativeUIWithTitle:andContent:", "cocos2d-js", "yes,you call a Native UI from Reflection");
                    
                    var anniu = cc.find("Canvas/weixindenglu");
                    anniu.active = false;
                }
                else if (cc.sys.os == cc.sys.OS_OSX) {
                    var userdata = "{\"id\":222,\"wx_username\":\"测试OSX\",\"wx_nicheng\":\"测试OSX\",\"onlineflag\":0,\"headimgurl\":\"http://wx.qlogo.cn/mmopen/ajNVdqHZLLB3dQSxGCyEBUlMVVhenvCTiauSU8OwxdobE5ic3cticJmZ93FCXXcibdYc3icpdCyicw4K07JEa9bbQlEg/0\",\"fangka\":666}";
                    cc.sys.localStorage.setItem("userData", userdata);
                    self.gotoPlayScene();
                }
                else {
                    var userdata = "{\"id\":223,\"wx_username\":\"测试WIN\",\"wx_nicheng\":\"测试WIN\",\"onlineflag\":0,\"headimgurl\":\"http://wx.qlogo.cn/mmopen/ajNVdqHZLLB3dQSxGCyEBUlMVVhenvCTiauSU8OwxdobE5ic3cticJmZ93FCXXcibdYc3icpdCyicw4K07JEa9bbQlEg/0\",\"fangka\":666}";
                    cc.sys.localStorage.setItem("userData", userdata);
                    self.gotoPlayScene();
                }
            }
        }
        else{
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                        "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "title", "hahahahha");
                    var anniu = cc.find("Canvas/weixindenglu");
                    anniu.active = false;
                }
                else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("AppController",
                        "callNativeUIWithTitle:andContent:", "cocos2d-js", "yes,you call a Native UI from Reflection");
                    var anniu = cc.find("Canvas/weixindenglu");
                    anniu.active = false;
                }
                else if (cc.sys.os == cc.sys.OS_OSX) {
                    var userdata = "{\"id\":222,\"wx_username\":\"测试OSX\",\"wx_nicheng\":\"测试OSX\",\"onlineflag\":0,\"headimgurl\":\"http://wx.qlogo.cn/mmopen/ajNVdqHZLLB3dQSxGCyEBUlMVVhenvCTiauSU8OwxdobE5ic3cticJmZ93FCXXcibdYc3icpdCyicw4K07JEa9bbQlEg/0\",\"fangka\":666}";
                    cc.sys.localStorage.setItem("userData", userdata);
                    self.gotoPlayScene();
                }
                else {
                    var userdata = "{\"id\":223,\"wx_username\":\"测试WIN\",\"wx_nicheng\":\"测试WIN\",\"onlineflag\":0,\"headimgurl\":\"http://wx.qlogo.cn/mmopen/ajNVdqHZLLB3dQSxGCyEBUlMVVhenvCTiauSU8OwxdobE5ic3cticJmZ93FCXXcibdYc3icpdCyicw4K07JEa9bbQlEg/0\",\"fangka\":666}";
                    cc.sys.localStorage.setItem("userData", userdata);
                    self.gotoPlayScene();
                }
        }
    },

    onActionResult: function (code, msg) {
        switch (code) {
            case anysdk.UserActionResultCode.kInitSuccess:
                this.user_plugin.login();
                break;
            case anysdk.UserActionResultCode.kLoginSuccess:
                var uid = this.user_plugin.getUserID();
                var info = JSON.parse(this.user_plugin.getUserInfo().toString());
                break;
            case anysdk.UserActionResultCode.kLoginNetworkError:
            case anysdk.UserActionResultCode.kLoginCancel:
            case anysdk.UserActionResultCode.kLoginFail:
                break;
        }
    },

    regiterUserData: function () {
        var self = this;

        var userdata = cc.sys.localStorage.getItem("userData");
        
        var xt_username = "";
        if (userdata == null) {
            var ud = {};
            ud.wx_username = "wx_username";
            ud.wx_nicheng = "李某喽";

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    var udata = JSON.parse(response);
                    if (udata.status == 1) {
                        cc.sys.localStorage.setItem("userData", udata.data);
                        self.gotoPlayScene();
                    }
                }
            };
            xhr.open("GET", com.baseUrl + "/api/register?data=" + JSON.stringify(ud), true);
            xhr.send();
        }
        else {
            self.gotoPlayScene();
        }
    },
    gotoPlayScene: function () {
        cc.audioEngine.uncacheAll();
        cc.find("Canvas/loading").getComponent(cc.Animation).stop();
        cc.director.loadScene('GameSelect');
    }
});
