'use strict';

import SETTINGS from './../settings.es6';

class Race extends Phaser.State {
    preload() {
        this.game.load.image('player', '/app/assets/images/car.png');
        this.game.load.image('road', '/app/assets/images/road.jpg');
        this.game.load.image('grass', '/app/assets/images/grass.jpg');
    }

    create() {

        this.speed = SETTINGS.game.initialSpeed;

        let calcLeftPlayer = (SETTINGS.map.width / 2);
        let calcTopPlayer = (SETTINGS.map.height - this.game.cache.getImage('player').height) - 50;

        // Bounds
        this.game.world.setBounds(0, 0, SETTINGS.map.width, SETTINGS.map.height);

        // Set background image
        this.game.add.tileSprite(0, 0, SETTINGS.map.width,  SETTINGS.map.height, 'grass');

        // Set road image
        this.road = this.roadSprite();

        // Player
        this.player = this.game.add.sprite(calcLeftPlayer, calcTopPlayer, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.game.input.keyboard.createCursorKeys();

        // Set camera
        this.game.camera.follow(this.player);

        // Set physics
        this.game.physics.enable(this.player, Phaser.Physics[SETTINGS.physics]);
    }

    getOffset(n) {
        return this.game.cache.getImage('road').height * n;
    }

    calcLeftOffset() {
        return (SETTINGS.map.width - this.game.cache.getImage('road').width) / 2;
    }

    addTileSprite(offset) {
        return this.game.add.tileSprite(this.calcLeftOffset(), this.getOffset(offset),
               this.game.cache.getImage('road').width, SETTINGS.map.height + (SETTINGS.game.maxSpeed * 2), 'road');
    }

    roadSprite() {
        this.road1 = this.addTileSprite(-1);
        this.road2 = this.addTileSprite(0);
    }

    moveRoad(speed) {
        let road2yPos = this.road2.y;
        let road1yPos = this.road1.y;
        let mapHeight = SETTINGS.map.height;

        this.road1.y += speed;
        this.road2.y += speed;

        if (road2yPos >= mapHeight) {
            this.road2.y = this.getOffset(-1);
        }

        if (road1yPos >= mapHeight) {
            this.road1.y = this.getOffset(-1);
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

    update() {
        this.player.body.velocity.setTo(0, 0);
        this.player.body.angularVelocity = SETTINGS.game.angularVelocity;

        let moveOffset = SETTINGS.game.moveOffset;
        let keyboard = this.game.input.keyboard;

        this.moveRoad(this.speed);

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.x -= moveOffset;

        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.x += moveOffset;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {

            this.incrementSpeed(2);
            this.player.y -= moveOffset / SETTINGS.game.divider;

        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {

            this.decrementSpeed(2);
            this.player.y += moveOffset / SETTINGS.game.divider;

        }
    }
}

export default Race;
