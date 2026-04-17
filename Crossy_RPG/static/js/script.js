// Script.js

// Create a new scene named "Game".
let gameScene = new Phaser.Scene('Game');

// Parameters for our scene.
gameScene.init = function () {
    this.playerSpeed = 1.5;
    this.enemySpeed = 2;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
}

// Load asset files for our game.
gameScene.preload = function () {
    this.load.setBaseURL('static');
    this.load.image('background', 'images/background.png');
    this.load.image('player', 'images/player.png');
    this.load.image('dragon', 'images/dragon.png');
    this.load.image('treasure', 'images/treasure.png');
};

gameScene.create = function () {
    // Background.
    let bg = this.add.sprite(0, 0, 'background');

    // Change origin to the top-left of the sprite.
    bg.setOrigin(0, 0);

    // Player.
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

    // Scale down.
    this.player.setScale(0.5);

    // Goal.
    this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
    this.treasure.setScale(0.6);

    // Group of enemies.
    this.enemies = this.add.group({
        key: 'dragon',
        repeat: 5,
        setXY: {
            x: 110,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });

    // Scale enemies.
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

    // Set speeds.
    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.speed = Math.random() * 2 + 1;
    }, this);

    // Player is alive.
    this.isPlayerAlive = true;

    // Reset camera.
    this.cameras.main.resetFX();
};

// Executed on every frame (60 times per second).
gameScene.update = function () {

    // Only if the player is alive.
    if (!this.isPlayerAlive) {
        return;
    }

    // Check for active input.
    if (this.input.activePointer.isDown) {

        // Player walks.
        this.player.x += this.playerSpeed;
    }

    // Treasure collision.
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
        this.gameOver();
    }

    // Enemy movement and collision.
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {

        // Move enemies.
        enemies[i].y += enemies[i].speed;

        // Reverse movement if reached the edges.
        if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
            enemies[i].speed *= -1;
        } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
            enemies[i].speed *= -1;
        }

        // Enemy collision.
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }
};

gameScene.gameOver = function () {

    // Flag to set player is dead.
    this.isPlayerAlive = false;

    // Shake the camera.
    this.cameras.main.shake(500);

    // Fade camera.
    this.time.delayedCall(250, function () {
        this.cameras.main.fade(250);
    }, [], this);

    // Restart game
    this.time.delayedCall(500, function () {
        this.scene.restart();
    }, [], this);
};



// Game configuration.
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'game-canvas',
    scene: gameScene
};

// Create the game, and pass it the configuration.
let game = new Phaser.Game(config);
