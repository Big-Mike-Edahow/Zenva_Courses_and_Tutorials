// main.js

import BootScene from "./scenes/BootScene.js";
import TitleScene from "./scenes/TitleScene.js";
import GameScene from "./scenes/GameScene.js";
import UiScene from "./scenes/UiScene.js";

function main() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: "95%",
        parent: "game-canvas",
        physics: {
            default: "arcade",
            arcade: {
                debug: true,
                gravity: {
                    y: 0,
                },
            },
        },
        scene: [
            BootScene,
            TitleScene,
            GameScene,
            UiScene,
        ],
        title: "Zenva MMORPG",
        version: "1.0",
        description: "Neat little RPG made with PhaserJS."
    };

    const game = new Phaser.Game(config);
}

main();
