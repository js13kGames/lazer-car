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
    var gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#441541');
    gradient.addColorStop(.48, '#441541');
    gradient.addColorStop(.499, '#f742a3');
    gradient.addColorStop(.5, '#fa71b9');
    gradient.addColorStop(.501, '#f742a3');
    gradient.addColorStop(.52, '#271126');
    gradient.addColorStop(1, '#271126');
    
    this.ctx.save();
    this.ctx.fillStyle = gradient;
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

//game object
function Game() {
  this.canvas = document.querySelector('#game');
  this.ctx = this.canvas.getContext('2d');
  this.lastTime = (new Date()).getTime();
  this.halfWidth = this.canvas.width / 2;
  this.halfHeight = this.canvas.height / 2;

  this.bg = new Bg(this);

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
  };

  this.update = function(dt) {
    this.bg.update(dt);
  }

  this.draw = function(dt) {
    this.bg.draw()
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