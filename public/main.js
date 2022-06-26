const canvas = document.querySelector("#myCanvas");
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
car.draw(ctx);

animate();

function animate() {
    canvas.height = window.innerHeight;

    road.draw(ctx);
    car.update();
    car.draw(ctx);

    requestAnimationFrame(animate);
}
