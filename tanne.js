/// <reference path="ilevel.ts" />
var Level0 = (function () {
    function Level0() {
    }
    Level0.prototype.drawReference = function () {
    };

    Level0.prototype.drawUser = function (code) {
    };
    return Level0;
})();
var Tanne = (function () {
    function Tanne() {
        this.codeEditor = ace.edit("code");
        this.codeEditor.setTheme("ace/theme/twilight");
        this.codeEditor.getSession().setMode("ace/mode/javascript");

        this.userCanvas = document.getElementById("playercanvas");
        this.referenceCanvas = document.getElementById("referencecanvas");

        this.changeLevel(0);
    }
    Tanne.prototype.changeLevel = function (levelNumber) {
        this.levelNumber = levelNumber;
        switch (this.levelNumber) {
            case 0:
                this.currentLevel = new Level0();
                break;

            default:
                break;
        }
    };
    return Tanne;
})();

window.onload = function () {
    var game = new Tanne();
};
//# sourceMappingURL=tanne.js.map
