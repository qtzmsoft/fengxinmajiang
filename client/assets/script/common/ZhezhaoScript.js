cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var self = this;
        self.node.on(cc.Node.EventType.TOUCH_START, function(event){
            event.stopPropagation();
        });
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            event.stopPropagation();
        });
        self.node.on(cc.Node.EventType.TOUCH_END, function(event){
            event.stopPropagation();
        });
    },
});
