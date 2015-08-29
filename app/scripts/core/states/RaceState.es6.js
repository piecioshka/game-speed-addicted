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
        this.speed = 0;
        this.carSwing = 20;

        this.game.load.image('player', 'assets/images/car.png');
        this.game.load.image('road', 'assets/images/road.jpg');
        this.game.load.image('grass', 'assets/images/grass.jpg');
        this.game.load.image('powerup', 'assets/images/diamond.png');

        // Bounds
        this.game.world.setBounds(0, 0, SETTINGS.map.width, SETTINGS.map.height);
    }

    create() {
        // Setup road image
        this._setupGrassSprite();
        this._setupRoadSprite();

        let calcLeftPlayer = (SETTINGS.map.width / 1.6);
        let calcTopPlayer = (SETTINGS.map.height - this.game.cache.getImage('player').height) - 50;

        // Diamonds
        this.diamonds = this.game.add.group();
        this.diamonds.enableBody = true;
        this._createDiamond(this.diamonds, 800, 0);
        this._createDiamond(this.diamonds, calcLeftPlayer, calcTopPlayer - 100);
        this.game.physics.arcade.enable(this.diamonds);

        // Player
        this.player = this._createPlayer(calcLeftPlayer, calcTopPlayer);

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

    _createPlayer(x, y) {
        let player = this.game.add.sprite(x, y, 'player');
        player.anchor.setTo(0.5, 0.5);

        this.game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.setSize(57, 94, 0, 0);

        // player.body.angularVelocity = SETTINGS.game.angularVelocity;
        // player.body.velocity.setTo(0, 0);

        return player;
    }

    _createDiamond(group, x, y) {
        let diamond = this.game.add.tileSprite(x, y, 20, 20, 'powerup');
        group.add(diamond);
        this.physics.arcade.enable(diamond);
    }

    _getOffset(n, name) {
        return n * this.game.cache.getImage(name).height;
    }

    _calcLeftOffset(name) {
        return (SETTINGS.map.width - this.game.cache.getImage(name).width) / 2;
    }

    _addTileSprite(offset, name) {
        let x = this._calcLeftOffset(name);
        let y = this._getOffset(offset, name);
        let width = this.game.cache.getImage(name).width;
        let height = SETTINGS.map.height + (MAX_SPEED * 2);

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
        // console.log({ player: this.player, diamonds: this.diamonds });
        // this.game.state.start('Menu');

        this._setupControl();
        this._updateScreen();

        this.game.physics.arcade.collide(this.player, this.diamonds, () => {
            console.warn('HIT collideCallback');
        });
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

        // console.log('player', this.player.y);
        this.diamonds.forEach(function (diamond) {
            // console.log('diamond', diamond.y);
            this._upToDown(diamond);
        }, this)
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
        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.speed = decrementSpeed(this.speed, 20);
        }

        keyboard.onUpCallback = (e) => {
            let isLeft = (e.keyCode == Phaser.Keyboard.LEFT);
            let isRight = (e.keyCode == Phaser.Keyboard.RIGHT);

            if (isLeft || isRight) {
                this.player.angle = 0;
            }
        };
    }

    render() {
        this.game.debug.body(this.player);

        this.diamonds.forEach((diamond) => {
            this.game.debug.body(diamond);
        }, this);

        // ---------

        this.game.debug.bodyInfo(this.player, 10, 50);

        let index = 0;
        this.diamonds.forEach((diamond) => {
            this.game.debug.bodyInfo(diamond, 10, 100 + 150 * (index + 1));
            index++;
        }, this);
    }
}

export default RaceState;
