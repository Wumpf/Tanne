//** this.goalError = 0.01;
//** this.levelName = "6 - More Lines?";
function Pos(x, y) {
   this.x = x; this.y = y;
}

function Draw() {
  var ctx = canvas.getContext('2d');
  ctx.lineWidth = 10;
  
  ctx.fillStyle = "#0F0F0F";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  var line = function(lineStart, lineEnd, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(lineStart.x, lineStart.y);
    ctx.lineTo(lineEnd.x, lineEnd.y);
    ctx.stroke();
  }
  
  this.lineBrown = function(lineStart, lineEnd) {
    line(lineStart, lineEnd, "#993300");
  }
  this.lineGreen = function(lineStart, lineEnd) {
    line(lineStart, lineEnd, "#00E000");
  }
}

function drawTree(p) {
  //##
  Draw.lineBrown(new Pos(p.x, p.y+100), new Pos(p.x, p.y));
  var width = 10;
  for(i=0; i<7; ++i) {
    Draw.lineGreen(new Pos(p.x, p.y), new Pos(p.x-width, p.y+20));
    Draw.lineGreen(new Pos(p.x, p.y), new Pos(p.x+width, p.y+20));
    p.y += 12;
    width += 3;
  }
  //##
}

var Draw = new Draw();
canvas = null;

function draw() {
  //##
  drawTree(new Pos(140, 100));
  drawTree(new Pos(32, 75));
  drawTree(new Pos(70, 190));
  drawTree(new Pos(220, 22));
  drawTree(new Pos(240, 193));
  //##
}
draw();