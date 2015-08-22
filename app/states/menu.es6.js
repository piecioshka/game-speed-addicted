'use strict';

import SETTINGS from './../settings.es6';

class Menu extends Phaser.State {
    preload() {
        this.game.load.image('button', '/app/assets/images/start_button.png');
        this.game.load.image('background', '/app/assets/images/backgrounds/menu.jpg');
    }

    create() {
        this.game.stage.backgroundColor = '#282828';

        this.game.add.sprite(0, 0, 'background');

        let button = this.game.add.button(this.game.world.centerX - 120, 200, 'button', this.onClickHandler, this, 2, 1, 0);
    }

    onClickHandler() {
        console.log('test');
        this.game.state.start('Race');
    }
}

export default Menu;