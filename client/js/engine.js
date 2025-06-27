
var level_dialog;
var game_over_dialog;
var level_completed_dialog;
var gravity = 0.2;
var friction = 0.8;
var level = null;
var player = null;
var playableCharacters;
var characterNum;
var switchCooldownQ = false; var switchCooldownE = false; var switchCooldownUp = false; var switchCooldownW = false; var switchCooldownSpc = false;
var extraJump = true;
var countTimer = 0;
var unlimitedHealth = false;
var unlimitedAmmo = false;
var unlockCharacters = false;
var spikeCooldown = 0;
var wizardEasterEgg = false;
var easterEggEntities = [];

loadLevel = function (lvl) {
      for (var e in lvl.entities) {
            var ent = lvl.entities[e];
            var name = ent.name;
            var xPos = ent.xPos;
            var yPos = ent.yPos;
            var xPosInitial = ent.xPosInitial;
            var yPosInitial = ent.yPosInitial;
            lvl.entities[e] = getBaseLevelEntity(ent);
            lvl.entities[e].name = name;
            lvl.entities[e].xPos = xPos;
            lvl.entities[e].yPos = yPos;
            lvl.entities[e].xPosInitial = xPosInitial;
            lvl.entities[e].yPosInitial = yPosInitial;
      }
      level = lvl;
      level.time = 0;
      wizardEasterEgg = false;
      var background = level.background;
      if (background.startsWith("assets")) {
            $("#canvas_background").css("background-image", "url(\"" + background + "\")");
      } else {
            $("#canvas_background").css("background-image", "");
            $("#canvas_background").css("background-color", background);
      }
      playableCharacters = [];
      if (!unlockCharacters) {
            for (var i = 0; i < 5; i++) {
                  if (level.characterTypes.substring(i, i + 1) == "1") {
                        playableCharacters.push(i);
                  }
            }
      }
      else {
            playableCharacters = [0, 1, 2, 3, 4];
      }
      lvl = currentLevel;
      characterNum = 0;
      player = gameCharacters[playableCharacters[characterNum]];
      cleanupCharacters();
      player.xVel = 0;
      player.xPos = level.spawnX;
      player.yPos = level.spawnY;
      player.health = 100;
      pauseSounds();
      var sound = soundList[lvl.backgroundMusic];
      if (sound) {
            sound.currentTime = 0;
            sound.volume = backgroundMusicOn ? 0.3 : 0;
            sound.loop = true;
            sound.play();
      }
      updateStatus("playing");
}

$(document).ready(function () {
      document.addEventListener("contextmenu", function (e) {
            if (game.status == "playing") {
                  e.preventDefault();
            }
      }, false);
});

/**
 * Gets the standard Entity with predefined values given the name and type of entity
 */
getBaseLevelEntity = function (entity) {
      var name = entity.name;
      //enemy entity
      if (entity.hasOwnProperty("HP")) {
            return getStandardEnemies(name);
      }
      //item entity
      else if (entity.hasOwnProperty("collected")) {
            return getStandardItems(name);
      }
      //terrain entity
      else if (entity.hasOwnProperty("damage")) {
            return getStandardTerrains(name);
      }
}

$(document).ready(function () {


	/**
	 * setups the dialog box for the level menu
	 */
      level_dialog = $("#level_menu_dialog").dialog({
            autoOpen: false,
            width: 300,
            modal: true,
            position: { my: "center", at: "center", of: "#ctx" },
            title: "Pause Menu",
            close: function (event, ui) {
                  updateStatus("playing");
            }
      });

      game_over_dialog = $("#game_over_dialog").dialog({
            autoOpen: false,
            width: 300,
            modal: true,
            position: { my: "center", at: "center", of: "#ctx" },
            title: "GAME OVER",
            //Forces the player to choose one of the options in the dialog
            closeOnEscape: false,
            open: function (event, ui) {
                  $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            },
            close: function (event, ui) {
                  $(".ui-dialog-titlebar-close", ui.dialog | ui).show();
            }
      });

      level_completed_dialog = $("#level_completed_dialog").dialog({
            autoOpen: false,
            width: 300,
            modal: true,
            position: { my: "center", at: "center", of: "#ctx" },
            title: "Level Completed",
            //Forces the player to choose one of the options in the dialog
            closeOnEscape: false,
            open: function (event, ui) {
                  $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
            },
            close: function (event, ui) {
                  $(".ui-dialog-titlebar-close", ui.dialog | ui).show();
                  $("#message_completed").html("");
            }
      });
});

closeAllDialogs = function () {
      closeMenuDialog();
      closeGameOverDialog();
      closeLevelCompletedDialog();
      closeLevelDialog();
}

/**
* opens level menu dialog
*/
openLevelDialog = function () {
      $("#pauseIMG").hide();
      $("#playIMG").show();
      level_dialog.dialog("open");
      updateStatus("pause");
}

/**
* closes level menu dialog
*/
closeLevelDialog = function (gameStatus) {
      level_dialog.dialog("close");
      $("#pauseIMG").show();
      $("#playIMG").hide();
      if (gameStatus) {
            updateStatus(gameStatus);
      }
}

/**
* opens level completed dialog
*/
openLevelCompletedDialog = function () {
      $("#publish_button").hide();
      $("#next_campaign_button").hide();
      if (socket && !currentLevel.isPublished && currentLevel.uniqueID.length > 0 && !currentLevel.uniqueID.startsWith("campaign")) {
            $("#publish_button").show();
      }
      if (currentLevel.uniqueID.startsWith("campaign")){
            var campaignNum = parseInt((currentLevel.uniqueID).slice(8));
            if (campaignNum <20){
                  $("#next_campaign_button").show();
            }

      }
      level_completed_dialog.dialog("open");
}

/**
* closes level completed dialog
*/
closeLevelCompletedDialog = function () {
      level_completed_dialog.dialog("close");
}

/**
* opens game over dialog
*/
openGameOverDialog = function () {
      pauseSounds();
      playSoundFX("game_over");
      updateFails();
      updateTimePlayed();
      player.health = 0;
      game_over_dialog.dialog("open");
}

/**
 * adds fail to level stat
 */
updateFails = function() {
      var username = user ? user.username : "";
      var newStat = new LevelStat(username, 1, 0, -1);
      if(socket) { 
            socket.emit("addFailure", {"lvlId":currentLevel.uniqueID, "stat":newStat});
      } else {
            var stats = currentLevel.userStats
            var stat;
            var playedBefore = false
            for(var index in stats) {
                  stat = stats[index];
                  if(stat.username == newStat.username) {
                        stat.fails++;
                        playedBefore = true;
                        break;
                  }
            }
            if(!playedBefore) {
                  stats.push(newStat);
            }
      }
}

updateTimePlayed = function () {
      if(socket) {
            user.timePlayed += currentLevel.time;
            socket.emit("updateUser", {username:user.username, parameter:"timePlayed", value:user.timePlayed}, function(data) { });
      }
}

/**
* closes game over dialog
*/
closeGameOverDialog = function () {
      game_over_dialog.dialog("close");
}

cleanupCharacters = function() {
      easterEgg = [];
      easterEggEntities = [];
      for (var i in playableCharacters) {
            p = gameCharacters[playableCharacters[i]];
            p.arrows = [];
      }
}

/**
 * Helper function to return to the level editor from the menu
 */
backToEditor = function () {
      pauseSounds();
      $("#levelEditorContent").show();
      $("#canvas").hide();
      $("#back_to_editor_button").hide();
      $("#back_to_editor").hide();
      $("#publish_button").hide();
      $("#back_to_editor_completed").hide();
      closeAllDialogs();
      updateStatus("levelEditorContent");
}

switchPlayer = function () {
      var pXPos = player.xPos; var pYPos = player.yPos;
      var pXVel = player.xVel; var pYVel = player.yVel;
      var pHealth = player.health; var pJumping = player.jumping;
      var arrows = player.arrows;
      player = gameCharacters[playableCharacters[characterNum]];
      playerOGName = player.name;
      player.xPos = pXPos; player.yPos = pYPos;
      player.xVel = pXVel; player.yVel = pYVel;
      player.health = pHealth; player.jumping = pJumping;
      player.arrows = arrows;
}

playerJump = function () {
      if (!player.jumping) {
            playSoundFX("jump");
            if (player.name == "jumper" && extraJump) {
                  player.jumping = false;
                  extraJump = false;
            }
            else { player.jumping = true; }
            player.yVel = -player.speed * 1.7;
      }
}

/**
 * functions to update the player position and state if anything changes
 * via keypresses. Also handles key event for opening the menu
 */
update = function () {
      countTimer++;
      if (countTimer >= 999999) { countTimer = 0; }
      checkForEasterEgg();
      update.player();
      update.enemies();
}

getLastEgg = function(num) {
      var egg = "";
      for (var i=num; i>0; i--) { egg+=easterEgg[easterEgg.length-i]; }
      return egg;
}

checkForEasterEgg = function() {
      for (var egg in easterEggEntities) {
            var eggEnt = easterEggEntities[egg];
            eggEnt.move();
      }
      if (easterEgg.length >= 20) { easterEgg = []; }
      var e = easterEgg;
      var l = easterEgg.length;
      if (!wizardEasterEgg && getLastEgg(6) === "WIZARD") {
            wizardEasterEgg = true;
            easterEgg = [];
            for (var e in level.entities) {
                  var ent = level.entities[e];
                  easterEggEntities.push(new Enemy("wizard",ent.xPos/25,ent.yPos/25-2,2,2,0,0,100,"","",999,0));
            }
      }
}

update.player = function () {
      if (keys[87] && !switchCooldownW) { playerJump(); switchCooldownW = true; } // w
      if (keys[38] && !switchCooldownUp) { playerJump(); switchCooldownUp = true; } // up
      if (keys[68] || keys[39]) { // d / right
            if (player.xVel < player.speed) {
                  player.xVel++;
                  player.direction = "right";
            }
      }
      else if (keys[65] || keys[37]) { // a / left
            if (player.xVel > -player.speed) {
                  player.xVel--;
                  player.direction = "left";
            }
      }
      if (keys[32] && !switchCooldownSpc) { // space
            switchCooldownSpc = true;
            if (player.canDig) {
                  for (var e in level.entities) {
                        var ent = level.entities[e];
                        var nom = ent.name.replace(/[0-9]/g, "");
                        if (player.isOnTop(ent) && nom === "dirt") {
                              ent.isSolid = false;
                              ent.name = "dug" + ent.name;
                        }
                  }
            }
            if (player.name === "archer") {
                  level.time+=0.5;
                  if (player.direction === "left") {
                        player.arrows.push(new Enemy("arrow",player.xPos/25+0.5,player.yPos/25+0.5,1,1,-400,0,3,"",0,1,3));
                  }
                  else if (player.direction === "right") {
                        player.arrows.push(new Enemy("arrow",player.xPos/25+0.5,player.yPos/25+0.5,1,1,400,0,3,"",0,1,3));
                  }
            }
      }
      if (keys[81] && !switchCooldownQ) { // q
            characterNum--;
            if (characterNum < 0) { characterNum = playableCharacters.length - 1; }
            switchCooldownQ = true;
            switchPlayer();
      }
      else if (keys[69] && !switchCooldownE) { // e
            characterNum++;
            if (characterNum > playableCharacters.length - 1) { characterNum = 0; }
            switchCooldownE = true;
            switchPlayer();
      }
      if (!keys[81]) { switchCooldownQ = false; }
      if (!keys[69]) { switchCooldownE = false; }
      if (!keys[87]) { switchCooldownW = false; }
      if (!keys[38]) { switchCooldownUp = false; }
      if (!keys[32]) { switchCooldownSpc = false; }

      player.xVel *= friction;
      player.yVel += gravity;
      if (player.yVel >= 24) { player.yVel = 24; }
      if (player.yvel <= -24) { player.yVel = -24; }
      player.cooldown -= 1;
      spikeCooldown -= 1;

      player.xPos += player.xVel * 2;
      player.yPos += player.yVel * 2;
      player.xPos = parseInt(player.xPos.toFixed());

      if (game.status == "playing") {
            level.time += 1 / fps;
            if (level.time >= 59999) { level.time = 59999; }
            var fakeTime = Math.floor(level.time);
            var sec = fakeTime % 60;
            var min = Math.floor(fakeTime / 60);
            timerDisplay = (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
      }

      if (player.yPos + player.height >= 2500) {
            updateStatus("GameOver");
            openGameOverDialog();
      }
      if (player.health <= 0) {
            updateStatus("GameOver");
            openGameOverDialog();
      }
      for (var ent in level.entities) {
            var e = level.entities[ent];
            if (e.hasOwnProperty("HP") && e.HP > 0) { e.cooldown -= 1; }
            if (e.name === "wizard") {
                  for (var f in e.fireballs) {
                        var fireball = e.fireballs[f];
                        if (fireball.isColliding(player) && player.cooldown <= 0) {
                              if (!unlimitedHealth) {
                                    if (fireball.HP > 0) {
                                          player.health -= 40;
                                          player.cooldown = 2 * fps;
                                          playSoundFX("enemy_hit");
                                    }
                              }
                              fireball.HP = 0;
                        }
                        for (var ent2 in level.entities) {
                              var e2 = level.entities[ent2];
                              if (fireball.isColliding(e2) && e2.isSolid) { fireball.HP = 0; }
                        }
                  }
            }
            if (player.isColliding(e)) {
                  if (!e.isSolid) {
                        //Enemy
                        if (player.isOnTop(e) && player.yVel > 0 && (player.name === "fighter" || player.name === "jumper") && (e.hasOwnProperty("HP") && e.HP > 0)) {
                              switch (e.name) {
                                    case "alligator":
                                          player.yPos = e.yPos - 1 - player.height;
                                          player.yVel = -player.speed * 1.3;
                                          continue;
                                          break;
                                    case "bat":
                                          player.yPos = e.yPos - 1 - player.height;
                                          player.yVel = -player.speed * 1.1;
                                          if (player.name === "fighter") { e.HP = 0; }
                                          continue;
                                          break;
                                    case "guard":
                                          player.yPos = e.yPos - 1 - player.height;
                                          player.yVel = -player.speed;
                                          if (player.name === "fighter") { e.HP -= 2; }
                                          continue;
                                          break;
                                    case "heavyGuard":
                                          player.yPos = e.yPos - 1 - player.height;
                                          player.yVel = -player.speed;
                                          continue;
                                          break;
                                    case "rat":
                                          if (player.name === "fighter") { e.HP = 0; }
                                          continue;
                                          break;
                                    case "snake":
                                          player.yPos = e.yPos - 1 - player.height;
                                          player.yVel = -player.speed;
                                          if (player.name === "fighter") { e.HP -= 5; }
                                          continue;
                                          break;
                                    case "wizard":
                                          if (player.name === "fighter") { e.HP = 0; }
                                          continue;
                                          break;
                                    default:
                                          break;
                              }
                        }
                        else if (e.hasOwnProperty("type")) {
                              if (getBaseName(e.name) === "lava") {
                                    if (!unlimitedHealth) {
                                          player.health--;
                                    }
                              }
                              if (getBaseName(e.name) === "water" && player.name !== "swimmer") {
                                    if (countTimer % 6 === 0) {
                                          if (!unlimitedHealth) {
                                                player.health--;
                                          }
                                          player.xVel = player.xVel / 2;
                                          player.yVel = player.yVel / 1.3;
                                    }
                              }
                              if (getBaseName(e.name) === "spike") {
                                    if (spikeCooldown <= 0) {
                                          spikeCooldown = 50;
                                          if (!unlimitedHealth) {
                                                player.health -= 30
                                          }
                                    };
                              }
                        }
                        //enemy
                        if (e.hasOwnProperty("HP") && player.cooldown <= 0) {
                              if (!unlimitedHealth) {
                                    if (e.HP > 0) { 
                                          player.health -= e.damage;
                                          player.cooldown = 1 * fps;
                                          playSoundFX("enemy_hit");
                                    }
                              }
                        }
                        //Item
                        else if (e.hasOwnProperty("collected")) {
                              if (!e.collected) {
                                    if (e.specialPower === "health") {
                                          player.health += e.value;
                                          if (player.health > 100) {
                                                player.health = 100;
                                          }
                                    } else if (e.specialPower === "time") {
                                          level.time -= e.value;
                                          if (level.time < 0) {
                                                level.time = 0;
                                          }
                                    } else if (e.specialPower === "checkpoint") {
                                          completedLevel();
                                    }
                                    if(e.specialPower != "checkpoint") {
                                          playSoundFX("item_collection");
                                    } else {
                                          playSoundFX("level_complete");
                                    }
                                    console.log("You got a " + e.name + "!");
                                    e.collected = true;
                              }
                        }
                        continue;
                  }
                  if (player.isOnLeft(e)) {
                        player.xPos = e.xPos - player.width - 1;
                  }
                  else if (player.isOnRight(e)) {
                        player.xPos = e.xPos + e.width + 1;
                  }
                  else {
                        if (player.isOnTop(e)) {
                              player.yVel = 0;
                              player.yPos = e.yPos - player.height;
                              player.jumping = false;
                              extraJump = true;
                        }
                        else if (player.isOnBottom(e)) {
                              player.yVel = 0;
                              player.yPos = e.yPos + e.height;
                        }
                  }
            }
      }
}

update.enemies = function () {
      for (var e in level.entities) {
            var enemy = level.entities[e];
            enemy.move();
      }
}

playSoundFX = function (soundName) {
      var sound = soundFXList[soundName]
      sound.currentTime = 0;
      sound.volume = soundEffectsOn ? 1 : 0;
      sound.play();
}

completedLevel = function () {
      updateStatus("pause");
      pauseSounds();
      updateUserStats();
      updateTimePlayed();
      if (level.uniqueID.startsWith("campaign")) {
            var campaignNum = (level.uniqueID).slice(8);
            if (socket) {
                  if (campaignNum > user.highestCampaign) {
                        user.highestCampaign = campaignNum;
                        socket.emit("updateHighestCampaign", user, function (data) {
                              // console.log("highest campaign updated");
                        });
                  }
            }
            else {
                  if (campaignNum > guestCampaignHighest) {
                        guestCampaignHighest = campaignNum;
                  }
            }
      }
      openLevelCompletedDialog();
}

updateUserStats = function () {
      var newTime = level.time;
      if (newTime >= 0) {
            var username = user ? user.username : "";
            var newStat = new LevelStat(username, 0, 1, newTime);
            var newTopTime = new TopTime(0, username, newTime);
            if (socket) {
                  socket.emit("updateLevelStats", { "lvlId": level.uniqueID, "stat": newStat, "topTime": newTopTime }, function() { });
            } else {
                  var statUpdated = false;
                  for (var i in level.userStats) {
                        var stat = level.userStats[i];
                        if (stat.username == newStat.username) {
                              statUpdated = true;
                              if (stat.time > newStat.time || stat.time < 0) {
                                    stat.time = newStat.time;
                              }
                              break;
                        }
                  }
                  if (!statUpdated) {
                        level.userStats.push(newStat);
                  }
            }
      }
}

publishLevel = function () {
      level.isPublished = true;
      if (socket) {
            socket.emit("getLevel", { "lvlId": level.uniqueID }, function (data) {
                  if (data.length > 0) {
                        socket.emit("publishLevel", level, function (response) {
                              if (response.success) {
                                    $("#message_completed").html("level Published");
                              } else {
                                    $("#message_completed").html("level must be saved to publish");
                              }
                        });
                  } else {
                        $("#message_completed").html("level must be saved to publish");
                  }
            });
      } else {
            $("#message_completed").html("Must be in online mode to publish");
      }
}