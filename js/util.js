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

function getEmptyCells(board) {
	var emptyCells = [];
	for (var i = 0; i < board.length; i++)
		for (var j = 0; j < board[0].length; j++) {
			if (!board[i][j].isMarked && !board[i][j].isMine&&!board[i][j].isShown) {
				emptyCells.push({ i: i, j: j })
			}
		}
	return emptyCells
}


//non recursive
// function expandShown(board, cellI, cellJ) {

//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i > board.length - 1) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j > board[0].length - 1) continue;

//             if (board[i][j].isMarked) continue;
//             if (!board[i][j].isMine) {
//                 if (!board[i][j].isShown) {
//                     board[i][j].isShown = true;
//                     gGame.shownCount++;
//                 }
//                 var value = setMinesNegsCount(gBoard, i, j);
//                 if (value === 0) value = ' ';
//                 renderCell(i, j, value);
//             }
//         }
//     }
// }
