var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
        touxiang_prefab: {
            default: null,
            type: cc.Prefab
        },
        scoreAudio_back: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad: function () {
        cc.audioEngine.playEffect(this.scoreAudio_back, true);
        var self = this;

        var noticeRichText = cc.find("Canvas/notice/richText");
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    noticeRichText.getComponent(cc.RichText).string=udata.data;
                }
            }
        };
        xhr.open("POST", com.baseUrl + "/api/getnotice", true);
        xhr.send('tel=' + cc.sys.localStorage.getItem("userData"));

        var sss = JSON.parse(cc.sys.localStorage.getItem("userData"));
        if(sss.roomid!=""){
            self.judgeRoom();
        }

        var rnb1 = cc.find("Canvas/SettingButton").getComponent(cc.Button);
        rnb1.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.find("Canvas/SettingNode").active = true;
        });

        cc.loader.loadRes("plist/myhandmj", cc.SpriteAtlas,
            function (err, atlas) {
                var userdata = cc.sys.localStorage.getItem("userData");
                var userdata_json = JSON.parse(userdata);
                cc.find("Canvas/NAME").getComponent(cc.Label).string = userdata_json.wx_nicheng;
                cc.find("Canvas/ID").getComponent(cc.Label).string = "ID:" + userdata_json.id;
                cc.find("Canvas/fangka/shuliang").getComponent(cc.Label).string = userdata_json.fangka;

                if (cc.find("GlobaNode").getComponent("NodeScript").touxiang_texture == null) {
                    cc.loader.load({ url: userdata_json.headimgurl, type: 'jpeg' }, cc.SpriteFrame, function (err, texture) {
                        var spr = new cc.SpriteFrame(texture);
                        var initUserPhotoPrefab = cc.instantiate(self.touxiang_prefab);
                        initUserPhotoPrefab.getChildByName("babykylin").getComponent(cc.Sprite).spriteFrame = spr;
                        initUserPhotoPrefab.setPosition(-583, 307);
                        cc.find("Canvas/back").addChild(initUserPhotoPrefab);
                        cc.find("GlobaNode").getComponent("NodeScript").setTouxiang(texture);
                    });
                }
                else {
                    var spr = new cc.SpriteFrame(cc.find("GlobaNode").getComponent("NodeScript").touxiang_texture);
                    var initUserPhotoPrefab = cc.instantiate(self.touxiang_prefab);
                    initUserPhotoPrefab.getChildByName("babykylin").getComponent(cc.Sprite).spriteFrame = spr;
                    initUserPhotoPrefab.setPosition(-583, 307);
                    cc.find("Canvas/renwu").addChild(initUserPhotoPrefab);
                }
            });
    },
    stopMusic: function () {
        cc.audioEngine.uncacheAll();
    },
    judgeRoom: function () {
        var self = this;
        var udt = cc.sys.localStorage.getItem("userData");
        var userdata = JSON.parse(udt);

        if (userdata.roomid != '') {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    var udata = JSON.parse(response);
                    if (udata.status == "1") {
                        cc.find("Canvas/gobackroom").active = true;
                    }
                }
            };
            xhr.open("POST", com.baseUrl + "/api/regetintoroom", true);
            xhr.send('tel=' + cc.sys.localStorage.getItem("userData"));
        }
    },
    gotoPlayScene: function () {
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('PlayScene');
    }
});
