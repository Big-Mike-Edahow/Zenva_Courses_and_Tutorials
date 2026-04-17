// create a new scene
export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  // initialize game properties
  init() {
    console.log('init method called');
  }

  // load assets
  preload() {
    console.log('preload method called');
    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
  }

  // called once after the preload ends
  create() {
    console.log('create method called');
    const gameW = this.scale.width;
    const gameH = this.scale.height;
    console.log(gameW, gameH);

    const player = this.add.image(0, 0, 'player');
    player.setPosition(gameW, gameH);
    player.setOrigin(1, 1);
    player.setDepth(2);
    player.setScale(0.5);

    // create bg image
    const bg = this.add.image(0, 0, 'background');

    // place image in the center of the screen
    bg.setPosition(gameW / 2, gameH / 2);

    // change origin to the top-left corner
    // bg.setOrigin(0, 0);

    const enemy1 = this.add.image(250, 180, 'enemy');
    enemy1.scaleX = 2;
    enemy1.scaleY = 2;

    const enemy2 = this.add.image(450, 180, 'enemy');
    enemy2.displayWidth = 300;

    enemy1.flipX = true;
    enemy1.flipY = true;
  }

  // called for each step of our game loop
  update() {
    // console.log('update method called');
  }
}
