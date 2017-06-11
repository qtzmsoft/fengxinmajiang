cc.Class({
    extends: cc.Component,

    properties: {
        scoreAudio_back: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio1: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio2: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio3: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio4: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio5: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio6: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio7: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio8: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio9: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio11: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio12: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio13: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio14: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio15: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio16: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio17: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio18: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio19: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio21: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio22: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio23: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio24: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio25: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio26: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio27: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio28: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio29: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio31: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio32: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio33: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio34: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio35: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio36: {
            default: null,
            url: cc.AudioClip
        },
        scoreAudio37: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad: function () {
        var sysarg_json = JSON.parse(cc.sys.localStorage.getItem("sysarg"));
        if(sysarg_json.musicflag==1){
            cc.audioEngine.playEffect(this.scoreAudio_back, true);
        }
    },

    playMusic: function(sid){
        var sysarg_json = JSON.parse(cc.sys.localStorage.getItem("sysarg"));
        if(sysarg_json.soundflag!=1){
            return;
        }
        var id = parseInt(sid);

        switch(id){
            case 1:
                cc.audioEngine.playEffect(this.scoreAudio1, false);
                break;
            case 2:
                cc.audioEngine.playEffect(this.scoreAudio2, false);
                break;
            case 3:
                cc.audioEngine.playEffect(this.scoreAudio3, false);
                break;
            case 4:
                cc.audioEngine.playEffect(this.scoreAudio4, false);
                break;
            case 5:
                cc.audioEngine.playEffect(this.scoreAudio5, false);
                break;
            case 6:
                cc.audioEngine.playEffect(this.scoreAudio6, false);
                break;
            case 7:
                cc.audioEngine.playEffect(this.scoreAudio7, false);
                break;
            case 8:
                cc.audioEngine.playEffect(this.scoreAudio8, false);
                break;
            case 9:
                cc.audioEngine.playEffect(this.scoreAudio9, false);
                break;
            case 11:
                cc.audioEngine.playEffect(this.scoreAudio11, false);
                break;
            case 12:
                cc.audioEngine.playEffect(this.scoreAudio12, false);
                break;
            case 13:
                cc.audioEngine.playEffect(this.scoreAudio13, false);
                break;
            case 14:
                cc.audioEngine.playEffect(this.scoreAudio14, false);
                break;
            case 15:
                cc.audioEngine.playEffect(this.scoreAudio15, false);
                break;
            case 16:
                cc.audioEngine.playEffect(this.scoreAudio16, false);
                break;
            case 17:
                cc.audioEngine.playEffect(this.scoreAudio17, false);
                break;
            case 18:
                cc.audioEngine.playEffect(this.scoreAudio18, false);
                break;
            case 19:
                cc.audioEngine.playEffect(this.scoreAudio19, false);
                break;
            case 21:
                cc.audioEngine.playEffect(this.scoreAudio21, false);
                break;
            case 22:
                cc.audioEngine.playEffect(this.scoreAudio22, false);
                break;
            case 23:
                cc.audioEngine.playEffect(this.scoreAudio23, false);
                break;
            case 24:
                cc.audioEngine.playEffect(this.scoreAudio24, false);
                break;
            case 25:
                cc.audioEngine.playEffect(this.scoreAudio25, false);
                break;
            case 26:
                cc.audioEngine.playEffect(this.scoreAudio26, false);
                break;
            case 27:
                cc.audioEngine.playEffect(this.scoreAudio27, false);
                break;
            case 28:
                cc.audioEngine.playEffect(this.scoreAudio28, false);
                break;
            case 29:
                cc.audioEngine.playEffect(this.scoreAudio29, false);
                break;
            case 31:
                cc.audioEngine.playEffect(this.scoreAudio31, false);
                break;
            case 32:
                cc.audioEngine.playEffect(this.scoreAudio32, false);
                break;
            case 33:
                cc.audioEngine.playEffect(this.scoreAudio33, false);
                break;
            case 34:
                cc.audioEngine.playEffect(this.scoreAudio34, false);
                break;
            case 35:
                cc.audioEngine.playEffect(this.scoreAudio35, false);
                break;
            case 36:
                cc.audioEngine.playEffect(this.scoreAudio36, false);
                break;
            case 37:
                cc.audioEngine.playEffect(this.scoreAudio37, false);
                break;
        }
    }
});
