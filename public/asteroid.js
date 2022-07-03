class Asteroid extends Car {
    constructor(x, y) {
        const rotation = Math.floor(Math.random() * 360)

        super(x, y, 50, 50, "DUMMY", "img/asteroide.png", rotation);
        this.maxSpeed = 5;
    }
}
