let game = {
    score: 0,
    totalScore: 0,
    totalClicks: 0,
    clickValue: 1,
    version: '0.9.1',

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
        "Popcorn Employees",
        "Popcorn Factories"
    ],
    image: [
        "batch_of_popcorn.svg",
        "popcorn_farm.svg",
        "popcorn_employees.svg",
        "popcorn_factories.svg"
    ],
    wage: [0, 1, 10, 1000],
    count: [0, 0, 0, 0],
    income: [1, 10, 100, 1111],
    cost: [30, 1000, 100000, 400000],

    costMultiplier: [1.2, 1.6, 1.4, 1.5],

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
        "Made In Indiana, USA",
        "Free Food",
        "Carbon Dioxide Free Factories"
    ],
    description: [
        "Popcorn batches are twice as efficient.",
        "Indiana makes most of the US's popcorn. Click value twice as efficient.",
        "Employees are happier. Wage is decreased by 5%.",
        "Factories are now carbon dioxide free! Cost multiplier is now reduced by 5%."
    ],
    image: [
        "butter.svg",
        "indiana.svg",
        "popcorn.svg",
        "co2.svg"
    ],
    type: [
        "building",
        "click",
        "wage",
        "costMultiplier"
    ],
    cost: [
        500,
        1000,
        100000,
        3333333
    ],
    buildingIndex: [
        0,
        1,
        2,
        3
    ],
    requirement: [
        1,
        1,
        1,
        1
    ],
    bonus: [
        2,
        2,
        0.95,
        0.95
    ],
    purchased: [false, false, false, false],
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
            } else if (this.type[index] == "wage" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
                game.score -= this.cost[index];
                building.wage[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateScore();
                display.updateShop();
            } else if (this.type[index] == "costMultiplier" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
                game.score -= this.cost[index];
                building.costMultiplier[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;

                display.updateUpgrades();
                display.updateScore();
                display.updateShop();
            }
        }
    }
}

let achievement = {
    name: [
        "The Great Beginning",
        "The Future Popcorn Entrepreneur",
        "One Click...",
        "Mad Clicker",
        "Renovation I"
    ],
    description: [
        "Have your first popcorn clicked.",
        "Get a batch of popcorn.",
        "Click the popcorn 1 time.",
        "Click 1000 times.",
        "Have a simple background at 30 popcorn per second."
    ],
    image: [
        "popcorn.svg",
        "fancy_popcorn.svg",
        "cursor.svg",
        "mad_cursor.svg",
        "main_background_achievement.svg"
    ],
    type: [
        "score",
        "building",
        "click",
        "click",
        "background"
    ],
    requirement: [
        1,
        1,
        1,
        1000,
        undefined
    ],
    objectIndex: [
        -1,
        0,
        -1,
        -1,
        1
    ],
    awarded: [false, false, false, false, false],
    earn: index => {
        achievement.awarded[index] = true;
    }
}

let backgroundType = {
    image: [
        "none",
        "url('img/main_background.svg')"
    ],
    requirement: [0, 30],
    awarded: [false, false]
}

let display = {
    updateScore: () => {
        document.getElementById("score").innerHTML = numberformat.format(game.score);
        document.getElementById("autoClickPerSecond").innerHTML = numberformat.format(game.getScorePerSecond());
        document.title = "Popcorn Clicker - " + numberformat.format(game.score) + " Popcorn Pieces";
    },
    updateWage: () => {
        document.getElementById("wage").innerHTML = numberformat.format(game.getWage());
    },
    updateShop: () => {
        document.getElementById("shopContainer").innerHTML = "";
        for (let i = 0; i < building.name.length; i++) {
            document.getElementById("shopContainer").innerHTML += '<table class="shopButton unselectable" onclick="building.purchase(' + i + ');" title="Wage: ' + building.wage[i] + ' &#10; Increases popcorn per second by: ' + building.income[i] + ' &#10; Cost Multiplier: ' + building.costMultiplier[i] + '" role="button"><tr><td id="image"><img src="img/' + building.image[i] + '" draggable="false"></td><td id="nameAndCost"><p>' + building.name[i] + '</p><p><span>' + numberformat.format(building.cost[i]) + '</span> Pop&shy;corn Pieces</p></td><td id="amount"><span>' + numberformat.format(building.count[i]) + '</span></td></tr></table>';
        }
    },
    updateUpgrades: () => {
        document.getElementById("upgradeContainer").innerHTML = "";
        for (let i = 0; i < upgrade.name.length; i++) {
            if (!upgrade.purchased[i]) {
                if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="img/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + numberformat.format(upgrade.cost[i]) + ' popcorn pieces)" onclick="upgrade.purchase(' + i + ')">';
                } else if (upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="img/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + numberformat.format(upgrade.cost[i]) + ' popcorn pieces)" onclick="upgrade.purchase(' + i + ')">';
                } else if (upgrade.type[i] == "wage" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="img/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + numberformat.format(upgrade.cost[i]) + ' popcorn pieces)" onclick="upgrade.purchase(' + i + ')">';
                } else if (upgrade.type[i] == "costMultiplier" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src="img/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + numberformat.format(upgrade.cost[i]) + ' popcorn pieces)" onclick="upgrade.purchase(' + i + ')">';
                }
            }
        }
    },
    updateAchievements: () => {
        document.getElementById("achievementContainer").innerHTML = "";
        for (let i = 0; i < achievement.name.length; i++) {
            if (achievement.awarded[i]) {
                document.getElementById("achievementContainer").innerHTML += '<img src="img/' + achievement.image[i] + '" title="' + achievement.name[i] + ' &#10; ' + achievement.description[i] + '">';
            }
        }
    },
    updateVersion: () => {
        document.getElementById("info").innerHTML = "Popcorn Clicker V" + game.version;
    },
    updateBackground: () => {
        for (let i = 0; i < backgroundType.image.length; i++) {
            if (game.getScorePerSecond() >= backgroundType.requirement[i]) {
                backgroundType.awarded[i] = true;
                document.body.style.backgroundImage = backgroundType.image[i];
            }
        }
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
        buidlingWage: building.wage,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost,
        buildingCostMultiplier: building.costMultiplier,
        upgradePurchased: upgrade.purchased,
        achievementAwarded: achievement.awarded
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
        if (typeof savedGame.buidlingWage !== "undefined") {
            for (let i = 0; i < savedGame.buidlingWage.length; i++) {
                building.wage[i] = savedGame.buidlingWage[i];
            }
        }
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
        if (typeof savedGame.achievementAwarded !== "undefined") {
            for (let i = 0; i < savedGame.achievementAwarded.length; i++) {
                achievement.awarded[i] = savedGame.achievementAwarded[i];
            }
        }
        if (typeof savedGame.buildingCostMultiplier !== "undefined") {
            for (let i = 0; i < savedGame.buildingCostMultiplier.length; i++) {
                building.costMultiplier[i] = savedGame.buildingCostMultiplier[i];
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
    display.updateVersion();
    display.updateBackground();
}

setInterval(function () {
    display.updateBackground();
    display.updateWage();
    display.updateScore();
}, 0)

setInterval(function () {
    for (let i = 0; i < achievement.name.length; i++) {
        if (achievement.type[i] == "score" && game.totalScore >= achievement.requirement[i]) achievement.earn(i);
        else if (achievement.type[i] == "click" && game.totalClicks >= achievement.requirement[i]) achievement.earn(i);
        else if (achievement.type[i] == "building" && building.count[achievement.objectIndex[i]] >= achievement.requirement[i]) achievement.earn(i);
        else if (achievement.type[i] == "background" && backgroundType.awarded[achievement.objectIndex[i]] == true) achievement.earn(i);
    }

    game.score += game.getScorePerSecond();
    game.totalScore += game.getScorePerSecond();
    display.updateScore();
    display.updateAchievements();
}, 1000) // 1 second

setInterval(function () {
    display.updateUpgrades();
}, 1000) // 0 seconds

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

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey && e.key === 'r') {
        e.preventDefault();
        resetGame();
    }
})

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
