// game-scene.js

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    // Parameters for the scene.
    init() {
        this.playerSpeed = 150;
        this.jumpSpeed = 600;
        this.levelData = this.cache.json.get('levelData');
    }

    // Executed once, after assets are loaded.
    create() {
        // Add all level elements.
        this.setupLevel();
        // Initiate barrel spawner.
        this.setupSpawner();

        // Collision detection.
        this.physics.add.collider([this.player, this.barrels], [this.platforms, this.ground]);
        // Overlap checks.
        this.physics.add.overlap(this.player, this.goal, this.restartGame, null, this);
        this.physics.add.overlap(this.player, this.barrels, this.restartGame, null, this);
        this.physics.add.overlap(this.player, this.fires, this.restartGame, null, this);

        // Enable cursor keys.
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Are we on the ground?.
        const onGround = this.player.body.blocked.down || this.player.body.touching.down;

        // Movement to the left.
        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);

            this.player.setFlipX(false);

            if (onGround) {
                // Play animation if not already playing.
                this.player.play('walking', true);
            }
        } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
            // Movement to the right.
            this.player.body.setVelocityX(this.playerSpeed);

            this.player.setFlipX(true);

            if (onGround) {
                // Play animation if not already playing.
                this.player.play('walking', true);
            }
        } else if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            // Make the player stop.
            this.player.body.setVelocityX(0);

            // Stop walking animation.
            this.player.stop();

            // Set default frame.
            this.player.setFrame(3);
        }

        // Handle jumping.
        if (onGround && (this.cursors.up.isDown || this.cursors.space.isDown)) {
            // Give the player a velocity in Y.
            this.player.body.setVelocityY(-this.jumpSpeed);

            // Stop walking animation.
            this.player.stop();

            // Set default frame.
            this.player.setFrame(2);
        }
    }

    setupLevel() {
        // World bounds.
        this.physics.world.setBounds(0, 0, this.levelData.world.width, this.levelData.world.height);

        // Create all the platforms.
        this.platforms = this.physics.add.staticGroup();

        this.levelData.platforms.forEach((platform) => {
            const { width, height } = this.textures.get(platform.key).get(0);
            const gameObject = this.add.tileSprite(platform.x, platform.y, width * platform.numOfTiles, height, platform.key);
            gameObject.setOrigin(0);
            this.platforms.add(gameObject);
        });

        // Ground.
        this.ground = this.physics.add.staticSprite(this.levelData.ground.x, this.levelData.ground.y, this.levelData.ground.key);

        // Player.
        this.player = this.physics.add.sprite(this.levelData.player.x, this.levelData.player.y, this.levelData.player.key, this.levelData.player.frame);
        // Constraint player to the game bounds.
        this.player.body.setCollideWorldBounds(true);

        // Create all the fire objects.
        this.fires = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.levelData.fires.forEach((fire) => {
            const gameObject = this.fires.create(fire.x, fire.y, fire.key);
            gameObject.setOrigin(0);

            // Play burning animation.
            gameObject.play('burning');
        });

        // Goal.
        this.goal = this.physics.add.staticSprite(this.levelData.goal.x, this.levelData.goal.y, this.levelData.goal.key);

        // Camera bounds.
        this.cameras.main.setBounds(0, 0, this.levelData.world.width, this.levelData.world.height);
        this.cameras.main.startFollow(this.player);
    }

    // Restart game (game over + you won!).
    restartGame() {
        // Disable player physics body.
        this.player.body.enable = false;

        // Fade out.
        this.cameras.main.fade(500);
        // When fade out completes, restart scene.
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Restart the scene.
            this.scene.restart();
        });
    }

    // Generation of barrels.
    setupSpawner() {
        // Barrel group.
        this.barrels = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 0.1,
        });

        this.time.addEvent({
            delay: this.levelData.spawner.interval,
            loop: true,
            callback: () => {
                // Create a barrel.
                const barrel = this.barrels.get(this.goal.x, this.goal.y, 'barrel');
                barrel.setActive(true).setVisible(true);
                barrel.body.enable = true;

                // Set properties.
                const speed = Phaser.Math.Between(this.levelData.spawner.speed.min, this.levelData.spawner.speed.max);
                const direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
                barrel.setVelocityX(speed * direction);

                // Lifespan.
                this.time.addEvent({
                    delay: this.levelData.spawner.lifespan,
                    callback: () => {
                        this.barrels.killAndHide(barrel);
                        barrel.body.enable = false;
                    }
                })
            }
        })
    }
}
