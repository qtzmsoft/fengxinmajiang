cc.Class({
    extends: cc.Component,

    properties: {
        number:0
    },
    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_END, function(event){
            var shownumscript = cc.find("Canvas/zhezhao/numnode").getComponent('ShowRoomScript').showNumber(self.number);
        });
    }
});
