var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
        numberstr: "",
        my_hand_prefab: {
            default: null,
            type: cc.Prefab
        },
        myatlas: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    onLoad: function () {
        var self = this;
        cc.loader.loadRes("plist/roomnumber", cc.SpriteAtlas,
            function (err, atlas) {
                self.myatlas = atlas;
            });
    },

    showNumber: function (num) {
        if (num == 11 || num == 12) {
            switch (num) {
                case 11:
                    this.numberstr = "";
                    break;
                case 12:
                    this.numberstr = this.numberstr.substring(0, this.numberstr.length - 1);
                    break;
            }
            this.showRoomNumber();
        }
        else {
            if (this.numberstr.length < 6) {
                switch (num) {
                    case 1:
                        this.numberstr = this.numberstr + "1";
                        break;
                    case 2:
                        this.numberstr = this.numberstr + "2";
                        break;
                    case 3:
                        this.numberstr = this.numberstr + "3";
                        break;
                    case 4:
                        this.numberstr = this.numberstr + "4";
                        break;
                    case 5:
                        this.numberstr = this.numberstr + "5";
                        break;
                    case 6:
                        this.numberstr = this.numberstr + "6";
                        break;
                    case 7:
                        this.numberstr = this.numberstr + "7";
                        break;
                    case 8:
                        this.numberstr = this.numberstr + "8";
                        break;
                    case 9:
                        this.numberstr = this.numberstr + "9";
                        break;
                    case 10:
                        this.numberstr = this.numberstr + "0";
                        break;
                }
                this.showRoomNumber();
                if (this.numberstr.length == 6) {
                    this.getRoomUserNumber();
                }
            }
        }
    },
    showRoomNumber: function () {
        var self = this;
        var arraynum = [];
        for (var i = 0; i < this.numberstr.length; i++) {
            arraynum.push(this.numberstr.substring(i, i + 1));
        }

        this.node.removeAllChildren();

        for (var i = 0; i < arraynum.length; i++) {
            cc.find("Canvas/zhezhao/numnode").getComponent('ShowRoomScript').createNewNum(arraynum[i], i);
        }
    },

    createNewNum: function (num, i) {
        var initMyHandPrefab = cc.instantiate(this.my_hand_prefab);
        initMyHandPrefab.getComponent('NumSelfScript').init({
            textSprite: num
        });
        
        var mj_p_x = -260 + i * 105;
        var mj_p_y = 130;

        initMyHandPrefab.setPosition(mj_p_x, mj_p_y);
        cc.find("Canvas/zhezhao/numnode").addChild(initMyHandPrefab);
    },

    getRoomUserNumber: function () {
        var self = this;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    if(parseInt(udata.data)<4){
                        self.clientJoinRoom();
                    }
                }
            }
        };
        xhr.open("POST", com.baseUrl+"/api/getroomusernum", true);
        xhr.send('tel='+self.numberstr);
    },
    
    clientJoinRoom: function () {
        var self = this;
        var udt = cc.sys.localStorage.getItem("userData");
        var userdata = JSON.parse(udt);
        userdata.ownflag = 0;
        userdata.roomid = self.numberstr;
        cc.sys.localStorage.setItem("userData", JSON.stringify(userdata));

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    var udt = cc.sys.localStorage.getItem("userData");
                    var userdata = JSON.parse(udt);
                    userdata.position = udata.userdata.position;
                    userdata.huifuflag = 0;
                    cc.sys.localStorage.setItem("userData",JSON.stringify(userdata));
                    
                    self.gotoPlayScene();
                }
            }
        };
        xhr.open("POST", com.baseUrl+"/api/getintoroom", true);
        xhr.send('tel='+cc.sys.localStorage.getItem("userData"));
    },

    gotoPlayScene: function () {
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('PlayScene');
    }
});
