var canvas, player1, player2;
var queue = new Queue();
var imgs = {
}

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

function figure(x, y, role){
    this.x = x;
    this.y = y;
    this.role = role;
}

function initGame(){
    player1.figures[0].x = 2; player1.figures[0].y = 0;
    player1.figures[1].x = 4; player1.figures[1].y = 0;
    player1.figures[2].x = 6; player1.figures[2].y = 0;

    player2.figures[0].x = 2; player2.figures[0].y = 15;
    player2.figures[1].x = 4; player2.figures[1].y = 15;
    // player1[2].x = 6; player1[2].y = 15;

    queue.push(player1.figures[0]);
    queue.push(player2.figures[0]);
    queue.push(player1.figures[1]);
    queue.push(player2.figures[1]);
    queue.push(player1.figures[2]);
    // queue.push(player2.figures[2]);

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
            canvas.font = "30px Arial";
            canvas.fillText(x.hp, coords.x+60, coords.y+40)
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
    var player;
    var targetPlayer;
    player1.figures.forEach(x => {
        if(x.x == coords.x && x.y == coords.y){
            target = x;
            player = 1;
        }

        if(x === figureOnTurn){
            targetPlayer = 1;
        }
    })
    player2.figures.forEach(x => {
        if(x.x == coords.x && x.y == coords.y){
            target = x;
            player = 2;
        }

        if (x === figureOnTurn){
            targetPlayer == 2;
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
        console.log(figureOnTurn.name + "[" + figureOnTurn.x + ":" + figureOnTurn.y + "] attacked " + target.name + "[" + coords.x + ":" + coords.y + "]");
        queue.next();
        repaint();
    }
}

// move to coords if enaugh speed
function move(figureOnTurn, coords){
    if(Math.sqrt(Math.pow(Math.abs(figureOnTurn.x-coords.x), 2)+Math.pow(Math.abs(figureOnTurn.y-coords.y),2))>figureOnTurn.speed) return false;

    figureOnTurn.x = coords.x;
    figureOnTurn.y = coords.y;

    return true;
}

function attack(figureOnTurn, target){
    if(Math.sqrt(Math.pow(Math.abs(figureOnTurn.x-target.x), 2)+Math.pow(Math.abs(figureOnTurn.y-target.y),2))>figureOnTurn.range) return false;

    target.hp -= figureOnTurn.dmg;
    return true;    
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
}