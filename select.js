var roles = {
    "warrior": { maxhp: 100, hp: 100, speed: 8, range: 1, dmg: 20, role: "warrior" },
    "assassin" : {maxhp: 80, hp: 80, speed: 13, range: 1, dmg: 15, role: "assasin" },
    "archer" : {maxhp: 80, hp: 80, speed: 5, range: 13, dmg: 20, role: "archer" },
    "mage" : {maxhp: 60, hp: 60, speed: 3, range: 20, dmg: 30, role: "mage"},
    "priest" : {maxhp: 80, hp: 80, speed: 10, range: 1, dmg: 10, role: "priest" },
    "enchanter" : {maxhp: 60, hp: 60, speed: 8, range: 10, dmg: 20, role: "enchanter" }
}, 
displayed,
players = {
    true : { figures: new Array() },
    false : { figures: new Array() }
},
playerOnTurn = true;

function selected(item) {
    displayed = item;
    $("#description").load("descriptions/"+item+".html");
}

function confirmSelected() {
    if(displayed == undefined) return;

    players[playerOnTurn].figures.push(roles[displayed]);
    document.getElementById(displayed).remove();
    delete roles[displayed];

    var img = document.createElement("img");
    img.src = "src/"+displayed+".png";
    img.classList.add("col-sm-12");
    document.getElementById(playerOnTurn).appendChild(img);

    document.getElementById(playerOnTurn).children[0].style.visibility = "hidden";
    playerOnTurn = !playerOnTurn;
    document.getElementById(playerOnTurn).children[0].style.visibility = "visible";

    for(var first in roles) break;
    if(first == undefined){
        displayed = undefined;
        document.getElementById("startGame").style.visibility = "visible";
    } else selected(first);
}

function startGame(){
    localStorage.players = JSON.stringify(players);
    localStorage.playerOnTurn = JSON.stringify(true);
}