const canvas = document.getElementById('gameCanvas');
const nextCanvas = document.getElementById('nextCanvas');
const ctx = canvas.getContext('2d');
const nextCtx = nextCanvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 30;

canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;
nextCanvas.width = 120;
nextCanvas.height = 120;

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let gameRunning = false;
let gamePaused = false;

const PIECES = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
];

const COLORS = [
    null,
    '#00ffff', // I - Cyan
    '#ffff00', // O - Yellow
    '#800080', // T - Purple
    '#00ff00', // S - Green
    '#ff0000', // Z - Red
    '#0000ff', // J - Blue
    '#ffa500'  // L - Orange
];

function initBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function createPiece() {
    const rand = Math.floor(Math.random() * PIECES.length);
    const piece = PIECES[rand].map(row => [...row]);
    return {
        matrix: piece,
        color: rand + 1,
        x: Math.floor((COLS - piece[0].length) / 2),
        y: 0
    };
}

function drawMatrix(ctx, matrix, offsetX, offsetY, cellSize = CELL_SIZE) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = COLORS[value];
                ctx.fillRect((x + offsetX) * cellSize, (y + offsetY) * cellSize, cellSize - 2, cellSize - 2);
            }
        });
    });
}

function drawBoard() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board cells
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                ctx.fillStyle = COLORS[board[y][x]];
                ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
        }
    }

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(COLS * CELL_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }
    for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, ROWS * CELL_SIZE);
        ctx.stroke();
    }

    // Draw current piece
    if (currentPiece) {
        drawMatrix(ctx, currentPiece.matrix, currentPiece.x, currentPiece.y);
    }
}

function drawNextPiece() {
    nextCtx.fillStyle = '#fff';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (nextPiece) {
        const cellSize = 25;
        const offsetX = (nextCanvas.width - nextPiece.matrix[0].length * cellSize) / 2 / cellSize;
        const offsetY = (nextCanvas.height - nextPiece.matrix.length * cellSize) / 2 / cellSize;
        drawMatrix(nextCtx, nextPiece.matrix, offsetX, offsetY, cellSize);
    }
}

function collide(piece, dx, dy) {
    const matrix = piece.matrix;
    const x = piece.x + dx;
    const y = piece.y + dy;

    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] !== 0) {
                const newX = x + col;
                const newY = y + row;

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge() {
    currentPiece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = y + currentPiece.y;
                const boardX = x + currentPiece.x;
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        });
    });
}

function clearLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++;
        }
    }

    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * linesCleared;
        document.getElementById('score').textContent = score;
        document.getElementById('lines').textContent = lines;

        // Speed up the game
        dropInterval = Math.max(100, dropInterval - 20);
    }
}

function rotate(matrix) {
    const N = matrix.length;
    const rotated = Array(N).fill(null).map(() => Array(N).fill(0));

    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            rotated[col][N - 1 - row] = matrix[row][col];
        }
    }
    return rotated;
}

function gameOver() {
    gameRunning = false;
    alert(`Game Over!\nScore: ${score}\nLines: ${lines}`);
    reset();
}

function reset() {
    score = 0;
    lines = 0;
    dropInterval = 1000;
    document.getElementById('score').textContent = 0;
    document.getElementById('lines').textContent = 0;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('startBtn').textContent = 'Start Game';
}

function update(time = 0) {
    if (!gameRunning || gamePaused) {
        requestAnimationFrame(update);
        return;
    }

    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        if (currentPiece) {
            if (!collide(currentPiece, 0, 1)) {
                currentPiece.y++;
            } else {
                merge();
                clearLines();
                currentPiece = nextPiece;
                nextPiece = createPiece();

                if (currentPiece && collide(currentPiece, 0, 0)) {
                    gameOver();
                    return;
                }
            }
        }
        dropCounter = 0;
    }

    drawBoard();
    drawNextPiece();
    requestAnimationFrame(update);
}

document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        initBoard();
        currentPiece = createPiece();
        nextPiece = createPiece();
        lastTime = 0;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('startBtn').textContent = 'New Game';
        update();
    } else {
        reset();
    }
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    if (gameRunning && !gamePaused) {
        gamePaused = true;
        document.getElementById('pauseBtn').textContent = 'Resume';
    } else if (gameRunning && gamePaused) {
        gamePaused = false;
        document.getElementById('pauseBtn').textContent = 'Pause';
        update();
    }
});

document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;

    if (e.key === 'ArrowLeft') {
        if (!collide(currentPiece, -1, 0)) {
            currentPiece.x--;
        }
    } else if (e.key === 'ArrowRight') {
        if (!collide(currentPiece, 1, 0)) {
            currentPiece.x++;
        }
    } else if (e.key === 'ArrowDown') {
        if (!collide(currentPiece, 0, 1)) {
            currentPiece.y++;
            score += 1;
            document.getElementById('score').textContent = score;
        }
    } else if (e.key === 'ArrowUp') {
        const rotated = rotate(currentPiece.matrix);
        if (!collide({ ...currentPiece, matrix: rotated }, 0, 0)) {
            currentPiece.matrix = rotated;
        }
    } else if (e.key === ' ') {
        e.preventDefault();
        while (!collide(currentPiece, 0, 1)) {
            currentPiece.y++;
            score += 2;
        }
        document.getElementById('score').textContent = score;
    }

    drawBoard();
});

initBoard();
drawBoard();
drawNextPiece();

