var ShowZhongxinScript = cc.Class({
    showArrow: function (self,data) {
        cc.find("Canvas/showCurNode/sichuan_room_fangxiang_001").active = false;
        cc.find("Canvas/showCurNode/sichuan_room_fangxiang_002").active = false;
        cc.find("Canvas/showCurNode/sichuan_room_fangxiang_003").active = false;
        cc.find("Canvas/showCurNode/sichuan_room_fangxiang_004").active = false;

        if(data.bottom.hasOwnProperty("zhuapai")){
            cc.find("Canvas/showCurNode/sichuan_room_fangxiang_003").active = true;
        }
        if (data.left.hasOwnProperty("zhuapai")) {
            cc.find("Canvas/showCurNode/sichuan_room_fangxiang_001").active = true;
        }
        if (data.right.hasOwnProperty("zhuapai")) {
            cc.find("Canvas/showCurNode/sichuan_room_fangxiang_004").active = true;
        }
        if (data.my.hasOwnProperty("zhuapai")) {
            cc.find("Canvas/showCurNode/sichuan_room_fangxiang_002").active = true;
        }
    }
});
module.exports = ShowZhongxinScript;