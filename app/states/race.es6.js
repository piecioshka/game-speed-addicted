'use strict';

import SETTINGS from './../settings.es6';

class Race extends Phaser.State {
    preload() {
        this.game.load.image('player', '/app/assets/images/car.png');
        this.game.load.image('road', '/app/assets/images/road.jpg');
        this.game.load.image('grass', '/app/assets/images/grass.jpg');
    }

    create() {
        console.log(this.game.stats);

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

    roadSprite() {
        let calcLeftOffset = (SETTINGS.map.width - this.game.cache.getImage('road').width) / 2;

        let getOffset = (n) => {
            return this.game.cache.getImage('road').height * n;
        };

        this.game.add.tileSprite(calcLeftOffset, getOffset(-1), this.game.cache.getImage('road').width, SETTINGS.map.height, 'road');
        this.game.add.tileSprite(calcLeftOffset, getOffset(0), this.game.cache.getImage('road').width, SETTINGS.map.height, 'road');
        this.game.add.tileSprite(calcLeftOffset, getOffset(1), this.game.cache.getImage('road').width, SETTINGS.map.height, 'road');
    }

    update() {
        this.player.body.velocity.setTo(0, 0);
        this.player.body.angularVelocity = SETTINGS.game.angularVelocity;

        let moveOffset = SETTINGS.game.moveOffset;
        let keyboard = this.game.input.keyboard;
        let divider = 20;

        if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.x -= moveOffset;

        } else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.x += moveOffset;
        }

        if (keyboard.isDown(Phaser.Keyboard.UP)) {
            this.
            this.player.y -= moveOffset / divider;

        } else if (keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.player.y += moveOffset / divider;
        }
    }


}

export default Race;
