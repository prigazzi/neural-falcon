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
const cars = [
    params.empire == null ?
    new MillenniumFalcon(road.getLaneCenter(2), 100) :
    new TieFighter(road.getLaneCenter(2), 100, "KEYS", 180)
];
cars.push(...generateCars(1000));
let bestCar = cars[1];

if (storedBestBrain = localStorage.getItem('bestBrain')) {
    cars[1].brain = JSON.parse(storedBestBrain);

    for (let i = 2; i < cars.length; i++) {
        cars[i].brain = JSON.parse(storedBestBrain);

        NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
}

const traffic = [
    new TieFighter(road.getLaneCenter(2), -100, null, 180),
    new TieFighter(road.getLaneCenter(0), -300, null, 180),
    new TieFighter(road.getLaneCenter(5), -300, null, 180),
    new TieFighter(road.getLaneCenter(2), -100, null, 180),
    new TieFighter(road.getLaneCenter(0), -300, null, 180),
    new TieFighter(road.getLaneCenter(5), -500, null, 180),
    new TieFighter(road.getLaneCenter(2), -500, null, 180),
    new TieFighter(road.getLaneCenter(0), -700, null, 180),
    new TieFighter(road.getLaneCenter(5), -700, null, 180),
];

(
    function updateTraffic() {
        const lane = Math.floor(Math.random() * (road.laneCount-1));
        const lastTraffic = traffic[traffic.length-1];

        if (lastTraffic.y - bestCar.y > -2000) {
            traffic.push(new TieFighter(road.getLaneCenter(lane), lastTraffic.y-300, null, 180));
        }

        setTimeout(updateTraffic, 1000);
    }
)();

animate();

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem('bestBrain');
}

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new MillenniumFalcon(road.getLaneCenter(2), 100, "AI"));
    }
    return cars;
}

function animate(time) {
    carCanvas.height = window.innerHeight;
    netCanvas.height = window.innerHeight;

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders);
    }

    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        car.update(road.borders, traffic);

        if (car.damaged) {
            cars.splice(i, 1);
        }
    }
    bestCar = cars.find(
        car => car.y == Math.min(...cars.map(car => car.y))
    );

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, false, params.hitbox != null);
    }

    cars[0].draw(
        carCtx,
        params.damito == null && params.noSensors == null, // drawSensors
        params.hitbox != null // drawHitbox
    );

    cars[1].draw(
        carCtx,
        false, //params.damito == null && params.noSensors == null, // drawSensors
        true //params.hitbox != null // drawHitbox
    );

    carCtx.globalAlpha = 0.5;
    for (let i = 2; i < cars.length; i++) {
        cars[i].draw(
            carCtx,
            false,
            false
        );
    }
    carCtx.globalAlpha = 1;

    carCtx.restore();

    netCtx.lineDashOffset = -time/120;
    Visualizer.drawNetwork(netCtx, bestCar.brain);

    requestAnimationFrame(animate);
}
