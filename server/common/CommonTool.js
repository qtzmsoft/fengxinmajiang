var logger = require('../logs/log').logger;
var majiangpai = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37];

var HupaiTool = require('./HupaiTool.js');
var remoteUrl = '127.0.0.1';

// redis 链接
var Redis = require('ioredis');
var redis_client = new Redis({
    parser: 'javascript',
    dropBufferSupport: true,
    port: 6666,
    host: remoteUrl,
    family: 4,
    password: 'fdsdfsiets~!@',
    db: 0
});

redis_client.on("error", function (error) {
});

var getRandomNum = function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
};
var getAllCards = function () {
    var rtcards = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < majiangpai.length; j++) {
            rtcards.push(majiangpai[j]);
        }
    }
    return rtcards;
};
var shuffleCards = function () {
    var array = getAllCards();
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
var randomEightNum = function () {
    var rtnum = "";
    for (var i = 0; i < 8; i++) {
        var num = getRandomNum(0, 9) + "";
        rtnum = rtnum + num;
    }
    return rtnum;
};
var randomSixNum = function () {
    var rtnum = "";
    for (var i = 0; i < 6; i++) {
        var num = getRandomNum(0, 9) + "";
        rtnum = rtnum + num;
    }
    return rtnum;
};
var sortByKey = function (array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
};
var compare = function (x, y) {
    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    } else {
        return 0;
    }
};
var initCards = function (roomdata) {

    var allcards = roomdata.ju.allpai.slice(0);

    roomdata.ju.handpai = [];
    for (var i = 0; i < roomdata.allperson.length; i++) {
        var tmppai = allcards.slice(0, 13);
        allcards.splice(0, 13);
        var tmppairen = {};
        tmppairen.id = roomdata.allperson[i].id;
        tmppairen.position = roomdata.allperson[i].position;
        tmppairen.ipai = tmppai;
        tmppairen.hitpai = [];
        tmppairen.pengpai = [];

        roomdata.ju.handpai.push(tmppairen);
    }

    roomdata.ju.remain = allcards;

    roomdata.ju.initdata = {};
    roomdata.ju.initdata.initallpai = JSON.parse(JSON.stringify(roomdata.ju.allpai));
    delete roomdata.ju.allpai;
    roomdata.ju.initdata.handpai = JSON.parse(JSON.stringify(roomdata.ju.handpai));
};

var everyPaiData = function (roomid, userData, roomData, operation) {
    operation.userid = userData.id;
    switch (operation.flag) {
        case 1:
            operation.pai = roomData.ju.remain.slice(0, 1);
            roomData.ju.remain.splice(0, 1);
            for (var i = 0; i < roomData.ju.handpai.length; i++) {
                if (roomData.ju.handpai[i].id == operation.userid) {
                    roomData.ju.handpai[i].zhuapai = Number(operation.pai[0]);
                }
            }
            break;
        case 3:

            break;
    }

    if (roomData.ju.isPrototypeOf("ju_process")) {
        roomData.ju.ju_process.push(operation);
    }
    else {
        roomData.ju.ju_process = [];
        roomData.ju.ju_process.push(operation);
    }

};
var hupaihouInit = function (roomData,hp_json,roomid,io) {
    roomData.ju={};
    roomData.ju.allpai = shuffleCards();

    for(var i=0;i<roomData.allperson.length;i++){
        roomData.allperson[i].inning = 0;
    }

    roomData.ju.zhuang = {};
    roomData.ju.zhuang.id = hp_json.uid;
    for(var i=0;i<roomData.allperson.length;i++){
        io.sockets.sockets[roomData.allperson[i].connectid].emit('inittable');
        if(hp_json.uid==roomData.allperson[i].id){
            roomData.ju.zhuang.position = roomData.allperson[i].position;
        }
    }

    roomData.ju.otherhu = [];

    redis_client.set(roomid, JSON.stringify(roomData));
};
//胡牌
var hupai_own = function (roomData, io,roomid) {
    var allperson = JSON.parse(JSON.stringify(roomData.allperson));
    var handpai = JSON.parse(JSON.stringify(roomData.ju.handpai));
    var hp_json =HupaiTool.hu_own(roomData);

    for(var i=0;i<handpai.length;i++){
        handpai[i].fanshu = 0;
        for(var j=0;j<allperson.length;j++){
            if(hp_json.uid==allperson[j].id&&allperson[j].id==handpai[i].id){
                handpai[i].wx_nicheng = allperson[j].wx_nicheng;
                handpai[i].fanshu = hp_json.allfanshu;
                handpai[i].connectid = allperson[j].connectid;
            }
            if(hp_json.uid!=allperson[j].id&&allperson[j].id==handpai[i].id){
                for(var k=0;k<hp_json.fanshu.length;k++){
                    if(allperson[j].id==hp_json.fanshu[k].userid){
                        handpai[i].wx_nicheng = allperson[j].wx_nicheng;
                        handpai[i].fanshu = handpai[i].fanshu -1 * hp_json.fanshu[k].fs_num;
                        handpai[i].connectid = allperson[j].connectid;
                    }
                }
            }
        }
    }

    var temp_handpai = JSON.parse(JSON.stringify(handpai));

    for(var i=0;i<handpai.length;i++){
        delete handpai[i].connectid;
    }

    for (var i = 0; i < temp_handpai.length; i++) {
        io.sockets.sockets[temp_handpai[i].connectid].emit('private_hupaihou', handpai);
    }

    hupaihouInit(roomData,hp_json,roomid,io);
};
//胡牌
var hupai_other = function (roomData, io,roomid) {
    var allperson = JSON.parse(JSON.stringify(roomData.allperson));
    var handpai = JSON.parse(JSON.stringify(roomData.ju.handpai));
    var hp_json =HupaiTool.hu_other(roomData);

    var fsdata = [];

    for(var i=0;i<allperson.length;i++){
        var udata = {};
        udata.uid = allperson[i].id;
        udata.wx_nicheng = allperson[i].wx_nicheng;
        udata.connectid = allperson[i].connectid;
        udata.fanshu = 0;
        fsdata.push(udata);
    }
    for(var i=0;i<fsdata.length;i++){
        for(var j=0;j<hp_json.length;j++){
            if(fsdata[i].uid==hp_json[j].uid){
                fsdata[i].fanshu = fsdata[i].fanshu + hp_json[j].allfanshu;
            }
        }
    }
    for(var i=0;i<fsdata.length;i++){
        for(var j=0;j<hp_json.length;j++){
            for(var k=0;k<hp_json[j].fanshu.length;k++){
                if(fsdata[i].uid==hp_json[j].fanshu[k].userid){
                    fsdata[i].fanshu = fsdata[i].fanshu - hp_json[j].fanshu[k].fs_num;
                }
            }
        }
    }

    for(var i=0;i<handpai.length;i++){
        for(var j=0;j<fsdata.length;j++){
            if(handpai[i].id==fsdata[j].uid){
                handpai[i].wx_nicheng= fsdata[j].wx_nicheng;
                handpai[i].connectid= fsdata[j].connectid;
                handpai[i].fanshu= fsdata[j].fanshu;
            }
        }
    }

    var temp_handpai = JSON.parse(JSON.stringify(handpai));

    for(var i=0;i<handpai.length;i++){
        delete handpai[i].connectid;
    }

    for (var i = 0; i < temp_handpai.length; i++) {
        io.sockets.sockets[temp_handpai[i].connectid].emit('private_hupaihou', handpai);
    }

    var tmp_hp_json = JSON.parse(JSON.stringify(hp_json[0]));

    if(hp_json.length>1){
        tmp_hp_json.uid = tmp_hp_json.chupai_userid;
    }

    hupaihouInit(roomData,tmp_hp_json,roomid,io);
};
var paiJudge_own = function (roomData, io) {
    var last_ju_process = JSON.parse(JSON.stringify(roomData.ju.ju_current));
    var chupai = Number(last_ju_process.pai[0]);

    var hp_json =HupaiTool.hu_own(roomData);

    var rtjson = {};
    rtjson.flag = 0;
    rtjson.uid = -2;
    rtjson.chupai = chupai;
    rtjson.operationid = [];
    rtjson.chupai_userid = -1;

    if(hp_json.flag==1){
        rtjson.flag = 11;
        rtjson.uid = last_ju_process.userid;
        rtjson.chupai = chupai;
        rtjson.operationid.push(0);
        rtjson.chupai_userid = last_ju_process.userid;
    }

    if (last_ju_process.flag == 11) {
        var judata = JSON.parse(JSON.stringify(roomData.ju.handpai));
        for (var i = 0; i < judata.length; i++) {
            var tnum = 0;
            judata[i].ipai.sort();
            for (var j = 0; j < judata[i].ipai.length; j++) {
                if (judata[i].ipai[j] == chupai&&judata[i].id==last_ju_process.userid) {
                    tnum++;
                }
            }
            if (tnum == 3) {
                rtjson.flag = 11;
                rtjson.uid = judata[i].id;
                rtjson.chupai = chupai;
                rtjson.operationid.push(1);
                rtjson.chupai_userid = judata[i].id;
                break;
            }


            if (judata[i].id==last_ju_process.userid) {
                for (var j = 0; j < judata[i].ipai.length; j++) {
                    var tpai = 0;
                    var pnum =0;
                    for(var jj=0; jj<judata[i].ipai.length; jj++){
                        if(judata[i].ipai[j]==judata[i].ipai[jj]){
                            pnum++;
                            tpai=judata[i].ipai[j];
                        }
                    }
                    if (pnum == 4) {
                        rtjson.flag = 31;
                        rtjson.uid = judata[i].id;
                        rtjson.chupai = tpai;
                        rtjson.operationid.push(1);
                        rtjson.chupai_userid = judata[i].id;
                        break;
                    }
                }
            }

            for (var j = 0; j < judata[i].pengpai.length; j++) {
                if (judata[i].pengpai[j].pai[0] == chupai&&judata[i].id==last_ju_process.userid&&judata[i].id!=judata[i].pengpai[j].chupai_user_id) {
                    rtjson.flag = 21;
                    rtjson.uid = judata[i].id;
                    rtjson.chupai = chupai;
                    rtjson.operationid.push(1);
                    rtjson.chupai_userid = judata[i].pengpai[j].chupai_user_id;
                    break;
                }
            }
        }
    }

    var roomdata_allperson = JSON.parse(JSON.stringify(roomData.allperson));

    if(rtjson.operationid.length>0){
        rtjson.operationid.push(3);
        for (var i = 0; i < roomdata_allperson.length; i++) {
            if (roomdata_allperson[i].id == rtjson.uid) {
                io.sockets.sockets[roomdata_allperson[i].connectid].emit('private_operationpai', rtjson);
            }
        }
    }
};

var paiJudge_other = function (submitdata, roomData,io) {
    var last_ju_process = JSON.parse(JSON.stringify(roomData.ju.ju_current));
    var chupai = Number(last_ju_process.pai[0]);

    var hp_json_list =HupaiTool.hu_other(roomData);

    var rtjson = {};
    rtjson.flag = 0;
    rtjson.uid = -2;
    rtjson.chupai = chupai;
    rtjson.operationid = [];
    rtjson.chupai_userid = -1;

    if(hp_json_list.length>0){
        for(var i=0;i<hp_json_list.length;i++){
            var hp_json = hp_json_list[i];
            if(hp_json.flag==1&&last_ju_process.flag == 12){
                rtjson.flag = 11;
                rtjson.uid = hp_json.uid;
                rtjson.chupai = chupai;
                rtjson.operationid.push(0);
                rtjson.operationid.push(3);
                rtjson.chupai_userid = last_ju_process.userid;
                rtjson.hasother = 1;
                var roomdata_allperson = JSON.parse(JSON.stringify(roomData.allperson));
                for (var i = 0; i < roomdata_allperson.length; i++) {
                    if (roomdata_allperson[i].id == rtjson.uid) {
                        io.sockets.sockets[roomdata_allperson[i].connectid].emit('private_operationpai', rtjson);
                    }
                }
                roomData.ju.otherhu.push(rtjson.uid);
            }
        }
    }
    else{
        rtjson = paiJudge_other_jx(submitdata, roomData,io);
    }
    return rtjson;
};

var paiJudge_other_jx = function (submitdata, roomData,io) {
    var last_ju_process = JSON.parse(JSON.stringify(roomData.ju.ju_current));
    var chupai = Number(last_ju_process.pai[0]);

    var rtjson = {};
    rtjson.flag = 0;
    rtjson.uid = -2;
    rtjson.chupai = chupai;
    rtjson.operationid = [];
    rtjson.chupai_userid = -1;

    if (last_ju_process.flag == 12) {
        var judata = JSON.parse(JSON.stringify(roomData.ju.handpai));
        for (var i = 0; i < judata.length; i++) {
            var tnum = 0;
            judata[i].ipai.sort();
            for (var j = 0; j < judata[i].ipai.length; j++) {
                if (judata[i].ipai[j] == chupai&&judata[i].id!=last_ju_process.chupai_userid) {
                    tnum++;
                }
            }
            if (tnum == 3) {
                rtjson.flag = 1;
                rtjson.uid = judata[i].id;
                rtjson.chupai = chupai;
                rtjson.operationid.push(1);
                rtjson.operationid.push(2);
                rtjson.chupai_userid = last_ju_process.chupai_userid;
                break;
            }
            if (tnum == 2) {
                rtjson.flag = 1;
                rtjson.uid = judata[i].id;
                rtjson.chupai = chupai;
                rtjson.operationid.push(2);
                rtjson.chupai_userid = last_ju_process.chupai_userid;
                break;
            }
        }
    }

    var roomdata_allperson = JSON.parse(JSON.stringify(roomData.allperson));

    if(rtjson.operationid.length>0){
        rtjson.operationid.push(3);
        if(rtjson.flag!=0){
            for (var i = 0; i < roomdata_allperson.length; i++) {
                if (roomdata_allperson[i].id == rtjson.uid) {
                    io.sockets.sockets[roomdata_allperson[i].connectid].emit('private_operationpai', rtjson);
                }
            }
        }
    }
    return rtjson;
};
var operationOtherHuGuo = function (submitdata,roomData) {
    var chupai = submitdata.paiid;
    for (var j = 0; j < roomData.ju.handpai.length; j++) {
        if (roomData.ju.handpai[j].id == submitdata.alldata.chupai_userid) {
            roomData.ju.handpai[j].hitpai.push(Number(chupai));
        }
    }
    return 1;
};
var operationOtherGuo = function (submitdata,roomData) {
    var chupai = submitdata.paiid;
    for (var j = 0; j < roomData.ju.handpai.length; j++) {
        if (roomData.ju.handpai[j].id == submitdata.alldata.chupai_userid) {
            roomData.ju.handpai[j].hitpai.push(Number(chupai));
        }
    }
};

var ownGangPaiAfter = function (submitdata, roomData) {
    var operation = {};
    operation.flag = 11;

    var zdp = roomData.ju.remain.slice(0, 1);
    roomData.ju.remain.splice(0, 1);

    for (var i = 0; i < roomData.ju.handpai.length; i++) {
        if (roomData.ju.handpai[i].id == submitdata.alldata.uid) {

            operation.userid = submitdata.userdata.id;
            operation.chupai_userid = submitdata.userdata.id;
            operation.pai = [];

            roomData.ju.handpai[i].zhuapai = Number(zdp[0]);
            operation.pai = zdp;
        }
    }

    roomData.ju.ju_current = operation;
    roomData.ju.ju_process.push(operation);
};

var otherGangPaiAfter = function (submitdata, roomData) {
    var operation = {};
    operation.flag = 11;

    var zdp = roomData.ju.remain.slice(0, 1);
    roomData.ju.remain.splice(0, 1);

    for (var i = 0; i < roomData.ju.handpai.length; i++) {
        if (roomData.ju.handpai[i].id == submitdata.alldata.uid) {

            operation.userid = submitdata.userdata.id;
            operation.chupai_userid = submitdata.userdata.id;
            operation.pai = [];

            roomData.ju.handpai[i].zhuapai = Number(zdp[0]);
            operation.pai = zdp;
        }
    }

    roomData.ju.ju_current = operation;
    roomData.ju.ju_process.push(operation);
};

var dapaiHouHandpaiData = function (submitdata, roomData) {
    var chupai = submitdata.paiid;
    for (var j = 0; j < roomData.ju.handpai.length; j++) {
        if (roomData.ju.handpai[j].id == submitdata.userdata.id) {

            var tmpds = roomData.ju.handpai[j].zhuapai;

            roomData.ju.handpai[j].ipai.push(Number(tmpds));

            delete roomData.ju.handpai[j].zhuapai;

            var tmpk = -1;
            for(var k=0;k<roomData.ju.handpai[j].ipai.length;k++){
                if(roomData.ju.handpai[j].ipai[k]==chupai){
                    tmpk = k;
                }
            }

            if(tmpk != -1){
                roomData.ju.handpai[j].ipai.splice(tmpk,1);
            }
            var operation = {};
            operation.flag = 12;
            operation.userid = submitdata.userdata.id;
            operation.chupai_userid = submitdata.userdata.id;
            operation.pai = [];
            operation.pai.push(submitdata.paiid);

            var hitpai_obj = {};
            hitpai_obj.userid = -1;
            hitpai_obj.op_type = -1;
            hitpai_obj.pai = submitdata.paiid;
            roomData.ju.handpai[j].hitpai.push(hitpai_obj);

            roomData.ju.ju_process.push(operation);
            roomData.ju.ju_current = operation;
        }
    }
};
var zhuapaiOperation_next = function (roomData) {
    var operation = {};
    operation.flag = 11;
    if (roomData.ju.hasOwnProperty("ju_current")) {
        var tmp_jup = JSON.parse(JSON.stringify(roomData.ju.ju_current));
        var next_userid = nextZhuapaiUserId(tmp_jup.userid, roomData);
        operation.userid = next_userid.id;
        operation.chupai_userid = next_userid.id;
    }
    else {
        var zhuang_userid = roomData.ju.zhuang.id;
        operation.userid = zhuang_userid;
        operation.chupai_userid = zhuang_userid;
        roomData.ju.ju_process = [];
    }

    var zdp = roomData.ju.remain.slice(0, 1);
    roomData.ju.remain.splice(0, 1);

    for (var i = 0; i < roomData.ju.handpai.length; i++) {
        if (roomData.ju.handpai[i].id == operation.userid) {
            roomData.ju.handpai[i].zhuapai = Number(zdp[0]);
            operation.pai = zdp;
        }
    }

    roomData.ju.ju_process.push(operation);
    roomData.ju.ju_current = operation;


};
var showJuidInfo = function (io,roomData,info) {
    for (var j = 0; j < roomData.allperson.length; j++) {
        io.sockets.sockets[roomData.allperson[j].connectid].emit('roomjuinfo', info);
    }
};

var inRoomAllPerson = function (srcRoomData, io) {
    var roomData = JSON.parse(JSON.stringify(srcRoomData));
    for (var i = 0; i < roomData.allperson.length; i++) {
        var playdata = {};
        playdata.my = {};
        playdata.left = {};
        playdata.bottom = {};
        playdata.right = {};
        for (var j = 0; j < roomData.allperson.length; j++) {
            if(roomData.allperson[i].id == roomData.allperson[j].id){
                playdata.my.id = roomData.allperson[j].id;
            }
            if ((roomData.allperson[i].position - 1) > 0 && roomData.allperson[j].position == (roomData.allperson[i].position - 1)) {
                playdata.left.id = roomData.allperson[j].id;
            }
            if ((roomData.allperson[i].position - 1) <= 0 && roomData.allperson[j].position == 4) {
                playdata.left.id = roomData.allperson[j].id;
            }
            if ((roomData.allperson[i].position + 1) < 5 && roomData.allperson[j].position == (roomData.allperson[i].position + 1)) {
                playdata.right.id = roomData.allperson[j].id;
            }
            if ((roomData.allperson[i].position + 1) >= 5 && roomData.allperson[j].position == 1) {
                playdata.right.id = roomData.allperson[j].id;
            }
            if ((roomData.allperson[i].position - 2) > 0 && roomData.allperson[j].position == (roomData.allperson[i].position - 2)) {
                playdata.right.id = roomData.allperson[j].id;
            }
            if ((roomData.allperson[i].position + 2) <= 4 && roomData.allperson[j].position == (roomData.allperson[i].position + 2)) {
                playdata.right.id = roomData.allperson[j].id;
            }
        }
        io.sockets.sockets[roomData.allperson[i].connectid].emit('allperson_position', playdata);
    }
};

var fenpaiAllOperation = function (srcRoomData, io) {
    var roomData = JSON.parse(JSON.stringify(srcRoomData));
    for (var j = 0; j < roomData.allperson.length; j++) {
        var playdata = {};
        playdata.my = {};
        playdata.my.hitpai = [];
        playdata.my.pengpai = [];
        playdata.my.handpai = [];
        playdata.left = {};
        playdata.left.hitpai = [];
        playdata.left.pengpai = [];
        playdata.left.handpai = [];
        playdata.bottom = {};
        playdata.bottom.hitpai = [];
        playdata.bottom.pengpai = [];
        playdata.bottom.handpai = [];
        playdata.right = {};
        playdata.right.hitpai = [];
        playdata.right.pengpai = [];
        playdata.right.handpai = [];

        for (var i = 0; i < roomData.ju.handpai.length; i++) {
            if (roomData.ju.handpai[i].id == roomData.allperson[j].id) {
                var cjh_hitpai = JSON.parse(JSON.stringify(roomData.ju.handpai[i].hitpai));
                var tmp_hitpai = [];

                for(var ii=0;ii<cjh_hitpai.length;ii++){
                    if(cjh_hitpai[ii].userid==-1){
                        tmp_hitpai.push(cjh_hitpai[ii].pai);
                    }
                }
                playdata.my.hitpai = tmp_hitpai;

                playdata.my.pengpai = roomData.ju.handpai[i].pengpai;
                playdata.my.handpai = roomData.ju.handpai[i].ipai;
                playdata.my.handpai.sort(compare);
                playdata.my.id = roomData.ju.handpai[i].id;
                if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                    playdata.my.zhuapai = roomData.ju.handpai[i].zhuapai;
                }
            }
            if ((roomData.allperson[j].position - 1) > 0 && roomData.ju.handpai[i].position == (roomData.allperson[j].position - 1)) {
                var cjh_hitpai = JSON.parse(JSON.stringify(roomData.ju.handpai[i].hitpai));
                var tmp_hitpai = [];

                for(var ii=0;ii<cjh_hitpai.length;ii++){
                    if(cjh_hitpai[ii].userid==-1){
                        tmp_hitpai.push(cjh_hitpai[ii].pai);
                    }
                }
                playdata.left.hitpai = tmp_hitpai;
                playdata.left.pengpai = roomData.ju.handpai[i].pengpai;
                playdata.left.handpai = roomData.ju.handpai[i].ipai;
                playdata.left.handpai.sort(compare);
                playdata.left.id = roomData.ju.handpai[i].id;
                if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                    playdata.left.zhuapai = 0;
                }
            }
            if ((roomData.allperson[j].position - 1) <= 0 && roomData.ju.handpai[i].position == 4) {
                var cjh_hitpai = JSON.parse(JSON.stringify(roomData.ju.handpai[i].hitpai));
                var tmp_hitpai = [];

                for(var ii=0;ii<cjh_hitpai.length;ii++){
                    if(cjh_hitpai[ii].userid==-1){
                        tmp_hitpai.push(cjh_hitpai[ii].pai);
                    }
                }
                playdata.left.hitpai = tmp_hitpai;
                playdata.left.pengpai = roomData.ju.handpai[i].pengpai;
                playdata.left.handpai = roomData.ju.handpai[i].ipai;
                playdata.left.handpai.sort(compare);
                playdata.left.id = roomData.ju.handpai[i].id;
                if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                    playdata.left.zhuapai = 0;
                }
            }
            if ((roomData.allperson[j].position + 1) < 5 && roomData.ju.handpai[i].position == (roomData.allperson[j].position + 1)) {
                var cjh_hitpai = JSON.parse(JSON.stringify(roomData.ju.handpai[i].hitpai));
                var tmp_hitpai = [];

                for(var ii=0;ii<cjh_hitpai.length;ii++){
                    if(cjh_hitpai[ii].userid==-1){
                        tmp_hitpai.push(cjh_hitpai[ii].pai);
                    }
                }
                playdata.right.hitpai = tmp_hitpai;
                playdata.right.pengpai = roomData.ju.handpai[i].pengpai;
                playdata.right.handpai = roomData.ju.handpai[i].ipai;
                playdata.right.handpai.sort(compare);
                playdata.right.id = roomData.ju.handpai[i].id;
                if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                    playdata.right.zhuapai = 0;
                }
            }
            if ((roomData.allperson[j].position + 1) >= 5 && roomData.ju.handpai[i].position == 1) {
                var cjh_hitpai = JSON.parse(JSON.stringify(roomData.ju.handpai[i].hitpai));
                var tmp_hitpai = [];

                for(var ii=0;ii<cjh_hitpai.length;ii++){
                    if(cjh_hitpai[ii].userid==-1){
                        tmp_hitpai.push(cjh_hitpai[ii].pai);
                    }
                }
                playdata.right.hitpai = tmp_hitpai;
                playdata.right.pengpai = roomData.ju.handpai[i].pengpai;
                playdata.right.handpai = roomData.ju.handpai[i].ipai;
                playdata.right.handpai.sort(compare);
                playdata.right.id = roomData.ju.handpai[i].id;
                if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                    playdata.right.zhuapai = 0;
                }
            }
            if ((roomData.allperson[j].position - 2) > 0 && roomData.ju.handpai[i].position == (roomData.allperson[j].position - 2)) {
                var cjh_hitpai = JSON.parse(JSON.stringify(roomData.ju.handpai[i].hitpai));
                var tmp_hitpai = [];

                for(var ii=0;ii<cjh_hitpai.length;ii++){
                    if(cjh_hitpai[ii].userid==-1){
                        tmp_hitpai.push(cjh_hitpai[ii].pai);
                    }
                }
                playdata.bottom.hitpai = tmp_hitpai;
                playdata.bottom.pengpai = roomData.ju.handpai[i].pengpai;
                playdata.bottom.handpai = roomData.ju.handpai[i].ipai;
                playdata.bottom.handpai.sort(compare);
                playdata.bottom.id = roomData.ju.handpai[i].id;
                if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                    playdata.bottom.zhuapai = 0;
                }
            }
            if ((roomData.allperson[j].position + 2) <= 4 && roomData.ju.handpai[i].position == (roomData.allperson[j].position + 2)) {
                var cjh_hitpai = JSON.parse(JSON.stringify(roomData.ju.handpai[i].hitpai));
                var tmp_hitpai = [];

                for(var ii=0;ii<cjh_hitpai.length;ii++){
                    if(cjh_hitpai[ii].userid==-1){
                        tmp_hitpai.push(cjh_hitpai[ii].pai);
                    }
                }
                playdata.bottom.hitpai = tmp_hitpai;
                playdata.bottom.pengpai = roomData.ju.handpai[i].pengpai;
                playdata.bottom.handpai = roomData.ju.handpai[i].ipai;
                playdata.bottom.handpai.sort(compare);
                playdata.bottom.id = roomData.ju.handpai[i].id;
                if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                    playdata.bottom.zhuapai = 0;
                }
            }
        }

        var tmp_playdata = JSON.parse(JSON.stringify(playdata));

        for (var x = 0; x < tmp_playdata.left.handpai.length; x++) {
            tmp_playdata.left.handpai[x] = 0;
        }

        for (var x = 0; x < tmp_playdata.bottom.handpai.length; x++) {
            tmp_playdata.bottom.handpai[x] = 0;
        }

        for (var x = 0; x < tmp_playdata.right.handpai.length; x++) {
            tmp_playdata.right.handpai[x] = 0;
        }

        tmp_playdata.remain_num = roomData.ju.remain.length;

        io.sockets.sockets[roomData.allperson[j].connectid].emit('private_pai', tmp_playdata);
    }
};


var everyPaiUserData = function (roomid, userData, tmroomData) {
    var roomData = JSON.parse(JSON.stringify(tmroomData));

    var playdata = {};
    playdata.my = {};
    playdata.my.hitpai = [];
    playdata.my.pengpai = [];
    playdata.my.handpai = [];
    playdata.left = {};
    playdata.left.hitpai = [];
    playdata.left.pengpai = [];
    playdata.left.handpai = [];
    playdata.bottom = {};
    playdata.bottom.hitpai = [];
    playdata.bottom.pengpai = [];
    playdata.bottom.handpai = [];
    playdata.right = {};
    playdata.right.hitpai = [];
    playdata.right.pengpai = [];
    playdata.right.handpai = [];
    switch (roomData.ju.ju_process[roomData.ju.ju_process.length - 1].flag) {
        case 1:

            break;
        case 2:
            var chulishuju = roomData.ju.ju_process[roomData.ju.ju_process.length - 1];
            for (var j = 0; j < roomData.ju.handpai.length; j++) {
                if (roomData.ju.handpai[j].id == chulishuju.userid) {
                    if (roomData.ju.handpai[j].hasOwnProperty("zhuapai")) {
                        roomData.ju.handpai[j].ipai.push(roomData.ju.handpai[j].zhuapai);
                        for (var k = 0; k > roomData.ju.handpai[j].ipai.length; k++) {
                            if (chulishuju.pai[0] == roomData.ju.handpai[j].ipai[k]) {
                                roomData.ju.handpai[j].hitpai.push(roomData.ju.handpai[j].ipai.slice(k, 1));
                                roomData.ju.handpai[j].ipai.split(k, 1);
                                break;
                            }
                        }
                    }
                }
            }
            break;
        case 3:

            break;
    }

    for (var i = 0; i < roomData.ju.handpai.length; i++) {
        if (roomData.ju.handpai[i].id == userData.id) {
            playdata.my.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.my.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.my.handpai = roomData.ju.handpai[i].ipai;
            playdata.my.handpai.sort(compare);
            playdata.my.id = userData.id;
        }
        if ((userData.position - 1) > 0 && roomData.ju.handpai[i].position == (userData.position - 1)) {
            playdata.left.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.left.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.left.handpai = roomData.ju.handpai[i].ipai;
            playdata.left.handpai.sort(compare);
            playdata.left.id = roomData.ju.handpai[i].id;
        }
        if ((userData.position - 1) <= 0 && roomData.ju.handpai[i].position == 4) {
            playdata.left.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.left.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.left.handpai = roomData.ju.handpai[i].ipai;
            playdata.left.handpai.sort(compare);
            playdata.left.id = roomData.ju.handpai[i].id;
        }
        if ((userData.position + 1) < 5 && roomData.ju.handpai[i].position == (userData.position + 1)) {
            playdata.right.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.right.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.right.handpai = roomData.ju.handpai[i].ipai;
            playdata.right.handpai.sort(compare);
            playdata.right.id = roomData.ju.handpai[i].id;
        }
        if ((userData.position + 1) >= 5 && roomData.ju.handpai[i].position == 1) {
            playdata.right.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.right.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.right.handpai = roomData.ju.handpai[i].ipai;
            playdata.right.handpai.sort(compare);
            playdata.right.id = roomData.ju.handpai[i].id;
        }
        if ((userData.position - 2) > 0 && roomData.ju.handpai[i].position == (userData.position - 2)) {
            playdata.bottom.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.bottom.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.bottom.handpai = roomData.ju.handpai[i].ipai;
            playdata.bottom.handpai.sort(compare);
            playdata.bottom.id = roomData.ju.handpai[i].id;
        }
        if ((userData.position + 2) <= 4 && roomData.ju.handpai[i].position == (userData.position + 2)) {
            playdata.bottom.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.bottom.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.bottom.handpai = roomData.ju.handpai[i].ipai;
            playdata.bottom.handpai.sort(compare);
            playdata.bottom.id = roomData.ju.handpai[i].id;
        }
    }

    if (roomData.ju.ju_process[roomData.ju.ju_process.length - 1].flag == 1) {
        for (var i = 0; i < roomData.ju.ju_process.length; i++) {
            if (playdata.my.id == roomData.ju.ju_process[roomData.ju.ju_process.length - 1].userid) {
                playdata.my.zhuapai = roomData.ju.ju_process[i].pai[0];
            }
            if (playdata.left.id == roomData.ju.ju_process[roomData.ju.ju_process.length - 1].userid) {
                playdata.left.zhuapai = roomData.ju.ju_process[i].pai[0];
            }
            if (playdata.right.id == roomData.ju.ju_process[roomData.ju.ju_process.length - 1].userid) {
                playdata.right.zhuapai = roomData.ju.ju_process[i].pai[0];
            }
            if (playdata.bottom.id == roomData.ju.ju_process[roomData.ju.ju_process.length - 1].userid) {
                playdata.bottom.zhuapai = roomData.ju.ju_process[i].pai[0];
            }
        }
    }


    return playdata;
};
var everyChupaihouUserData = function (roomid, roomdata, io) {
    for (var x = 0; x < roomdata.allperson.length; x++) {
        var roomdata_str = JSON.stringify(roomdata);
        var roomdata_x = JSON.parse(roomdata_str);

        var udajson = roomdata_x.allperson[x];
        if (playdata.left.hasOwnProperty("handpai")) {
            for (var i = 0; i < playdata.left.handpai.length; i++) {
                playdata.left.handpai[i] = 0;
            }
        }

        if (playdata.bottom.hasOwnProperty("handpai")) {
            for (var i = 0; i < playdata.bottom.handpai.length; i++) {
                playdata.bottom.handpai[i] = 0;
            }
        }

        if (playdata.right.hasOwnProperty("handpai")) {
            for (var i = 0; i < playdata.right.handpai.length; i++) {
                playdata.right.handpai[i] = 0;
            }
        }
        if (roomdata_x.allperson[x].onlineflag == 1 && roomdata_x.allperson[x].id == playdata.my.id) {
            io.sockets.sockets[roomdata_x.allperson[x].connectid].emit('private_pai', playdata);
        }
    }
};
var nextZhuapaiUserId = function (personid, roomdata) {

    var positionarray = [];
    var personposition;
    var judata = roomdata.ju.handpai;

    var tmpuserid;

    for (var i = 0; i < judata.length; i++) {
        positionarray.push(judata[i].position);
        if (personid == judata[i].id) {
            personposition = judata[i].position;
        }
    }
    positionarray.sort();

    var tmpd = -1;
    for (var i = 0; i < positionarray.length; i++) {
        if (positionarray[i] > personposition) {
            tmpd = positionarray[i];
        }
    }

    if (tmpd == -1) {
        for (var i = 0; i < positionarray.length; i++) {
            if (positionarray[i] > -1) {
                tmpd = positionarray[i];
                break;
            }
        }
    }

    for (var i = 0; i < judata.length; i++) {
        if (judata[i].position == tmpd) {
            tmpuserid = judata[i].id;
        }
    }

    var tmpuser = {};
    tmpuser.id = tmpuserid;

    return tmpuser;
};
var judgeOperation = function (roomdata, submitdata_json) {
    var judata = JSON.parse(JSON.stringify(roomdata.ju.handpai));
    var chupai = submitdata_json.paiid;
    var rtjson = {};
    rtjson.flag = 0;
    rtjson.uid = 0;
    rtjson.chupai = chupai;
    rtjson.operationid = [];
    rtjson.chupai_userid = -1;
    for (var i = 0; i < judata.length; i++) {
        var tnum = 0;
        judata[i].ipai.sort();
        for (var j = 0; j < judata[i].ipai.length; j++) {
            if (judata[i].ipai[j] == chupai) {
                tnum++;
            }
        }
        if (tnum == 3) {
            rtjson.flag = 1;
            rtjson.uid = judata[i].id;
            rtjson.chupai = chupai;
            rtjson.operationid.push(1);
            rtjson.operationid.push(3);
            rtjson.chupai_userid = submitdata_json.userdata.id;
        }
        else if (tnum == 2) {
            rtjson.flag = 1;
            rtjson.uid = judata[i].id;
            rtjson.chupai = chupai;
            rtjson.operationid.push(2);
            rtjson.operationid.push(3);
            rtjson.chupai_userid = submitdata_json.userdata.id;
        }
    }
    return rtjson;
};
var judgePengOtherOperation = function (roomdata, submitdata_json) {
    var judata = JSON.parse(JSON.stringify(roomdata.ju.handpai));
    var chupai = submitdata_json.paiid;
    var rtjson = {};
    rtjson.flag = 0;
    rtjson.uid = 0;
    rtjson.chupai = chupai;
    rtjson.operationid = [];
    rtjson.chupai_userid = -1;
    for (var i = 0; i < judata.length; i++) {
        if (submitdata_json.userdata.id != judata[i].id) {
            var tnum = 0;
            judata[i].ipai.sort();
            for (var j = 0; j < judata[i].ipai.length; j++) {
                if (judata[i].ipai[j] == chupai) {
                    tnum++;
                }
            }
            if (tnum == 3) {
                rtjson.flag = 1;
                rtjson.uid = judata[i].id;
                rtjson.chupai = chupai;
                rtjson.operationid.push(1);
                rtjson.operationid.push(3);
                rtjson.chupai_userid = submitdata_json.userdata.id;
            }
            else if (tnum == 2) {
                rtjson.flag = 1;
                rtjson.uid = judata[i].id;
                rtjson.chupai = chupai;
                rtjson.operationid.push(2);
                rtjson.operationid.push(3);
                rtjson.chupai_userid = submitdata_json.userdata.id;
            }
        }
    }
    return rtjson;
};
var operationConfirm = function (operation_data, roomData,roomid) {
    var last_ju_process = JSON.parse(JSON.stringify(roomData.ju.ju_current));
    for (var i = 0; i < roomData.ju.handpai.length; i++) {
        if (roomData.ju.handpai[i].id == operation_data.userdata.id) {
            switch (operation_data.operation_id) {
                case 0:
                    break;
                case 1:
                    var tmpipai = [];
                    for (var j = 0; j < roomData.ju.handpai[i].ipai.length; j++) {
                        if (roomData.ju.handpai[i].ipai[j] != operation_data.paiid) {
                            tmpipai.push(roomData.ju.handpai[i].ipai[j]);
                        }
                    }
                    var lgt = roomData.ju.handpai[i].ipai.length - tmpipai.length;
                    roomData.ju.handpai[i].ipai = tmpipai;
                    var pai_obj = {};
                    pai_obj.pai = [];
                    pai_obj.shiji_pai = [];
                    pai_obj.chupai_user_id = operation_data.alldata.chupai_userid;

                    for (var k = 0; k < lgt + 1; k++) {
                        pai_obj.pai.push(Number(operation_data.paiid));
                        pai_obj.shiji_pai.push(Number(operation_data.paiid));
                    }

                    roomData.ju.handpai[i].pengpai.push(pai_obj);

                    var ju_process_gang = {};
                    ju_process_gang.flag = 1;
                    ju_process_gang.userid = operation_data.userdata.id;
                    ju_process_gang.chupai_userid = operation_data.alldata.chupai_userid;
                    ju_process_gang.pai=[];
                    ju_process_gang.pai.push(operation_data.alldata.chupai);

                    roomData.ju.ju_process.push(ju_process_gang);


                    break;
                case 2:
                    var jss = 2;
                    var tmpindex = [];

                    for (var j = 0; j < roomData.ju.handpai[i].ipai.length; j++) {
                        if (roomData.ju.handpai[i].ipai[j] == operation_data.paiid && jss>0) {
                            tmpindex.push(j);
                            jss--;
                        }
                    }


                    var tmpipai = [];
                    for (var j = 0; j < roomData.ju.handpai[i].ipai.length; j++) {
                        if (j!=tmpindex[0]&&j!=tmpindex[1]) {
                            tmpipai.push(roomData.ju.handpai[i].ipai[j]);
                        }
                    }
                    roomData.ju.handpai[i].ipai = tmpipai;
                    var pai_obj = {};
                    pai_obj.pai = [];
                    pai_obj.shiji_pai = [];
                    pai_obj.chupai_user_id = operation_data.alldata.chupai_userid;

                    for (var k = 0; k < 3; k++) {
                        pai_obj.pai.push(Number(operation_data.paiid));
                        pai_obj.shiji_pai.push(Number(operation_data.paiid));
                    }
                    roomData.ju.handpai[i].pengpai.push(pai_obj);

                    var ju_process_gang = {};
                    ju_process_gang.flag = 2;
                    ju_process_gang.userid = operation_data.userdata.id;
                    ju_process_gang.chupai_userid = operation_data.alldata.chupai_userid;
                    ju_process_gang.pai=[];
                    ju_process_gang.pai.push(operation_data.alldata.chupai);

                    roomData.ju.ju_process.push(ju_process_gang);
                    break;
                case 3:

                    break;
                case 4:
                    var tmpipai = [];
                    var tmpds = last_ju_process.pai[0];
                    roomData.ju.handpai[i].ipai.push(Number(tmpds));
                    for (var j = 0; j < roomData.ju.handpai[i].ipai.length; j++) {
                        if (roomData.ju.handpai[i].ipai[j] != operation_data.paiid) {
                            tmpipai.push(roomData.ju.handpai[i].ipai[j]);
                        }
                    }
                    var lgt = roomData.ju.handpai[i].ipai.length - tmpipai.length;
                    roomData.ju.handpai[i].ipai = tmpipai;
                    var pai_obj = {};
                    pai_obj.pai = [];
                    pai_obj.shiji_pai = [];
                    pai_obj.chupai_user_id = operation_data.alldata.chupai_userid;

                    for (var k = 0; k < lgt; k++) {
                        pai_obj.pai.push(Number(operation_data.paiid));
                        pai_obj.shiji_pai.push(Number(operation_data.paiid));
                    }

                    roomData.ju.handpai[i].pengpai.push(pai_obj);
                    break;
            }
        }
    }
};

var nextZhuapaiUserObject = function (operation_data) {
    var tmpuser = {};
    var uid = -1;
    switch (operation_data.operation_id) {
        case 0:
            break;
        case 1:
            uid = operation_data.userdata.id;
            break;
        case 2:
            uid = operation_data.userdata.id;
            break;
        case 3:
            break;
        case 4:
            uid = operation_data.userdata.id;
            break;
    }
    tmpuser.id = uid;
    return tmpuser;
};
var pengPaiHou = function (operationdata, roomData) {
    var last_ju_process = JSON.parse(JSON.stringify(roomData.ju.ju_current));

    var chupai = Number(last_ju_process.pai[0]);
    for (var i = 0; i < roomData.ju.handpai.length; i++) {
        if(roomData.ju.handpai[i].id == last_ju_process.chupai_userid){
            for(var ii = 0; ii<roomData.ju.handpai[i].hitpai.length;ii++){
                if(roomData.ju.handpai[i].hitpai[ii].pai ==chupai){
                    roomData.ju.handpai[i].hitpai[ii].userid=operationdata.alldata.uid;
                    roomData.ju.handpai[i].hitpai[ii].op_type = 1;
                }
            }
        }
        if (roomData.ju.handpai[i].id == operationdata.alldata.uid) {
            var pais = roomData.ju.handpai[i].ipai.slice(0, 1);
            roomData.ju.handpai[i].zhuapai = pais[0];
            roomData.ju.handpai[i].ipai.splice(0, 1);
        }
        if (roomData.ju.handpai[i].id == operationdata.alldata.chupai_userid) {
            roomData.ju.handpai[i].ipai.push(chupai);
            var xdt = -1;
            for (var w = 0; w < roomData.ju.handpai[i].ipai.length; w++) {
                if (roomData.ju.handpai[i].ipai[w] == operationdata.alldata.chupai) {
                    xdt = w;
                }
            }

            if (xdt != -1) {
                roomData.ju.handpai[i].ipai.splice(xdt,1);
            }
        }
    }
};

var everyPaiUserData2 = function (roomid, userData, tmroomData) {
    var roomData = JSON.parse(JSON.stringify(tmroomData));

    var playdata = {};
    playdata.my = {};
    playdata.my.hitpai = [];
    playdata.my.pengpai = [];
    playdata.my.handpai = [];
    playdata.left = {};
    playdata.left.hitpai = [];
    playdata.left.pengpai = [];
    playdata.left.handpai = [];
    playdata.bottom = {};
    playdata.bottom.hitpai = [];
    playdata.bottom.pengpai = [];
    playdata.bottom.handpai = [];
    playdata.right = {};
    playdata.right.hitpai = [];
    playdata.right.pengpai = [];
    playdata.right.handpai = [];

    for (var i = 0; i < roomData.ju.handpai.length; i++) {
        if (roomData.ju.handpai[i].id == userData.id) {
            playdata.my.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.my.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.my.handpai = roomData.ju.handpai[i].ipai;
            playdata.my.handpai.sort(compare);
            playdata.my.id = userData.id;
            if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                playdata.my.zhuapai = roomData.ju.handpai[i].zhuapai;
            }
        }
        if ((userData.position - 1) > 0 && roomData.ju.handpai[i].position == (userData.position - 1)) {
            playdata.left.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.left.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.left.handpai = roomData.ju.handpai[i].ipai;
            playdata.left.handpai.sort(compare);
            playdata.left.id = roomData.ju.handpai[i].id;
            if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                playdata.left.zhuapai = roomData.ju.handpai[i].zhuapai;
            }
        }
        if ((userData.position - 1) <= 0 && roomData.ju.handpai[i].position == 4) {
            playdata.left.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.left.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.left.handpai = roomData.ju.handpai[i].ipai;
            playdata.left.handpai.sort(compare);
            playdata.left.id = roomData.ju.handpai[i].id;
            if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                playdata.left.zhuapai = roomData.ju.handpai[i].zhuapai;
            }
        }
        if ((userData.position + 1) < 5 && roomData.ju.handpai[i].position == (userData.position + 1)) {
            playdata.right.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.right.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.right.handpai = roomData.ju.handpai[i].ipai;
            playdata.right.handpai.sort(compare);
            playdata.right.id = roomData.ju.handpai[i].id;
            if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                playdata.right.zhuapai = roomData.ju.handpai[i].zhuapai;
            }
        }
        if ((userData.position + 1) >= 5 && roomData.ju.handpai[i].position == 1) {
            playdata.right.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.right.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.right.handpai = roomData.ju.handpai[i].ipai;
            playdata.right.handpai.sort(compare);
            playdata.right.id = roomData.ju.handpai[i].id;
            if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                playdata.right.zhuapai = roomData.ju.handpai[i].zhuapai;
            }
        }
        if ((userData.position - 2) > 0 && roomData.ju.handpai[i].position == (userData.position - 2)) {
            playdata.bottom.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.bottom.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.bottom.handpai = roomData.ju.handpai[i].ipai;
            playdata.bottom.handpai.sort(compare);
            playdata.bottom.id = roomData.ju.handpai[i].id;
            if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                playdata.bottom.zhuapai = roomData.ju.handpai[i].zhuapai;
            }
        }
        if ((userData.position + 2) <= 4 && roomData.ju.handpai[i].position == (userData.position + 2)) {
            playdata.bottom.hitpai = roomData.ju.handpai[i].hitpai;
            playdata.bottom.pengpai = roomData.ju.handpai[i].pengpai;
            playdata.bottom.handpai = roomData.ju.handpai[i].ipai;
            playdata.bottom.handpai.sort(compare);
            playdata.bottom.id = roomData.ju.handpai[i].id;
            if (roomData.ju.handpai[i].hasOwnProperty("zhuapai")) {
                playdata.bottom.zhuapai = roomData.ju.handpai[i].zhuapai;
            }
        }
    }
    return playdata;
};

var changPaiOrOperation = function (paioroperationid,roomData,io) {
    for (var i = 0; i < roomData.allperson.length; i++) {
        io.sockets.sockets[roomData.allperson[i].connectid].emit('changPaiOrOperation', paioroperationid);
    }
};

module.exports.getRandomNum = getRandomNum;
module.exports.shuffleCards = shuffleCards;
module.exports.randomSixNum = randomSixNum;
module.exports.sortByKey = sortByKey;
module.exports.initCards = initCards;
module.exports.pengPaiHou = pengPaiHou;
module.exports.dapaiHouHandpaiData = dapaiHouHandpaiData;
module.exports.judgePengOtherOperation = judgePengOtherOperation;
module.exports.nextZhuapaiUserObject = nextZhuapaiUserObject;
module.exports.operationConfirm = operationConfirm;
module.exports.fenpaiAllOperation = fenpaiAllOperation;
module.exports.zhuapaiOperation_next = zhuapaiOperation_next;
module.exports.paiJudge_own = paiJudge_own;
module.exports.paiJudge_other = paiJudge_other;
module.exports.operationOtherGuo = operationOtherGuo;
module.exports.ownGangPaiAfter = ownGangPaiAfter;
module.exports.otherGangPaiAfter = otherGangPaiAfter;
module.exports.hupai_own = hupai_own;
module.exports.hupai_other = hupai_other;
module.exports.operationOtherHuGuo = operationOtherHuGuo;
module.exports.paiJudge_other_jx = paiJudge_other_jx;
module.exports.showJuidInfo = showJuidInfo;
module.exports.inRoomAllPerson = inRoomAllPerson;
module.exports.changPaiOrOperation = changPaiOrOperation;
