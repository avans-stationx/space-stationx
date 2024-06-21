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
    for (let index = 0; index < Math.max(0, Math.round(Math.map(input.lightLevel(), 128, 255, 0, 8))); index++) {
        SpaceStationX.workOnPuzzle()
    }
    SpaceStationX.showWorkGraph(SpaceStationX.Puzzles.Light)
    if (SpaceStationX.getAmountOfWorkDone() >= 1600) {
        SpaceStationX.solveLightPuzzle()
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground)
        SpaceStationX.displayCodeDigit(SpaceStationX.Puzzles.Light)
        secretCode = SpaceStationX.getSecretCode(SpaceStationX.Puzzles.Light)
    }
})
