var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
        textureURL: {
            default: "",
            url: cc.Texture2D
        },
        button : { default: null,  type: cc.Button},
    },

    onLoad: function () {
        var self = this;
        self.button.node.on(cc.Node.EventType.TOUCH_END, function(event){
            self.getUserData();
        });
    },
    getUserData:function(){
        var self = this;

        var userdata = cc.sys.localStorage.getItem("userData");

        var xt_username = "";
        if(userdata==null){
            var ud = {};
            ud.wx_username = "wx_username";
            ud.wx_nicheng = "张某喽";

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    var udata = JSON.parse(response);
                    if(udata.status==1){
                        cc.sys.localStorage.setItem("userData",udata.data);
                        self.gotoPlayScene();
                    }
                }
            };
            xhr.open("GET",com.baseUrl+"/api/register?data="+JSON.stringify(ud), true);
            xhr.send();
        }
        else{
            self.gotoPlayScene();
        }
    },
    gotoPlayScene:function(){
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('GameSelect');
    }
});
