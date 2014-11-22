var Range = ace.require("ace/range").Range;

class Tanne {
    static codeEditor = ace.edit("code");

    private userCanvas: HTMLCanvasElement;
    private referenceCanvas: HTMLCanvasElement;

    private nonEditAreas: NonEditableArea[];

    constructor() {
        //Tanne.codeEditor.on("paste", (e: any) => e.text = ""); // pasting not allowed :P
        Tanne.codeEditor.selection.on("changeCursor", () => this.onCodeEditCursorChanged());
        Tanne.codeEditor.selection.on("changeSelection", () => this.onCodeEditCursorChanged());
        
        Tanne.codeEditor.setTheme("ace/theme/twilight_modified");
        Tanne.codeEditor.getSession().setMode("ace/mode/javascript");
        Tanne.codeEditor.getSession().setTabSize(2);

        (<HTMLInputElement>document.getElementById("refreshbutton")).onclick = () => this.updateUserCanvas();
        this.userCanvas = <HTMLCanvasElement>document.getElementById("playercanvas");
        this.referenceCanvas = <HTMLCanvasElement>document.getElementById("referencecanvas");

        this.changeLevel(0);
    }

    changeLevel(levelNumber: number) {
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

        // Set cursor to a meaningful.
        Tanne.codeEditor.selection.clearSelection();
        Tanne.codeEditor.selection.moveCursorToPosition(new function () { this.row = pendingNonEditAreaEnd[pendingNonEditAreaEnd.length - 1] + 1; this.column = 1; });
        Tanne.codeEditor.selection.moveCursorLineEnd();

        // Reset undo.
        // Rather strange behaviour but this works.
        // See: http://japhr.blogspot.de/2012/10/ace-undomanager-and-setvalue.html
        var UndoManager = ace.require("ace/undomanager").UndoManager;
        Tanne.codeEditor.getSession().setUndoManager(new UndoManager());
        
        // Initial draw.
        this.updateUserCanvas();

        // Update reference image and trigger initial draw.
        var image = new Image();
        image.src = "lvl/" + levelNumber + ".png";
        image.onload = () => {
            this.referenceCanvas.getContext("2d").drawImage(image, 0, 0, this.referenceCanvas.width, this.referenceCanvas.height);
            this.updateUserCanvas();
        };
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

    updateUserCanvas() {
        var drawFunction = new Function("canvas", Tanne.codeEditor.getValue());
        drawFunction(this.userCanvas);

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
        (<HTMLSpanElement>document.getElementById("imageError")).innerHTML = (nrmsd * 100).toFixed(1) + "%";
    }
}

function startGame() {
    var game = new Tanne();
}

// "Content loaded" is not very reliable
/*document.addEventListener('DOMContentLoaded', function () {
    var game = new Tanne();
});*/