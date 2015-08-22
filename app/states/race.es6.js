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
        this.carSwing = 20;

        let calcLeftPlayer = (SETTINGS.map.width / 2);
        let calcTopPlayer = (SETTINGS.map.height - this.game.cache.getImage('player').height) - 50;

        // Bounds
        this.game.world.setBounds(0, 0, SETTINGS.map.width, SETTINGS.map.height);

        // Set background image
        //this.game.add.tileSprite(0, 0, SETTINGS.map.width,  SETTINGS.map.height, 'grass');

        // Set road image
        this.grass = this.grassSprite();
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

        console.debug(x, y, width, height, name);
        return this.game.add.tileSprite(x, y, width, height, name);
    }

    roadSprite() {
        this.road1 = this.addTileSprite(-1, 'road');
        this.road2 = this.addTileSprite(0, 'road');
    }

    grassSprite() {
        this.grass1 = this.addTileSprite(-1, 'grass');
        this.grass2 = this.addTileSprite(0, 'grass');
    }

    moveRoad(speed) {
        let road2yPos = this.road2.y;
        let road1yPos = this.road1.y;
        let grass2yPos = this.grass2.y;
        let grass1yPos = this.grass1.y;
        let mapHeight = SETTINGS.map.height;

        this.road1.y += speed;
        this.road2.y += speed;

        this.grass1.y += speed;
        this.grass2.y += speed;

        if (road2yPos >= mapHeight) {
            this.road2.y = this.getOffset(-1, 'road');
        }

        if (road1yPos >= mapHeight) {
            this.road1.y = this.getOffset(-1, 'road');
        }

        if (grass2yPos >= mapHeight) {
            this.grass2.y = this.getOffset(-1, 'grass');
        }

        if (grass1yPos >= mapHeight) {
            this.grass1.y = this.getOffset(-1, 'grass');
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
            this.player.angle = -1 * this.carSwing;

        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.x += moveOffset;
            this.player.angle = this.carSwing;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {

            this.incrementSpeed(2);
            this.player.y -= moveOffset / SETTINGS.game.divider;

        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {

            this.decrementSpeed(2);
            this.player.y += moveOffset / SETTINGS.game.divider;
        }

        keyboard.onUpCallback = ((e) => {
            let isLeft = (e.keyCode == Phaser.Keyboard.LEFT);
            let isRight = (e.keyCode == Phaser.Keyboard.RIGHT);

            if (isLeft || isRight ) {
                this.player.angle = 0;
            }
        });
    }
}

export default Race;
