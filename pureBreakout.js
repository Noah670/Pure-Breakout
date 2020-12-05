var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10;

var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 3;
var dy = -3;

var rightPressed = false;
var leftPressed = false;

// paddle variables
var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width - paddleWidth) / 2;

// brick variables
var brickRowCount = 10;
var brickColumnCount = 15;
var brickWidth = 70;
var brickHeight = 40;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// score keeping
var highScore = 0;
var playerLives = 3;

// get random brick colors
var red = Math.floor(Math.random() * 255);
var green = Math.floor(Math.random() * 255);
var blue = Math.floor(Math.random() * 255);

var hex;
var color = chColor();

// audio settings
var myAudio = document.createElement("audio");
myAudio.src = "/assets/arcadeTune.mp3";


function getRandomColour() {
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);

    return "rgb(" + red + "," + green + "," + blue + " )";
}

let randomBrickColor = getRandomColour();

function chColor() {
    hex = Math.floor(Math.random() * 1000000) + 1;
    color = "" + "#" + hex + "";
    return color;
}

// array storing the bricks
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// draw functions

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();



    // change the color of the ball
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        color = chColor();
        ctx.fillStyle = color;
        //dx = -dx;
    }
    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        color = chColor();
        ctx.fillStyle = color;
        //dy = -dy;
    }


}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    //ctx.fillStyle = "rgb(126, 122, 122);";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = randomBrickColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            playerLives--;
            if (!playerLives) {
                alert("You Lose Game Over !");
                document.location.reload();
            } else {
                // reset ball positon
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed) {
        paddleX += 20;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= 20;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

// controls

document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// collision detection
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var brickDetection = bricks[c][r];

            if (brickDetection.status == 1) {
                if (
                    x > brickDetection.x &&
                    x < brickDetection.x + brickWidth &&
                    y > brickDetection.y &&
                    y < brickDetection.y + brickHeight
                ) {
                    dy = -dy;
                    brickDetection.status = 0;
                    highScore += 100;
                    // player breaks all bricks
                    if (highScore >= 15000) {
                        alert(
                            "Congrats you have beaten Pure Breakout with a highscore of " +
                            highScore +
                            " !"
                        );
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "22px Roboto";
    ctx.fillStyle = "#000000";
    ctx.fillText("High Score:" + highScore, 550, 20);
}

function drawLives() {
    ctx.font = "22px Roboto";
    ctx.fillStyle = "#000000";
    ctx.fillText("Lives: " + playerLives, canvas.width - 90, 20);
}

// dark mode
function applyTheme(theme) {
    document.body.classList.remove("theme-auto", "theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#theme").addEventListener("change", function() {
        applyTheme(this.value);
    });
});

// local storage for the users theme choice
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "auto";

    applyTheme(savedTheme);

    for (const optionElement of document.querySelectorAll("#theme option")) {
        optionElement.selected = savedTheme === optionElement.value;
    }

    document.querySelector("#theme").addEventListener("change", function() {
        localStorage.setItem("theme", this.value);
        applyTheme(this.value);
    });
});



document
    .querySelector(".toggleButton")
    .addEventListener("click", toggleDarKMode);

function toggleDarKMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}



draw();