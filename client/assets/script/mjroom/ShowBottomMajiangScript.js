var com = require('CommonData');
var CommonTool = require("CommonTool");
var ShowBottomMajiangScript = cc.Class({
    initMajiang: function (self, data) {
        var showpai = data.bottom.handpai;
        var commonTool = new CommonTool();

        for (var i = 0; i < showpai.length; i++) {
            var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
            initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                self.myatlas.getSpriteFrame("e_mj_up");

            var mj_p_x = -192 + i * 38;
            var mj_p_y = 248;

            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
        }
    },
    grabMajiang: function (self, data) {
        if (data.bottom.hasOwnProperty("zhuapai")) {
            var showpai = data.bottom.zhuapai;
            if (showpai != 0) {
                var commonTool = new CommonTool();
                var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
                initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    self.myatlas.getSpriteFrame("e_mj_up");

                var mj_p_x = -192 - 50;
                var mj_p_y = 248;

                initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
                cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
            }
        }
    },
    showHitMajiang: function (self, data) {
        var hitpai = data.bottom.hitpai;
        var commonTool = new CommonTool();

        for (var i = 0; i < hitpai.length; i++) {
            var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
            initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                self.myatlas.getSpriteFrame(commonTool.getPaiByID(hitpai[i], com.mypaidata).pictureName);
            initUserPhotoPrefab.scale = 0.5;
            initUserPhotoPrefab.rotation = 180;

            var mj_p_x = 210 - i * 37;
            var mj_p_y = 174;

            if (i >= 12) {
                mj_p_x = 210 - (i - 12) * 37;
                mj_p_y = 130;
            }

            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
        }
    },
    pengMajiang: function (self, data) {
        var tmppengpai = data.bottom.pengpai;

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
                self.myatlas.getSpriteFrame(commonTool.getPaiByID(pengpai[i], com.mypaidata).pictureName);
            initUserPhotoPrefab.scale = 0.5;
            initUserPhotoPrefab.rotation = 180;

            var mj_p_x = -192 + 100 + 10 * 38 - i * 37;
            var mj_p_y = 248;

            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
        }
    }


});
module.exports = ShowBottomMajiangScript;