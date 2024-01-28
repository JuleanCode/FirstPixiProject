import TWEEN from 'https://cdn.skypack.dev/tween.js';

const app = new PIXI.Application();
document.body.appendChild(app.view);

const GRID_SIZE = 50;
const BORDER_WIDTH = 1;
const SPEED = 10;
const SOUND_TRESHOLD = 0.02
let speaking_timer = 0
let player_speaking = false

export const player = PIXI.Sprite.from('sprite/player.png');
let player_circle = new PIXI.Graphics();
let player_container = new PIXI.Graphics();

app.stage.addChild(player_container);
player_container.addChild(player)

setUpPlayer(player)

export let player_list = []

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

const instantMeter = document.querySelector('#instant meter');

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
    checkPlayerNearObstacle(player.x, player.y);
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

function checkPlayerNearObstacle(playerX, playerY) {
    if (isPlayerNearObstacle(playerX, playerY)) {
        console.log('Speler is in de buurt van het gele blokje:', playerX, playerY);
    }
}

function isPlayerNearObstacle(playerX, playerY) {
    const obstacleBounds = obstacle.getBounds();
    const obstacleX = obstacleBounds.x / GRID_SIZE;
    const obstacleY = obstacleBounds.y / GRID_SIZE;

    const playerGridX = Math.floor(playerX / GRID_SIZE);
    const playerGridY = Math.floor(playerY / GRID_SIZE);

    const distanceX = Math.abs(playerGridX - obstacleX);
    const distanceY = Math.abs(playerGridY - obstacleY);

    return (distanceX <= 1 && distanceY <= 1);
}

function createObstacle() {
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0xFFFF00); // Gele kleur
    obstacle.drawRect(2 * GRID_SIZE, 2 * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    obstacle.endFill();
    return obstacle;
}

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

function animate() {
    if(instantMeter.value > SOUND_TRESHOLD && player_speaking !== true)
    {
        console.log("There's sound", instantMeter.value)
        playerSpeaking()
    }
    else if (player_speaking === true && speaking_timer < 100) {
        speaking_timer += 1
        player_container.removeChild(player_circle)
        playerSpeaking()
        console.log("Speaking timer ", speaking_timer)
    }
    else {
        speaking_timer = 0
        player_speaking = false
        player_container.removeChild(player_circle)
    }

    // Bijwerken van de x- en y-positie tekst
    positionText.text = `X: ${player.x.toFixed(2)}, Y: ${player.y.toFixed(2)}`;

    requestAnimationFrame(animate);
    TWEEN.update();
    app.renderer.render(app.stage);
}

function setUpPlayer(player, pos_x, pos_y) {
    player.height = GRID_SIZE
    player.width = GRID_SIZE
    player.anchor.set(0.5);
    if(pos_x && pos_y) {
        player.x = pos_x
        player.y = pos_y
    }
    else {
        player.x = Math.floor(app.screen.width / 2 / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2; // Midden van het blokje
        player.y = Math.floor(app.screen.height / 2 / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2; // Midden van het blokje
    }
    app.stage.addChild(player);
}

function playerSpeaking() {
    player_circle = new PIXI.Graphics();
    player_circle.beginFill(0xff0000);
    player_circle.drawCircle(player.x, player.y, 50);
    player_container.addChild(player_circle)
    player_speaking = true;
}

export function createPlayer(uuid, pos_x, pos_y) {
    let new_player = PIXI.Sprite.from('sprite/player.png');
    setUpPlayer(new_player, pos_x, pos_y)
    player_list[uuid] = new_player
    return new_player
}

animate();
