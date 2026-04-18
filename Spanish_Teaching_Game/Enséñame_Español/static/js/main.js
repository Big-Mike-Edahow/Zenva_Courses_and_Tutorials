// main.js

// Create a new scene named “Game”.
let gameScene = new Phaser.Scene('Game');

// Parameters for the scene.
gameScene.init = function () {
    // Word database.
    this.words = [{
        key: 'building',
        setXY: {
            x: 100,
            y: 240
        },
        spanish: 'edificio'
    },
    {
        key: 'house',
        setXY: {
            x: 240,
            y: 280
        },
        setScale: {
            x: 0.8,
            y: 0.8
        },
        spanish: 'casa'
    },
    {
        key: 'car',
        setXY: {
            x: 400,
            y: 300
        },
        setScale: {
            x: 0.8,
            y: 0.8
        },
        spanish: 'automóvil'
    },
    {
        key: 'tree',
        setXY: {
            x: 550,
            y: 250
        },
        spanish: 'árbol'
    }
    ];
}

// Load asset files for the game.
gameScene.preload = function () {
    this.load.setBaseURL('static/');

    // Load images.
    this.load.image('background', 'images/background-city.png');
    this.load.image('building', 'images/building.png');
    this.load.image('car', 'images/car.png');
    this.load.image('house', 'images/house.png');
    this.load.image('tree', 'images/tree.png');

    // Load audio.
    this.load.audio('treeAudio', 'audio/arbol.mp3');
    this.load.audio('carAudio', 'audio/auto.mp3');
    this.load.audio('houseAudio', 'audio/casa.mp3');
    this.load.audio('buildingAudio', 'audio/edificio.mp3');
    this.load.audio('correct', 'audio/correct.mp3');
    this.load.audio('wrong', 'audio/wrong.mp3');
};

// Executed once, after assets are loaded.
gameScene.create = function () {
    this.items = this.add.group(this.words);

    // Add Background.  Show group sprites on top of the background.
    let bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
    this.items.setDepth(1);

    // Group array.
    let items = this.items.getChildren();

    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        // Make item interactive.
        item.setInteractive();

        // Creating tween – resize tweens.
        item.correctTween = this.tweens.add({
            targets: item,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            paused: true,
            yoyo: true,
            ease: 'Quad.easeInOut',
            persist: true
        });

        item.wrongTween = this.tweens.add({
            targets: item,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 300,
            angle: 90,
            paused: true,
            yoyo: true,
            ease: 'Quad.easeInOut',
            persist: true
        });

        // Creating tween - Transparency tween.
        item.alphaTween = this.tweens.add({
            targets: item,
            alpha: 0.7,
            duration: 200,
            paused: true,
            persist: true
        });

        // Listen for the pointerdown event.
        item.on('pointerdown', function (pointer) {
            let result = this.processAnswer(this.words[i].spanish);

            // Depending on the result, we'll play one tween or the other.
            if (result) {
                item.correctTween.play();
            }
            else {
                item.wrongTween.play();
            }

            // Show the next question.
            this.showNextQuestion();
            this.updateScore();

        }, this);

        // Listen for the pointerover event.
        item.on('pointerover', function (pointer) {
            item.alphaTween.play();
        }, this);

        // Listen for the pointerout event.
        item.on('pointerout', function (pointer) {
            // Set to opaque.
            item.alpha = 1;
        }, this);

        // Create sound for each word.
        this.words[i].sound = this.sound.add(this.words[i].key + 'Audio')
    }

    // Set game score.
    this.score = 0;

    // Text object.
    this.wordText = this.add.text(30, 20, ' ', {
        font: '30px Open Sans',
        fill: '#ffffff'
    });

    // Create score text.
    this.scoreText = this.add.text(450, 20, 'Score: ' + this.score, {
        font: '30px Open Sans',
        fill: '#ffffff'
    });

    // Show the first question.
    this.showNextQuestion();

    // Correct and wrong sounds.
    this.correctSound = this.sound.add('correct');
    this.wrongSound = this.sound.add('wrong');
};

// Show new question.
gameScene.showNextQuestion = function () {
    // Select a random word.
    this.nextWord = Phaser.Math.RND.pick(this.words);

    // Play a sound for that word.
    this.nextWord.sound.play();

    // Show the text of the word in Spanish.
    this.wordText.setText(this.nextWord.spanish);
};

// Answer processing.
gameScene.processAnswer = function (userResponse) {
    // Compare user response with correct response.
    if (userResponse == this.nextWord.spanish) {
        // Play correct sound. Update score.
        this.correctSound.play();
        this.score++;

        return true;
    }

    else {
        // Play wrong sound. Update score;
        this.wrongSound.play();
        this.score--;
        
        return false;
    }
}

gameScene.updateScore = function () {
    this.scoreText.setText('Score: ' + this.score);
}

// Game configuration.
const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    parent: 'game-canvas',
    pixelArt: false,
    scene: [gameScene],
    title: 'Spanish Learning Game',
    version: '1.0',
};

// Create the game, and pass it the configuration.
const game = new Phaser.Game(config);
