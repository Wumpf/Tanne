//** this.goalError = 0.02;
//** this.levelName = "1 - A Missing Piece";
// Useful for all kind of positioning!
function Pos(x, y) {
  this.x = x; this.y = y;
}

// A bunch of useful draw function, just for you.
function Draw() {
    // Draws a green triangle - Everything you ever wanted!
    // (Pos) p0, p1, p2: Positions in clockwise order
    this.greenTriangle = function(p0, p1, p2) {
      ctx.fillStyle = "#00E000";
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.fill();
    };

    // A brown rectangle for the roots.
    // (Pos) upperLeft: Position upper left 
    // (number) width, height: Width/Height of the rect.
    this.brownRectangle = function(upperLeft, width, height) {
      ctx.fillStyle = "#993300";
      ctx.fillRect(upperLeft.x, upperLeft.y, width, height);
    };

    // Create a 2D context for the functions above.
    var ctx = canvas.getContext('2d');
    // Standard background color.
    ctx.fillStyle = "#424242";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// This is your friend!
var draw = new Draw();
canvas = null; // ... but you are not allowed to access the canvas directly ;)

function drawTree() {
  //##
  // This is where you can modify code!
  // Try to match the reference image as good as possible. Press refresh to see your changes.
  draw.greenTriangle(new Pos(150, 0), new Pos(190, 85), new Pos(110, 85));
  // HERE may be something missing!
  draw.greenTriangle(new Pos(150, 100), new Pos(250, 250), new Pos(50, 250));
  draw.brownRectangle(new Pos(125, 250), 50, 50);
  //##
}
drawTree();