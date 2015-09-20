// Parameters for the game
var blockHeight = 83;
var blockWidth = 100;
var leftBound = 0;
var rightBound = 400;
var topBound = 48;
var bottomBound = 380;
var collisionParam = 45;
var bgmVolume = 1;
var bgmNum = 1;

// Functions for the game
// Control the BGM volume
var volumeCtrl = function() {
    if (bgm.paused) {
        bgmVolume = 1;
        bgm.play();
        document.getElementById("volume").src = "images/volume_max.png";
    } else {
        bgmVolume = 0;
        bgm.pause();
        document.getElementById("volume").src = "images/volume_min.png";
    }
};

// Control the BGM shuffle
var bgmShuffle = function() {
    var randomBgm = 1;
    while(randomBgm === bgmNum) {
        randomBgm = Math.floor(Math.random() * 4 + 1);
    }
    bgmNum = randomBgm;
    var bgmUrl = "sound/" + randomBgm + ".mp3";
    if (bgmVolume === 1) {
        document.getElementById("bgm").src = bgmUrl;
    }
};

// Enemies our player must avoid
var Enemy = function(initX, initY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = initX;
    this.y = initY;
    this.speed = speed;
    this.bugLine = (this.y - 60) / 85;
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

    // If enemy run out of the canvas, randomly reset the position and speed
    if (this.x > 600) {
        this.reset();
    }
    this.x = this.x + this.speed * dt;

    // Deal with collision
    if (this.bugLine === player.playerLine && 
        Math.abs(this.x - player.x) <= (blockWidth - collisionParam)) {
        var loseAudio = document.getElementById("lose");
        loseAudio.currentTime = 0;
        loseAudio.play();
        player.collision();
    }
};

Enemy.prototype.reset = function() {
    this.x = -100;
    this.y = Math.floor(Math.random() * 3) * 85 + 60;
    this.bugLine = (this.y - 60) / 85;
    this.randomSpeed();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Randomly generate the speed of the enemy
Enemy.prototype.randomSpeed = function() {
    var newSpeed = Math.floor(Math.random() * 3 + 3) * 80;
    this.speed = newSpeed;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Initialize player position
var playerX = 200;
var playerY = 380;
// Player class
var Player = function(initX, initY) {
    this.x = initX;
    this.y = initY;
    this.playerLine = (this.y - 48) / 83;
    this.sprite = "images/char-boy.png";
};

Player.prototype.collision = function() {
    this.x = playerX;
    this.y = playerY;
    this.playerLine = (this.y - 48) / 83;
};

Player.prototype.update = function() {
//
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(event) {
    if (event === "up") {
        if (this.y == topBound) {
            this.y = playerY;
            var winAudio = document.getElementById("win");
            winAudio.currentTime = 0;
            winAudio.play();
        } else {
            this.y = this.y - blockHeight;
        }
        this.playerLine = (this.y - 48) / 83;
    }

    if (event === "down") {
        if (this.y == bottomBound) {
            //make sound
        } else {
            this.y = this.y + blockHeight;
        }
        this.playerLine = (this.y - 48) / 83;
    }

    if (event === "left") {
        if (this.x == leftBound) {
            this.x = rightBound;
        } else {
            this.x = this.x - blockWidth;
        }
    }

    if (event === "right") {
        if (this.x == rightBound) {
            this.x = leftBound;
        } else {
            this.x = this.x + blockWidth;
        }
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    var tempSpeed = Math.floor(Math.random() * 3 + 2) * 70;
    allEnemies.push(new Enemy(0, 60 + 85 * i, tempSpeed));
}

var player = new Player(playerX, playerY);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
