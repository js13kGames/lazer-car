"use strict";

window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawLine(ctx, points) {
  for(var p = 0; p < points.length; p++) {
    ctx.lineTo(points[p][0], points[p][1]);
  }
}

function colorStop(gradient, stops) {
  for(var s = 0; s < stops.length; s++) {
    gradient.addColorStop(stops[s][0], stops[s][1]);
  }
}

// background
function Bg(game) {
  this.game = game;
  this.canvas = game.canvas;
  this.ctx = game.ctx;
  this.x = 0;
  this.y = 0;
  this.maxSize = 0;
  this.gridGapWidth = 3;
  this.gridGap = parseInt(this.maxSize / this.gridGapWidth);

  this.setupCircles = function() {
    this.circles = [];
    for(var c = 0; c < this.gridGap + 1; c++) {
      if((this.gridGapWidth * (c * c)) * 2 < this.maxSize + 100) {
        this.circles.push(this.gridGapWidth * c * c);
      }
    }
  };

  this.setupStars = function() {
    this.stars = [];

    for(var s = 0; s < this.maxSize / 10; s++) {
      this.stars.push({
        x: random(0, this.game.width),
        y: random(0, this.game.height),
        r: random(1,3),
        o: random(1, 10) / 10
      });
    }
  };

  this.update = function(dt) {
    this.gridGap = parseInt(this.maxSize / this.gridGapWidth);

    if(this.stars.length === 0) {
      this.setupStars();
    }

    if(this.circles.length === 0) {
      this.setupCircles();
    }
  };

  this.drawGradient = function() {
    this.gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    colorStop(this.gradient, [
      [0, '#441541'],
      [.48, '#441541'],
      [.499, '#f742a3'],
      [.5, '#fa71b9'],
      [.501, '#f742a3'],
      [.52, '#271126'],
      [1, '#271126']
    ]);
    
    this.ctx.save();
    this.ctx.fillStyle = this.gradient;
    this.ctx.fillRect(this.x, this.y, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  };

  this.drawStars = function() {
    this.ctx.save();
    for(var s in this.stars) {
      this.ctx.beginPath();
      this.ctx.arc(this.stars[s].x, this.stars[s].y, this.stars[s].r / 2, 0, 2*Math.PI);
      this.ctx.fillStyle = 'rgba(255, 255, 255, '+ this.stars[s].o +')';
      this.ctx.fill();
    }
    this.ctx.restore();
  };

  this.drawRadials = function() {

    var radialGradient = this.ctx.createRadialGradient(this.game.halfWidth, this.game.halfHeight, 1, this.game.halfWidth, this.game.halfHeight, this.maxSize / 2);
    colorStop(radialGradient, [
      [0, 'rgba(255, 255, 255, 1)'],
      [.01, 'rgba(255, 255, 255, .7)'],
      [.07, 'rgba(247, 66, 163, .5)'],
      [.2, 'rgba(247, 66, 163, .3)'],
      [.5, 'rgba(247, 66, 163, .1)'],
      [1, 'rgba(247, 66, 163, .0)']
    ]);

    this.ctx.save();
    this.ctx.arc(this.game.halfWidth, this.game.halfHeight, this.maxSize / 2, 0, 2*Math.PI);
    this.ctx.fillStyle = radialGradient;
    this.ctx.fill();
    this.ctx.restore();
  };

  this.drawGrid = function() {
    var x = this.game.halfWidth,
        y = this.game.halfHeight,
        currentCircle = 0;

    this.ctx.save();
    for(var c in this.circles) {
      this.ctx.beginPath()
      this.ctx.arc(x, y, this.circles[c], 0, 2 * Math.PI);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'rgba(195, 135, 255, ' + currentCircle / this.circles.length +')';
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.circles[c], 0, 2 * Math.PI);
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = 'rgba(78, 176, 237, ' + (currentCircle / this.circles.length) / 5 + ')';
      this.ctx.stroke();
      currentCircle++;
    }
    this.ctx.restore();

    var lineGradient = this.ctx.createRadialGradient(this.game.halfWidth, this.game.halfHeight, 1, this.game.halfWidth, this.game.halfHeight, this.maxSize);
    colorStop(lineGradient, [
      [0, 'rgba(50, 106, 222, 0)'],
      [.2, 'rgba(195, 135, 255, 1)'],
      [1, '#c387ff']
    ]);

    for(var l = 0; l < 12 + 1; l++) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.translate(this.game.halfWidth, this.game.halfHeight);
      this.ctx.moveTo(0, 0);
      this.ctx.rotate(30 * l * Math.PI / 180);
      this.ctx.lineTo(this.maxSize, 0);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = lineGradient;
      this.ctx.stroke();
      this.ctx.restore();
    }
  };

  this.draw = function(dt) {
    this.drawGradient();
    this.drawStars();
    this.drawRadials();
    this.drawGrid();
  };

  this.resize = function() {
    this.maxSize = Math.max(this.canvas.width, this.canvas.height);
    this.gridGap = parseInt(this.maxSize / this.gridGapWidth);
    this.setupStars();
    this.setupCircles();
  };

  this.update = this.update.bind(this);
  this.draw = this.draw.bind(this);
  return this;
}

// entities

function Obstacle(game) {
  this.game = game;
  this.c = game.ctx;
  this.x = this.startX = this.game.halfWidth;
  this.y = this.startY = this.game.halfHeight;
  this.moving = true;
  this.scale = 1;
  this.lives = true;
  this.speed = 100;

  this.update = function(dt) {
    if(this.moving && this.distance) {
      if(this.scale < 35)
        this.scale += dt * 4;
      this.x += this.directionX * this.speed * dt * 2;
      this.y += this.directionY * this.speed * dt * 2;
      if(Math.sqrt(Math.pow(this.x - this.startX,2) + Math.pow(this.x - this.startY,2)) >= this.distance) {
        this.lives = false;
      }
      if(this.lives)
        this.currentDistance = Math.sqrt(Math.pow(this.x - this.game.halfWidth, 2) + Math.pow(this.y - this.game.halfHeight, 2));
    }
  };

  this.resize = function() {
    this.x = this.startX = this.game.halfWidth;
    this.y = this.startY = this.game.halfHeight;
    this.randomize();
  };

  this.randomize = function() {
    this.rotate = random(0, 4);
    var side = random(0, 1000) > 499 ? -1 : 1;

    if(random(0, 999) > 499) {
      this.endX = this.game.canvas.width * side * 2;
      this.endY = random(0, this.game.canvas.height);
    } else {
      this.endX = random(0, this.game.canvas.width);
      this.endY = this.game.canvas.height * side * 2;
    }
    this.distance = Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));
    this.directionX = (this.endX - this.startX) / this.distance;
    this.directionY = (this.endY- this.startY) / this.distance;
  };

  this.draw = function(dt) {
    if(this.moving) {
      this.c.save();
      var x = (this.rotate === 0 || this.rotate === 2) ? this.x + 12 : this.x + 6;
      var y = (this.rotate === 0 || this.rotate === 2) ? this.y + 6 : this.y + 12;
      this.c.translate(x, y);
      this.c.scale(this.scale, this.scale);
      this.c.rotate(this.rotate * 90 * Math.PI / 180);
  
      this.c.beginPath();
      this.c.moveTo(5, 0);
      drawLine(this.c, [
        [8, 3],
        [8, 12],
        [5, 14],
        [2, 13],
        [0, 11],
        [1, 5],
        [3, 2],
        [5, 0]
      ]);
      this.c.fillStyle = 'rgba(240, 97, 163, .5)';
      this.c.fill();
  
      this.gradient = this.c.createLinearGradient(10, 0, 0, 10);
      colorStop(this.gradient, [
        [0, '#4e60aa'],
        [.5, '#f061a3'],
        [1, '#f97862']
      ]);
      
  
      this.c.beginPath();
      this.c.moveTo(5, 0);
      drawLine(this.c, [
        [8, 3],
        [8, 12],
        [5, 14],
        [2, 13],
        [0, 11],
        [1, 5],
        [3, 2],
        [5, 0],
        [5, 14]
      ]);
      this.c.moveTo(3, 2);
      drawLine(this.c, [
        [5, 4],
        [8, 3]
      ]);
      this.c.moveTo(3, 2);
      drawLine(this.c, [
        [3, 6],
        [5, 14]
      ]);
      this.c.moveTo(1, 5);
      drawLine(this.c, [
        [3, 6],
        [2, 13]
      ]);
      this.c.moveTo(5, 4);
      this.c.lineTo(8, 12);
      this.c.lineWidth = 2/this.scale;
      this.c.strokeStyle = this.gradient;
      this.c.stroke();
      this.c.restore();
    }
  };

  this.randomize();
}

function Player(game) {
  this.game = game;
  this.c = game.ctx;
  this.x = this.game.halfWidth;
  this.y = this.game.halfHeight;
  this.scale = 1;
  this.rotate = 90;
  this.canvas = document.createElement('canvas');
  this.c = this.canvas.getContext('2d');
  this.isMoving = false;
  this.moveLeft = true;
  this.speed = 50;

  this.update = function(dt) {
    if(this.rotate > 360)
      this.rotate = 0;

    if(this.rotate < 0)
      this.rotate = 360;

    if(this.isMoving)
      this.rotate += this.moveLeft ? (dt * this.speed) : -(dt * this.speed);
  };

  this.changeDir = function() {
    this.moveLeft = !this.moveLeft;
    this.speed += 5;
  };

  this.draw = function(dt) {
    this.game.ctx.save();
    this.game.ctx.translate( this.game.canvas.width / 2, this.game.canvas.height / 2);
    this.game.ctx.rotate( this.rotate * Math.PI / 180);
    this.game.ctx.translate( -(this.game.canvas.width / 2), -(this.game.canvas.height / 2) );
    this.game.ctx.drawImage( this.canvas, this.game.halfWidth - (this.canvas.width / 2), this.game.halfHeight - (this.canvas.height / 2) );
    this.game.ctx.restore();
  };

  this.render = function() {
    this.canvas.width = this.canvas.height = Math.min(this.game.canvas.width, this.game.canvas.height);
    this.scale = parseInt(this.canvas.width / 80, 10);
    this.distance = (this.canvas.height - (this.scale * 20)) / 2;

    this.c.save();
    this.c.translate((this.canvas.width / 2) - ((this.scale * 20) / 2), this.canvas.height - (this.scale * 12) - 20);
    this.c.scale(this.scale, this.scale);

    this.c.beginPath();
    this.c.moveTo(5, 3);
    drawLine(this.c, [
      [8, 3],
      [8, 4],
      [4, 4],
      [5, 3]
    ]);
    this.c.moveTo(12, 3);
    drawLine(this.c, [
      [15, 3],
      [16, 4],
      [12, 4],
      [12, 3]
    ]);
    this.c.moveTo(4,10);
    drawLine(this.c, [
      [16, 10],
      [15, 11],
      [5, 11],
      [4, 10]
    ]);
    this.c.rect(0, 6, 1, 2);
    this.c.rect(5, 6, 10, 2);
    this.c.rect(19, 6, 1, 2);
    this.c.rect(1, 11, 3, 1);
    this.c.rect(16, 11, 3, 1);
    this.c.lineWidth = 2/this.scale;
    this.c.strokeStyle = '#000';
    this.c.stroke();
    this.c.fillStyle = 'rgba(0, 0, 0, .7)';
    this.c.fill();
    this.c.closePath();

    this.c.beginPath();
    this.c.fillStyle = 'rgba(255, 255, 255, .7)';
    this.c.rect(4, 6, 1, 1);
    this.c.rect(15, 6, 1, 1);
    this.c.fill();
    this.c.closePath();

    this.c.beginPath();
    this.c.fillStyle = 'rgba(255, 0, 0, .5)';
    this.c.moveTo(1, 6);
    drawLine(this.c, [
      [4, 6],
      [4, 7],
      [5, 7],
      [5, 8],
      [1, 8],
      [1, 6]
    ]);
    this.c.moveTo(16, 6);
    drawLine(this.c, [
      [19, 6],
      [19, 8],
      [15, 8],
      [15, 7],
      [16, 7],
      [16, 6]
    ]);
    this.c.fill();
    this.c.closePath();

    this.c.beginPath();
    this.c.fillStyle = 'rgba(78, 96, 170, .7)';
    this.c.moveTo(5, 0);
    drawLine(this.c, [
      [15, 0],
      [17, 3],
      [19, 4],
      [20, 5],
      [20, 6],
      [0, 6],
      [0, 5],
      [1, 4],
      [3, 3],
      [5, 0],
      [5, 1],
      [5, 3],
      [4, 4],
      [8, 4],
      [8, 3],
      [12, 3],
      [12, 4],
      [16, 4],
      [15, 3],
      [15, 1],
      [5, 1],
      [5, 0]
    ]);
    this.c.moveTo(0, 8);
    drawLine(this.c, [
      [20, 8],
      [20, 9],
      [19, 11],
      [15, 11],
      [16, 10],
      [4, 10],
      [5, 11],
      [1, 11],
      [0, 9],
      [0, 8]
    ]);
    this.c.fill();
    this.c.closePath();

    this.c.beginPath();
    this.c.moveTo(5, 0);
    drawLine(this.c, [
      [15, 0],
      [17, 3],
      [19, 4],
      [20, 5],
      [20, 9],
      [19, 11],
      [1, 11],
      [0, 9],
      [0, 5],
      [1, 4],
      [3, 3],
      [5, 0]
    ]);
    this.c.moveTo(0, 5);
    this.c.lineTo(20, 5);
    this.c.moveTo(0, 9);
    this.c.lineTo(20, 9);
    this.c.rect(5, 1, 10, 2);
    this.c.rect(8, 3, 4, 1);
    this.c.rect(1, 6, 4, 2);
    this.c.rect(4, 6, 1, 1);
    this.c.rect(15, 6, 4, 2);
    this.c.rect(15, 6, 1, 1);
    this.c.lineWidth = 2/14;
    this.c.strokeStyle = '#4e60aa';
    this.c.stroke();
    this.c.closePath();
    this.c.restore();

    var temp = new Image();

    temp.src = this.canvas.toDataURL();

    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);

    temp.onload = function() {
      this.c.save();
      this.c.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.c.rotate(-90 * Math.PI / 180);
      this.c.translate(-(this.canvas.width / 2), -(this.canvas.height / 2));
      this.c.drawImage(temp, 0, 0);
      this.c.restore();
    }.bind(this);
  };

  this.resize = function() {
    this.x = this.game.halfWidth;
    this.y = this.game.halfHeight;
    this.render();
  };
}

// states

function Gameplay(game) {
  this.game = game;
  this.bg = new Bg(this.game);
  this.player = new Player(this.game);

  console.log('gamplay');
  this.init = function() {
    this.backgroundObstacles = [];
    this.foregroundObstacles = [];
    this.spacePressed = false;
    this.points = 0;
    this.best = 0;
    this.gameover = false;
    this.player.isMoving = false;
    this.player.rotate = 90;
    this.timer = undefined;
    this.pointsTimer = undefined;
    this.player.speed = 50;
  };

  this.keyUp = function(e) {
    if(e.keyCode === 32 || e.type === 'touchend') {
      this.spacePressed = false;
    }
  };

  this.keyDown = function(e) {
    if(!this.player.isMoving) {
      this.player.isMoving = true;
      if(!this.timer)
        this.timer = setTimeout(function() { this.addObstacle() }.bind(this), 1000);
      if(!this.pointsTimer)
        this.pointsTimer = setInterval(function() { this.points++; }.bind(this), 100);
    }

    if((e.keyCode === 32|| e.type === 'touchstart') && !this.spacePressed && this.player.isMoving) {
      if(!this.gameover) {
        this.spacePressed = true;
        this.player.changeDir();
      } else {
        this.init();
      }
    }
  };

  this.update = function(dt) {
    if(!this.gameover) {
      this.bg.update(dt);
      for(var o = 0; o < this.backgroundObstacles.length; o++) {
        if(this.backgroundObstacles[o] && this.backgroundObstacles[o].lives) {
          this.backgroundObstacles[o].update(dt);
          if(this.backgroundObstacles[o].currentDistance >= this.player.distance) {
            if(this.collide(this.backgroundObstacles[o])) {
              this.setGameover();
            } else {
              this.foregroundObstacles.push(this.backgroundObstacles[o]);
              delete this.backgroundObstacles[o];
            }
          }
        }
      }
      
      this.player.update(dt);
  
      for(var o = 0; o < this.foregroundObstacles.length; o++) {
        if(this.foregroundObstacles[o] && this.foregroundObstacles[o].lives) {
          this.foregroundObstacles[o].update(dt);
        } else {
          delete this.foregroundObstacles[o];
        }
      }
    }
  };

  this.collide = function(obstacle) {
    var angle = (Math.atan2(obstacle.y - this.game.halfHeight, obstacle.x - this.game.halfWidth) * 180 / Math.PI)
    if(angle < 0)
      angle += 360;
      
    if(this.player.rotate - 20 < angle && this.player.rotate + 20 > angle) {
      return true;
    }
    
    return false;
  };

  this.setGameover = function() {
    this.best = 0;
    this.gameover = true;

    if (typeof(Storage) !== "undefined") {
      var best = parseInt(localStorage.getItem("bestScore"), 10) || 0;
      if(this.points > best) {
        this.best = this.points;
        localStorage.setItem("bestScore", this.points.toString());
      } else {
        this.best = best;
      }
    }

    clearTimeout(this.timer);
    clearInterval(this.pointsTimer);
  };

  this.drawGameover = function(dt) {
    var gameoverTxt = 'GAME OVER';
    var bestTxt = 'BEST: ' + this.best.toString();
    var scoreTxt = 'SCORE: ' + this.points.toString();
    this.game.ctx.save();
    this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.game.ctx.fillRect(0, 0, this.game.width, this.game.height);
    this.game.ctx.fillStyle = '#f061a3';
    this.game.ctx.font = "48px Arial";
    var gotW = this.game.ctx.measureText(gameoverTxt).width;
    this.game.ctx.fillText(gameoverTxt, this.game.halfWidth - (gotW / 2), this.game.halfHeight / 2);
    this.game.ctx.fillStyle = '#fff';
    this.game.ctx.font = "32px Arial";
    var bW = this.game.ctx.measureText(bestTxt).width;
    this.game.ctx.fillText(bestTxt, this.game.halfWidth - (bW / 2), this.game.halfHeight - 30);
    var sW = this.game.ctx.measureText(scoreTxt).width;
    this.game.ctx.fillText(scoreTxt, this.game.halfWidth - (sW / 2), this.game.halfHeight + 30);
    var txt = isMobile() ? 'Tap' : 'Spacebar';
    txt += ' To Restart';
    this.game.ctx.save();
    this.game.ctx.font = "28px Arial";
    var len = this.game.ctx.measureText(txt.toUpperCase()).width;
    this.game.ctx.fillStyle = 'rgba(240, 97, 163, .9)';
    this.game.ctx.fillRect(
      (this.game.width / 2) - (len / 2) - 4,
      (this.game.height / 2) + 122,
      len+8,
      36
    );
    this.game.ctx.fillStyle = '#fff';
    this.game.ctx.fillText(txt.toUpperCase(), (this.game.width / 2) - (len / 2), (this.game.height / 2) + 150);
    this.game.ctx.restore();
    this.game.ctx.restore();
  };

  this.draw = function(dt) {
    this.bg.draw()
    for(var o = 0; o < this.backgroundObstacles.length; o++) {
      if(this.backgroundObstacles[o] && this.backgroundObstacles[o].lives) {
        this.backgroundObstacles[o].draw(dt);
      }
    }

    this.player.draw(dt);

    for(var o = 0; o < this.foregroundObstacles.length; o++) {
      if(this.foregroundObstacles[o] && this.foregroundObstacles[o].lives) {
        this.foregroundObstacles[o].draw(dt);
      }
    }

    this.drawPoints();
    this.drawSpeed();
    if(!this.player.isMoving)
      this.drawStart();

    if(this.gameover)
      this.drawGameover();
  };

  this.resize = function() {
    this.bg.resize();
    this.backgroundObstacles = [];
    this.foregroundObstacles = [];

    this.player.resize();
  };

  this.addObstacle = function() {
    this.backgroundObstacles.push(new Obstacle(this.game));
    clearTimeout(this.timer);
    this.timer = setTimeout(function() { this.addObstacle() }.bind(this), random(1000, 3000));
  };

  this.drawPoints = function() {
    var txt = ('Points: ' + this.points.toString()).toUpperCase();
    this.game.ctx.save();
    this.game.ctx.font = "22px Arial";
    this.game.ctx.fillStyle = 'rgba(240, 97, 163, .9)';
    this.game.ctx.fillRect(16, 18, this.game.ctx.measureText(txt).width + 8, 28);
    this.game.ctx.fillStyle = '#fff';
    this.game.ctx.fillText(txt, 20, 40);
    this.game.ctx.restore();
  };

  this.drawSpeed = function() {
    var txt = ('Speed: ' + this.player.speed.toString()).toUpperCase();
    this.game.ctx.save();
    this.game.ctx.font = "22px Arial";
    var len = this.game.ctx.measureText(txt).width;
    this.game.ctx.fillStyle = 'rgba(240, 97, 163, .9)';
    this.game.ctx.fillRect(this.game.width - len - 24, 18, len + 8, 28);
    this.game.ctx.fillStyle = '#fff';
    this.game.ctx.fillText(txt, this.game.width - len - 20, 40);
    this.game.ctx.restore();
  };

  this.drawStart = function() {
    var txt = isMobile() ? 'Tap' : 'Press Spacebar';
    txt += ' To Start';
    this.game.ctx.save();
    this.game.ctx.font = "28px Arial";
    var len = this.game.ctx.measureText(txt.toUpperCase()).width;
    this.game.ctx.fillStyle = 'rgba(240, 97, 163, .9)';
    this.game.ctx.fillRect(
      (this.game.width / 2) - (len / 2) - 4,
      (this.game.height / 2) - 18,
      len+8,
      36
    );
    this.game.ctx.fillStyle = '#fff';
    this.game.ctx.fillText(txt.toUpperCase(), (this.game.width / 2) - (len / 2), (this.game.height / 2) + 10);
    this.game.ctx.restore();
  };

  this.bindKeys = function() {
    document.addEventListener('keyup', this.keyUp);
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('touchstart', this.keyDown);
    document.addEventListener('touchend', this.keyUp);
  };

  this.destroy = function() {
    clearTimeout(this.timer);
    clearInterval(this.pointsTimer);
    document.removeEventListener('keyup', this.keyUp);
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('touchend', this.keyUp);
    document.removeEventListener('touchstart', this.keyDown);
  };

  this.keyUp = this.keyUp.bind(this);
  this.keyDown = this.keyDown.bind(this);
  this.init();
  this.bindKeys();
}

function MainMenu(game) {
  this.game = game;
  this.c = game.ctx;
  this.bg = new Bg(this.game);

  this.init = function() {

  };

  this.drawTitle = function() {
    var gradient = this.c.createLinearGradient(0, 0, 0, 5);
    colorStop(gradient, [
      [0, '#251031'],
      [.2, '#7244cb'],
      [.4, '#b0b4fb'],
      [.5, '#fcfcfc'],
      [.51, '#040404'],
      [.7, '#720b81'],
      [1, '#c9c0db']
    ]);

    this.c.save();
    this.c.translate(this.game.halfWidth - 176, this.game.halfHeight / 2);
    this.c.scale(16, 16);
    this.c.beginPath();
    this.c.moveTo(0,0);
    drawLine(this.c, [
      [2,0],
      [2,3],
      [4,3],
      [4,5],
      [0,5],
      [0,0]
    ]);
    this.c.moveTo(5, 5);
    drawLine(this.c, [
      [7,0],
      [9,5],
      [5,5]
    ]);
    this.c.moveTo(10, 0);
    drawLine(this.c, [
      [14,0],
      [13,3],
      [14,3],
      [14,5],
      [10,5],
      [11,2],
      [10,2],
      [10,0]
    ]);
    this.c.moveTo(15, 0);
    drawLine(this.c, [
      [18,0],
      [18,1.5],
      [17,1.5],
      [17,2],
      [18,2],
      [18,3.5],
      [17,3.5],
      [17,4],
      [18,4],
      [18,5],
      [15,5],
      [15,0]
    ]);
    this.c.moveTo(19, 0);
    drawLine(this.c, [
      [21,0]
    ]);
    this.c.bezierCurveTo(22.5, 0, 22.5, 3, 21, 3);
    drawLine(this.c, [
      [22,5],
      [19,5],
      [19,0]
    ]);
    this.c.fillStyle = gradient;
    this.c.fill();
    this.c.strokeStyle = '#000293';
    this.c.lineWidth = .15;
    this.c.stroke();
    this.c.restore();
  };

  this.drawSubtitle = function() {
    var gradient = this.c.createLinearGradient(0, 0, 0, 5);
    colorStop(gradient, [
      [0, '#fb6cfa'],
      [1, '#f216f4']
    ]);
    this.c.save();
    this.c.translate(this.game.halfWidth + 10, (this.game.halfHeight / 2) + 50);
    this.c.scale(8, 8);
    this.c.beginPath();
    this.c.moveTo(0,1);
    drawLine(this.c, [
      [2,0],
      [5,3],
      [2,2],
      [2,7],
      [5,6],
      [2,9],
      [0,7],
      [0,1]
    ]);
    this.c.moveTo(7,1);
    drawLine(this.c, [
      [9,0],
      [10,0],
      [21,1],
      [10,1],
      [8,2],
      [8,7],
      [10,7],
      [11,6],
      [11,4],
      [12,5],
      [12,6],
      [13,6],
      [10,9],
      [9,8],
      [8,9],
      [6,7],
      [7,1]
    ]);
    this.c.moveTo(14,1);
    drawLine(this.c, [
      [16,2],
      [13,9],
      [14,1]
    ]);
    this.c.moveTo(13,0);
    drawLine(this.c, [
      [20,0],
      [21,1],
      [22,1],
      [15,5],
      [19,9],
      [13,5],
      [20,1],
      [13,2],
      [13,0],
    ]);
    this.c.fillStyle = gradient;
    this.c.fill();
    this.c.restore();
  };

  this.drawStart = function() {
    var txt = isMobile() ? 'Tap' : 'Press Spacebar';
    txt += ' To Start';
    this.game.ctx.save();
    this.game.ctx.font = "28px Arial";
    var len = this.game.ctx.measureText(txt.toUpperCase()).width;
    this.game.ctx.fillStyle = 'rgba(240, 97, 163, .9)';
    this.game.ctx.fillRect(
      (this.game.width / 2) - (len / 2) - 4,
      (this.game.height / 2) - 18,
      len+8,
      36
    );
    this.game.ctx.fillStyle = '#fff';
    this.game.ctx.fillText(txt.toUpperCase(), (this.game.width / 2) - (len / 2), (this.game.height / 2) + 10);
    this.game.ctx.restore();
  };

  this.update = function(dt) {
    this.bg.update(dt);
  };

  this.draw = function(dt) {
    this.bg.draw(dt);
    this.drawTitle();
    this.drawSubtitle();
    this.drawStart();
  };

  this.resize = function() {
    this.bg.resize();
  };

  this.keyDown = function(e) {
    if((e.keyCode === 32|| e.type === 'touchstart')) {
      this.game.setState('gameplay');
    }
  }

  this.bindKeys = function() {
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('touchstart', this.keyDown);
  };

  this.destroy = function() {
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('touchstart', this.keyDown);
  };

  this.draw = this.draw.bind(this);
  this.keyDown = this.keyDown.bind(this);
  this.bindKeys();
}

// game object
function Game() {
  this.canvas = document.querySelector('#game');
  this.ctx = this.canvas.getContext('2d');
  this.lastTime = (new Date()).getTime();
  this.halfWidth = this.canvas.width / 2;
  this.halfHeight = this.canvas.height / 2;
  this.states = {
    menu: MainMenu,
    gameplay: Gameplay,
  };
  this.currentState = null;

  

  this.run = function() {
    this.resize();
    window.addEventListener('resize', this.resize.bind(this), true);
    this.loop();
    console.log('run game');
  };

  this.resize = function() {
    this.canvas.width = this.width = window.innerWidth;
    this.canvas.height = this.height = window.innerHeight;
    this.halfWidth = this.canvas.width / 2;
    this.halfHeight = this.canvas.height / 2;
    this.currentState.resize();
  };

  this.setState = function(stateName) {
    if(this.currentState)
      this.currentState.destroy();
    this.currentState = new this.states[stateName](this);
    this.currentState.resize();
  };

  this.update = function(dt) {
    this.currentState.update(dt)
  }

  this.draw = function(dt) {
    this.currentState.draw(dt);
  };

  this.loop = function() {
    window.requestAnimFrame(this.loop);
    
    var currentTime = (new Date()).getTime();

    var dt = (currentTime - this.lastTime) / 1000;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.update(dt);
    this.draw(dt);

    this.lastTime = currentTime;
  };

  this.loop = this.loop.bind(this);
}

var game = new Game();

game.setState('menu');
game.run();