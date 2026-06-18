// loading-scene.js

export class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }


    preload() {
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

        // Load json data.
        this.load.json('levelData', 'data/levelData.json');
    }

    // Executed once, after assets were loaded.
    create() {
        // Walking animation.
        this.anims.create({
            key: 'walking',
            frames: this.anims.generateFrameNames('player', {
                frames: [0, 1, 2]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });

        // Fire animation.
        this.anims.create({
            key: 'burning',
            frames: this.anims.generateFrameNames('fire', {
                frames: [0, 1]
            }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.start("GameScene")
    }
}
