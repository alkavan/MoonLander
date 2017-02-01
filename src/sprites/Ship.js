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
        this.body.mass = 5.0;

        this._speed = speed;

        // Engine
        let fire1 = game.add.sprite(this.x, this.y, 'fire1');
        fire1.angle = 90;
        fire1.anchor.setTo(0.5);
        let aaa = fire1.animations.add('aaa');
        fire1.animations.play('aaa', 30, true);

        this._engineFire = fire1;
        this._engineFire.exists = false;
    }

    get speed() { return this._speed; }
    set speed(speed) { return this._speed = speed; }

    applyCursorsThrust (thrust) {

        let wasDown = false;

        if (this.game.cursors.left.isDown)
        {
            this.body.thrustLeft(thrust);
            wasDown = true;
        }
        else if (this.game.cursors.right.isDown)
        {
            this.body.thrustRight(thrust);
            wasDown = true;
        }

        if (this.game.cursors.up.isDown)
        {
            this.body.thrust(thrust);
            wasDown = true;
        }
        else if (this.game.cursors.down.isDown)
        {
            this.body.thrust(thrust*-1);
            wasDown = true;
        }

        this._engineFire.exists = wasDown;
    }

    _getPhysicsElapsed() {
        return this.game.time.physicsElapsed;
    }

    getThrust() {
        return this._getPhysicsElapsed() * this.speed;
    }

    update () {
        this.applyCursorsThrust(this.getThrust());
        this._engineFire.x = this.x;
        this._engineFire.y = this.y+24;
    }
}
