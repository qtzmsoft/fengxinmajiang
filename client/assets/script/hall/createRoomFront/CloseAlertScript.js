var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        });
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        });
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.find("Canvas/createRoomTanchu").active = false;
            self.getRoomid();
        });
    },
    getRoomid: function () {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    var udt = cc.sys.localStorage.getItem("userData");
                    var userdata = JSON.parse(udt);
                    userdata.ownflag = 1;
                    userdata.roomid = udata.data;
                    cc.sys.localStorage.setItem("userData", JSON.stringify(userdata));
                    self.getintoRoom();
                }
            }
        };
        xhr.open("GET", com.baseUrl + "/api/getroomid", true);
        xhr.send();
    },

    getintoRoom: function () {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    var udt = cc.sys.localStorage.getItem("userData");
                    var userdata = JSON.parse(udt);
                    userdata.huifuflag = 0;
                    cc.sys.localStorage.setItem("userData", JSON.stringify(userdata));
                    self.gotoPlayScene();
                }
            }
        };

        xhr.open("POST", com.baseUrl + "/api/getintoroom", true);
        xhr.send('tel=' + cc.sys.localStorage.getItem("userData"));
    },

    gotoPlayScene: function () {
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('PlayScene');
    }
});
