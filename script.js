const board = Array(9).fill(null);
let gameOver = false;

const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const resetBtn = document.getElementById("reset");

const WINNING_LINES = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
];

function checkWinner(b) {
    for (const [a, bIdx, c] of WINNING_LINES) {
        if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
            return b[a];
        }
    }
    if (b.every(cell => cell !== null)) return "tie";
    return null;
}

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (gameOver || board[index] !== null) return;

    makeMove(index, "X");

    const result = checkWinner(board);
    if (result) {
        endGame(result);
        return;
    }

    status.textContent = "Computer's turn...";
    setTimeout(computerMove, 400);
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

function computerMove() {
    const bestMove = findBestMove();
    makeMove(bestMove, "O");

    const result = checkWinner(board);
    if (result) {
        endGame(result);
    } else {
        status.textContent = "Your turn (X)";
    }
}

// Minimax algorithm: the AI looks ahead at every possible future move
// to find the move that guarantees the best outcome for itself,
// assuming the opponent also plays optimally.
function minimax(newBoard, depth, isMaximizing) {
    const result = checkWinner(newBoard);
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    if (result === "tie") return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === null) {
                newBoard[i] = "O";
                best = Math.max(best, minimax(newBoard, depth + 1, false));
                newBoard[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === null) {
                newBoard[i] = "X";
                best = Math.min(best, minimax(newBoard, depth + 1, true));
                newBoard[i] = null;
            }
        }
        return best;
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = "O";
            const score = minimax(board, 0, false);
            board[i] = null;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function endGame(result) {
    gameOver = true;
    if (result === "tie") {
        status.textContent = "It's a tie!";
    } else {
        status.textContent = result === "X" ? "You win! 🎉" : "Computer wins!";
    }
}

function resetGame() {
    board.fill(null);
    gameOver = false;
    cells.forEach(cell => cell.textContent = "");
    status.textContent = "Your turn (X)";
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);