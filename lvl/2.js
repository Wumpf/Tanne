//** this.goalError = 0.01;
//** this.levelName = "3 - Trunk";
function Pos(x, y) {
  this.x = x; this.y = y;
}

// A bunch of useful draw function, just for you.
function Draw() {
    // Draws a green triangle.
    // (Pos) p0, p1, p2: Positions in clockwise order
    // (string) style: A color hex code.
    this.triangle = function(p0, p1, p2, style) {
      ctx.fillStyle = style;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.fill();
    };

    // A brown rectangle for the roots.
    // (Pos) upperLeft: Position upper left 
    // (number) width, height: Width/Height of the rect.
    // (string) style: A color hex code.
    this.rectangle = function(upperLeft, width, height, style) {
      ctx.fillStyle = style;
      ctx.fillRect(upperLeft.x, upperLeft.y, width, height);
    };

    // Create a 2D context for the functions above.
    var ctx = canvas.getContext('2d');
    // Standard background color.
    ctx.fillStyle = "#424242";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

var draw = new Draw();
canvas = null;

function drawTree() {
  //##
  draw.triangle(new Pos(150, 100), new Pos(250, 250), new Pos(50, 250), "#00AA00");
  draw.triangle(new Pos(150, 50), new Pos(225, 175), new Pos(75, 175), "#00CC00");
  draw.triangle(new Pos(150, 0), new Pos(190, 85), new Pos(110, 85), "#00FF00");
  //##
  draw.rectangle(new Pos(50, 250), 200, 50, "#FF9001");
}

drawTree();