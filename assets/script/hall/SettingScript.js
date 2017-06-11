cc.Class({
    extends: cc.Component,

    properties: {
        sysarg_json: null,
        scoreAudio_back: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad: function () {
        var self = this;

        self.sysarg_json = {};
        self.sysarg_json = JSON.parse(cc.sys.localStorage.getItem("sysarg"));

        var realUrl1 = cc.url.raw("resources/raw/image/selected.png");
        var texture1 = cc.textureCache.addImage(realUrl1);
        var spr1 = new cc.SpriteFrame(texture1);

        var realUrl2 = cc.url.raw("resources/raw/image/unselected.png");
        var texture2 = cc.textureCache.addImage(realUrl2);
        var spr2 = new cc.SpriteFrame(texture2);

        var rnb1 = cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button);
        rnb1.node.on(cc.Node.EventType.TOUCH_END, function (event) {

            if (self.sysarg_json.musicflag == 1) {
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Sprite).spriteFrame = spr2;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).normalSprite = spr2;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).pressedSprite = spr2;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).hoverSprite = spr2;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).disabledSprite = spr2;
                self.sysarg_json.musicflag = 0;
            }
            else {
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Sprite).spriteFrame = spr1;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).normalSprite = spr1;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).pressedSprite = spr1;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).hoverSprite = spr1;
                cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).disabledSprite = spr1;
                self.sysarg_json.musicflag = 1;
            }
        });
        var rnb2 = cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button);
        rnb2.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (self.sysarg_json.soundflag == 1) {
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Sprite).spriteFrame = spr2;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).normalSprite = spr2;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).pressedSprite = spr2;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).hoverSprite = spr2;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).disabledSprite = spr2;
                self.sysarg_json.soundflag = 0;
            }
            else {
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Sprite).spriteFrame = spr1;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).normalSprite = spr1;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).pressedSprite = spr1;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).hoverSprite = spr1;
                cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).disabledSprite = spr1;
                self.sysarg_json.soundflag = 1;
            }
        });

        var rnb3 = cc.find("Canvas/SettingNode/quedingButton").getComponent(cc.Button);
        rnb3.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.sys.localStorage.setItem("sysarg", JSON.stringify(self.sysarg_json));
            cc.find("Canvas/SettingNode").active = false;

            if (self.sysarg_json.musicflag == 0) {
                cc.audioEngine.pauseAll();
            }
            else {
                cc.audioEngine.resumeAll();
            }
        });
        var rnb4 = cc.find("Canvas/SettingNode/CloseButton").getComponent(cc.Button);
        rnb4.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.find("Canvas/SettingNode").active = false;
            self.sysarg_json = JSON.parse(cc.sys.localStorage.getItem("sysarg"));
            self.setButtonImage();
        });

        this.setButtonImage();
    },

    setButtonImage:function(){
        var realUrl1 = cc.url.raw("resources/raw/image/selected.png");
        var texture1 = cc.textureCache.addImage(realUrl1);
        var spr1 = new cc.SpriteFrame(texture1);

        var realUrl2 = cc.url.raw("resources/raw/image/unselected.png");
        var texture2 = cc.textureCache.addImage(realUrl2);
        var spr2 = new cc.SpriteFrame(texture2);

        if (this.sysarg_json.musicflag == 0) {
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Sprite).spriteFrame = spr2;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).normalSprite = spr2;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).pressedSprite = spr2;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).hoverSprite = spr2;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).disabledSprite = spr2;
        }
        else {
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Sprite).spriteFrame = spr1;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).normalSprite = spr1;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).pressedSprite = spr1;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).hoverSprite = spr1;
            cc.find("Canvas/SettingNode/MusicButton").getComponent(cc.Button).disabledSprite = spr1;
        }

        if (this.sysarg_json.soundflag == 0) {
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Sprite).spriteFrame = spr2;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).normalSprite = spr2;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).pressedSprite = spr2;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).hoverSprite = spr2;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).disabledSprite = spr2;
        }
        else {
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Sprite).spriteFrame = spr1;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).normalSprite = spr1;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).pressedSprite = spr1;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).hoverSprite = spr1;
            cc.find("Canvas/SettingNode/SoundButton").getComponent(cc.Button).disabledSprite = spr1;
        }
    }
});
