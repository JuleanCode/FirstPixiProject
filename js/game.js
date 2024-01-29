import TWEEN from 'https://cdn.skypack.dev/tween.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);

const GRID_SIZE = 50;
const BORDER_WIDTH = 1;
const SOUND_THRESHOLD = 0.02;
let speaking_timer = 0;
let player_speaking = false;

const gridGraphics = new PIXI.Graphics();
app.stage.addChild(gridGraphics);

const obstacles = [];

// Functie om het grid te tekenen
function drawGrid() {
    gridGraphics.clear();
    gridGraphics.lineStyle(BORDER_WIDTH, 0xFFFFFF, 1);

    for (let x = 0; x <= app.screen.width; x += GRID_SIZE) {
        gridGraphics.moveTo(x, 0);
        gridGraphics.lineTo(x, app.screen.height);
    }

    for (let y = 0; y <= app.screen.height; y += GRID_SIZE) {
        gridGraphics.moveTo(0, y);
        gridGraphics.lineTo(app.screen.width, y);
    }
}

// Functie om een obstakel toe te voegen
function addObstacle(x, y) {
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0xFFFF00); // Gele kleur
    obstacle.drawRect(x, y, GRID_SIZE, GRID_SIZE);
    obstacle.endFill();
    app.stage.addChild(obstacle);
    obstacles.push(obstacle);
}

// Functie om de speler te tekenen
function drawPlayer(x, y) {
    const player = PIXI.Sprite.from('sprite/player.png');
    player.width = GRID_SIZE;
    player.height = GRID_SIZE;
    player.x = x;
    player.y = y;
    app.stage.addChild(player);
    return player;
}

// Huidige spelerpositie
let playerX = Math.floor(app.screen.width / 2 / GRID_SIZE) * GRID_SIZE;
let playerY = Math.floor(app.screen.height / 2 / GRID_SIZE) * GRID_SIZE;

const player = drawPlayer(playerX, playerY);

// Aanvankelijke grid tekenen
drawGrid();

window.addEventListener('click', handleClick);
window.addEventListener('keydown', handleKeyDown);

const instantMeter = document.querySelector('#instant meter');

function handleClick(event) {
    const targetX = Math.floor((event.clientX - app.view.getBoundingClientRect().left) / GRID_SIZE) * GRID_SIZE;
    const targetY = Math.floor((event.clientY - app.view.getBoundingClientRect().top) / GRID_SIZE) * GRID_SIZE;

    if (canMoveTo(targetX, targetY)) {
        // Verwijder het obstakel van de huidige spelerpositie
        const obstacleIndex = obstacles.findIndex(obstacle => obstacle.x === playerX && obstacle.y === playerY);
        if (obstacleIndex !== -1) {
            app.stage.removeChild(obstacles[obstacleIndex]);
            obstacles.splice(obstacleIndex, 1);
        }

        // Verplaats de speler
        player.x = targetX;
        player.y = targetY;

        // Voeg een obstakel toe op de nieuwe spelerpositie
        addObstacle(targetX, targetY);
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
        // Verwijder het obstakel van de huidige spelerpositie
        const obstacleIndex = obstacles.findIndex(obstacle => obstacle.x === playerX && obstacle.y === playerY);
        if (obstacleIndex !== -1) {
            app.stage.removeChild(obstacles[obstacleIndex]);
            obstacles.splice(obstacleIndex, 1);
        }

        // Verplaats de speler
        player.x = targetX;
        player.y = targetY;

        // Voeg een obstakel toe op de nieuwe spelerpositie
        addObstacle(targetX, targetY);
    }
}

function canMoveTo(targetX, targetY) {
    if (targetX < 0 || targetX >= app.screen.width || targetY < 0 || targetY >= app.screen.height) {
        return false;
    }

    // Controleer of de nieuwe positie bezet is door een ander obstakel
    return !obstacles.some(obstacle => obstacle.x === targetX && obstacle.y === targetY);
}

function animate() {
    // Voeg hier je animatielogica toe, zoals het controleren van geluid, enz.

    requestAnimationFrame(animate);
    TWEEN.update();
    app.renderer.render(app.stage);
}

animate();
