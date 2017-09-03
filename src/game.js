function makeid(max) {
  var max = max || 15
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < max; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Vector2 - https://gist.github.com/edwerner/3446102
var Vector2 = function () {
  this._x = 0;
  this._y = 0;
  this.DEGRAD = 0;
};

Vector2.prototype.initialize = function (x, y) {
  _x = x;
  _y = y;
};

Vector2.prototype.getX = function () {
  return _x;
};

Vector2.prototype.setX = function (x) {
  _x = x;
};

Vector2.prototype.getY = function () {
  return _y;
};

Vector2.prototype.setY = function (y) {
  _y = y;
};

// ------------------- public methods ------------------- //

Vector2.prototype.add = function (vector) {
  return new Vector2(_x + vector.x, _y + vector.y);
};

Vector2.prototype.subtract = function (vector) {
  return new Vector2(_x - vector.x, _y - vector.y);
};

Vector2.prototype.multiply = function (vector) {
  return new Vector2(_x * vector.x, _y * vector.y);
};

Vector2.prototype.divide = function (vector) {
  return new Vector2(_x / vector.x, _y / vector.y);
};

Vector2.prototype.distance = function (vector) {
  var deltaX = _x - vector.x;
  var deltaY = _y - vector.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

Vector2.prototype.distanceSqr = function (vector) {
  var deltaX = _x - vector.x;
  var deltaY = _y - vector.y;
  return (deltaX * deltaX + deltaY * deltaY);
};

Vector2.prototype.magnitude = function () {
  return Math.sqrt(_x * _x + _y * _y);
};

Vector2.prototype.normalize = function () {
  var mag = Math.sqrt(_x * _x + _y * _y);

  if (mag === 0) {
    _x = 0;
    _y = 0;
  } else {
    _x = _x / mag;
    _y = _y / mag;
  }
};

Vector2.prototype.getNormalized = function () {
  var mag = Matn.sqrt(_x * _x + _y * _y);
  return new Vector2(_x / mag, _y / mag);
};

Vector2.prototype.getAngle = function () {
  return Math.atan2(_y, _x) * 180 / Math.PI;
};

Vector2.prototype.degToVec = function (deg) {
  var rad = deg * DEGRAD;
  return new Vector2(Math.cos(rad), Math.sin(rad));
};

Vector2.prototype.radToVec = function () {
  return new Vector2(Math.sin(rad), Math.cos(rad));
};

// ---------------- additional vector methods ---------------- //

Vector2.prototype.dot = function (vector) {
  return (_x * vector.x + _y * vector.y);
};

Vector2.prototype.rotate = function (deg) {
  var rad = deg * DEGRAD;
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);
  _x = _x * cos - _y * sin;
  _y = _y * cos + _x * sin;
};

Vector2.prototype.perpRight = function () {
  return new Vector2(-_y, _x);
};

Vector2.prototype.toString = function () {
  return ("x : " + int(_x * 100) / 100 + ", \ty : " + int(_y * 100) / 100);
};



//background
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
    this.circles = new Object();
    for(var c = 0; c < this.gridGap + 1; c++) {
      if((this.gridGapWidth * (c * c)) * 2 < this.maxSize + 100) {
        this.circles[makeid()] = (this.gridGapWidth * c * c);
      }
    }
  };

  this.setupStars = function() {
    this.stars = new Object();

    for(var s = 0; s < this.maxSize / 10; s++) {
      this.stars[makeid()] = {
        x: random(0, this.game.width),
        y: random(0, this.game.height),
        r: random(1,3),
        o: random(1, 10) / 10
      }
    }
  };

  this.update = function(dt) {
    this.gridGap = parseInt(this.maxSize / this.gridGapWidth);

    if(Object.keys(this.stars).length === 0) {
      this.setupStars();
    }

    if(Object.keys(this.circles).length === 0) {
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

function Obstacle(game) {
  this.game = game;
  this.x = this.startX = this.game.halfWidth;
  this.y = this.startY = this.game.halfHeight;
  this.speed = 150;
  this.width = 40;
  this.height = 50;
  this.moving = true;
  this.scale = 1;
  // this.destX = (this.game.canvas.width - (this.game.canvas.width / 2)) - this.game.halfWidth;
  // this.destY = this.game.canvas.height - this.game.halfHeight;

  // Types:
  // 0: QUARTZ
  // 1: QUBIC
  // 2: LONG
  // 3: DIAMOND
  // 4: STONE
  // 5: TRINGLE

  this.quartz = function(dt) {
    this.gradient = this.game.ctx.createLinearGradient(0, 0, 10, 0);
    this.gradient.addColorStop(0, '#4e60aa');
    this.gradient.addColorStop(.5, '#f061a3');
    this.gradient.addColorStop(1, '#f97862');
    this.scale += dt * 5;

    this.game.ctx.translate(this.x, this.y);
    this.game.ctx.scale(this.scale, this.scale);
    this.game.ctx.rotate(45 * Math.PI / 180);

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
    this.game.ctx.fillStyle = this.gradient;
    this.game.ctx.fill();
    

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
    this.game.ctx.strokeStyle = '#fcbfde';
    this.game.ctx.stroke();
  }

  this.update = function(dt) {
    if(this.moving && this.distance) {
      this.x += this.directionX * this.speed * dt;
      this.y += this.directionY * this.speed * dt;
      if(Math.sqrt(Math.pow(this.x - this.startX,2) + Math.pow(this.x - this.startY,2)) >= this.distance) {
        this.x = this.game.halfWidth;
        this.y = this.game.halfHeight;
        this.scale = 1;
        // this.moving = false;
      }
    }
  };

  this.resize = function() {
    this.x = this.startX = this.game.halfWidth;
    this.y = this.startY = this.game.halfHeight;
    this.endX = this.game.canvas.width;
    this.endY = this.game.canvas.height;
    this.distance = Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));
    this.directionX = (this.endX - this.startX) / this.distance;
    this.directionY = (this.endY- this.startY) / this.distance;
  };

  this.draw = function(dt) {
    if(this.moving) {
      this.game.ctx.save();
      this.quartz(dt);
      this.game.ctx.restore();
    }
  };

  this.quartz = this.quartz.bind(this);
}

//game object
function Game() {
  this.canvas = document.querySelector('#game');
  this.ctx = this.canvas.getContext('2d');
  this.lastTime = (new Date()).getTime();
  this.halfWidth = this.canvas.width / 2;
  this.halfHeight = this.canvas.height / 2;

  this.bg = new Bg(this);

  this.o = new Obstacle(this);

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

    this.bg.resize();
    this.o.resize();
  };

  this.update = function(dt) {
    this.bg.update(dt);
    this.o.update(dt);
  }

  this.draw = function(dt) {
    this.bg.draw()
    this.o.draw(dt);
  };

  this.loop = function() {
    window.requestAnimationFrame(this.loop);
    
    currentTime = (new Date()).getTime();

    dt = (currentTime - this.lastTime) / 1000;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.update(dt);
    this.draw(dt);

    this.lastTime = currentTime;
  };

  this.loop = this.loop.bind(this);
}

var game = new Game();

game.run();