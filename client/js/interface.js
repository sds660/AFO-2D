var demoEntities = [];
var offsetX = 0;
var offsetY = 0;
var centerX = WIDTH / 2;
var centerY = HEIGHT / 2;

var mouseX;
var mouseY;


var backgroundMusicOn = true;
var soundEffectsOn = true;
var timerDisplay = "00:00";

var fps = 60;
var fadeId = 0;
var timer = 0;


//timer for fade()
var time = 0.0;

var keys = {};

var game = {
      status: "loginMenu",
}

//adds key event
$(document).keyup(function (e) {
      if (e.keyCode == 77) {  //m key
            if (game.status === "pause" && level_dialog.dialog("isOpen")) {
                  closeLevelDialog();
            } else if (game.status === "playing" && !level_dialog.dialog("isOpen")) {
                  openLevelDialog();
            }
      }
      //if enter is pressed
      if (e.keyCode == 13) {
            //pressed when debug menu is open
            if (e.target.id == "adminPassword" && game.status === "debug") {
                  $("#adminLogin").click();
            }
            //pressed on login screen in password field
            if (e.target.id == "loginPassword" && $("#loginBtn").is(":visible")) {
                  $("#loginBtn").click();
            }
            //pressed on create Account screen in security answer field
            if (e.target.id == "loginSecurityAnswer" && $("#createAcctBtn").is(":visible")) {
                  $("#createAcctBtn").click();
            }
            //pressed on forgot password screen in security answer field
            if (e.target.id == "loginSecurityAnswer" && $("#resetAcctBtn").is(":visible")) {
                  $("#resetAcctBtn").click();
            }
            //pressed on level editor dialog in level name field
            if (e.target.id == "save_lvl_textbox" && menu_dialog.dialog("isOpen")) {
                  $("#save_button").click();
            }
            //pressed on account screen in confirm password field
            if (e.target.id == "confirmPwd" && $("#changePassword").is(":visible")) {
                  $("#changePassword").click();
            }
      }
});

//adds key event
$(document).keydown(function (e) {
      if (keys[16] && keys[68] && keys[18]) { //alt -shift-D opens debug
            //close debug if open
            if (game.status === "debug") {
                  closeDebug();
            }
            else {
                  openDebug();
            }
      }
      //open help/about/how to play menu
      if (keys[112]) {
            if (game.status === "about") {
                  hideAbout();
            }
            else {
                  showAbout();
            }
      }
      //R key is pressed
      if (keys[82]) {
            if (game.status === "playing") {
                  var restartTimer = 0;
                  setTimeout(function () {
                        if (keys[82]){
                              restartGame();
                        }
                  },1500);
            }
      }
      //if shift & t is pressed
      if (keys[84] && keys[16]) {
            if (game.status = "levelEditorContent") {
                  if (!$("#editor_menu_dialog").is(":visible")) {
                        testEditorLevel();
                  }
            }
      }
});

//check array of imgs to see which one is selected when clicked on main menu canvas
checkClicked = function (a) {
      for (i = 0; i < a.length; i++) {
            if (a[i].selected == true) {
                  if (a[i].function != "settings" && a[i].function != "actSettings") {
                        fadeId = setInterval("fadeOut()", 1000 / fps);

                        if (a[i].function == "selectLevel") {
                              createCampaignLevels(campaignLevels);
                              addJquery("play");
                        }
                        clearInterval(timer);
                        if (socket) {
                              countUserLevels();
                        }
                        //console.log("here")
                  }
                  else {
                        a[i].selected = false;
                        $("#" + a[i].function).show();
                        if (a[i].function == "actSettings") {
                              $("#changePasswordTable").hide();
                        }
                        getSettingsValues();
                  }
                  updateStatus(checkImgFunction(a[i]));
                  a[i].selected = false;
            }

      }
}
//depending on game status, checks for different imgs on page to see if they are clicked or not
checkClick = function (mouseEvent) {
      if (game.status == "mainMenu") {
            checkClicked(menuImgs);
      }
}

updateFPS = function (newFPS) {
      fps = newFPS;
}
restartGame = function () {
      updateTimePlayed();
      closeAllDialogs();
      currentLevel.entities.forEach(function (element) {
            var nom = element.name.replace(/[0-9]/g, "");
            if (element.hasOwnProperty("collected")) {
                  element.collected = false;
            } else if (element.hasOwnProperty("HP")) {
                  element.xPos = element.xPosInitial;
                  element.yPos = element.yPosInitial;
            } else if (nom === "dugdirt") {
                  element.name = element.name.substring(3, element.name.length);
                  element.isSolid = false;
            }
      });
      loadLevel(currentLevel);
}
showSettings = function () {
      closeAllDialogs();
      updateStatus("pause");
      $("#settings").show();
      $("#settings").addClass("inGameDisplay");

}


showAbout = function () {
      closeAllDialogs();
      document.body.removeEventListener("mousemove", checkPos);
      $("#about").show();
      updateStatus("about");
}

hideAbout = function () {
      document.body.addEventListener("mousemove", checkPos);
      $("#about").hide();
      updateStatus(game.lastStatus);
}



deleteLevel = function (level) {
      var id;
      if (!level) {
            id = $(".listClicked").attr("id");
            $(".listClicked").click();
      }
      else {
            id = level.uniqueID;
      }

      //if server is running
      if (socket) {
            socket.emit("deleteLevel", id, function (data) {
                  console.log("Level Deleted");
                  countUserLevels();
                  if (game.lastStatus === "levelEditorContent") {
                        addJquery("edit");
                  }
                  else {
                        addJquery("play");
                  }
            });
      }
      else {
            for (var i in myLevels) {
                  if (myLevels[i].uniqueID === id) {
                        myLevels.splice(i, 1);
                  }
            }
      }
      $("#rightclickEdit").hide();
      openLoader($("#myLevelView"), 2200);
      generateMyLevels();
      setTimeout(function () {
            if (game.lastStatus === "levelEditorContent") {
                  addJquery("edit");
            }
            else {
                  addJquery("play");
            }
      }, 2100);
}


openLoader = function (targetElement, time, fullscreen) {
      document.body.removeEventListener("mousemove", checkPos);

      if (fullscreen) {
            $(targetElement).loader({ fullScreen: true });
      }
      else {
            $(targetElement).loader();
      }
      setTimeout(closeLoader, time);

}

closeLoader = function () {
      $.loader.close();
      setTimeout(function () {
            if ($("#about").is(":visible") != true) {
                  document.body.addEventListener("mousemove", checkPos);
            }
      }, 500);
}


hideSettings = function () {
      if (game.status === "pause") {
            $("#settings").hide();
            openLevelDialog();
      }
      else {
            backToMain();
      }
}

backToMain = function () {
      if (game.lastStatus == "pause") {
            updateTimePlayed();
      }
      currentLevel = undefined;
      generateMyLevels();
      pauseSounds();
      closeAllDialogs();
      $("#levelEditorContent").hide();
      $(".menuPopup").hide();
      $("#canvas").show();
      $("#ctx").show();
      openLoader($("#ctx"), 1200, "fullScreenLoader");
      updateStatus("mainMenu");
      $("#level_menu_button").hide();
      $("#back_to_editor_button").hide();
      $("#back_to_editor").hide();
      $("#publish_button").hide();
      $("#back_to_editor_completed").hide();
      $("#message_actSettings").html(".");
      hideStats();
}
/**
 * checks array of imgs that are passed to it to see if the mouse is over them or not, if the mouse 
 * is over an img, the img.selected = true. otherwise the img.selected remains = false. 
 */
checkSelected = function (a, x, y) {
      if (game.status == "mainMenu") {
            for (i = 0; i < a.length; i++) {
                  if (mouseX > x[i] && mouseX < (x[i] + a[i].width)) {
                        if (mouseY > y[i] && mouseY < y[i] + a[i].height) {
                              if (a[i].selectable != false) {
                                    a[i].selected = true;
                              }
                        } else {
                              a[i].selected = false;
                        }
                  } else {
                        a[i].selected = false;
                  }
            }
      }
}
//check if mouse is over an image drawn on canvas, if it is then the image is marked as selected by the checkSlected() function
checkPos = function (mouseEvent) {
      if (mouseEvent.pageX || mouseEvent.pageY == 0) {
            mouseX = mouseEvent.pageX - this.offsetLeft;
            mouseY = mouseEvent.pageY - this.offsetTop;
      } else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
            mouseX = mouseEvent.offsetX;
            mouseY = mouseEvent.offsetY;
      }
      //if player is on main menu
      if (game.status == "mainMenu") {
            checkSelected(menuImgs, menuOptionsX, menuOptionsY);
      }
}

//return function of clicked button
checkImgFunction = function (i) {
      if (i.function == null) {
            return game.status
      } else if (i.function != null) {
            if (i.function == "back") {
                  return game.lastStatus;
            } else {
                  return i.function;
            }
      } else {
            return "mainMenu";
      }
}

//returns x coordinate for an img that you wish to draw on the centre of the canvas
getCentreX = function (img) {
      var x = ct.width / 2 - img.width / 2;
      x = Math.round(x);
      return x;
}

//update game status
//types are mainMenu, settings, actSettings, playing, pause, levelEditorContent, loginMenDu
updateStatus = function (newStatus) {
      game.lastStatus = game.status;
      game.status = newStatus;
      if (game.status === "mainMenu") {
            $(".saveLoad").show();
      }
      else {
            $(".saveLoad").hide();
      }
}

//fade transition
fadeOut = function () {
      $("#canvas").show();
      $("#ctx").show();
      ctx.fillStyle = "rgba(0,0,0, 0.2)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      time += 0.05;
      if (time >= 2) {
            clearInterval(fadeId);
            time = 0;
            timer = setInterval(draw, 1000 / fps);
            $("#" + game.status).show();
            $("#canvas").hide();
      }
}

notImplemented = function () {
      console.log("Sorry, this feature has not been implmeneted yet...")
}

drawLayers = function (types) {
      for (var i = 0; i <= types.length; i++) {
            for (var ent in level.entities) {
                  var entity = level.entities[ent];
                  var newName = entity.name;
                  if (types[i] === "bg" && getBaseName(newName) !== "dugdirt") { continue; }
                  if (types[i] === "enemy" && !entity.hasOwnProperty("HP") || (entity.hasOwnProperty("HP") && entity.HP <= 0)) { continue; }
                  if (types[i] === "player") { player.draw(player.name); break; }
                  if (types[i] === "terrain" && (!entity.hasOwnProperty("type") || getBaseName(newName) === "dugdirt")) { continue; }
                  if (i === types.length && (entity.hasOwnProperty("HP") || entity.hasOwnProperty("type") || getBaseName(newName) === "dugdirt")) { continue; }
                  if (entity.xPos > centerX + WIDTH / 2) {
                        continue;
                  }
                  if (entity.xPos + entity.width < centerX - WIDTH / 2) {
                        continue;
                  }
                  if (entity.yPos > centerY + HEIGHT / 2) {
                        continue;
                  }
                  if (entity.yPos + entity.height < centerY - HEIGHT / 2) {
                        continue;
                  }
                  if (entity.hasOwnProperty("collected") && entity.collected) {
                        continue;
                  }
                  entity.draw(newName);
            }
      }
}

//main canvas draw loop
draw = function () {

      //game.status: mainMenu, selectLevel, settings, actSettings, playing, pause, levelEditorContent, loginMenu
      if (game.status === "mainMenu" || game.status === "settings" || game.status === "actSettings") {
            var tx = centerX - WIDTH / 2;
            var ty = centerY - HEIGHT / 2;
            ctx.translate(tx, ty);
            centerX = WIDTH / 2;
            centerY = HEIGHT / 2;
            drawMain();

      }
      if (game.status === "playing") {
            update();
            ctx.beginPath();
            var pCenterX = player.xPos + player.width / 2;
            var pCenterY = player.yPos + player.height / 2;
            var tx = centerX - pCenterX;
            var ty = centerY - pCenterY;
            ctx.translate(tx, ty);
            centerX = pCenterX;
            centerY = pCenterY;
            ctx.clearRect(centerX - WIDTH / 2, centerY - HEIGHT / 2, WIDTH, HEIGHT);
            drawLayers(["bg", "enemy", "player", "terrain"]);
            for (var egg in easterEggEntities) {
                  var eggEnt = easterEggEntities[egg];
                  eggEnt.draw(eggEnt.name);
            }
            ctx.fillStyle = "red";
            ctx.fillRect(centerX - WIDTH / 2 + 19, centerY - HEIGHT / 2 + 16, player.health * 3, 20);
            ctx.drawImage(imageList["healthBar"], centerX - WIDTH / 2 + 2, centerY - HEIGHT / 2 + 2);
            ctx.font = "30px Allerta Stencil";
            ctx.fillStyle = "black";
            ctx.drawImage(imageList["clock"], centerX - 90, centerY - HEIGHT / 2 + 2);
            ctx.fillText(timerDisplay, centerX - tileSize, centerY - HEIGHT / 2 + 41);
            ctx.stroke();
            ctx.closePath()
      }
}

//=======================================================
//draw level editor at 60fps

var timer = setInterval(draw, 1000 / fps);


//=======================================================
//debug menu 
openDebug = function () {
      getDebugVals();
      if (game.status === "playing" || game.status === "levelEditorContent") {
            $("#otherDebugButton").show();
      }
      else {
            $("#otherDebugButton").hide();
      }
      $("#debug").show();
      updateStatus("debug");
}
debugOther = function () {
      $("#debug").hide();
      $("#campaignEdit").show();
}
closeDebug = function () {
      $("#debug").hide();
      $("#campaignEdit").hide();
      $(".adminLogin").show();
      $(".saveCampaignLevels").hide();
      updateStatus(game.lastStatus);
}
getDebugVals = function () {
      $("#unlimitedHealthBox").prop("checked", unlimitedHealth);
      $("#unlimitedAmmoBox").prop("checked", unlimitedAmmo);
      $("#unlockCharactersBox").prop("checked", unlockCharacters);
}
updateDebugVals = function () {
      if ($("#unlimitedHealthBox").prop("checked")) {
            unlimitedHealth = true;
      }
      else {
            unlimitedHealth = false;
      }
      if ($("#unlimitedAmmoBox").prop("checked")) {
            unlimitedAmmo = true;
      }
      else {
            unlimitedAmmo = false;
      }
      if ($("#unlockCharactersBox").prop("checked")) {
            unlockCharacters = true;
            //unlock all characters if already playing a level
            if (game.lastStatus == "playing" || game.lastStatus == "pause") {
                  playableCharacters = [0, 1, 2, 3, 4];
            }
      }
      else {
            unlockCharacters = false;
            playableCharacters = [];
            for (var i = 0; i < 5; i++) {
                  if (currentLevel.characterTypes.substring(i, i + 1) == "1") {
                        playableCharacters.push(i);
                  }
            }
            characterNum = playableCharacters[0];
            switchPlayer();
      }
      closeDebug();


}
saveCampaignLocal = function (someLevel) {
      var levelToReplace = ($("#selectCampaignLevel").find(":selected").index()) + 1;
      if (!someLevel) {
            alert("You must save the level before you can save it as a PERMANANENT campaign level");
      }
      else {
            var thisLevel = JSON.parse(JSON.stringify(someLevel));
            if (socket) {
                  alert("Sorry, you must be in offline mode to save a campaign level, please logout and follow the instructions in the notes");
            }
            else {
                  var uID = thisLevel.uniqueID;
                  var index;
                  for (var j in campaignLevels) {
                        if ((campaignLevels[j].uniqueID).slice(8) === levelToReplace) {
                              index = i;
                        }
                  }
                  campaignLevels.splice(index, 1);
                  //ensure unique id is set correctly
                  thisLevel.uniqueID = ("campaign" + (levelToReplace));
                  campaignLevels.push(thisLevel);
                  console.log(myLevels);
                  console.log("uid: " + uID);
                  for (var i = 0; i < myLevels.length; i++) {
                        if (uID === myLevels[i].uniqueID) {
                              if (socket) {
                                    console.log("Level to delete")
                                    deleteLevel(myLevels[i]);
                              }
                        }
                  }
                  console.log(campaignLevels);
            }
      }
      var newCampaign = JSON.parse(JSON.stringify(campaignLevels));
      campaignLevels = newCampaign;
      // currentLevel = JSON.parse(JSON.stringify(currentLevel));
      // thisLevel=undefined;
      // closeDebug(); 
      // backToMain();
}

validateAdmin = function () {
      //password we are looking for
      var pass = "admin";
      //entered password
      var pass1 = $("#adminPassword").val();
      if (pass === pass1) {
            console.log("passwords match");
            console.log("admin access granted ");
            $(".adminLogin").hide();
            //populate campaign dropdown
            $("#selectCampaignLevel").empty();
            for (var i = 0; i < campaignLevels.length; i++) {
                  $("#selectCampaignLevel").append("<option> Level " + (i + 1) + " </option>");
            }
            $(".saveCampaignLevels").show();
            $("#adminPassword").val("");
      }
      else {
            console.log("passwords do not match");
      }
}
