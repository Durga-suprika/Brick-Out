let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let gameStarted = false;
let brickRowCount = 6;
let brickColumnCount = 7;
let brickPadding = 6;
let brickOffsetTop = 70;
let brickOffsetLeft = 12.5;
let brickWidth = 70;
let brickHeight = 26;
let paddleWidth = 150;
let paddleHeight = 30;
let paddleXposition = ((canvas.width - paddleWidth) / 2);
let paddleYposition = canvas.height - 60;
let paddleSpeed = 20;
let ballRadius = 15;
let ballXposition = canvas.width / 2;
let ballYposition = paddleYposition - ballRadius;
let ballSpeed = 2;
let ballX = 5;
let ballY = 5;
let brickCount = brickRowCount * brickColumnCount;
let score = 0;
let life = 3;

// to display score
function drawScore() {
    ctx.font = "18px itlaic serif";
    ctx.fillStyle = "red";
    ctx.fillText("Score: " + score, 8, 20);
}
//to display gamename
function gameName() {
    ctx.font = '40px bold serif';
    ctx.fillStyle = "blue"
    ctx.fillText("BRICK OUT", canvas.width / 3, 40);

}
//to display lifes
function lifes() {
    ctx.font = "18px serif";
    ctx.fillStyle = "#4B0082";
    ctx.fillText("Lifes: " + life, canvas.width - 61, 20);
}
// bricks
let bricks = [];
for (let r = 0; r < brickRowCount; r++) {
    bricks[r] = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[r][c] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}
//to draw bricks
function drawBricks() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            if (bricks[r][c].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.beginPath();
                ctx.fillStyle = "#FF6347";
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.lineWidth = 7;
                ctx.stroke();
                // ctx.strokeStyle = "black"
                ctx.fill();
                // ctx.closePath();
            }
        }
    }
}
//to draw paddle
function paddle() {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.rect(paddleXposition, paddleYposition, paddleWidth, paddleHeight);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fill();
}
//to draw ball
function ball() {
    ctx.beginPath();
    ctx.fillStyle = "brown";
    ctx.arc(ballXposition, ballYposition, ballRadius, 0, Math.PI * 2);
    ctx.fill();
    //start condition
    if (gameStarted == false) {
        ballXposition = paddleXposition + paddleWidth / 2;
    }
    else {
        moveBall();
    }
}

//checking bricks and ball collision
//updating score
//breaking the brick when ball hit
function collisionDetection() {
    for (let r = 0; r < brickRowCount; r++) {
        for (let c = 0; c < brickColumnCount; c++) {
            let b = bricks[r][c];
            let brickTop = b.y;
            let brickBottom = b.y + brickHeight;
            let brickLeft = b.x;
            let brickRight = b.x + brickWidth;
            let ballTop = ballYposition - ballRadius;
            let ballbottom = ballYposition + ballRadius;
            let ballLeft = ballXposition - ballRadius;
            let ballRight = ballXposition + ballRadius;
            if (b.status == 1) {
                if (ballbottom > brickTop && ballTop < brickBottom && ballLeft < brickRight && ballRight > brickLeft) {
                    // if (ballXposition > b.x && ballXposition < b.x + brickWidth && ballYposition > b.y && ballYposition < b.y + brickHeight) {
                    b.status = 0;
                    console.log(brickCount--);
                    console.log(score += 5);
                    ballY *= -1;
                }

            }
        }
    }

}
//to move ball between the boundaries
//checking game over condition
function moveBall() {
    let ballTop = ballYposition - ballRadius;
    let ballBottom = ballYposition + ballRadius;
    let ballLeft = ballXposition - ballRadius;
    let ballRight = ballXposition + ballRadius;
    let paddleTop = paddleYposition;
    let paddleLeft = paddleXposition;
    let paddleRight = paddleXposition + paddleWidth;

    if (ballRight > canvas.width || ballLeft < 0) {
        ballX *= -1;
    }
    else if (ballTop < 0) {
        ballY *= -1;
    }
    if (ballBottom > canvas.height || ballBottom > paddleTop) {
        if (ballRight > paddleLeft && ballLeft < paddleRight) {
            ballY *= -1;
        }
        else {
            gameOver();
        }
    }
    ballXposition = ballXposition + ballX;
    ballYposition = ballYposition + ballY;
}

//If bricks then wingame
function winGame() {
    if (brickCount == 0) {
        console.log(score)
        ctx.font = "30px Verdana";
        ctx.fillStyle = "darkgreen"
        ctx.fillText("YOU WON!!!!", canvas.width / 3, canvas.height / 2);
        document.removeEventListener("keydown", keyDownHandler);
        clearInterval(interval);
    }
}
function gameOver() {
    //if no lifes available gameover
    life--;
    if (!life) {
        // ballYposition = canvas.height - ballYposition+ ballRadius
        // ballY = 0;
        // ballX = 0;
        ctx.font = "30px Verdana";
        ctx.fillStyle = "red"
        ctx.fillText('GAME OVER', canvas.width / 3, canvas.height / 2);
        clearInterval(interval);
        document.removeEventListener("keydown", keyDownHandler);
        // document.location.reload()
        
    }
    //if lifes are available reset the game
    else {
        reset();
    }
}
//reset function if lifes are available
function reset() {
    ballXposition = canvas.width / 2;
    ballYposition = paddleYposition - ballRadius;
    paddleXposition = ((canvas.width - paddleWidth) / 2);
    ballX = 5;
    ballY = 5;
}
//moving the paddle either leftside or rightside accordingly
function keyDownHandler(event) {
    //To move left
    if (event.keyCode == 37) {
        if (paddleXposition <= 0) {
            paddleXposition = 0;
        }
        else {
            paddleXposition = paddleXposition - paddleSpeed;
        }
    }
    //To move right
    else if (event.keyCode == 39) {
        if (paddleXposition >= canvas.width - paddleWidth) {
            paddleXposition = canvas.width - paddleWidth;
        }
        else {
            paddleXposition = paddleXposition + paddleSpeed
        }
    }
    if (event.keyCode == 38) {
        gameStarted = true;
    }
}
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    gameName();
    lifes();
    drawBricks()
    ball();
    paddle();
   
    winGame()    
    collisionDetection();
}

document.addEventListener("keydown", keyDownHandler);
let interval = setInterval(drawBoard, 20);
