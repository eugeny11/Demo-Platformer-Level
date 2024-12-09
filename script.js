//HERO

let heroImg = window.document.querySelector("#hero-img");
let imgBlock = window.document.querySelector("#img-block");
let rightPosition = 0;
let imgBlockPosition = 0;
let direction = "right";

let tileSize = 32;

let jumpBlock = window.document.querySelector("#jump-block");
let hitBlock = window.document.querySelector("#hit-block");

let targetPositionX = null;
let isMoving = false;

let heroX = Math.floor(
  (Number.parseInt(window.getComputedStyle(imgBlock).left) + 32) / 32
);
let heroY = Math.floor(
  Number.parseInt(window.getComputedStyle(imgBlock).bottom) / 32
);

let heroStep = 1.5;

let hit = false;
let jump = false;
let fall = false;

let maxLives = 6;
let lives = 6;

let isLeftSideBlocked = false;
let isRightSideBlocked = false;
let wasHeroHit = false;

let isWallRight = false;
let isWallLeft = false;

let canvas = window.document.querySelector("#canvas");
let fsBtn = window.document.querySelector("#fsBtn");
let info = window.document.querySelector("#info");
let restartBtn = window.document.querySelector("#restartBtn");

let backgroundCanvas = window.document.querySelector("#background-canvas");

let timer = 0;
let x = 0;
let halfWidth = window.innerWidth / 2;

const updateHeroXY = () => {
  heroX = Math.ceil(
    (Number.parseInt(window.getComputedStyle(imgBlock).left) + 32) / 32
  );
  heroY = Math.ceil(
    Number.parseInt(window.getComputedStyle(imgBlock).bottom) / 32
  );
};

const checkFalling = () => {
  updateHeroXY();
  isFalling = true;
  for (let i = 0; i < tileArray.length; i++) {
    if (tileArray[i][0] === heroX && tileArray[i][1] + 1 === heroY) {
      isFalling = false;
    }
  }

  if (isFalling) {
    fall = true;
  } else {
    fall = false;
  }
};

const checkRightWallCollide = () => {
  isWallLeft = false;
  isWallRight = false;
  if (heroY === 1) {
    f1WallArray.map((elem) => {
      if (heroX === elem[0] - 2) {
        isWallRight = true;
      }
    });
  } else if ((heroY = 5)) {
    f2WallArray.map((elem) => {
      if (heroX === elem[0] - 2) {
        isWallRight = true;
      }
    });
  }
};

const checkLeftWallCollide = () => {
  isWallLeft = false;
  isWallRight = false;
  if (heroY === 1) {
    f1WallArray.map((elem) => {
      if (heroX === elem[1]) {
        isWallLeft = true;
      }
    });
  } else if ((heroY = 5)) {
    f2WallArray.map((elem) => {
      if (heroX === elem[1]) {
        isWallLeft = true;
      }
    });
  }
};

heroImg.onclick = (event) => {
  event.stopPropagation();

  direction = direction === "right" ? "left" : "right";

  if (direction === "right") {
    heroImg.style.transform = "scale(-1, 1)";
  } else {
    heroImg.style.transform = "scale(1, 1)";
  }
};

restartBtn.onclick = (event) => {
  event.stopPropagation();
  window.document.location.reload();
};

fsBtn.onclick = (event) => {
  event.stopPropagation();
  if (window.document.fullscreenElement) {
    fsBtn.src = "fullscreen.png";
    window.document.exitFullscreen();
  } else {
    fsBtn.src = "cancel.png";
    canvas.requestFullscreen();
  }
};

heroImg.onclick = (event) => {
  event.stopPropagation();
};

jumpBlock.onclick = (event) => {
  jump = true;
};
hitBlock.onclick = (event) => {
  event.stopPropagation();
  hit = true;
};

let currentFrame = 0;

const animateHero = () => {
  currentFrame = (currentFrame + 1) % 6;
  heroImg.style.left = `-${currentFrame * 96}px`;
  heroImg.style.top = "-192px";
};

const stopBeforeWall = () => {
  if (isWallRight && direction === "right") {
    imgBlockPosition -= heroStep;
  } else if (isWallLeft && direction === "left") {
    imgBlockPosition += heroStep;
  }
};

const rightHandler = () => {
  if (fall) {
    return;
  }
  if (!isRightSideBlocked && !isWallRight) {
    heroImg.style.transform = "scale(-1,1)";
    imgBlockPosition += 1;
    imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
    animateHero();

    checkFalling();
    wasHeroHit = false;
    moveWorldLeft();
    checkRightWallCollide();
  } else {
    stopBeforeWall();
  }
};

const leftHandler = () => {
  if (fall) {
    return;
  }
  if (!isLeftSideBlocked && !isWallLeft) {
    heroImg.style.transform = "scale(1,1)";
    imgBlockPosition -= 1;
    imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
    animateHero();

    checkFalling();
    wasHeroHit = false;
    moveWorldRight();
    checkLeftWallCollide();
  } else {
    stopBeforeWall();
  }
};

const standHandler = () => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (rightPosition > 4) {
        rightPosition = 1;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
      }
      break;
    }
    default:
      break;
  }

  rightPosition = rightPosition + 1;
  heroImg.style.left = `-${rightPosition * 96}px`;
  heroImg.style.top = "0px";

  checkFalling();
};

const hitHandler = () => {
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (rightPosition > 4) {
        rightPosition = 1;
        hit = false;
        wasHeroHit = true;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
        hit = false;
        wasHeroHit = true;
      }
      break;
    }
    default:
      break;
  }

  rightPosition = rightPosition + 1;
  heroImg.style.left = `-${rightPosition * 96}px`;
  heroImg.style.top = "-288px";
};

const jumpHandler = () => {
  isWallRight = false;
  isWallLeft = false;
  switch (direction) {
    case "right": {
      heroImg.style.transform = "scale(-1,1)";
      if (rightPosition > 4) {
        rightPosition = 1;
        jump = false;
        imgBlock.style.bottom = `${
          Number.parseInt(window.getComputedStyle(imgBlock).bottom) + 160
        }px`;
        imgBlockPosition = imgBlockPosition + 20;
        imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
      }
      break;
    }
    case "left": {
      heroImg.style.transform = "scale(1,1)";
      if (rightPosition > 3) {
        rightPosition = 0;
        jump = false;
        imgBlock.style.bottom = `${
          Number.parseInt(window.getComputedStyle(imgBlock).bottom) + 160
        }px`;
        imgBlockPosition = imgBlockPosition - 15;
        imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
      }
      break;
    }
    default:
      break;
  }

  rightPosition = rightPosition + 1;
  heroImg.style.left = `-${rightPosition * 96}px`;
  heroImg.style.top = "-96px";
};

const fallHandler = () => {
  if (fall) {
    const currentBottom = Number.parseInt(
      window.getComputedStyle(imgBlock).bottom
    );
    imgBlock.style.bottom = `${currentBottom - tileSize}px`;
    imgBlockPosition = Math.round(
      parseInt(window.getComputedStyle(imgBlock).left) / heroStep
    );
    updateHeroXY();
    checkFalling();
    targetPositionX = null;
    isMoving = false;

    heroStep = 1.5;
  }
};

let stepsRemaining = 0;
const moveCharacter = () => {
  if (stepsRemaining <= 0 || targetPositionX === null) {
    isMoving = false;
    return;
  }

  let heroCurrentX =
    imgBlock.getBoundingClientRect().left + imgBlock.offsetWidth / 2;

  const movementInterval = setInterval(() => {
    if (fall) {
      clearInterval(movementInterval);
      isMoving = false;
      return;
    }

    if (
      stepsRemaining <= 0 ||
      (direction === "right" && isWallRight) ||
      (direction === "left" && isWallLeft)
    ) {
      clearInterval(movementInterval);
      stepsRemaining = 0;
      isMoving = false;
      return;
    }

    if (direction === "left") {
      leftHandler();
    } else if (direction === "right") {
      rightHandler();
    }

    stepsRemaining--;

    heroCurrentX =
      imgBlock.getBoundingClientRect().left + imgBlock.offsetWidth / 2;
  }, 70);
};

let onTouchStart = (event) => {
  event.preventDefault();
  if (isCutsceneActive) return;
  if (
    event.target.closest("#fsBtn") ||
    event.target.closest("#jump-block") ||
    event.target.closest("#hit-block") ||
    event.target.closest("#heroImg") ||
    event.target.closest("#restartBtn")
  ) {
    return;
  }

  if (event.button === 2) {
    direction = direction === "right" ? "left" : "right";
    heroImg.style.transform =
      direction === "right" ? "scale(-1,1)" : "scale(1,1)";
    return;
  }

  if (event.button !== 0) return;

  let clickX =
    event.type === "mousedown" ? event.clientX : event.touches[0].clientX;
  let clickY =
    event.type === "mousedown" ? event.clientY : event.touches[0].clientY;

  let heroCurrentX =
    imgBlock.getBoundingClientRect().left + imgBlock.offsetWidth / 2;

  if (clickX > heroCurrentX) {
    direction = "right";
    targetPositionX = clickX;
  } else if (clickX < heroCurrentX) {
    direction = "left";
    targetPositionX = clickX;
  }

  if (isMoving) {
    return;
  }

  // Задаем количество шагов
  stepsRemaining = 4;

  isMoving = true;
  moveCharacter();
};

let onTouchEnd = (event) => {
  clearInterval(timer);
  lifeCycle();
};

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;
window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;

let blockedKeys = ["KeyD", "KeyA", "KeyW", "KeyF"];

window.addEventListener("keydown", (event) => {
  if (fall) {
    if (blockedKeys.includes(event.code)) return;
  }
  if (!event.repeat) {
    clearInterval(timer);
    timer = setInterval(() => {
      if (event.code === "KeyD") {
        direction = "right";
        rightHandler();
      } else if (event.code === "KeyA") {
        direction = "left";
        leftHandler();
      } else if (event.code === "KeyF") {
        hitHandler();
      }
    }, 70);
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "KeyW") jump = true;
  clearInterval(timer);
  lifeCycle();
});

const lifeCycle = () => {
  timer = setInterval(() => {
    if (isCutsceneActive) return;
    if (hit) {
      hitHandler();
    } else if (jump) {
      jumpHandler();
    } else if (fall) {
      fallHandler();
    } else if (!isMoving) {
      standHandler();
    }
  }, 100);
};
//CLASSES

class Lever {
  leverImg;
  x;
  y;
  updateTimer;
  finalTimer;
  time;
  dir;
  opacity;
  fountainImg;
  constructor() {
    this.x = heroX + 5;
    this.y = heroY;
    this.fountainImg = document.querySelector("#fountain");
    let fountainX = `${Number.parseInt(
      window.getComputedStyle(this.fountainImg).left / 32
    )}px`;

    this.leverImg = window.document.createElement("img");
    this.leverImg.src = "assets/lever.png";
    this.leverImg.style.position = "absolute";
    this.leverImg.style.left = `${this.x * 32}px`;
    this.leverImg.style.bottom = `${this.y * 32}px`;
    this.leverImg.style.height = "64px";
    this.leverImg.style.width = "64px";
    canvas.appendChild(this.leverImg);
    enemiesArray.push(this);

    this.time = 20;

    this.dir = true;
    this.opacity = 1;
    this.updateTimer = setInterval(() => {
      const heroRect = imgBlock.getBoundingClientRect();
      const leverRect = this.leverImg.getBoundingClientRect();

      const isHeroTouchingLever =
        heroRect.left < leverRect.right &&
        heroRect.right > leverRect.left &&
        heroRect.top < leverRect.bottom &&
        heroRect.bottom > leverRect.top;

      if (isHeroTouchingLever) {
        this.leverImg.style.display = "none";
        clearInterval(this.updateTimer);
        new CutScene(["Run hurry to the fountain!"]);
      } else {
        this.animate();
      }
    }, 100);

    this.finalTimer = setInterval(() => {
      if (this.time <= 0) {
        finalTimerText.innerText = "Game over";
        clearInterval(this.finalTimer);
      } else {
        finalTimerText.innerText = `${this.time}`;
        this.time--;

        const heroRect = imgBlock.getBoundingClientRect();
        const fountainRect = this.fountainImg.getBoundingClientRect();
        const isHeroTouchingFountain =
          heroRect.left < fountainRect.right &&
          heroRect.right > fountainRect.left &&
          heroRect.top < fountainRect.bottom &&
          heroRect.bottom > fountainRect.top;

        if (isHeroTouchingFountain) {
          new Terminal();
          clearInterval(this.finalTimer);
        }
      }
    }, 1500);
  }
  animate() {
    this.dir ? (this.opacity += 0.5) : (this.opacity -= 0.5);
    this.leverImg.style.opacity = 1 / this.opacity;
    if (this.opacity <= 0 || this.opacity >= 5) {
      this.dir = !this.dir;
    }
  }
  moveLeft() {
    this.leverImg.style.left = `${
      Number.parseInt(window.getComputedStyle(this.leverImg).left) - 32
    }px`;
    this.x -= 1;
  }

  moveRight() {
    this.leverImg.style.left = `${
      Number.parseInt(window.getComputedStyle(this.leverImg).left) + 32
    }px`;
    this.x += 1;
  }
}

class CutScene {
  text;
  p;
  nextButton;
  skipButton;
  page;
  timer;
  constructor(text, onComplete) {
    this.page = 0;
    this.text = text;
    this.block = window.document.createElement("div");
    this.block.style.position = "absolute";
    this.block.style.left = "10%";
    this.block.style.bottom = "10vh";
    this.block.style.width = "80%";
    this.block.style.height = "80vh";
    this.block.style.backgroundColor = "#38002c";
    this.block.style.border = "5px solid #8babbf";
    this.block.style.zIndex = "1000";
    this.appendP();
    this.appendNextButton();
    this.appendSkipButton();
    this.setText(this.text[this.page]);
    canvas.appendChild(this.block);

    // Блокируем игру
    isCutsceneActive = true;
  }
  appendP() {
    this.p = window.document.createElement("p");
    this.p.style.position = "absolute";
    this.p.style.left = "10%";
    this.p.style.top = "10vh";
    this.p.style.width = "80%";
    this.p.style.color = "#8babbf";
    this.p.style.fontSize = "8pt";
    this.p.style.lineHeight = "1.5";
    this.p.style.fontFamily = "'Press Start 2P', system-ui";
    this.block.appendChild(this.p);
  }

  appendNextButton() {
    this.nextButton = window.document.createElement("button");
    this.setButtonStyle(this.nextButton, "Next");
    this.nextButton.style.right = 0;
    this.nextButton.style.display = "none";
    this.nextButton.onclick = () => {
      if (this.page < this.text.length - 1) {
        this.page++;
        this.setText(this.text[this.page]);
        this.nextButton.style.display = "none";
      } else {
        this.nextButton.style.display = "none";
        this.closeCutScene();
      }
    };
    this.block.appendChild(this.nextButton);
  }

  appendSkipButton() {
    this.skipButton = window.document.createElement("button");
    this.setButtonStyle(this.skipButton, "Skip");
    this.skipButton.style.left = 0;
    this.skipButton.onclick = () => {
      this.closeCutScene();
    };
    this.block.appendChild(this.skipButton);
  }

  setButtonStyle(button, title) {
    button.style.position = "absolute";
    button.style.bottom = 0;
    button.style.backgroundColor = "#8babbf";
    button.style.color = "#38002c";
    button.innerText = title;
    button.style.fontSize = "20pt";
    button.style.margin = "10pt";
    button.style.padding = "10pt";
    button.style.border = "none";
    button.style.fontFamily = "'Press Start 2P', system-ui";
  }

  setText(text) {
    if (this.page === this.text.length - 1) this.nextButton.innerText = "Go";
    let innerText = "";
    let targetText = text;
    let pos = 0;
    this.timer = setInterval(() => {
      if (pos <= targetText.length - 1) {
        innerText += targetText[pos];
        this.p.innerText = innerText;
        pos++;
      } else {
        clearInterval(this.timer);
        this.nextButton.style.display = "block";
      }
    }, 10);
  }

  closeCutScene() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.block.style.display = "none";
    isCutsceneActive = false;
    if (typeof this.onComplete === "function") {
      this.onComplete();
    }
  }
}

class Terminal extends CutScene {
  btnBlock;
  mainStrLength;
  password;
  constructor() {
    let text = "Hurry, enter the password: ";
    super([text]);
    this.password = "1123";
    this.mainStrLength = text.length;
    this.btnBlock = window.document.createElement("div");
    this.btnBlock.style.position = "absolute";
    this.btnBlock.style.left = "33%";
    this.btnBlock.style.bottom = "10vh";
    this.btnBlock.style.width = "33%";
    this.block.appendChild(this.btnBlock);
    this.btnBlock.style.zIndex = "1000";
    this.block.style.zIndex = "1000";
    this.skipButton.innerText = "Clear";
    this.nextButton.innerText = "Enter";
    this.createNumButtons();
    this.skipButton.onclick = () => {
      if (this.p.innerText.length >= this.mainStrLength) {
        let str = "";
        for (let i = 0; i < this.p.innerText.length - 1; i++) {
          str += this.p.innerText[i];
        }
        this.p.innerText = str;
      }
    };
    this.nextButton.onclick = () => {
      if (this.p.innerText.length === this.mainStrLength + 3) {
        let str = "";
        for (
          let i = this.p.innerText.length - 4;
          i < this.p.innerText.length;
          i++
        ) {
          str += this.p.innerText[i];
        }
        if (str === this.password) {
          this.block.style.display = "none";
          finalTimerText.innerText = "You win";
          imgBlock.style.display = "none";
        } else if (str !== this.password) {
          this.p.innerText = "This password is not correct!";
          this.mainStrLength = this.p.innerText.length;
        }
      }
    };
  }
  createNumButtons() {
    for (let i = 1; i <= 9; i++) {
      let btn = window.document.createElement("button");
      this.setButtonStyle(btn, `${i}`);
      btn.style.left =
        i <= 3
          ? `${(i - 1) * 33}%`
          : i <= 6
          ? `${(i - 4) * 33}%`
          : `${(i - 7) * 33}%`;
      btn.style.bottom = i <= 3 ? "36vh" : i <= 6 ? "18vh" : 0;
      btn.onclick = (event) => {
        if (this.p.innerText.length < this.mainStrLength + 3) {
          this.p.innerText += event.target.innerText;
        }
      };
      this.btnBlock.appendChild(btn);
    }
  }
}

class Enemy {
  ATTACK = "attack";
  DEATH = "death";
  HURT = "hurt";
  IDLE = "idle";
  WALK = "walk";

  state;
  animateWasChanged;

  lives;

  startX;
  posX;
  posY;
  img;
  block;
  blockSize;
  spritePos;
  spriteMaxPos;
  timer;
  sourcePath;
  dir;
  stop;
  message;
  isLast;
  constructor(x, y, src, message = "", isLast = false) {
    this.isLast = isLast;
    this.message = message;
    this.posX = x + this.getRandomOffset(6);
    this.startX = x;
    this.posY = y;
    this.lives = 30;
    this.blockSize = 96;
    this.spritePos = 0;
    this.spriteMaxPos = 3;
    this.sourcePath = src;
    this.dir = 1;
    this.stop = false;

    this.state = this.IDLE;
    this.animateWasChanged = false;

    this.createImg();
    enemiesArray.push(this);
    this.lifeCycle();
  }

  createImg() {
    this.block = window.document.createElement("div");
    this.block.style.position = "absolute";
    this.block.style.left = `${this.posX * 32}px`;
    this.block.style.bottom = `${this.posY * 32}px`;
    this.block.style.width = `${this.blockSize}px`;
    this.block.style.height = `${this.blockSize}px`;
    this.block.style.overflow = "hidden";

    this.img = window.document.createElement("img");
    this.img.src = this.sourcePath + "Idle.png";
    this.img.style.position = "absolute";
    this.img.style.left = `0px`;
    this.img.style.bottom = `0px`;
    this.img.style.width = `${this.blockSize * 4}px`;
    this.img.style.height = `${this.blockSize}px`;

    this.block.appendChild(this.img);
    canvas.appendChild(this.block);
  }

  lifeCycle() {
    this.timer = setInterval(() => {
      if (this.animateWasChanged) {
        this.animateWasChanged = false;

        switch (this.state) {
          case this.ATTACK: {
            this.setAttack();
            break;
          }
          case this.DEATH: {
            this.setDeath();
            break;
          }
          case this.HURT: {
            this.setHurt();
            break;
          }
          case this.IDLE: {
            this.setIdle();

            break;
          }
          case this.WALK: {
            this.setWalk();
            break;
          }
          default:
            break;
        }
      }
      this.spritePos++;
      this.checkCollide();
      if (!this.stop) {
        this.move();
      } else {
        if (this.state !== this.DEATH) {
          if (this.state !== this.HURT) {
            this.changeAnimate(this.ATTACK);
          }
        }
      }

      this.animate();
    }, 150);
  }

  animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        lives -= 0.5;
        updateHearts();
      }
      if (this.state === this.HURT) {
        this.changeAnimate(this.ATTACK);
        if (this.dir > 0) this.spritePos = 5;
      }

      if (this.state === this.DEATH) {
        clearInterval(this.timer);
        isRightSideBlocked = false;
        isLeftSideBlocked = false;
        if (this.dir > 0) this.spritePos = 5;
        if (this.message) {
          new CutScene([this.message]);
          if (this.isLast) {
            new Lever();
          }
        }
      }
    }
    this.img.style.left = `${-this.spritePos * this.blockSize}px`;
  }

  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.img.style.width = `${this.blockSize * 6 + 1}px`;
    this.spriteMaxPos = 5;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.img.style.width = `${this.blockSize * 6 + 1}px`;
    this.spriteMaxPos = 5;
  }
  setHurt() {
    this.img.src = this.sourcePath + "Hurt.png";
    this.img.style.width = `${this.blockSize * 2}px`;
    this.spriteMaxPos = 1;
  }
  setIdle() {
    this.img.src = this.sourcePath + "Idle.png";
    this.img.style.width = `${this.blockSize * 4}px`;
    this.spriteMaxPos = 3;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.img.style.width = `${this.blockSize * 6 + 1}px`;
    this.spriteMaxPos = 5;
  }

  changeAnimate(stateStr) {
    if (this.state !== stateStr) {
      this.state = stateStr;
      this.animateWasChanged = true;
    }
  }

  move() {
    if (this.posX > this.startX + 6) {
      this.dir = -1;
      this.img.style.transform = "scale(-1,1)";
    } else if (this.posX < this.startX) {
      this.dir = 1;
      this.img.style.transform = "scale(1,1)";
    }

    this.posX += this.dir;
    this.block.style.left = `${this.posX * 32}px`;

    if (Math.random() < 0.01) {
      setTimeout(() => {
        this.changeAnimate(this.WALK);
      }, 500);
    }
    this.changeAnimate(this.WALK);
  }

  checkHurt() {
    if (wasHeroHit) {
      const distanceToHero = Math.abs(this.posX - heroX);
      const isHeroFacingEnemy =
        (direction === "right" &&
          heroX <= this.posX &&
          heroX >= this.posX - 2) ||
        (direction === "left" && heroX >= this.posX && heroX <= this.posX + 2);

      if (distanceToHero <= 3 && isHeroFacingEnemy) {
        if (this.lives <= 10) {
          wasHeroHit = false;
          this.changeAnimate(this.DEATH);
        } else {
          wasHeroHit = false;
          this.changeAnimate(this.HURT);
          this.showHurt();
          this.lives -= 10;
        }
      } else {
        wasHeroHit = false;
      }
    }
  }

  checkCollide() {
    if (heroY === this.posY) {
      const isFacingHero =
        (this.dir > 0 && heroX === this.posX + 2) ||
        (this.dir < 0 && heroX === this.posX);

      const isHeroGrounded = !fall;

      if (isFacingHero && isHeroGrounded) {
        this.stop = true;
        this.checkHurt();
      } else {
        this.stop = false;
        this.changeAnimate(this.WALK);
      }
    } else {
      this.stop = false;
      this.changeAnimate(this.WALK);
    }
  }

  showHurt() {
    let pos = 0;
    let text = window.document.createElement("p");
    text.innerText = "-10";
    text.style.position = "absolute";
    const blockStyle = window.getComputedStyle(this.block);
    text.style.left =
      this.dir < 0
        ? `${parseInt(blockStyle.left) + 50}px`
        : `${parseInt(blockStyle.left) + 10}px`;
    text.style.bottom = `${parseInt(blockStyle.bottom) + 70}px`;
    text.style.fontFamily = "'Bungee Spice', cursive";
    let hurtTimer = setInterval(() => {
      text.style.bottom = `${parseInt(blockStyle.bottom) + 16}px`;
      if (pos > 4) {
        clearInterval(hurtTimer);
        text.style.display = "none";
      }
      pos++;
    }, 100);
    canvas.appendChild(text);
  }

  moveRight() {
    this.startX += 1;
    this.posX += 1;
    if (this.stop || this.state === this.DEATH) {
      const blockStyle = window.getComputedStyle(this.block);
      this.block.style.left = `${parseInt(blockStyle.left) + 32}px`;
    }
  }

  moveLeft() {
    this.startX -= 1;
    this.posX -= 1;
    if (this.stop || this.state === this.DEATH) {
      const blockStyle = window.getComputedStyle(this.block);
      this.block.style.left = `${parseInt(blockStyle.left) - 32}px`;
    }
  }

  getRandomOffset(max) {
    let rand = Math.floor(Math.random() * max);
    return rand;
  }
}

class Enemy1 extends Enemy {
  constructor(x, y, mess) {
    super(x, y, "assets/Enemies/1/", mess);
  }
}

class Enemy2 extends Enemy {
  constructor(x, y, mess, isLast) {
    super(x, y, "assets/Enemies/2/", mess, isLast);
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.img.style.width = `${this.blockSize * 9 + 1}px`;
    this.spriteMaxPos = 8;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.img.style.width = `${this.blockSize * 6}px`;
    this.spriteMaxPos = 5;
  }
  setHurt() {
    this.img.src = this.sourcePath + "Hurt.png";
    this.img.style.width = `${this.blockSize * 2}px`;
    this.spriteMaxPos = 1;
  }
  setIdle() {
    this.img.src = this.sourcePath + "Idle.png";
    this.img.style.width = `${this.blockSize * 4}px`;
    this.spriteMaxPos = 3;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.img.style.width = `${this.blockSize * 6}px`;
    this.spriteMaxPos = 5;
  }
}

class Enemy5 extends Enemy {
  constructor(x, y, mess) {
    super(x, y, "assets/Enemies/5/", mess);
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.img.style.width = `${this.blockSize * 4 + 1}px`;
    this.spriteMaxPos = 3;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.img.style.width = `${this.blockSize * 3 + 1}px`;
    this.spriteMaxPos = 2;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.img.style.width = `${this.blockSize * 4 + 1}px`;
    this.spriteMaxPos = 3;
  }
}

/* class Enemy6 extends Enemy {
  bullet;
  isShoot;
  bulletX;
  constructor(x, y, mess) {
    super(x, y, "assets/Enemies/6/", mess);
    this.bullet = window.document.createElement("img");
    this.bullet.src = this.sourcePath + "Ball1.png";
    this.bullet.style.position = "absolute";
    this.bullet.style.left = this.block.style.left;
    this.bullet.style.bottom = `${parseInt(this.block.style.bottom) + 32}px`;
    this.bullet.style.transform = "scale(2,2)";
    this.bullet.style.display = "none";
    canvas.appendChild(this.bullet);
  }
  setAttack() {
    this.img.src = this.sourcePath + "Attack.png";
    this.img.style.width = `${this.blockSize * 4 + 1}px`;
    this.spriteMaxPos = 3;
  }
  setDeath() {
    this.img.src = this.sourcePath + "Death.png";
    this.img.style.width = `${this.blockSize * 3 + 1}px`;
    this.spriteMaxPos = 2;
  }
  setWalk() {
    this.img.src = this.sourcePath + "Walk.png";
    this.img.style.width = `${this.blockSize * 4 + 1}px`;
    this.spriteMaxPos = 3;
  }
  checkCollide() {
    if (heroY === this.posY) {
      // Проверяем, находится ли герой в зоне атаки робота
      const isHeroInRange = Math.abs(this.posX - heroX) <= 4; // Радиус атаки - 4 клетки

      // Если герой в зоне атаки, робот начинает атаковать
      if (isHeroInRange) {
        console.log("Robot starts attacking the hero!");
        this.stop = true; // Останавливаем движение робота
        this.changeAnimate(this.ATTACK); // Анимация атаки
      } else {
        console.log("Robot is moving toward the hero.");
        this.stop = false; // Робот продолжает двигаться
        this.changeAnimate(this.WALK); // Анимация движения
        this.moveTowardHero(); // Движение в сторону героя
      }
    } else {
      console.log("Hero is not on the same height as the robot.");
      this.stop = false;
      this.changeAnimate(this.WALK);
    }
  }

  checkHurt() {
    const distanceToHero = Math.abs(this.posX - heroX); // Расстояние до героя
    const isHeroFacingRobot =
      (direction === "right" && heroX <= this.posX && heroX >= this.posX - 2) || // Герой смотрит вправо
      (direction === "left" && heroX >= this.posX && heroX <= this.posX + 2); // Герой смотрит влево

    // Если герой близко и смотрит на робота
    if (distanceToHero <= 2 && isHeroFacingRobot) {
      console.log("Hero attacks the robot!");
      if (this.lives <= 10) {
        this.changeAnimate(this.DEATH);
      } else {
        this.changeAnimate(this.HURT);
        this.showHurt();
        this.lives -= 10;
      }
    } else {
      console.log("Hero's attack missed the robot.");
    }
  }

  shoot() {
    this.isShoot = true;
    this.bullet.style.display = "block";
    this.dir > 0
      ? (this.bulletX = this.posX + 2)
      : (this.bulletX = this.posX + 1);
  }
  bulletFunc() {
    // Проверяем, активна ли пуля
    if (!this.isShoot) return;

    // Обновляем координаты пули независимо от робота
    this.dir > 0 ? (this.bulletX += 1) : (this.bulletX -= 1);
    this.bullet.style.left = `${this.bulletX * 32}px`;

    // Проверяем столкновение с героем
    if (this.bulletX === heroX && this.posY === heroY) {
      console.log("Hero hit by bullet!");
      this.isShoot = false;
      this.bullet.style.display = "none";
      lives -= 0.5;
      updateHearts();
    }

    // Проверяем выход пули за пределы действия
    if (this.dir > 0 && this.bulletX > this.posX + 6) {
      this.resetBullet();
    } else if (this.dir < 0 && this.bulletX < this.posX - 6) {
      this.resetBullet();
    }

    if (!this.stop || this.state !== this.ATTACK) {
      console.log("Attack ended, bullet removed.");
      this.resetBullet();
    }
  }

  // Метод для сброса пули
  resetBullet() {
    this.isShoot = false;
    this.bullet.style.display = "none";
  }

  animate() {
    if (this.spritePos > this.spriteMaxPos) {
      this.spritePos = 0;
      if (this.state === this.ATTACK) {
        if (!this.isShoot) this.shoot();
      }
      if (this.state === this.HURT) {
        this.changeAnimate(this.ATTACK);
        if (this.dir > 0) this.spritePos = 5;
      }

      if (this.state === this.DEATH) {
        clearInterval(this.timer);
        isRightSideBlocked = false;
        isLeftSideBlocked = false;
        if (this.dir > 0) this.spritePos = 5;
        if (this.message) new CutScene([this.message]);
      }
    }
    if (this.shoot) {
      this.bulletFunc();
    }
    this.img.style.left = `${-this.spritePos * this.blockSize}px`;
  }
} */

class Heart {
  img;
  x;
  constructor(x, src) {
    this.x = x + 1;
    this.img = window.document.createElement("img");
    this.img.src = src;
    this.img.style.position = "absolute";
    this.img.style.left = `${this.x * 32}px`;
    this.img.style.bottom = `${(window.innerHeight / 32 - 2) * 32}px`;
    this.img.style.width = `32px`;
    this.img.style.height = `32px`;

    canvas.appendChild(this.img);
  }
}

class HeartEmpty extends Heart {
  constructor(x) {
    super(x, "assets/Hearts/heart_empty.png");
  }
}

class HeartRed extends Heart {
  constructor(x) {
    super(x, "assets/Hearts/heart_red.png");
  }
}

//Environment

let finalTimerText = window.document.querySelector("#final-timer-text");

const moveWorldLeft = () => {
  let objectPositions = objectsArray.map((elem) =>
    parseInt(window.getComputedStyle(elem).left)
  );
  // console.log("Before:", objectPositions);
  objectsArray.map((elem, index) => {
    objectPositions[index] -= 32; // Уменьшаем координаты
    elem.style.left = `${objectPositions[index]}px`; // Применяем координаты
  });

  tileArray.map((elem) => {
    elem[0] = elem[0] - 1;
  });
  enemiesArray.map((elem) => elem.moveLeft());
  f1WallArray.map((elem) => {
    elem[0] -= 1;
    elem[1] -= 1;
  });
  f2WallArray.map((elem) => {
    elem[0] -= 1;
    elem[1] -= 1;
  });
};

const moveWorldRight = () => {
  let objectPositions = objectsArray.map((elem) =>
    parseInt(window.getComputedStyle(elem).left)
  );
  // console.log("Before:", objectPositions);
  objectsArray.map((elem, index) => {
    objectPositions[index] += 32; // Увеличиваем координаты
    elem.style.left = `${objectPositions[index]}px`; // Применяем координаты
  });

  tileArray.map((elem) => {
    elem[0] = elem[0] + 1;
  });
  enemiesArray.map((elem) => elem.moveRight());
  f1WallArray.map((elem) => {
    elem[0] += 1;
    elem[1] += 1;
  });
  f2WallArray.map((elem) => {
    elem[0] += 1;
    elem[1] += 1;
  });
};

let f1WallArray = [
  [0, 0],
  [15, 33],
  [42, 53],
  [65, 76],
  [92, 105],
  [119, 130],
];
let f2WallArray = [[54, 63]];
let tileArray = [];
let objectsArray = [];
let enemiesArray = [];
let heartsArray = [];

const createTile = (x, y = 1) => {
  let tile = window.document.createElement("img");
  tile.src = "assets/1 Tiles/Tile_02.png";
  tile.style.position = "absolute";
  tile.style.left = `${x * 32}px`;
  tile.style.bottom = `${y * 32}px`;
  backgroundCanvas.appendChild(tile);
  objectsArray.push(tile);
  tileArray.push([x, y]);
};

const createTileBlack = (x, y = 0) => {
  let tileBlack = window.document.createElement("img");
  tileBlack.src = "assets/1 Tiles/Tile_04.png";
  tileBlack.style.position = "absolute";
  tileBlack.style.left = `${x * 32}px`;
  tileBlack.style.bottom = `${y * 32}px`;
  backgroundCanvas.appendChild(tileBlack);
  objectsArray.push(tileBlack);
};

const createTilesPlatform = (startX, endX, floor) => {
  for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
    createTile(x_pos, floor);
  }
};

const createTilesBlackBlock = (startX, endX, floor) => {
  for (let y_pos = 0; y_pos < floor; y_pos++) {
    for (let x_pos = startX - 1; x_pos < endX; x_pos++) {
      createTileBlack(x_pos, y_pos);
    }
  }
};

const addTiles = (i) => {
  createTile(i);
  createTileBlack(i);
};

const addHearts = () => {
  for (let i = 0; i < maxLives; i++) {
    let heartEmpty = new HeartEmpty(i);
    let heartRed = new HeartRed(i);
    heartsArray.push(heartRed);
  }
};

const updateHearts = () => {
  if (lives <= 0) {
    finalTimerText.innerText = "Game over";
    imgBlock.style.display = "none";
  }
  for (let i = 0; i < lives; i++) {
    heartsArray[i].img.style.display = "block";
  }

  for (let i = lives; i < maxLives; i++) {
    heartsArray[i].img.style.display = "none";
  }
};

const createBackImg = (i) => {
  let img = window.document.createElement("img");
  img.src = "assets/2 Background/Day/Background.png";
  img.style.position = "absolute";
  img.style.left = `${i * window.screen.width - 32}px`;
  img.style.width = `${window.screen.width}px`;
  img.style.bottom = "32px";
  backgroundCanvas.appendChild(img);
  objectsArray.push(img);
};

const addBackgroundImages = () => {
  for (let i = 0; i < 5; i++) {
    createBackImg(i);
  }
};

const createDecEl = (src, x, y) => {
  let dec = window.document.createElement("img");
  dec.src = src;
  dec.style.position = "absolute";
  dec.style.left = `${x * 32}px`;
  dec.style.bottom = `${y * 32}px`;
  dec.style.transform = "scale(2,2) translate(-25%, -25%)";
  backgroundCanvas.appendChild(dec);
  objectsArray.push(dec);
};

const addDecorationElements = (f1, f2, f3) => {
  let basePath = "assets/3 Objects/";
  //Trees
  createDecEl(`${basePath}/Other/Tree4.png`, 4, f1);
  createDecEl(`${basePath}/Other/Tree2.png`, 35, f1);
  createDecEl(`${basePath}/Other/Tree3.png`, 78, f1);
  createDecEl(`${basePath}/Other/Tree4.png`, 108, f1);
  createDecEl(`${basePath}/Other/Tree1.png`, 65, f2);
  //Stones
  createDecEl(`${basePath}/Stones/6.png`, 65, f2);
  createDecEl(`${basePath}/Stones/4.png`, 111, f1);
  createDecEl(`${basePath}/Stones/6.png`, 38, f1);
  createDecEl(`${basePath}/Stones/6.png`, 102, f3);
  //Ramps
  createDecEl(`${basePath}/Other/Ramp1.png`, 22, f2);
  createDecEl(`${basePath}/Other/Ramp2.png`, 26, f2);
  createDecEl(`${basePath}/Other/Ramp1.png`, 45, f2);
  createDecEl(`${basePath}/Other/Ramp2.png`, 49, f2);
  createDecEl(`${basePath}/Other/Ramp1.png`, 95, f2);
  createDecEl(`${basePath}/Other/Ramp2.png`, 99, f2);
  //Bushes
  createDecEl(`${basePath}/Bushes/17.png`, 84, f1);
  createDecEl(`${basePath}/Bushes/17.png`, 19, f2);
  createDecEl(`${basePath}/Bushes/17.png`, 50, f2);
  createDecEl(`${basePath}/Bushes/17.png`, 69, f2);
  createDecEl(`${basePath}/Bushes/17.png`, 100, f2);
  createDecEl(`${basePath}/Bushes/17.png`, 13, f3);
  //Fountains
  createDecEl(`${basePath}/Fountain/2.png`, 116, f1);
  objectsArray[objectsArray.length - 1].id = "fountain";
  const fountainImg = document.querySelector("#fountain");
  //Box
  createDecEl(`${basePath}/Other/Box.png`, 84, f1);
  createDecEl(`${basePath}/Other/Box.png`, 48, f2);
  createDecEl(`${basePath}/Other/Box.png`, 14, f3);
  createDecEl(`${basePath}/Other/Box.png`, 104, f3);
};

const addEnemies = () => {
  let enemy1 = new Enemy1(9, 9, "First number of password is 1.");
  let enemy2 = new Enemy5(19, 5);
  let enemy3 = new Enemy5(44, 5, "Second number of password is 1.");
  let enemy4 = new Enemy2(65, 5);
  let enemy5 = new Enemy1(79, 1, "Third number of password is 2.");
  let enemy6 = new Enemy5(93, 5);
  let enemy7 = new Enemy2(
    100,
    9,
    "Third number of password is 3.\n\n Search for the lever, you got 20 seconds!",
    true
  );
};

const buildLevel = () => {
  let floor1 = 0;
  let floor2 = 4;
  let floor3 = 8;

  addDecorationElements(floor1 + 1, floor2 + 1, floor3 + 1);

  createTilesPlatform(0, 14, floor1);
  createTilesPlatform(33, 41, floor1);
  createTilesPlatform(76, 91, floor1);
  createTilesPlatform(106, 165, floor1);

  createTilesPlatform(15, 32, floor2);
  createTilesPlatform(42, 53, floor2);
  createTilesPlatform(64, 75, floor2);
  createTilesPlatform(92, 105, floor2);

  createTilesPlatform(8, 20, floor3);
  createTilesPlatform(54, 63, floor3);
  createTilesPlatform(75, 87, floor3);
  createTilesPlatform(99, 111, floor3);

  createTilesBlackBlock(15, 32, floor2);
  createTilesBlackBlock(42, 53, floor2);
  createTilesBlackBlock(64, 75, floor2);
  createTilesBlackBlock(92, 105, floor2);

  createTilesBlackBlock(54, 63, floor3);
};

//START

let isCutsceneActive = false;

const addStartScreen = () => {
  let div = window.document.createElement("div");
  div.style.position = "absolute";
  div.style.left = 0;
  div.style.bottom = 0;
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.backgroundColor = "#38002c";
  div.style.zIndex = "2000";
  div.style.display = "grid";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  canvas.appendChild(div);
  let btn = window.document.createElement("button");
  btn.innerText = "PLAY";
  btn.style.fontFamily = "'Press Start 2P', system-ui";
  btn.style.fontSize = "30pt";
  btn.style.backgroundColor = "#8babbf";
  btn.style.color = "#38002c";
  btn.style.padding = "20pt 30pt";
  btn.style.border = "none";
  btn.onclick = () => {
    btn.style.display = "none";
    div.remove();
    fsBtn.src = "cancel.png";
    canvas.requestFullscreen();
    new CutScene(
      [
        "The protagonist finds himself trapped in a virtual prison, a result of a failed attempt to track down those who abducted someone close to him. While in captivity, he uncovers a path to freedom: a hidden door located behind a fountain at the end of the first level.",
        "The door can only be opened with a specific code, comprised of four digits. These digits are secured inside heavily guarded wooden crates, each containing one number. Additionally, a lever is required to unlock the mechanism, but it is located beyond the protagonist's reach, hidden in the second level.",
        "Allies from the outside world devise a plan to retrieve the lever and provide it to the protagonist. However, they will only deliver the lever once all four digits of the code have been discovered. When the lever is obtained, there will be a brief 15-second window to activate it, approach the fountain, and input the correct code. Failing to act swiftly will alert the enemy to the allies' location, putting everyone at risk.",
      ],
      () => {
        isCutsceneActive = false;
        lifeCycle(); // Запускаем игровой цикл
      }
    );

    isCutsceneActive = true;
  };
  div.appendChild(btn);
};

const start = () => {
  addBackgroundImages();
  buildLevel();
  addHearts();
  updateHearts();
  addEnemies();
  addStartScreen();
};

start();
