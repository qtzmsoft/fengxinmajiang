var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var musicSound = cc.find("Canvas/MusicNode/musicSound");
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var udata = JSON.parse(response);
                if (udata.status == 1) {
                    musicSound.getComponent(cc.RichText).string=udata.data;
                    musicSound.getComponent(cc.RichText).fontSize = udata.fontsize;
                    musicSound.getComponent(cc.RichText).lineHeight = udata.lineheight;
                }
            }
        };
        xhr.open("POST", com.baseUrl + "/api/getmusicsound", true);
        xhr.send('tel=' + cc.sys.localStorage.getItem("userData"));
    }
});
