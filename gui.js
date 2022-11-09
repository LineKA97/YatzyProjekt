let rollbtn = document.querySelector("#rollButton");

function clearRollFields() {
    for (const index in dies) {
        let die = document.querySelector(dies[index].dieId);
        dies[index].eyes = 0;
        dies[index].hold = false;
        die.firstElementChild.value = dies[index].eyes;
    }
}

let turn = 1
let isPointsPlaced = false;
rollbtn.addEventListener("click", (e) =>{
    if ( turn <= 3 ) {
        rollDie(); // roll in model

        // set values in gui
        for (const index in dies) {
            let die = document.querySelector(dies[index].dieId);
            die.firstElementChild.value = dies[index].eyes;
        }

        for (let index = 0; index < resultObjects.length; index++) {
            let myTag = resultObjects[index].combination
            let updateTag = document.querySelector(`input.${myTag}`)
            updateTag.value = resultObjects[index].value
        }

        // update turn
        let turnUpdate = document.querySelector("#turnLabel");
        turnUpdate.innerHTML = "turn "+ turn;
        turn++;
    } else {
        let o = resultObjects.find(e => e.isSelected);

        if ( o != null) {
            o.isTemp = false;
            o.isSelected = false;

            let tag = document.querySelector(`input.${o.combination}`);
            tag.style.backgroundColor = "lightgreen";

            clearRollFields();
            turn = 1;
        } else {
            alert("please select a combination");
        }

    }
})

let allDieInput = document.querySelectorAll(".dieInput");

addEventListenerToDieInput(0);
addEventListenerToDieInput(1);
addEventListenerToDieInput(2);
addEventListenerToDieInput(3);
addEventListenerToDieInput(4);

function addEventListenerToDieInput(index) {
    allDieInput[index].addEventListener("click", (e) => {
        if (dies[index].hold) {
            dies[index].hold = false;
        } else {
            dies[index ].hold = true;
        }

        if (allDieInput[index].style.backgroundColor == "red") {
            allDieInput[index].style.backgroundColor = "white";
        } else {
            allDieInput[index].style.backgroundColor = "red"
        }
    })
}

let mainDev = document.querySelector("#mainDev");

mainDev.addEventListener("click", (elm ) =>{
    let sum = 0;

    // stop and return if selected elm has not class
    if ( elm.target.className.length == 0) {
        return;
    }

    // set element as selected
    resultObjects.setSelected(elm.target.className);

    // set color of selected to lightblue
    document.querySelectorAll("input").forEach(e => {
        if ( e.style.backgroundColor != "lightgreen") {
            e.style.backgroundColor = "white";
        }
    });
    document.querySelector("input."+elm.target.className).style.backgroundColor = "lightblue";

    // calculate the current sum values with the current slected value
    let sumcalc = [resultObjects.calculateSum, resultObjects.calculateBonus, resultObjects.calculateTotal];
    let totaltags = ["#sum", "#bonus", "#total"]

    for (let i = 0; i < totaltags.length; i++) {
        document.querySelector(totaltags[i]).value = sumcalc[i]();
    }

    // tjekt om spil er færdig
    if (resultObjects.isFinished()) {
        // clear rollfields og dice

        let totalPoints = resultObjects.calculateTotal();

        clearRollFields();

        // reset gui point fields
        for (let i = 0; i < 15; i++) { // TODO test of idear
            let elm = document.querySelector( resultObjects[i].combination );

            if ( elm != null) {
                elm.value = 0
            }
        }

        // reset result obj
        resultObjects.forEach(e => {
            e.isSelected = false;
            e.isTemp = True;
            e.value = -1;
        });

        alert("total Points: "+ totalPoints);

    }
})