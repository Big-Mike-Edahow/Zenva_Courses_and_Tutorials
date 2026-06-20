// BootScene.js

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Set the Base URL to static.
        this.load.setBaseURL('static/');

        // Load images.
        this.load.image('button1', 'images/ui/blue_button01.png');
        this.load.image('button2', 'images/ui/blue_button02.png');

        // Load spritesheets.
        this.load.spritesheet('items', 'images/items.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('characters', 'images/characters.png', { frameWidth: 32, frameHeight: 32 });

        // Load audio.
        this.load.audio('goldSound', ['audio/Pickup.wav']);
    }

    create() {
        this.scene.start('Title');
    }
}
