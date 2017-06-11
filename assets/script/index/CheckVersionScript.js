var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {
        var nowdate = this.getNowFormatDate();
        var cpdate = this.comptime(nowdate,com.checkUDate);
        if (!cpdate){
            this.checkUpdate();
        }
        else{
            cc.director.loadScene('GameIndex');
        }
    },
    disappearInfo: function (uds) {
        cc.find("Canvas/checkkuang/info").getComponent(cc.RichText).string = uds.info;
        cc.find("Canvas/checkkuang").active = true;
    },
    gotoGameIndex: function () {
        cc.director.loadScene('GameIndex');
    },
    checkUpdate: function () {
        var self = this;
        var versionInfo = cc.sys.localStorage.getItem("versionInfo");
        if (versionInfo != null) {
            var versionInfo_json = JSON.parse(versionInfo);

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    var udata = JSON.parse(response);
                    if (udata.status == 1) {
                        var uds = udata.infodata;
                        if (versionInfo_json.code < uds.code) {
                            self.disappearInfo(uds);
                        }
                        else {
                            cc.director.loadScene('GameIndex');
                        }
                        cc.sys.localStorage.setItem("versionInfo", JSON.stringify(uds));
                    }
                }
                else {
                    var errorjson = {};
                    errorjson.info = "有错误发生，请与管理员联系";
                    self.disappearInfo(errorjson);
                }
            };
            xhr.open("GET", com.baseUrl + "/getversion?data=" + versionInfo_json.code, true);
            xhr.send();
        }
        else {
            var versionInfo_json = {};
            versionInfo_json.code = 1;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;

                    var udata = JSON.parse(response);
                    if (udata.status == 1) {
                        var uds = udata.infodata;
                        if (versionInfo_json.code < uds.code) {
                            self.disappearInfo(uds);
                        }
                        else {
                            cc.director.loadScene('GameIndex');
                        }
                        cc.sys.localStorage.setItem("versionInfo", JSON.stringify(uds));
                    }
                }
                else {
                    var errorjson = {};
                    errorjson.info = "有错误发生，请与管理员联系";
                    self.disappearInfo(errorjson);
                }
            };
            xhr.open("GET", com.baseUrl + "/getversion?data=" + versionInfo_json.code, true);
            xhr.send();
        }
    },
    comptime: function (a, b) {
        var arr = a.split("-");
        var starttime = new Date(arr[0], arr[1], arr[2]);
        var starttimes = starttime.getTime();

        var arrs = b.split("-");
        var lktime = new Date(arrs[0], arrs[1], arrs[2]);
        var lktimes = lktime.getTime();

        if (starttimes >= lktimes) {
            return false;
        }
        else
            return true;
    },
    getNowFormatDate: function () {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
});
