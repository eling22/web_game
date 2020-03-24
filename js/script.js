var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;
var dx = 2, dy = -2;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    x += dx; y += dy;
    //boundary
    if (x + dx - ballRadius < 0 || x + dx + ballRadius > canvas.width) dx = -dx;
    if (y + dy - ballRadius < 0 || y + dy + ballRadius > canvas.height) dy = -dy;
}

setInterval(draw, 10);