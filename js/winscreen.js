$(document).on("pagecreate", "#winScreen", function(){
    document.getElementById("winnerText").innerText = localStorage.winnerText;
    localStorage.clear();
    document.getElementById("video").play();
})

function newGame(){
    document.getElementById("video").pause();
    document.getElementById("video").currentTime = 0;
    $.mobile.navigate("#page1");
}