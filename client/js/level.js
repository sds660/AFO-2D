Level = function (levelName, creatorName, entities, background, backgroundMusic, characterTypes, spawnX, spawnY, isPublished, topTimes, userStats) {
	this.levelName = levelName;
	this.creatorName = creatorName;
      this.creationTime = (new Date()).getTime();
      if (socket){
            this.uniqueID = (creatorName + "-"+(user.numLvls+1));
      }
      else {
            this.uniqueID = levelName;
      }
	this.entities = entities;
	this.background = background;
	this.backgroundMusic = backgroundMusic;
	this.characterTypes = characterTypes;
	this.spawnX = spawnX*tileSize;
	this.spawnY = spawnY*tileSize;
	this.isPublished = isPublished;
	this.topTimes = topTimes;
	this.userStats = userStats;
}

LevelStat = function (username, fails, passes, time) {
	this.username = username;
	this.fails = fails;
	this.passes = passes;
	this.time = time;
}

TopTime = function (place, username, time) {
	this.place = place;
	this.username = username;
	this.time = time;
}