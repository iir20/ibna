const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let specialFood = { x: -1, y: -1 };
let score = 0;
let highScore = 0;
let level = 1;
let speed = 100;
let gameInterval;
let specialFoodScore = 0;

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    score = 0;
    specialFoodScore = 0;
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    placeFood();
    placeSpecialFood();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
    updateSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').innerText = highScore;
        }
        return;
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score += 1;
        document.getElementById('totalPoints').innerText = score;
        placeFood();
        drawSprinkleEffect(food.x, food.y);
        if (score % 5 === 0) {
            level++;
            speed = Math.max(50, speed - 10); // Increase speed
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, speed);
        }
    }
    if (snake[0].x === specialFood.x && snake[0].y === specialFood.y) {
        specialFoodScore += 5; // Special food gives extra points
        score += 5;
        document.getElementById('totalPoints').innerText = score;
        placeSpecialFood();
        drawSprinkleEffect(specialFood.x, specialFood.y);
    }
    draw();
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (snake.length > score + 1) {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= canvas.width / 10 || 
        head.y < 0 || head.y >= canvas.height / 10 || 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 10));
    food.y = Math.floor(Math.random() * (canvas.height / 10));
}

function placeSpecialFood() {
    specialFood.x = Math.floor(Math.random() * (canvas.width / 10));
    specialFood.y = Math.floor(Math.random() * (canvas.height / 10));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw glow effect for the snake
    ctx.shadowColor = 'rgba(0, 255, 0, 0.5)'; // Green glow
    ctx.shadowBlur = 10; // Blur effect
    snake.forEach((segment, index ) => {
        ctx.fillStyle = `hsl(${(index * 30) % 360}, 100%, 50%)`; // Colorful segments
        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });
    
    // Reset shadow for food
    ctx.shadowColor = 'transparent';
    
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
    
    ctx.fillStyle = 'gold'; // Special food color
    ctx.fillRect(specialFood.x * 10, specialFood.y * 10, 10, 10);
}

function drawSprinkleEffect(x, y) {
    ctx.fillStyle = 'rgba(255, 215, 0, 0.5)'; // Sprinkle effect color
    ctx.beginPath();
    ctx.arc(x * 10 + 5, y * 10 + 5, 15, 0, Math.PI * 2);
    ctx.fill();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});
