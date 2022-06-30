const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const canvas = document.querySelector("#myCanvas");
canvas.width = 300;
canvas.focus();

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = params.empire == null ?
    new MillenniumFalcon(road.getLaneCenter(2), 100) :
    new TieFighter(road.getLaneCenter(2), 100, "KEYS", 180);
const traffic = [
    new TieFighter(road.getLaneCenter(2), -100, null, 180)
];

animate();

function animate() {
    canvas.height = window.innerHeight;

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders);
    }
    car.update(road.borders, traffic);

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.8);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, false, params.hitbox != null);
    }
    car.draw(
        ctx,
        params.damito == null && params.noSensors == null, // drawSensors
        params.hitbox != null // drawHitbox
        );

    ctx.restore();
    requestAnimationFrame(animate);
}
