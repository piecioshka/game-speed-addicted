'use strict';

// Styles
require('../../assets/styles/main');

import SETTINGS from './settings';
import MenuState from './states/MenuState';
import RaceState from './states/RaceState';

let Racer = {};

Racer.settings = SETTINGS;
Racer.game = new Phaser.Game(
    SETTINGS.map.width,
    SETTINGS.map.height,
    Phaser[SETTINGS.renderer], // renderer
    SETTINGS.container, // parent
    SETTINGS.defaultState, // state default
    SETTINGS.transparent, // transparent
    SETTINGS.antialias, // antyalias
    SETTINGS.physics // physics configuration
);

// States
Racer.game.state.add('Menu', MenuState);
Racer.game.state.add('Race', RaceState);

// Start game.
Racer.game.state.start('Menu');
