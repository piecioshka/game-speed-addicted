'use strict';

import SETTINGS from './settings.es6';
import Menu from './states/menu.es6';
import Race from './states/race.es6';

let Racer = window.Racer || {};

Racer.settings = SETTINGS;
Racer.game = new Phaser.Game(
    SETTINGS.map.width,
    SETTINGS.map.height,
    Phaser[SETTINGS.renderer], // renderer
    SETTINGS.container, // parent
    SETTINGS.defaultState, // state default
    SETTINGS.transparent, // transparent
    SETTINGS.antialias, // antyalias
    SETTINGS.phisicsConfig // physics configuration
);

Racer.game.state.add('Menu', Menu);
Racer.game.state.add('Race', Race);

// Start game.
Racer.game.state.start('Menu');

export default Racer;
