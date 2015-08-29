'use strict';

import SETTINGS from './../settings';

let MIN_SPEED = 0;
let MAX_SPEED = SETTINGS.game.maxSpeed;
let MOVE_OFFSET = SETTINGS.game.moveOffset;

let incrementSpeed = (speed, n) => {
    let newSpeed = speed + (n * SETTINGS.game.velocity);
    return (newSpeed > MAX_SPEED) ? MAX_SPEED : newSpeed;
};

let decrementSpeed = (speed, n) => {
    let newSpeed = speed - (n * SETTINGS.game.velocity);
    return (newSpeed < MIN_SPEED) ? MIN_SPEED : newSpeed;
};

class RaceState extends Phaser.State {
    preload() {
        this.game.load.image('player', 'assets/images/car.png');
        this.game.load.image('road', 'assets/images/road.jpg');
        this.game.load.image('grass', 'assets/images/grass.jpg');
        this.game.load.image('powerup', 'assets/images/diamond.png');
    }

    create() {
        this.speed = 0;
        this.timer = 0;
        this.carSwing = 20;

        // Bounds
        this.game.world.setBounds(0, 0, SETTINGS.map.width, SETTINGS.map.height);

        // Start Physic System
        this.game.physics.startSystem(Phaser.Physics[SETTINGS.physics]);

        // Setup road image
        this._setupGrassSprite();
        this._setupRoadSprite();

        // Player
        this.player = this._createPlayer();

        // Diamonds
        this.diamonds = this._createDiamondsGroup();
        this.diamonds.add(this._createDiamond());

        // Control
        this.game.input.keyboard.createCursorKeys();
    }

    _setupRoadSprite() {
        this.road1 = this._addTileSprite(-1, 'road');
        this.road2 = this._addTileSprite(0, 'road');
    }

    _setupGrassSprite() {
        this.grass1 = this._addTileSprite(-1, 'grass');
        this.grass2 = this._addTileSprite(0, 'grass');
    }

    _createPlayer() {
        let calcLeftPlayer = (SETTINGS.map.width / 2);
        let calcTopPlayer = (SETTINGS.map.height - this.game.cache.getImage('player').height) - 50;

        let player = this.game.add.sprite(calcLeftPlayer, calcTopPlayer, 'player');
        player.anchor.setTo(0.5, 0.5);

        this.game.physics.arcade.enableBody(player);
        player.body.angularVelocity = SETTINGS.game.angularVelocity;
        player.body.collideWorldBounds = true;
        player.body.velocity.setTo(0, 0);

        return player;
    }

    _createDiamondsGroup() {
        let diamonds = this.game.add.group();
        diamonds.enableBody = true;

        diamonds.setAll('body.mass', 0.5);
        diamonds.setAll('body.colliderWorldBounds', true);
        diamonds.setAll('body.bounce', new Phaser.Point(0.5, 0.5));

        return diamonds;
    }

    _createDiamond() {
        let diamond = this.game.add.tileSprite(800, 0, 20, 20, 'powerup');
        this.physics.arcade.enableBody(diamond);
        return diamond;
    }

    _getOffset(n, name) {
        return this.game.cache.getImage(name).height * n;
    }

    _calcLeftOffset(name) {
        return (SETTINGS.map.width - this.game.cache.getImage(name).width) / 2;
    }

    _addTileSprite(offset, name) {
        let x = this._calcLeftOffset(name);
        let y = this._getOffset(offset, name);
        let width = this.game.cache.getImage(name).width;
        let height = SETTINGS.map.height + (SETTINGS.game.maxSpeed * 2);

        return this.game.add.tileSprite(x, y, width, height, name);
    }

    _upToDown(sprite, callback) {
        sprite.y += this.speed;

        if (sprite.y < SETTINGS.map.height) {
            return;
        }

        if (typeof callback === 'function') {
            callback();
        }
    }

    update() {
        this._setupControl();
        this.timer++;

        return;

        this.game.physics.arcade.collide(this.player, this.diamonds, function () {
            console.log('Hit!');
        });

        this._updateScreen();
    }

    _updateScreen() {
        this._upToDown(this.grass1, () => {
            this.grass1.y = this._getOffset(-1, 'grass');
        });

        this._upToDown(this.grass2, () => {
            this.grass2.y = this._getOffset(-1, 'grass');
        });

        this._upToDown(this.road1, () => {
            this.road1.y = this._getOffset(-1, 'road');
        });

        this._upToDown(this.road2, () => {
            this.road2.y = this._getOffset(-1, 'road');
        });

        this._upToDown(this.powerup);
    }

    _setupControl() {
        let keyboard = this.game.input.keyboard;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.x -= MOVE_OFFSET;
            this.player.angle = -1 * this.carSwing;
        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.x += MOVE_OFFSET;
            this.player.angle = this.carSwing;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            this.speed = incrementSpeed(this.speed, 20);
            this.player.y -= MOVE_OFFSET;
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.speed = decrementSpeed(this.speed, 20);
            this.player.y += MOVE_OFFSET;
        }

        keyboard.onUpCallback = ((e) => {
            let isLeft = (e.keyCode == Phaser.Keyboard.LEFT);
            let isRight = (e.keyCode == Phaser.Keyboard.RIGHT);

            if (isLeft || isRight) {
                this.player.angle = 0;
            }
        });
    }
}

export default RaceState;
