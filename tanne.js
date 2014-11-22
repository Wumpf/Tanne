var NonEditableArea = (function () {
    function NonEditableArea(rowStart, rowEnd) {
        var _this = this;
        this.startAnchor = Tanne.codeEditor.session.doc.createAnchor(rowStart, 0);
        this.endAnchor = Tanne.codeEditor.session.doc.createAnchor(rowEnd, 999);
        this.endAnchor.on("change", function () {
            return _this.update();
        });
        this.update();
    }
    NonEditableArea.prototype.intersectsRange = function (range) {
        return this.markerRange.intersects(range);
    };

    NonEditableArea.prototype.intersectsPosition = function (position) {
        return this.markerRange.inside(position.row, position.column);
    };

    NonEditableArea.prototype.remove = function () {
        if (typeof this.aceMarker !== "undefined") {
            Tanne.codeEditor.session.removeMarker(this.aceMarker);
            delete this.aceMarker;
        }
    };

    NonEditableArea.prototype.update = function () {
        this.remove();
        this.markerRange = new Range(this.startAnchor.getPosition().row, this.startAnchor.getPosition().column, this.endAnchor.getPosition().row, this.endAnchor.getPosition().column);
        this.aceMarker = Tanne.codeEditor.session.addMarker(this.markerRange, "noneditable", "fullLine", false);
    };
    return NonEditableArea;
})();
Range = ace.require("ace/range").Range;

var Tanne = (function () {
    function Tanne() {
        var _this = this;
        Tanne.codeEditor.on("paste", function (e) {
            return e.text = "";
        }); // pasting not allowed :P
        Tanne.codeEditor.selection.on("changeCursor", function () {
            return _this.onCodeEditCursorChanged();
        });
        Tanne.codeEditor.selection.on("changeSelection", function () {
            return _this.onCodeEditCursorChanged();
        });

        Tanne.codeEditor.setTheme("ace/theme/twilight");
        Tanne.codeEditor.getSession().setMode("ace/mode/javascript");

        this.userCanvas = document.getElementById("playercanvas");
        this.referenceCanvas = document.getElementById("referencecanvas");

        this.changeLevel(0);
    }
    Tanne.prototype.changeLevel = function (levelNumber) {
        this.userCanvas.getContext("2d").clearRect(0, 0, this.userCanvas.width, this.userCanvas.height);
        this.referenceCanvas.getContext("2d").clearRect(0, 0, this.referenceCanvas.width, this.referenceCanvas.height);

        var levelCodeElement = document.getElementById("lvl" + levelNumber);
        Tanne.codeEditor.setValue(levelCodeElement.contentWindow.document.body.childNodes[0].innerHTML);

        if (typeof this.nonEditAreas !== "undefined") {
            this.nonEditAreas.forEach(function (s) {
                return s.remove();
            });
        }
        this.nonEditAreas = [];

        this.nonEditAreas.push(new NonEditableArea(0, 1));
        this.nonEditAreas.push(new NonEditableArea(4, 6));
    };

    Tanne.prototype.onCodeEditCursorChanged = function () {
        if (typeof this.nonEditAreas === "undefined") {
            return;
        }
        Tanne.codeEditor.setReadOnly(false);
        this.nonEditAreas.forEach(function (s) {
            if (s.intersectsRange(Tanne.codeEditor.getSelectionRange()) || s.intersectsPosition(Tanne.codeEditor.getCursorPosition()))
                Tanne.codeEditor.setReadOnly(true);
        });
    };
    Tanne.codeEditor = ace.edit("code");
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
