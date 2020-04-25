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
class AgainButton extends Button {
    constructor(width, height) {
        super(width, height);
        this.img = loadImg("img/again.png");
        this.y = this.y + 100;
    }
    draw() {
        this.show = true;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    click(x, y) {
        if (this.show &&
            isInRange(x, this.x, this.x + this.width) &&
            isInRange(y, this.y, this.y + this.height)) {
            this.checked = !this.checked;
            document.removeEventListener("click", this, false);
            document.location.reload();
            clearInterval(interval);
        }
    }
}

function Game() {
    this.score = 0;
    this.live = 3;
    //this.level = 1;
    this.is_start_shoot = false;
    this.is_game_win = false;
    this.is_game_over = false;
    this.startButton = new StartButton(80, 50);
    this.pauseButton = new PauseButton(30, 30);
    this.playButton = new PlayButton(100, 100);
    this.againButton = new AgainButton(80, 80);
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
        ctx.fillText("Lives:" + this.live, canvas.width - 65, 20);
    };
    this.drawLevel = function (level) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.textAlign = "center";
        ctx.fillText("Level - " + level.level, canvas.width / 2, 20);
        ctx.textAlign = "left";
    };
    this.drawGameWin = function () {
        this.show = true;
        let width = 60;
        let height = 50;
        let x = (canvas.width - width) / 2;
        let y = (canvas.height - height) / 2;
        ctx.font = "25px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("WIN", x, y + 35);
    };
    this.drawGameOver = function () {
        this.show = true;
        let width = 140;
        let height = 50;
        let x = (canvas.width - width) / 2;
        let y = (canvas.height - height) / 2;
        ctx.font = "25px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Game Over", x, y + 35);
    };
    this.unpause = function () {
        if (this.playButton.checked) {
            this.pauseButton.checked = false;
            this.playButton.checked = false;
        }
    };
    this.revival = function () {
        this.is_start_shoot = false;
    };
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
    this.drawRemindText = function () {
        //ctx.beginPath();
        ctx.font = "16px Arial";
        //ctx.textAlign = 'center';
        //ctx.textBaseline = 'middle';
        ctx.fillStyle = '#0095DD';
        var start_y = canvas.height - this.height - this.offset_bottom;
        ctx.fillText('Double Click', this.x - halfwidth, start_y + this.height+16);
        //ctx.closePath();
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
class Brick {
    constructor(map_data) {
        this.color = ["#FFFFFF", "#0095DD", "green"];
        this.bricks;
        this.createBricks(map_data.layers[0].objects);
    }
    createBricks(obj) {
        this.bricks = obj;
        for (var i = 0; i < this.bricks.length; i++) {
            this.bricks[i].level = this.bricks[i].properties[0].value;
            this.bricks[i].x1 = this.bricks[i].x;
            this.bricks[i].x2 = this.bricks[i].x + this.bricks[i].width;
            this.bricks[i].y1 = this.bricks[i].y;
            this.bricks[i].y2 = this.bricks[i].y + this.bricks[i].height;
        }
    }
    draw() {
        for (var i = 0; i < this.bricks.length; i++) {
            if (this.bricks[i].visible === true) {
                ctx.beginPath();
                ctx.rect(this.bricks[i].x, this.bricks[i].y, this.bricks[i].width, this.bricks[i].height);
                ctx.fillStyle = this.color[this.bricks[i].level];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    hitBrick(index) {
        this.bricks[index].level--;
        if (this.bricks[index].level === 0) this.bricks[index].visible = false;
    }
    isClear() {
        for (var i = 0; i < this.bricks.length; i++) {
            if (this.bricks[i].visible === true) return false;
        }
        return true;
    }
}
class Level {
    constructor(map_data) {
        this.level = 1;
        this.max_level = map_data.length;
        console.log(this.max_level);
        this.bricks = [];
        for (let i = 0; i < map_data.length; i++) {
            this.bricks.push(new Brick(map_data[i]));
        }
    }
    getBrick() {
        return this.bricks[this.level-1];
    }
    upBrickLevel() {
        this.level++;
        return this.bricks[this.level-1];
    }
    isMaxLevel() {
        return this.level === this.max_level;
    }
}


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

document.addEventListener("dblclick", mouseClickHandler, false);
function mouseClickHandler(e) {
    if (!game.is_start_shoot) {
        game.is_start_shoot = true;
    }
}

var game = new Game();
var ball = new Ball();
var paddle = new Paddle();
var level = new Level(map_data);
var brick = level.getBrick();

checkGameState = function () {
    //game win
    if (brick.isClear()) {
        if (level.isMaxLevel()) game.is_game_win = true;
        else {
            brick = level.upBrickLevel();
            ball.revival();
            paddle.revival();
            game.revival();
        }
    }
    //game over
    var npos = ball.nextPos();
    if (npos.bottom > canvas.height) {
        game.live--;
        if (game.live === 0) {
            game.is_game_over = true;
        } else {
            ball.revival();
            paddle.revival();
            game.revival();
        }
    }
};
collisionDetection = function () {
    var npos = ball.nextPos();
    //paddle
    var pos = paddle.getPos();
    ball.collisionObject(pos, npos);
    ball.cancelButtonCollision(pos, npos);
    //brick
    for (let i = 0; i < brick.bricks.length; i++) {
        if (brick.bricks[i].visible === true) {
            let is_collision = ball.collisionObject(brick.bricks[i], npos);
            if (is_collision) {
                brick.hitBrick(i);
                game.score++;
            }
        }
    }
};

class Stage {
    constructor() {
        this.frame = 10;
        this.handle;
    }
    startAnimate(callback) {
        this.handle = setInterval(callback, this.frame);
    }
    stopAnimate() {
        this.handle = clearInterval(this.handle);
    }
    startGame() {
        game.startButton.draw();
    }
    pauseGame() {
        game.playButton.draw();
        game.unpause();
    }
    gameWin() {
        game.drawGameWin();
        game.againButton.draw();
    }
    gameOver() {
        game.drawGameOver();
        game.againButton.draw();
    }
    gameRun() {
        ball.draw();
        paddle.draw();
        brick.draw();
        game.drawScore();
        game.drawLive();
        game.drawLevel(level);
        game.pauseButton.draw();
        ball.move();
        paddle.move();
        ball.boundaryBounce();
        collisionDetection();
        checkGameState();
    }
    beforeShoot() {
        ball.x = paddle.x;
        ball.draw();
        paddle.draw();
        brick.draw();
        game.drawScore();
        game.drawLive();
        game.drawLevel(level);
        game.pauseButton.draw();
        paddle.drawRemindText();
        paddle.move();
    }
    launch() {
        function main() {
            game.clearCanvas();
            if (!game.startButton.checked) this.startGame();
            else if (game.pauseButton.checked) this.pauseGame();
            else if (game.is_game_win) this.gameWin();
            else if (game.is_game_over) this.gameOver();
            else if (!game.is_start_shoot) this.beforeShoot();
            else this.gameRun();
        }
        stage.startAnimate(main.bind(this));
    }
}

var stage = new Stage();
stage.launch();