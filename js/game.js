import TWEEN from 'https://cdn.skypack.dev/tween.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);

const GRID_SIZE = 50; // Grootte van elk blokje in de grid
const BORDER_WIDTH = 1; // Breedte van de rand
const SPEED = 10;

const player = PIXI.Sprite.from('sprite/player.png');
setUpPlayer(player);

const obstacle = createObstacle();
app.stage.addChild(obstacle);

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

window.addEventListener('click', handleClick);
window.addEventListener('keydown', handleKeyDown);

function handleClick(event) {
    const targetX = Math.floor((event.clientX - app.view.getBoundingClientRect().left) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    const targetY = Math.floor((event.clientY - app.view.getBoundingClientRect().top) / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

    positionText.text = `X: ${targetX.toFixed(2)}, Y: ${targetY.toFixed(2)}`;
    if (canMoveTo(targetX, targetY)) {
        moveTo(targetX, targetY);
    }
}

function handleKeyDown(event) {
    let targetX = player.x;
    let targetY = player.y;

    switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
            targetY -= GRID_SIZE;
            break;
        case 'arrowdown':
        case 's':
            targetY += GRID_SIZE;
            break;
        case 'arrowleft':
        case 'a':
            targetX -= GRID_SIZE;
            break;
        case 'arrowright':
        case 'd':
            targetX += GRID_SIZE;
            break;
    }

    if (canMoveTo(targetX, targetY)) {
        moveTo(targetX, targetY);
    }
}

function moveTo(targetX, targetY) {
    player.x = targetX;
    player.y = targetY;
}

function canMoveTo(targetX, targetY) {
    if (targetX < 0 || targetX >= app.screen.width || targetY < 0 || targetY >= app.screen.height) {
        return false;
    }

    const obstacleBounds = obstacle.getBounds();
    if (targetX > obstacleBounds.x && targetX < obstacleBounds.x + obstacleBounds.width &&
        targetY > obstacleBounds.y && targetY < obstacleBounds.y + obstacleBounds.height) {
        return false;
    }

    return true;
}

function createObstacle() {
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0xFFFF00);
    obstacle.drawRect(2 * GRID_SIZE, 2 * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    obstacle.endFill();
    return obstacle;
}

function drawGrid() {
    gridGraphics.clear();
    gridGraphics.lineStyle(BORDER_WIDTH, 0xFFFFFF, 1); // Witte randlijnen

    for (let x = 0; x <= app.screen.width; x += GRID_SIZE) {
        gridGraphics.moveTo(x, 0);
        gridGraphics.lineTo(x, app.screen.height);
    }

    for (let y = 0; y <= app.screen.height; y += GRID_SIZE) {
        gridGraphics.moveTo(0, y);
        gridGraphics.lineTo(app.screen.width, y);
    }
}

function setUpPlayer(player) {
    player.height = GRID_SIZE;
    player.width = GRID_SIZE;
    player.anchor.set(0.5);
    player.x = Math.floor(app.screen.width / 2 / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    player.y = Math.floor(app.screen.height / 2 / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    app.stage.addChild(player);
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    app.renderer.render(app.stage);
}

animate();
