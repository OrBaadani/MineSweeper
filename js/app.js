
var gBoard;
const MINE = '💣';
const FLAG = '🚩';
const DEAD = '😵';
var gLeftFirstClick = false;
var gFirstClick = false;
const SMILE = '🙂';
const WIN = '😎';
var gGame;
var gTimerInterval;
//default
var gLevel = { size: 8, mines: 12 };


function initGame() {

    gLeftFirstClick = false;
    gFirstClick=false;
    gGame = createGame();
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);
    stopTimer();
    resetTimer();
}
function createGame() {
    return {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
}
function resetBtn() {
    var elBtn = document.querySelector('#resetBtn');
    elBtn.innerText = SMILE;
    initGame();
}
function btnLevel(size) {
    switch (size) {
        case 4:
            gLevel = { size: 4, mines: 2 };
            break;
        case 8:
            gLevel = { size: 8, mines: 12 };
            break;
        case 12:
            gLevel = { size: 12, mines: 30 };
            break;

    }
    resetBtn();
}
function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: gLevel.mines,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            board[i][j] = cell;
        }
    }
    return board;
}
function setMinesNegsCount(board, cellI, cellJ) {
    var minesNegCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) minesNegCount++;
        }
    }
    return minesNegCount;
}

function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn) return;
    if (gBoard[i][j].isMarked) return;
    if (!gFirstClick) {startTimer();gFirstClick=true; }
    if (!gLeftFirstClick) {
        gLeftFirstClick = true;
        placeRndMines(i, j);
    }
    var value = '';
    if (gBoard[i][j].isMine) {
        elCell.classList.add('mine');
        gameOver();
        return;
    }
    else {
        value = setMinesNegsCount(gBoard, i, j);
        if (value === 0) {
            expandShown(gBoard, i, j);
        }
        else {
            renderCell(i, j, value);
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
        }
        checkGameOver();
    }
}


function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.classList.add('clicked');
    elCell.innerHTML = value;
}

function cellMarked(elCell, i, j) {
    if (!gFirstClick) {startTimer();gFirstClick=true; }
    if (!gGame.isOn) return;
    if (!gBoard[i][j].isMarked) {
        elCell.innerHTML = FLAG;
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        if (gBoard[i][j].isMine && gBoard[i][j].isMarked) checkGameOver();
    }
    else {
        elCell.innerHTML = ' ';
        gGame.markedCount--;
        gBoard[i][j].isMarked = false;
    }
}

function checkGameOver() {
    if (gGame.shownCount === (gLevel.size ** 2) - gGame.markedCount) {
        var elBtn = document.querySelector('#resetBtn');
        elBtn.innerText = WIN;
        gGame.isOn = false;
        stopTimer();
    }
}
function gameOver() {
    var elBtn = document.querySelector('#resetBtn').innerText = DEAD;
    stopTimer();
    gGame.isOn = false;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                renderCell(i, j, MINE);
                gBoard[i][j].minesAroundCount--;

            }
        }
    }
}

function expandShown(board, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (!board[i][j].isMine || !board[i][j].isMarked) {
                if (!board[i][j].isShown) {
                    board[i][j].isShown = true;
                    gGame.shownCount++;
                }
                var value = setMinesNegsCount(gBoard, i, j);
                if (value === 0) value = ' ';
                renderCell(i, j, value);
            }
        }
    }
}
function placeRndMines(cellI, cellJ) {
    for (var i = 0; i < gLevel.mines; i++) {
        var rndI = getRandomInt(0, gBoard.length - 1);
        var rndJ = getRandomInt(0, gBoard[0].length - 1);
        if (rndI !== cellI && rndJ !== cellJ && !gBoard[rndI][rndJ].isMine) {
            gBoard[rndI][rndJ].isMine = true;
        }
        else i -= 1;
    }
}