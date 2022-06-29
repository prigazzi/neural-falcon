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
        this.damaged = false;

        this.controls = new Controls();
        this.sensor = new Sensor(this);

        this.img = new Image();
        this.img.src = "img/mf.png";
    }

    reset() {
        this.angle = 0;

        this.x += 10 * Math.sign(this.x) * -1;
    }

    #move() {
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

        if (this.speed != 0) {
            const flip = Math.sign(this.speed);

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }

            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    update(roadBorders) {
        if (this.damaged) {
            return;
        }

        this.#move();
        this.polygon = this.#createPolygon();
        this.damaged = this.#assessDamage(roadBorders);
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        return false;
    }

    draw(ctx, drawSensors = true, drawHitbox = false) {
        if (drawSensors) {
            this.sensor.draw(ctx);
        }

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

        if (!drawHitbox) return;

        if (this.damaged) {
            ctx.strokeStyle = "red";
        } else {
            ctx.strokeStyle = "blue";
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i=1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.lineTo(this.polygon[0].x,this.polygon[0].y);
        ctx.lineWidth = 1;

        ctx.stroke();
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x-Math.sin(this.angle-(alpha*0.2))*(rad*0.8),
            y: this.y-Math.cos(this.angle-(alpha*0.2))*(rad*0.8),
        });
        points.push({
            x: this.x-Math.sin(this.angle+(alpha*0.2))*(rad*0.8),
            y: this.y-Math.cos(this.angle+(alpha*0.2))*(rad*0.8),
        });
        points.push({
            x: this.x-Math.sin(Math.PI/2+this.angle)*(rad*0.6),
            y: this.y-Math.cos(Math.PI/2+this.angle)*(rad*0.6),
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-(alpha*0.85))*(rad*0.9),
            y: this.y-Math.cos(Math.PI+this.angle-(alpha*0.85))*(rad*0.9),
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+(alpha*0.85))*(rad*0.9),
            y: this.y-Math.cos(Math.PI+this.angle+(alpha*0.85))*(rad*0.9),
        });
        points.push({
            x: this.x-Math.sin(3*Math.PI/2+this.angle)*(rad*0.6),
            y: this.y-Math.cos(3*Math.PI/2+this.angle)*(rad*0.6),
        });

        return points;
    }
}
