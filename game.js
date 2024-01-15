import * as PIXI from 'https://cdn.skypack.dev/pixi.js@v5.3.3';
import TWEEN from 'https://cdn.skypack.dev/tween.js';

const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view);

const player = new PIXI.Sprite.from('sprite/player.png');
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;
app.stage.addChild(player);

let playerX = player.x;
let playerY = player.y;
let speed = 10;

const positionText = new PIXI.Text(`X: ${playerX.toFixed(2)}, Y: ${playerY.toFixed(2)}`, {
    fontFamily: 'Arial',
    fontSize: 16,
    fill: 0xFFFFFF,
});
positionText.x = 10;
positionText.y = 10;
app.stage.addChild(positionText);

window.addEventListener('click', movePlayer);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

function movePlayer(event) {
    const targetX = event.clientX - app.view.getBoundingClientRect().left;
    const targetY = event.clientY - app.view.getBoundingClientRect().top;

    playerX = targetX;
    playerY = targetY;

    positionText.text = `X: ${playerX.toFixed(2)}, Y: ${playerY.toFixed(2)}`;

    moveTo(targetX, targetY, event.shiftKey ? speed * 2 : speed);
}

function handleKeyDown(event) {
    speed = event.shiftKey ? 20 : 10;

    switch (event.key) {
        case 'ArrowUp':
        case 'W':
        case 'w':
            moveTo(player.x, player.y - speed);
            break;
        case 'ArrowDown':
        case 'S':
        case 's':
            moveTo(player.x, player.y + speed);
            break;
        case 'ArrowLeft':
        case 'A':
        case 'a':
            moveTo(player.x - speed, player.y);
            break;
        case 'ArrowRight':
        case 'D':
        case 'd':
            moveTo(player.x + speed, player.y);
            break;
    }

    playerX = player.x;
    playerY = player.y;

    positionText.text = `X: ${playerX.toFixed(2)}, Y: ${playerY.toFixed(2)}`;
}

function handleKeyUp(event) {
    if (event.key === 'Shift') {
        speed = 10;
    }
}

function moveTo(targetX, targetY, moveSpeed) {
    const tween = new TWEEN.Tween(player)
        .to({ x: targetX, y: targetY }, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    app.renderer.render(app.stage);
}

animate();
