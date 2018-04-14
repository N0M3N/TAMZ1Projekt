var canvas, player1 = [], player2 = [], all = [];
var warriorDesc = "With his huge sustain warrior is able to get to the front line of the battle without getting hit and deal lots of damage with his mighty sword.";
var mageDesc = "The frost mage is a master of crowd controll. His attacks freez the enemies and reduce their mobility.";
var priestDesc = "The priestes of the temple is the master in healing of her allies but in the battle she doesn't take over her enemies.";
var archerDesc = "Archer, the skilled in finding enemy's weak spots to pierce their defense putting enemies down one by one.";

var selected;

$(document).ready(function(){
    canvas = document.getElementById("canvas").getContext("2d");
    select();
})

function Role(name,x,y,hp,ability,description){
    this.name = name;
    this.image = img;
    this.hp = hp;
    this.ability = ability;
    this.description = description;

    var img = new Image();
    img.src = `src/${name}.png`;
    img.onload = function() {
        canvas.drawImage(img, x, y);
    }

    canvas.canvas.addEventListener("click", function(e) {
        const mousePos = {
            x: e.clientX,
            y: e.clientY
          };
        
        if(mousePos.x >= x && mousePos.x <= x+100 &&
            mousePos.y >= y && mousePos.y <= y+100) {
                firstSelected(name);
        }
    });
}

function select(){
    all.push(new Role("warrior", 20, 10, 100, 100, warriorDesc));
    // todo
    all.push(new Role("archer", 20, 140, 100, 100, archerDesc));
    all.push(new Role("mage", 150, 140, 100, 100, mageDesc));
    
    all.push(new Role("priest", 20, 270, 100, 100, priestDesc));
}

function firstSelected(name){
    selected = all.find(x => x.name == name);
    canvas.fillStyle="black";
    canvas.fillRect(280, 80, 300, 200);
    
    canvas.fillStyle = "white";
    canvas.font = "15px Arial"
    writeLong(selected.description, 300, 100, 40);
}

function writeLong(text, x, y, w){
    while(text !== undefined && text.length > 0){
        var part1;
        if(text.length > w){
            var space = text.substr(0,w).lastIndexOf(" ");
            part1 = text.substr(0, space);
        }
        else {
            part1 = text;
        }
        canvas.fillText(part1, x, y);
        y += 20;
        text = text.substr(space+1);
    }
}