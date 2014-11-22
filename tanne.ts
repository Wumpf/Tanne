var Range = ace.require("ace/range").Range;

class Tanne {
    static codeEditor = ace.edit("code");
    static numLevels = 0;

    private userCanvas: HTMLCanvasElement;
    private referenceCanvas: HTMLCanvasElement;

    private nonEditAreas: NonEditableArea[];

    private levelNumber: number = -1;
    private goalError: number;

    constructor() {
        //Tanne.codeEditor.on("paste", (e: any) => e.text = ""); // pasting not allowed :P
        Tanne.codeEditor.setShowPrintMargin(false);
        
        Tanne.codeEditor.selection.on("changeCursor", () => this.onCodeEditCursorChanged());
        Tanne.codeEditor.selection.on("changeSelection", () => this.onCodeEditCursorChanged());
        
        Tanne.codeEditor.setTheme("ace/theme/twilight_modified");
        Tanne.codeEditor.getSession().setMode("ace/mode/javascript");
        Tanne.codeEditor.getSession().setTabSize(2);

        (<HTMLInputElement>document.getElementById("refreshbutton")).onclick = () => this.updateUserCanvas();
        this.userCanvas = <HTMLCanvasElement>document.getElementById("playercanvas");
        this.userCanvas.onmousemove = (ev) => this.canvasMouseOver(this.userCanvas, ev);
        this.userCanvas.onclick = (ev) => this.canvasClick(this.userCanvas, ev);
        this.referenceCanvas = <HTMLCanvasElement>document.getElementById("referencecanvas");
        this.referenceCanvas.onmousemove = (ev) => this.canvasMouseOver(this.referenceCanvas, ev);
        this.referenceCanvas.onclick = (ev) => this.canvasClick(this.referenceCanvas, ev);

        this.nextLevel();
    }

    nextLevel() {
        ++this.levelNumber;
        this.loadLevelFile(this.levelNumber);

        // Reset undo.
        // Rather strange behaviour but this works.
        // See: http://japhr.blogspot.de/2012/10/ace-undomanager-and-setvalue.html
        var UndoManager = ace.require("ace/undomanager").UndoManager;
        Tanne.codeEditor.getSession().setUndoManager(new UndoManager());
        
        // Initial draw.
        this.updateUserCanvas();

        // Update reference image and trigger initial draw.
        var image = new Image();
        image.onload = () => {
            this.referenceCanvas.getContext("2d").drawImage(image, 0, 0, this.referenceCanvas.width, this.referenceCanvas.height);
            this.updateUserCanvas();
        };
        image.src = "lvl/" + this.levelNumber + ".png";
    }

    private loadLevelFile(levelNumber: number) {
        // Reset non-editable areas.
        if (typeof this.nonEditAreas !== "undefined") {
            this.nonEditAreas.forEach(s => s.remove());
        }
        this.nonEditAreas = [];

        // Parse and add non-editable areas.
        var levelCodeElement = <HTMLIFrameElement>document.getElementById("lvl" + levelNumber);
        var rawLevelCode = <string>levelCodeElement.contentWindow.document.body.childNodes[0].innerHTML;
        var nonEditStart = 0;
        var nonEditEnd = -1;
        var lines = rawLevelCode.split('\n');
        var processedCode = "";
        var processedCodeLineNum = 0;
        var pendingNonEditAreaStart: number[] = [];
        var pendingNonEditAreaEnd: number[] = [];
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

        // Setup non editable areas.
        for (var i = 0; i < pendingNonEditAreaStart.length; ++i)
            this.nonEditAreas.push(new NonEditableArea(pendingNonEditAreaStart[i], pendingNonEditAreaEnd[i]));
        if (nonEditStart > 0)
            this.nonEditAreas.push(new NonEditableArea(nonEditStart, processedCodeLineNum));

        // Set cursor to a meaningful position.
        Tanne.codeEditor.selection.clearSelection();
        Tanne.codeEditor.selection.moveCursorToPosition(new function () { this.row = pendingNonEditAreaEnd[pendingNonEditAreaEnd.length - 1] + 1; this.column = 1; });
        Tanne.codeEditor.selection.moveCursorLineEnd();
    }

    onCodeEditCursorChanged() {
        if (typeof this.nonEditAreas === "undefined") {
            return;
        }

        Tanne.codeEditor.exitMultiSelectMode();

        Tanne.codeEditor.setReadOnly(false);
        this.nonEditAreas.forEach(s => {
            if (s.intersectsRange(Tanne.codeEditor.getSelectionRange()) || s.intersectsPosition(Tanne.codeEditor.getCursorPosition()))
                Tanne.codeEditor.setReadOnly(true);
        });
    }

    updateUserCanvas() {
        var drawFunction: any = new Function("canvas", Tanne.codeEditor.getValue());
        var userFunction = new drawFunction(this.userCanvas);
        (<HTMLSpanElement>document.getElementById("errorGoal")).innerHTML = (this.goalError * 100).toFixed(1) + "%";

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


        if (this.goalError >= nrmsd)
            this.winLevel();
    }

    winLevel() {
        alert("You won!");
        this.nextLevel();
    }

    private canvasMouseOver(canvas: HTMLCanvasElement, mouseOverEvent: MouseEvent) {
        var rect = canvas.getBoundingClientRect();
        var x = mouseOverEvent.clientX - rect.left;
        var y = mouseOverEvent.clientY - rect.top;
        (<HTMLSpanElement>document.getElementById("hoverPos")).innerHTML = "(" + x.toFixed(0) + " " + y.toFixed(0) + ")";

        var pixel = canvas.getContext("2d").getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6);
        (<HTMLSpanElement>document.getElementById("hoverCol")).innerHTML = hex;
    }

    public canvasClick(canvas: HTMLCanvasElement, mouseDownEvent: MouseEvent) {
        (<HTMLSpanElement>document.getElementById("clickPos")).innerHTML = (<HTMLSpanElement>document.getElementById("hoverPos")).innerHTML;
        (<HTMLSpanElement>document.getElementById("clickCol")).innerHTML = (<HTMLSpanElement>document.getElementById("hoverCol")).innerHTML;
    }
}

function startGame() {
    var game = new Tanne();
}