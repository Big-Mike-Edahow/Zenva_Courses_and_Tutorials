// Player.js

export class Player extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;     // Curent scene.
        this.velocity = 160;    // Player velocity.

        // Enable physics.
        this.scene.physics.world.enable(this);

        // Set immovable if another object collides with our player.
        this.setImmovable(false);

        // Scale our player.
        this.setScale(2);

        // Sety world bounds.
        this.setCollideWorldBounds(true);

        // Add the player to our existing scene.
        this.scene.add.existing(this);
    }

    update(cursors) {
        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.velocity);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.velocity);
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.velocity);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.velocity);
        }
    }
}
