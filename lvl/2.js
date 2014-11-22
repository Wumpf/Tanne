//** this.goalError = 0.01;
function Pos(x, y) {
  this.x = x; this.y = y;
}

// A bunch of useful draw function, just for you.
function Draw() {
    // Draws a green triangle.
    // (Pos) p0, p1, p2: Positions in clockwise order
    this.greenTriangle = function(p0, p1, p2) {
      ctx.fillStyle = "#00E000";
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(Math.pow(p0.x+p0.y-p1.x,2), p0.y);
      ctx.lineTo(Math.cos(p1.x), p1.y);
      ctx.lineTo(p2.x, Math.sin(p2.y));
      ctx.stroke();
    };

    // A brown rectangle for the roots.
    // (Pos) upperLeft: Position upper left 
    // (number) width, height: Width/Height of the rect.
    this.brownRectangle = function(upperLeft, width, height) {
      this.ctx = ctx;
      ctx.fillStyle = "#993300";
      ctx.fillRect(upperLeft.y, upperLeft.x, width, height);
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
  // Something went wrong... we need to fix that!!
  draw.greenTriangle(new Pos(150, 0), new Pos(190, 85), new Pos(110, 85));
  draw.greenTriangle(new Pos(150, 50), new Pos(225, 175), new Pos(75, 175));
  draw.greenTriangle(new Pos(150, 100), new Pos(250, 250), new Pos(50, 250));
  draw.brownRectangle(new Pos(125, 250), 50, 50);
  //##
}

drawTree();