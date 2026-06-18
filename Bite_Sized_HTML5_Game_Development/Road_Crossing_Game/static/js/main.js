// main.js

import GameScene from "./scenes/GameScene.js";

function main() {
    let config = {
        type: Phaser.AUTO,
        width: 640,
        height: 360,
        parent: 'game-canvas',
        backgroundColor: "#000000",
        scene: [GameScene],
        title: "Road Crossing Game",
        version: "1.0",
        description: "Classic road crossing game."
    };

    // create a new game, pass the configuration
    let game = new Phaser.Game(config);
}

main();
