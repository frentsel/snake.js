var snake = new function() {

  var config = { size: 0 };

  this.food = {};
  this.items = [{ x: 0, y: 0, direction: 'right' }];

  this.catchFood = function() {

    var first = this.items[0];
    var direction = first.direction;
    var food = Object.assign({}, this.food);

    if (first.x === food.x && first.y === food.y) {
      this.items.unshift(food);
      first = this.items[0];
      first.direction = direction;
      this[first.direction](first);
      this.addFood();
    }
  }

  this.addFood = function() {

    var food = this.food;

    food.x = _.random(1, config.size - 1);
    food.y = _.random(0, config.size - 1);

    var match = this.items.find(item => {
      return item.x === food.x && item.y === food.y;
    });

    if (match) {
      this.addFood();
    }
  }

  this.isAlive = function() {

    var first = this.items[0];
    var match = this.items.find((item, index) => {
      return index > 0 && (item.x === first.x && item.y === first.y);
    });

    return !match;
  }

  this.move = function(direction) {

    var next;

    _.forEachRight(this.items, (item, index) => {

      next = this.items[index - 1];

      if (next) {
        item.direction = next.direction;
      }
    });

    this.items[0].direction = direction;

    this.items.forEach((item) => {
      this[item.direction](item);
    });

    this.catchFood();

    return this.items;
  }

  this.up = function(item) {

    if (item.y > 0) {
      item.y--;
    } else {
      item.y = config.size - 1;
    }
  }

  this.down = function(item) {

    if (item.y < config.size - 1) {
      item.y++;
    } else {
      item.y = 0;
    }
  }

  this.left = function(item) {

    if (item.x > 0) {
      item.x--;
    } else {
      item.x = config.size - 1;
    }
  }

  this.right = function(item) {

    if (item.x < config.size - 1) {
      item.x++;
    } else {
      item.x = 0;
    }
  }

  this.init = function(size) {
    config.size = size;
    this.addFood();
  }
}

var render = new function() {

  var config = {
    debugMode: true,
    selector: null,
    size: 0
  };

  this.run = function(matrix, food) {

    var size = {
      width: config.size * 10,
      height: config.size * 10,
    };
    var canvas = document.querySelector(config.selector);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.fillStyle = '#000000';

    canvas.width = size.width;
    canvas.height = size.height;

    matrix.forEach(el => {
      ctx.fillRect(el.x * 10, el.y * 10, 10, 10);
    });

    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);

    if (config.debugMode) {
      console.clear();
      console.log('food');
      console.table(food);
      console.log('matrix');
      console.table(matrix);
    }
  }

  this.gameOver = function() {
    alert('Game Over!');
  }

  this.init = function(selector, size) {
    config.selector = selector;
    config.size = size;
  }
}

var app = new function() {

  var config = {
    timerId: null,
    areaSelector: '#area',
    direction: 'right',
    speed: 500
  };

  var setDirection = function(event) {

    var direction = event.key.replace('Arrow', '').toLowerCase();
    var mapDirections = {
      up: 1,
      down: 1,
      left: 2,
      right: 2
    };

    if (mapDirections[direction] && mapDirections[config.direction] !== mapDirections[direction]) {
      config.direction = direction;
    }
  }

  var run = function() {

    snake.move(config.direction);
    render.run(snake.items, snake.food);

    if (!snake.isAlive()) {
      clearInterval(config.timerId);
      render.gameOver();
    }
  };

  this.init = function(size) {

    render.init(config.areaSelector, size);
    snake.init(size);
    config.timerId = setInterval(run, config.speed);
    document.querySelector('body').onkeydown = setDirection;
  }
}

app.init(12);
