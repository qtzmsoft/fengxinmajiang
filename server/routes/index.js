var express = require('express');
var router = express.Router();
var URL = require('url');
var https = require("https");
var iconv = require("iconv-lite");
var mysql =  require('mysql');

var remoteUrl = '127.0.0.1';

var logger = require('../logs/log').logger;


var pool =  mysql.createPool({
    host:remoteUrl,
    user:"fengxinmajiang",
    password:"fdsdfsiets~!@",
    database:"fengxinmajiang"
});

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getuserinfo', function (req, resod, next) {
    var userinfo_str = "";
    var params = URL.parse(req.url, true).query;
    if (params.data == null) {
    }
    else {
        var inputdata = params.data;

        var appid = "XXXXXXXX";
        var secretcode = "XXXXXXXXXXXXXXXXXXX";
        var lcode = inputdata;

        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secretcode + "&code=" + lcode + "&grant_type=authorization_code";
        var user_token = "";
        https.get(url, function (res) {
            var datas = [];
            var size = 0;
            res.on('data', function (data) {
                datas.push(data);
                size += data.length;
            });
            res.on("end", function () {
                var buff = Buffer.concat(datas, size);
                user_token = iconv.decode(buff, "utf8");

                var user_token_json = JSON.parse(user_token);

                var userinfo_url = "https://api.weixin.qq.com/sns/userinfo?access_token="+user_token_json.access_token
                    +"&openid="+user_token_json.openid;
                https.get(userinfo_url, function (res) {
                    var datas = [];
                    var size = 0;
                    res.on('data', function (data) {
                        datas.push(data);
                        size += data.length;
                    });
                    res.on("end", function () {
                        var buff = Buffer.concat(datas, size);
                        userinfo_str = iconv.decode(buff, "utf8");
                        logger.info("index--getuserinfo--userinfo_str:" + userinfo_str);
                        var userinfo_json = JSON.parse(userinfo_str);

                        var rtdata = {};
                        rtdata.status = 1;
                        pool.getConnection(function(err1, connection){
                            connection.query("call wx_user_procedure('"+userinfo_json.nickname
                                +"','"+userinfo_json.headimgurl+"','"+
                                userinfo_json.unionid+"');",function(err2,rows,fields){
                                if(err2)	{
                                    throw err2;
                                }else{
                                    var results = rows[0];
                                    var row = results[0];
                                    rtdata.userdata = row;
                                    resod.send(JSON.stringify(rtdata));
                                }
                            });
                        });
                    });
                }).on("error", function (err) {
                });
            });
        }).on("error", function (err) {
        });
    }
});
router.get('/getversion', function (req, res, next) {
    var params = URL.parse(req.url, true).query;
    if (params.data == null) {
        var versioninfo = {};
        versioninfo.status = 0;
        res.send(JSON.stringify(versioninfo));
    }
    else {
        var versioninfo = {};
        versioninfo.status = 1;
        versioninfo.infodata = {};
        versioninfo.infodata.code = 1;
        versioninfo.infodata.info = "<color=#992e2e><size=35>提示</size></c><br/><br/><color=#992e2e><size=25>已经有新版本了,<br/>请到http://www.taobao.com下载。</size></c>";
        res.send(JSON.stringify(versioninfo));
    }
});
module.exports = router;
