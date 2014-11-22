var Range = ace.require("ace/range").Range;

var Tanne = (function () {
    function Tanne() {
        var _this = this;
        this.codeEditor = ace.edit("code");
        this.codeEditor.selection.on("changeSelection", function () {
            return _this.onCodeSelectionChanged();
        });
        this.codeEditor.setTheme("ace/theme/twilight");
        this.codeEditor.getSession().setMode("ace/mode/javascript");

        this.userCanvas = document.getElementById("playercanvas");
        this.referenceCanvas = document.getElementById("referencecanvas");

        this.changeLevel(0);
    }
    Tanne.prototype.changeLevel = function (levelNumber) {
        this.userCanvas.getContext("2d").clearRect(0, 0, this.userCanvas.width, this.userCanvas.height);
        this.referenceCanvas.getContext("2d").clearRect(0, 0, this.referenceCanvas.width, this.referenceCanvas.height);

        var levelCodeElement = document.getElementById("lvl" + levelNumber);
        this.codeEditor.setValue(levelCodeElement.contentWindow.document.body.childNodes[0].innerHTML);

        this.codeEditor.session.addMarker(new Range(0, 0, 2, 0), "noneditable", "line", false);
    };

    Tanne.prototype.onCodeSelectionChanged = function () {
        alert(this.codeEditor.getSelection().getCursor().row);
    };
    return Tanne;
})();

function startGame() {
    var game = new Tanne();
}
// "Content loaded" is not very reliable
/*document.addEventListener('DOMContentLoaded', function () {
var game = new Tanne();
});*/
//# sourceMappingURL=tanne.js.map
