'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = 'O'

var gTimeoutId

// Model
const gGame = {
    score: 0,
    isOn: false
}
var gBoard

function onInit() {
    updateScore(0)
    CloseModal()
    gBoard = buildBoard()
    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true

    // moveGhosts()
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            if ((i === 1 && j === 1) ||       // Top left corner
                (i === 1 && j === size - 2) ||  // Top right corner
                (i === size - 2 && j === 1) ||  // Bottom left corner
                (i === size - 2 && j === size - 2)) { // Bottom right corner
                board[i][j] = SUPER_FOOD;
            } else if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL;
            } else {
                board[i][j] = FOOD;
            }
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


function updateScore(diff) {
    // DONE: update model and dom
    if (!diff) {
        gGame.score = 0
    } else {
        gGame.score += diff
    }
    document.querySelector('span.score').innerText = gGame.score
}

function gameOver() {
    console.log('Game Over')
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, '🪦')
    openModal("Game Over")
    gGame.isOn = false
}

function openModal() {
    const elModal = document.querySelector('.modal')
    const elGameOver = document.querySelector('.gameover')
    elModal.style.display = 'block'
    elGameOver.innerText = message
    elModal.style.display = 'block'
    if (gTimeoutId) {
        clearTimeout(gTimeoutId)
    }
    gTimeoutId = setTimeout(CloseModal(), 5000)
}


function CloseModal() {
    console.log('Closing modal')
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}
