var snake = new function() {

  var size = 0;

  this.food = {};
  this.items = [
    {
      x: 0,
      y: 0,
      direction: 'right'
    }
  ];

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

    food.x = _.random(1, size - 1);
    food.y = _.random(0, size - 1);

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
    item.y > 0 ? item.y-- : item.y = size - 1;
  }

  this.down = function(item) {
    item.y < size - 1 ? item.y++ : item.y = 0;
  }

  this.left = function(item) {
    item.x > 0 ? item.x-- : item.x = size - 1;
  }

  this.right = function(item) {
    item.x < size - 1 ? item.x++ : item.x = 0;
  }

  this.init = function(_size) {
    size = _size;
    this.addFood();
  }
}

var render = new function() {

  var size = 0;

  this.gameOver = function(score) {
    alert(`Game Over!, Your score is ${score}`);
  };

  this.run = function(matrix, food) {

    var canvas = document.querySelector('#area');
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#000';

    canvas.width = canvas.height = size;

    matrix.forEach(el => {
      ctx.fillRect(el.x * 10, el.y * 10, 10, 10);
    });

    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);

    console.clear();
    console.log('food');
    console.table(food);
    console.log('matrix');
    console.table(matrix);
  }

  this.init = function(_size) {
    size = _size * 10;
  }
}

var app = new function() {

  var timerId = null;
  var direction = 'right';
  var speed = 300;
  var run = function() {

    snake.move(direction);
    render.run(snake.items, snake.food);

    if (!snake.isAlive()) {
      clearInterval(timerId);
      render.gameOver(snake.items.length);
    }
  };

  this.setSpeed = function(time) {

    var speed = 1 * time;

    if (_.isFinite(speed)) {
      clearInterval(timerId);
      timerId = setInterval(run, speed);
    }
  }

  this.init = function(size) {

    var _direction;
    var mapDirections;

    render.init(size);
    snake.init(size);
    timerId = setInterval(run, speed);
    document.body.onkeydown = function({ key }) {

      _direction = key.replace('Arrow', '').toLowerCase();
      mapDirections = {
        up: 1,
        down: 1,
        left: 2,
        right: 2
      };

      if (mapDirections[_direction] && mapDirections[direction] !== mapDirections[_direction]) {
        direction = _direction;
      }
    };
  }
}

app.init(12);
