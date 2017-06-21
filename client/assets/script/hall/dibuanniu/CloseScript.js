cc.Class({
    extends: cc.Component,

    properties: {
        parentNode:cc.Node
    },
    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_START, function(event){
        });
        rnb.node.on(cc.Node.EventType.TOUCH_END, function(event){
            self.parentNode.active = false;
        });
    }
});
