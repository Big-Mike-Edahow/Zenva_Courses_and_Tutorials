// create a new scene
export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  // load assets
  preload() {
    // load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
  }

  // called once after the preload ends
  create() {
    // create bg image
    const bg = this.add.image(0, 0, 'background');

    // change origin to the top-left corner
    bg.setOrigin(0, 0);

    this.player = this.add.image(70, 180, 'player');
    this.player.setScale(0.5);

    this.enemy1 = this.add.image(250, 180, 'enemy');
    // enemy1.setAngle(45);
    // enemy1.rotation = Math.PI / 4;
    // enemy1.setOrigin(0);
    this.enemy1.setRotation(Math.PI / 4);
  }

  // called for each step of our game loop
  update() {
    // console.log('update method called');
    this.enemy1.angle += 1;

    this.player.angle -= 1;
    if (this.player.scaleX < 2) {
      this.player.scaleX += 0.01;
      this.player.scaleY += 0.01;
    }
  }
}
