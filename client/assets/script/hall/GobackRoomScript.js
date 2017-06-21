cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var self = this;
        var udt = cc.sys.localStorage.getItem("userData");
        var userdata = JSON.parse(udt);
        var rnb1 = cc.find("Canvas/gobackroom/OKButton").getComponent(cc.Button);
        rnb1.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            userdata.huifuflag = 1;
            cc.sys.localStorage.setItem("userData",JSON.stringify(userdata));

            cc.find("Canvas/gobackroom").active = false;
            self.gotoPlayScene();
        });

        var rnb2 = cc.find("Canvas/gobackroom/CancleButton").getComponent(cc.Button);
        rnb2.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.find("Canvas/gobackroom").active = false;
            var udt = cc.sys.localStorage.getItem("userData");
            var userdata = JSON.parse(udt);
            userdata.roomid = '';
            cc.sys.localStorage.setItem("userData",JSON.stringify(userdata));
        });

        cc.find("Canvas/gobackroom/RoomRichText").getComponent(cc.RichText).string = "<color=#992e2e><size=40>提示</size></c><br /><color=#992e2e><size=30>是否回到"+userdata.roomid+"房间。</size></c>";
    },
    gotoPlayScene: function () {
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('PlayScene');
    }
});
