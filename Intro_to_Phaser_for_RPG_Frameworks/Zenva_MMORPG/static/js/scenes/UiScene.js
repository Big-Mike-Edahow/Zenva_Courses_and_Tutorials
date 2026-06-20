// UiScene.js

export default class UiScene extends Phaser.Scene {
    constructor() {
        super('Ui');
    }

    init() {
        // Grab a reference to the game scene.
        this.gameScene = this.scene.get('GameScene');
    }

    create() {
        // Score text.
        this.scoreText = this.add.text(35, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });

        // Coin icon.
        this.coinIcon = this.add.image(15, 15, 'items', 3);

        // Listen for the updateScore event from the game scene.
        this.gameScene.events.on('updateScore', (score) => {
            this.scoreText.setText(`Coins: ${score}`);
        });
    }
}
