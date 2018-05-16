var canvas, players;
var queue = new Queue();
var chanted, frozen, poisoned;
var interacting = false;
var distanceOverflow = 0.5;

$(document).on("pagecreate", "#page2", function() {
    players = JSON.parse(localStorage.players);
    var canvElem = document.getElementById("canvas");
    canvas = canvElem.getContext("2d");
    canvElem.addEventListener("click", e => {
        interact(getGameCoords(e.clientX, e.clientY));
    })

    initGame();
});

// set positions of the figures on the field and enqueue them
function initGame(){
    // place player 1 figures
    players[true].figures[0].x = 2; players[true].figures[0].y = 0;
    players[true].figures[1].x = 4; players[true].figures[1].y = 0;
    players[true].figures[2].x = 6; players[true].figures[2].y = 0;
    // place player 0 figures
    players[false].figures[0].x = 2; players[false].figures[0].y = 15;
    players[false].figures[1].x = 4; players[false].figures[1].y = 15;
    players[false].figures[2].x = 6; players[false].figures[2].y = 15;
    // queue up in turns
    queue.push(players[true].figures[0]);
    queue.push(players[false].figures[0]);
    queue.push(players[true].figures[1]);
    queue.push(players[false].figures[1]);
    queue.push(players[true].figures[2]);
    queue.push(players[false].figures[2]);
    console.log(queue);
    // draw board
    repaint();
}

// repaints canvas
function repaint() {
    var bg = new Image();
    bg.src = "src/playground.png";
    bg.onload = e => {
        canvas.drawImage(bg, 0, 0);
        paintPlayer(players[true].figures, "#FFF3");
        paintPlayer(players[false].figures, "#0005");
        paintRanges();
    }
}

function paintPlayer(figures, teamColor){
    figures.forEach(x => {
        var img = new Image();
        img.src = "src/" + x.role + ".png";
        var coords = getCanvasCoords(x.x, x.y);
        img.onload = e => {
            canvas.fillStyle = teamColor;
            canvas.fillRect(coords.x, coords.y, 120, 120)
            canvas.drawImage(img, coords.x+10, coords.y+10);
            canvas.fillStyle = "red";
            canvas.font = "bold 30px Arial";
            canvas.fillText(x.hp, coords.x+5, coords.y+30)

            if(x === frozen){
                var fr = new Image();
                fr.src = "src/frozen.png";
                fr.onload = e => {
                    canvas.drawImage(fr, coords.x, coords.y);
                }
            }

            if(x === poisoned){
                var po = new Image();
                po.src = "src/poisoned.png";
                po.onload = e => {
                    canvas.drawImage(po, coords.x, coords.y);
                }
            }
            
            if(x === chanted){
                var ch = new Image();
                ch.src = "src/chanted.png";
                ch.onload = e => {
                    canvas.drawImage(ch, coords.x, coords.y);
                }
            }
        }
    })
}

function paintRanges(){
    var x = queue.seek();
    var coords = getCanvasCoords(x.x, x.y);
    
    canvas.lineWidth = 5;

    canvas.beginPath();
    canvas.strokeStyle = "blue";
    canvas.arc(coords.x+60, coords.y+60, x.speed*120, 0, 2*Math.PI);
    canvas.stroke();

    canvas.beginPath();
    canvas.strokeStyle = "red";
    canvas.arc(coords.x+60, coords.y+60, x.range*120+100, 0, 2*Math.PI);
    canvas.stroke();

    canvas.beginPath();
    canvas.strokeStyle = "red";
    canvas.rect(coords.x, coords.y, 120, 120);
    canvas.stroke();
    
}

// transfares canvas coords to board coords
function getGameCoords(x, y){
    return {"x":Math.floor(x/120),
            "y":Math.floor(y/120)}
}

// transfares game coords to canvas coords
function getCanvasCoords(x, y){
    return {"x":Math.floor(x*120),
            "y":Math.floor(y*120)}
}

// figure on turn interacts with clicked board coords
function interact(coords){
    if(interacting) return;
    
    interacting = true;
    var figureOnTurn = queue.seek();
    var target;
    players[true].figures.forEach(x => {
        if(x.x == coords.x && x.y == coords.y){
            target = x;
        }
    })
    players[false].figures.forEach(x => {
        if(x.x == coords.x && x.y == coords.y){
            target = x;
        }
    })

    if(target === undefined){
        if(move(figureOnTurn, coords)){
            queue.next();
            repaint();
        }
    }
    else if(attack(figureOnTurn, target)) {
        queue.next();
        repaint();
    }

    if(players[true].figures.length === 0){
        localStorage.winnerText = "Player 1 wins!";
        $.mobile.navigate("#winScreen");
    }

    if(players[false].figures.length === 0){
        localStorage.winnerText = "Player 2 wins!";
        $.mobile.navigate("#winScreen");
    }
    interacting = false;
}

// move to coords if enaugh speed and empty
function move(figureOnTurn, coords){
    if(figureOnTurn === frozen) {
        if(!enemyInRange(figureOnTurn)) { 
            return true;
        }
        else return false;
    }

    var distance = getDistance({x: figureOnTurn.x, y: figureOnTurn.y}, coords);

    if(distance - distanceOverflow > figureOnTurn.speed) return false;

    figureOnTurn.x = coords.x;
    figureOnTurn.y = coords.y;

    if(figureOnTurn === poisoned) {
        dealDmg(figureOnTurn, Math.floor(distance));
    }

    return true;
}

function enemyInRange(figure) {
    var inrange = false;
    if(areAllies(figure, players[true].figures[0])){
        players[false].figures.forEach(x => {
            var distance = getDistance({x: figure.x, y: figure.y}, x);
            if(distance < figure.range)
                inrange = true;
        })
    }
    else {
        players[true].figures.forEach(x => {
            var distance = getDistance({x: figure.x, y: figure.y}, x);
            if(distance < figure.range)
                inrange = true;
        })
    }
    return inrange;
}

function getDistance(coords1, coords2) {
    return Math.sqrt(Math.pow(coords1.x - coords2.x, 2) + Math.pow(coords1.y - coords2.y, 2));
}

// attack the target if in range
function attack(figureOnTurn, target){
    if(areAllies(figureOnTurn, target)){
        switch(figureOnTurn.role){
            case "priest":
                heal(target, 30);
                break;
            case "enchanter":
                chanted = target;
                break;
            default:
                return false;
        }
    }
    else {
        var distance = getDistance({x: figureOnTurn.x, y: figureOnTurn.y}, {x: target.x, y: target.y});
        if(distance - distanceOverflow > figureOnTurn.range) return false;
        
        switch(figureOnTurn.role) {
            case "archer":
                dealDmg(target, (Math.floor(Math.random()*1000 % 20)));
                break;
            case "mage":
                frozen = target;
                break;
            case "assassin":
                poisoned = target;
                break;
            default: break;
        }
        if(figureOnTurn === chanted){
            dealDmg(target, figureOnTurn.dmg * 1.5);
        }
        else {
            dealDmg(target, figureOnTurn.dmg);
        }
        return true; 
    }

    if(figureOnTurn === frozen) frozen = undefined;
    return true;
}

function dealDmg(target, dmg){
    target.hp -= dmg;
    if(target.hp > 0) return;
    
    players[true].figures = removeFromArray(players[true].figures, target);
    players[false].figures = removeFromArray(players[false].figures, target);
    queue.remove(target);
}

function heal(target, hp){
    target.hp += hp;
    if(target.hp > target.maxhp) target.hp = target.maxhp;
    console.log(target.role + " healed");

    if(target === frozen) frozen = undefined;
    if(target === poisoned) poisoned = undefined;
}

function areAllies(first, second){
    if(ArrayContains(players[true].figures, first) && ArrayContains(players[true].figures, second)) return true;
    if(ArrayContains(players[false].figures, first) && ArrayContains(players[false].figures, second)) return true;    
    return false;
}

function Queue(){
    this.arr = [];
    this.lenght = function () { return this.arr.lenght; }

    this.push = function (item) {
        this.arr.push(item);
    }
    
    this.seek = function () { return this.arr[0]; }

    this.pop = function () {
        var tmp = this.arr[0];
        this.arr.splice(0, 1);
        return tmp;
    }

    this.next = function () {
        var tmp = this.pop();
        this.push(tmp);
    }

    this.remove = function (item) {
        this.arr = removeFromArray(this.arr, item);
    }

    this.isEmpty = function() {
        return this.arr.lenght === 0;
    }
}

function removeFromArray(array, object){
    newArr = [];
    array.forEach(x => {
        if(x !== object){
            newArr.push(x);
        }
    })
    return newArr;
}

function ArrayContains(array, item){
    var contains = false;
    array.forEach(element => {
        if(element === item)
            contains = true;       
    });
    return contains;
}