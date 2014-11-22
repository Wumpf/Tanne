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
        

        var levelCodeElement = <HTMLIFrameElement>document.getElementById("lvl" + levelNumber);
        Tanne.codeEditor.setValue(levelCodeElement.contentWindow.document.body.childNodes[0].innerHTML);

        if (typeof this.nonEditAreas !== "undefined") {
            this.nonEditAreas.forEach(s => s.remove());
        }
        this.nonEditAreas = [];

        this.nonEditAreas.push(new NonEditableArea(0, 1));
        this.nonEditAreas.push(new NonEditableArea(4, 6));
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