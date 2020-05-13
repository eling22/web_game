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
class MapInfo {
    constructor(map_data) {
        this.level = 1;
        this.max_level = map_data.length;
        this.bricks = [];
        for (let i = 0; i < map_data.length; i++) {
            this.bricks.push(new Brick(map_data[i]));
        }
    }
    getBrick() {
        return this.bricks[this.level - 1];
    }
    upBrickLevel() {
        this.level++;
        return this.bricks[this.level - 1];
    }
    isMaxLevel() {
        return this.level === this.max_level;
    }
}

function Game() {
    let score = 0;
    let lives = 3;
    this.map = new MapInfo(map_data);
    this.brick = this.map.getBrick();
    this.is_start_shoot = false;
    this.is_game_win = false;
    this.is_game_over = false;

    document.addEventListener("mousemove", this, false);
    document.addEventListener("dblclick", this, false);
    document.addEventListener("mousedown", this, false);
    document.addEventListener("mouseup", this, false);

    let drawScore = function () {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score:" + score, 8, 20);
    };
    let drawLive = function () {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives:" + lives, canvas.width - 65, 20);
    };
    let drawLevel = function () {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.textAlign = "center";
        ctx.fillText("Level - " + game.map.level, canvas.width / 2, 20);
        ctx.textAlign = "left";
    };

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
    this.drawMainSceen = function(){
        drawScore();
        drawLive();
        drawLevel();
        this.brick.draw();
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
    this.isMaxLevel = function () {
        return this.map.isMaxLevel();
    };
    this.upBrickLevel = function () {
        this.brick = this.map.upBrickLevel();
    };
    this.isBrickClear = function () {
        return this.brick.isClear();
    };
    this.addScore = function () {
        score++;
    };
    this.decreaseLives = function () {
        lives--;
    };
    this.isNoLives = function () {
        return lives === 0;
    };
    this.isGameRunning = function () {
        let is_game_run = game.startButton.checked
            && !game.pauseButton.checked
            && !game.is_game_win
            && !game.is_game_over
            && game.is_start_shoot;
        //console.log(is_game_run);
        return is_game_run;
    };
    this.handleEvent = function (e) {
        switch (e.type) {
            case 'mousemove':
                this.mouseMoveHandler(e);
                break;
            case 'dblclick':
                this.mouseClickHandler(e);
                break;
            case 'mousedown':
                this.mouseDownHandle(e);
                break;
            case 'mouseup':
                this.mouseUpHandle(e);
                break;
        }
    };
    this.mouseMoveHandler = function (e) {
        var mouse_x = e.clientX - canvas.offsetLeft;
        if (game.startButton.checked) {
            if (isInRange(mouse_x, paddle.width / 2, canvas.width - paddle.width / 2)) {
                paddle.x = mouse_x;
            }
        }
    };
    this.mouseClickHandler = function(e) {
        if (!game.is_start_shoot) {
            game.is_start_shoot = true;
        }
    };
    this.mouseDownHandle = function (e) {
        if (game.isGameRunning() && !paddle.isClickDown()) {
            paddle.clickDown();
        }
    };
    this.mouseUpHandle = function (e) {
        if (game.isGameRunning() && paddle.isClickDown()) {
            paddle.clickUp();
        }
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
    this.is_click_down = false;
    this.click_down_offset = 10;
    this.x = canvas.width / 2;
    this.speed = 7;
    this.rightPress = false;
    this.leftPress = false;
    var halfwidth = this.width / 2;
    document.addEventListener("keydown", this, false);
    document.addEventListener("keyup", this, false);

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
    this.isClickDown = function () {
        return this.is_click_down === true;
    };
    this.clickDown = function () {
        this.is_click_down = true;
        this.offset_bottom -= this.click_down_offset;
    };
    this.clickUp = function () {
        this.is_click_down = false;
        this.offset_bottom += this.click_down_offset;
    };
    this.handleEvent = function (e) {
        switch (e.type) {
            case 'keydown':
                this.keyDownHandler(e);
                break;
            case 'keyup':
                this.keyUpHandler(e);
                break;
        }
    };
    this.keyDownHandler = function (e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            paddle.rightPress = true;
        }
        if (e.key == "Left" || e.key == "ArrowLeft") {
            paddle.leftPress = true;
        }
    };
    this.keyUpHandler = function (e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            paddle.rightPress = false;
        }
        if (e.key == "Left" || e.key == "ArrowLeft") {
            paddle.leftPress = false;
        }
    };
}

var game = new Game();
var ball = new Ball();
var paddle = new Paddle();

checkGameState = function () {
    //game win
    if (game.isBrickClear()) {
        if (game.isMaxLevel()) game.is_game_win = true;
        else {
            game.upBrickLevel();
            ball.revival();
            paddle.revival();
            game.revival();
        }
    }
    //game over
    var npos = ball.nextPos();
    if (npos.bottom > canvas.height) {
        game.decreaseLives();
        if (game.isNoLives()) {
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
    let brick = game.brick;
    for (let i = 0; i < brick.bricks.length; i++) {
        if (brick.bricks[i].visible === true) {
            let is_collision = ball.collisionObject(brick.bricks[i], npos);
            if (is_collision) {
                brick.hitBrick(i);
                game.addScore();
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
        game.drawMainSceen();
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
        game.drawMainSceen();
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
//stage.launch();

class State {
    handle() {}
}
class StartState extends State {
    constructor(game_stage) {
        super();
        this.game_stage = game_stage;
    }
    handle() {
        console.log("start stage");
        stage.startGame();
        if (game.startButton.checked) {
            this.game_stage.setState(this.game_stage.win_state);
        }
    }
}

class WinState extends State {
    constructor(game_stage) {
        super();
        this.game_stage = game_stage;
    }
    handle() {
        console.log("win stage");
        stage.gameWin();
        if (game.againButton.checked) {
            this.game_stage.setState(this.game_stage.start_state);
        }
    }
}

class GameStage {
    constructor(){

        this.start_state = new StartState(this);
        this.win_state = new WinState(this);

        this.frame = 10;
        this.handle;
        this.state = this.start_state;
    }
    setState(st) {
        this.state = st;
    }
    getState() {
        return this.state;
    }
    Run() {
        this.state.handle();
    }
    startAnimate(callback) {
        this.handle = setInterval(callback, this.frame);
    }
    launch() {
        function main() {
            game.clearCanvas();
            this.Run();
        }
        this.startAnimate(main.bind(this));
    }
}

game_state = new GameStage();
game_state.launch();
