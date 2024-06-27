//% block="SpaceStationX" weight=1000 color=#c6002a icon="\uf197"
//% groups="['Work', 'Solvers', 'Secrets', 'Communications']"
namespace SpaceStationX {
    export enum Puzzles {
        Sound,
        Light
    }

    let solved = false
    let bricked = false
    let work = 0

    //% block="prepare communications"
    //% group="Communications"
    export function prepareCommunications() {
        radio.setGroup(255)
    }

    //% block="solve sound puzzle"
    //% group="Solvers"
    export function solveSoundPuzzle() {
        if (work < getRequiredWork(Puzzles.Sound)) {
            return
        }

        solved = true
    }

    //% block="solve light puzzle"
    //% group="Solvers"
    export function solveLightPuzzle() {
        if (work < getRequiredWork(Puzzles.Light)) {
            return
        }

        solved = true
    }

    //% block="solve gyroscope puzzle"
    //% group="Solvers"
    export function solveGyroscopePuzzle() {
        solved = true
    }

    //% block="display code digit for puzzle $puzzle"
    //% group="Secrets"
    export function displayCodeDigit(puzzle: Puzzles) {
        if (!solved) {
            return
        }

        switch(puzzle) {
            case Puzzles.Sound:
                basic.showNumber(8)
                break
            case Puzzles.Light:
                basic.showNumber(5)
                break
        }
    }

    //% block="work on puzzle"
    //% group="Work"
    export function workOnPuzzle() {
        work += 1
    }

    //% block="amount of work done"
    //% group="Work"
    export function getAmountOfWorkDone() {
        return work
    }

    //% block="is puzzle solved?"
    //% group="Solvers"
    export function isPuzzleSolved() {
        return solved
    }

    //% block="is puzzle bricked?"
    //% group="Solvers"
    export function isPuzzleBricked() {
        return bricked
    }

    //% block="get secret code for puzzle $puzzle"
    //% group="Secrets"
    export function getSecretCode(puzzle: Puzzles): number {
        switch (puzzle) {
            case Puzzles.Sound:
                return 512
            case Puzzles.Light:
                return 256
        }
    }

    //% block="show work progress for puzzle $puzzle"
    //% group="Work"
    export function showWorkGraph(puzzle: Puzzles) {
        basic.clearScreen()

        const requiredSteps = getRequiredWork(puzzle)
        const graphedSteps = Math.floor(Math.map(work, 0, requiredSteps, 0, 25))

        for (let i = 0; i < graphedSteps; i++) {
            led.plot(i % 5, i / 5)
        }
    }

    function getRequiredWork(puzzle: Puzzles): number {
        switch (puzzle) {
            case Puzzles.Sound:
                return 250
            case Puzzles.Light:
                return 1600
        }
    }

    function explode() {
        basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
        basic.showLeds(`
        . . . . .
        . # . # .
        . . # . .
        . # . # .
        . . . . .
        `)
        showExplosion()
    }

    //% block="show explosion"
    export function showExplosion() {
        basic.showLeds(`
        # . # . #
        . # . # .
        # . # . #
        . # . # .
        # . # . #
        `)
        basic.showLeds(`
        . # . # .
        # . # . #
        . # . # .
        # . # . #
        . # . # .
        `)
    }

    //% block="send secret code $code"
    //% group="Secrets"
    export function sendSecretCode(code: number) {
        if (solved) {
            radio.sendNumber(code)
            bricked = true
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Dadadadum), music.PlaybackMode.InBackground)
            explode()
            
        } else {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Wawawawaa), music.PlaybackMode.InBackground)
        }
    }

    let heading = 0
    let securityStatusReceivedCallback: ((isSecure: boolean) => void) | undefined
    let calibrationDirectionCallback: ((direction: string) => void) | undefined
    let calibrationReadyCallback: ((digit: number, secretCode: number) => void) | undefined

    //% block="start steering wheel communication"
    //% subcategory="Steering wheel"
    export function startSteeringWheelCommunication() {
        serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            const [command, firstParameter, secondParameter] = serial.readLine().split(",")
            switch (command) {
                case "caLeft":
                    if (calibrationDirectionCallback) {
                        calibrationDirectionCallback("left")
                    }
                    break
                case "caRight":
                    if (calibrationDirectionCallback) {
                        calibrationDirectionCallback("right")
                    }
                    break
                case "caUp":
                    if (calibrationDirectionCallback) {
                        calibrationDirectionCallback("up")
                    }
                    break
                case "caDown":
                    if (calibrationDirectionCallback) {
                        calibrationDirectionCallback("down")
                    }
                    break
                case "solved":
                    if (calibrationReadyCallback) {
                        calibrationReadyCallback(parseInt(firstParameter), parseInt(secondParameter))
                    }
                default:
                    break
            }
        })
    }

    //% block="calibrate steering wheel|pitch $pitch °|roll $roll °"
    //% subcategory="Steering wheel"
    //% pitch.min=0 pitch.max=360
    //% roll.min=0 roll.max=360
    export function calibrateSteeringWheel(pitch: number, roll: number) {
        serial.writeNumbers([roll, pitch, heading])
    }

    //% block="set heading $newHeading"
    //% subcategory="Steering wheel"
    //% newHeading.min=0 newHeading.max=9
    export function setHeading(newHeading: number) {
        heading = newHeading
    }

    //% block="on calibration $direction"
    //% draggableParameters="reporter"
    //% subcategory="Steering wheel"
    export function onCalibrationDirection(callback: (direction: string) => void) {
        calibrationDirectionCallback = callback
    }

    //% block="on calibration ready $digit $secretCode"
    //% draggableParameters="reporter"
    //% subcategory="Steering wheel"
    export function onCalibrationReady(callback: (digit: number, secretCode: number) => void) {
        calibrationReadyCallback = callback
    }
}