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
    this.nextPos = function () {
        return {
            left: this.x + this.dx - this.radius,
            right: this.x + this.dx + this.radius,
            top: this.y + this.dy - this.radius,
            bottom: this.y + this.dy + this.radius
        };
    };
    this.boundaryBounce = function (canvas) {
        var npos = this.nextPos();
        if (npos.left < 0 || npos.right > canvas.width) this.dx = -this.dx;
        if (npos.top < 0) this.dy = -this.dy;
    };
    this.gameOver = function () {
        var npos = this.nextPos();
        if (npos.bottom > canvas.height) {
            alert("Game Over");
            document.location.reload();
            clearInterval(interval);
        }
    };
    this.collision = function (paddle) {
        var pos = paddle.getPos();
        var npos = this.nextPos();
        if (npos.bottom > pos.y1 && this.x > pos.x1 && this.x < pos.x2) this.dy = -this.dy;
        //console.log()
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
    this.getPos = function () {
        return {
            x1: this.x - halfwidth,
            x2: this.x + halfwidth,
            y1: canvas.height - this.height - 10,
            y2: canvas.height - 10
        };
    };

}
function Brick() {
    this.width = 75;
    this.height = 20;
    this.row_count = 3;
    this.col_count = 5;
    this.padding = 10;
    this.offset_top = 30;
    this.offset_left = 30;
    var bricks = [];
    for (var i = 0; i < this.col_count; i++) {
        bricks[i] = [];
        for (var j = 0; j < this.row_count; j++) {
            bricks[i][j] = { x: 0, y: 0 };
        }
    }
    this.draw = function () {
        for (var i = 0; i < this.col_count; i++) {
            for (var j = 0; j < this.row_count; j++) {
                bricks[i][j].x = this.offset_left + i * (this.width + this.padding);
                bricks[i][j].y = this.offset_top + j * (this.height + this.padding);
                ctx.beginPath();
                ctx.rect(bricks[i][j].x, bricks[i][j].y, this.width, this.height);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
        ctx.beginPath();
        //ctx.rect(this.x - halfwidth, start_y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        //ctx.fill();
        ctx.closePath();
    };
}

var ball = new Ball();
var paddle = new Paddle();
var brick = new Brick();

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
    brick.draw();
    ball.move();
    paddle.move();
    ball.boundaryBounce(canvas);
    ball.collision(paddle);
    ball.gameOver();
}

var interval = setInterval(draw, 10);