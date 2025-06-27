var menu_dialog;
var zoom_dialog;
var currentLevel;
var soundTimer;
var selectedEntity;

//These must be implemented after page has been loaded
$(document).ready(function () {
      populateAllEntityMenus();
	/**
	 * When an entity is placed over the remove div, it is removed from the level
	 */
      $("#droppable_remove").droppable({
            accept: ".level_entity",
            drop: function (event, ui) {
                  $(ui.draggable).remove();
            }
      });

	/**
	 * Basically everything to do with positioning the entities in a level
	 */
      $("#droppable_grid").droppable({
            accept: ".draggable, .level_entity",
            over: function (event, ui) {
                  $(".draggable").draggable();
            },
            out: function (event, ui) {
                  $(".draggable").draggable("option", "grid", false);
            },
            drop: function (event, ui) {
                  var element = $(ui.draggable).clone();
                  var element_classes = element[0].className;
                  //checks if element was already dropped on droppable area
                  if (!element_classes.includes("level_entity")) {
                        element.addClass("level_entity");
                        element.removeClass("ui-draggable ui-draggable-handle draggable");
                        //gets position that entity was dropped at
                        var pos = ui.offset;
                        var grid_offset = $(this).offset()
                        var x_pos = pos.left - grid_offset.left;
                        var y_pos = pos.top - grid_offset.top;
                        //ensures multiple of 25 for grid
                        var x_mod = x_pos % tileSize;
                        var y_mod = y_pos % tileSize;
                        x_pos -= x_mod;
                        if (x_mod > 12) {
                              x_pos += tileSize;
                        }
                        y_pos -= y_mod;
                        if (y_mod > 12) {
                              y_pos += tileSize;
                        }
                        //places entity at position dropped
                        element.css("left", (x_pos < 0 ? 0 : x_pos));
                        element.css("top", (y_pos < 0 ? 0 : y_pos));
                        element.css("position", "absolute");
                        //attaches entity to grid
                        $(this).append(element);
                        enableDroppedDragging();
                  }
                  enableGraphicChoice();
            }
      });

	/**
	 * checks the desired block for characters
	 */
      $(".character_entity").click(function (event) {
            var clickedId = event.target.id;
            $("#" + clickedId + "Checkbox").show();
      });
      /**
	 * unchecks the character box when selected 
	 */
      $(".characterCheckbox").click(function (event) {
            var clickCheckboxId = event.target.id;
            $("#" + clickCheckboxId).hide();
      });

	/**
	 * selects/deselects the desired block for sounds
	 */
      $(".sound_entity").click(function (event) {
            var clickedId = event.target.id;
            var playSample = $("#" + clickedId).attr("src") === "assets/playing-sound.png";
            if(playSample) {
                  pauseSounds();
                  var sound = soundList[clickedId];
                  sound.volume = 0.3;
                  sound.currentTime = 0;
                  sound.play();
                  //plays sound for 10 seconds
                  soundTimer = setTimeout(function () {
                        sound.pause();
                  }, 10000);
                  $(".sound_entity").attr("src", "assets/playing-sound.png");    //return all to .png image
                  $("#" + clickedId).attr("src", "assets/playing-sound.gif");    //replace .png image with .gif
            } else {
                  clearTimeout(soundTimer);
                  pauseSounds();
                  $(".sound_entity").attr("src", "assets/playing-sound.png");    //return all to .png image
            }
      });

	/**
	 * checks the desired block for backgrounds
	 */
      $(".background_entity").click(function (event) {
            var clickedId = event.target.id;
            if (clickedId === "colorWheel") {
                  $("#colorWheelInput").trigger("click");
            } else {
                  var background_src = event.target.src;
                  var background = background_src.substring(background_src.indexOf("assets/"));
                  $("#new_background_div").css("background-image", "url('" + background + "')");
                  $(".backgroundCheckbox").hide();
                  $("#" + clickedId + "Checkbox").show();
            }
      });

	/**
	 * by default checks the fighter character box so one character is selected
	 */
      $("#fighter").trigger("click");

	/**
	 * positions character in default position on grid
	 */
      initCharacterSpawn();

	/**
	 * setups the dialog box for the main menu
	 */
      menu_dialog = $("#editor_menu_dialog").dialog({
            autoOpen: false,
            width: 300,
            modal: true,
            position: { my: "center", at: "center", of: "#level_editor" },
            title: "Level Editor Menu",
            close: function (event, ui) {
                  $("#message_editor").html("");
                  $("#load_lvl_button").show();
                  $("#load_lvl_textbox").hide();
                  $("#load_button").hide();
                  $("#save_lvl_button").show();
                  $("#save_lvl_textbox").hide();
                  $("#save_button").hide();
            }
      });

      zoom_dialog = $("#zoom_dialog").dialog({
            autoOpen: false,
            height: 50,
            width: 100,
            modal: true,
            classes: {
                  "ui-dialog": "no-header-dialog"
            }
      });

      /**
       * zooms editor when mouse is over window and zoom dialog is displayed or not over the body
       */
      $(window).bind("mousewheel", function (event) {
            var targetName = event.target.tagName;
            if($("#zoom_dialog").is(":visible") || (targetName !="BODY" && $("#levelEditorContent").is(":visible"))) {
                  zoomEditor(event);
            }
      });

	/**
	 * hides image selection menu when clicked outside of the div
	 */
      $(document).mouseup(function (event) {
            var graphicDiv = $("#graphicChoiceDiv");
            if (!graphicDiv.is(event.target) && graphicDiv.has(event.target).length === 0 && event.which != 3) {
                  graphicDiv.hide();
                  selectedEntity = null;
            }
            if ($("#rightclickEdit").is(":visible") && event.which === 1) {
                  $("#rightclickEdit").hide();
            }
      });

      /**
       * prevents context menu from appearing when right clicking to view alternate entity images
       */
      $("body").on("contextmenu", ".level_entity", function (e) { return false; });

      /**
       * brings up the menu when the "m" key is pressed
       */
      $(document).keydown(function (event) {
            if (event.which == 77 && game.status === "levelEditorContent") {
                  menu_dialog.dialog("open");
            }
      });

	/**
	 * prompts a user warning if the page is about to be refreshed
	 */
      window.onbeforeunload = function () {
            if (!socket) {
                  alert("You are playing offline, you may want to save your levels for future use");
            }
            return "All unsaved changes/additions made to level will be lost, are you sure?";
      };

      /**
       * drag grid in editor
       */
      $("#background_div").draggable({
            drag: function (event, ui) {
                  ui.helper.css("position", "absolute");
                  var pos = ui.position;
                  if (pos.left > 0) {
                        pos.left = 0;
                  }
                  if (pos.left < -3900) {
                        pos.left = -3900;
                  }
                  if (pos.top > 100) {
                        pos.top = 100;
                  }
                  if (pos.top < -1500) {
                        pos.top = -1500;
                  }
            }
      });

      /**
       * Changes background color on level editor
       */
      $("#colorWheelInput").change(function () {
            var color = $("#colorWheelInput").val();
            $("#new_background_div").css("background-image", "");
            $("#new_background_div").css("background-color", color);
            $(".backgroundCheckbox").hide();
            $("#colorWheelCheckbox").show();
      });

      $("#colorWheelCheckbox").click(function (event) {
            $("#colorWheelInput").trigger("click");
      });
});

/**
 * opens menu dialog
*/
openMenuDialog = function () {
      menu_dialog.dialog("open");
}

/**
 * closes menu dialog
 */
closeMenuDialog = function () {
      menu_dialog.dialog("close");
}

/** 
 * displays the appropiate buttons and fields when "load level" button is pressed
*/
displayLoadEditorInput = function () {
      createCampaignLevels(campaignLevels);
      openLoader($("#levelEditorContent"),2500,"fullScreenLoader");
      setTimeout(function () {
            $("#selectLevel").show();
            $("#levelEditorContent").hide();
      },200);
      updateStatus("selectLevel");
      setTimeout(function () {
            addJquery("edit");
      },1000);

    
      closeAllDialogs();
      // $("#selectLevel").show();

      // $("#load_lvl_button").hide();
      // $("#load_lvl_textbox").show();
      // $("#load_button").show();
}

/** 
 * displays the appropiate buttons and fields when "save level" button is pressed
*/
displaySaveEditorInput = function () {
      $("#save_lvl_button").hide();
      $("#save_lvl_textbox").show();
      $("#save_button").show();
}

/**
 * Makes dropped entities draggable
 * and duplicates the entity on shift, left click
 */
enableDroppedDragging = function () {
      $(".level_entity").draggable({
            revert: "invalid",
            grid: [tileSize, tileSize],
            start: function (event, ui) {
                  if (event.shiftKey) {
                        var newElement = $(ui.helper).clone();
                        $("#droppable_grid").append(newElement);
                        enableDroppedDragging();
                  }
            }
      });
}

/**
 * zooms editor, displays magnification
 */
var lastVisibleMenu;
zoomEditor = function (event) {
      var maxZoom = 1;
      var minZoom = 0.3;
      var updateZoom = false;
      var prevMagnification = $("#background_div").css("zoom");
      var curMagnification;

      if (event.originalEvent.wheelDelta > 0) {
            curMagnification = parseFloat(prevMagnification) - 0.1;
            if (curMagnification > minZoom) {
                  updateZoom = true;
            }
      } else {
            curMagnification = parseFloat(prevMagnification) + 0.1;
            if (curMagnification <= maxZoom) {
                  updateZoom = true;
            }
      }

      if (updateZoom) {
            //reenable menus
            if(curMagnification == 1) {
                  $("#top_menu_zoom").hide();
                  if(lastVisibleMenu) {
                        $("#" + lastVisibleMenu).show();
                  }
                  $(".level_entity").draggable("enable");
            }
            //disable menus
            else {
                  var menus = $(".entity_menu");
                  if(prevMagnification == 1){
                        lastVisibleMenu = null;
                        for(var index in menus) {
                              var menuId = menus[index].id;
                              if($("#" + menuId).is(":visible")){
                                    lastVisibleMenu = menuId;
                                    break;
                              }
                        }
                  }
                  $("#top_menu_zoom").show();
                  $(".entity_menu").hide();
                  $(".level_entity").draggable("disable");
            }
            var zoomPercent = Math.round(curMagnification * 100);
            $("#zoom_dialog").html(zoomPercent + "%");
            $("#background_div").css("zoom", curMagnification);
            zoom_dialog.dialog("open");
            setTimeout(function () {
                  zoom_dialog.dialog("close");
            }, 500);
      }
}

/**
 * displays appropriate menu when associated with clicked menu
 */
showEntityMenu = function (menu) {
      var menuWasVisible = $("#" + menu + "_menu").is(":visible");
      $("#enemy_menu").hide();
      $("#terrain_menu").hide();
      $("#item_menu").hide();
      $("#background_menu").hide();
      $("#character_menu").hide();
      $("#sound_menu").hide();
      if (!menuWasVisible) {
            $("#" + menu + "_menu").show();
      }
}

/**
 * gets all possible entities and adds them to the appropriate list on the level editor screen
 */
populateAllEntityMenus = function () {
      var standardEnemies = getStandardEnemies();
      for (var name in standardEnemies) {
            if (name != "fireball" && name != "arrow") {
                  var entity = standardEnemies[name];
                  $("#enemy_menu").append("<div name='" + entity.name + "' style='background-image: url(\"" + imageList[entity.name].src + "\"); height: " + entity.height + "px; width: " + entity.width + "px' class='draggable enemy_entity'></div><br>");
            }
      }
      var standardTerrains = getStandardTerrains();
      for (var name in standardTerrains) {
            var entity = standardTerrains[name];
            $("#terrain_menu").append("<div name='" + entity.name + "' style='background-image: url(\"" + imageList[entity.name].src + "\"); height: " + entity.height + "px; width: " + entity.width + "px' class='draggable terrain_entity'></div><br>");
      }
      var standardItems = getStandardItems();
      for (var name in standardItems) {
            var entity = standardItems[name];
            var image = imageList[entity.name];
            var startHeight = (image.height / 3 - entity.height - (entity.height % 25)) * 100 / image.height;
            var startWidth = (image.width / 3 - entity.width - (entity.width % 25)) * 100 / image.width;
            var entityHtml = "<div name='" + entity.name + "' style='background-position: " + startWidth + "% " + startHeight + "%; background-image: url(\"" + image.src + "\"); height: " + entity.height + "px; width: " + entity.width + "px' class='draggable item_entity'></div><br>";
            $("#item_menu").append(entityHtml);
      }

      for (i = 0; i < editorBackgrounds.length; i++) {
            var entity = editorBackgrounds[i];
            var entityHtml = "<div>" +
                  "<img id='" + entity.name + "Checkbox' src='assets/gameImages/checkmark.png' class='backgroundCheckbox'>" +
                  "<img id='" + entity.name + "' src='" + entity.image_src + "' class='check_entity background_entity'>" +
                  "</div>";
            $("#background_menu").append(entityHtml);
      }

      for (i = 0; i < editorSounds.length; i++) {
            var entity = editorSounds[i];
            var entityHtml = "<div>" +
                  "<img id='" + entity.name + "' src='" + entity.image_src + "' class='check_entity sound_entity'>" +
                  "</div>";
            $("#sound_menu").append(entityHtml);
      }
      for (i = 0; i < gameCharacters.length; i++) {
            var entity = gameCharacters[i];
            var name = entity.name;
            var entityHtml = "<div>" +
                  "<img id='" + name + "Checkbox' src='assets/gameImages/checkmark.png' class='characterCheckbox'>" +
                  "<div id='" + name + "' style='background-image: url(\"assets/menuImages/" + (name == "jumper" ? "ninja" : name) + "-icon.png\");' class='check_entity character_entity'>" +
                  "</div><br>";
            $("#character_menu").append(entityHtml);
      }

      //makes all entities added to grid draggable
      $(".draggable").draggable({
            revert: false,
            distance: 50,
            helper: "clone",
            cursorAt: { left: 0 },
            zIndex: 100
      });
}

/**
 * Allows any entity on the grid to display various image choices for that entity
 */
enableGraphicChoice = function () {
      $(".terrain_entity").mouseup(function (event) {
            if (event.which === 3 && event.shiftKey) {
                  var entity = event.target;
                  selectedEntity = entity;
                  var entityName = entity.getAttribute("name");
                  var position = $(entity).position();
                  //creates table containing possible images for entity
                  var graphicChoiceHTML = "<table><tr>";
                  for (var name in imageList) {
                        if (name.startsWith(entityName.replace(/[0-9]/g, "")) && name !== entityName.replace(/[0-9]/g, "")) {
                              var image = imageList[name];
                              graphicChoiceHTML = graphicChoiceHTML + "<td><img name='" + name + "' src='" + image.src + "' height='40' onclick='changeGraphic(this.name)'></td>";
                        }
                  }
                  graphicChoiceHTML = graphicChoiceHTML + "</tr></table>";

                  var graphicDiv = $("#graphicChoiceDiv");
                  graphicDiv.html(graphicChoiceHTML);
                  var y_pos = position.top;
                  var x_pos = position.left;
                  if (y_pos < 75) {
                        y_pos = y_pos + entity.offsetHeight;
                  } else {
                        y_pos = y_pos - 75;
                  }
                  graphicDiv.css("top", y_pos);
                  graphicDiv.css("left", x_pos);
                  graphicDiv.show();
            }
      });
}

/**
 * Changes the graphic representing the entity
 */
changeGraphic = function (newGraphicName) {
      selectedEntity.setAttribute("name", newGraphicName);
      $(selectedEntity).css("background-image", "url('" + imageList[newGraphicName].src + "')");
      $("#graphicChoiceDiv").hide();
      selectedEntity = null;
}

/**
 * Places character in initial spawn position
 */
initCharacterSpawn = function () {
      var entity = gameCharacters[0];
      var image = imageList[entity.name];
      var startHeight = (image.height / 4 - 100) * 100 / image.height;
      var startWidth = (image.width / 3 - 50) * 100 / image.width;
      var htmlString = "<div id='spawnCharacter' style='background-repeat:no-repeat; background-position: " + startWidth + "% " + startHeight + "%; background-image: url(\"" + image.src + "\"); height:" + entity.height + "px; width:" + entity.width + "px'></div>";
      $("#droppable_grid").append(htmlString);
      $("#spawnCharacter").draggable({
            grid: [tileSize, tileSize],
            containment: "#droppable_grid",
            zIndex: 100
      });
}

/**
 * Creates a level object from the level editor data after it is saved
 */
getAddedEntities = function () {
      if (socket) {
            countUserLevels();
      }

      var entities = $(".level_entity");
      var size = entities.length;
      var lvl_entities = [];
      for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var entityType;
            var className = entity.className;
            var classNames = className.split(" ");
            for (classIndex in classNames) {
                  var aClass = classNames[classIndex];
                  var index = aClass.indexOf("_entity");
                  if (index > 0 && aClass != "level_entity") {
                        type = aClass.substring(0, index);
                        break;
                  }
            }
            var name = entity.getAttribute("name");
            var baseEntity = getBaseEditorEntity(type, name);
            baseEntity.name = name;
            var xPosition = parseInt((entity.style.left).replace("px", ""));
            var yPosition = parseInt((entity.style.top).replace("px", ""));
            if (type === "enemy") {
                  xPosition++;
                  yPosition++;
                  baseEntity.xPosInitial = xPosition;
                  baseEntity.yPosInitial = yPosition;
            }
            baseEntity.xPos = xPosition;
            baseEntity.yPos = yPosition;
            lvl_entities.push(baseEntity);
      }
      var background_image = $("#new_background_div").css("background-image").split("\"")[1];
      var background_color = $("#new_background_div").css("background-color");
      var background = background_color;
      if (background_image) {
            background_image = background_image.substring(background_image.indexOf("assets/"));
            background = background_image;
      }

      var sound = "";
      $("#sound_menu").show();
      $(".sound_entity").each(function (index) {
            var element = $(this);
            if (element.attr("src").endsWith(".gif")) {
                  sound = element[0].id;
            }
      });
      $("#sound_menu").hide();


      var characters = 00000;
      $("#character_menu").show();
      if ($("#fighterCheckbox").is(":visible")) {
            characters += 10000;
      }
      if ($("#jumperCheckbox").is(":visible")) {
            characters += 1000;
      }
      if ($("#archerCheckbox").is(":visible")) {
            characters += 100;
      }
      if ($("#swimmerCheckbox").is(":visible")) {
            characters += 10;
      }
      if ($("#diggerCheckbox").is(":visible")) {
            characters += 1;
      }
      $("#character_menu").hide();
      characters = "" + characters;
      var charLength = characters.length;
      for (var i = charLength; i < 5; i++) {
            characters = "0" + characters;
      }
      if (!characters.includes("1")) {
            $("#message_editor").html("You must select at least one character for the level");
            return false;
      }
      var spawnPos = $("#spawnCharacter");
      var spnX = parseInt(spawnPos.css("left").replace("px", "")) / tileSize;
      var spnY = parseInt(spawnPos.css("top").replace("px", "")) / tileSize;

      var lvlName = $("#save_lvl_textbox").val();
      var username = (user ? user.username : lvlName);

      currentLevel = new Level(lvlName, username, lvl_entities, background, sound, characters, spnX, spnY, false, [], []);
      return true;
}

/**
 * saves level from editor to db
 */
saveEditorLevel = function () {
      if (socket) {
            var lvlNameInput = $("#save_lvl_textbox");
            //if editing a level that already exists, old level is removed from db and new one is added tor replace it
            if (currentLevel != undefined) {
                  if (lvlNameInput.val() === currentLevel.levelName && currentLevel.uniqueID != undefined && currentLevel.creatorName === user.username) {
                        socket.emit("deleteLevel", currentLevel.uniqueID, function (data) {
                              console.log("Level Deleted");
                        });
                  }
            }
            //if no levelName is entered
            if (lvlNameInput.val() === "") {
                  lvlNameInput.css("border-color", "red");
            }
            //save level from editor
            else {
                  lvlNameInput.css("border-color", "initial");
                  var validLevel = getAddedEntities();
                  if (!validLevel) {
                        showEntityMenu("character");
                        return;
                  }

                  socket.emit("addLevel", currentLevel, function (data) {
                        console.log("Level Saved: " + data.success);
                        closeMenuDialog();
                  });
                  generateMyLevels();
            }
            countUserLevels();
            // currentLevel = undefined;
      }
      else {
            var validLevel = getAddedEntities();
            if (!validLevel) {
                  closeMenuDialog();
                  showEntityMenu("character");
                  return;
            }
            //save level from editor
            if (myLevels.length != 0) {
                  for (var i in myLevels) {
                        if (myLevels[i].uniqueID === currentLevel.uniqueID) {
                              var newLvl = JSON.parse(JSON.stringify(currentLevel));
                              myLevels[i] = newLvl;
                              console.log("or here ?");
                        }
                        else {
                              console.log("here?");
                              myLevels.push(currentLevel);
                        }
                  }
            }
            else {
                  myLevels.push(currentLevel);
            }

            $("#message_editor").html("level saved locally")
            console.log(myLevels)
            // generateMyLevels();
            // alert("Unable to save level in guest/offline mode");
      }

}

// /**
//  * load editor level into the editor with the id that was entered into the input box
//  */
// loadEditorLevel = function () {
//       var lvlIdInput = $("#load_lvl_textbox");
//       var lvlId = lvlIdInput.val();
//       //TODO remove second conditional after finished
//       if (socket && lvlId != "") {
//             if (lvlId === "") {
//                   lvlIdInput.css("border-color", "red");
//             }
//             else {
//                   lvlIdInput.css("border-color", "initial");
//                   socket.emit("getLevel", { "lvlId": lvlId }, function (data) {
//                         if (data.length > 0) {
//                               clearLevelEditor();
//                               c(data[0]);
//                               closeMenuDialog();
//                         } else {
//                               alert("Invalid ID");
//                         }
//                   });
//             }
//       }
//       //offline mode
//       //check myLevels for ID 
//       else {
//             var found = false;
//             for (var i = 0; i < myLevels.length; i++) {
//                   if (lvlId === myLevels[i].uniqueID) {
//                         found = true;
//                         clearLevelEditor();
//                         loadLevelIntoEditor(myLevels[i]);
//                         closeMenuDialog();
//                   }
//             }
//             for (var i in campaignLevels) {
//                   if (lvlId === campaignLevels[i].uniqueID) {
//                         found = true;
//                         clearLevelEditor();
//                         loadLevelIntoEditor(campaignLevels[i]);
//                         closeMenuDialog();
//                   }
//             }
//             if (!found) {
//                   alert("Unable to load level in offline mode, loading default level");
//                   clearLevelEditor();
//                   loadLevelIntoEditor(getLevel("demo"));
//                   closeMenuDialog();
//             }
//       }
// }

/**
 * clears level editor grid and returns options to default
 */
clearLevelEditor = function () {
      $(".level_entity").remove();
      currentLevel = undefined;
      $(".backgroundCheckbox").hide();
      $("#new_background_div").css("background-image", "");
      $("#new_background_div").css("background-color", "white");
      $(".sound_entity").attr("src", "assets/playing-sound.png");    //return all to .png image
      $(".characterCheckbox").hide();
      $("#save_lvl_textbox").val("");
      $("#fighterCheckbox").show();
      closeAllDialogs();
}

loadLevelIntoEditor = function (level) {
      currentLevel = level;
      //place each entity on grid
      var entities = level.entities;
      for (var index in entities) {
            var entity = entities[index];
            //enemy entity
            if (entity.hasOwnProperty("HP")) {
                  var src = imageList[entity.name].src;
                  $("#droppable_grid").append("<div name='" + entity.name + "' style='position:absolute; left:" + entity.xPos + "px; top:" + entity.yPos + "px; margin:0 auto; background-image: url(\"" + src + "\"); height: " + entity.height + "px; width: " + entity.width + "px' class='level_entity enemy_entity'></div>");
            }
            //item entity
            else if (entity.hasOwnProperty("collected")) {
                  var image = imageList[entity.name];
                  var src = image.src;
                  var startHeight = (image.height / 3 - entity.height - (entity.height % 25)) * 100 / image.height;
                  var startWidth = (image.width / 3 - entity.width - (entity.width % 25)) * 100 / image.width;
                  var entityHtml = "<div name='" + entity.name + "' style='position:absolute; left:" + entity.xPos + "px; top:" + entity.yPos + "px; margin:0 auto; background-position: " + startWidth + "% " + startHeight + "%; background-image: url(\"" + src + "\"); height: " + entity.height + "px; width: " + entity.width + "px' class='level_entity item_entity'></div>";
                  $("#droppable_grid").append(entityHtml);
            }
            //terrain entity
            else if (entity.hasOwnProperty("damage")) {
                  var src = imageList[entity.name].src;
                  $("#droppable_grid").append("<div name='" + entity.name + "' style='position:absolute; left:" + entity.xPos + "px; top:" + entity.yPos + "px; margin:0 auto; background-image: url(\"" + src + "\"); height: " + entity.height + "px; width: " + entity.width + "px' class='level_entity terrain_entity'></div>");
            }
      }
      //makes added entities draggable
      enableDroppedDragging();

      enableGraphicChoice();

      //set spawn position
      var spawnCharacter = $("#spawnCharacter");
      spawnCharacter.css("left", level.spawnX);
      spawnCharacter.css("top", level.spawnY);

      //set background
      for (var index in editorBackgrounds) {
            if (level.background === editorBackgrounds[index].image_src) {
                  $("#" + editorBackgrounds[index].name).trigger("click");
            }
      }

      //setCharacters
      var characters = ["fighter", "jumper", "archer", "swimmer", "digger"];
      for (var i = 0; i < 5; i++) {
            if (level.characterTypes.substring(i, i + 1) == "1") {
                  $("#" + characters[i]).trigger("click");
            }
      }

      //sets background music
      $(".sound_entity").attr("src", "assets/playing-sound.png");    //return all to .png image
      $("#" + level.backgroundMusic).attr("src", "assets/playing-sound.gif");    //replace .png image with .gif

      //Set level name in input box for loaded level
      $("#save_lvl_textbox").val(level.levelName);
}

/**
 * loads level from the editor into game screen for the user to test
 */
testEditorLevel = function () {
      clearTimeout(soundTimer);
      pauseSounds();
      var validLevel = getAddedEntities();
      if (!validLevel) {
            showEntityMenu("character");
            return;
      }
      closeMenuDialog();
      $("#levelEditorContent").hide();
      $("#canvas").show();
      $("#level_menu_button").show();
      $("#back_to_editor_button").show();
      $("#back_to_editor").show();
      $("#publish_button").show();
      $("#back_to_editor_completed").show();
      loadLevel(currentLevel);
}

/**
 * gets the demo level object given its id
 */
getLevel = function (lvlId) {

      //if campaign level, id = 0-19
      if (lvlId.length < 3) {
            console.log("campaignlevel " + lvlId + " chosen")
            return campaignLevels[lvlId - 1];
      }
      if (lvlId === "demo") {
            var entities = [];
            for (var i = 1; i < 24; i++) {
                  if ((i % 2) == 0) continue;
                  entities[i] = new Terrain("dirt", 24 - i, i, 2, 2, 0, 0, 0, "", "", 0, true);
            }
            entities.push(new Enemy("snake", 9, 13, 2, 2, 1, 1, 3, "", "", 0, 10));
            return (new Level("Demo", "Jaimee", entities, "assets/Backgrounds/bricks.png", "Battle1", "10000", 12, 11, false, "", ""));
      }

}

/**
 * Gets the standard Entity with predefined values given the name and type of entity
 */
getBaseEditorEntity = function (type, name) {
      switch (type) {
            case "enemy":
                  return getStandardEnemies(name);
                  break;
            case "terrain":
                  return getStandardTerrains(name);
                  break;
            case "item":
                  return getStandardItems(name);
                  break;
            default:
                  console.log("Unable to match entity");
      }
}
