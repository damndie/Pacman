'use strict'

const PACMAN = '😀'
var PACMAN_IMG = `<img src="img/pacman.png">`
var gPacman

function createPacman(board) {
    // initialize gPacman...
    gPacman = {
        location: {
            i: 6,
            j: 6
        },
        isSuper: false
    }

    board[gPacman.location.i][gPacman.location.j] = PACMAN_IMG
}

function onMovePacman(ev) {
    if (!gGame.isOn) return

    // use getNextLocation(), nextCell
    var nextLocation = getNextLocation(ev)
    console.log('nextLocation:', nextLocation)

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('nextCell:', nextCell)

    //  return if cannot move
    if (nextCell === WALL) return
    //  hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper) removeGhosts(nextLocation)
        else {
            gameOver()
            return
        }
    }

    if (nextCell === FOOD) {
        playEatingAudio()
        updateScore(1)
        checkVictory()
    }

    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        pacmanSuperPowerMode()
    }

    if (nextCell === CHERRY) {
        playEatingAudio()
        updateScore(10)
        checkVictory()
    }


    // moving from current location:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // Move the pacman to new location:
    // update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN_IMG
    // update the DOM
    renderCell(gPacman.location, PACMAN_IMG)
}

function getNextLocation(eventKeyboard) {
    // console.log('eventKeyboard.code:', eventKeyboard.code)
    // figure out nextLocation
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }

    var className = ''

    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--
            className = 'up'
            break
        case 'ArrowDown':
            nextLocation.i++
            className = 'down'
            break
        case 'ArrowLeft':
            nextLocation.j--
            className = 'left'
            break
        case 'ArrowRight':
            nextLocation.j++
            break
        default: return null
    }

    PACMAN_IMG = `<img class="${className}" src="img/pacman.png">`
    return nextLocation
}


function pacmanSuperPowerMode() {
    if (gPacman.isSuper) return
    gPacman.isSuper = true
    setTimeout(() => {
        gPacman.isSuper = false
        resetGhosts()
    }, 5000)
}