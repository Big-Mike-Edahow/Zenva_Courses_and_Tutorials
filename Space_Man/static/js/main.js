// main.js

function main() {
    const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 460,
        parent: "game-canvas",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 500 },
                debug: false
            }
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        },
        title: "Space Man",
        version: "1.0",
    };

    const game = new Phaser.Game(config);
}

main();
