// GameScene.js

import { Player } from "../classes/Player.js";
import { Chest } from "../classes/Chest.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.scene.launch('Ui');
        this.score = 0;
    }

    create() {
        // Player.
        this.player = new Player(this, 32, 32, 'characters', 0);

        // Input.
        this.cursors = this.input.keyboard.createCursorKeys();

        // Audio.
        this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.2 });

        // Walls.
        this.wall = this.physics.add.image(500, 100, 'button1');
        this.wall.setImmovable();

        // Chests.
        this.chests = this.physics.add.group();
        this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500]];
        this.maxNumberOfChests = 3;
        for (let i = 0; i < this.maxNumberOfChests; i += 1) {
            this.spawnChest();
        }

        // Collisions.
        this.physics.add.collider(this.player, this.wall);
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    }

    update() {
        this.player.update(this.cursors);
    }

    spawnChest() {
        const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

        let chest = this.chests.getFirstDead();

        if (!chest) {
            // Create chest and add it to the chest group.
            const chest = new Chest(this, location[0], location[1], 'items', 0);
            this.chests.add(chest);
        } else {
            chest.setPosition(location[0], location[1]);
            chest.makeActive();
        }
    }

    collectChest(player, chest) {
        // Play gold pickup sound and update the score.
        this.goldPickupAudio.play();
        this.score += chest.coins;
        this.events.emit('updateScore', this.score);

        // Make current chest inactive. Spawn an new chest.
        chest.makeInactive();
        this.time.delayedCall(1000, this.spawnChest, [], this);
    }
}
