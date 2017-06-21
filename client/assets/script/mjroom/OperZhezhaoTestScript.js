cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                    "showShareDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "888888", "hahahahha");
            }
        });
    },
    testHD: function () {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Test", "hello", "(Ljava/lang/String;)V", "this is a message from js");
            var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Test", "sum", "(II)I", 3, 7);
            var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/Test", "sum", "(I)I", 3);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "title", "hahahahha");
        }
    },

    shareInfo: function () {
        var agent = anysdk.agentManager;
        var share_plugin = agent.getSharePlugin();
        share_plugin.setListener(this.onShareResult, this);

        var info = {
            text: "test",
            mediaType: 0,
            shareTo: 0
        };
        share_plugin.share(info);
    },
    onShareResult: function (code, msg) {
        switch (code) {
            case anysdk.ShareResultCode.kShareSuccess:
                break;
            case anysdk.ShareResultCode.kShareFail:
                break;
            case anysdk.ShareResultCode.kShareCancel:
                break;
            case anysdk.ShareResultCode.kShareNetworkError:
                break;
        }
    }
});
