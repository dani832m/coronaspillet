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

/* Declare Game Variables */
let gamePiece, credits, level, background, levelUp, died, restart, bgMusic, gameOverSound, fanfareSound;
let obstacles = [];
let soundPlayed = false;
let fanfarePlayed = false;

/* Start Game */
const startGame = () => {
  /* Hide Main View */
  document.querySelector(".mainview").style.display = "none";

  /* Initialize Variables with Component and Sound Objects */
  gamePiece = new Component(40, 40, "./img/game-piece.png", 10, 120, "image");
  credits = new Component("15px", "Arial", "white", 300, 25, "text");
  level = new Component("15px", "Arial", "white", 410, 25, "text");
  levelUp = new Component("22px", "Arial", "white", 201, 140, "text");
  background = new Component(480, 270, "./img/background.png", 0, 0, "image");
  bgMusic = new Sound("./sounds/background-music.mp3");
  gameOverSound = new Sound("./sounds/game-over.wav");
  fanfareSound = new Sound("./sounds/fanfare.wav");

  /* Play Background Music */
  bgMusic.play();
  bgMusic.sound.setAttribute("loop", "none");

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
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);

    /* Append Canvas to Container */
    document.querySelector(".container").appendChild(this.canvas);

    /* Listen on Keys */
    window.addEventListener("keydown", e => {
      gameArea.keys = gameArea.keys || [];
      gameArea.keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", e => {
      gameArea.keys[e.keyCode] = false;
      gamePiece.image.src = "./img/game-piece.png";
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

/* Object Constructor for Components */
function Component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;

  /* Update */
  this.update = () => {
    ctx = gameArea.context;
    if (this.type == "text") {
      ctx.font = `bold ${this.width} ${this.height}`;
      ctx.strokeStyle = "rgb(0, 48, 87)";
      ctx.lineWidth = 5;
      ctx.strokeText(this.text, this.x, this.y);
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    if (type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  /* New Position */
  this.newPos = () => {
    this.x += this.speedX;
    this.y += this.speedY;
  };

  /* Crash */
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
  /* Declare Variables */
  let x, height, gap, minHeight, maxHeight, minGap, maxGap;

  /* Loop through Obstacles */
  for (i = 0; i < obstacles.length; i += 1) {
    /* If Game Piece crashes with Obstacles */
    if (gamePiece.crashWith(obstacles[i])) {
      died = new Component("22px", "Arial", "white", 100, 125, "text");
      restart = new Component("18px", "Arial", "white", 122, 160, "text");
      died.text = "Du smittede! Spillet er slut.";
      restart.text = "Tryk på 'R' for at prøve igen.";
      died.update();
      restart.update();
      bgMusic.stop();
      if (soundPlayed === false) {
        gameOverSound.play();
        soundPlayed = true;
      }
      /* If "R" Key is pressed */
      if (gameArea.keys && gameArea.keys[82]) {
        gameArea.stop();
        gameArea.clear();
        obstacles = [];
        soundPlayed = false;
        startGame();
      }
      return;
    }
  }

  /* Game Piece default Speed Coordinates */
  gamePiece.speedX = 0;
  gamePiece.speedY = 0;

  /* If Arrow Keys are pressed */
  if (gameArea.keys && gameArea.keys[37]) {
    /* If Position of Game Piece is inside of the Game Area */
    if (gamePiece.x - gamePiece.speedX > 0) {
      gamePiece.speedX = -1;
      gamePiece.image.src = "./img/game-piece-moved.png";
    }
  }
  if (gameArea.keys && gameArea.keys[39]) {
    if (gamePiece.x + gamePiece.width + gamePiece.speedX < gameArea.canvas.width) {
      gamePiece.speedX = 1;
      gamePiece.image.src = "./img/game-piece-moved.png";
    }
  }
  if (gameArea.keys && gameArea.keys[38]) {
    if (gamePiece.y - gamePiece.speedY > 0) {
      gamePiece.speedY = -1;
      gamePiece.image.src = "./img/game-piece-moved.png";
    }
  }
  if (gameArea.keys && gameArea.keys[40]) {
    if (gamePiece.y + gamePiece.height + gamePiece.speedY < gameArea.canvas.height) {
      gamePiece.speedY = 1;
      gamePiece.image.src = "./img/game-piece-moved.png";
    }
  }

  gameArea.frameNo += 1;
  if (gameArea.frameNo == 1 || everyInterval(150)) {
    x = gameArea.canvas.width;
    minHeight = 80;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    minGap = 55;
    maxGap = 120;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    obstacles.push(new Component(25, height, "./img/obstacles.png", x, 0, "image"));
    obstacles.push(new Component(25, x - height - gap, "./img/obstacles2.png", x, height + gap, "image"));
  }
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -1;
    obstacles[i].update();
  }

  /* Updates on level up */
  const updatesOnLvlUp = () => {
    background.update();
    for (let i = 0; i < obstacles.length; i += 1) {
      obstacles[i].update();
    }
    gamePiece.newPos();
    gamePiece.update();
    credits.update();
    level.update();
  };

  /* Handle shown Credits and Level */
  credits.text = `Credits: ${gameArea.frameNo}`;
  if (gameArea.frameNo < 1000) {
    level.text = "Level: 1";
  } else {
    level.text = `Level: ${(gameArea.frameNo / 2000).toFixed()}`;
  }

  /* Level 1 */
  if (gameArea.frameNo < 3000) {
    background.newPos();
    updatesOnLvlUp();
    if (gameArea.frameNo < 100) {
      levelUp.text = "Let's go";
      levelUp.update();
    }
  }

  /* Level 2 */
  if (gameArea.frameNo >= 3000 && gameArea.frameNo < 5000) {
    background = new Component(480, 270, "./img/background2.png", 0, 0, "image");
    updatesOnLvlUp();
    if (gameArea.frameNo >= 3000 && gameArea.frameNo < 3080) {
      levelUp.text = "Level 2";
      levelUp.update();
    }
  }

  /* Level 3 */
  if (gameArea.frameNo >= 5000 && gameArea.frameNo < 7000) {
    background = new Component(480, 270, "./img/background3.png", 0, 0, "image");
    updatesOnLvlUp();
    if (gameArea.frameNo >= 5000 && gameArea.frameNo < 5080) {
      levelUp.text = "Level 3";
      levelUp.update();
    }
  }

  /* Level 4 */
  if (gameArea.frameNo >= 7000 && gameArea.frameNo < 9000) {
    background = new Component(480, 270, "./img/background4.png", 0, 0, "image");
    updatesOnLvlUp();
    if (gameArea.frameNo >= 7000 && gameArea.frameNo < 7080) {
      levelUp.text = "Level 4";
      levelUp.update();
    }
  }

  /* Level 5 */
  if (gameArea.frameNo >= 9000 && gameArea.frameNo < 11000) {
    background = new Component(480, 270, "./img/background5.png", 0, 0, "image");
    updatesOnLvlUp();
    if (gameArea.frameNo >= 9000 && gameArea.frameNo < 9080) {
      levelUp.text = "Level 5";
      levelUp.update();
    }
  }

  /* Completed */
  if (gameArea.frameNo >= 11000) {
    background = new Component(480, 270, "./img/completed.png", 0, 0, "image");
    background.update();
    bgMusic.stop();
    /* Prevent Game Over text to be displayed */
    obstacles = [];
    if (fanfarePlayed === false) {
      fanfareSound.play();
      fanfarePlayed = true;
    }
  }
};

/* Object Constructor for Sounds */
function Sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";

  /* Append Audio to Container */
  document.querySelector(".container").appendChild(this.sound);

  /* Play Method */
  this.play = function() {
    this.sound.play();
  };

  /* Stop Method */
  this.stop = function() {
    this.sound.pause();
  };
}

const everyInterval = n => {
  if ((gameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
};
