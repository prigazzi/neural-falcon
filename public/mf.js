class MillenniumFalcon extends Car {
    constructor(x, y, imgRotation = 0) {
        super(x, y, 80, 108, "KEYS", "img/mf.png", imgRotation)
        this.maxSpeed = 10;
    }

    createPolygon() {
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
