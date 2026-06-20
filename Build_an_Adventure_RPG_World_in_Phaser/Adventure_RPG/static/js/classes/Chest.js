// Chest.js

export class Chest extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame, coins, id) {
        super(scene, x, y, key, frame);
        this.scene = scene;     // Current scene.
        this.coins = coins;     // Coins this chest contains.
        this.id = id;

        // Enable physics.
        this.scene.physics.world.enable(this);

        // Add the player to the current scene.
        this.scene.add.existing(this);

        // Scale the chest game object.
        this.setScale(2);
    }

    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false;
    }

    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body.checkCollision.none = true;
    }
}
