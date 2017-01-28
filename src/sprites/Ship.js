import Phaser from 'phaser'

let _gameTime       = Symbol();
let _physicsElapsed = Symbol();

export default class extends Phaser.Sprite {

    constructor ({ game, x, y, asset }) {

        super(game, x, y, asset);

        // Rotation anchor
        this.anchor.setTo(0.5);

        // Enable P2 physics
        game.physics.p2.enable(this);
        this.body.mass = 1;

        // Setup object symbols
        this[_gameTime]       = game.time;
        this[_physicsElapsed] = game.time.physicsElapsed;

        // Entity properties
        this['cursors'] = game.cursors;
        this['speed']   = 2000;
    }

    applyCursorsThrust (thrust) {
        if (this.cursors.left.isDown)
        {
            this.body.thrustLeft(thrust);
        }
        else if (this.cursors.right.isDown)
        {
            this.body.thrustRight(thrust);
        }

        if (this.cursors.up.isDown)
        {
            this.body.thrust(thrust);
        }
        else if (this.cursors.down.isDown)
        {
            this.body.thrust(thrust*-1);
        }
    }

    getThrust() {
        return this[_physicsElapsed] * this.speed;
    }

    update () {
        this.applyCursorsThrust(this.getThrust())
    }
}
