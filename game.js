var canvas, player1, player2;
var playerOnTurn;
var moved = false;
var attacked = false;

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

    player1.onTurn = 0;
    player2.onTurn = 0;
    playerOnTurn = player1;
    repaint();
}

// repaints canvas
function repaint() {
    var bg = new Image();
    bg.src = "src/playground.png";
    bg.onload = e => {
        canvas.drawImage(bg, 0, 0);
        
        player1.figures.forEach(x => {
            var img = new Image();
            img.src = "src/" + x.name + ".png";
            var coords = getCanvasCoords(x.x, x.y);
            img.onload = e => {
                canvas.drawImage(img, coords.x+10, coords.y+10);
                canvas.fillStyle = "red";
                canvas.font = "30px Arial";
                canvas.fillText(x.hp, coords.x+10, coords.y+110)
            }
        })

        player2.figures.forEach(x => {
            var img = new Image();
            img.src = "src/" + x.name + ".png";
            var coords = getCanvasCoords(x.x, x.y);
            img.onload = e => {
                canvas.drawImage(img, coords.x+10, coords.y+10);
                canvas.fillStyle = "red";
                canvas.font = "30px Arial";
                canvas.fillText(x.hp, coords.x+60, coords.y+40)
            }
        })

    }
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
    var figureOnTurn = playerOnTurn.figures[playerOnTurn.onTurn];
    var target;
    player1.forEach(x => {
        if(x.x == coords.x && x.y == cords.y){
            target = x;
        }
    })
    player2.forEach(x => {
        if(x.x == coords.x && x.y == coords.y){
            target = x;
        }
    })

    if(target == undefined){
        if(move(figureOnTurn, coords)){
            moved = true;
            repaint();
        }
        else return;
    }
}

function nextPlayer(){
    
}

// move to coords if enaugh speed
function move(figureOnTurn, coords){
    if(moved || Math.sqrt(Math.pow(Math.abs(figureOnTurn.x-coords.x), 2)+Math.pow(Math.abs(figureOnTurn.y-coords.y),2))>figureOnTurn.speed) return false;

    figureOnTurn.x = coords.x;
    figureOnTurn.y = coords.y;

    return true;
}