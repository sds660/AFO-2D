var testListOfLevels = ["level 1", "levelID 2", "LevelID 3", "Ryan", "Michael", "Shawn", "Jaimee", "level 1", "levelID 2", "LevelID 3", "Ryan", "Michael", "Shawn", "Jaimee"];


checkList = function () {
      var input, filter, ul, li, a, i;
      input = document.getElementById("myInput");

      if ($("#myLevelView").is(":visible")) {
            input = document.getElementById("myInput");
      }
      else {
            input = document.getElementById("myInput1");
      }
      filter = input.value.toUpperCase();
      if ($("#myLevelView").is(":visible")) {
            ul = document.getElementById("my_levels");
      }
      else {
            ul = document.getElementById("db_levels");
      }
      li = ul.getElementsByTagName("li");

      for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                  li[i].style.display = "";
            }
            else {
                  li[i].style.display = "none";
            }
      }
}
//get all elelements in array published by players to play from DB
createUL = function (someArray, id) {
      //create list 
      $(("#" + id)).detach();
      var list = document.createElement("ul");
      list.setAttribute("id", id);
      list.setAttribute("class", "UL_levels");


      for (var i = 0; i < someArray.length; i++) {
            var a = document.createElement("a");
            a.setAttribute("id", (someArray[i].uniqueID));
            a.setAttribute("class", "globalLevel");
            a.setAttribute("oncontextmenu", "return false");
            //create item for list
            var item = document.createElement("li");
            if (socket){
                  a.textContent = (someArray[i].uniqueID+': "'+someArray[i].levelName+'"');
            }
            else{
                  a.textContent = (someArray[i].levelName);
            }
            item.appendChild(a);
            //add to list
            list.appendChild(item);
      }
      addJquery("play");
      return list;
}


enableRightCLickMenu = function () {
      $(".globalLevel").mouseup(function (event) {
            if (event.which === 3) {
                  if ($("#otherLevelView").is(":visible")) {
                        $("#rightClickDelete").hide();
                  }
                  else {
                        $("#rightClickDelete").show();
                  }
                  // $("#rightClickDelete").show();
                  $("body").on("contextmenu", ".globalLevel", function (e) { return false; });
                  var editMenu = ($("#rightclickEdit"));
                  editMenu.css("top", mouseY);
                  editMenu.css("left", mouseX);
                  // $(this).click();
                  editMenu.toggle();
                  if (!$(this).hasClass("listClicked")) {
                        $(this).click();
                  }
            }
            if (event.which === 1) {
                  $("#rightclickEdit").hide();
                  // $(this).click();
            }
      });
}



createCampaignLevels = function (levels) {
      //clear out old campaign buttons so that new ones can be loaded if any levels have been unlocked since last time
      $(".campaignButton").remove();
      //hide play button until level button is clicked
      $("#pulsingPlayButton").hide();
      $("#pulsingEditButton").hide();
      //generate new list of global levels
      //somefunction ()


      //when search bar clicked, campaign buttons deselected
      $("#myInput").click(function () {
            $(".campaignButton").removeClass("campaignButton_Clicked");
            $("#pulsingPlayButton").hide();

      });
      //actually create the campaign buttons

      for (var i = 0; i < 20; i++) {
            var button = document.createElement("button");
            button.setAttribute("name", "Level " + (i + 1));
            button.setAttribute("class", "campaignButton dialog_button ");
            button.setAttribute("id", ("campaign" + (i + 1)));
            if (socket) {
                  if (i > user.highestCampaign) {
                        button.setAttribute("disabled", "disabled");
                        button.setAttribute("style", "background-color:#A4A6A6;border-color:#A4A6A6;color:black");
                        button.appendChild(document.createTextNode("Complete Previous Level To Unlock"));
                  }
                  else {
                        button.appendChild(document.createTextNode("Level " + (i + 1)));
                  }
            }
            else {
                  if (i > guestCampaignHighest) {
                        button.setAttribute("disabled", "disabled");
                        button.setAttribute("style", "background-color:#A4A6A6;border-color:#A4A6A6;color:black");
                        button.appendChild(document.createTextNode("Complete Previous Level To Unlock"));
                  }
                  else{
                        button.appendChild(document.createTextNode("Level " + (i + 1)));
                  }
                  
            }

            document.getElementById("campaignView").appendChild(button);
      }
}

toggleMyLevels = function () {
      //switch to My levels
      if ($("#toggleMyLevelsButton").text() == "My Levels") {
            $("#toggleMyLevelsButton").text("Other Levels");
            //show warning that there are no levels to display
            if (myLevels.length === 0) {
                  $("#noLevelsToDisplay").show();
                  $("#noOtherLevels").hide();
                  $("#noMyLevels").show();
            }
            else {
                  $("#noLevelsToDisplay").hide();
                  $("#noMyLevels").hide();
            }
            $("#otherLevelsTitle").hide();
            $("#myLevelsTitle").show();
            $("#otherLevelView").hide();
            $("#myLevelView").show();
            $("#myInput1").removeAttr("value");
      }
      //Switch to Other Levels
      else {
            $("#toggleMyLevelsButton").text("My Levels");
            if (otherLevels.length === 0) {
                  $("#noLevelsToDisplay").show();
                  $("#noMyLevels").hide();
                  $("#noOtherLevels").show();
            }
            else {
                  $("#noLevelsToDisplay").hide();
                  $("#noOtherLevels").hide();
            }
            $("#myLevelsTitle").hide();
            $("#otherLevelsTitle").show();
            $("#otherLevelView").show();
            $("#myLevelView").hide();
            $("#myInput").removeAttr("value");
      }
      if (game.lastStatus === "levelEditorContent") {
            addJquery("edit");
      }
      else {
            addJquery("play");
      }
      $(".globalLevel").removeClass("listClicked");
      $(".globalLevel").removeClass("listHover");
}


generateMyLevels = function (refresh) {
      if (!refresh){
            $("#otherLevelsTitle").hide();
            $("#otherLevelView").hide();
            $("#myLevelsTitle").show();
            $("#myLevelView").show();
            $("#toggleMyLevelsButton").text("Other Levels");
      }

      //clear all elements in case new ones have been added and to avooid duplicates

      //load all my levels from db
      if (socket) {
            if (user != null) {
                  myLevels.length = 0;
                  socket.emit("getAllLevels", function (result) {
                        for (var index in result) {
                              var level = result[index];
                              if (level.creatorName === user.username && !level.uniqueID.startsWith("campaign")) {
                                    console.log(level);
                                    myLevels.push(level);
                              }
                        }

                        document.getElementById("myLevelView").appendChild(createUL(myLevels, "my_levels"));

                        //if there are no levels in myLevels
                        //show warning that there are no levels to display
                        if (myLevels.length === 0) {
                              $("#noLevelsToDisplay").show();
                              $("#noOtherLevels").hide();
                              $("#noMyLevels").show();
                        }
                        else {
                              $("#noLevelsToDisplay").hide();
                              $("#noMyLevels").hide();
                        }
                  });
                  document.getElementById("myLevelView").appendChild(createUL(myLevels, "my_levels"));
            }
      }

      else {
            if (myLevels.length === 0) {
                  $("#noLevelsToDisplay").show();
                  $("#noOtherLevels").hide();
                  $("#noMyLevels").show();
            }
            else {
                  $("#noLevelsToDisplay").hide();
                  $("#noMyLevels").hide();
            }
            document.getElementById("myLevelView").appendChild(createUL(myLevels, "my_levels"));
      }
      generatePublishedLevels();
}

addJquery = function (state) {
      state = state.charAt(0).toUpperCase() + state.slice(1);
      btnToShow = "#pulsing" + state + "Button";
      $(".campaignButton").unbind();
      $(".globalLevel").unbind();

      //adjust how the campaign button looks on hover and on click
      $(".campaignButton").click(function () {
            //unselect any global levels that have been selected prior
            $(".globalLevel").removeClass("listClicked");
            if ($(this).hasClass("campaignButton_Clicked") != true) {
                  //remove all classes from current buttons
                  $(".campaignButton").removeClass("campaignButton_Clicked");
                  $(".campaignButton").removeClass("campaignButton_Hover");
                  //show play button
                  $(btnToShow).show();
                  //add css to show button clicked
                  $(this).toggleClass("campaignButton_Clicked");
                  //set play on click to specific level that is selected
                  showStats();
            }
            else {
                  //unselect a campaign button
                  $(this).removeClass("campaignButton_Clicked");
                  $(this).addClass("campaignButton_Hover");
                  $(btnToShow).hide();
                  hideStats();
            }
      });
      //hover over button function
      $(".campaignButton").hover(function () {
            if ($(this).hasClass("campaignButton_Clicked") != true) {
                  $(this).toggleClass("campaignButton_Hover");
            }
      });
      //function for when hovering over list item
      $(".globalLevel").hover(function () {
            if ($(this).hasClass("listClicked") != true) {
                  $(this).toggleClass("listHover");
            }
      });
      //function for when clicking on list item
      $(".globalLevel").click(function () {
            //unselect any campaign levels that have been selected prior
            $(".campaignButton").removeClass("campaignButton_Clicked");
            if ($(this).hasClass("listClicked") != true) {
                  //remove all classes from current list items (global levels)
                  $(".globalLevel").removeClass("listHover");
                  $(".globalLevel").removeClass("listClicked");
                  //show play button
                  $(btnToShow).show();
                  //add css to show button clicked
                  $(this).toggleClass("listClicked");
                  //set play on click to specific level that is selected
                  showStats();
            }
            else {
                  //unselect a campaign button
                  $(this).removeClass("listClicked");
                  $(this).addClass("listHover");
                  $(btnToShow).hide();
                  hideStats();
            }
      });
      enableRightCLickMenu();
}

refreshMyLevels = function () {
      generateMyLevels(true);
      if ($("#myLevelView").is(":visible")) {
            openLoader($("#myLevelView"), 2200);
      }
      else{
            openLoader($("#otherLevelView"), 2200);
      }
}

generatePublishedLevels = function () {
      //if online
      if (socket) {
            if (user != null) {
                  otherLevels.length = 0;
                  socket.emit("getAllLevels", function (result) {
                        for (var index in result) {
                              var level = result[index];
                              if (level.isPublished && !level.uniqueID.startsWith("campaign") && !(level.creatorName === user.username)) {
                                    otherLevels.push(level);
                              }
                        }
                        document.getElementById("otherLevelView").appendChild(createUL(otherLevels, "db_levels"));
                  });
            }
            //if offline
            else {
                  console.log("Cannot load published levels if offline");
            }
      }
      addJquery("play");
}
editLevelFromSelectMenu = function () {
      //show loading screen
      openLoader($("#selectLevel"), 1500, "fullScreenLoader");
      setTimeout(function () {
            //if campaign level is selected
            var id = $(".campaignButton_Clicked").attr("id");
            //if a global level has been selected
            if (id == null) {
                  id = $(".listClicked").attr("id");
            }

            if (socket) {
                  socket.emit("getLevel", { "lvlId": id }, function (data) {
                        console.log(data);
                        if (data[0]) {
                              loadLevelIntoEditor(data[0]);
                              $("#canvas").show();
                        } else {
                              console.log("Invalid level id");
                        }
                  });
            }
            //searching offline for level to edit
            else {
                  var found = false;
                  for (var i = 0; i < campaignLevels.length; i++) {
                        if (found != true) {
                              console.log("id: " + id);
                              if (campaignLevels[i].uniqueID == id) {
                                    loadLevelIntoEditor(campaignLevels[i]);
                                    found = true;
                                    $("#canvas").show();
                              }
                        }
                  }
                  if (found === false) {
                        for (var i = 0; i < myLevels.length; i++) {
                              if (found != true) {
                                    if (myLevels[i].uniqueID == id) {
                                          loadLevelIntoEditor(myLevels[i]);
                                          found = true;
                                          $("#canvas").show();
                                    }
                              }
                        }
                  }
                  else {
                        if (found === false) {
                              console.log("Sorry, this level does not exist");
                        }
                  }
            }
            $("#selectLevel").hide();
            updateStatus("levelEditorContent");
            fadeId = setInterval("fadeOut()", 1000 / fps);
      }, 200);



}
playButtonClicked = function () {
      //if campaign level is selected
      var id = $(".campaignButton_Clicked").attr("id");
      //if a global level has been selected
      if (id == null) {
            id = $(".listClicked").attr("id");
      }
      console.log("Loading Level: " + id)
      playLevel(id);
      $(".globalLevel").removeClass("listClicked");
}

playNextCmapaign = function() {
      var campaignNum = parseInt((currentLevel.uniqueID).slice(8));
      var nxtLvl = campaignNum +1;
      var nxtLvlID = "campaign"+nxtLvl;
      playLevel (nxtLvlID);
      closeAllDialogs();
}
//play level 
playLevel = function (id) {
      $("#level_menu_button").show();
      $("#selectLevel").hide();
      if (socket) {
            socket.emit("getLevel", { "lvlId": id }, function (data) {
                  console.log(data);
                  if (data[0]) {
                        currentLevel = data[0];
                        loadLevel(currentLevel);
                        $("#canvas").show();
                  } else {
                        console.log("Invalid level id");
                  }
            });
      } else {
            var found = false;
            for (var i = 0; i < campaignLevels.length; i++) {
                  if (found != true) {
                        console.log("id: " + id);
                        if (campaignLevels[i].uniqueID == id) {
                              currentLevel = campaignLevels[i];
                              loadLevel(currentLevel);
                              found = true;
                              $("#canvas").show();
                        }
                  }
            }
            if (found === false) {
                  for (var i = 0; i < myLevels.length; i++) {
                        if (found != true) {
                              if (myLevels[i].uniqueID == id) {
                                    currentLevel = myLevels[i];
                                    loadLevel(currentLevel);
                                    found = true;
                                    $("#canvas").show();
                              }
                        }
                  }
            }
            else {
                  //TODO this should never execute??
                  if (found === false) {
                        console.log("Sorry, this level does not exist");
                  }
            }
      }
}

hideStats = function () {
      $("#levelStatsDisplay").html("");
}

showStats = function () {
      var id = $(".campaignButton_Clicked").attr("id");
      //if a global level has been selected
      if (id == null) {
            id = $(".listClicked").attr("id");
      }
      if(socket) {
            socket.emit("getLevel", {"lvlId":id}, function (data) {
                  var level = data[0];
                  displayStats(level);
            });
      } else {
            var level;
            for(var i=0; i<campaignLevels.length; i++) {
                  if(id == campaignLevels[i].uniqueID){
                        level = campaignLevels[i];
                        break;
                  }
            }
            if(!level) {
                  for(var i=0; i<myLevels.length; i++) {
                        if(id == myLevels[i].uniqueID){
                              level = myLevels[i];
                              break;
                        }
                  }
            }
            if(level) {
                  displayStats(level);
            } else {
                  console.log("invalid level selection");
            }
      }
}

displayStats = function (lvl) {
      //global topTimes
      var topTimes = lvl.topTimes;
      var topTimesHTML = "<table><tr><td colspan=\"2\" style='text-align:center'>Leaderboard</td></tr>";
      var numOfTimes = topTimes.length;
      for(var i=0; i < numOfTimes; i++) {
            topTimesHTML = topTimesHTML + "<tr>"+
                  "<td>" + topTimes[i].place + ": " + topTimes[i].username + "</td>"+
                  "<td>" + Math.round(topTimes[i].time*1000)/1000 + "</td><tr>";
            if(i >= 3){
                  break;
            }
      }
      if(numOfTimes < 3) {
            for(var i=numOfTimes+1; i <= 3; i++) {
                  topTimesHTML = topTimesHTML + "<tr><td>" + i + ": </td><td>0</td><tr>";
            }
      }
      topTimesHTML = topTimesHTML + "</table>";

      //User specific level stats
      var userStats = lvl.userStats;
      var time = -1;
      var fails = 0;
      var passes = 0;
      for(var i=0; i < userStats.length; i++) {
            var stat = userStats[i];
            var username = user ? user.username : "";
            if(stat.username == username) {
                  time = Math.round(stat.time*1000)/1000;
                  fails = stat.fails;
                  passes = stat.passes;
                  break;
            }
      }
      var successesHTML = "<table>" +
            "<tr><td colspan=\"2\">Your Statistics</td></tr>" +
            "<tr><td>Time: </td><td>" + (time < 0 ? "N/A" : time) + "</td></tr>" +
            "<tr><td>Loses: </td><td>" + fails + "</td></tr>" +
            "<tr><td>Wins: </td><td>" + passes + "</td></tr></table>";

      var creationHTML = "";
      if(!lvl.uniqueID.startsWith("campaign")) {
            creationHTML = "<table>" +
                  "<tr><td>Created By: </td><td>" + lvl.creatorName + "</td></tr>" +
                  "<tr><td>Creation Date: </td><td>" + new Date(lvl.creationTime).toDateString() + "</td></tr></table>";
                  creationHTML = "<td>" + creationHTML + "</td>";
      }
      var statsHtml = "<table style=\"width: 100%\"><tr><td>" + topTimesHTML + "</td><td>" + successesHTML + "</td>" + creationHTML + "</tr></table>";

      $("#levelStatsDisplay").html(statsHtml);
}

