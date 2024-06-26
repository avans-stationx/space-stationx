SpaceStationX.onCalibrationReady(function (digit, secretCode) {
    SpaceStationX.solveGyroscopePuzzle()
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.InBackground)
    basic.showNumber(digit)
    code = secretCode
})
input.onButtonPressed(Button.AB, function () {
    SpaceStationX.sendSecretCode(code)
})
SpaceStationX.onCalibrationDirection(function (direction) {
    if (direction == "left") {
        basic.showArrow(ArrowNames.West)
    } else if (direction == "right") {
        basic.showArrow(ArrowNames.East)
    } else if (direction == "up") {
        basic.showArrow(ArrowNames.South)
    } else if (direction == "down") {
        basic.showArrow(ArrowNames.North)
    } else {
        basic.showIcon(IconNames.No)
    }
})
let code = 0
SpaceStationX.prepareCommunications()
SpaceStationX.startSteeringWheelCommunication()
SpaceStationX.setHeading(0)
loops.everyInterval(50, function () {
    SpaceStationX.calibrateSteeringWheel(input.rotation(Rotation.Pitch), input.rotation(Rotation.Roll))
})
basic.forever(function () {
    if (SpaceStationX.isPuzzleBricked()) {
        SpaceStationX.showExplosion()
    }
})
