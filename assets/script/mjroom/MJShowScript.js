var com = require('CommonData');
var CommonTool = require("CommonTool");
var ShowMyMajiangScript = require("ShowMyMajiangScript");
var ShowLeftMajiangScript = require("ShowLeftMajiangScript");
var ShowBottomMajiangScript = require("ShowBottomMajiangScript");
var ShowRightMajiangScript = require("ShowRightMajiangScript");
var ShowTouxiangScript = require("ShowTouxiangScript");
var ShowZhongxinScript = require("ShowZhongxinScript");

cc.Class({
    extends: cc.Component,
    properties: {
        my_touch_hand_prefab: {
            default: null,
            type: cc.Prefab
        },
        my_hand_prefab: {
            default: null,
            type: cc.Prefab
        },
        user_photo_prefab: {
            default: null,
            type: cc.Prefab
        },
        operation_prefab: {
            default: null,
            type: cc.Prefab
        },
        myatlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        ready_button: { default: null, type: cc.Button },
        screenwidth: 0,
        screenheight: 0,
        paiqiang: [],
        myisdapai: false,
        ljsocket: null,
        exitflag: 0
    },
    onLoad: function () {
        var userd = cc.sys.localStorage.getItem("userData");
        var userd_json = JSON.parse(userd);

        var roomid_v = userd_json.roomid;
        cc.find("Canvas/roomId").getComponent(cc.Label).string = "房间号：" + roomid_v;
        cc.find("Canvas/InviteWeixinButton").getComponent('InviteWeixinScript').roomid = roomid_v;

        var self = this;
        cc.loader.loadRes("plist/myhandmj", cc.SpriteAtlas,
            function (err, atlas) {
                self.myatlas = atlas;
                var socket_connectid = "";

                var socket;
                if (cc.sys.isNative) {
                    window.io = SocketIO;
                    socket = window.io.connect(com.socketUrl);
                }
                else {
                    socket = io(com.socketUrl);
                }

                self.ljsocket = socket;
                var userdata = cc.sys.localStorage.getItem("userData");
                var userlogin = {};
                userlogin = JSON.parse(userdata);
                socket.on('connect', function (data) {
                if(userd_json.huifuflag == 1){
                    cc.find("Canvas/ReadyButton").active = false;
                    cc.find("Canvas/InviteWeixinButton").active = false;
                    socket.emit('user_recovery', JSON.stringify(userlogin));
                }
                else{
                    socket.emit('login', JSON.stringify(userlogin));
                }
                    cc.sys.localStorage.setItem("userData", JSON.stringify(userlogin));
                });


                socket.on('allperson_position', function (data) {
                    cc.sys.localStorage.setItem("allUserData_position", data);
                });

                socket.on('open_person_info', function (data) {
                    cc.sys.localStorage.setItem("allUserData", data);
                });

                socket.on('open_start_call', function (data) { 
                });

                self.ready_button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    socket.emit('start_inning', JSON.stringify(userlogin));
                    cc.find("Canvas/ReadyButton").active = false;
                    cc.find("Canvas/InviteWeixinButton").active = false;
                });
                cc.find("Canvas/ExitNode/qudingButton").getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    var udata = {};
                    udata.userid = userlogin.id;
                    udata.wx_username = userlogin.wx_username;
                    udata.operationid = 1;
                    socket.emit('exit_oper', JSON.stringify(udata));
                });
                cc.find("Canvas/ExitNode/quxiaoButton").getComponent(cc.Button).node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    if (self.exitflag == 0) {
                        var udata = {};
                        udata.userid = userlogin.id;
                        udata.wx_username = userlogin.wx_username;
                        udata.operationid = -1;
                        socket.emit('exit_oper', JSON.stringify(udata));
                    }
                    else {
                        cc.find("Canvas/ExitNode").active = false;
                    }
                });

                socket.on('exit_oper_confirm', function (data) {
                    var dd_json = JSON.parse(data);
                    var data_json = dd_json.data;
                    var richtextu = "";
                    var tmpint = -1;
                    var tmpii = -1;
                    for (var i = 0; i < data_json.length; i++) {
                        if (i != 0) {
                            richtextu = richtextu + "<br />";
                        }
                        if (data_json[i].faqiflag == 1) {
                            richtextu = richtextu + "<color=#00ff00>" + data_json[i].wx_username + "请求解散麻将局</c>";
                        }
                        else {
                            if (data_json[i].operationid == 1) {
                                richtextu = richtextu + "<color=#00ff00>" + data_json[i].wx_username + "同意解散麻将局</c>";
                            }
                            else {
                                tmpii = i;
                                richtextu = richtextu + "<color=#00ff00>" + data_json[i].wx_username + "不同意解散麻将局</c>";
                                self.scheduleOnce(function () {
                                    cc.find("Canvas/ExitNode/qudingButton").active = true;
                                    cc.find("Canvas/ExitNode/quxiaoButton").active = true;
                                    cc.find("Canvas/ExitNode").active = false;
                                    var newrichtextu = "<color=#00ff00>是否要发起解散房间？</c>";
                                    cc.find("Canvas/ExitNode/ExitRichText").getComponent(cc.RichText).string = newrichtextu;
                                }, 1);
                            }
                        }

                        if (data_json[i].userid == userlogin.id) {
                            tmpint = i;
                            cc.find("Canvas/ExitNode/qudingButton").active = false;
                            cc.find("Canvas/ExitNode/quxiaoButton").active = false;
                        }
                    }

                    if (tmpint == -1) {
                        cc.find("Canvas/ExitNode").active = true;
                        var realUrl1 = cc.url.raw("resources/raw/image/xiaoxi2.png");
                        var texture1 = cc.textureCache.addImage(realUrl1);
                        var spr1 = new cc.SpriteFrame(texture1);

                        var realUrl2 = cc.url.raw("resources/raw/image/xiaoxi4.png");
                        var texture2 = cc.textureCache.addImage(realUrl2);
                        var spr2 = new cc.SpriteFrame(texture2);

                        cc.find("Canvas/ExitNode/qudingButton").getComponent(cc.Sprite).spriteFrame = spr1;
                        cc.find("Canvas/ExitNode/qudingButton").getComponent(cc.Button).normalSprite = spr1;
                        cc.find("Canvas/ExitNode/qudingButton").getComponent(cc.Button).pressedSprite = spr1;
                        cc.find("Canvas/ExitNode/qudingButton").getComponent(cc.Button).hoverSprite = spr1;
                        cc.find("Canvas/ExitNode/qudingButton").getComponent(cc.Button).disabledSprite = spr1;

                        cc.find("Canvas/ExitNode/quxiaoButton").getComponent(cc.Sprite).spriteFrame = spr2;
                        cc.find("Canvas/ExitNode/quxiaoButton").getComponent(cc.Button).normalSprite = spr2;
                        cc.find("Canvas/ExitNode/quxiaoButton").getComponent(cc.Button).pressedSprite = spr2;
                        cc.find("Canvas/ExitNode/quxiaoButton").getComponent(cc.Button).hoverSprite = spr2;
                        cc.find("Canvas/ExitNode/quxiaoButton").getComponent(cc.Button).disabledSprite = spr2;
                    }

                    cc.find("Canvas/ExitNode/ExitRichText").getComponent(cc.RichText).string = richtextu;

                    if(tmpii == -1&&dd_json.personnum==data_json.length){
                        var ora_json = JSON.parse(cc.sys.localStorage.getItem("userData"));
                        ora_json.roomid = '';
                        cc.sys.localStorage.setItem("userData",JSON.stringify(ora_json));

                        cc.audioEngine.uncacheAll();
                        cc.director.loadScene('GameSelect');
                    }
                });
                socket.on('private_info', function (data) {
                    var data_json = JSON.parse(data);
                    var ora_json = JSON.parse(cc.sys.localStorage.getItem("userData"));
                    ora_json.roomid = data_json.roomid;
                    cc.sys.localStorage.setItem("userData", ora_json);
                });
                socket.on('private_pai', function (lldata) {
                    cc.find("Canvas/MjPaiNode").removeAllChildren();
                    cc.find("Canvas/showCurNode").active = true;

                    var data = JSON.parse(lldata);

                    if (data.my.hasOwnProperty("zhuapai")) {
                        self.myisdapai = true;
                    }
                    else {
                        self.myisdapai = false;
                    }

                    var showMyMajiangScript = new ShowMyMajiangScript();

                    showMyMajiangScript.socketobj = socket;

                    showMyMajiangScript.initMajiang(self, data);
                    showMyMajiangScript.grabMajiang(self, data);
                    showMyMajiangScript.showHitMajiang(self, data);
                    showMyMajiangScript.pengMajiang(self, data);


                    if (data.left.handpai.length > 0) {
                        var showLeftMajiangScript = new ShowLeftMajiangScript();
                        showLeftMajiangScript.initMajiang(self, data);
                        showLeftMajiangScript.grabMajiang(self, data);
                        showLeftMajiangScript.showHitMajiang(self, data);
                        showLeftMajiangScript.pengMajiang(self, data);
                    }

                    if (data.bottom.handpai.length > 0) {
                        var showBottomMajiangScript = new ShowBottomMajiangScript();
                        showBottomMajiangScript.initMajiang(self, data);
                        showBottomMajiangScript.grabMajiang(self, data);
                        showBottomMajiangScript.showHitMajiang(self, data);
                        showBottomMajiangScript.pengMajiang(self, data);
                    }

                    if (data.right.handpai.length > 0) {
                        var showRightMajiangScript = new ShowRightMajiangScript();
                        showRightMajiangScript.grabMajiang(self, data);
                        showRightMajiangScript.initMajiang(self, data);
                        showRightMajiangScript.showHitMajiang(self, data);
                        showRightMajiangScript.pengMajiang(self, data);
                    }

                    var showTouxiangScript = new ShowTouxiangScript();
                    showTouxiangScript.allTouxiang(self);

                    var showZhongxinScript = new ShowZhongxinScript();
                    showZhongxinScript.showArrow(self, data);

                    cc.find("Canvas/InfoNode/JuRemainLabel").getComponent(cc.Label).string = "剩余" + data.remain_num + "张牌";
                });

                socket.on('private_operationpai', function (lldata) {
                    var data = JSON.parse(lldata);
                    var zhezhao = cc.find("Canvas/caozuoLayer");
                    zhezhao.active = true;

                    var buttonNode = cc.find("Canvas/caozuoLayer/ButtonNode");
                    buttonNode.removeAllChildren();

                    var commonTool = new CommonTool();

                    var initMajiangPrefab = cc.instantiate(cc.find("Canvas").getComponent('MJShowScript').my_hand_prefab);
                    initMajiangPrefab.getChildByName("MJSprite").getComponent(cc.Sprite).spriteFrame =
                        cc.find("Canvas").getComponent('MJShowScript').myatlas.getSpriteFrame(commonTool.getPaiByID(data.chupai, com.mypaidata).pictureName);
                    initMajiangPrefab.setPosition(168, -160);
                    buttonNode.addChild(initMajiangPrefab);

                    for (var i = 0; i < data.operationid.length; i++) {
                        var initOperationPrefab1 = cc.instantiate(cc.find("Canvas").getComponent('MJShowScript').operation_prefab);
                        initOperationPrefab1.getChildByName("ShowSprite").getComponent(cc.Sprite).spriteFrame =
                            cc.find("Canvas").getComponent('MJShowScript').myatlas.getSpriteFrame("btn_" + data.operationid[i]);
                        initOperationPrefab1.setPosition(261 + i * 100, -165);
                        buttonNode.addChild(initOperationPrefab1);
                        initOperationPrefab1.getChildByName("PressButton").getComponent('OperationScript').operation_id = data.operationid[i];
                        initOperationPrefab1.getChildByName("PressButton").getComponent('OperationScript').paiid = data.chupai;
                        initOperationPrefab1.getChildByName("PressButton").getComponent('OperationScript').socketobj = socket;
                        initOperationPrefab1.getChildByName("PressButton").getComponent('OperationScript').lldata = lldata;
                    }
                });

                socket.on('private_hupaihou', function (lldata) {
                    var zhezhao = cc.find("Canvas/gameend");
                    zhezhao.active = true;
                    cc.find("Canvas/gameend/btn_ready").getComponent('GoBackScript').socketobj = socket;
                    cc.find("Canvas/gameend").getComponent('HuShowScript').showInfo(self.myatlas, lldata);
                });

                socket.on('inittable', function () {
                    cc.find("Canvas/MjPaiNode").removeAllChildren();
                });

                socket.on('roomjuinfo', function (data) {
                    var juid = JSON.parse(data).id;
                    cc.find("Canvas/InfoNode/JuIdLabel").getComponent(cc.Label).string = juid;
                });

                socket.on('changPaiOrOperation', function (paioroperationid) {
                    cc.find("Canvas/MusicNode").getComponent('MusicNodeScript').playMusic(paioroperationid);
                });

                socket.on('disconnect', function () {
                });

                socket.on('reconnect', function () {
                });
            });
    }
});
