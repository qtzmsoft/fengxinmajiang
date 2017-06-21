var CommonTool = cc.Class({
    getRandomNum: function (Min,Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    },
    getAllCards:function(allcardtype){
        var rtcards = [];
        for(var i=0;i<4;i++){
            for(var j=0;j<allcardtype.length;j++){
                rtcards.push(allcardtype[j]);
            }
        }
        return rtcards;
    },
    shuffleCards:function(allcard){

    },
    getPaiByID:function(pid,paiarray){
        var rtdata = {};
        
        for(var i =0;i<paiarray.length;i++){
            if(paiarray[i].id==pid){
                rtdata = paiarray[i];
            }
        }

        return rtdata;
    }
});
module.exports = CommonTool;