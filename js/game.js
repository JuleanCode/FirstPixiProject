import TWEEN from 'https://cdn.skypack.dev/tween.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);

const gridSize = 50; // Grootte van elk blokje in de grid
const borderWidth = 1; // Breedte van de rand
const speed = 10;

const player = PIXI.Sprite.from('sprite/player.png');
player.anchor.set(0.5);
player.x = Math.floor(app.screen.width / 2 / gridSize) * gridSize + gridSize / 2; // Midden van het blokje
player.y = Math.floor(app.screen.height / 2 / gridSize) * gridSize + gridSize / 2; // Midden van het blokje
app.stage.addChild(player);

const positionText = new PIXI.Text(`X: ${player.x.toFixed(2)}, Y: ${player.y.toFixed(2)}`, {
    fontFamily: 'Arial',
    fontSize: 16,
    fill: 0xFFFFFF,
});
positionText.x = 10;
positionText.y = 10;
app.stage.addChild(positionText);

const gridGraphics = new PIXI.Graphics();
app.stage.addChild(gridGraphics);

drawGrid();

window.addEventListener('click', movePlayer);
window.addEventListener('keydown', handleKeyDown);

function movePlayer(event) {
    const targetX = Math.floor((event.clientX - app.view.getBoundingClientRect().left) / gridSize) * gridSize + gridSize / 2;
    const targetY = Math.floor((event.clientY - app.view.getBoundingClientRect().top) / gridSize) * gridSize + gridSize / 2;

    positionText.text = `X: ${targetX.toFixed(2)}, Y: ${targetY.toFixed(2)}`;

    moveTo(targetX, targetY);
}

function handleKeyDown(event) {
    let targetX = player.x;
    let targetY = player.y;

    switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            targetY -= gridSize;
            break;
        case 'arrowdown':
        case 's':
            targetY += gridSize;
            break;
        case 'arrowleft':
        case 'a':
            targetX -= gridSize;
            break;
        case 'arrowright':
        case 'd':
            targetX += gridSize;
            break;
    }

    targetX = Math.floor(targetX / gridSize) * gridSize + gridSize / 2;
    targetY = Math.floor(targetY / gridSize) * gridSize + gridSize / 2;

    positionText.text = `X: ${targetX.toFixed(2)}, Y: ${targetY.toFixed(2)}`;

    moveTo(targetX, targetY);
}

function moveTo(targetX, targetY) {
    const tween = new TWEEN.Tween(player)
        .to({ x: targetX, y: targetY }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

function drawGrid() {
    gridGraphics.clear();
    gridGraphics.lineStyle(borderWidth, 0xFFFFFF, 1); // Witte randlijnen

    for (let x = 0; x <= app.screen.width; x += gridSize) {
        gridGraphics.moveTo(x, 0);
        gridGraphics.lineTo(x, app.screen.height);
    }

    for (let y = 0; y <= app.screen.height; y += gridSize) {
        gridGraphics.moveTo(0, y);
        gridGraphics.lineTo(app.screen.width, y);
    }
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    app.renderer.render(app.stage);
}

animate();
