'use strict';

import SETTINGS from './settings.es6';
import Boot from './states/boot.es6';

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

Racer.states = {
    Boot
};

Racer.game.state.add('boot', Racer.states.Boot);

// Start game.
Racer.game.state.start('boot');

export default Racer;
