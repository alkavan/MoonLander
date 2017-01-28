/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'

export default class extends Phaser.State {

    init () {
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 2 *9.81;
    }

    preload () {

        //
        // Game assets
        //
        this.load.image('ship1', 'assets/images/ship1.png');
        this.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('lunar_subterrain', 'assets/sprites/lunar_subterrain.png');

    }

    create () {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createBanner();
        this.createLevel();

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

    createLevel() {
        let map = game.add.tilemap('level1');
        map.addTilesetImage('lunar_subterrain', 'lunar_subterrain');

        //  Set the tiles for collision.
        //  Do this BEFORE generating the p2 bodies below.
        map.setCollisionBetween(0, 15);

        let layer = map.createLayer('MapLayer');

        this.physics.p2.convertTilemap(map, layer);

        layer.resizeWorld();
    }
}
