class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;

        this.angle = 0;

        this.controls = new Controls();
    }

    updateSpeed() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        if (this.speed > this.maxSpeed) {
            this.speed == this.maxSpeed;
        }

        if (this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed/2;
        }

        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        this.y -= this.speed;
    }

    updateDirection()
    {
        if (this.controls.left) {
            this.angle += 0.03;
        }

        if (this.controls.right) {
            this.angle -= 0.03;
        }
    }

    update() {
        this.updateSpeed();
        this.updateDirection();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();
    }
}
