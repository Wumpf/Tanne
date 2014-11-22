Range = ace.require("ace/range").Range;

class Tanne {
    static codeEditor = ace.edit("code");

    private userCanvas: HTMLCanvasElement;
    private referenceCanvas: HTMLCanvasElement;

    private nonEditAreas: NonEditableArea[];


    constructor() {
        Tanne.codeEditor.on("paste", (e: any) => e.text = ""); // pasting not allowed :P
        Tanne.codeEditor.selection.on("changeCursor", () => this.onCodeEditCursorChanged());
        Tanne.codeEditor.selection.on("changeSelection", () => this.onCodeEditCursorChanged());
        
        Tanne.codeEditor.setTheme("ace/theme/twilight");
        Tanne.codeEditor.getSession().setMode("ace/mode/javascript");

        this.userCanvas = <HTMLCanvasElement>document.getElementById("playercanvas");
        this.referenceCanvas = <HTMLCanvasElement>document.getElementById("referencecanvas");

        this.changeLevel(0);
    }

    changeLevel(levelNumber: number) {
        this.userCanvas.getContext("2d").clearRect(0, 0, this.userCanvas.width, this.userCanvas.height);
        this.referenceCanvas.getContext("2d").clearRect(0, 0, this.referenceCanvas.width, this.referenceCanvas.height);
        
        // Reset non-editable areas.
        if (typeof this.nonEditAreas !== "undefined") {
            this.nonEditAreas.forEach(s => s.remove());
        }
        this.nonEditAreas = [];

        // Parse and add non-editable areas.
        var levelCodeElement = <HTMLIFrameElement>document.getElementById("lvl" + levelNumber);
        var rawLevelCode = <string>levelCodeElement.contentWindow.document.body.childNodes[0].innerHTML;
        var nonEditStart = 0;
        var nonEditEnd;
        var lines = rawLevelCode.split('\n');
        var processedCode = "";
        var processedCodeLineNum = 0;
        var pendingNonEditAreaStart: number[] = [];
        var pendingNonEditAreaEnd: number[] = [];
        for (var i = 0; i < lines.length; ++i) {
            var marker = lines[i].indexOf("//##");
            if (marker >= 0) {
                if (nonEditStart < 0) {
                    nonEditStart = processedCodeLineNum;
                } else {
                    nonEditEnd = processedCodeLineNum-1;
                    pendingNonEditAreaStart.push(nonEditStart);
                    pendingNonEditAreaEnd.push(nonEditEnd);
                    nonEditStart = -1;
                }
            } else {
                processedCode += lines[i] + "\n";
                ++processedCodeLineNum;
            }
        }

        // Set processed code.
        Tanne.codeEditor.setValue(processedCode);

        // Setup non editable areas.
        for (var i = 0; i < pendingNonEditAreaStart.length; ++i)
            this.nonEditAreas.push(new NonEditableArea(pendingNonEditAreaStart[i], pendingNonEditAreaEnd[i]));
        if (nonEditStart > 0)
            this.nonEditAreas.push(new NonEditableArea(nonEditStart, processedCodeLineNum));
    }

    onCodeEditCursorChanged() {
        if (typeof this.nonEditAreas === "undefined") {
            return;
        }
        Tanne.codeEditor.setReadOnly(false);
        this.nonEditAreas.forEach(s => {
            if (s.intersectsRange(Tanne.codeEditor.getSelectionRange()) || s.intersectsPosition(Tanne.codeEditor.getCursorPosition()))
                Tanne.codeEditor.setReadOnly(true);
        });
    }
}

function startGame() {
    var game = new Tanne();
}

// "Content loaded" is not very reliable
/*document.addEventListener('DOMContentLoaded', function () {
    var game = new Tanne();
});*/