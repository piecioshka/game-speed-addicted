'use strict';

import CONFIG from './config.es6';

let game = new Phaser.Game(
    CONFIG.board.width,
    CONFIG.board.height,
    Phaser[CONFIG.renderer.toUpperCase()], // renderer
    CONFIG.container, // parent
    CONFIG.defaultState, // state default
    CONFIG.transparent, // transparent
    CONFIG.antialias, // antyalias
    CONFIG.phisicsConfig // physics configuration
);

