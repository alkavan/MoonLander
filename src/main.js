import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState   from './states/Boot'
import SplashState from './states/Splash'
import GameState   from './states/Game'

import _config from './config'

class Game extends Phaser.Game {

    constructor () {
        const docElement = document.documentElement;

        const width = docElement.clientWidth > _config.gameWidth ?
            _config.gameWidth : docElement.clientWidth;

        const height = docElement.clientHeight > _config.gameHeight ?
            _config.gameHeight : docElement.clientHeight;

        super(width, height, Phaser.WEBGL, 'canvasContainer', null);

        this.state.add('Boot',   BootState,   false);
        this.state.add('Splash', SplashState, false);
        this.state.add('Game',   GameState,   false);

        this.state.start('Boot');
    }
}

window.game = new Game();
