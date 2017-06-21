cc.Class({
    extends: cc.Component,

    properties: {
        id:-10,
        uuuid:"",
        flag:0
    },
    onLoad: function () {

    },
    upCardAction:function(){
        var action = cc.moveBy(0.2, 0, 10);
        this.node.runAction(action);
    },

    downCardAction:function(){
        var action = cc.moveBy(0.2, 0, -10);
        this.node.runAction(action);
    }
});
