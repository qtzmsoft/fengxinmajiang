cc.Class({
    extends: cc.Component,

    properties: {
        roomid:888888
    },
    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                    "showShareDialog", "(Ljava/lang/String;Ljava/lang/String;)V",self.roomid, "hahahahha");
            }
            else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppController",
                    "callNativeShare:andContent:", self.roomid.toString(),self.roomid.toString());
            }
        });
    }
});
