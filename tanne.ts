class Tanne {
    private codeEditor: AceAjax.Editor;

    private levelNumber: number;
    private currentLevel: ILevel;

    private userCanvas: HTMLCanvasElement;
    private referenceCanvas: HTMLCanvasElement;

    constructor() {
        this.codeEditor = ace.edit("code");
        this.codeEditor.setTheme("ace/theme/twilight");
        this.codeEditor.getSession().setMode("ace/mode/javascript");

        this.userCanvas = <HTMLCanvasElement>document.getElementById("playercanvas");
        this.referenceCanvas = <HTMLCanvasElement>document.getElementById("referencecanvas");

        this.changeLevel(0);
    }

    changeLevel(levelNumber: number) {
        this.levelNumber = levelNumber;
        switch (this.levelNumber) {
            case 0:
                this.currentLevel = new Level0();
                break;
            
            default:
                // TODO: YOU WON
                break;   
        }
    }
}

window.onload = () => {
    var game = new Tanne();
};