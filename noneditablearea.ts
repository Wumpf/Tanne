
class NonEditableArea {
    private markerRange: AceAjax.Range;
    private aceMarker: number;

    private startAnchor: AceAjax.Anchor;
    private endAnchor: AceAjax.Anchor;

    constructor(rowStart: number, rowEnd: number) {
        this.startAnchor = Tanne.codeEditor.session.doc.createAnchor(rowStart, 0);
        this.endAnchor = Tanne.codeEditor.session.doc.createAnchor(rowEnd, 999);
        this.endAnchor.on("change", () => this.update());
        this.update();
    }

    intersectsRange(range: AceAjax.Range): boolean {
        return this.markerRange.intersects(range);
    }

    intersectsPosition(position: AceAjax.Position): boolean {
        return this.markerRange.inside(position.row, position.column);
    }

    remove() {
        if (typeof this.aceMarker !== "undefined") {
            Tanne.codeEditor.session.removeMarker(this.aceMarker);
            delete this.aceMarker;
        }
    }

    private update() {
        this.remove();
        this.markerRange = new Range(this.startAnchor.getPosition().row, this.startAnchor.getPosition().column,
                              this.endAnchor.getPosition().row, this.endAnchor.getPosition().column);
        this.aceMarker = Tanne.codeEditor.session.addMarker(this.markerRange, "noneditable", "fullLine", false);
    }
} 