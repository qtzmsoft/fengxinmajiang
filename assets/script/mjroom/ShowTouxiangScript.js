var ShowTouxiangScript = cc.Class({
    allTouxiang: function (self) {
        var bs = this;
        cc.loader.load("http://p1.bqimg.com/553780/ac5dd100db43f4f1.png", function (err, texture) {
            bs.showPrefab(texture, -576, -108,self);
        });

        cc.loader.load("http://p1.bqimg.com/553780/81880d7aa5de497e.png", function (err, texture) {
            bs.showPrefab(texture, -512, 128,self);
        });

        cc.loader.load("http://p1.bqimg.com/553780/ac5dd100db43f4f1.png", function (err, texture) {
            bs.showPrefab(texture, 384, 288,self);
        });

        cc.loader.load("http://p1.bqimg.com/553780/81880d7aa5de497e.png", function (err, texture) {
            bs.showPrefab(texture, 576, -72,self);
        });
    },
    showPrefab: function (texture, x, y,self) {
        var spr = new cc.SpriteFrame(texture);
        var initUserPhotoPrefab = cc.instantiate(self.user_photo_prefab);
        initUserPhotoPrefab.getChildByName("Z_nobody").getComponent(cc.Sprite).spriteFrame = spr;
        initUserPhotoPrefab.setPosition(x, y);
        cc.find("Canvas/majiang_table").addChild(initUserPhotoPrefab);
    }
});
module.exports = ShowTouxiangScript;