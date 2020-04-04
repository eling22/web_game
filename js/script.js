var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function isInRange(x, min, max) { return x > min && x < max; }
function loadImg(path) {
    var img = new Image();
    img.src = path;
    return img;
}

class Button {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height) / 2;
        this.checked = false;
        this.show = false;
        document.addEventListener("click", this, false);
    }
    handleEvent(e) {
        var mouse_x = e.clientX - canvas.offsetLeft;
        var mouse_y = e.clientY - canvas.offsetTop;
        switch (e.type) {
            case 'click':
                this.click(mouse_x, mouse_y);
                break;
        }
    }
    click(x, y) {
        if (this.show &&
            isInRange(x, this.x, this.x + this.width) &&
            isInRange(y, this.y, this.y + this.height)) {
            this.checked = !this.checked;
        }
    }
    draw() {
        this.show = true;
    }
}
class StartButton extends Button {
    constructor(width, height) {
        super(width, height);
    }
    draw() {
        this.show = true;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
        ctx.font = "25px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("START", this.x, this.y + 35);
    }
    click(x, y) {
        if (this.show &&
            isInRange(x, this.x, this.x + this.width) &&
            isInRange(y, this.y, this.y + this.height)) {
            this.checked = !this.checked;
            document.removeEventListener("click", this, false);
        }
    }
}
class PauseButton extends Button {
    constructor(width, height) {
        super(width, height);
        this.img = loadImg("img/pause.png");
        this.x = canvas.width - this.width;
        this.y = canvas.height - this.height;
        //this.play_img = loadImg("img/play.png");
    }
    draw() {
        this.show = true;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
class PlayButton extends Button {
    constructor(width, height) {
        super(width, height);
        this.img = loadImg("img/play.png");
    }
    draw() {
        this.show = true;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

function Game() {
    this.score = 0;
    this.live = 3;
    this.startButton = new StartButton(80, 50);
    this.pauseButton = new PauseButton(30, 30);
    this.playButton = new PlayButton(100, 100);
    this.clearCanvas = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.startButton.show = false;
        this.pauseButton.show = false;
        this.playButton.show = false;
    };
    this.drawScore = function () {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score:" + this.score, 8, 20);
    };
    this.drawLive = function () {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives:" + this.live, canvas.width-65, 20);
    };
    this.unpause = function () {
        if (this.playButton.checked) {
            this.pauseButton.checked = false;
            this.playButton.checked = false;
        }
    }
}
function Ball() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 50;
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
            bottom: this.y + this.dy + this.radius,
            x: this.x + this.dx,
            y: this.y + this.dy
        };
    };
    this.boundaryBounce = function () {
        var npos = this.nextPos();
        if (npos.left < 0 || npos.right > canvas.width) this.dx = -this.dx;
        if (npos.top < 0) this.dy = -this.dy;
    };
    this.collisionObject = function (obj_pos, ball_next_pos) {
        if (isInRange(ball_next_pos.x, obj_pos.x1, obj_pos.x2)) {
            if (isInRange(ball_next_pos.bottom, obj_pos.y1, obj_pos.y2) ||
                isInRange(ball_next_pos.top, obj_pos.y1, obj_pos.y2)) {
                this.dy = -this.dy;
                return true;
            }
        }
        if (isInRange(ball_next_pos.y, obj_pos.y1, obj_pos.y2)) {
            if (isInRange(ball_next_pos.left, obj_pos.x1, obj_pos.x2) ||
                isInRange(ball_next_pos.right, obj_pos.x1, obj_pos.x2)) {
                this.dx = -this.dx;
                return true;
            }
        }
        return false;
    };
    this.cancelButtonCollision = function (obj_pos, ball_next_pos) {
        if (isInRange(ball_next_pos.x, obj_pos.x1, obj_pos.x2) &&
            isInRange(ball_next_pos.top, obj_pos.y1, obj_pos.y2)) {
                this.dy = -this.dy;
        }
    }
    this.revival = function () {
        this.x = canvas.width / 2;
        this.y = canvas.height - 50;
        this.dx = 2;
        this.dy = -2;
    };
}
function Paddle() {
    this.width = 75;
    this.height = 10;
    this.offset_bottom = 30;
    this.x = canvas.width / 2;
    this.speed = 7;
    this.rightPress = false;
    this.leftPress = false;
    var halfwidth = this.width / 2;
    this.draw = function () {
        ctx.beginPath();
        var start_y = canvas.height - this.height - this.offset_bottom;
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
            y1: canvas.height - this.height - this.offset_bottom,
            y2: canvas.height - this.offset_bottom
        };
    };
    this.revival = function () {
        this.x = canvas.width / 2;
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
    this.bricks = [];
    for (var i = 0; i < this.col_count; i++) {
        this.bricks[i] = [];
        for (var j = 0; j < this.row_count; j++) {
            this.bricks[i][j] = { x1: 0, y1: 0, x2: 0, y2: 0, status: 1 };
            //status { 0: not exist, 1:exist} 
            this.bricks[i][j].x1 = this.offset_left + i * (this.width + this.padding);
            this.bricks[i][j].x2 = this.bricks[i][j].x1 + this.width;
            this.bricks[i][j].y1 = this.offset_top + j * (this.height + this.padding);
            this.bricks[i][j].y2 = this.bricks[i][j].y1 + this.height;
        }
    }
    this.draw = function () {
        for (var i = 0; i < this.col_count; i++) {
            for (var j = 0; j < this.row_count; j++) {
                if (this.bricks[i][j].status == 1) {
                    ctx.beginPath();
                    ctx.rect(this.bricks[i][j].x1, this.bricks[i][j].y1, this.width, this.height);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    };
}

var game = new Game();
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

document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    var mouse_x = e.clientX - canvas.offsetLeft;
    if (game.startButton.checked) {
        if (isInRange(mouse_x, paddle.width / 2, canvas.width - paddle.width / 2)) {
            paddle.x = mouse_x;
        }
    }   
}

gameOver = function () {
    var npos = ball.nextPos();
    if (npos.bottom > canvas.height) {
        game.live--;
        if (game.live == 0) {
            draw();
            alert("Game Over");
            document.location.reload();
            clearInterval(interval);
        } else {
            ball.revival();
            paddle.revival();
        }
    }
};
gameWin = function () {
    if (game.score == brick.row_count * brick.col_count) {
        draw();
        alert("You Win");
        document.location.reload();
        clearInterval(interval);
    }
};
collisionDetection = function () {
    var npos = ball.nextPos();
    //paddle
    var pos = paddle.getPos();
    ball.collisionObject(pos, npos);
    ball.cancelButtonCollision(pos, npos);
    //brick
    for (var i = 0; i < brick.col_count; i++) {
        for (var j = 0; j < brick.row_count; j++) {
            if (brick.bricks[i][j].status == 1) {
                var is_collision = ball.collisionObject(brick.bricks[i][j], npos);
                if (is_collision) {
                    brick.bricks[i][j].status = 0;
                    game.score++;
                }
            }
        }
    }
};

function draw() {
    game.clearCanvas();
    ball.draw();
    paddle.draw();
    brick.draw();
    game.drawScore();
    game.drawLive();
    game.pauseButton.draw();
}

function main() {
    if (!game.startButton.checked) {
        game.clearCanvas();
        game.startButton.draw();
    } else if (game.pauseButton.checked) {
        game.clearCanvas();
        game.playButton.draw();
        game.unpause();
    } else {
        draw();
        ball.move();
        paddle.move();
        ball.boundaryBounce();
        collisionDetection();
        gameOver();
        gameWin();
    }
}

var interval = setInterval(main, 10);