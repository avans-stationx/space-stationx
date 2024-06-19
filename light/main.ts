input.onButtonPressed(Button.AB, function () {
    SpaceStationX.sendSecretCode(secretCode)
})
let secretCode = 0
SpaceStationX.prepareCommunications()
basic.forever(function () {
    if (SpaceStationX.isPuzzleBricked()) {
        SpaceStationX.showExplosion()
    }
})
loops.everyInterval(100, function () {
    if (SpaceStationX.isPuzzleSolved()) {
        return
    }
    if (input.lightLevel() >= 196) {
        SpaceStationX.workOnPuzzle()
        SpaceStationX.showWorkGraph(SpaceStationX.Puzzles.Light)
    }
    if (SpaceStationX.getAmountOfWorkDone() >= 250) {
        SpaceStationX.solveLightPuzzle()
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground)
        SpaceStationX.displayCodeDigit(SpaceStationX.Puzzles.Light)
        secretCode = SpaceStationX.getSecretCode(SpaceStationX.Puzzles.Light)
    }
})
