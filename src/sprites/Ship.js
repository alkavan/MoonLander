import Phaser from 'phaser'

/**
 * Ship Sprite Class
 * @name Ship
 */
export default class extends Phaser.Sprite {

    constructor ({ game, x, y, asset }, speed = 2000) {

        super(game, x, y, asset);

        // Rotation anchor
        this.anchor.setTo(0.5);

        // Enable P2 physics
        game.physics.p2.enable(this);
        this.body.mass = 1;

        this._speed = speed;
    }

    get speed() { return this._speed; }
    set speed(speed) { return this._speed = speed; }

    applyCursorsThrust (thrust) {
        if (this.game.cursors.left.isDown)
        {
            this.body.thrustLeft(thrust);
        }
        else if (this.game.cursors.right.isDown)
        {
            this.body.thrustRight(thrust);
        }

        if (this.game.cursors.up.isDown)
        {
            this.body.thrust(thrust);
        }
        else if (this.game.cursors.down.isDown)
        {
            this.body.thrust(thrust*-1);
        }
    }

    _getPhysicsElapsed() {
        return this.game.time.physicsElapsed;
    }

    getThrust() {
        return this._getPhysicsElapsed() * this.speed;
    }

    update () {
        this.applyCursorsThrust(this.getThrust())
    }
}
