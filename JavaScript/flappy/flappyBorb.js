const cvs = document.getElementById("FBCanvas");
const ctx = cvs.getContext("2d");

//Globals
let frames = 0;
const degree = Math.PI/180;

//Images
const sprite = new Image();
sprite.src = "Images/sprite.png";

const startBtn = {
  x: 120,
  y:263,
  w:83,
  h: 29
}

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
      let rect = cvs.getBoundingClientRect();
      let evntX = evt.clientX - rect.left;
      let evntY = evt.clientY - rect.top;

      if(evntX >= startBtn.x && evntX <= startBtn.x + startBtn.w 
        && evntY >= startBtn.y && evntY <= startBtn.y + startBtn.h) {
          pipes.reset();
          bird.resetSpeed();
          score.reset();
          state.current = state.ready;
        }
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
  dx: 2,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  },
  //moving the foreground to the left to make feel like moving forward
  update: function() {
    if(state.current == state.game) {
      this.x = (this.x - this.dx) % (this.w/2);
    }
  }

}
//Cutting pipes from sprite.png & collision
const pipes = {
  position: [],
  top: {
    sX: 552,
    sY: 0
  },
  bottom: {
    sX: 502,
    sY: 0
  },
  w: 53,
  h: 400,
  gap: 85,
  maxYPos: -150,
  dx: 2,

  update:function() {
    if(state.current !== state.game) return;

    if(frames%100 == 0) {
      this.position.push({
        x:cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      p.x -= this.dx;

      //collision
      let bottomPipeYpos = p.y + this.h + this.gap;
      //collision top 
      if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w
        && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
          state.current = state.over;
      }

      //collision bot
      if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w
        && bird.y + bird.radius > bottomPipeYpos && bird.y - bird.radius < bottomPipeYpos + this.h) {
          state.current = state.over;
      }

      //remove pipes from array after once passed
      if(p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },

  draw:function(){
    for(let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;
      //top
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
      //bot
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
    }
  },
  reset : function() {
    this.position = [];
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
  gravity: 0.25,
  jump: 4.5,
  speed: 0,
  rotation : 0,
  radius: 10,

  draw : function() {
    let bird = this.animation[this.frame];
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
    ctx.restore();
  },

  flap : function() {
    this.speed = - this.jump;
  },

  update : function() {
    //ready state = slow flap in game = fast flap
    this.period = state.current == state.ready ? 10 : 5;
    this.frame += frames%this.period == 0 ? 1 : 0; //incriment frame by 1 each period
    this.frame = this.frame%this.animation.length;

    if(state.current == state.ready) {
      this.y = 150; //reset pos
      this.rotation = 0 * degree;
    } else { 
      this.speed += this.gravity;
      this.y += this.speed;

      if(this.y + this.h/2 >= cvs.height - foreGround.h) {
        this.y = cvs.height - foreGround.h - this.h/2;
        if(state.current == state.game) {
          state.current = state.over;
        }
      }

      if(this.speed >= this.jump){
        this.rotation = 90 * degree; //bird falling
        this.frame = 1; //hits ground stops moving
      } else {
        this.rotation = -25 * degree; //bird jumping
      }
    }
  },
  resetSpeed : function() {
    this.speed = 0;
  }
}

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

const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,

  draw : function() {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";

    if(state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "34px Teko";
      ctx.fillText(this.value, cvs.width/2, 50);
      ctx.strokeText(this.value, cvs.width/2, 50);

    } else if(state.current == state.over) {
      //most recent score
      ctx.font = "24px Teko";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      //best score
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },

  reset : function() {
    this.value = 0;
  }
}

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
  pipes.draw();
  foreGround.draw();
  bird.draw();
  ready.draw();
  gameOver.draw();
  score.draw();
}

function update() {
  bird.update();
  foreGround.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
}

loop();