class Space extends Road {
    constructor(x, width) {
        super(x, width);
        this.img = new Image();
        this.img.src = "./img/background.png";
        this.img.onload = this.isImageLoaded(this);
        this.img.loaded = false;
        this.imgHeight = 0;
        this.debug = false;
    }

    draw(ctx, canvasHeight, speed) {
        this.drawSpace(ctx, canvasHeight, speed);
        super.drawBorders(ctx);
    }

    drawSpace(ctx, canvasHeight, speed) {
        if (this.img.loaded == false) return;

        const slices = Math.ceil(canvasHeight / this.img.naturalHeight);

        for (let i = -1; i < slices; i++) {
            ctx.drawImage(
                this.img,
                0,
                this.imgHeight - (this.img.height * i),
                this.img.width,
                this.img.height
            );

            if (this.debug) {
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.moveTo(0, this.imgHeight - (this.img.height * i));
                ctx.lineTo(this.img.width, this.img.height + this.imgHeight - (this.img.height * i));
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "white";
                ctx.font = "50px Monospace";
                ctx.lineWidth = 1;
                ctx.fillText(`${i}`, this.img.width / 2, this.imgHeight - (this.img.height * i) + (this.img.height / 2));
                ctx.strokeText(`${i}`, this.img.width / 2, this.imgHeight - (this.img.height * i) + (this.img.height / 2));
            }
        }
        this.imgHeight = speed  % this.img.naturalHeight;
    }

    isImageLoaded(that) {
        return function() {
            that.img.loaded = true;
        }
    }
}
