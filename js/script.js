var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function Ball() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.radius = 10;
    this.dx = 2;
    this.dy = -2;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };
    this.move = function () {
        this.x += this.dx;
        this.y += this.dy;
    };
    this.boundaryBounce = function (canvas) {
        if (this.x + this.dx - this.radius < 0 || this.x + this.dx + this.radius > canvas.width) this.dx = -this.dx;
        if (this.y + this.dy - this.radius < 0 || this.y + this.dy + this.radius > canvas.height) this.dy = -this.dy;
    };
}

function Paddle() {
    this.width = 75;
    this.height = 10;
    this.x = canvas.width / 2;
    this.speed = 7;
    this.rightPress = false;
    this.leftPress = false;

    var halfwidth = this.width / 2;

    this.draw = function () {
        ctx.beginPath();
        var start_y = canvas.height - this.height - 10;
        ctx.rect(this.x - halfwidth, start_y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    };
    this.move = function () {
        if (this.rightPress && (this.x + halfwidth + this.speed) < canvas.width) this.x += this.speed;
        if (this.leftPress && (this.x - halfwidth - this.speed) > 0) this.x -= this.speed;
        if (this.x + halfwidth > canvas.width) this.x = canvas.width - halfwidth;
        if (this.x - halfwidth < 0) this.x = halfwidth;
    };

}
var ball = new Ball();
var paddle = new Paddle();

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        paddle.rightPress = true;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
        paddle.leftPress = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        paddle.rightPress = false;
    }
    if (e.key == "Left" || e.key == "ArrowLeft") {
        paddle.leftPress = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();
    ball.move();
    paddle.move();
    ball.boundaryBounce(canvas);
}

setInterval(draw, 10);