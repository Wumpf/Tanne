//** this.goalError = 0.015;
//** this.levelName = "7 - The Lone Tree";
//** Math.backgroundColor = "#424242"
function Pos(x, y) {
  this.x = x; this.y = y;
}

function Draw() {
    this.strokedTriangle = function(p0, p1, p2, style) {
      ctx.fillStyle = style;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
      
      if(triangleCounter % 9 > 4) {
        this.strokedTriangle = function() {};// serious performance optimization
      }
      ++triangleCounter;
    };

    this.strokedRectangle = function(upperLeft, width, height, style) {
      if(rectCounter % 4 === 0) {
        ctx.fillStyle = style;
        ctx.fillRect(upperLeft.x, upperLeft.y, width, height);
        ctx.strokeRect(upperLeft.x, upperLeft.y, width, height);
      }
      ++rectCounter;
    };
  
    var triangleCounter = 0;
    var rectCounter = 0;
    
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.fillStyle = Math.backgroundColor; // "#424242"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

var draw = new Draw();
canvas = null;

function drawTriTree() {
  //##
  drawStrokedTree = function(pos) {
    draw.strokedTriangle(new Pos(pos.x + 150, pos.y + 100), new Pos(pos.x + 250, pos.y + 250), new Pos(pos.x + 50, pos.y + 250), "#00AA00");
    draw.strokedTriangle(new Pos(pos.x + 150, pos.y + 50), new Pos(pos.x + 225, pos.y + 175), new Pos(pos.x + 75, pos.y + 175), "#00CC00");
    draw.strokedTriangle(new Pos(pos.x + 150, pos.y + 0), new Pos(pos.x + 190, pos.y + 85), new Pos(pos.x + 110, pos.y + 85), "#00FF00");
    draw.strokedRectangle(new Pos(pos.x + 130, pos.y + 250), 40, 50, "#FF9001");
    this.drawStrokedTree = function() {}; // whooops!
  };
  
  drawStrokedTree(new Pos(0,0));
  drawStrokedTree(new Pos(-80,-20));
  drawStrokedTree(new Pos(80,-20));
  //##
}

drawTriTree();