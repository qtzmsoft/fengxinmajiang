cc.Class({
    extends: cc.Component,

    properties: {
        my_touch_hand_prefab: {
            default: null,
            type: cc.Prefab
        },
        button: { default: null, type: cc.Button },
        socketobj: null,
        operation_flag: true,
    },
    onLoad: function () {
        var self = this;
        self.button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (cc.find("Canvas").getComponent('MJShowScript').myisdapai) {
                for (var i = 0; i < cc.find("Canvas").getComponent('MJShowScript').paiqiang.length; i++) {
                    var pqobj = cc.find("Canvas").getComponent('MJShowScript').paiqiang[i].getComponent('MyHandMJScript');
                    if ((pqobj.uuuid == self.my_touch_hand_prefab.getComponent('MyHandMJScript').uuuid) && (pqobj.flag == 1)) {
                        self.dapai(pqobj.id, self.socketobj);
                    }

                    if ((pqobj.uuuid != self.my_touch_hand_prefab.getComponent('MyHandMJScript').uuuid) && (pqobj.flag == 1)) {
                        pqobj.downCardAction();
                        pqobj.flag = 0;
                    }
                }

                if (self.my_touch_hand_prefab.getComponent('MyHandMJScript').flag == 0) {
                    self.my_touch_hand_prefab.getComponent('MyHandMJScript').upCardAction();
                    self.my_touch_hand_prefab.getComponent('MyHandMJScript').flag = 1;
                }
            }
        });
    },
    dapai: function (id, socketobj) {
        if (this.operation_flag) {
            this.operation_flag = false;
            var userdata = cc.sys.localStorage.getItem("userData");
            var submitdata = {};
            submitdata.paiid = id;
            submitdata.userdata = JSON.parse(userdata);
            socketobj.emit('server_chupai', JSON.stringify(submitdata));
        }
    }
});
