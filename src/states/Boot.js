import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
    init () {
        this.stage.backgroundColor = '#000000';
        this.fontsReady = false;
        this.fontsLoaded = this.fontsLoaded.bind(this);
    }

    preload () {

        let loadingText = this.add.text(this.world.centerX, this.world.centerY, 'init ...', { font: '16px Arial', fill: '#dddddd', align: 'center' });

        loadingText.anchor.setTo(0.5, 0.5);

        loadingText.setText('Loading fonts ...');

        WebFont.load({
            google: {
                families: ['Bangers']
            },
            active: this.fontsLoaded
        });

        loadingText.setText('Loading assets ...');

        this.load.image('loaderBg', './assets/images/loader-bg.png');
        this.load.image('loaderBar', './assets/images/loader-bar.png');
    }

    render () {
        if (this.fontsReady) {
            this.state.start('Splash');
        }
    }

    fontsLoaded () {
        this.fontsReady = true;
    }
}
