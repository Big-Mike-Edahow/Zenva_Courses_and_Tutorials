// main.js

import { GameScene } from './scenes/game-scene.js';
import { LoadingScene } from './scenes/loading-scene.js';

// Game configuration.
const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    parent: 'game-canvas',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 1000,
            },
            debug: false,
        }
    },
    scene: [LoadingScene, GameScene],
    title: 'Monster Kong',
    version: '1.0',
};

// Create the game, and pass it the configuration.
const game = new Phaser.Game(config);

