var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

let timer = 0;

var aster = [];
// aster.push({
//     sprite: "",
//     x: 0,
//     y: 300,
//     dx: 10,
//     dy: 12
// });

var fires = [];
var booms = [];

var enemies = ["Portraits2_27.png", "Portraits2_20.png", "Portraits2_21.png", 
            "Portraits2_16.png", "Portraits2_15.png", "Portraits2_10.png", "Portraits2_04.png"];

var player={x:300, y:300, animx: 0, animy: 0};
var playerimg = new Image();
playerimg.src = 'Portraits2_13.png'

var boomimg = new Image();
boomimg.src = 'boom2048.png';

var bg = new Image();
bg.src = 'bg.jpg';

var fireimg = new Image();
fireimg.src = 'Rocket_Effect_01.png';

// var rock = new Image();
// rock.src = 'Portraits2_20.png';

canvas.addEventListener("mousemove", function(event) {
    player.x = event.offsetX;
    player.y = event.offsetY;
});

bg.onload = () => {
    game();
}

function render() {
    context.drawImage(bg, 0, 0, 600, 700);
    context.drawImage(playerimg, player.x, player.y);

    for(i in fires) context.drawImage(fireimg, fires[i].x, fires[i].y, 10, 20);

    for(i in aster) context.drawImage(aster[i].sprite, aster[i].x, aster[i].y, 40, 40);

    for(i in booms) context.drawImage(boomimg, 256*Math.floor(booms[i].animx), 256*Math.floor(booms[i].animy), 256, 256, booms[i].x, booms[i].y, 130, 130);
}

function update() {
    timer++;
    if(timer%20==0) {
        var sprite = new Image();
        sprite.src = enemies[Math.floor(Math.random() * enemies.length)];
        aster.push({
            sprite: sprite,
            x: Math.random()*500,
            y: -50,
            dx: Math.random()*2-1,
            dy: Math.random()*2+4,
            del: 0
        });
    }

    if(timer % 30 == 0) {
        fires.push({x: player.x+10, y: player.y-10, dx: 0, dy: -5});
        fires.push({x: player.x+10, y: player.y-10, dx: 0.5, dy: -5});
        fires.push({x: player.x+10, y: player.y-10, dx: -0.5, dy: -5});
    }

    for(i in fires){
        fires[i].x = fires[i].x + fires[i].dx;
        fires[i].y = fires[i].y + fires[i].dy;

        if(fires[i].y < -20) fires.splice(i, 1); 
    }

    for(i in booms){
        booms[i].animx = booms[i].animx+0.2;
        if(booms[i].animx>8) {booms[i].animy++; booms[i].animx = 0}
        if(booms[i].animx>6) booms.splice(i,1);
    }

    for(i in aster){
        aster[i].x=aster[i].x+aster[i].dx;
        aster[i].y=aster[i].y+aster[i].dy;

        //if(aster[i].x >= 600 - 40 || aster[i].x < 0) aster[i].dx = -aster[i].dx;
        if(aster[i].y >= 700 - 40) aster.splice(i,1);

        for(j in fires) {
            if(Math.abs(aster[i].x - fires[j].x) < 30 && Math.abs(aster[i].y+20 - fires[j].y) <= 20) {
                //collision
                console.log("Collised", aster[i], fires[j]);

                booms.push({x: aster[i].x-20, y: aster[i].y-20, animx: 0, animy: 0});

                aster[i].del = 1;
                fires.splice(j,1);
                break;
            }
        }

        if(aster[i].del == 1) aster.splice(i,1);
    }
}

function game() {
    update();
    render();
    requestAnimFrame(game);
}

var requestAnimFrame = function() {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000/20);
            }
}();