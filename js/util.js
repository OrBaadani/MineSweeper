function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cellContent = ' ';
            var cell = board[i][j];
            // if(cell.isShown) if (cell.isMine) cellContent = MINE;
            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td class="${className}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j});return false">${cellContent}</td>`;
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function startTimer() {
    var startTime = Date.now();
    updateTimer(startTime);
}
function updateTimer(startTime) {
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        gGame.secsPassed = ((Date.now() - startTime)/1000).toFixed(0) ;
        if(gGame.secsPassed<10) elTimer.innerText ='0'+ gGame.secsPassed;
        else elTimer.innerText = gGame.secsPassed;
    }, 1);
}
function stopTimer() {
    clearInterval(gTimerInterval);
    gTimerInterval=null;
}
function resetTimer(){
    var elTimer = document.querySelector('.timer').innerText=gGame.secsPassed+'0';
}

