var com = require('CommonData');
var CommonTool = require("CommonTool");
var ShowRightMajiangScript = cc.Class({
    initMajiang: function (self, data) {
        var showpai = data.right.handpai;
        var commonTool = new CommonTool();

        for (var i = 0; i < showpai.length; i++) {
            var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
            initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                self.myatlas.getSpriteFrame("e_mj_right");

            var mj_p_x = 448;
            var mj_p_y = -128 + 13 * 26 - i * 26;

            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
        }
    },
    grabMajiang: function (self, data) {
        if (data.right.hasOwnProperty("zhuapai")) {
            var showpai = data.right.zhuapai;
            if (showpai != 0) {
                var commonTool = new CommonTool();
                var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
                initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    self.myatlas.getSpriteFrame("e_mj_right");

                var mj_p_x = 448;
                var mj_p_y = -128 + 13 * 26 + 50;

                initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
                cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
            }
        }
    },

    showHitMajiang: function (self, data) {
        var hitpai = data.right.hitpai;
        var commonTool = new CommonTool();

        for (var i = 0; i < hitpai.length; i++) {
            var initUserPhotoPrefab = cc.instantiate(self.my_hand_prefab);
            initUserPhotoPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                self.myatlas.getSpriteFrame(commonTool.getPaiByID(hitpai[i], com.leftpaidata).pictureName);

            var mj_p_x = 367;
            var mj_p_y = 170 - 324 + 12 * 27 - i * 27;

            if (i >= 12) {
                mj_p_x = 320;
                mj_p_y = 170 - 324 + 12 * 27 - (i - 12) * 27;
            }

            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
        }
    },
    pengMajiang: function (self, data) {
        var tmppengpai = data.right.pengpai;
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
                self.myatlas.getSpriteFrame(commonTool.getPaiByID(pengpai[i], com.leftpaidata).pictureName);

            var mj_p_x = 448;
            var mj_p_y = -158 + 3 * 27 - i * 27;

            initUserPhotoPrefab.setPosition(mj_p_x, mj_p_y);
            cc.find("Canvas/MjPaiNode").addChild(initUserPhotoPrefab);
        }
    }


});
module.exports = ShowRightMajiangScript;