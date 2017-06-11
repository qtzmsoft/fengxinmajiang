var com = require("CommonData");
cc.Class({
    extends: cc.Component,

    properties: {
        voiceImMgr: null,
        loginFlag: 0,
        voiceArray:[],
        remoteVoiceFlag:1,
        recordFlag: 0
    },
    onLoad: function () {
        var userdata = cc.sys.localStorage.getItem("userData");
        var userdata_json = JSON.parse(userdata);
        var self = this;
        if (cc.sys.isMobile) {
            var imMgr = new IMDispatchMsgNode();
            imMgr.initSDK(1001551, 20);
            imMgr.cpLogin(userdata_json.wx_username, "fxmj" + userdata_json.id.toString());
            self.voiceImMgr = imMgr;
        }
        cc.find('Canvas/VoiceNode/voiceSpeekButton').getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (cc.sys.isMobile) {
                this.recordFlag = 1;
                imMgr.startRecord();
                cc.find('Canvas/VoiceSprite').getComponent(cc.Animation).play('voice_record');
            }
            else{
                cc.find('Canvas/VoiceSprite').getComponent(cc.Animation).play('voice_record');
            }
        });
        cc.find('Canvas/VoiceNode/voiceSpeekButton').getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (cc.sys.isMobile) {
                imMgr.stopRecord();
                cc.find('Canvas/VoiceSprite').getComponent(cc.Animation).setCurrentTime(1.32,'voice_record');
                cc.find('Canvas/VoiceSprite').getComponent(cc.Animation).stop('voice_record');
            }
            else{
                cc.find('Canvas/VoiceSprite').getComponent(cc.Animation).setCurrentTime(1.32,'voice_record');
                cc.find('Canvas/VoiceSprite').getComponent(cc.Animation).stop('voice_record');
            }
        });

        if (cc.sys.isMobile) {
            self.schedule(self.scheduleCallback, 10);
        }
    },

    callbackData: function (args) {
        var self = this;
        var userdata = cc.sys.localStorage.getItem("userData");
        var userdata_json = JSON.parse(userdata);

        if (args != null && args != "") {
            var args_json = JSON.parse(args);
            if (args_json.name == 'YVSDK_UPLOAD_COMPLETED'&&self.loginFlag==1) {
                args_json.userdata = userdata_json;
                var arss = JSON.stringify(args_json);
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                        self.recordFlag=0;
                    }
                };
                xhr.open("POST", com.baseUrl + "/api/postvoice", true);
                xhr.send('tel=' + arss);
            }
            if (args_json.name == 'YVSDK_LOGIN_COMPLETED' && args_json.result == 0) {
                self.loginFlag = 1;
            }

            if (args_json.name == 'YVSDK_PLAY_COMPLETED') {
                var userdata = cc.sys.localStorage.getItem("userData");
                var userdata_json = JSON.parse(userdata);
                userdata_json.lastvoicetime = self.voiceArray[0].happentime;
                cc.sys.localStorage.setItem("userData", JSON.stringify(userdata_json));
                self.voiceArray.splice(0,1);
                if(self.voiceArray.length>=1){
                    self.playVoice();
                }
                else{
                    self.remoteVoiceFlag=1;
                }
            }
        }
    },

    initVoice: function () {

    },

    scheduleCallback: function () {
        var self = this;
        if (this.loginFlag == 1&& this.voiceArray.length<1&&this.remoteVoiceFlag==1&&this.recordFlag==0) {
            var userdata = cc.sys.localStorage.getItem("userData");
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    var udata = JSON.parse(response);
                    if (udata.status == 1) {
                        var userdata_json = JSON.parse(userdata);
                        if(typeof(userdata_json.lastvoicetime)=="undefined"){
                            userdata_json.lastvoicetime = 0;
                        }

                        if(userdata_json.lastvoicetime<udata.data.lastvoicetime){
                            userdata_json.lastvoicetime=udata.data.lastvoicetime;
                        }

                        cc.sys.localStorage.setItem("userData", JSON.stringify(userdata_json));
                        self.voiceArray=udata.data.voicearray;
                        
                        if(udata.data.voicearray.length>0){
                            self.remoteVoiceFlag=0;
                        }
                        self.playVoice();
                    }
                }
            };
            xhr.open("POST", com.baseUrl + "/api/getvoicelist", true);
            xhr.send('tel=' + userdata);
        }
    },

    playVoice:function(){
        if(this.voiceArray.length>=1){
            this.voiceImMgr.playFromUrl(this.voiceArray[0].url);
        }
    }
});
