cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_START, function(event){
        });
        rnb.node.on(cc.Node.EventType.TOUCH_END, function(event){
            var zhezhao = cc.find("Canvas/zhezhao");
            zhezhao.active = false;
        });
    },

});