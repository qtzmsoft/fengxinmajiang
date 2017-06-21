var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_START, function(event){
            var seq = cc.sequence(cc.scaleTo(0.1, 0.9));
            this.runAction(seq);
        });
        rnb.node.on(cc.Node.EventType.TOUCH_END, function(event){
            var seq = cc.sequence(cc.scaleTo(0, 1));
            this.runAction(seq);
            self.alertRoomInfo();
        });
        rnb.node.on(cc.Node.EventType.TOUCH_CANCEL, function(event){
            var seq = cc.sequence(cc.scaleTo(0, 1));
            this.runAction(seq);
        });
    },

    alertRoomInfo:function(){
        cc.find("Canvas/createRoomTanchu").active = true;
    }
});
