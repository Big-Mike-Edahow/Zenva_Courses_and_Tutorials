// main.js

const BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function BootScene() {
            Phaser.Scene.call(this, { key: 'BootScene' });
        },

    preload: function () {
        // Map.
        this.load.image('tiles', 'static/images/spritesheet.png');
        this.load.tilemapTiledJSON('map', 'data/map.json');

        // Characters.
        this.load.spritesheet('player', 'static/images/rpg_assets.png', { frameWidth: 16, frameHeight: 16 });
    },

    create: function () {
        // Start the WorldScene.
        this.scene.start('WorldScene');
    }
});

const WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function WorldScene() {
            Phaser.Scene.call(this, { key: 'WorldScene' });
        },

    preload: function () {
    },

    create: function () {
        // Create the map.
        let map = this.make.tilemap({ key: 'map' });

        // First parameter is the name of the tilemap in tiled.
        let tiles = map.addTilesetImage('spritesheet', 'tiles');

        // Creating the layers.
        let grass = map.createLayer('Grass', tiles, 0, 0);
        let obstacles = map.createLayer('Obstacles', tiles, 0, 0);

        // Make all tiles in obstacles collidable.
        obstacles.setCollisionByExclusion([-1]);

        //  Animation key for 'left'. Flip the sprite for right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });

        // Animation key for 'right'.
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 6, 0, 12] }),
            frameRate: 10,
            repeat: -1
        });

        // Player sprite.
        this.player = this.physics.add.sprite(50, 100, 'player', 6);

        // Set world bounds,
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // Player collides with trees.
        this.physics.add.collider(this.player, obstacles);

        // Limit camera to map.
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;

        // User input.
        this.cursors = this.input.keyboard.createCursorKeys();

        // Enemies.
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for (var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            this.spawns.create(x, y, 20, 20);   // Parameters are x, y, width, height.
        }
        // Player collides with enemies.
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    },
    onMeetEnemy: function (player, zone) {
        // Move the zone to some other location.
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

        // Shake the world.
        this.cameras.main.shake(300);

        // Start the battle. 
    },
    update: function (time, delta) {
        //    this.controls.update(delta);

        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(80);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown) {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown) {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown) {
            this.player.anims.play('down', true);
        }
        else {
            this.player.anims.stop();
        }
    }

});

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
const game = new Phaser.Game(config);
