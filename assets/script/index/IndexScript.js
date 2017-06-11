var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },
        wxCode:""
    },
    onLoad: function () {
        var flyWinSize = cc.view.getFrameSize();
        com.screenwidth = flyWinSize.width;
        com.screenheight = flyWinSize.height;
        com.zoomrate = flyWinSize.height/640;
        var self = this;

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            self.schedule(self.callback, 1);
        }
    },


    callback:function () {
        this.wxCode = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity",
                "callBackData", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", "title", "hahahahha");
        if (this.wxCode!='') {
            this.unschedule(this.callback);
            cc.find('GlobaNode').getComponent('NodeScript').setdata(this.wxCode);
        }
    },
});
