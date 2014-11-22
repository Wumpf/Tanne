  var magicRect = new draw.brownRectangle(new Pos(250, 125), 50, 50);
  // Fix stuff.
  draw.greenTriangle = function(p0, p1, p2) {
    magicRect.ctx.fillStyle = "#00E000";
    magicRect.ctx.beginPath();
    magicRect.ctx.moveTo(p0.x, p0.y);
    magicRect.ctx.lineTo(p1.x, p1.y);
    magicRect.ctx.lineTo(p2.x, p2.y);
    magicRect.ctx.fill();
  };
  // The usual triangles.
  draw.greenTriangle(new Pos(150, 0), new Pos(190, 85), new Pos(110, 85));
  draw.greenTriangle(new Pos(150, 50), new Pos(225, 175), new Pos(75, 175));
  draw.greenTriangle(new Pos(150, 100), new Pos(250, 250), new Pos(50, 250));