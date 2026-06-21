// main.js

import GameScene from "./scenes/GameScene.js";

function main() {
    const config = {
        type: Phaser.AUTO,
        width: 360,
        height: "95%",
        parent: "game-canvas",
        pixelArt: false,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 1000
                },
                debug: false
            }
        },
        scene: [GameScene],
        title: "Monster Kong",
        version: "1.0",
        description: "Retro platformer game.",
    };

    const game = new Phaser.Game(config);
}

main();
