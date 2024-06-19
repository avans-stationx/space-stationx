input.onButtonPressed(Button.AB, function () {
    SpaceStationX.sendSecretCode(secretCode)
})
let secretCode = 0
SpaceStationX.prepareCommunications()
loops.everyInterval(10, function () {
    if (SpaceStationX.isPuzzleSolved()) {
        return
    }
    if (input.logoIsPressed() && input.soundLevel() >= 128) {
        SpaceStationX.workOnPuzzle()
        SpaceStationX.showWorkGraph(SpaceStationX.Puzzles.Sound)
    }
    if (SpaceStationX.getAmountOfWorkDone() == 250) {
        SpaceStationX.solveSoundPuzzle()
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.InBackground)
        SpaceStationX.displayCodeDigit(SpaceStationX.Puzzles.Sound)
        secretCode = SpaceStationX.getSecretCode(SpaceStationX.Puzzles.Sound)
    }
})
basic.forever(function () {
    if (SpaceStationX.isPuzzleBricked()) {
        SpaceStationX.showExplosion()
    }
})
