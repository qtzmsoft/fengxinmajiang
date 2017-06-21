var com = require('CommonData');
var CommonTool = require("CommonTool");
var ShowMyMajiangScript = cc.Class({
    socketobj:null,
    initMajiang: function (self, data) {

        var showpai = data.my.handpai;
        var commonTool = new CommonTool();

        for (var i = 0; i < showpai.length; i++) {
            var initUserPhotoPrefab = cc.instantiate(self.my_touch_hand_prefab);
            initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                self.myatlas.getSpriteFrame(commonTool.getPaiByID(showpai[i], com.mypaidata).pictureName);
            var mj_p_x = 384 - i * 73;
            var mj_p_y = -280;
            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            initUserPhotoPrefab.getComponent('MyHandMJScript').id = showpai[i];
            initUserPhotoPrefab.getComponent('MyHandMJScript').uuuid = this.uuuid(8,16);
            initUserPhotoPrefab.getChildByName("ClickButton").getComponent('MyMjClickButtonScript').my_touch_hand_prefab = initUserPhotoPrefab;
            initUserPhotoPrefab.getChildByName("ClickButton").getComponent('MyMjClickButtonScript').socketobj = this.socketobj;
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
            cc.find("Canvas").getComponent('MJShowScript').paiqiang.push(initUserPhotoPrefab);
        }
    },

    grabMajiang: function (self, data) {
        if (data.my.hasOwnProperty("zhuapai")) {
            if (data.my.zhuapai != -1) {
                var showpai = data.my.zhuapai;
                var commonTool = new CommonTool();
                var initUserPhotoPrefab = cc.instantiate(self.my_touch_hand_prefab);
                initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    self.myatlas.getSpriteFrame(commonTool.getPaiByID(showpai, com.mypaidata).pictureName);

                var mj_p_x = 384 + 110;
                var mj_p_y = -280;

                initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
                initUserPhotoPrefab.getComponent('MyHandMJScript').id = showpai;
                initUserPhotoPrefab.getComponent('MyHandMJScript').uuuid = this.uuuid(8,16);
                initUserPhotoPrefab.getChildByName("ClickButton").getComponent('MyMjClickButtonScript').my_touch_hand_prefab = initUserPhotoPrefab;
                initUserPhotoPrefab.getChildByName("ClickButton").getComponent('MyMjClickButtonScript').socketobj = this.socketobj;
                cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
                cc.find("Canvas").getComponent('MJShowScript').paiqiang.push(initUserPhotoPrefab);
            }
        }
    },
    showHitMajiang: function (self, data) {
        var hitpai = data.my.hitpai;
        var commonTool = new CommonTool();

        if (hitpai.length > 12) {
            var houpai = [];
            for (var i = 12; i < hitpai.length; i++) {
                var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
                initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    self.myatlas.getSpriteFrame(commonTool.getPaiByID(hitpai[i], com.bottompaidata).pictureName);
                initUserPhotoPrefab.scale = 0.8;

                var mj_p_x = -233 + (i - 12) * 43;
                var mj_p_y = -120;

                initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
                cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
            }
            for (var i = 0; i < 12; i++) {
                var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
                initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    self.myatlas.getSpriteFrame(commonTool.getPaiByID(hitpai[i], com.bottompaidata).pictureName);
                initUserPhotoPrefab.scale = 0.8;

                var mj_p_x = -233 + i * 43;
                var mj_p_y = -171;

                initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
                cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
            }

        }
        else {
            for (var i = 0; i < hitpai.length; i++) {
                var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
                initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    self.myatlas.getSpriteFrame(commonTool.getPaiByID(hitpai[i], com.bottompaidata).pictureName);
                initUserPhotoPrefab.scale = 0.8;

                var mj_p_x = -233 + i * 43;
                var mj_p_y = -171;

                initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
                cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
            }
        }
    },
    pengMajiang: function (self, data) {
        var tmppengpai = data.my.pengpai;

        var pengpai = [];

        for(var i=0;i<tmppengpai.length;i++){
            for(var j=0;j<tmppengpai[i].pai.length;j++){
                pengpai.push(tmppengpai[i].pai[j]);
            }
        }

        var commonTool = new CommonTool();

        for (var i = 0; i < pengpai.length; i++) {
            var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
            initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                self.myatlas.getSpriteFrame(commonTool.getPaiByID(pengpai[i], com.bottompaidata).pictureName);
            initUserPhotoPrefab.scale = 1.25;

            var mj_p_x = -560 + i * 68;
            var mj_p_y = -280;

            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
        }
    },
    uuuid: function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }
});
module.exports = ShowMyMajiangScript;