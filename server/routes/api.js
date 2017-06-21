
var express = require('express');
var URL = require('url');
var router = express.Router();
var uuid = require('node-uuid');
var mysql =  require('mysql');

var moment = require('moment');

var url = require("url");
var querystring = require('querystring');

var logger = require('../logs/log').logger;
var remoteUrl = '127.0.0.1';

var pool =  mysql.createPool({
    host:remoteUrl,
    user:"fengxinmajiang",
    password:"fdsdfsiets~!@",
    database:"fengxinmajiang"
});

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
redis_client.on("error", function(error) {
});

var CommonTool = require('../common/CommonTool.js');

router.get('/getuser', function(req, res, next) {
    var rtdata = {};
    rtdata.status = "1";

    pool.getConnection(function(err, connection){
        connection.query("call proc_simple();",function(err,rows,fields){
            if(err)	{
                throw err;
            }else{
                var results = rows[0];
                var row = results[0];
                rtdata.userdata = row;
                res.send(JSON.stringify(rtdata));
            }
        });
        connection.release();
    });
});


/* 注册用户 */
router.get('/register', function(req, res, next) {
    var userdata = {};
    userdata.wx_username = "wx_username";
    userdata.wx_nicheng = "李某某";
    userdata.uid = uuid.v1();

    var rtdata = {};
    rtdata.status = "1";
    rtdata.data = userdata;

    res.send(JSON.stringify(rtdata));
});

router.get('/getroomid', function(req, res, next) {
    var roomid = CommonTool.randomSixNum();
    redis_client.get(roomid, function (err, reply) {
        var rtdata = {};
        if(reply==null){
            rtdata.status = "1";
            rtdata.data = roomid;
            redis_client.set(roomid,'');
            redis_client.set('info'+roomid,'');
        }
        else {
            rtdata.status = "0";
            rtdata.data = '已经存在此房间。';
        }
        res.send(JSON.stringify(rtdata));
    });
});
router.post('/getroomusernum', function(req, res, next) {
    var roomid = req.body.tel;
    redis_client.get(roomid, function (err, reply) {
        var rtdata = {};
        if(reply==null){
            rtdata.status = "0";
            rtdata.data = "没有房间,无法加入,房间号:"+roomid;
        }
        else {
            rtdata.status = "1";
            var roomdata = JSON.parse(reply);
            var roomdata_length = roomdata.allperson.length;
            rtdata.data = roomdata_length;
        }
        res.send(JSON.stringify(rtdata));
    });
});

router.post("/getintoroom", function(req,res,next) {
    var rtdata = {};
    var params = req.body.tel;
    var userJson = JSON.parse(params);

    if(params==null){
        rtdata.status = "0";
        rtdata.data = '空参数';
        res.send(JSON.stringify(rtdata));
    }
    else{
        redis_client.get(userJson.roomid, function (err, reply) {
            if(reply==null){
                rtdata.status = "0";
                rtdata.data = '无法加入房间。';
                res.send(JSON.stringify(rtdata));
            }
            else {
                rtdata.status = "1";
                rtdata.data = '加入房间。';
                var roomid = userJson.roomid;
                var allmajiang = CommonTool.shuffleCards();

                redis_client.get(roomid, function (err, reply) {
                    if(reply==''){
                        var roomdata = {};
                        delete userJson.roomid;
                        userJson.onlineflag = 0;
                        userJson.uid = uuid.v1();
                        userJson.connectid = uuid.v4();
                        userJson.inning = 0;
                        var pos = [1,2,3,4];
                        var ramp = CommonTool.getRandomNum(0,3);
                        userJson.position = pos[ramp];
                        if(userJson.ownflag==1){
                            roomdata.owner = userJson;
                        }
                        roomdata.allperson=[];
                        roomdata.allperson.push(userJson);
                        roomdata.exitdata = {};
                        roomdata.exitdata.data = [];

                        redis_client.set(roomid,JSON.stringify(roomdata));
                        res.send(JSON.stringify(rtdata));
                    }
                    else{
                        var roomdata = JSON.parse(reply);
                        delete userJson.roomid;
                        userJson.onlineflag = 0;
                        userJson.uid = uuid.v1();
                        userJson.connectid = uuid.v4();
                        userJson.inning = 0;
                        var pos = [1,2,3,4];
                        for(var i=0;i<roomdata.allperson.length;i++){
                            for(var j=0;j<pos.length;j++){
                                if(roomdata.allperson[i].position==pos[j]){
                                    pos.splice(j,1);
                                    break;
                                }
                            }
                        }
                        var ramp = CommonTool.getRandomNum(0,pos.length-1);
                        userJson.position = pos[ramp];
                        if(userJson.ownflag==1){
                            roomdata.owner = userJson;
                        }
                        roomdata.allperson.push(userJson);

                        redis_client.set(roomid,JSON.stringify(roomdata));
                        rtdata.userdata = userJson;
                        res.send(JSON.stringify(rtdata));
                    }
                });
            }
        });
    }
});

router.post("/regetintoroom", function(req,res,next) {
    var rtdata = {};
    rtdata.status = "0";
    rtdata.data = '初始配置';
    var params = req.body.tel;
    var userJson = JSON.parse(params);
    if(params==null){
        rtdata.status = "0";
        rtdata.data = '空参数';
        res.send(JSON.stringify(rtdata));
    }
    else{
        redis_client.get(userJson.roomid, function (err, reply) {
            if(reply==null){
                rtdata.status = "0";
                rtdata.data = '无法加入房间。';
                res.send(JSON.stringify(rtdata));
            }
            else {
                var roomid = userJson.roomid;

                redis_client.get(roomid, function (err, reply) {
                    if(reply==''){
                        rtdata.status = "0";
                        rtdata.data = '为空房间,无法重新加入';
                        res.send(JSON.stringify(rtdata));
                    }
                    else{
                        var roomdata = JSON.parse(reply);
                        var tmpi = -1;

                        for(var i=0;i<roomdata.allperson.length;i++){
                            if(roomdata.allperson[i].id == userJson.id){
                                roomdata.allperson[i].onlineflag = 1;
                                tmpi = i;
                            }
                        }

                        if(tmpi!= -1){
                            rtdata.status = "1";
                            rtdata.data = '可以加入';
                        }
                        else{
                            rtdata.status = "0";
                            rtdata.data = '无此用户,不可加入';
                        }

                        redis_client.set(roomid,JSON.stringify(roomdata));
                        res.send(JSON.stringify(rtdata));
                    }
                });
            }
        });
    }
});

/* 上传音频 */
router.post("/postvoice", function(req,res,next) {
    var rtdata = {};
    var params = req.body.tel;
    var dataJson = JSON.parse(params);

    if(params==null){
        rtdata.status = "0";
        rtdata.data = '空参数';
        res.send(JSON.stringify(rtdata));
    }
    else{
        redis_client.exists('info'+dataJson.userdata.roomid, function (err, keyexists) {
            if (err){
                return false;
            }
            else {
                var now = moment().format('X');

                dataJson.happentime = now;
                if(keyexists==0){
                    var dataarray = [];
                    dataarray.push(dataJson);
                    redis_client.set('info'+dataJson.userdata.roomid,JSON.stringify(dataarray));
                }
                else{
                    redis_client.get('info'+dataJson.userdata.roomid, function (err, replydata) {
                        var dataarray = [];
                        if(replydata!=''){
                            dataarray = JSON.parse(replydata);
                        }
                        var tmpi = -1;
                        for(var i=0;i<dataarray.length;i++){
                            if(dataarray[i].url == dataJson.url){
                                tmpi = i;
                            }
                        }
                        if(tmpi == -1){
                            dataarray.push(dataJson);
                            redis_client.set('info'+dataJson.userdata.roomid,JSON.stringify(dataarray));
                        }
                    });
                }
            }
        });
    }
});

router.post("/getvoicelist", function(req,res,next) {
    var rtdata = {};
    var params = req.body.tel;
    var dataJson = JSON.parse(params);

    if(params==null){
        rtdata.status = '0';
        rtdata.data = '空参数';
        res.send(JSON.stringify(rtdata));
    }
    else{
        redis_client.exists('info'+dataJson.roomid, function (err, keyexists) {
            if (err){
                rtdata.status = '0';
                rtdata.data = 'no data!';
                res.send(JSON.stringify(rtdata));
            }
            else {
                var now = moment();
                var fiveback = now.subtract(5,'m').format('X');

                var lastvoicetime = dataJson.lastvoicetime;

                var operdata = fiveback;
                if(fiveback<lastvoicetime){
                    operdata = lastvoicetime;
                }
                if(keyexists==1){
                    redis_client.get('info'+dataJson.roomid, function (err, replydata) {
                        if(replydata==''){
                            rtdata.status = '0';
                            rtdata.data = '数据为空';
                            res.send(JSON.stringify(rtdata));
                        }
                        else{
                            var dataarray = [];
                            var redis_dataarray = JSON.parse(replydata);
                            for(var i=0;i<redis_dataarray.length;i++){
                                if(dataJson.id!=redis_dataarray[i].userdata.id){
                                    if(redis_dataarray[i].happentime>operdata){
                                        var tmp_obj = JSON.parse(JSON.stringify(redis_dataarray[i]));
                                        tmp_obj.userid = redis_dataarray[i].userdata.id;
                                        delete tmp_obj.userdata;
                                        delete tmp_obj.name;
                                        delete tmp_obj.result;
                                        dataarray.push(tmp_obj);
                                    }
                                }
                            }
                            rtdata.status = '1';
                            rtdata.data = {};
                            rtdata.data.voicearray = [];
                            rtdata.data.voicearray = dataarray;
                            rtdata.data.lastvoicetime = now.format('X');
                            res.send(JSON.stringify(rtdata));
                        }
                    });
                }
            }
        });
    }
});
router.post('/getpaomadeng', function(req, res, next) {
    var rtdata = {};
    rtdata.status = "1";
    rtdata.data = "欢迎大家使用奉新麻将!";
    res.send(JSON.stringify(rtdata));
});
router.post('/getnotice', function(req, res, next) {
    var rtdata = {};
    rtdata.status = "1";
    rtdata.data = "<color=#ffffff>开心娱乐</c><br /><color=#ffffff>远离赌博</color>";
    rtdata.fontsize = 30;
    rtdata.lineheight = 30;
    res.send(JSON.stringify(rtdata));
});
router.post('/getmusicsound', function(req, res, next) {
    var rtdata = {};
    rtdata.status = "1";
    rtdata.data = "";
    rtdata.fontsize = 30;
    rtdata.lineheight = 30;
    res.send(JSON.stringify(rtdata));
});


module.exports = router;
