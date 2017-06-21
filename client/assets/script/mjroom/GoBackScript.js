cc.Class({
    extends: cc.Component,

    properties: {
        socketobj:null,
    },
    onLoad: function () {
        var self = this;
        var rnb = this.getComponent(cc.Button);
        rnb.node.on(cc.Node.EventType.TOUCH_END, function(event){
            self.goBackScene();
        });
    },
    goBackScene:function(){
        cc.find("Canvas/gameend").active = false;
        var userdata = cc.sys.localStorage.getItem("userData");
        var userdata_json = JSON.parse(userdata);
        this.socketobj.emit('start_again',userdata);
    }
});
