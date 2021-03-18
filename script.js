var menuID = 0;
var playerOne = [45, 385, 0, -1, 1, 3];      //x, y, xvel, yvel, look direction, health
var playerTwo = [350, 385, 0, -1, -1, 3];    //x, y, xvel, yvel, look direction, health
var darkMode = 1;
var ss = 0;
var winner = 0;
var mapData = [200, 408, 200, 8, 408, 200, 8, 200, -8, 200, 8, 200, 200, -8, 200, 8, 130, 352, 40, 52, 280, 270, 30, 80, 120, 180, 50, 35, 377, 100, 26, 30, 33, 70, 36, 15];
var bulletData = [];                         // x, y, direction, player
var particleData = [];                       // x, y, xvel, yvel, player color
var playerDelay = [0, 0];                    //player: 1, 2
var playButtonSize = 0;
var playButtonSizeChange = 0;

function setup(){
noStroke();
frameRate(30);
}

function displayPlayButton(){
  stroke(rgb(235, 235, 235));
  strokeWeight(2);
  if ((mouseX >= 125 && (mouseX) <= 275) && (mouseY >= 220 && (mouseY) <= 295)){
    playButtonSizeChange = playButtonSizeChange * 0.7 + (38 - playButtonSize) / 1.4;
    fill(rgb((230 - playButtonSize), (230 - playButtonSize), (230 - playButtonSize)));
    if (mouseWentDown("leftButton")){
      menuID = 1;
      playerOne = [45, 385, 0, -1, 1, 3];
      playerTwo = [350, 385, 0, -1, -1, 3];
      winner = 0;
      bulletData = [];
      particleData = [];
      playerDelay = [0, 0];
      playButtonSize = 0;
      playButtonSizeChange = 0;
    }
  } else {
    playButtonSizeChange = playButtonSizeChange * 0.7 + (45 - playButtonSize) / 1.4;
    fill(rgb(230, 230, 230));
  }
  playButtonSize = playButtonSizeChange + playButtonSize;
  if (!((mouseX >= 125 && (mouseX) <= 275) && (mouseY >= 220 && (mouseY) <= 295) && (mouseWentDown("leftButton")))) {
    noStroke();
    fill(rgb(230, 230, 230));
    textSize(playButtonSize);
    textFont("Courier");
    textAlign(CENTER, CENTER);
    text("PLAY", 200 + ss, 255 + ss);
  }
  if ((mouseX >= 125 && (mouseX) <= 275) && (mouseY >= 220 && (mouseY) <= 295)){
    fill(rgb(230, 230, 230, 0.2));
  } else {
    noFill();
  }
  stroke(rgb(230, 230, 230, 1));
  rect(150 - (playButtonSize / 2) + ss, 240 - (playButtonSize / 2) + ss, 100 + (playButtonSize), 30 + playButtonSize);
}

function frameRefresh(){
  ss *= -0.85;
  background(rgb(245 - (darkMode * 220), 245 - (darkMode * 220), 245 - (darkMode * 220)));
  if(menuID == 1){
    playerControls();
    particleRender();
    drawPlayer(playerOne[0], playerOne[1], 1, playerOne[4], playerOne[3]);
    drawPlayer(playerTwo[0], playerTwo[1], 2, playerTwo[4], playerTwo[3]);
    mapRender(mapData);
    bulletRender();
    healthBars();
  }else{
    winnerLabel();
    displayPlayButton();
  }
}

function winnerLabel(){
  textAlign(CENTER, TOP);
  textFont("Courier");
  textSize(50);
  fill(rgb(235, 235, 235));
  text("Block Brawl", 200 + ss, 65 + ss);
  textSize(40);
  if(winner != 0){
    if(winner == 1){
      fill(rgb(100, 100, 200));
      text("BLUE WINS!", 200 + ss, 145 + ss);
    }else{
      fill(rgb(200, 100, 100));
      text("RED WINS!", 200 + ss, 145 + ss);
    }
  }
}

function healthBars(){
  fill(100, 100, 200);
  for(var i = 0; i < playerOne[5]; i++) rect(74 + i * 32 + ss, 149 + ss, 28, 62);
  fill(200, 100, 100);
  for(i = 0; i < playerTwo[5]; i++) rect(254 + ss, 194 + i * 52 + ss, 52, 48);
  if(playerOne[5] == 0 || playerTwo[5] == 0){
    menuID = 3;
    if(playerTwo[5] == 0) winner = 1;
    if(playerOne[5] == 0) winner = 2;
  }
}

function particleRender(){
  for(var i = 0; i < particleData.length; i += 5){
    particleData[i] += particleData[i + 2];
    particleData[i + 3] += 0.85;
    particleData[i + 1] += particleData[i + 3];
    if(abs(particleData[i + 1] - 200) > 205 || abs(particleData[i] - 200) > 205) for(var j = 0; j < 5; j++) particleData = removeA(particleData, i);
    fill(rgb(100, 100, 200));
    if(particleData[4] == 2) fill(rgb(200, 100, 100));
    ellipse(particleData[i] + ss, particleData[i + 1] + ss, 5, 5);
  }
}

function bulletRender(){
  var i;
  var j;
  var k;
  var l;
  for(i = 0; i < bulletData.length; i += 4){ // if bullet hits wall
    bulletData[i] += bulletData[i + 2] * 10;
    for(j = 0; j < mapData.length; j += 4){
      if(abs(mapData[j] - bulletData[i]) < 5 + mapData[j + 2] && abs(mapData[j + 1] - bulletData[i + 1]) < 5 + mapData[j + 3]){
        ss = 1.2;
        for(l = 0; l < 3; l++){
          particleData[particleData.length] = bulletData[i];
          particleData[particleData.length] = bulletData[i + 1];
          particleData[particleData.length] = -bulletData[i + 2] * random(1, 5);
          particleData[particleData.length] = random(-11, -5);
          particleData[particleData.length] = bulletData[i + 3];
        }
        for(k = 0; k < 4; k++) bulletData = removeA(bulletData, i);
      }
    }
    if(bulletData[i + 3] == 1){ // if bullet is blue and player is red
      if(abs(playerTwo[0] - bulletData[i]) < 20 && abs(playerTwo[1] - bulletData[i + 1]) < 20){
        playerTwo[5] -= 1;
        playerTwo[2] = 12 * bulletData[i + 2];
        ss = 2;
        for(l = 0; l < 3; l++){
          particleData[particleData.length] = bulletData[i];
          particleData[particleData.length] = bulletData[i + 1];
          particleData[particleData.length] = bulletData[i + 2] * random(1, 5);
          particleData[particleData.length] = random(-11, -5);
          particleData[particleData.length] = bulletData[i + 3];
        }
        for(k = 0; k < 4; k++) bulletData = removeA(bulletData, i);
      }
    }
    if(bulletData[i + 3] == 2){ // if bullet is red and player is blue
      if(abs(playerOne[0] - bulletData[i]) < 20 && abs(playerOne[1] - bulletData[i + 1]) < 20){
        playerOne[5] -= 1;
        playerOne[2] = 12 * bulletData[i + 2];
        ss = 2;
        for(l = 0; l < 3; l++){
          particleData[particleData.length] = bulletData[i];
          particleData[particleData.length] = bulletData[i + 1];
          particleData[particleData.length] = bulletData[i + 2] * random(5, 11);
          particleData[particleData.length] = random(-11, -5);
          particleData[particleData.length] = 2;
        }
        for(k = 0; k < 4; k++) bulletData = removeA(bulletData, i);
      }
    }
    fill(150, 150, 250);
    if(bulletData[i + 3] == 2) fill(250, 150, 150);
    ellipse(bulletData[i] + ss, bulletData[i + 1] + ss, 10, 10);
    fill(100, 100, 200);
    if(bulletData[i + 3] == 2) fill(200, 100, 100);
    ellipse(bulletData[i] + ss, bulletData[i + 1] + ss, 5, 5);
  }
}

function mapRender(m){
  fill(rgb(65 + (darkMode * 170), 65 + (darkMode * 170), 65 + (darkMode * 170)));
  for(var i = 0; i < mapData.length; i += 4){
    rect(m[i] - m[i + 2] + ss, m[i + 1] - m[i + 3] + ss, m[i + 2] * 2, m[i + 3] * 2);
  }
  fill(rgb(245 - (darkMode * 220), 245 - (darkMode * 220), 245 - (darkMode * 220)));
  for(var j = 0; j < mapData.length; j += 4){
    rect(m[j] - m[j + 2] + 2 + ss, m[j + 1] - m[j + 3] + 2 + ss, m[j + 2] * 2 - 4, m[j + 3] * 2 - 4);
  }
}

function playerControls(){
  if(keyDown("a") && !keyDown("d")){
    playerOne[4] = -1;
    playerOne[2] -= 1.8;
  }                                         //p1 move left
  if(!keyDown("a") && keyDown("d")){
    playerOne[4] = 1;
    playerOne[2] += 1.8;
  }                                         //p1 move right
  if(keyDown("left") && !keyDown("right")){
    playerTwo[4] = -1;
    playerTwo[2] -= 1.8;
  }                                         //p2 move left
  if(!keyDown("left") && keyDown("right")){
    playerTwo[4] = 1;
    playerTwo[2] += 1.8;
  }                                         //p2 right
  playerOne[3] += 1;                        //p1 gravity
  playerTwo[3] += 1;                        //p2 gravity
  playerOne[1] += playerOne[3];             //p1 y move
  playerTwo[1] += playerTwo[3];             //p2 y move
  var i;
  
  // --- PLAYER MOVEMENT AND COLLISIONS --- //
  
  if(checkCollision(1)){                    //p1 collision vertical
    i = findCollision(1);
    while(abs(mapData[i + 1] - playerOne[1]) < 15 + mapData[i + 3]){
      playerOne[1] -= abs(playerOne[3]) / playerOne[3];
    }
    if(keyDown("w") && playerOne[3] > 0){
      playerOne[3] = -11;                   //p1 jump
    }else{
      playerOne[3] = 0;
    }
  }
  if(checkCollision(2)){                    //p2 collision vertical
    i = findCollision(2);
    while(abs(mapData[i + 1] - playerTwo[1]) < 15 + mapData[i + 3]){
      playerTwo[1] -= abs(playerTwo[3]) / playerTwo[3];
    }
    if(keyDown("up") && playerTwo[3] > 0){
      playerTwo[3] = -11;                   //p2 jump
    }else{
      playerTwo[3] = 0;
    }
  }
  playerOne[2] *= 0.7;                      //p1 horiz friction
  playerTwo[2] *= 0.7;                      //p2 horiz friction
  playerOne[0] += playerOne[2];             //p1 x move
  playerTwo[0] += playerTwo[2];             //p2 x move
  if(checkCollision(1)){                    //p1 collision Horiz
    i = findCollision(1);
    while(abs(mapData[i] - playerOne[0]) < 15 + mapData[i + 2]) playerOne[0] -= abs(playerOne[2]) / playerOne[2];
    if(keyDown("w") && ((keyDown("a") && playerOne[2] < 0) || (keyDown("d") && playerOne[2] > 0))){
      if(keyDown("a") && !(keyDown("d"))){  //p1 wall jump
        playerOne[2] = 12;
        playerOne[3] = -10;
      }
      if(keyDown("d") && !(keyDown("a"))){
        playerOne[2] = -12;
        playerOne[3] = -10;
      }
    }else{                                  //no wall jump
      playerOne[2] = 0;
    }
  }
  if(checkCollision(2)){                    //p2 collision Horiz
    i = findCollision(2);
    while(abs(mapData[i] - playerTwo[0]) < 15 + mapData[i + 2]) playerTwo[0] -= abs(playerTwo[2]) / playerTwo[2];
    if(keyDown("up") && ((keyDown("left") && playerTwo[2] < 0) || (keyDown("right") && playerTwo[2] > 0))){
      if(keyDown("left") && !(keyDown("right"))){
        playerTwo[2] = 12;                   //p2 wall jump
        playerTwo[3] = -10;
      }
      if(keyDown("right") && !(keyDown("left"))){
        playerTwo[2] = -12;
        playerTwo[3] = -10;
      }
    }else{                                  //no wall jump
      playerTwo[2] = 0;
    }
  }
  playerDelay[0] -= 1;
  playerDelay[1] -= 1;
  if(keyDown("s") && playerDelay[0] <= 0){
    bulletData[bulletData.length] = playerOne[0];
    bulletData[bulletData.length] = playerOne[1];
    bulletData[bulletData.length] = playerOne[4];
    bulletData[bulletData.length] = 1;
    playerDelay[0] = 35;
  }
  if(keyDown("down") && playerDelay[1] <= 0){
    bulletData[bulletData.length] = playerTwo[0];
    bulletData[bulletData.length] = playerTwo[1];
    bulletData[bulletData.length] = playerTwo[4];
    bulletData[bulletData.length] = 2;
    playerDelay[1] = 35;
  }
}

function findCollision(player){
  for(var i = 0; i < mapData.length; i += 4){
    if(player == 1 && abs(mapData[i] - playerOne[0]) < 15 + mapData[i + 2] && abs(mapData[i + 1] - playerOne[1]) < 15 + mapData[i + 3]) return i;
    if(player == 2 && abs(mapData[i] - playerTwo[0]) < 15 + mapData[i + 2] && abs(mapData[i + 1] - playerTwo[1]) < 15 + mapData[i + 3]) return i;
  }
}

function checkCollision(player){
  for(var i = 0; i < mapData.length; i += 4){
    if(player == 1 && abs(mapData[i] - playerOne[0]) < 15 + mapData[i + 2] && abs(mapData[i + 1] - playerOne[1]) < 15 + mapData[i + 3]) return true;
    if(player == 2 && abs(mapData[i] - playerTwo[0]) < 15 + mapData[i + 2] && abs(mapData[i + 1] - playerTwo[1]) < 15 + mapData[i + 3]) return true;
  }
}

function drawPlayer(x, y, player, look, yvel){
  fill(rgb(200, 100, 100));
  if(player == 1) fill(rgb(100, 100, 200));
  ellipse(x - 12 + ss, y - 12 - yvel / 4 + ss, 6, 6);
  ellipse(x + 12 + ss, y - 12 - yvel / 4 + ss, 6, 6);
  ellipse(x + 12 + ss, y + 12 + ss, 6, 6);
  ellipse(x - 12 + ss, y + 12 + ss, 6, 6);
  rect(x - 12 + ss, y - 15 - yvel / 4 + ss, 24, 30 + yvel / 4);
  rect(x - 15 + ss, y - 12 - yvel / 4 + ss, 30, 24 + yvel / 4);
  fill("white");
  ellipse(x + ss, y - yvel / 8 + ss, 15, 15);
  fill(rgb(25, 25, 25));
  ellipse(x + (look * 4) + ss, y + (yvel / 8) - yvel / 6 + ss, 7, 7);
}

function draw() {
  frameRefresh();
}

function removeA(a, n){
  var b = [];
  for (var i = 0; i < a.length; i++) if (i != n) b[b.length] = a[i];
  return(b);
}
