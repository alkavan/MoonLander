/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'

export default class extends Phaser.State {

    init () {
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 2 *9.81;
    }

    preload () {

    }

    create () {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createBanner();

        let ship = new Ship({
            game:   this,
            x:      this.world.centerX,
            y:      this.world.centerY,
            asset:  'ship1'
        });

        this.game.add.existing(ship);
        this.ship = ship;
    }

    render () {
        if (__DEV__) {
            this.game.debug.spriteInfo(this.ship, 32, 32)
        }
    }

    createBanner() {
        const bannerText = 'Moon Lander (0.0.1-alpha)';
        let banner = this.add.text(this.world.centerX, 35, bannerText);

        banner.font = 'Bangers';
        banner.padding.set(10, 16);
        banner.fontSize = 36;
        banner.fill = '#ffffff';
        banner.smoothed = false;
        banner.anchor.setTo(0.5);
    }
}
