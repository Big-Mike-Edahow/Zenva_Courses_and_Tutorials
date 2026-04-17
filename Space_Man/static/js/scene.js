// scene.js

// Variable declarations.
let map;
let player;
let cursors;
let groundLayer, coinLayer;
let text;
let score = 0;

function preload() {
    this.load.setBaseURL("static");
    this.load.tilemapTiledJSON('map', 'data/map.json');
    this.load.spritesheet('tiles', 'images/game/tiles.png', { frameWidth: 70, frameHeight: 70 });
    this.load.image('coin', 'images/game/coinGold.png');
    this.load.image('cloud', 'images/game/cloud.png');
    this.load.atlas('player', 'images/game/player.png', 'data/player.json');
}

function create() {
    // Set background color for the sky.
    this.cameras.main.setBackgroundColor('#ccccff');

    // Add random clouds.
    for (let i = 0; i < 25; i++) {
        let x = Phaser.Math.Between(0, 2000);
        let y = Phaser.Math.Between(0, 350);

        this.add.image(x, y, 'cloud')
            .setScale(Phaser.Math.FloatBetween(0.3, 1.2))
            .setAlpha(0.8);
    }

    // Load the tilemap. 
    map = this.make.tilemap({ key: 'map' });

    // Ground layer.
    let groundTiles = map.addTilesetImage('tiles');
    groundLayer = map.createLayer('World', groundTiles, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);
    groundLayer.y += 150;

    // Coin layer.
    let coinTiles = map.addTilesetImage('coin');
    coinLayer = map.createLayer('Coins', coinTiles, 0, 0);
    coinLayer.y += 150;

    // Set the boundaries of our game world.
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // Create the player sprite. 
    player = this.physics.add.sprite(200, 200, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Shrink the hitbox. Resize the physics body object slightly.
    player.body.setSize(player.width, player.height - 8);

    // Player will collide with the level tiles.
    this.physics.add.collider(groundLayer, player);

    // Player overlapping coin.
    coinLayer.setTileIndexCallback(17, collectCoin, this);
    this.physics.add.overlap(player, coinLayer);

    // Player walk animation.
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2 }),
        frameRate: 10,
        repeat: -1
    });
    // Idle with only one frame, so repeat is not neaded.
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'player', frame: 'p1_stand' }],
        frameRate: 10,
    });

    // Key object containing listeners for the arrow keys, spacebar, and shift.
    cursors = this.input.keyboard.createCursorKeys();

    // Set the camera bounds. Have it follow the player.
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    // Display the score text. Fix it to the camera.
    text = this.add.text(20, 15, `Score: ${score}`, {
        fontSize: '22px',
        fill: '#000'
    });
    text.setScrollFactor(0);
}

// Remove the coin when the player touches it. Update the score.
function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y);
    score++;
    text.setText(`Score: ${score}`);
    return false;
}

function update(time, delta) {
    if (cursors.left.isDown) {
        // Walk left.
        player.body.setVelocityX(-200);
        player.anims.play('walk', true);
        player.flipX = true;
    }
    else if (cursors.right.isDown) {
        // Walk right.
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false;
    } else {
        // Idle.
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    if (cursors.space.isDown && player.body.onFloor()) {
        // Jump.
        player.body.setVelocityY(-500);
    }
}
