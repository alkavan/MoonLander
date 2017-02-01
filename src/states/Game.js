/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'

const GRAVITY = 9.81;
const GRAVITY_MULTIPLIER = 2;
const GM = GRAVITY_MULTIPLIER * GRAVITY;

export default class extends Phaser.State {

    init () {
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = GM;
    }

    preload () {
        this.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('lunar_subterrain', 'assets/sprites/lunar_subterrain.png');
        this.load.spritesheet('landing_zone', 'assets/sprites/landing_zone.png', 48, 8);
        this.load.image('ship1', 'assets/images/ship1.png');
    }

    create () {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createLevel();
        this.createBanner();
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
        // Add map to world
        let map = this.add.tilemap('level1');
        map.addTilesetImage('lunar_subterrain', 'lunar_subterrain');

        //  Set the tiles for collision.
        //  Do this BEFORE generating the p2 bodies below.
        map.setCollisionBetween(0, 15);

        let layer = map.createLayer('MapLayer');
        layer.resizeWorld();

        // Set physics on 'MapLayer' of tilemap
        this.physics.p2.convertTilemap(map, layer);
        this.physics.p2.updateBoundsCollisionGroup();

        // Landing zones
        let landingZones = this.add.group();
        landingZones.enableBody = true;
        landingZones.physicsBodyType = Phaser.Physics.P2JS;

        console.log(map);

        map.createFromObjects('Mission', 'Landing Zone 1', 'landing_zone', 0, true, false, landingZones);
        map.createFromObjects('Mission', 'Landing Zone 2', 'landing_zone', 0, true, false, landingZones);

        landingZones.forEachExists((lz) => {
            lz.body.static = true;
        });

        // Ship
        let ship = new Ship({
            game:   this,
            x:      this.world.centerX,
            y:      this.world.centerY,
            asset:  'ship1'
        }, 2000);

        // Ship contact events
        ship.body.onBeginContact.add(function () {
            console.log('CONTACT >', arguments);
        }, this);

        this.add.existing(ship);

        this.landingZones = landingZones;
        this.ship         = ship;
    }
}
