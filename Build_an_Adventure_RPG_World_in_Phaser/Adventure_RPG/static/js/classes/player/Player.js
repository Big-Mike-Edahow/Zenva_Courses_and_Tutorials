// Player.js

export class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;     // Current scene.

        // Enable physics.
        this.scene.physics.world.enable(this);

        // Set immovable if another object collides with our player.
        this.setImmovable(true);

        // Scale our player.
        this.setScale(2);

        // Add player to the current scene.
        this.scene.add.existing(this);
    }
}
