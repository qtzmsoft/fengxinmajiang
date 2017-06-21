var com = require('CommonData');
var CommonTool = require("CommonTool");
cc.Class({
    extends: cc.Component,

    properties: {
        my_hand_prefab: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad: function () {
    },

    showInfo: function (atlas, lldata) {
        var udata = cc.sys.localStorage.getItem("userData");
        var udata_json = JSON.parse(udata);
        var alldata = JSON.parse(lldata);
        var commonTool = new CommonTool();
        var mjNode = cc.find("Canvas/gameend/MJNode");
        mjNode.removeAllChildren();

        for (var i = 0; i < alldata.length; i++) {
            if(alldata[i].id==udata_json.id&&alldata[i].fanshu==-88.88){
                var gep = cc.find("Canvas/gameend/game_end_pic");
                gep.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("GameEnd13");
            }
            if(alldata[i].id==udata_json.id&&alldata[i].fanshu>0){
                var gep = cc.find("Canvas/gameend/game_end_pic");
                gep.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("GameEnd11");
            }
            if(alldata[i].id==udata_json.id&&alldata[i].fanshu<0){
                var gep = cc.find("Canvas/gameend/game_end_pic");
                gep.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame("GameEnd14");
            }

            var mj_p_x = -570;
            var mj_p_y = 0;
            switch (alldata[i].position) {
                case 1:
                    var one_name = cc.find("Canvas/gameend/one_name");
                    one_name.getComponent(cc.Label).string = alldata[i].wx_nicheng;
                    var one_value = cc.find("Canvas/gameend/one_value");
                    one_value.getComponent(cc.Label).string = alldata[i].fanshu;
                    mj_p_y = 180;
                    break;
                case 2:
                    var two_name = cc.find("Canvas/gameend/two_name");
                    two_name.getComponent(cc.Label).string = alldata[i].wx_nicheng;
                    var two_value = cc.find("Canvas/gameend/two_value");
                    two_value.getComponent(cc.Label).string = alldata[i].fanshu;
                    mj_p_y = 48;
                    break;
                case 3:
                    var three_name = cc.find("Canvas/gameend/three_name");
                    three_name.getComponent(cc.Label).string = alldata[i].wx_nicheng;
                    var three_value = cc.find("Canvas/gameend/three_value");
                    three_value.getComponent(cc.Label).string = alldata[i].fanshu;
                    mj_p_y = -90;
                    break;
                case 4:
                    var four_name = cc.find("Canvas/gameend/four_name");
                    four_name.getComponent(cc.Label).string = alldata[i].wx_nicheng;
                    var four_value = cc.find("Canvas/gameend/four_value");
                    four_value.getComponent(cc.Label).string = alldata[i].fanshu;
                    mj_p_y = -226;
                    break;
            }

            for (var j = 0; j < alldata[i].ipai.length; j++) {
                var initMajiangPrefab = cc.instantiate(this.my_hand_prefab);
                initMajiangPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    atlas.getSpriteFrame(commonTool.getPaiByID(alldata[i].ipai[j], com.mypaidata).pictureName);
                mj_p_x = mj_p_x + 52;
                initMajiangPrefab.setPosition(mj_p_x, mj_p_y);
                initMajiangPrefab.setScale(0.7);
                mjNode.addChild(initMajiangPrefab);
            }

            if (alldata[i].hasOwnProperty("zhuapai")) {
                var initMajiangPrefab1 = cc.instantiate(this.my_hand_prefab);
                initMajiangPrefab1.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                    atlas.getSpriteFrame(commonTool.getPaiByID(alldata[i].zhuapai, com.mypaidata).pictureName);

                var mj_p_x_1 = mj_p_x + 105;
                initMajiangPrefab1.setPosition(mj_p_x_1, mj_p_y);
                initMajiangPrefab1.setScale(0.7);
                mjNode.addChild(initMajiangPrefab1);
            }

            mj_p_x = mj_p_x + 156;

            for (var j = 0; j < alldata[i].pengpai.length; j++) {
                for (var k = 0; k < alldata[i].pengpai[j].shiji_pai.length; k++) {
                    var initMajiangPrefab = cc.instantiate(this.my_hand_prefab);
                    initMajiangPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                        atlas.getSpriteFrame(commonTool.getPaiByID(alldata[i].pengpai[j].shiji_pai[k], com.bottompaidata).pictureName);

                    mj_p_x = mj_p_x + 49;
                    initMajiangPrefab.setPosition(mj_p_x, mj_p_y);
                    initMajiangPrefab.setScale(0.9);
                    mjNode.addChild(initMajiangPrefab);
                }
            }
        }
    }
});
