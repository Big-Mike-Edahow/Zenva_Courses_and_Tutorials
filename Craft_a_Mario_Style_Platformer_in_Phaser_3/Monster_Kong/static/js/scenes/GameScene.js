// GameScene.js

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    // Scene parameters.
    init() {
        this.playerSpeed = 150;
        this.jumpSpeed = -600;
    };

    // Load asset files.
    preload() {
        // Set Base URL to static.
        this.load.setBaseURL('static/');

        // Load images.
        this.load.image('ground', 'images/ground.png');
        this.load.image('platform', 'images/platform.png');
        this.load.image('block', 'images/block.png');
        this.load.image('goal', 'images/gorilla3.png');
        this.load.image('barrel', 'images/barrel.png');

        // Load spritesheets.
        this.load.spritesheet('player', 'images/player_spritesheet.png', {
            frameWidth: 28,
            frameHeight: 30,
            margin: 1,
            spacing: 1
        });

        this.load.spritesheet('fire', 'images/fire_spritesheet.png', {
            frameWidth: 20,
            frameHeight: 21,
            margin: 1,
            spacing: 1
        });

        this.load.json('levelData', 'data/levelData.json');
    };

    // Initialize and construct the game world.
    create() {
        // Walking animation.
        if (!this.anims.get('walking')) {
            this.anims.create({
                key: 'walking',
                frames: this.anims.generateFrameNames('player', {
                    frames: [0, 1, 2]
                }),
                frameRate: 12,
                yoyo: true,
                repeat: -1
            });
        }

        // Fire animation.
        if (!this.anims.get('burning')) {
            this.anims.create({
                key: 'burning',
                frames: this.anims.generateFrameNames('fire', {
                    frames: [0, 1]
                }),
                frameRate: 4,
                repeat: -1
            });
        }

        // Add level elements.
        this.levelData = this.cache.json.get('levelData');

        // Set world bounds.
        this.physics.world.bounds.width = this.levelData.world.width;
        this.physics.world.bounds.height = this.levelData.world.height;

        // Create the platforms.
        this.platforms = this.physics.add.staticGroup();
        for (let i = 0; i < this.levelData.platforms.length; i++) {
            let curr = this.levelData.platforms[i];

            let newObj;
            if (curr.numTiles == 1) {
                newObj = this.add.sprite(curr.x, curr.y, curr.key).setOrigin(0);
            }
            else {
                let width = this.textures.get(curr.key).get(0).width;
                let height = this.textures.get(curr.key).get(0).height;
                newObj = this.add.tileSprite(curr.x, curr.y, curr.numTiles * width, height, curr.key).setOrigin(0);
            }

            // Enable physics and add to the group.
            this.physics.add.existing(newObj, true);
            this.platforms.add(newObj);
        }

        // Create the fire.
        this.fires = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        for (let i = 0; i < this.levelData.fires.length; i++) {
            let curr = this.levelData.fires[i];

            let newObj = this.add.sprite(curr.x, curr.y, 'fire').setOrigin(0);
            newObj.anims.play('burning');
            this.fires.add(newObj);

            // This is for level creation.
            newObj.setInteractive();
            this.input.setDraggable(newObj);
        }

        // For level creation.
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            console.log(dragX, dragY);
        });

        // Player.
        this.player = this.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player', 3);
        this.physics.add.existing(this.player);

        // Limiyt player to world bounds.
        this.player.body.setCollideWorldBounds(true);

        // Camera bounds.
        this.cameras.main.setBounds(0, 0, this.levelData.world.width, this.levelData.world.height);
        this.cameras.main.startFollow(this.player);

        // Goal.
        this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
        this.physics.add.existing(this.goal);

        // Barrel spawner.
        this.barrels = this.physics.add.group({
            bounceY: 0.1,
            bounceX: 1,
            collideWorldBounds: true
        });

        // Spawn barrels.
        let spawningEvent = this.time.addEvent({
            delay: this.levelData.spawner.interval,
            loop: true,
            callbackScope: this,
            callback: function () {
                // Create a barrel.
                let barrel = this.barrels.get(this.goal.x, this.goal.y, 'barrel');

                // Reactivate.
                barrel.setActive(true);
                barrel.setVisible(true);
                barrel.body.enable = true;

                // Set properties.
                barrel.setVelocityX(this.levelData.spawner.speed);

                // Lifespan.
                this.time.addEvent({
                    delay: this.levelData.spawner.lifespan,
                    repeat: 0,
                    callbackScope: this,
                    callback: function () {
                        this.barrels.killAndHide(barrel);
                        barrel.body.enable = false;
                    }
                });
            }
        });

        // Collision detection and overlap checks.
        this.physics.add.collider([this.player, this.goal, this.barrels], this.platforms);
        this.physics.add.overlap(this.player, [this.fires, this.goal, this.barrels], this.restartGame, null, this);

        // Keyboard input.
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', function (pointer) {
            console.log(pointer.x, pointer.y);
        });
    };

    // Main update loop.
    update() {
        // Are we on the ground?
        let onGround = this.player.body.blocked.down || this.player.body.touching.down;

        // Movement to the left.
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.flipX = false;

            // Play animation if none is playing.
            if (onGround && !this.player.anims.isPlaying)
                this.player.anims.play('walking');
        }

        // Movement to the right.
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.flipX = true;

            // Play animation if none is playing.
            if (onGround && !this.player.anims.isPlaying)
                this.player.anims.play('walking');
        } else {
            // Stop the player walking.
            this.player.body.setVelocityX(0);
            this.player.anims.stop('walking');

            // Wet default frame.
            if (onGround)
                this.player.setFrame(3);
        }

        // Handle jumping
        if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
            // Set the player's jumpspeed.
            this.player.body.setVelocityY(this.jumpSpeed);

            // Stop the walking animation.
            this.player.anims.stop('walking');

            // Change frame.
            this.player.setFrame(2);
        }
    };

    restartGame(sourceSprite, targetSprite) {
        // Fade out.
        this.cameras.main.fade(500);

        // When fade out completes, restart scene.
        this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
            this.scene.restart();
        }, this);
    };
}
