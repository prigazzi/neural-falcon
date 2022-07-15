class HighScore {
    constructor(element, score1, score2) {
        this.element = element;
        this.score1 = score1;
        this.score2 = score2;
        this.highscore = parseInt(localStorage.getItem("highscore") | 0);
    }

    update() {
        let newHigh = this.highscore;

        if (this.score1.value > newHigh) {
            newHigh = this.storeNewHighscore(this.score1.value);
        }

        if (this.score2.value > newHigh) {
            newHigh = this.storeNewHighscore(this.score2.value);
        }

        this.highscore = newHigh;
        this.element.textContent = this.highscore;
    }

    storeNewHighscore(highscore) {
        localStorage.setItem("highscore", highscore);
        return highscore;
    }
}