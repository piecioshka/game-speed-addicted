'use strict';

import SETTINGS from './../settings.es6';

class Race extends Phaser.State {
    preload() {
        this.game.load.image('player', '/app/assets/images/car.png');
        this.game.load.image('road', '/app/assets/images/road.jpg');
        this.game.load.image('grass', '/app/assets/images/grass.jpg');
        this.game.load.image('powerup', '/app/assets/images/diamond.png');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics[SETTINGS.physics]);
        this.collideGroup = this.game.add.group();

        this.speed = SETTINGS.game.initialSpeed;
        this.timer = 0;
        this.carSwing = 20;

        let calcLeftPlayer = (SETTINGS.map.width / 2);
        let calcTopPlayer = (SETTINGS.map.height - this.game.cache.getImage('player').height) - 50;

        // Bounds
        this.game.world.setBounds(0, 0, SETTINGS.map.width, SETTINGS.map.height);

        // Set road image
        this.grass = this.grassSprite();
        this.road = this.roadSprite();

        // Player
        this.player = this.game.add.sprite(calcLeftPlayer, calcTopPlayer, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.game.input.keyboard.createCursorKeys();

        this.game.physics.arcade.enableBody(this.player);
        this.player.body.collideWorldBounds = true;

        // Set camera
        this.game.camera.follow(this.player);
        this.game.physics.enable(this.player, Phaser.Physics[SETTINGS.physics]);

        this.powerup = this.createPowerUp();
    }

    getOffset(n, name) {
        return this.game.cache.getImage(name).height * n;
    }

    calcLeftOffset(name) {
        return (SETTINGS.map.width - this.game.cache.getImage(name).width) / 2;
    }

    addTileSprite(offset, name) {
        let x = this.calcLeftOffset(name);
        let y = this.getOffset(offset, name);
        let width = this.game.cache.getImage(name).width;
        let height = SETTINGS.map.height + (SETTINGS.game.maxSpeed * 2);

        return this.game.add.tileSprite(x, y, width, height, name);
    }

    roadSprite() {
        this.road1 = this.addTileSprite(-1, 'road');
        this.road2 = this.addTileSprite(0, 'road');
    }

    grassSprite() {
        this.collideGroup.physicsBodyType = Phaser.Physics[SETTINGS.physics];
        this.collideGroup.enableBody = true;

        this.grass1 = this.addTileSprite(-1, 'grass');
        this.grass2 = this.addTileSprite(0, 'grass');

        this.collideGroup.add(this.grass1);
        this.collideGroup.add(this.grass2);
    }

    upToDown(spriteObj, callback) {
        spriteObj.y += this.speed;

        if (typeof callback === 'function') {
            if (spriteObj.y >= SETTINGS.map.height) {
                callback();
            }
        }
    }

    incrementSpeed(n) {
        let maxSpeed = SETTINGS.game.maxSpeed;
        let speed = this.speed + (n * SETTINGS.game.velocity);

        this.speed = (speed > maxSpeed) ? maxSpeed : speed;
    }

    decrementSpeed(n) {
        let minSpeed = 0;
        let speed = this.speed - (n * SETTINGS.game.velocity);

        this.speed = (speed < minSpeed) ? minSpeed : speed;
    }

    createPowerUp() {
        return this.game.add.tileSprite(800, 0, 20, 20, 'powerup');
    }

    update() {
        this.player.body.velocity.setTo(0, 0);
        this.player.body.angularVelocity = SETTINGS.game.angularVelocity;

        let moveOffset = SETTINGS.game.moveOffset;
        let keyboard = this.game.input.keyboard;

        this.upToDown(this.grass1, () => {
            this.grass1.y = this.getOffset(-1, 'grass');
        });

        this.upToDown(this.grass2, () => {
            this.grass2.y = this.getOffset(-1, 'grass');
        });

        this.upToDown(this.road1, () => {
            this.road1.y = this.getOffset(-1, 'road');
        });

        this.upToDown(this.road2, () => {
            this.road2.y = this.getOffset(-1, 'road');
        });

        if (this.powerup) {
            this.upToDown(this.powerup, () => {
                console.error('error');
            });
        }


        this.timer++;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.x -= moveOffset;
            this.player.angle = -1 * this.carSwing;

        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.x += moveOffset;
            this.player.angle = this.carSwing;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {

            this.incrementSpeed(2);
            this.player.y -= moveOffset / SETTINGS.game.divider;

        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {

            this.decrementSpeed(20);
            this.player.y += moveOffset / SETTINGS.game.divider;
        }

        keyboard.onUpCallback = ((e) => {
            let isLeft = (e.keyCode == Phaser.Keyboard.LEFT);
            let isRight = (e.keyCode == Phaser.Keyboard.RIGHT);

            if (isLeft || isRight ) {
                this.player.angle = 0;
            }
        });

        this.game.physics.arcade.collide(this.player, this.collideGroup, () => {
            console.log('kolizja');
        });
    }
}

export default Race;
