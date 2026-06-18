// GameScene.js

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    // Initiate scene parameters
    init() {
        // Player speed.
        this.playerSpeed = 3;

        // Enemy speed.
        this.enemyMinSpeed = 2;
        this.enemyMaxSpeed = 4.5;

        // Boundaries.
        this.enemyMinY = 80;
        this.enemyMaxY = 280;

        // We are not terminating.
        this.isTerminating = false;
    };

    // Load assets.
    preload() {
        // Set the Base URL to static.
        this.load.setBaseURL('static/');

        // Load images.
        this.load.image('background', 'images/background.png');
        this.load.image('player', 'images/player.png');
        this.load.image('enemy', 'images/dragon.png');
        this.load.image('goal', 'images/treasure.png');
    };

    //  Initialize and arrange game objects.
    create() {
        // Background.
        let bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);

        // Player.
        this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
        this.player.setScale(0.5);

        // Treasure chest goal.
        this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');
        this.goal.setScale(0.6);

        // Enemy group.
        this.enemies = this.add.group({
            key: 'enemy',
            repeat: 4,
            setXY: {
                x: 90,
                y: 100,
                stepX: 100,
                stepY: 20
            }
        });

        // Setting the scale of all group elements.
        Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

        // Enemy properties.
        Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
            // Flip enemy horizontally.
            enemy.flipX = true;

            // Set speed.
            let dir = Math.random() < 0.5 ? 1 : -1;
            let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
            enemy.speed = dir * speed;
        }, this);
    };

    // Game update loop.
    update() {
        // Don't execute if we are terminating.
        if (this.isTerminating) return;

        // Check for active input (left click / touch).
        if (this.input.activePointer.isDown) {
            // Player walks.
            this.player.x += this.playerSpeed;
        }

        // Treasure chest overlap check.
        let playerRect = this.player.getBounds();
        let treasureRect = this.goal.getBounds();

        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
            console.log('You reached the goal!');

            // End game.
            return this.gameOver();
        }

        // Get enemies.
        let enemies = this.enemies.getChildren();
        let numEnemies = enemies.length;

        for (let i = 0; i < numEnemies; i++) {
            // Enemy movement.
            enemies[i].y += enemies[i].speed;

            // Check we haven't passed min or max Y.
            let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
            let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

            // If we passed the upper or lower limit, reverse.
            if (conditionUp || conditionDown) {
                enemies[i].speed *= -1;
            }

            // Check enemy overlap.
            let enemyRect = enemies[i].getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
                console.log('Game Over!');

                // End game.
                return this.gameOver();
            }
        }
    };

    gameOver() {
        // Initiate game over sequence.
        this.isTerminating = true;

        // Shake camera.
        this.cameras.main.shake(500);

        // Listen for event completion, then fade out.
        this.cameras.main.on('camerashakecomplete', function (camera, effect) {
            this.cameras.main.fade(500);
        }, this);

        // Once the fade out is complete, restart the scene.
        this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
            this.scene.restart();
        }, this);
    };
}
