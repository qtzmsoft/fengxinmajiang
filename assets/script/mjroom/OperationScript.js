cc.Class({
    extends: cc.Component,

    properties: {
        button: { default: null, type: cc.Button },
        operation_id: -1,
        socketobj: null,
        paiid: -1,
        lldata: ""
    },
    onLoad: function () {
        var self = this;
        self.button.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        });
        self.button.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        });
        self.button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var zhezhao = cc.find("Canvas/caozuoLayer");
            zhezhao.active = false;

            if (self.operation_id == 0) {
                var operation = {};
                operation.operation_id = self.operation_id;
                operation.paiid = self.paiid;
                var userdata = cc.sys.localStorage.getItem("userData");
                operation.userdata = JSON.parse(userdata);

                var data = JSON.parse(self.lldata);

                operation.chupai_user_id = data.id;

                operation.alldata = data;
                self.socketobj.emit('server_operation_hu', JSON.stringify(operation));
            }

            if (self.operation_id == 1) {
                var operation = {};
                operation.operation_id = self.operation_id;
                operation.paiid = self.paiid;
                var userdata = cc.sys.localStorage.getItem("userData");
                operation.userdata = JSON.parse(userdata);

                var data = JSON.parse(self.lldata);

                operation.chupai_user_id = data.id;

                operation.alldata = data;
                if (operation.userdata.id == operation.alldata.chupai_userid) {
                    self.socketobj.emit('server_operation_own_gang', JSON.stringify(operation));
                }
                else {
                    self.socketobj.emit('server_operation_other_gang', JSON.stringify(operation));
                }
            }


            if (self.operation_id == 2) {
                var operation = {};
                operation.operation_id = self.operation_id;
                operation.paiid = self.paiid;
                var userdata = cc.sys.localStorage.getItem("userData");
                operation.userdata = JSON.parse(userdata);
                var data = JSON.parse(self.lldata);
                operation.chupai_user_id = data.id;
                operation.alldata = data;
                self.socketobj.emit('server_operation_peng', JSON.stringify(operation));
            }

            if (self.operation_id == 3) {
                var operation = {};
                operation.operation_id = self.operation_id;
                operation.paiid = self.paiid;
                var userdata = cc.sys.localStorage.getItem("userData");
                operation.userdata = JSON.parse(userdata);

                var data = JSON.parse(self.lldata);

                operation.chupai_user_id = data.id;

                operation.alldata = data;
                if (operation.alldata.uid == operation.alldata.chupai_userid) {
                    self.socketobj.emit('server_operation_own_guo', JSON.stringify(operation));
                }
                else {
                    self.socketobj.emit('server_operation_other_guo', JSON.stringify(operation));
                }
            }
        });
    }
});
