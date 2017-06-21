var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
        touxiang_texture: {
            default: null,
            type: cc.Sprite
        }
    },

    onLoad: function () {
        cc.game.addPersistRootNode(this.node);

        
    },
 
    setdata: function (usertoken) {
        var last_user = cc.sys.localStorage.getItem("userData");
        var selff = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    if(last_user==null){
                        udata.userdata.user_token = usertoken;
                        cc.sys.localStorage.setItem("userData", JSON.stringify(udata.userdata));
                    }
                    else{
                        var last_user_json = JSON.parse(cc.sys.localStorage.getItem("userData"));
                        last_user_json.headimgurl = udata.userdata.headimgurl;
                        last_user_json.fangka = udata.userdata.fangka;
                        last_user_json.user_token = usertoken;

                        var uds = JSON.stringify(last_user_json);

                        cc.sys.localStorage.setItem("userData", uds);
                    }
                    
                    selff.gotoSelectScene();
                }
            }
        };
        xhr.open("GET", com.baseUrl + "/getuserinfo?data=" + usertoken, true);
        xhr.send();

    },
    clientJoinRoom: function (numberstr) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            var self = this;
            var udt = cc.sys.localStorage.getItem("userData");
            var userdata = JSON.parse(udt);

            userdata.ownflag = 0;
            userdata.roomid = numberstr;
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    var udata = JSON.parse(response);
                    if (udata.status == 1) {
                        var udt = cc.sys.localStorage.getItem("userData");
                        var userdata1 = JSON.parse(udt);
                        userdata1.position = udata.userdata.position;
                        self.gotoPlayScene(JSON.stringify(userdata1));
                    }
                }
            };
            xhr.open("POST", com.baseUrl + "/api/getintoroom", true);
            xhr.send('tel=' + JSON.stringify(userdata));
        }
    },
    gotoPlayScene: function (userdata1) {
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('PlayScene');
        cc.sys.localStorage.setItem("userData", userdata1);
    },
    gotoSelectScene: function () {
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('GameSelect');
    },
    gotoGameIndex: function () {
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('GameIndex');
    },
    test: function (args) {
    },
    setTouxiang: function (tx) {
        this.touxiang_texture = tx;
    }
});
