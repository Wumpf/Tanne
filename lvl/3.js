//** this.goalError = 0.20;
//** this.levelName = "4 - Authentic Tree";
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

function drawSomethinkLikeATree() {
  //##
  // Is this even possible?
  //##
}

drawSomethinkLikeATree();