// main.js

import GameScene from "./scenes/GameScene.js";

function main() {
    const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 360,
        parent: 'game-canvas',
        backgroundColor: '#000000',
        pixelArt: true,
        scene: [GameScene],
        title: 'Road Crossing Game',
        version: '1.0',
        description: 'An implementation of the classic road crossing game.'
    };

    const game = new Phaser.Game(config);
}

main();
