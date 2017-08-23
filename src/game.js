//background
function Bg(game) {
  this.game = game;
  this.canvas = game.canvas;
  this.ctx = game.ctx;
  this.x = 0;
  this.y = 0;
  this.maxSize = 0;

  this.bgCanvas = document.createElement('canvas');

  this.update = function() {
    this.maxSize = Math.max(this.canvas.width, this.canvas.height);
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
    var gapWidth = 3;
    var gap = parseInt(this.maxSize / gapWidth);

    var x = this.game.halfWidth,
        y = this.game.halfHeight;

    this.ctx.save();
    for(var c = 0; c < gap + 1; c++) {
      if((gapWidth * (c * c)) * 2 < this.maxSize + 100) {
        this.ctx.beginPath()
        this.ctx.arc(x, y, (gapWidth * (c * c)), 0, 2 * Math.PI);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#326ade';
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(x, y, (gapWidth * (c * c)), 0, 2 * Math.PI);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = 'rgba(78, 176, 237, .2)';
        this.ctx.stroke();
      }
    }
    this.ctx.restore();

    for(var l = 0; l < 30 + 1; l++) {
      this.ctx.save();
      this.ctx.beginPath()
      this.ctx.moveTo(x, y);
      this.ctx.rotate((12 * l) * (Math.PI/180));
      this.ctx.lineTo(this.maxSize, this.game.halfHeight);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#326ade';
      this.ctx.stroke();
      // this.ctx.beginPath();
      // this.ctx.arc(x, y, (gapWidth * (c * c)), 0, 2 * Math.PI);
      // this.ctx.lineWidth = 4;
      // this.ctx.strokeStyle = 'rgba(78, 176, 237, .2)';
      // this.ctx.stroke();
      this.ctx.restore();
    }
  };

  this.draw = function() {
    this.drawGradient();
    this.drawRadials();
    this.drawGrid();
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