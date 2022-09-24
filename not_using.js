let score = 0;
let clickValue = 1;

let batchesCost = 30;
let batchesAmount = 0;

function buyBatches() {
    if (score >= batchesCost) {
        let clickSound = new Audio('sounds/sheesh.wav');
        clickSound.play()
        score = score - batchesCost;
        batchesAmount = batchesAmount + 1;
        batchesCost = Math.round(batchesCost * 1.25);

        document.getElementById("score").innerHTML = score;
        document.getElementById("batchesCost").innerHTML = batchesCost;
        document.getElementById("batchesAmount").innerHTML = batchesAmount;
        updateScorePerSecond();
    }
}

function incrementScore(amount) {
    score = score + amount;
    document.getElementById("score").innerHTML = score;
}

function updateScorePerSecond() {
    let scorePerSecond = batchesAmount;
    document.getElementById("autoClickPerSecond").innerHTML = scorePerSecond;
}

function loadGame() {
    let savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if (typeof savedGame.score !== "undefined") score = savedGame.score;
    if (typeof savedGame.clickValue !== "undefined") clickValue = savedGame.clickValue;
    if (typeof savedGame.batchesCost !== "undefined") batchesCost = savedGame.batchesCost;
    if (typeof savedGame.batchesAmount !== "undefined") batchesAmount = savedGame.batchesAmount;
}

function saveGame() {
    let gameSave = {
        score: score,
        clickValue: clickValue,
        batchesCost: batchesCost,
        batchesAmount: batchesAmount
    }
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function resetGame() {
    Swal.fire({
        title: 'Reset Game',
        text: 'Are you sure you want to reset your game?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showDenyButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            let gameSave = {};
            localStorage.setItem("gameSave", JSON.stringify(gameSave));
            location.reload();
        } else if (result.isDenied) {
            Swal.fire({
                title: "Cancelled",
                text: "Game not reset.",
                icon: "info",
                showConfirmationButton: false,
                timer: 2000
            })
        }
    })
}

window.onload = function () {
    loadGame();
    updateScorePerSecond();
    document.getElementById("score").innerHTML = score;
    document.getElementById("batchesCost").innerHTML = batchesCost;
    document.getElementById("batchesAmount").innerHTML = batchesAmount;
}

setInterval(function () {
    score = score + batchesAmount;
    document.getElementById("score").innerHTML = score;
}, 1000)

setInterval(function () {
    saveGame();
}, 30000)

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.which == 83) { //ctrl + s
        e.preventDefault();
        saveGame();
    }
}, false)