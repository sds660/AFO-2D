//GAME SETTINGS

//=======================================================
//FPS Slider
$(function () {
      var handle = $("#handle");
      $("#FPSslider").slider({
            min: 30,
            max: 60,
            step: 15,
            value: fps,
            create: function () {
                  handle.text($(this).slider("value"));
            },
            slide: function (event, ui) {
                  handle.text(ui.value);
            }
      });
});

getSettingsValues = function () {
      //update background Music toggle switch
      $("#BackgroundMusicBox").prop("checked", backgroundMusicOn);
      //Update Sound Effects toggle switch
      $("#soundEffectsBox").prop("checked", soundEffectsOn);
      $("#FPSslider").slider("value", fps);
      $("#handle").text(fps);
}


//update settings on settings menu close
updateSettings = function () {
      var lastMusic = backgroundMusicOn;
      backgroundMusicOn = $("#BackgroundMusicBox").prop("checked");
      if(backgroundMusicOn != lastMusic && (game.status == "playing" || game.status == "pause")) {
            //turn music on
            if(backgroundMusicOn) {
                  var sound = soundList[currentLevel.backgroundMusic];
                  if (sound) {
                        sound.currentTime = 0;
                        sound.volume = 0.3;
                        sound.loop = true;
                        sound.play();
                  }
            }
            //turn music off
            else {
                  var sound = soundList[currentLevel.backgroundMusic];
                  sound.volume = 0;
            }
      }

      soundEffectsOn = $("#soundEffectsBox").prop("checked");
      updateFPS($("#FPSslider").slider("value"));
      if (game.status === "pause") {
            $("#settings").hide();
            openLevelDialog();
      }
      else {
            backToMain();
      }
}

//=======================================================

//ACT SETTINGS

viewAchievements = function () {
      notImplemented();
}

changePwdView = function () {
      $("#changePasswordTable").toggle();
}

changePwd = function() {
      var oldPass = $("#oldPwd").val();
      var newPass = $("#newPwd").val();
      var confirmPass = $("#confirmPwd").val();
      if(confirmPass == newPass) {
            var error_message = checkValidity("", newPass, confirmPass, "", "", false);
            if(error_message) {
                  $("#message_actSettings").html(error_message);
            } else {
                  if(socket) {
                        var info = {"username":user.username, "password":oldPass, "newPassword":newPass};
                        socket.emit("changePassword", info, function(data) {
                              if(data.success) {
                                    $("#changePasswordTable").hide();
                                    $("#oldPwd").val("");
                                    $("#newPwd").val("");
                                    $("#confirmPwd").val("");
                              }
                              $("#message_actSettings").html(data.message);
                        });
                  } else {
                        $("#message_actSettings").html("Unavailable in offline mode");
                  }
            }
      } else {
            $("#message_actSettings").html("Passwords do not match");
      }
}

//OTHER
deleteAccount = function () {
      if (socket) {
            var confirmation = confirm("Are you sure you want to delete your acount?.\nThis cannot be undone.");
            if(confirmation) {
                  socket.emit("deleteUser", user, function (data) {
                        openLoader($("#actSettings"),1200);
                        if(data.success) {
                              logout();
                        } else {
                              $("#message_actSettings").html("Unable to delete account");
                        }
                  });
            }
      }
      else { 
            $("#message_actSettings").html("Unable to delete account if offline");
      }
}