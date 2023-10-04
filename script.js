const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const color = "#33C7FF";
const scoreContainer = document.querySelector(".score");

//Canvas variables
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
//Ball variables
const ballRadius = 10;
let x = canvasWidth / 2;
let dx = 2;
let y = canvasHeight / 2;
let dy = 2;
//Paddle variables
let paddleWidth = 75;
let paddleHeight = 20;
let paddleX = canvasWidth - paddleWidth;
//Brick variables
let brickWidth = 75;
let brickHeight = 20;
let bricks = [];
let numberOfRows = 3;
let numberOfColumns = 5;
let brickPadding = 20;
let brickOffSetTop = 10;
let brickOffSetLeft = 10;

const checkBoundaryCollision = () => {
  //Checking ball collision
  if(x <= ballRadius || x + ballRadius >= canvasWidth){
    dx = -dx;
  }else if(y <= ballRadius){
    dy = -dy;
  }else if(y >= canvasHeight - paddleHeight){
    //Check if ball is in the range of paddle
    if(x > paddleX && x < paddleX + paddleWidth){
      dy = -dy;
    }else{
      handleGameOver();
    }
  }
}

const handleGameOver = () => {
  clearInterval(interval);
  alert("Game Over, your score is: " + getScore());
  window.location.reload();
}

const collisionDetection = () => {
  for(let row = 0; row < numberOfRows; row++){
    for(let col = 0; col < numberOfColumns; col++){
      const brick = bricks [row][col];
      //Brick must be alive
      if(brick.status && 
        x >= brick.x && 
        x <= brick.x + brickWidth &&
        y >= brick.y &&
        y <= brick.y + brickHeight){
          dy = -dy;
          brick.status = 0;
          updateScore();
      }
    }
  }
}

//Draw ball and paddle
const draw = () => {
  context.beginPath();
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.arc(x, y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.closePath();
  checkBoundaryCollision();
  drawPaddle();
  drawBricks();
  x+=dx;
  y+=dy;
  collisionDetection();
}

const drawPaddle = () => {
  context.beginPath();
  context.rect(paddleX, canvasHeight-paddleHeight, paddleWidth, paddleHeight);
  context.fillStyle = color;
  context.fill();
  context.closePath();
}

window.addEventListener("keydown", (e) => {
  //Moving Paddle to the left
  if(e.key == "Left" || e.key == "ArrowLeft"){
    //Checking paddle collision
    if(paddleX - 10 >= 0){
      paddleX -= 10;
    }
    //Moving Paddle to the right
  } else if(e.key == "Right" || e.key == "ArrowRight"){
    //Checking paddle collision
      if(paddleX + 10 + paddleWidth <= canvasWidth){
        paddleX += 10;
      }
  }
});

const generateBricks = () => {
  for(let row = 0; row < numberOfRows; row++){
    bricks[row] = [];
    for(let col = 0; col < numberOfColumns; col++){
      bricks[row][col] = {x: row, y: col, status: 1}; //If status is 1 the brick is alive
    }
  }
}

const drawBricks = () => {
  for(let row = 0; row < numberOfRows; row++){
    for(let col = 0; col < numberOfColumns; col++){
      const brick = bricks[row][col];
      const brickX = col * (brickWidth + brickPadding) + brickOffSetLeft;
      const brickY = row * (brickHeight + brickPadding) + brickOffSetTop;
      brick.x = brickX;
      brick.y = brickY;
      if(brick.status){
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight)
        context.fillStyle = color;
        context.fill();
        context.closePath();
      }
    }
  }
}

const getScore = () => {
  let score = 0;
  for(let row = 0; row < numberOfRows; row++){
    for(let col = 0; col < numberOfColumns; col++){
      const brick = bricks[row][col];
      if(brick.status === 0){
        score++;
      }
    }
  }
  return score;
}

const updateScore = () => {
  scoreContainer.textContent = `Score: ${getScore()}`;
}

generateBricks();

const interval = setInterval(draw, 20);