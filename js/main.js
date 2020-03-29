/* Start Game on Click */
document.querySelector(".play-game").addEventListener("click", () => {
  startGame();
});

/* Show Instructions on Click */
document.querySelector(".show-instructions").addEventListener("click", () => {
  document.querySelector(".instructions").style.visibility = "visible";
});

/* Close Instructions on Click */
document.querySelector(".close-instructions").addEventListener("click", () => {
  document.querySelector(".instructions").style.visibility = "hidden";
});

/* Show Groundwork on Click */
document.querySelector(".show-groundwork").addEventListener("click", () => {
  document.querySelector(".groundwork").style.visibility = "visible";
});

/* Close Groundwork on Click */
document.querySelector(".close-groundwork").addEventListener("click", () => {
  document.querySelector(".groundwork").style.visibility = "hidden";
});

/* Declare Game Piece Variable */
let gamePiece;

/* Declare Obstacles as an Array */
const obstacles = [];

/* Declare Score Variable */
let score;

/* Start Game */
const startGame = () => {
  /* Hide Main View */
  document.querySelector(".mainview").style.display = "none";

  /* Initialize Variables with Component Objects */
  gamePiece = new Component(30, 30, "red", 10, 120);
  score = new Component("20px", "Arial", "black", 350, 30, "text");

  /* Call Start Method on Game Area */
  gameArea.start();
};

/* Game Object */
const gameArea = {
  canvas: document.createElement("canvas"),

  /* Start Method */
  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.canvas.className = "gameview";
    this.context = this.canvas.getContext("2d");
    document.querySelector(".container").appendChild(this.canvas);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", e => {
      gameArea.keys = gameArea.keys || [];
      gameArea.keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", e => {
      gameArea.keys[e.keyCode] = false;
    });
  },

  /* Clear Method */
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /* Stop Method */
  stop: function() {
    clearInterval(this.interval);
  }
};

/* Object Constructor */
function Component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = () => {
    ctx = gameArea.context;
    if (this.type == "text") {
      ctx.font = `${this.width} ${this.height}`;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = () => {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  this.crashWith = otherobj => {
    const myleft = this.x;
    const myright = this.x + this.width;
    const mytop = this.y;
    const mybottom = this.y + this.height;
    const otherleft = otherobj.x;
    const otherright = otherobj.x + otherobj.width;
    const othertop = otherobj.y;
    const otherbottom = otherobj.y + otherobj.height;
    let crash = true;
    if (mybottom < othertop || mytop > otherbottom || myright < otherleft || myleft > otherright) {
      crash = false;
    }
    return crash;
  };
}

/* Update Game Area */
const updateGameArea = () => {
  let x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < obstacles.length; i += 1) {
    if (gamePiece.crashWith(obstacles[i])) {
      gameArea.stop();
      return;
    }
  }
  gameArea.clear();
  gamePiece.speedX = 0;
  gamePiece.speedY = 0;
  if (gameArea.keys && gameArea.keys[37]) {
    gamePiece.speedX = -1;
  }
  if (gameArea.keys && gameArea.keys[39]) {
    gamePiece.speedX = 1;
  }
  if (gameArea.keys && gameArea.keys[38]) {
    gamePiece.speedY = -1;
  }
  if (gameArea.keys && gameArea.keys[40]) {
    gamePiece.speedY = 1;
  }
  gameArea.frameNo += 1;
  if (gameArea.frameNo == 1 || everyInterval(150)) {
    x = gameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    obstacles.push(new Component(10, height, "green", x, 0));
    obstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
  }
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -1;
    obstacles[i].update();
  }
  score.text = `Credits: ${gameArea.frameNo}`;
  score.update();
  gamePiece.newPos();
  gamePiece.update();
};

function everyInterval(n) {
  if ((gameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
