const settings = {
    map: {
        width: 1280,
        height: 800
    },
    renderer: 'canvas'.toUpperCase(),
    container: '',
    defaultState: null,
    transparent: false,
    antialias: true,
    physics: 'arcade'.toUpperCase(),
    game: {
        angularVelocity: 0,
        moveOffset: 2,
        initialSpeed: 0,
        velocity: 0.02,
        maxSpeed: 50,
        divider: 20
    }
};

export default settings;
