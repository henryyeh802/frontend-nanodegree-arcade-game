// Enemies class
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x <= 505) {    // update enemy's position if not reach boundary
        this.x = this.x + this.speed * dt;
    } else {    // reset the enemy
        this.x = 0;
        this.y = rowPosArray[getRandomIntInclusive(0, 2)];
        this.speed = enemySpeedArray[getRandomIntInclusive(0, 2)];
    }

    // Handle collision with the Player
    if ( (player.x > (this.x - 80) && player.x < (this.x + 80)) && 
         (player.y === this.y) ) {
        player.reset();
        enemiesInit();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

let allEnemies = [];
const enemySpeedArray = [60, 120, 180];
const rowPosArray = [56, 139, 222];
const colPosArray = [0, 101, 202, 303, 404];

// Instantiate enemies
function enemiesInit() {
    allEnemies = [];

    for (let i = 0; i < 3; i++) {
        const enemy = new Enemy(0, rowPosArray[getRandomIntInclusive(0, 2)], enemySpeedArray[getRandomIntInclusive(0, 2)]);
        allEnemies.push(enemy);
    }
};

enemiesInit();

// Getting a random integer between two values, inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gems = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];

// Gem Class
let Gem = function() {
    this.collected = false;
    this.x = colPosArray[getRandomIntInclusive(0, 4)];
    this.y = rowPosArray[getRandomIntInclusive(0, 2)];
    this.sprite = gems[getRandomIntInclusive(0, 2)];
}

// Draw gem
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
// Update gem status
Gem.prototype.update = function() {
    let gem = this;

    // Player collects gem
    if ( (player.x === this.x) && (player.y === this.y) && (this.collected === false)) {
        this.collected = true;
        player.gem++;
        player.showGem();
        this.x = -100;      // move the gem off the screen
        setTimeout(function(){  // reset gem type and position after a random (1-10) seconds
            gem.x = colPosArray[getRandomIntInclusive(0, 4)];
            gem.y = rowPosArray[getRandomIntInclusive(0, 2)];
            gem.sprite = gems[getRandomIntInclusive(0, 2)];
            gem.collected = false;
        }, 1000*getRandomIntInclusive(1, 10));
    }
};

let allGems = [];

// Instantiate gems
function gemInit() {
    allGems = [];

    setTimeout(function() {
        const gem = new Gem();
        allGems.push(gem);
    }, 1000*getRandomIntInclusive(1,10));
};

gemInit();

var role = 'images/char-boy.png';

// Player class
let Player = function() {
    this.x = 202;
    this.y = 388;
    this.won = false;
    this.sprite = role;
    this.score = 0;
    this.gem = 0;
}

// reset player
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 388;
    this.won = false;
    this.score = 0;
    this.gem = 0;
    this.showScore();
    this.showGem();
}

// Show player score
Player.prototype.showScore = function() {
    const score = document.querySelector(".scoreboard .score");
    score.innerHTML = this.score;
}

// Show collected gem amount
Player.prototype.showGem = function() {
    const gem = document.querySelector(".scoreboard .gem");
    gem.innerHTML = this.gem;
}

// Update player status
Player.prototype.update = function() {
    // Once the player reaches the water the game is won.
    if (this.y < 53 && this.won === false) {
        this.won = true;
        this.score += 10;   // add 10 points for each win
        this.showScore();
        setTimeout(function() {
            alert("You won! Press any key to continue.");
            player.x = 202;
            player.y = 388;
            player.won = false;
            enemiesInit();
        }, 200);
    }
}

// Draw player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Player input handle function
Player.prototype.handleInput = function(input) {
    if (this.won === false) {
        switch (input) {
            case 'left':
                if (this.x > 0)
                    this.x = this.x - 101;
                break;
            case 'up':
                if (player.y > 0)
                   player.y = player.y - 83;
                break;
            case 'right':
                if (player.x <= 303)
                    player.x = player.x + 101;
                break;
            case 'down':
                if (player.y <= 305)
                    player.y = player.y + 83;
                break;
            case 'exit':  // restart the game
                window.location.reload();
                break;
            default:
        }    
    }
}

// Instantiate player
let player = new Player();

// This listens for key presses and sends the keys to the
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    console.log(e.keyCode);
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        88: 'exit'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});