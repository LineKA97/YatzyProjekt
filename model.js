function die(dieId) {
    this.dieId = dieId;
    this.hold= false;
    this.eyes  = 0;
}

let dies = [new die("#die1"),
    new die("#die2"),
    new die("#die3"),
    new die("#die4"),
    new die("#die5"),
]

function resultObj(combination) {
    this.combination = combination;
    this.value = -1;
    this.isTemp = true;
    this.isSelected = false;
}

resultObj.prototype.toString = function () {
    return this.combination;
}

let resultObjects = [ new resultObj("ones"), new resultObj("twos"), new resultObj("threes"),
    new resultObj("fours"), new resultObj("fives"), new resultObj("sixes"),
    new resultObj("yatzy"), new resultObj("chance"), new resultObj("fullHouse"),
    new resultObj("smallStraight"), new resultObj("bigStraight"), new resultObj("onePair"),
    new resultObj("twoPair"), new resultObj("threeLike"), new resultObj("fourLike")]


//Retunere summen af terningerne
resultObjects.calculateSum = function () {
    let sum = 0;
    for (let i = 0; i < 6; i++) {
        if ( resultObjects[i].isTemp === false || resultObjects[i].isSelected) {
            sum += resultObjects[i].value;
        }
    }
    return sum;
}


resultObjects.calculateTotal = function () {
    let total = 0;

    for (let i = 6; i < resultObjects.length; i++) {
        if ( resultObjects[i].isTemp === false || resultObjects[i].isSelected) {
            total += resultObjects[i].value;
        }
    }
    let sum =  resultObjects.calculateSum();
    let bonus = resultObjects.calculateBonus();

    return total+sum+bonus;
}

//temp bonus
resultObjects.calculateBonus = function(){
    if (resultObjects.calculateSum() >= 63) {
        return 50;
    };
    return 0;
}

resultObjects.isFinished = function () {
    let finished = resultObjects.every(e => e.isTemp === false);
    return finished;
};

// TODO kan laves i et hug med en lang array
function calcResult() {
    for (let i = 0; i < 6; i++) {
        if (resultObjects[i].isTemp) {
            resultObjects[i].value = sumSingle(i+1);
        }
    }

    let otherSumFunctions = [yatzy, chance, fullHouse, smallStraight, bigStraight, onepair, twopair];

    for (let i = 0; i < otherSumFunctions.length ; i++) {
        if ( resultObjects[i+6].isTemp) {
            resultObjects[i+6].value = otherSumFunctions[i]();
        }
    }
    if ( resultObjects[resultObjects.length -2].isTemp) {
        resultObjects[resultObjects.length - 2].value = Like(3);
    }

    if ( resultObjects[resultObjects.length -1].isTemp) {
        resultObjects[resultObjects.length - 1].value = Like(4);
    }
}

// setSelected( resultName )
// er der noget selected så fjern select
// sæt ny select
resultObjects.setSelected = function (combination){
    resultObjects.forEach( e => e.isSelected = false );
    let o = resultObjects.find(e => e.combination == combination);
    o.isSelected = true;
}

// returns true if elm. is used else false
resultObjects.isUsed = function(classname) {
    let propNamesTest =  Object.getOwnPropertyNames(resultObjects).filter(e => resultObjects[e] != -1)
    return propNamesTest.some(e => classname == e);
};

let classNameOfOnesTest = document.querySelector(".ones").className;

function rollDie() {
    for (let i = 0; i < 5; i++) {
        if ( dies[i].hold == false) {
            let roll = Math.floor(Math.random() * 6) + 1;
            dies[i].eyes = roll;
        }
    }

    calcResult();
}

// return the value of same in a throw.
function sumSingle(nr) {
    let sum = 0;
    for (const die of dies) {
        if (die.eyes == nr) {
            sum += die.eyes;
        }
    }
    return sum
}

// return the nr of same in a throw.
function nrOfValue(nr) {
    let res = 0;
    for (const die of dies) {
        if (die.eyes == nr) {
            res += 1;
        }
    }
    return res;
}

function dieResult() {
    let res = [];
    for (let i = 0; i < 6 ; i++) {
        res.push( [ i+1, nrOfValue(i+1) ] ) ;
    }
    return res;
}

function onepair(){
    let dieresult = dieResult();
    let res = dieresult.filter( e  => e[1] >= 2 )
    if (res > 1) {
        res =  res[res.length-1][0] * 2 ;
        return res;
    }
    return 0;
}

function twopair() {
    let dieresult = dieResult();

    // find all die with with sequnece higher that or equal to two
    let result = dieresult.filter( e  => e[1] >= 2 );

    //check for four like
    let fourLike = dieresult.find(e => e[1] == 4);
    if ( fourLike) {
        return result.map(e => e[0]*e[1])[0];
    }

    // check if there are two pair
    if ( result.length == 2) {
        let sum = 0;
        for (let i = 0; i < result.length; i++) {
            let die = result[i];
            if ( die[1] > 2) {
                die[1] = 2;
            }

            sum += (die[0]*die[1]);
        }

        return sum;
    }

    // else return 0
    return 0;

}

function yatzy() {
    let dieresult = dieResult();
    if ( dieresult.some( e => e[1] == 5 )) {
        return 50;
    }
    return 0;
}

function chance() {
    let dieresult = dieResult();
    let result = dieresult.map(e => e[0]*e[1]  ).reduce( (a, v) =>  a += v );
    return result;
}

function fullHouse() {
    let dieresult = dieResult();
    if ( dieresult.some(e => e[1] == 2) && dieresult.some(e => e[1] == 3)) {
        let result = dieresult.filter( e => e[1] >= 2 ).map( e => e[0]*e[1] ).reduce( ( a, v ) =>  a += v );
        return result;
    }
    return 0;
}

// three & four same
function Like(number) {
    let dieresult = dieResult();
    let result = dieresult.filter( e => e[1] >= number).map( e => e[0]*e[1] );

    if ( result.length == 1) {
        return result[0];
    }
    return 0;
}

function smallStraight(){
    let dieresult = dieResult();
    let straight = dieresult.filter(e => e[1] === 1 && e[0] !== 6 );

    if ( straight.length === 5  && straight.some(e => e[0] === 1 && e[1] == 1))  {
        return  15;
    }

    return 0;
}

function bigStraight(){
    let dieresult = dieResult();
    let straight = dieresult.filter(e => e[1] === 1 && e[0] !== 1  );

    if ( straight.length === 5 )  {
        return  20;
    }

    return 0;
}