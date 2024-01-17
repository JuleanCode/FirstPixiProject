import TWEEN from 'https://cdn.skypack.dev/tween.js';
import { socket, UUID } from "./player.js";

const app = new PIXI.Application();
document.body.appendChild(app.view);

const GRID_SIZE = 50; // Grootte van elk blokje in de grid
const BORDER_WIDTH = 1; // Breedte van de rand
const SPEED = 10;

export const player = PIXI.Sprite.from('sprite/player.png');
setUpPlayer(player)

export let player_list = []


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
    moveTo(targetX, targetY);

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

    targetX = Math.floor(targetX / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;
    targetY = Math.floor(targetY / GRID_SIZE) * GRID_SIZE + GRID_SIZE / 2;

    positionText.text = `X: ${targetX.toFixed(2)}, Y: ${targetY.toFixed(2)}`;

    moveTo(targetX, targetY);
}

function moveTo(targetX, targetY) {
    player.x = targetX
    player.y = targetY
    socket.send("P," + UUID + "," + player.x + "," + player.y);
    // const tween = new TWEEN.Tween(player)
    //     .to({ x: targetX, y: targetY }, 500)
    //     .easing(TWEEN.Easing.Quadratic.Out)
    //     .start();

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

function animate() {
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

export function createPlayer(uuid, pos_x, pos_y) {
    let new_player = PIXI.Sprite.from('sprite/player.png');
    setUpPlayer(new_player, pos_x, pos_y)
    player_list[uuid] = new_player
    return new_player
}

animate();
