class Score {
    constructor(element, car) {
        this.element = element;
        this.car = car;
        this.value = parseInt(element.innerHtml);
    }

    update() {
        if (!this.car.disabled) {
            this.value = Math.ceil(-this.car.y);
            this.element.textContent = this.value;
        }
    }
}