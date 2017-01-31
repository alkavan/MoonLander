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

        let ship = new Ship({
            game:   this,
            x:      this.world.centerX,
            y:      this.world.centerY,
            asset:  'ship1'
        }, 2000);

        let playerCollisionGroup = this.physics.p2.createCollisionGroup();
        // ship.body.setCollisionGroup(playerCollisionGroup);
        this.add.existing(ship);

        this.playerCollisionGroup = playerCollisionGroup;
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
        let map = this.add.tilemap('level1');
        map.addTilesetImage('lunar_subterrain', 'lunar_subterrain');

        //  Set the tiles for collision.
        //  Do this BEFORE generating the p2 bodies below.
        map.setCollisionBetween(0, 15);

        let layer = map.createLayer('MapLayer');
        layer.resizeWorld();

        this.physics.p2.convertTilemap(map, layer);

        this.landingZones = this.add.group();
        this.landingZones.enableBody = true;


        this.physics.p2.updateBoundsCollisionGroup();

        // This should work, but it's not, find out why.
        map.enableDebug = true;
        console.log(map);
        let mission = this.physics.p2.convertCollisionObjects(map, 'Mission', true);
        console.log(mission);

        // this.landingZonesC = this.physics.p2.createCollisionGroup();
        // map.createFromObjects('Mission', 1, 'landing_zone', 0, true, false, this.landingZones);
    }
}
