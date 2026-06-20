// TitleScene.js

import { UiButton } from "../classes/UiButton.js";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {
        // Title text.
        this.titleText = this.add.text(this.scale.width / 2, this.scale.height * 0.35, 'Zenva MMORPG', { fontSize: '64px', fill: '#fff' });
        this.titleText.setOrigin(0.5);

        // Play button.
        this.startGameButton = new UiButton(this, this.scale.width / 2, this.scale.height * 0.75, 'button1', 'button2', 'Start', this.startScene.bind(this, 'GameScene'));
    }

    startScene(targetScene) {
        this.scene.start(targetScene);
    }
}
