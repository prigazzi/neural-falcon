class Asteroid extends Car {
    constructor(x, y) {
        const rotation = Math.floor(Math.random() * 360)

        super(x, y, 50, 50, "DUMMY", "img/asteroide.png", rotation);
        this.maxSpeed = 5;
        this.rotationDirection = Math.sign(Math.random() - 0.5);
    }

    drawImage(ctx) {
        this.img.rotation += this.rotationDirection;
        super.drawImage(ctx);
    }
}
