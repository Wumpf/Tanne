var Range = ace.require("ace/range").Range;

class Tanne {
    private codeEditor: AceAjax.Editor;

    private userCanvas: HTMLCanvasElement;
    private referenceCanvas: HTMLCanvasElement;

    constructor() {
        this.codeEditor = ace.edit("code");
        this.codeEditor.selection.on("changeSelection", () => this.onCodeSelectionChanged());
        this.codeEditor.setTheme("ace/theme/twilight");
        this.codeEditor.getSession().setMode("ace/mode/javascript");

        this.userCanvas = <HTMLCanvasElement>document.getElementById("playercanvas");
        this.referenceCanvas = <HTMLCanvasElement>document.getElementById("referencecanvas");

        this.changeLevel(0);
    }

    changeLevel(levelNumber: number) {
        this.userCanvas.getContext("2d").clearRect(0, 0, this.userCanvas.width, this.userCanvas.height);
        this.referenceCanvas.getContext("2d").clearRect(0, 0, this.referenceCanvas.width, this.referenceCanvas.height);
        

        var levelCodeElement = <HTMLIFrameElement>document.getElementById("lvl" + levelNumber);
        this.codeEditor.setValue(levelCodeElement.contentWindow.document.body.childNodes[0].innerHTML);

        this.codeEditor.session.addMarker(new Range(0, 0, 2, 0), "noneditable", "line", false);
    }

    onCodeSelectionChanged() {
       // alert(this.codeEditor.getSelection().getCursor().row);
    }
}

function startGame() {
    var game = new Tanne();
}

// "Content loaded" is not very reliable
/*document.addEventListener('DOMContentLoaded', function () {
    var game = new Tanne();
});*/