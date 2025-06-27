User = function (username, password, securityQues, securityAns, timePlayed, lvlsCompleted, enemiesKilled, achievements, highestCampaign) {
	var self = {};
	self.username = username;
	self.password = password;
	self.securityQuestion = securityQues;
	self.securityAnswer = securityAns;
	self.timePlayed = timePlayed;
	self.lvlsCompleted = lvlsCompleted;
	self.enemiesKilled = enemiesKilled;
      self.achievements = achievements
      self.highestCampaign = 0;
	return self;
}