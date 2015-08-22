'use strict';

import SETTINGS from './../settings.es6';

class Menu extends Phaser.State {
    preload() {

        this.game.load.image('background', '/app/assets/images/backgrounds/menu.jpg');
    }

    create() {
        this.game.stage.backgroundColor = '#282828';

        this.game.add.sprite(0, 0, 'background');
    }
}

export default Menu;