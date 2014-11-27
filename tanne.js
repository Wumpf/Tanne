var NonEditableArea = (function () {
    function NonEditableArea(rowStart, rowEnd) {
        var _this = this;
        this.startAnchor = Tanne.codeEditor.session.doc.createAnchor(rowStart, 0);
        this.endAnchor = Tanne.codeEditor.session.doc.createAnchor(rowEnd, 999);
        this.endAnchor.on("change", function () {
            return _this.updateHighlight();
        });
        this.updateHighlight();
    }
    Object.defineProperty(NonEditableArea.prototype, "lowerLine", {
        get: function () {
            return this.endAnchor.getPosition().row;
        },
        enumerable: true,
        configurable: true
    });

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

    NonEditableArea.prototype.updateHighlight = function () {
        this.remove();
        this.markerRange = new Range(this.startAnchor.getPosition().row, this.startAnchor.getPosition().column, this.endAnchor.getPosition().row, this.endAnchor.getPosition().column);
        this.aceMarker = Tanne.codeEditor.session.addMarker(this.markerRange, "noneditable", "fullLine", false);
    };
    return NonEditableArea;
})();
var Utils;
(function (Utils) {
    function decodeHTML(text) {
        var characterMap = { "gt": ">", "lt": "<" };
        return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function ($0, $1) {
            if ($1[0] === "#") {
                return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16) : parseInt($1.substr(1), 10));
            } else {
                return characterMap.hasOwnProperty($1) ? characterMap[$1] : $0;
            }
        });
    }
    Utils.decodeHTML = decodeHTML;
})(Utils || (Utils = {}));
/// <reference path="utils.ts"/>
var Range = ace.require("ace/range").Range;

var Tanne = (function () {
    function Tanne() {
        var _this = this;
        this.levelNumber = -1;
        //Tanne.codeEditor.on("paste", (e: any) => e.text = ""); // pasting not allowed :P
        Tanne.codeEditor.setShowPrintMargin(false);

        Tanne.codeEditor.getSession().on("change", function (evt) {
            return _this.onCodeEditChange(evt.data);
        });

        Tanne.codeEditor.selection.on("changeCursor", function () {
            return _this.onCodeEditCursorChanged();
        });
        Tanne.codeEditor.selection.on("changeSelection", function () {
            return _this.onCodeEditCursorChanged();
        });

        Tanne.codeEditor.setTheme("ace/theme/twilight_modified");
        Tanne.codeEditor.getSession().setMode("ace/mode/javascript");
        Tanne.codeEditor.getSession().setTabSize(2);

        document.getElementById("message").hidden = true;

        document.getElementById("refreshbutton").onclick = function () {
            return _this.updateUserCanvas();
        };
        this.userCanvas = document.getElementById("playercanvas");
        this.userCanvas.onmousemove = function (ev) {
            return _this.canvasMouseOver(_this.userCanvas, ev);
        };
        this.userCanvas.onclick = function (ev) {
            return _this.canvasClick(_this.userCanvas, ev);
        };
        this.referenceCanvas = document.getElementById("referencecanvas");
        this.referenceCanvas.onmousemove = function (ev) {
            return _this.canvasMouseOver(_this.referenceCanvas, ev);
        };
        this.referenceCanvas.onclick = function (ev) {
            return _this.canvasClick(_this.referenceCanvas, ev);
        };

        this.nextLevel();
    }
    Tanne.prototype.nextLevel = function () {
        var _this = this;
        ++this.levelNumber;

        // Reset code
        Tanne.codeEditor.setValue("Loading.");

        // Reset undo.
        // Rather strange behaviour but this works.
        // See: http://japhr.blogspot.de/2012/10/ace-undomanager-and-setvalue.html
        var UndoManager = ace.require("ace/undomanager").UndoManager;
        Tanne.codeEditor.getSession().setUndoManager(new UndoManager());

        var levelFileRequest = new XMLHttpRequest();
        levelFileRequest.open('GET', "/lvl/" + this.levelNumber + ".js");
        levelFileRequest.onreadystatechange = function () {
            _this.parseLevel(levelFileRequest.responseText);

            // Update reference image and trigger initial draw.
            var image = new Image();
            image.onload = function () {
                _this.referenceCanvas.getContext("2d").drawImage(image, 0, 0, _this.referenceCanvas.width, _this.referenceCanvas.height);
                _this.updateUserCanvas();
            };
            image.src = "lvl/" + _this.levelNumber + ".png";
        };
        levelFileRequest.send();
    };

    Tanne.prototype.parseLevel = function (rawLevelCode) {
        // Reset non-editable areas.
        if (typeof this.nonEditAreas !== "undefined") {
            this.nonEditAreas.forEach(function (s) {
                return s.remove();
            });
        }
        this.nonEditAreas = [];

        // Parse and add non-editable areas.
        var nonEditStart = 0;
        var nonEditEnd = -1;
        var lines = rawLevelCode.split('\n');
        var processedCode = "";
        var processedCodeLineNum = 0;
        var pendingNonEditAreaStart = [];
        var pendingNonEditAreaEnd = [];
        for (var i = 0; i < lines.length; ++i) {
            // User area delimiter?
            var marker = lines[i].indexOf("//##");
            if (marker >= 0) {
                if (nonEditStart < 0) {
                    nonEditStart = processedCodeLineNum;
                } else {
                    nonEditEnd = processedCodeLineNum - 1;
                    pendingNonEditAreaStart.push(nonEditStart);
                    pendingNonEditAreaEnd.push(nonEditEnd);
                    nonEditStart = -1;
                }
            } else {
                // direct command line?
                marker = lines[i].indexOf("//**");
                if (marker >= 0) {
                    eval(lines[i].substr(4));
                } else {
                    // Normal code.
                    processedCode += lines[i] + "\n";
                    ++processedCodeLineNum;
                }
            }
        }

        // Set processed code.
        Tanne.codeEditor.setValue(processedCode);

        // Set header.
        document.getElementById("levelName").innerHTML = this.levelName;

        for (var i = 0; i < pendingNonEditAreaStart.length; ++i)
            this.nonEditAreas.push(new NonEditableArea(pendingNonEditAreaStart[i], pendingNonEditAreaEnd[i]));
        if (nonEditStart > 0)
            this.nonEditAreas.push(new NonEditableArea(nonEditStart, processedCodeLineNum));

        // Set cursor to a meaningful position.
        Tanne.codeEditor.selection.clearSelection();
        Tanne.codeEditor.selection.moveCursorToPosition(new function () {
            this.row = pendingNonEditAreaEnd[pendingNonEditAreaEnd.length - 1] + 1;
            this.column = 1;
        });
        Tanne.codeEditor.selection.moveCursorLineEnd();
    };

    Tanne.prototype.onCodeEditCursorChanged = function () {
        if (typeof this.nonEditAreas === "undefined") {
            return;
        }

        Tanne.codeEditor.exitMultiSelectMode();

        Tanne.codeEditor.setReadOnly(false);
        this.nonEditAreas.forEach(function (s) {
            if (s.intersectsRange(Tanne.codeEditor.getSelectionRange()) || s.intersectsPosition(Tanne.codeEditor.getCursorPosition()))
                Tanne.codeEditor.setReadOnly(true);
        });
    };

    Tanne.prototype.onCodeEditChange = function (evt) {
        // It is not allowed to remove \n if the cursor is right after a non-editable area.
        if (evt.action == "removeText" && evt.text.indexOf("\n") != -1) {
            for (var i = 0; i < this.nonEditAreas.length; ++i) {
                if (this.nonEditAreas[i].lowerLine == Tanne.codeEditor.getCursorPosition().row) {
                    Tanne.codeEditor.getSession().insert(Tanne.codeEditor.getCursorPosition(), "\n");
                    Tanne.codeEditor.moveCursorToPosition(new function () {
                        this.row = Tanne.codeEditor.getCursorPosition().row + 1;
                        this.column = 0;
                    });
                    break;
                }
            }
        }
    };

    Tanne.prototype.updateUserCanvas = function () {
        // Validate user code.
        var userCode = Tanne.codeEditor.getValue();
        for (var i = 0; i < Tanne.illegalKeywords.length; ++i) {
            if (userCode.indexOf(Tanne.illegalKeywords[i]) > 0) {
                this.displayMessage("\"" + Tanne.illegalKeywords[i] + "\" not allowed!");
                return;
            }
        }

        // Execute user code.
        var drawFunction = new Function("canvas", userCode);
        var userFunction = new drawFunction(this.userCanvas);
        document.getElementById("errorGoal").innerHTML = (this.goalError * 100).toFixed(1) + "%";

        // Compute normalized root-mean-square deviation
        var pixelsUserCanvas = this.userCanvas.getContext("2d").getImageData(0, 0, this.userCanvas.width, this.userCanvas.height).data;
        var pixelsReferenceCanvas = this.referenceCanvas.getContext("2d").getImageData(0, 0, this.referenceCanvas.width, this.referenceCanvas.height).data;
        var nrmsd = 0.0;
        for (var i = 0, n = pixelsUserCanvas.length; i < n; i += 4) {
            for (var channel = 0; channel < 3; ++channel) {
                var diff = pixelsUserCanvas[i + channel] - pixelsReferenceCanvas[i + channel];
                nrmsd += diff * diff;
            }
        }
        nrmsd /= this.referenceCanvas.width * this.referenceCanvas.height * 3;
        nrmsd = Math.sqrt(nrmsd);
        nrmsd /= 255;
        document.getElementById("imageError").innerHTML = (nrmsd * 100).toFixed(1) + "%";

        if (this.goalError >= nrmsd)
            this.winLevel();
    };

    Tanne.prototype.displayMessage = function (messageText0, messageText1, functionOnContinue) {
        if (typeof messageText1 === "undefined") { messageText1 = ""; }
        if (typeof functionOnContinue === "undefined") { functionOnContinue = function () {
        }; }
        document.getElementById("message").hidden = false;
        document.getElementById("messageText0").innerHTML = messageText0;
        document.getElementById("messageText1").innerHTML = messageText1;

        document.getElementById("messageButtonOK").onclick = function () {
            document.getElementById("message").hidden = true;
            functionOnContinue();
        };
    };

    Tanne.prototype.winLevel = function () {
        var _this = this;
        this.displayMessage("You did it!", "Continue to the next level.", function () {
            return _this.nextLevel();
        });
    };

    Tanne.prototype.messageBoxContinue = function () {
    };

    Tanne.prototype.canvasMouseOver = function (canvas, mouseOverEvent) {
        var rect = canvas.getBoundingClientRect();
        var x = mouseOverEvent.clientX - rect.left;
        var y = mouseOverEvent.clientY - rect.top;
        document.getElementById("hoverPos").innerHTML = "(" + x.toFixed(0) + " " + y.toFixed(0) + ")";

        var pixel = canvas.getContext("2d").getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6);
        document.getElementById("hoverCol").innerHTML = hex;
    };

    Tanne.prototype.canvasClick = function (canvas, mouseDownEvent) {
        document.getElementById("clickPos").innerHTML = document.getElementById("hoverPos").innerHTML;
        document.getElementById("clickCol").innerHTML = document.getElementById("hoverCol").innerHTML;
    };
    Tanne.codeEditor = ace.edit("code");
    Tanne.numLevels = 0;
    Tanne.illegalKeywords = ["document", "window"];
    return Tanne;
})();

window.onload = function () {
    var game = new Tanne();
};
//# sourceMappingURL=tanne.js.map
