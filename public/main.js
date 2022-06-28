const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
console.log(params);

const canvas = document.querySelector("#myCanvas");
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 80, 108);

animate();

function animate() {
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.8);

    road.draw(ctx);
    car.update(road.borders);
    car.draw(ctx, params.damito == null && params.noSensors == null);

    ctx.restore();

    requestAnimationFrame(animate);
}
