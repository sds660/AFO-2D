//Server setup
var mongojs = require("mongojs");
//local db 
var db = mongojs("localhost/allForOne", ["users", "levels"]);


//comment out everything below if you want to use local db and un-comment the above line
//===============================================================
//mLab DB

// Read in keys and secrets. Using nconf use can set secrets via
// environment variables, command-line arguments, or a keys.json file.

// const nconf = require('nconf');
// nconf.argv().env().file('keys.json');
// const user = nconf.get('mongoUser');
// const pass = nconf.get('mongoPass');
// const host = nconf.get('mongoHost');
// const port = nconf.get('mongoPort');


// let db = `mongodb://${user}:${pass}@${host}:${port}`;

// if (nconf.get('mongoDatabase')) {
//       db = `${db}/${nconf.get('mongoDatabase')}`;
//       db = mongojs(db, ["users", "levels"]);
// }
//===============================================================


var express = require("express");
var app = express();
var serv = require("http").Server(app);

app.get("/js*", function (req, res) {
      res.sendFile(__dirname + "/client" + req.path);
});
app.get("/assets*", function (req, res) {
      res.sendFile(__dirname + "/client" + req.path);
});
app.get("/campaign*", function (req, res) {
      res.sendFile(__dirname + "/client" + req.path);
});
app.get("/styles*", function (req, res) {
      res.sendFile(__dirname + "/client" + req.path);
});
app.get("/", function (req, res) {
      res.sendFile(__dirname + "/client/index.html");
});

app.use("/client", express.static(__dirname + "/client"));

serv.listen(8080);   //port 8080
console.log("Server Started");


//account validation and db calls
var isCredsValid = function (data, cb) {
      db.users.find({ username: data.username, password: data.password }, function (err, res) {
            if (res.length > 0) {
                  cb({ res: true, user: res });
            } else {
                  cb(false);
            }
      });
}
var isUsernameTaken = function (data, cb) {
      db.users.find({ email: data.username }, function (err, res) {
            if (res.length > 0) {
                  cb(true);
            } else {
                  cb(false);
            }
      });
}
var addUser = function (data, cb) {
      db.users.insert(data, function (err) {
            cb();
      });
}
var deleteUser = function (data, cb) {
      //delete all levels creaated by user
      console.log(data);
      db.levels.remove({ "creatorName": data.username }, function (err, num) {
            console.log(err);
            console.log(num);
            cb();
      });
      //delete user from db
      db.users.remove({ username: data.username }, function (err) {
            cb();
      });
}
var deleteLevel = function (id, cb) {
      db.levels.remove({ "uniqueID": id }, function (err, num) {
            console.log(err);
            console.log(num);
            cb();
      });
}
var checkSecurity = function (data, cb) {
      db.users.find({ "username": data.username }, function (err, res) {
            if (res.length > 0 && res[0].securityQuestion === data.securityQuestion && res[0].securityAnswer === data.securityAnswer) {
                  cb(true);
            } else {
                  cb(false);
            }
      });
}

//data = {"username":jaimee, parameter:"password", value:"abcd"}
var updateUser = function (data, cb) {
      var parameter = data.parameter;
      var query = {};
      query[parameter] = data.value;
      db.users.update({ "username": data.username }, { $set: query }, function (err, num) {
            if (num.nModified < 1) {
                  cb(false);
            } else {
                  cb(true);
            }
      });
}

var updatePassword = function (data, cb) {
      db.users.update({ "username": data.username }, { $set: { "password": data.newPassword } }, function (err, num) {
            if (num.nModified < 1) {
                  cb(false);
            } else {
                  cb(true);
            }
      });
}
var getSecurityQuestion = function(data, cb) {
      db.users.find({ "username": data.username }, function (err, res) {
            if (res[0]) {
                  cb(res[0].securityQuestion);
            } else {
                  cb(null);
            }
      });
}

var updateHighestCampaign = function (data, cb) {
      db.users.update({ "username": data.username },{ $set: { "highestCampaign": data.highestCampaign } }, function (err,res) {
            cb(res);
      });
}

var getAllLevels = function (cb) {
      db.levels.find({}, function (err, res) {
            cb(res);
      });
}
var countUserLevels = function (data, cb) {
      db.levels.find({ "creatorName": data }, function (err, res) {
            var wants = 0;
            for (var i in res) {
                  if (!res[i].uniqueID.startsWith("campaign")) {
                        wants++;
                  }
            }
            cb(wants);
      });
}

var getLevel = function (data, cb) {
      db.levels.find({ "uniqueID": data.lvlId }, function (err, res) {
            cb(res);
      });
}
var addLevel = function (data, cb) {
      db.levels.insert(data, function (err) {
            console.log("level added"+data);
            cb();
      });
}
var addCampaign = function (data, cb) {
      var bulk = db.levels.initializeUnorderedBulkOp();
      for (var j=0;j<data.length;j++){
            data[j].isPublished = true;
            bulk.insert(data[j]);
      }
      bulk.execute();

}
var getCampaignLevels = function (cb) {
      db.levels.find({ "uniqueID": { $regex: /^campaign.*/ } }, function (err, res) {
            cb(res);
      });
}
var deleteCampaign = function (cb) {
      db.levels.remove({ "uniqueID": { $regex: /^campaign.*/ } }, function (err, res) {
            cb(res);
      });
}

var updateStats = function (data, cb) {
      var newStat = data.stat;
      getLevel(data, function (res) {
            var level = res[0];
            if(level) {
                  var curStats = level.userStats;
                  var firstPlay = true;
                  for (var index in curStats) {
                        var stat = curStats[index];
                        if (stat.username == newStat.username) {
                              firstPlay = false;
                              stat.passes++;
                              if (stat.time > newStat.time || stat.time <= 0) {
                                    stat.time = newStat.time;
                              }
                              break;
                        }
                  }
                  if (firstPlay) {
                        curStats.push(newStat);
                  }
                  var updateData = { "uniqueID": level.uniqueID, "parameter": "userStats", "value": curStats };
                  updateLevel(updateData, function () {
                        cb(true);
                  });
            } else {
                  cb(false);
            }
      });
}

var updateTopTimes = function (data, cb) {
      getLevel(data, function (res) {
            var level = res[0];
            if(level) {
                  var curTimes = level.topTimes;
                  var num = curTimes.length;
                  curTimes[num] = data.topTime;
                  curTimes.sort(function (a, b) {
                        return (a.time < b.time) ? -1 : 1;
                  });
                  if (num + 1 > 3) {
                        curTimes.splice(-1, 1);
                  }
                  for (var i = 0; i < curTimes.length; i++) {
                        curTimes[i].place = i + 1;
                  }
                  var updateData = { "uniqueID": level.uniqueID, "parameter": "topTimes", "value": curTimes };
                  updateLevel(updateData, function () {
                        cb(true);
                  });
            } else {
                  cb(false);
            }
      });
}

addFailure = function (data, cb) {
      getLevel(data, function(res) {
            var level = res[0];
            if(level) {
                  var newStat = data.stat;
                  var stats = level.userStats;
                  var playedBefore = false;
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
                  updateLevel({uniqueID:data.lvlId, parameter:"userStats", value:stats}, function () {
                        cb(true);
                  });
            }
      });
}

//data = {uniqueID:1341, parameter:"name", value:"Demo"}
var updateLevel = function (data, cb) {
      var parameter = data.parameter;
      var query = {};
      query[parameter] = data.value;
      db.levels.update({ "uniqueID": data.uniqueID }, { $set: query }, function (err, num) {
            console.log(num);
            if (num.nModified < 1) {
                  cb(false);
            } else {
                  cb(true);
            }
      });
}


//server connections
var io = require("socket.io")(serv);

io.sockets.on("connection", function (socket) {
      console.log("Socket Connection");

      // socket.on("disconnect", function () {
      //     //TODO
      // });

      socket.on("signin", function (data, callback) {
            var response;
            isCredsValid(data, function (result) {
                  if (result.res) {
                        var theUser = result.user;
                        response = { success: true, user: theUser };
                        console.log("User authenticated");
                        callback(response);
                  } else {
                        response = { success: false };
                        callback(response);
                  }
            });
      });
      socket.on("createUser", function (data, callback) {
            var response;
            isUsernameTaken(data, function (result) {
                  if (result) {
                        response = { success: false };
                        callback(response);
                  } else {
                        addUser(data, function () {
                              response = { success: true, user: data };
                              callback(response);
                        });
                  }
            });
      });
      socket.on("updateHighestCampaign", function (data, callback) {
            updateHighestCampaign(data, function (result) {
                  callback(result);
            });
      });
      socket.on("getCampaignLevels", function (callback) {
            getCampaignLevels(function (result) {
                  callback(result);
            });
      });
      socket.on("deleteCampaign", function (callback) {
            deleteCampaign(function (result) {
                  callback(result);
            });
      });
      socket.on("countUserLevels", function (data, callback) {
            countUserLevels(data, function (result) {
                  callback(result);
            });
      });
      socket.on("getSecurityQuestion", function(data, callback) {
            getSecurityQuestion(data, function(result) {
                  callback(result);
            });
      });

      //data: {username, secQues, secAns, newPassword}
      socket.on("forgotPassword", function (data, callback) {
            var response;
            checkSecurity(data, function (result) {
                  if (result) {
                        updatePassword(data, function (res) {
                              response = { success: res };
                              callback(response);
                        });
                  } else {
                        response = { success: false }
                        callback(response);
                  }
            });
      });
      socket.on("changePassword", function(data, callback) {
            var response;
            isCredsValid(data, function (result) {
                  if (result.res) {
                        updatePassword( data, function(res) {
                              if(res) {
                                    response = { success: true, message: "Password Updated" };
                              } else {
                                    response = { success: false, message: "Unable to update password" };
                              }
                              callback(response);
                        });
                  } else {
                        response = { success: false,  message: "Old password is incorrect"};
                        callback(response);
                  }
            });
      });
      socket.on("deleteUser", function (data, callback) {
            var response;
            deleteUser(data, function () {
                  response = { success: true };
                  callback(response);
            });
      });
      socket.on("updateUser", function (data, callback) {
          updateUser(data, function () {
              response = {success:true};
              callback(response);
          });
      });

      socket.on("getAllLevels", function (callback) {
            getAllLevels(function (result) {
                  callback(result);
            });
      });
      socket.on("getLevel", function (data, callback) {
            getLevel(data, function (result) {
                  callback(result);
            });
      });
      socket.on("addLevel", function (data, callback) {
            var response;
            addLevel(data, function () {
                  response = { success: true };
                  callback(response);
            });
      });
      socket.on("addCampaign", function (data, callback) {
            var response;
            addCampaign(data, function () {
                  response = { success: true };
                  callback(response);
            });
      });
      socket.on("updateLevelStats", function (data, callback) {
            updateStats(data, function () {
                  updateTopTimes(data, function (res) {
                        response = { success: res };
                        callback(response);
                  });
            });
      });
      socket.on("addFailure", function (data) {
            addFailure(data, function(res) { });
      });
      socket.on("publishLevel", function (data, callback) {
            var response;
            var update = { "uniqueID": data.uniqueID, "parameter": "isPublished", "value": data.isPublished };
            updateLevel(update, function (res) {
                  response = { success: res };
                  callback(response);
            });
      });
      // socket.on("updatelevel", function (data, callback) {
      //     updateLevel(data, function () {
      //         response = {success:true};
      //         callback(response);
      //     });
      // });
      socket.on("deleteLevel", function (data, callback) {
            deleteLevel(data, function () {
                  response = { success: true };
                  callback(response);
            });
      });
});