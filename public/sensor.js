class Sensor {
    constructor(car) {
        this.car = car;
        this.rayCount = 7;
        this.rayLength = 200;
        this.raySpread = Math.PI/2; // 45 degrees in radians

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders, traffic) {
        this.#castRays();

        this.readings = [];
        this.rays.forEach(ray => {
            this.readings.push(
                this.#getReading(
                    ray,
                    roadBorders,
                    traffic
                )
            );
        });
    }

    #getReading(ray, roadBorders, traffic) {
        let touches = [];
        roadBorders.forEach(border => {
            const touch = getIntersectionBetween(ray, border);

            if (touch) {
                touches.push(touch);
            }
        });

        traffic.forEach(car => {
            const polygon = car.polygon;

            for (let i = 0; i < polygon.length; i++) {
                const touch = getIntersectionBetween(
                    ray,
                    [polygon[i], polygon[(i+1) % polygon.length]]
                )

                if (touch) {
                    touches.push(touch);
                }
            }
        });

        if (touches.length == 0) {
            return null;
        }

        const offsets = touches.map(e => e.offset);
        const minOffset = Math.min(...offsets);

        return touches.find(e => e.offset == minOffset);
    }

    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        this.rays.forEach((ray, index) => {
            let rayStart = ray[0];
            let rayEnd = ray[1];

            if (this.readings[index]) {
                let sensorPoint = this.readings[index]
                rayEnd = sensorPoint;

                ctx.save();

                ctx.beginPath();
                ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
                ctx.arc(sensorPoint.x, sensorPoint.y, 3, 0, Math.PI*2);
                ctx.fill();

                ctx.restore();
            }

            // Draw the Sensor line until rayEnd or ReadingEnd
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
            ctx.moveTo(rayStart.x, rayStart.y);
            ctx.lineTo(rayEnd.x, rayEnd.y);
            ctx.stroke();

            // Draw the Sensor line from rayEnd until ReadingEnd
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(16, 0, 0, 0.3)";
            ctx.moveTo(ray[1].x, ray[1].y);
            ctx.lineTo(rayEnd.x, rayEnd.y);
            ctx.stroke();
        });
    }
}
