var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

//Images
var bird = new Image();
var backGround = new Image();
var foreGround = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "Images\birdSprite.png";
backGround.src = "Images\FBbackground.png";
//foreGround.src = "Images\fg.png";
pipeNorth.src = "Images\FBTubeNorth.png";
//pipeSouth.src = "Images\pipeSouth.png";

// display images

function draw() {
  ctx.drawImage(backGround, 0, 0);
  ctx.drawImage(bird, 128, 128);
}

draw();