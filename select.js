var player1 = [], player2 = [], notselected = [];
var playerOnTurn = 1;
const warriorPassive = "";
const assassinPassive = "Assasin: Attacking an enemy poisons them causing them to recieve damage when moving.";
const magePassive = "Frost mage: Can attack any enemy on the map and freeze them reducing their speed";
const priestPassive = "Priestess: Can heal allies for 30 health and cleans their conditions.";
const archerPassive = "Archer: His attacks deal up to 20 bonus damage (this bonus can be modified by enchanter)";
const enchanterPassive = "Enchanter: Enchants allies increasing their damage.";
var selected;

function Role(name, hp, speed, range, dmg, passive){
    this.name = name;
    this.maxhp = hp;
    this.hp = hp;
    this.speed = speed;
    this.range = range;
    this.dmg = dmg;
    this.passive = passive;
}

$(document).on("pagecreate", "#page1", function() {
    notselected.push(new Role("warrior", 100, 8, 1, 20, warriorPassive));
    notselected.push(new Role("assassin", 80, 13, 1, 15, assassinPassive));

    notselected.push(new Role("archer", 80, 5, 13, 20, archerPassive));
    notselected.push(new Role("mage", 60, 3, 20, 30, magePassive));

    notselected.push(new Role("priest", 80, 10, 1, 10, priestPassive));
    notselected.push(new Role("enchanter", 60, 8, 10, 20, enchanterPassive));

    if(notselected.length!==0) {
        selected = notselected[0];
        var desc = document.getElementById("passive");
        desc.innerText = selected.passive;
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

    if(selected!==undefined) {
        document.getElementById("passive").innerText = selected.passive;
        document.getElementById("health").innerText = selected.maxhp;
        document.getElementById("damage").innerText = selected.dmg;
        document.getElementById("range").innerText = selected.range;
    }
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
        var passive = document.getElementById("passive");
        passive.innerText = selected.passive;
    }
    else {
        document.getElementById("selectButton").style.visibility = "hidden";
        document.getElementById("stats").style.visibility = "hidden";
        document.getElementById("passive").style.visibility = "hidden";
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