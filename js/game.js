'use strict'

const WALL = '🧱'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🍰'
const CHERRY = '🍒'

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gFoodCount
var gCherryIntervalId

function onInit() {
    hideModal()
    gFoodCount = -5
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)

    gGame.score = 0
    document.querySelector('h2 span').innerText = '0'

    renderBoard(gBoard)

    if (gCherryIntervalId) clearInterval(gCherryIntervalId)
    gCherryIntervalId = setInterval(spawnCherry, 15000)

    gGame.isOn = true
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            gFoodCount++

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                gFoodCount--
            }
        }
    }
    console.log('board:', board)
    board[1][1] = board[1][size - 2] = SUPER_FOOD
    board[8][8] = board[size - 2][1] = SUPER_FOOD
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

// location is an object like this - { i: 2, j: 7 } , ''
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // update model and dom
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function getEmptyLocation(board) {
    // const emptyLocations = [{i:1,j:1},{i:1,j:2}];
    const emptyLocations = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            console.log('currCell:', currCell)
            if (currCell === EMPTY) {
                emptyLocations.push({ i, j })
            }
        }
    }
    console.log('emptyLocations:', emptyLocations)
    if (!emptyLocations.length) return null

    const randomIdx = getRandomIntInclusive(0, emptyLocations.length)
    return emptyLocations[randomIdx]
}

function spawnCherry() {
    var emptyCell = getEmptyLocation(gBoard)
    console.log('emptyCell:', emptyCell)
    if (!emptyCell) return
    gBoard[emptyCell.i][emptyCell.j] = CHERRY
    renderCell(emptyCell, CHERRY)
    gFoodCount += 10
    console.log('gBoard[emptyCell.i][emptyCell.j]:', gBoard[emptyCell.i][emptyCell.j])
}



function checkVictory() {
    if (gFoodCount === gGame.score) {
        endGame('Congratulations, you won!!!')
    }
}

function gameOver() {
    renderCell(gPacman.location, '🪦')
    endGame('Game over, you lost.')
}

function endGame(msg) {
    console.log('Game Over')
    gGame.isOn = false

    clearInterval(gIntervalGhosts)
    clearInterval(gCherryIntervalId)

    const elModal = document.querySelector(".modal h2")
    elModal.innerText = msg
    showModal()

    renderCell(gPacman.location, '🪦')
}