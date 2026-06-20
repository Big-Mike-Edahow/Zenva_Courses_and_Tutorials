// BootScene.js

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Set the Base URL to static.
        this.load.setBaseURL('static');

        // Load images.
        this.load.image('button1', 'images/ui/blue_button01.png');
        this.load.image('button2', 'images/ui/blue_button02.png');
        this.load.image('background', 'images/level/background-extruded.png');

        // Load spritesheets.
        this.load.spritesheet('items', 'images/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('characters', 'images/characters.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('monsters', 'images/monsters.png', { frameWidth: 32, frameHeight: 32 });

        // Load audio.
        this.load.audio('goldSound', ['audio/Pickup.wav']);
        this.load.audio('enemyDeath', ['audio/EnemyDeath.wav']);
        this.load.audio('playerAttack', ['audio/PlayerAttack.wav']);
        this.load.audio('playerDamage', ['audio/PlayerDamage.wav']);
        this.load.audio('playerDeath', ['audio/PlayerDeath.wav']);

        // Load tilemap.
        this.load.tilemapTiledJSON('map', 'data/large_level.json');
    }

    create() {
        this.scene.start('Title');
    }
}
