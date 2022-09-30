let game = {
    score: 0,
    totalScore: 0,
    totalClicks: 0,
    clickValue: 1,
    version: 0.9,

    addToScore: function (amount) {
        this.score += amount;
        this.totalScore += amount;
        display.updateScore();
    },

    getScorePerSecond: function () {
        let scorePerSecond = 0;
        for (let i = 0; i < building.name.length; i++) {
            scorePerSecond += building.income[i] * building.count[i];
        }
        return scorePerSecond;
    },

    getWage: () => {
        let wage = 0;
        for (let i = 0; i < building.name.length; i++) {
            wage += building.wage[i] * building.count[i];
        }
        return wage;
    }
}

let building = {
    name: [
        "Batch of Popcorn",
        "Popcorn Farm",
        "Popcorn Employees"
    ],
    image: [
        "batch_of_popcorn.svg",
        "popcorn_farm.svg",
        "popcorn_employees.svg"
    ],
    wage: [0, 1, 10],
    count: [0, 0, 0],
    income: [1, 10, 100],
    cost: [30, 1000, 100000],

    costMultiplier: [1.2, 1.6, 1.4],

    purchase: function (index) {
        if (game.score >= this.cost[index]) {
            game.score -= this.cost[index];
            this.count[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * this.costMultiplier[index]);
            display.updateScore();
            display.updateShop();
            display.updateUpgrades();
            let clickSound = new Audio(`sounds/crunch.wav`);
            clickSound.play();
        }
    }
}

let upgrade = {
    name: [
        "Real Butter",
        "Made In Indiana, USA"
    ],
    description: [
        "Popcorn batches are twice as efficient.",
        "Indiana makes most of the US's popcorn. Increases click value by 2."
    ],
    image: [
        "butter.svg",
        "indiana.svg"
    ],
    type: [
        "building",
        "click"
    ],
    cost: [
        500,
        1000
    ],
    buildingIndex: [
        0,
        1
    ],
    requirement: [
        1,
        1
    ],
    bonus: [
        2,
        2
    ],
    purchased: [false, false],
    purchase: function (index) {
        if (!this.purchased[index] && game.score >= this.cost[index]) {
            if (this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
                game.score -= this.cost[index];
                building.income[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateScore();
            } else if (this.type[index] == "click" && game.totalClicks >= this.requirement[index]) {
                game.score -= this.cost[index];
                game.clickValue *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateScore();
            }
        }
    }
}

let achivement = {
    name: [
        "The Great Beginning",
        "The Feature Popcorn Entrepreneur",
        "One Click..."
    ],
    description: [
        "Have your first popcorn clicked",
        "Have your first upgrade",
        "Click the popcorn 1 time"
    ],
    image: [
        "popcorn.svg",
        "fancy_popcorn.svg",
        "cursor.svg"
    ],
    type: [
        "score",
        "building",
        "click"
    ],
    requirement: [
        1,
        1,
        1
    ],
    objectIndex: [
        -1,
        0,
        -1
    ],
    awarded: [false, false, false],

    earn: function (index) {
        this.awarded[index] = true;
    }
}

let display = {
    updateScore: () => {
        document.getElementById("score").innerHTML = game.score;
        document.getElementById("autoClickPerSecond").innerHTML = game.getScorePerSecond();
        document.title = "Popcorn Clicker - " + game.score + " Popcorn Pieces";
    },
    updateWage: () => {
        document.getElementById("wage").innerHTML = game.getWage()
    },
    updateShop: () => {
        document.getElementById("shopContainer").innerHTML = "";
        for (let i = 0; i < building.name.length; i++) {
            document.getElementById("shopContainer").innerHTML += '<table class="shopButton unselectable" onclick="building.purchase(' + i + ');"><tr><td id="image"><img src="img/' + building.image[i] + '" draggable="false"></td><td id="nameAndCost"><p>' + building.name[i] + '</p><p><span>' + building.cost[i] + '</span> Pop&shy;corn Pieces</p></td><td id="amount"><span>' + building.count[i] + '</span></td></tr></table>';
        }
    },
    updateUpgrades: () => {
        document.getElementById("upgradeContainer").innerHTML = "";
        for (let i = 0; i < upgrade.name.length; i++) {
            if (!upgrade.purchased[i]) {
                if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="img/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ' popcorn pieces)" onclick="upgrade.purchase(' + i + ')';
                } else if (upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="img/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ' popcorn pieces)" onclick="upgrade.purchase(' + i + ')';
                }
            }
        }
    },
    updateAchievements: () => {
        document.getElementById("achievementContainer").innerHTML = "";
        for (i = 0; i < achivement.name.length; i++) {
            if (achivement.awarded[i]) {
                document.getElementById("achievementContainer").innerHTML += '<img src="img/' + achivement.image[i] + '" title="' + achivement.name[i] + ' &#10; ' + achivement.description[i] + '">';
            }
        }
    },
    updateVersion: () => {
        document.getElementById("info").innerHTML = "Popcorn Clicker V" + game.version;
    }
}

function background() {
    Swal.fire({
        title: 'Background Music',
        html: 'Would you like to play music?<br>Please enable autoplay on this website too.',
        icon: 'info',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showDenyButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            let backgroundMusic = new Audio('sounds/popcorn.flac');
            backgroundMusic.loop = true;
            backgroundMusic.play();
        } else if (result.isDenied) {
        }
    })
}

function saveGame() {
    let gameSave = {
        score: game.score,
        totalScore: game.totalScore,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        version: game.version,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost,
        upgradePurchased: upgrade.purchased,
        achivementAwarded: achivement.awarded
    }
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame() {
    let savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if (localStorage.getItem("gameSave") !== null) {
        if (typeof savedGame.score !== "undefined") game.score = savedGame.score;
        if (typeof savedGame.totalScore !== "undefined") game.totalScore = savedGame.totalScore;
        if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
        if (typeof savedGame.buildingCount !== "undefined") {
            for (let i = 0; i < savedGame.buildingCount.length; i++) {
                building.count[i] = savedGame.buildingCount[i];
            }
        }
        if (typeof savedGame.buildingIncome !== "undefined") {
            for (let i = 0; i < savedGame.buildingIncome.length; i++) {
                building.income[i] = savedGame.buildingIncome[i];
            }
        }
        if (typeof savedGame.buildingCost !== "undefined") {
            for (let i = 0; i < savedGame.buildingCost.length; i++) {
                building.cost[i] = savedGame.buildingCost[i];
            }
        }
        if (typeof savedGame.upgradePurchased !== "undefined") {
            for (let i = 0; i < savedGame.upgradePurchased.length; i++) {
                upgrade.purchased[i] = savedGame.upgradePurchased[i];
            }
        }
        if (typeof savedGame.achivementAwarded !== "undefined") {
            for (let i = 0; i < savedGame.achivementAwarded.length; i++) {
                achivement.awarded[i] = savedGame.achivementAwarded[i];
            }
        }
    }
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

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function fadeOut(element, duration, finalOpacity, callback) {
    let opacity = 1;

    let elementFadingInterval = window.setInterval(function () {
        opacity -= 50 / duration;

        if (opacity <= finalOpacity) {
            clearInterval(elementFadingInterval);
            callback();
        }

        element.style.opacity = opacity;
    }, 50)
}

function createNumberOnClicker(event) {
    let clicker = document.getElementById("clicker");

    let element = document.createElement("div");

    let clickerOffset = clicker.getBoundingClientRect();
    let position = {
        x: event.pageX - clickerOffset.left + randomNumber(-5, 5),
        y: event.pageY - clickerOffset.top
    }

    element.textContent = "+" + game.clickValue;
    element.classList.add("number", "unselectable");
    element.style.left = position.x + "px";
    element.style.top = position.y + "px";

    clicker.appendChild(element);

    let movementInterval = window.setInterval(function () {
        if (typeof element == "undefined" && element == null) clearInterval("movementInterval");
        position.y--;
        element.style.top = position.y + "px";
    }, 10)

    fadeOut(element, 3000, 0.5, function () {
        element.remove();
    })
}

document.getElementById("clicker").addEventListener("click", function (event) {
    game.totalClicks++;
    game.addToScore(game.clickValue);
    createNumberOnClicker(event);
    let clickSound = new Audio('sounds/mouse_click.wav');
    clickSound.play();
}, false)

window.onload = function () {
    loadGame();
    display.updateScore();
    display.updateUpgrades();
    display.updateAchievements();
    display.updateShop();
}

setInterval(function () {
    for (let i = 0; i < achivement.name.length; i++) {
        if (achivement.type[i] == "score" && game.totalScore >= achivement.requirement[i]) achivement.earn(i);
        else if (achivement.type[i] == "click" && game.totalClicks >= achivement.requirement[i]) achivement.earn(i);
        else if (achivement.type[i] == "building" && building.count[achivement.objectIndex[i]] >= achivement.requirement[i]) achivement.earn(i);
    }

    game.score += game.getScorePerSecond();
    game.totalScore += game.getScorePerSecond();
    display.updateScore();
    display.updateAchievements();
}, 1000) // 1 second

setInterval(function () {
    display.updateScore();
    display.updateWage();
    display.updateUpgrades();
    display.updateVersion();
}, 0) // 10 seconds

setInterval(function () {
    game.score -= game.getWage();
}, 5000)

setInterval(function () {
    saveGame();
}, 30000) // 30 seconds

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === 's') { //ctrl + s
        e.preventDefault();
        saveGame();
    }
}, false)

function multiplyByInfinity() {
    Swal.fire({
        title: 'Set Score to Infinity?',
        text: 'Are you sure you want to set score to infinity?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showDenyButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'You Sure?!',
                text: 'Are you sure you really want to do that?',
                icon: 'warning',
                confirmButtonText: 'Yes',
                showDenyButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    game.addToScore(Infinity);
                }
            })
        }
    })
}

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        document.getElementById("cheatContainer").classList.toggle("show");
    }
}, false)