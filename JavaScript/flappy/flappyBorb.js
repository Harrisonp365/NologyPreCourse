const cvs = document.getElementById("FBCanvas");
const ctx = cvs.getContext("2d");

//Globals
let frames = 0;

//Images
const sprite = new Image();
sprite.src = "Images/sprite.png";

//Cutting out background image from sprite.png
const background = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }
}

//Cutting foreground from sprite.png
const foreGround = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }

}

function draw() {
  ctx.fillStyle = "#70c5ce"; //light blue
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  background.draw();
  foreGround.draw();
}

function update() {

}

function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
}

loop();