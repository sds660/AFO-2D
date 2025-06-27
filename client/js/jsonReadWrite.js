

var numLvls;
//load campaig JSON from file
getCampaign = function () {
      var levels = require("../campaign/campaignLevels.json");
      console.log("campaign levels loaded successfully");
      // levels = levels.map(JSON.parse);
      return levels;
}

//check if campaign exits in DB, if not, upload them 
checkIfCampaignExits = function () {
      if (socket) {
            socket.emit("getCampaignLevels", function (data) {
                  if (data.length === 0) {
                        levels = require("../campaign/campaignLevels.json");
                        var newCampaign = JSON.parse(JSON.stringify(campaignLevels));
                        socket.emit("addCampaign", newCampaign, function (data) {
                              console.log("campaignLevels added to DB");
                        });
                  }
            });
      }
}
//uplaod new campaignLevels 
uploadCampaign = function () {
      if (socket) {
            console.log(campaignLevels);
            console.log("i: " + i);
            openLoader($("#debug"), 6000);
            socket.emit("deleteCampaign", function (data) {
                  console.log("deleting old campaign...");

            });
            setTimeout(function () {
                  console.log("adding new campaign...");
                  console.log("camapign Levels:");
                  console.log(campaignLevels);
                  var newCampaign = JSON.parse(JSON.stringify(campaignLevels));
                  socket.emit("addCampaign", newCampaign, function (data) {
                        console.log("campaignLevels added");
                  });
            }, 5000);
      }
      else {
            console.log("Lol, you obviously can't upload to a DB if you are playing offline")
      }
}

//load any JSON of levels from file, i fonline they get added to your account
loadLevelsFromFile = function () {
      //get file from html input (user)
      var file = document.getElementById("levelsFromFile").files[0];
      if (file) {
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                  var textFromFileLoaded = fileLoadedEvent.target.result;
                  myLevels = JSON.parse(textFromFileLoaded);
                  console.log(JSON.parse(textFromFileLoaded));
                  openLoader($("#ctx"), 4000, "fullScreenLoader");
                  if (!socket) {
                        generateMyLevels();
                  }
            };
            //call file reader
            fileReader.readAsText(file, "UTF-8");
            $("#levelsFromFile")[0].value = "";
      }
      //If online and levels are added from file, they are automatically added to the users levels in the DB
      if (socket) {
            countUserLevels();
            var checkFileLoaded = setInterval(function () {
                  if (myLevels.length > 0 && user.numLvls >= 0) {
                        clearInterval(checkFileLoaded);
                        for (var i = 0; i < myLevels.length; i++) {
                              console.log("i: " + i);
                              myLevels[i].creatorName = user.username;
                              console.log("numLvls: " + user.numLvls);
                              myLevels[i].uniqueID = user.username + "-" + (user.numLvls + 1);
                              console.log("Unique ID: " + myLevels[i].uniqueID)
                              socket.emit("addLevel", myLevels[i], function (data) {
                                    console.log("Level added to user account from file: " + data.success);
                              });
                              user.numLvls++;
                              if (i === myLevels.length - 1) {
                                    generateMyLevels();
                              }
                        }
                        countUserLevels();
                  }
            }, 1000); // check every 100ms
            console.log("attempting to save myLevels to DB");
      }
}
//count number of levels created by current user
countUserLevels = function () {
      socket.emit("countUserLevels", user.username, function (data) {
            user.numLvls = data;
      });
}

//download a JSON to local filesystem
download = function (content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
}

//Download campaign JSON if creating new campaign levels
downloadCampaign = function () {
      download(JSON.stringify(campaignLevels), 'campaignLevels.json', 'application/json');
}
//Download "My Levels" to your local filesystem
downloadMyLevels = function () {
      download(JSON.stringify(myLevels), 'AFO-myLevels.json', 'application/json');
}



