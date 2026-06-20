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
        pixelArt: true,
        roundPixels: true,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
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
        title: "Adventure RPG",
        version: "1.0",
        description: "An adventure RPG game made with PhaserJS.",

    };

    const game = new Phaser.Game(config);
}

main();
