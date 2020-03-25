/* Start Game on click */
document.querySelector(".play-game").addEventListener("click", () => {
  startGame();
});

/* Show Instructions on click */
document.querySelector(".show-instructions").addEventListener("click", () => {
  document.querySelector(".instructions").style.visibility = "visible";
});

/* Close Instructions on click */
document.querySelector(".close-instructions").addEventListener("click", () => {
  document.querySelector(".instructions").style.visibility = "hidden";
});

/* Show Groundwork on click */
document.querySelector(".show-groundwork").addEventListener("click", () => {
  document.querySelector(".groundwork").style.visibility = "visible";
});

/* Close Groundwork on click */
document.querySelector(".close-groundwork").addEventListener("click", () => {
  document.querySelector(".groundwork").style.visibility = "hidden";
});

/* Start Game function */
function startGame() {
  document.querySelector(".mainview").style.display = "none";
  gameArea.start();
}

/* Game Object */
var gameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.style.width = "480px";
    this.canvas.style.height = "270px";
    this.canvas.className = "gameview";
    this.context = this.canvas.getContext("2d");
    document.querySelector(".container").appendChild(this.canvas);
  }
};
