class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 10;
        this.friction = 0.05;

        this.angle = 0;

        this.controls = new Controls();
        this.sensor = new Sensor(this);
        this.img = new Image();
        this.img.src = "img/mf.png";
    }

    updateSpeed() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // Max forward and reverse Speed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        if (this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed/2;
        }

        // Friction Calculation
        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    updateDirection()
    {
        if (this.speed != 0) {
            const flip = Math.sign(this.speed);

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }

            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }
    }

    update(roadBorders) {
        this.updateSpeed();
        this.updateDirection();
        this.sensor.update(roadBorders);
    }

    draw(ctx) {
        this.sensor.draw(ctx);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.shadowColor = "#888";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
        ctx.drawImage(
            this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );

        ctx.restore();
        // Code to draw the square
        // ctx.beginPath();
        // ctx.rect(
        //     - this.width / 2,
        //     - this.height / 2,
        //     this.width,
        //     this.height
        // );

        ctx.fill();
        ctx.restore();
    }
}
