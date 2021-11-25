let origBoard;
const humanPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
];
const cells = document.querySelectorAll(".cell");

startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  // [0, 1, 2, 3, 4, 5, 6, 7, 8]
  origBoard = Array.from(Array(9).keys());

  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    // Add `click` event listener to every cell or square
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(e) {
  if (typeof origBoard[e.target.id] == "number") {
    turn(e.target.id, humanPlayer);

    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);

  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  // Places that the player has played on the board
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;

  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index, player };
      break;
    }
  }

  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === humanPlayer ? "blue" : "red";
  }

  for (let i = 0; i < cells.length; i++) {
    // Remove `click` event listener
    cells[i].removeEventListener("click", turnClick, false);
  }

  declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose!");
}

/**
 * Get empty square best spot
 * @returns {number} Square ID
 */
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

/**
 * Check if tie or not
 * @returns {boolean} True if tie, otherwise false
 */
function checkTie() {
  if (emptySquares().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }

    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

/**
 * Get all empty squares
 * @returns {number[]} Filtered empty squares
 */
function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

/**
 * Determine the winner
 * @param {string} who
 */
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

/**
 * Minimax Algorithm
 * - return a value if a terminal state is found (10, 0, -10)
 * - go through available spots on the board
 * - call the minimax function on each available spot (recursion)
 * - evaluate returning values from function calls
 * - return the best value
 * @param {array} newBoard
 * @param {string} player
 * @returns {object} Object
 */
function minimax(newBoard, player) {
  const availSpots = emptySquares();

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      const result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
