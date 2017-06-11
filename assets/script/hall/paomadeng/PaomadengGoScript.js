var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {
        var self = this;
        var noticeLable = cc.find("Canvas/back/PaomadengNode/NoticeLabel");
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    noticeLable.getComponent(cc.Label).string=udata.data;
                }
            }
        };
        xhr.open("POST", com.baseUrl + "/api/getpaomadeng", true);
        xhr.send('tel=' + cc.sys.localStorage.getItem("userData"));
    },

    update: function (dt) {
        var noticeLable = cc.find("Canvas/back/PaomadengNode/NoticeLabel");
        if(noticeLable.getPositionX()>-358){
            noticeLable.setPositionX(noticeLable.getPositionX()-1);
        }
        else{
            noticeLable.setPositionX(658);
        }
    },
});
