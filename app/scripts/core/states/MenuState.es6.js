'use strict';

import SETTINGS from './../settings';

class MenuState extends Phaser.State {
    preload() {
        this.game.load.image('button', 'assets/images/start_button.png');
        this.game.load.image('background', 'assets/images/backgrounds/menu.jpg');
    }

    create() {
        this.game.stage.backgroundColor = '#282828';
        this.game.add.sprite(0, 0, 'background');

        // Button 'Engine Start'
        this.game.add.button(this.game.world.centerX - 120, 120, 'button', this._onClickHandler, this, 2, 1, 0);
    }

    _onClickHandler() {
        this.game.state.start('Race');
    }
}

export default MenuState;
