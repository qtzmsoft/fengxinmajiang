cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        var sysarg = cc.sys.localStorage.getItem("sysarg");
        if(sysarg==null){
            var sysarg_json = {};
            sysarg_json.musicflag = 1;
            sysarg_json.soundflag = 1;
            cc.sys.localStorage.setItem("sysarg", JSON.stringify(sysarg_json));
        }
    }
});
