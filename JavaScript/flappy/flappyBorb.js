const cvs = document.getElementById("FBCanvas");
const ctx = cvs.getContext("2d");

//Globals
let frames = 0;

//Images
const sprite = new Image();
sprite.src = "Images/sprite.png";

//Game state
const state = {
  current: 0,
  ready: 0,
  game: 1,
  over: 2
};

cvs.addEventListener("click", function(evt){
  switch(state.current){
    case state.ready:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      state.current = state.ready;
      break;
  }
  //state was checked manually through state.current in browser console
});

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

//The bird has 3 images one for each animation up, middle, down
const bird = {
  animation : [
    {sX: 276, sY: 112},
    {sX: 276, sY: 139},
    {sX: 276, sY: 164},
    {sX: 276, sY: 139}
  ],
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  frame: 0,

  draw : function() {
    let bird = this.animation[this.frame];

    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  },

  flap : function() {

  },

  update : function() {
    //ready state = slow flap in game = fast flap
    this.period = state.current == state.ready ? 10 : 5;
    this.frame += frames%this.period == 0 ? 1 : 0; //incriment frame by 1 each period
    this.frame = this.frame%this.animation.length;
  }
}

//Ready message
const ready = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width/2 - 173/2,
  y: 80,

  draw : function() {
    if(state.current == state.ready) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
}

//Game over
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width/2 - 225/2,
  y: 90,

  draw : function() {
    if(state.current == state.over) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    } 
  }
}

function draw() {
  ctx.fillStyle = "#70c5ce"; //light blue
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  background.draw();
  foreGround.draw();
  bird.draw();
  ready.draw();
  gameOver.draw();
}

function update() {
  bird.update();
}

function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
}

loop();