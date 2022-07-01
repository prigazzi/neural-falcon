const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const carCanvas = document.querySelector("#myCanvas");
carCanvas.width = 300;
const carCtx = carCanvas.getContext('2d');

const netCanvas = document.querySelector("#network");
netCanvas.width = 400;
const netCtx = netCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = params.empire == null ?
    new MillenniumFalcon(road.getLaneCenter(2), 100, "AI") :
    new TieFighter(road.getLaneCenter(2), 100, "KEYS", 180);
const traffic = [
    new TieFighter(road.getLaneCenter(2), -100, null, 180)
];

animate();

function animate(time) {
    carCanvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders);
    }
    car.update(road.borders, traffic);

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.8);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, false, params.hitbox != null);
    }
    car.draw(
        carCtx,
        params.damito == null && params.noSensors == null, // drawSensors
        params.hitbox != null // drawHitbox
        );

    carCtx.restore();

    netCtx.lineDashOffset = -time/120;
    Visualizer.drawNetwork(netCtx, car.brain);
    requestAnimationFrame(animate);
}
