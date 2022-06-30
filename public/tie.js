class TieFighter extends Car {
    constructor(x, y, controlType = "DUMMY", imgRotation = 0) {
        super(x, y, 50, 40, controlType, "img/tie2.png", imgRotation);
        this.maxSpeed = 8;
    }
}
