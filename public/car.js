class Car {
    constructor(x, y, width, height, controlType = "DUMMY", img = null, imgRotation = 0) {
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

        this.controls = new Controls(controlType);

        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
        }

        if (img) {
            this.img = new Image();
            this.img.src = img;
            this.img.rotation = imgRotation;
        }
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

    update(roadBorders, traffic = []) {
        if (this.damaged) {
            return;
        }

        this.#move();
        this.polygon = this.createPolygon();
        this.damaged = this.#assessDamage(roadBorders, traffic);

        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }

    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    }

    draw(ctx, drawSensors = true, drawHitbox = false) {
        if (drawSensors) {
            if (this.sensor) this.sensor.draw(ctx);
        }

        this.drawImage(ctx);
        this.drawPolygon(ctx);

        if (drawHitbox) {
            this.drawHitBox(ctx);
        }
    }

    drawImage(ctx) {
        if (this.img) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-this.angle + (this.img.rotation*Math.PI/180));

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
        }
    }

    drawPolygon(ctx) {
        if (!this.img) {
            this.#polygonContext(ctx);
            ctx.fill();
        }
    }

    drawHitBox(ctx) {
        if (this.damaged) {
            ctx.strokeStyle = "red";
        } else {
            ctx.strokeStyle = "blue";
        }
        ctx.lineWidth = 1;

        // If there's an image defined, we need to set the
        // polygon into the context becase drawPolygon didn't
        // call this yet.
        if (this.img) {
            this.#polygonContext(ctx);
        }
        ctx.stroke();
    }

    #polygonContext(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i=1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.lineTo(this.polygon[0].x,this.polygon[0].y);
    }

    createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x-Math.sin(this.angle-(alpha))*(rad),
            y: this.y-Math.cos(this.angle-(alpha))*(rad),
        });
        points.push({
            x: this.x-Math.sin(this.angle+(alpha))*(rad),
            y: this.y-Math.cos(this.angle+(alpha))*(rad),
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-(alpha))*(rad),
            y: this.y-Math.cos(Math.PI+this.angle-(alpha))*(rad),
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+(alpha))*(rad),
            y: this.y-Math.cos(Math.PI+this.angle+(alpha))*(rad),
        });

        return points;
    }
}
