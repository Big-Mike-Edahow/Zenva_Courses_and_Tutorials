// UiButton.js

export class UiButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, hoverKey, text, targetCallback) {
        super(scene, x, y);
        this.scene = scene;         // Current scene.
        this.x = x;                 // The x position of our container.
        this.y = y;                 // The y position of our container.
        this.key = key;             // The background image of our button.
        this.hoverKey = hoverKey;   // Hover over the button image.
        this.text = text;           // Button tet.

        // The callback function that will be called when the player clicks the button.
        this.targetCallback = targetCallback;

        // Create our Ui Button.
        this.createButton();

        // Add this container to our Phaser scene.
        this.scene.add.existing(this);
    }

    createButton() {
        // Create the play game button. Set it's scale, and make it interactive.
        this.button = this.scene.add.image(0, 0, 'button1');
        this.button.setInteractive();
        this.button.setScale(1.4);

        // Create and center button text.
        this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '26px', fill: '#fff' });
        Phaser.Display.Align.In.Center(this.buttonText, this.button);

        // Add the two game objects to our container.
        this.add(this.button);
        this.add(this.buttonText);

        // Listen for events.
        this.button.on('pointerdown', () => {
            this.targetCallback();
        });

        this.button.on('pointerover', () => {
            this.button.setTexture(this.hoverKey);
        });

        this.button.on('pointerout', () => {
            this.button.setTexture(this.key);
        });
    }
}
