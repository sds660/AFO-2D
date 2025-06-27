var user;
var socket;
var guestCampaignHighest;


$(document).ready(function () {
      $("#loginUsername").focusout( function () {
            if($("#resetAcctBtn").is(":visible")) {
                  var username = $(this).val();
                  if (!socket) {
                        socket = io();
                  }
                  socket.emit("getSecurityQuestion", {"username": username}, function(data) {
                        $("#loginSecurityQuestion").val("");
                        if(data) {
                              $("#loginSecurityQuestion").val(data);
                        }
                  });
            }
      });
});
/**
 * clears all input fields for login
 */
clearLoginFields = function () {
      $("#loginUsername").val("");
      $("#loginPassword").val("");
      $("#loginPasswordConfirm").val("");
      $("#loginSecurityQuestion").val("");
      $("#loginSecurityAnswer").val("");
}

/**
 * displays the view for when "forgot password" is selected
 */
forgotPasswordView = function () {
      $("#backToLogin").show();
      $("#password").show();
      $("#confirmPassword").show();
      $("#securityQuestion").show();
      $("#securityAnswer").show();
      $("#forgotPassword").hide();
      $("#login").hide();
      $("#createNewAccount").hide();
      $("#createAccount").hide();
      $("#resetAccount").show();
      $("#guest").hide();
}

/**
 * shows the main login screen
 */
backToLogin = function () {
      $("#backToLogin").hide();
      $("#password").show();
      $("#confirmPassword").hide();
      $("#securityQuestion").hide();
      $("#securityAnswer").hide();
      $("#forgotPassword").show();
      $("#login").show();
      $("#createNewAccount").show();
      $("#createAccount").hide();
      $("#resetAccount").hide();
      $("#guest").show();
      $("#message_div").html("");
}

/**
 * shows create account view
 */
createAccountView = function () {
      $("#backToLogin").show();
      $("#password").show();
      $("#confirmPassword").show();
      $("#securityQuestion").show();
      $("#securityAnswer").show();
      $("#forgotPassword").hide();
      $("#login").hide();
      $("#createNewAccount").hide();
      $("#createAccount").show();
      $("#resetAccount").hide();
      $("#guest").hide();
}

/**
 * sends message to db to check if username and password are correct
 */
signin = function () {
      var username = $("#loginUsername").val();
      var password = $("#loginPassword").val();

      if (!socket) {
            socket = io();
      }
      socket.emit("signin", { "username": username, "password": password }, function (data) {

            if (data.success) {
                  user = data.user[0];
                  $("#message_div").html("Account Validated, loading account information.");
                  goToGame();
            } else {
                  $("#message_div").html("Username or Passsword is incorrect.");
            }
      });
      //check if campaign exits in DB, if not, upload them 
      checkIfCampaignExits();
}

/**
 * enables offline mode
 */
guestSignin = function () {
      socket = null;
      user = null;
      guestCampaignHighest = 0;
      goToGame();
}

/**
 * passes the user past the login screen to use the game
 */
goToGame = function () {
      updateStatus("mainMenu");
      if (socket) {
            countUserLevels();
      }
      clearLoginFields();

      $("#canvas").show();
      //show default menu in selectLevel screen
      $("#myLevelView").show();
      $("#otherLevelView").hide();
      //transition
      openLoader($("#ctx"), 3000);
      if (user===null){
            setTimeout(showAbout,3100);
      }
      $("#login_div").fadeOut();
      // generatePublishedLevels();
      setTimeout(function () {
            generateMyLevels();
      },1500);
}

/**
 * creates a user object to be created from the puts
 */
createAccount = function () {
      var username = $("#loginUsername").val();
      var password = $("#loginPassword").val();
      var confirmPassword = $("#loginPasswordConfirm").val();
      var security_ans = $("#loginSecurityAnswer").val();
      var security_ques = $("#loginSecurityQuestion").val();

      var error_message = checkValidity(username, password, confirmPassword, security_ques, security_ans, true);

      $("#message_div").html(error_message);
      if (error_message === "") {
            var time_played = 0;
            var lvls_completed = [];
            var enemies_killed = 0;
            var achievements = [];

            var newUser = User(username, password, security_ques, security_ans, time_played, lvls_completed, enemies_killed, achievements);
            if (!socket) {
                  socket = io();
            }
            socket.emit("createUser", newUser, function (data) {
                  if (data.success) {
                        clearLoginFields();
                        backToLogin();
                        $("#message_div").html("Account created, Please login");
                  } else {
                        $("#message_div").html("Username is already taken.");
                  }
            });
      }
}

/**
 * checks that all inputs follow the minimun parameters when creating an account
 * checkAll indicates wheter to check the security, password, and username or just password(true for both, false for just password)
 */
checkValidity = function (username, password, confirmPassword, ques, ans, checkAll) {
      var error_message = "";
      var pattern = new RegExp("[a-zA-Z0-9]");	//alphanumeric with no spaces
      var user_min = 4;
      var user_max = 8;
      var pass_min = 6;
      var pass_max = 16;
      //check if username is alphaNumeric with no spaces
      //check if password is alphanumeric with no spaces and has minimum/maximum length
      if (!pattern.test(password) || password.length < pass_min || password.length > pass_max) {
            error_message = error_message + "Password can only contain letters and numbers<br>and must be between the length of " + pass_min + " and " + pass_max + " characters.<br>";
      } else if (password != confirmPassword) {
            error_message = error_message + "Passwords do not match<br>";
      } else if (checkAll) {
            if (!pattern.test(username) || username.length < user_min || username.length > user_max) {
                  error_message = error_message + "Username can only contain letters and numbers.<br> And must be a length between " + user_min + " and " + user_max + " characters";
            } else if (ques === "" || ques === undefined) {
                  error_message = error_message + "Please create a security question.<br>";
            } else if (ans === "" || ans === undefined) {
                  error_message = error_message + "Enter an answer to the security question.<br>";
            }
      }
      return error_message;
}

/**
 * resets the password for the user if they forget there password
 */
resetPassword = function () {
      var username = $("#loginUsername").val();
      var security_ques = $("#loginSecurityQuestion").val();
      var security_ans = $("#loginSecurityAnswer").val();
      var password = $("#loginPassword").val();
      var confirmPassword = $("#loginPasswordConfirm").val();

      var error_message = checkValidity(username, password, confirmPassword, security_ques, security_ans, false);

      if (error_message) {
            $("#message_div").html(error_message);
      } else if (password === confirmPassword) {
            var data = { "username": username, "securityQuestion": security_ques, "securityAnswer": security_ans, "password": password };
            if (!socket) {
                  socket = io();
            }
            socket.emit("forgotPassword", data, function (data) {
                  if (data.success) {
                        clearLoginFields();
                        backToLogin();
                        $("#message_div").html("Password reset. Login");
                  } else {
                        $("#message_div").html("Failed to reset password, security invalid");
                  }
            });
      } else {
            $("#message_div").html("Passwords do not match.");
      }
}

/**
 * logs user out of account and returns them to login screen
 */
logout = function () {
      socket = null;
      user = null;
      myLevels.length = 0;
      backToMain();
      clearLevelEditor();
      $("#canvas").hide();
      $("#login_div").show();
      $("#myLevelView").hide();
      $("#otherLevelViwew").hide();
      backToLogin();
      updateStatus("loginMenu");
}
