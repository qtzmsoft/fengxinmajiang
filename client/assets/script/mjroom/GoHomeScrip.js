cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_END, function(event){
            cc.find("Canvas").getComponent('MJShowScript').exitflag = 1;
            cc.find("Canvas/ExitNode").active = true;
        });
    },
    goBackScene:function(){
        cc.audioEngine.uncacheAll();
        cc.director.loadScene('GameSelect');
    }
});
