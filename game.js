var canvas, player1, player2;
var queue = new Queue();
var chanted, frozen, poisoned;

$(document).on("pagecreate", "#page2", function() {
    player1.figures = JSON.parse(localStorage.player1);
    player2.figures = JSON.parse(localStorage.player2);

    var canvElem = document.getElementById("canvas");
    canvas = canvElem.getContext("2d");
    canvElem.addEventListener("click", e => {
        interact(getGameCoords(e.clientX, e.clientY));
    })

    initGame();
});

// set positions of the figures on the field and enqueue them
function initGame(){
    player1.figures[0].x = 2; player1.figures[0].y = 0;
    player1.figures[1].x = 4; player1.figures[1].y = 0;
    player1.figures[2].x = 6; player1.figures[2].y = 0;

    player2.figures[0].x = 2; player2.figures[0].y = 15;
    player2.figures[1].x = 4; player2.figures[1].y = 15;
    player2.figures[2].x = 6; player2.figures[2].y = 15;

    queue.push(player1.figures[0]);
    queue.push(player2.figures[0]);
    queue.push(player1.figures[1]);
    queue.push(player2.figures[1]);
    queue.push(player1.figures[2]);
    queue.push(player2.figures[2]);

    repaint();
}

// repaints canvas
function repaint() {
    var bg = new Image();
    bg.src = "src/playground.png";
    bg.onload = e => {
        canvas.drawImage(bg, 0, 0);

        paintPlayer(player1.figures, "#FFF3");
        paintPlayer(player2.figures, "#0005");
        paintRanges();
    }
}

function paintPlayer(figures, teamColor){
    figures.forEach(x => {
        var img = new Image();
        img.src = "src/" + x.name + ".png";
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
    var figureOnTurn = queue.seek();
    var target;
    player1.figures.forEach(x => {
        if(x.x == coords.x && x.y == coords.y){
            target = x;
        }
    })
    player2.figures.forEach(x => {
        if(x.x == coords.x && x.y == coords.y){
            target = x;
        }
    })

    if(target === undefined){
        if(move(figureOnTurn, coords)){
            console.log(figureOnTurn.name + " moved to [" + coords.x + ":" + coords.y + "]");
            queue.next();
            repaint();
        }
    }
    else if(attack(figureOnTurn, target)) {
        console.log(figureOnTurn.name + "[" + figureOnTurn.x + ":" + figureOnTurn.y + "] interacted " + target.name + "[" + coords.x + ":" + coords.y + "]");
        queue.next();
        repaint();
    }

    if(player1.figures.length === 0){
        document.getElementById("winScreen").innerHTML = "<h1 id='winText'>Player 1 win!</h1>" +
        "<div id='video'>" +
                "<iframe width='1080' height='512' src='https://www.youtube.com/embed/S22_DuaoHCU' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>" +
        "</div>" +
        "<a id='newGame' onclick='newGame()'>New game</a>";
        $.mobile.navigate("#winScreen");
    }

    if(player2.figures.length === 0){
        $("#winText").text("Player 1 wins!");
        $.mobile.navigate("#winScreen");
    }
}

// move to coords if enaugh speed and empty
function move(figureOnTurn, coords){
    var distance = Math.sqrt(Math.pow(Math.abs(figureOnTurn.x-coords.x), 2)+Math.pow(Math.abs(figureOnTurn.y-coords.y),2));
    
    if(figureOnTurn === frozen) {
        if(!enemyInRange(figureOnTurn)) { 
            return true;   
        }
        else return false;
    }

    if(distance > figureOnTurn.speed) return false;

    figureOnTurn.x = coords.x;
    figureOnTurn.y = coords.y;

    if(figureOnTurn === poisoned) {
        dealDmg(figureOnTurn, Math.floor(distance));
    }

    return true;
}

function enemyInRange(figure) {
    var inrange = false;
    if(areAllies(figure, player1.figures[0])){
        player2.figures.forEach(x => {
            var distance = Math.sqrt(Math.pow(Math.abs(figure.x-x.x),2)+Math.pow(Math.abs(figure.y-x.y),2));
            if(distance < figure.range)
                inrange = true;
        })
    }
    else {
        player1.figures.forEach(x => {
            var distance = Math.sqrt(Math.pow(Math.abs(figure.x-x.x),2)+Math.pow(Math.abs(figure.y-x.y),2));
            if(distance < figure.range)
                inrange = true;
        })
    }
    return inrange;
}

// attack the target if in range
function attack(figureOnTurn, target){
    if(areAllies(figureOnTurn, target)){
        switch(figureOnTurn.name){
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
        var distance = Math.sqrt(Math.pow(Math.abs(figureOnTurn.x-target.x), 2)+Math.pow(Math.abs(figureOnTurn.y-target.y),2));
        if(distance > figureOnTurn.range) return false;
        
        switch(figureOnTurn.name) {
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
    
    player1.figures = removeFromArray(player1.figures, target);
    player2.figures = removeFromArray(player2.figures, target);
    queue.remove(target);
}

function heal(target, hp){
    target.hp += hp;
    if(target.hp > target.maxhp) target.hp = target.maxhp;
    console.log(target.name + " healed");

    if(target === frozen) frozen = undefined;
    if(target === poisoned) poisoned = undefined;
}

function areAllies(first, second){
    if(ArrayContains(player1.figures, first) && ArrayContains(player1.figures, second)) return true;
    if(ArrayContains(player2.figures, first) && ArrayContains(player2.figures, second)) return true;    
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