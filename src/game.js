"use strict";

window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();


function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawLine(ctx, points) {
  for(var p = 0; p < points.length; p++) {
    ctx.lineTo(points[p][0], points[p][1]);
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
    this.gradient.addColorStop(0, '#441541');
    this.gradient.addColorStop(.48, '#441541');
    this.gradient.addColorStop(.499, '#f742a3');
    this.gradient.addColorStop(.5, '#fa71b9');
    this.gradient.addColorStop(.501, '#f742a3');
    this.gradient.addColorStop(.52, '#271126');
    this.gradient.addColorStop(1, '#271126');
    
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
    radialGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radialGradient.addColorStop(.01, 'rgba(255, 255, 255, .7)');
    radialGradient.addColorStop(.07, 'rgba(247, 66, 163, .5)');
    radialGradient.addColorStop(.2, 'rgba(247, 66, 163, .3)');
    radialGradient.addColorStop(.5, 'rgba(247, 66, 163, .1)');
    radialGradient.addColorStop(1, 'rgba(247, 66, 163, .0)');

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
      this.ctx.strokeStyle = 'rgba(195, 135, 255, ' + currentCircle / Object.keys(this.circles).length +')';
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.circles[c], 0, 2 * Math.PI);
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = 'rgba(78, 176, 237, ' + (currentCircle / Object.keys(this.circles).length) / 5 + ')';
      this.ctx.stroke();
      currentCircle++;
    }
    this.ctx.restore();

    var lineGradient = this.ctx.createRadialGradient(this.game.halfWidth, this.game.halfHeight, 1, this.game.halfWidth, this.game.halfHeight, this.maxSize);
    lineGradient.addColorStop(0, 'rgba(50, 106, 222, 0)');
    lineGradient.addColorStop(.2, 'rgba(195, 135, 255, 1)');
    lineGradient.addColorStop(1, '#c387ff');

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
  this.x = this.startX = this.game.halfWidth;
  this.y = this.startY = this.game.halfHeight;
  this.width = 40;
  this.height = 50;
  this.moving = true;
  this.scale = 1;
  this.lives = true;

  this.render = function(dt) {
    if(this.scale < 35)
      this.scale += dt * 5;

    this.game.ctx.translate(this.x, this.y);
    this.game.ctx.scale(this.scale, this.scale);
    this.game.ctx.rotate(this.rotate * Math.PI / 180);

    this.game.ctx.beginPath();
    this.game.ctx.moveTo(5, 0);
    this.game.ctx.lineTo(8, 3);
    this.game.ctx.lineTo(8, 12);
    this.game.ctx.lineTo(5, 14);
    this.game.ctx.lineTo(2, 13);
    this.game.ctx.lineTo(0, 11);
    this.game.ctx.lineTo(1, 5);
    this.game.ctx.lineTo(3, 2);
    this.game.ctx.lineTo(5, 0);
    this.game.ctx.fillStyle = 'rgba(240, 97, 163, .5)';
    this.game.ctx.fill();

    this.gradient = this.game.ctx.createLinearGradient(10, 0, 0, 10);
    this.gradient.addColorStop(0, '#4e60aa');
    this.gradient.addColorStop(.5, '#f061a3');
    this.gradient.addColorStop(1, '#f97862');
    

    this.game.ctx.beginPath();
    this.game.ctx.moveTo(5, 0);
    this.game.ctx.lineTo(8, 3);
    this.game.ctx.lineTo(8, 12);
    this.game.ctx.lineTo(5, 14);
    this.game.ctx.lineTo(2, 13);
    this.game.ctx.lineTo(0, 11);
    this.game.ctx.lineTo(1, 5);
    this.game.ctx.lineTo(3, 2);
    this.game.ctx.lineTo(5, 0);
    this.game.ctx.lineTo(5, 14);
    this.game.ctx.moveTo(3, 2);
    this.game.ctx.lineTo(5, 4);
    this.game.ctx.lineTo(8, 3);
    this.game.ctx.moveTo(3, 2);
    this.game.ctx.lineTo(3, 6);
    this.game.ctx.lineTo(5, 14);
    this.game.ctx.moveTo(1, 5);
    this.game.ctx.lineTo(3, 6);
    this.game.ctx.lineTo(2, 13);
    this.game.ctx.moveTo(5, 4);
    this.game.ctx.lineTo(8, 12);
    this.game.ctx.lineWidth = 2/this.scale;
    this.game.ctx.strokeStyle = this.gradient;
    this.game.ctx.stroke();
  };

  this.update = function(dt) {
    if(this.moving && this.distance) {
      this.x += this.directionX * this.speed * dt * 2;
      this.y += this.directionY * this.speed * dt * 2;
      if(Math.sqrt(Math.pow(this.x - this.startX,2) + Math.pow(this.x - this.startY,2)) >= this.distance) {
        this.lives = false;
      }
    }
  };

  this.resize = function() {
    this.x = this.startX = this.game.halfWidth;
    this.y = this.startY = this.game.halfHeight;
    this.randomize();
  };

  this.randomize = function() {
    this.rotate = random(0, 359);
    this.speed = random(50, 100);
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
      this.game.ctx.save();
      this.render(dt);
      this.game.ctx.restore();
    }
  };

  this.randomize();
}

function Player(game) {
  this.game = game;
  this.c = game.ctx;
  this.x = this.game.halfWidth;
  this.y = this.game.halfHeight;
  this.scale = 10;
  this.rotate = 0;

  this.update = function(dt) {

  };

  this.draw = function(dt) {
    this.c.save();
    this.c.translate(this.x - (10 * this.scale), this.y + (20 * this.scale));
    this.c.scale(this.scale, this.scale);

    // outline
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

    // b26afc

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
  };

  this.resize = function() {
    this.x = this.game.halfWidth;
    this.y = this.game.halfHeight;
  };
}

// states

function Gameplay(game) {
  this.game = game;
  this.obstacles = [];
  this.entities = [];

  console.log('gamplay');
  
  this.timer = setTimeout(function() { this.addObstacle() }.bind(this), 1000);

  this.bg = new Bg(this.game);

  this.player = new Player(this.game);

  this.update = function(dt) {
    this.bg.update(dt);
    this.player.update(dt);
    for(var o = 0; o < this.obstacles.length; o++) {
      if(this.obstacles[o] && this.obstacles[o].lives) {
        this.obstacles[o].update(dt);
      } else {
        delete this.obstacles[o];
      }
    }
  };

  this.draw = function(dt) {
    this.bg.draw()
    for(var o = 0; o < this.obstacles.length; o++) {
      if(this.obstacles[o] && this.obstacles[o].lives) {
        this.obstacles[o].draw(dt);
      }
    }
    this.player.draw(dt);
  };

  this.resize = function() {
    this.bg.resize();
    this.player.resize();
    for(var o = 0; o < this.obstacles.length; o++) {
      if(this.obstacles[o] && this.obstacles[o].lives) {
        this.obstacles[o].resize();
      }
    }
  };

  this.addObstacle = function() {
    this.obstacles.push(new Obstacle(this.game));
    clearTimeout(this.timer);
    this.timer = setTimeout(function() { this.addObstacle() }.bind(this), random(1000, 3000));
  };

  this.destroy = function() {
    clearTimeout(this.timer);
  };
}

// game object
function Game() {
  this.canvas = document.querySelector('#game');
  this.ctx = this.canvas.getContext('2d');
  this.lastTime = (new Date()).getTime();
  this.halfWidth = this.canvas.width / 2;
  this.halfHeight = this.canvas.height / 2;
  this.states = {
    // menu: MainMenu,
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

game.setState('gameplay');
game.run();