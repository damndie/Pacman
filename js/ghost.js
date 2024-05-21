'use strict'

const GHOST = '👻'
var gGhosts
var gIntervalGhosts
var gRemovedGhosts = []

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST

}

function createGhosts(board) {
    // 3 ghosts and an interval
    gGhosts = []

    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }

    if (gIntervalGhosts) clearInterval(gIntervalGhosts)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // console.log('ghost:', ghost)
    // figure out moveDiff, nextLocation, nextCell

    var moveDiff = getMoveDiff()
    // console.log('moveDiff:', moveDiff)

    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }
    // console.log('nextLocation:', nextLocation) //{i,j}

    var nextCell = gBoard[nextLocation.i][nextLocation.j] //'.'
    // console.log('nextCell:', nextCell)

    // return if cannot move
    if (nextCell === WALL || nextCell === GHOST) return

    // hitting a pacman? call gameOver
    if (nextCell === PACMAN_IMG) {
        if(gPacman.isSuper) return
        gameOver()
    }

    // moving from current location:
    // update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent

    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location:
    // update the model (save cell contents)
    ghost.location = nextLocation
    ghost.currCellContent = nextCell

    gBoard[ghost.location.i][ghost.location.j] = GHOST
    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function removeGhosts(nextLocation) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === nextLocation.i
            && gGhosts[i].location.j === nextLocation.j) {
            gRemovedGhosts.push(gGhosts[i])
            gGhosts.splice(i, 1)
        }
    }
}

function resetGhosts() {
    for (var i = 0; i < gRemovedGhosts.length; i++) {
        gGhosts[gGhosts.length] = gRemovedGhosts[i]
    }
}


function getGhostHTML(ghost) {
    const color = gPacman.isSuper ? 'blue' : ghost.color
    return `<span style="background-color:${color};">${GHOST}</span>`
}