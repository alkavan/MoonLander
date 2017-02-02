/* globals __DEV__ */
import Phaser from 'phaser'
import Ship from '../sprites/Ship'

const GRAVITY = 9.81;
const GRAVITY_MULTIPLIER = 2;
const GM = GRAVITY_MULTIPLIER * GRAVITY;

/**
 * Game State
 * @name GameState
 */
export default class extends Phaser.State {
    /**
     * State init callback
     */
    init () {
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = GM;
        this.physics.p2.restitution = 0.12;
    }

    /**
     * State preload callback
     */
    preload () {
        this.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('lunar_subterrain', 'assets/sprites/lunar_subterrain.png');
        this.load.image('ship1', 'assets/images/ship1.png');
        this.load.image('cargo1', 'assets/images/cargo1.png');
        this.load.spritesheet('landing_zone', 'assets/sprites/landing_zone.png', 48, 8);
        this.load.spritesheet('fire1', 'assets/sprites/fire1.png', 24, 24);
    }

    /**
     * State create callback
     */
    create () {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createLevel();
        this.createBanner();
        this.createScore(32, 200);

        let music = this.add.audio('music_track_01', 1, true);
        music.play();
    }

    /**
     * State render callback
     */
    render () {
        if (__DEV__) {
            this.game.debug.spriteInfo(this.ship, 32, 32)
        }

        this.scoreLabel.setText("Score: " + this.score);
    }

    /**
     * Create game top banner (title)
     */
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

    /**
     * Create "big" message in location
     * @param messageText
     * @param x
     * @param y
     */
    createMessage(messageText, x, y) {
        let message = this.add.text(x, y, messageText);

        message.padding.set(3, 6);
        message.fontSize = 24;
        message.fill = '#ff4f4a';
        message.smoothed = false;
        message.anchor.setTo(0.5);
        message.alpha = 0;

        // Tween animation
        this.add.tween(message).to(
            { alpha: 1 },
            600,
            Phaser.Easing.Linear.None,
            true,
            0,
            1,
            true
        );
    }


    createScore(x, y, initial = 0) {
        this.score = initial;
        let score = this.add.text(x, y, initial);

        score.padding.set(3, 6);
        score.fontSize = 24;
        score.fill = '#75ff5d';
        score.smoothed = false;
        score.alpha = 0.75;

        this.scoreLabel = score;
    }

    addScore(appendValue) {
        this.score += appendValue
    }

    /**
     * Create and setup level entities
     */
    createLevel() {
        // Add map to world
        let map = this.add.tilemap('level1');
        map.addTilesetImage('lunar_subterrain', 'lunar_subterrain');

        //  Set the tiles for collision.
        //  Do this BEFORE generating the p2 bodies below.
        map.setCollisionBetween(0, 15);

        let layer = map.createLayer('MapLayer');
        layer.resizeWorld();

        let decoLayer = map.createLayer('Deco');

        // Set physics on 'MapLayer' of tilemap
        this.physics.p2.convertTilemap(map, layer);
        this.physics.p2.updateBoundsCollisionGroup();

        // Landing zones
        let landingZones = this.add.group();
        landingZones.enableBody = true;
        landingZones.physicsBodyType = Phaser.Physics.P2JS;

        let cargoGroup = this.add.group();
        cargoGroup.enableBody = true;
        cargoGroup.physicsBodyType = Phaser.Physics.P2JS;
        // DEBUG
        // console.log(map);

        map.createFromObjects('Mission', 'Landing Zone 1', 'landing_zone', 0, true, false, landingZones);
        map.createFromObjects('Mission', 'Landing Zone 2', 'landing_zone', 0, true, false, landingZones);
        map.createFromObjects('Mission', 'Main Cargo', 'cargo1', 0, true, false, cargoGroup);
        map.createFromObjects('Mission', 'Extra Cargo', 'cargo1', 0, true, false, cargoGroup);

        landingZones.forEachExists((lz) => {
            lz.body.static = true;
        });

        cargoGroup.forEachExists((cargo) => {
            cargo.body.mass = 3.0;
        });

        // Ship
        let ship = new Ship({
            game:   this,
            x:      this.world.centerX,
            y:      this.world.centerY,
            asset:  'ship1'
        }, 8000);

        this.add.existing(ship);

        // Ship contact events
        ship.body.onBeginContact.add(function () {
            console.log('CONTACT >', arguments);
            let parent = arguments[1].parent;

            if(parent && parent.sprite !== null && parent.sprite.key === 'landing_zone') {
                this.createMessage("Landed at " + parent.sprite.name + "! +100", this.world.centerX, 100);
                this.addScore(100);
            }
        }, this);

        this.landingZones = landingZones;
        this.ship         = ship;
    }
}
