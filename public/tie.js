class TieFighter extends Car {
    constructor(x, y, controlType = "DUMMY", imgRotation = 0) {
        super(x, y, 50, 40, controlType, "img/tie2.png", imgRotation);
        this.maxSpeed = 5;
    }
}

class GoodTieFighter extends TieFighter {
    constructor(x, y) {
        super(x, y, "KEYS", 180);
        this.maxSpeed = 8;
    }
}
