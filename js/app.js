
var gBoard;
const MINE = '💣';
const FLAG = '🚩';
const DEAD = '😵';
var gLeftFirstClick = false;
var gFirstClick = false;
const SMILE = '🙂';
const WIN = '😎';
const LIFE = '❤️';
var gIsHint = false;
var gGame;
var gTimerInterval;
var gTotalMines;

//default
var gLevel = { size: 8, mines: 12 };

function initGame() {

    gLeftFirstClick = false;
    gFirstClick = false;
    gGame = createGame();
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);
    stopTimer();
    resetTimer();
    renderlives();
    resetHints();
    updateScoreBoard();
    resetSafeClick();
    resetManualBtn();
    gIsHint = false;
    gTotalMines = gLevel.mines;
    resetBoomBtn();

}
function createGame() {
    return {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hints: 3,
        safeClick: 3,
        manualMode: { isCreate: false, isPlay: false},
        isSevenBoom: true
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
//counts negs
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
//render 3 lives
function renderlives() {
    var elLives = document.querySelector('.lives');
    elLives.innerText = '';
    for (var i = 0; i < gGame.lives; i++) {
        elLives.innerText += LIFE;
    }
}
//when cell is clicked
function cellClicked(elCell, i, j) {

    if (gBoard[i][j].isShown) return;
    if (!gGame.isOn) return;
    if (gBoard[i][j].isMarked) return;
    if (gIsHint) {
        cellsHint(i, j); return;
    }

    if (gGame.manualMode.isCreate) {
        if(gGame.manualMode.isPlay)return
        manualCreate(elCell, i, j)
    } else {
        
        if (!gFirstClick) { startTimer(); gFirstClick = true; }
        if (!gLeftFirstClick) {
            gLeftFirstClick = true;
            placeRndMines(i, j);
        }
        if (gBoard[i][j].isMine) {
            elCell.classList.add('mine');
            renderCell(i, j, MINE)
            gGame.lives--;
            renderlives();
            if (gGame.lives === 0) {
                LostGame();
                return;
            }
        }
        else {
            var value = setMinesNegsCount(gBoard, i, j);
            if (value === 0) {
                expandShownRecursive(gBoard, i, j);
            }
            else {
                renderCell(i, j, value);
            }
        }
        checkGameOver();
    }
}

function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.classList.add('clicked');
    elCell.innerHTML = value;
    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
    }
}
//when mark with flag
function cellMarked(elCell, i, j) {
    if (!gFirstClick) { startTimer(); gFirstClick = true; }
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
function winGame() {
    var elBtn = document.querySelector('#resetBtn');
    elBtn.innerText = WIN;
    gGame.isOn = false;
    stopTimer();
    bestScore(gLevel.size);
}
function checkGameOver() {
    if (gGame.shownCount === (gLevel.size ** 2) - gGame.markedCount) {
        winGame();
    }
    else if ((gGame.shownCount + gGame.markedCount === (gLevel.size ** 2)) && gGame.lives !== 0) {
        winGame();
    }
}
function LostGame() {
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


function expandShownRecursive(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (board[i][j].isMarked) continue;
            if (!board[i][j].isMine) {
                if (!board[i][j].isShown) {
                    board[i][j].isShown = true;
                    gGame.shownCount++;
                    var value = setMinesNegsCount(gBoard, i, j);
                    if (value === 0) {
                        value = ' ';
                        renderCell(i, j, value);
                        expandShownRecursive(gBoard, i, j)
                    }
                    else renderCell(i, j, value);
                }
            }
        }
    }
}
//on first click
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

function getHintBtn() {
    if (gGame.hints === 0) {
        var elP = document.querySelector('.hintsContainer p').style.display = 'block';
        return;
    }
    if (!gLeftFirstClick) return;
    var elHint = document.querySelector(`.hint${gGame.hints}`);
    elHint.classList.add('hint');
    gGame.hints--;
    gIsHint = true;
}

function cellsHint(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            var elCell = document.querySelector(`.cell${i}-${j}`);
            if (j < 0 || j >= gBoard[i].length) continue;
            elCell.innerText = (gBoard[i][j].isMine) ? MINE : elCell.innerText;
            elCell.classList.add('hinted');
        }
    }
    setTimeout(function () {
        for (var i = cellI - 1; i <= cellI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {

                if (j < 0 || j >= gBoard[i].length) continue;
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.classList.remove('hinted');
                if (gBoard[i][j].isMine && !gBoard[i][j].isShown) elCell.innerHTML = ' ';
            }
        } gIsHint = false;
    }, 1000)
}

function resetHints() {
    var elHints = document.querySelectorAll('.hints');
    var elP = document.querySelector('.hintsContainer p').style.display = 'none';
    for (var i = 0; i < elHints.length; i++) {
        if (elHints[i].classList.contains('hint')) elHints[i].classList.remove('hint');
    }
}
function bestScore(level) {
    var currScore = gGame.secsPassed;
    var prevScore;
    var elBestScore = document.querySelector('.bestScore span');
    if (!localStorage.getItem(`BestScoreRecord${level}`)) prevScore = Infinity;
    else prevScore = localStorage.getItem(`BestScoreRecord${level}`);
    localStorage.setItem(`BestScoreRecord${level}`, Math.min(currScore, prevScore));
    elBestScore.innerText = localStorage.getItem(`BestScoreRecord${level}`);
}
function updateScoreBoard() {
    var elBestScore = document.querySelector('.bestScore span');
    if (!localStorage.getItem(`BestScoreRecord${gLevel.size}`)) elBestScore.innerText = ' ';
    elBestScore.innerText = localStorage.getItem(`BestScoreRecord${gLevel.size}`);
}
function safeClickbtn() {
    if (!gLeftFirstClick) return;
    if (gGame.safeClick === 0) return;
    var emptyCells = getEmptyCells(gBoard);
    var rnd = getRandomInt(0, emptyCells.length - 1);
    emptyCells[rnd].i
    var elCell = document.querySelector(`.cell${emptyCells[rnd].i}-${emptyCells[rnd].j}`);
    elCell.classList.add('safeClicked');
    gGame.safeClick--;
    var elSpan = document.querySelector('.safeClick span');
    elSpan.innerText = gGame.safeClick;

    setTimeout(function () {
        elCell.classList.remove('safeClicked');
    }, 1500);
}
function resetSafeClick() {
    var elSpan = document.querySelector('.safeClick span');
    elSpan.innerText = gGame.safeClick;
}
function manuallyBtn(elBtn) {
    if (gFirstClick) return;
    var elP=document.querySelector('.manualMode');
    elP.style.visibility='visible';
    elBtn.style.borderWidth='5px';
    elP.querySelector('span').innerText=gTotalMines;

    if (elBtn.innerText === 'Hide') { hideManualMines(); 
        gGame.manualMode.isCreate = false;
    }
    else {
        gGame.manualMode.isCreate = true;
        gLeftFirstClick = true;

    }
}
function manualCreate(elCell, i, j) {
    var elBtn = document.querySelector('.manualBtn');
    var elSpan=document.querySelector('.manualMode span');

    if (gTotalMines === 1) {
        elBtn.innerText = 'Hide';
        elCell.innerText = MINE;
        gBoard[i][j].isMine=true;
        gTotalMines--;
        gGame.manualMode.isPlay = true;
    }
    else {
        if (elCell.innerText !== MINE) {
            elCell.innerText = MINE;
            gTotalMines--;
            gBoard[i][j].isMine=true;
        }
    }
    elSpan.innerText=gTotalMines;
}
function hideManualMines() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var elCell = document.querySelector(`.cell${i}-${j}`);
            if (elCell.innerText === MINE) elCell.innerText = ' ';
        }
    }
}
function resetManualBtn() {
    var elP=document.querySelector('.manualMode');
    elP.style.visibility='hidden';
    var elBtn=document.querySelector('.manualBtn');
    elBtn.innerText='Manual Mode';
    elBtn.style.borderWidth='2px';
}
function sevenBoomBtn(elBtn) {
    if (gFirstClick) return;
    elBtn.style.borderWidth='5px';
    gLeftFirstClick = true;
    gGame.isSevenBoom = true;
    var mineCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var boomIdx = (i * gLevel.size) + j;
            if (boomIdx !== 0) {
                if (boomIdx % 7 === 0 || Math.floor(boomIdx / 10) === 7 || boomIdx % 10 === 7) {
                    mineCount++;
                    gBoard[i][j].isMine = true;
                }
            }
        }
    }
    gLevel.mines = mineCount;
}
function resetBoomBtn(){
    var elBtn=document.querySelector('.sevenBoomBtn');
    elBtn.style.borderWidth='2px';
}