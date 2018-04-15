var player1 = [], player2 = [], notselected = [];
var playerOnTurn = 1;
const warriorDesc = "With his huge sustain warrior is able to get to the front line of the battle without getting hit and deal lots of damage with his mighty sword.";
const assassinDesc = "todo";
const mageDesc = "The frost mage is a master of crowd controll. His attacks freez the enemies and reduce their mobility.";
const priestDesc = "The priestes of the temple is the master in healing of her allies but in the battle she doesn't take over her enemies.";
const archerDesc = "Archer the agille ranger skilled in finding enemy's weak spots to pierce their defense putting enemies down one by one.";

var selected;

function Role(name, x, y, hp, speed, ability, description){
    this.name = name;
    this.hp = hp;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.description = description;
    this.ability = ability;
}

$(document).on("pagecreate", "#page1", function() {
    notselected.push(new Role("warrior", 20, 10, 100, 10, 100, warriorDesc));
    notselected.push(new Role("assassin", 20, 10, 100, 15, 100, assassinDesc));

    notselected.push(new Role("archer", 20, 140, 100, 5, 100, archerDesc));
    notselected.push(new Role("mage", 150, 140, 100, 3, 100, mageDesc));

    notselected.push(new Role("priest", 20, 270, 100, 7, 100, priestDesc));
    // todo

    if(notselected.length!==0) {
        selected = notselected[0];
        var desc = document.getElementById("description");
        desc.innerText = selected.description;
    }

    repaintSelect();
});

function repaintSelect(){
    var div = document.getElementById("notSelected");
    div.innerHTML = "";
    notselected.forEach(element => {
        var name = element.name;
        putRole(div, element);
    })

    var p1 = document.getElementById("player1");
    p1.innerHTML = "<h3>Team 1:</h3>";
    player1.forEach(element => {
        var name = element.name;
        p1.innerHTML += "<img class=\"selectedRoleImg\" src=\"src\\" + name + ".png\">";
    })

    var p2 = document.getElementById("player2");
    p2.innerHTML = "<h3>Team 2:</h3>";
    player2.forEach(element => {
        var name = element.name;
        p2.innerHTML += "<img class=\"selectedRoleImg\" src=\"src\\" + name + ".png\">";
    })

    if(selected!==undefined) document.getElementById("description").innerText = selected.description;
}

function putRole(div, element){
    if(element !== selected) {
        div.innerHTML += 
            "<a onclick=\"select('" + element.name + "')\">" +
                "<img class=\"roleImg\" src=\"src\\" + element.name + ".png\">" +
            "</a>";
    }
    else {
        div.innerHTML += 
            "<a onclick=\"select('" + element.name + "')\">" +
                "<img class=\"roleImg selected\" src=\"src\\" + element.name + ".png\">" +
            "</a>";
    }
}

function confirmed(){
    if(selected == undefined) return;

    if(playerOnTurn == 1){
        player1.push(selected);
        playerOnTurn = 2;
    }
    else{
        player2.push(selected);
        playerOnTurn = 1;
    }
    
    var tmp = [];
    notselected.forEach(x => {
        if(x!==selected){
            tmp.push(x);
        }
    })
    notselected = tmp;
    selected = undefined;

    if(notselected.length!==0) {
        selected = notselected[0];
        var desc = document.getElementById("description");
        desc.innerText = selected.description;
    }
    else {
        document.getElementById("selectButton").style.visibility = "hidden";
        document.getElementById("finishButton").style.visibility = "visible";
    }

    repaintSelect();
}

function select(name){
    selected = notselected.find(x => x.name == name);
    repaintSelect();
}

function startGame(){
    localStorage.player1 = JSON.stringify(player1);
    localStorage.player2 = JSON.stringify(player2);
    $.mobile.navigate("#page2");
}