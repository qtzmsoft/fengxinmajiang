cc.Class({
    extends: cc.Component,

    properties: {
        imageSprite:cc.Sprite,
        textSprite:cc.Label
    },

    onLoad: function () {

    },

    init: function (data) {
        this.textSprite.string = data.textSprite;
    }
});
