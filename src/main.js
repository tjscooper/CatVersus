/*
 * main.js
 * CatVersus
 * authored by Tim Cooper on Mar 6, 2017
 *
 */

let staticAssets = [
  'images/cat.png',
  'images/spinner.png'
];

let game = hexi(512, 512, setup, staticAssets, load);
game.fps = 30;
game.border = '1px black solid';
game.backgroundColor = '#f0f0f0';
game.scaleToWindow();
game.start();

let gameScene, gameOverScene, cat, spinner,
  healthBar, message;

let catWidth = 200 / 2;
let catHeight = 185 / 2;

let spinnerSize = 100;

function load() {
  game.loadingBar();
}

function setup() {

  // Create the Game Scene
  gameScene = game.group();

  // Create the Game Over Scene
  // Add some text for the game over message
  message = game.text('', '64px Futura', 'black', 20, 20);
  message.x = 120;
  message.y = game.canvas.height / 2 - 64;
  gameOverScene = game.group(message);
  gameOverScene.visible = false;

  // Cat
  cat = game.sprite('images/cat.png');
  cat.width = catWidth;
  cat.height = catHeight;
  gameScene.addChild(cat);

  // Spinner
  spinner = game.sprite('images/spinner.png');
  spinner.width = spinnerSize;
  spinner.height = spinnerSize;
  spinner.x = 250;
  spinner.y = 150;
  spinner.setPivot(0.5, 0.5);
  gameScene.addChild(spinner);

  //Create the health bar
  let outerBar = game.rectangle(128, 18, 'red');
  let innerBar = game.rectangle(128, 18, 'blue');

  //Group the inner and outer bars
  healthBar = game.group(outerBar, innerBar);

  //Set the `innerBar` as a property of the `healthBar`
  healthBar.inner = innerBar;

  //Position the health bar
  healthBar.x = game.canvas.width - 148;
  healthBar.y = 16;

  //Add the health bar to the `gameScene`
  gameScene.addChild(healthBar);

  // Keyboard movement
  game.arrowControl(cat, 5);

  // WASD movement
  let leftArrow = game.keyboard(65);
  let upArrow = game.keyboard(87);
  let rightArrow = game.keyboard(68);
  let downArrow = game.keyboard(83);
  let shrink = game.keyboard(84);
  let grow = game.keyboard(71);

  leftArrow.press = () => {
    cat.vx = -5;
    cat.vy = 0;
  };
  leftArrow.release = () => {
    if (!rightArrow.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };
  upArrow.press = () => {
    cat.vy = -5;
    cat.vx = 0;
  };
  upArrow.release = () => {
    if (!downArrow.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };
  rightArrow.press = () => {
    cat.vx = 5;
    cat.vy = 0;
  };
  rightArrow.release = () => {
    if (!leftArrow.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };
  downArrow.press = () => {
    cat.vy = 5;
    cat.vx = 0;
  };
  downArrow.release = () => {
    if (!upArrow.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };
  shrink.press = () => {
    cat.width = catWidth / 2;
    cat.height = catHeight / 2;
  };
  grow.press = () => {
    cat.width = catWidth;
    cat.height = catHeight;
  };

  // Start the game
  game.state = play;
}

// Game End state
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

// Game loop / logic
function play() {

  // Move the cat
  game.move(cat);

  // Keep the cat contained inside the stage's area

  game.contain(cat, game.stage);

  spinner.rotation += 0.3;

  let catHit = false;

  if (game.hitTestRectangle(cat, spinner)) {
   catHit = true;
  }

  if (catHit) {
    // Make the cat semi-transparent
    cat.alpha = 0.5;
    // Reduce the width of the health bar's inner rectangle by 1 pixel
    healthBar.inner.width -= 2;
  } else {
    cat.alpha = 1;
  }

  if (healthBar.inner.width < 1) {
    game.state = end;
    message.content = 'You lost!';
  }


}
