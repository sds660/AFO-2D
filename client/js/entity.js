var tileSize = 25;

Entity = function (name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume) {
	this.type = "entity";
	this.name = name;
	this.xPos = xPos*tileSize;
	this.yPos = yPos*tileSize;
	this.width = width*tileSize;
	this.height = height*tileSize;
	this.xVel = xVel;
	this.yVel = yVel;
	this.speed = speed;
	this.sound = sound;
	this.volume = volume;
	this.isSolid = true;
	this.move = function () {}
	this.draw = function (newName) {
		var img = imageList[newName];
		ctx.drawImage(img,this.xPos,this.yPos,this.width,this.height);
	}
	this.isColliding = function (ent) {
		if (this.xPos > ent.xPos + ent.width) { return false; }
		if (this.xPos + this.width < ent.xPos) { return false; }
		if (this.yPos > ent.yPos + ent.height) { return false; }
		if ((getBaseName(ent.name) === "lava" || getBaseName(ent.name) === "water" || getBaseName(ent.name) === "spike") && this.yPos + this.height < ent.yPos+5) { return false; }
		else if (this.yPos + this.height < ent.yPos) { return false; }
		return true;
	}
	this.isOnTop = function (ent) {
		if (this.xPos + this.width > ent.xPos+1 &&
			this.xPos < ent.xPos + ent.width-1 &&
			this.yPos + this.height >= ent.yPos-1 &&
			this.yPos < ent.yPos) { return true; }
		else { return false; }
	}
	this.isOnBottom = function (ent) {
		if (this.xPos + this.width > ent.xPos &&
			this.xPos < ent.xPos + ent.width &&
			this.yPos + this.height-1 > ent.yPos + ent.height &&
			this.yPos <= ent.yPos + ent.height-1) { return true; }
		else { return false; }
	}
	this.isOnLeft = function (ent) {
		if (this.xPos < ent.xPos && 
			this.xPos-5 + this.width <= ent.xPos &&
			this.yPos + this.height > ent.yPos+1 &&
			this.yPos < ent.yPos + ent.height-1) { return true; }
		else { return false; }
	}
	this.isOnRight = function (ent) {
		if (this.xPos + this.width > ent.xPos + ent.width && 
			this.xPos+5 >= ent.xPos + ent.width &&
			this.yPos + this.height > ent.yPos+1 &&
			this.yPos < ent.yPos + ent.height-1) { return true; }
		else { return false; }
	}
}

Character = function (name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume,jumping
		,attackDamage,doubleJump,canSwim,canDig) {
	var character = {};
	character = new Entity(name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume);
	character.type = "character";
	character.xPos = xPos;
	character.yPos = yPos;
	character.width = width*tileSize-2;
	character.height = height*tileSize-2;
	character.health = 100;
	character.cooldown = 0;
	character.jumping = jumping;
	character.attackDamage = attackDamage;
	character.doubleJump = doubleJump;
	character.canSwim = canSwim;
	character.canDig = canDig;
	character.drawX = 0;
	character.drawY = 0;
	character.direction = "right";
	character.arrows = [];
	character.draw = function (newName) {
		var img = imageList[newName];
		switch(newName) {
			case "digger":
				if (character.xVel > 1) { character.drawY = 150; }
				else if (character.xVel < -1) { character.drawY = 75; }
				else { character.drawY = 0; }
				if (countTimer%10 == 0 && Math.abs(character.xVel) > 0.001) { character.drawX += 50; }
				if (character.drawX >= 150) { character.drawX = 0; }
				break;
			default:
				if (character.xVel > 1) { character.drawY = 150; }
				else if (character.xVel < -1) { character.drawY = 75; }
				else { character.drawY = 0; }
				if (countTimer%10 == 0 && Math.abs(character.xVel) > 0.001) { character.drawX += 50; }
				if (character.drawX >= 150) { character.drawX = 0; }
				break;
		}
		ctx.drawImage(img,character.drawX,character.drawY,img.width/3,img.height/4,this.xPos,this.yPos,this.width,this.height);
		for (var a in character.arrows) {
			var arrowImg = imageList["arrow"];
			var arrow = character.arrows[a];
			if (arrow.HP <= 0) { continue; }
			arrow.move();
			if (arrow.xVel > 0) { arrow.drawY = 0; }
			else { arrow.drawY = 50; }
			if (countTimer%5 == 0) { arrow.drawX += 50; }
			if (arrow.drawX >= 150) { arrow.drawX = 0; }
			ctx.drawImage(arrowImg,arrow.drawX,arrow.drawY,arrowImg.width/3,arrowImg.height/4,arrow.xPos,arrow.yPos,arrow.width,arrow.height);
		}
	}
	character.move = function () {}
	return character;
}

Enemy = function (name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume,HP,damage) {
	var enemy = {};
	enemy = new Entity(name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume);
	enemy.type = "enemy";
	enemy.xPosInitial = xPos*tileSize;
	enemy.yPosInitial = yPos*tileSize;
	enemy.width = width*tileSize-2;
	enemy.height = height*tileSize-2;
	enemy.HP = HP;
	enemy.damage = damage;
	enemy.isSolid = false;
	enemy.drawX = 0;
	enemy.drawY = 0;
	enemy.new = true;
	enemy.cooldown = 0;
	enemy.draw = function (newName) {
		var img = imageList[newName];
		switch(enemy.name) {
			case "alligator":
				if (enemy.xVel > 0) { enemy.drawY = 97; }
				else if (enemy.xVel < 0) { enemy.drawY = 47; }
				else { enemy.drawY = 0; }
				if (countTimer%7 == 0) { enemy.drawX += 75; }
				if (enemy.drawX >= 225) { enemy.drawX = 0; }
				break;
			case "bat":
				if (enemy.xVel > 0) { enemy.drawY = 100; }
				else if (enemy.xVel < 0) { enemy.drawY = 50; }
				else { enemy.drawY = 0; }
				if (countTimer%7 == 0) { enemy.drawX += 50; }
				if (enemy.drawX >= 150) { enemy.drawX = 0; }
				break;
			case "dragon":
				if (enemy.xVel > 0) { enemy.drawY = 150; }
				else if (enemy.xVel < 0) { enemy.drawY = 75; }
				else { enemy.drawY = 0; }
				if (countTimer%7 == 0) { enemy.drawX += 75; }
				if (enemy.drawX >= 225) { enemy.drawX = 0; }
				break;
			case "guard":
				if (enemy.xVel > 0) { enemy.drawY = 100; }
				else if (enemy.xVel < 0) { enemy.drawY = 50; }
				else { enemy.drawY = 0; }
				if (countTimer%7 == 0) { enemy.drawX += 50; }
				if (enemy.drawX >= 150) { enemy.drawX = 0; }
				break;
			case "heavyGuard":
				if (enemy.xVel > 0) { enemy.drawY = 96; }
				else if (enemy.xVel < 0) { enemy.drawY = 47; }
				else { enemy.drawY = 0; }
				if (countTimer%7 == 0) { enemy.drawX += 50; }
				if (enemy.drawX >= 150) { enemy.drawX = 0; }
				break;
			case "rat":
				if (enemy.xVel > 0) { enemy.drawY = 100; }
				else if (enemy.xVel < 0) { enemy.drawY = 50; }
				else { enemy.drawY = 0; }
				if (countTimer%7 == 0) { enemy.drawX += 73; }
				if (enemy.drawX >= 219) { enemy.drawX = 0; }
				break;
			case "snake":
				if (enemy.xVel > 0) { enemy.drawY = 100; }
				else if (enemy.xVel < 0) { enemy.drawY = 40; }
				else { enemy.drawY = 0; }
				if (countTimer%7 == 0) { enemy.drawX += 50; }
				if (enemy.drawX >= 150) { enemy.drawX = 0; }
				break;
			case "wizard":
				if (player.xPos <= enemy.xPos) { enemy.drawY = 50; }
				else { enemy.drawY = 100; }
				if (countTimer%30 == 0) { enemy.drawX += 50; }
				if (enemy.drawX >= 150) { enemy.drawX = 0; }
				for (var f in enemy.fireballs) {
					var fireball = enemy.fireballs[f];
					if (fireball.HP <= 0) { continue; }
					fireball.draw("fireball");
				}
				break;
			case "fireball":
				if (enemy.xVel > 0) { enemy.drawY = 0; }
				else { enemy.drawY = 50; }
				if (countTimer%5 == 0) { enemy.drawX += 50; }
				if (enemy.drawX >= 150) { enemy.drawX = 0; }
				break;
			default:
				break;
		}
		ctx.drawImage(img,enemy.drawX,enemy.drawY,img.width/3,img.height/4,this.xPos,this.yPos,this.width,this.height);
	}
	enemy.move = function () { 
		if (enemy.new && enemy.name === "bat") { 
			enemy.new = false;  
			enemy.xVel = Math.random()*50+100; enemy.yVel = Math.random()*50+100; 
		}
		if (enemy.new && enemy.name === "dragon") { 
			enemy.new = false;  
			enemy.xVel = enemy.speed*3; enemy.yVel = -(enemy.speed*4); 
		}
		if (enemy.name === "wizard") {
			if (enemy.new) {
				enemy.new = false;
				enemy.fireballs = [];
			}
			if (Math.sqrt((Math.pow(enemy.xPos-player.xPos,2) + Math.pow(enemy.yPos-player.yPos,2))) <= 300 && enemy.cooldown <= 0) { 
				enemy.cooldown = 1 * fps;
				var xV = 0;
				if (player.xPos <= enemy.xPos) { xV = -3; }
				else { xV = 3 }
				var yV = (player.yPos - enemy.yPos)/(2*fps);
				enemy.fireballs.push(new Enemy("fireball",enemy.xPos/25+0.5,enemy.yPos/25+0.5,1,1,xV,yV,3,"",0,1,5));
			}
			for (var f in enemy.fireballs) {
				var fireball = enemy.fireballs[f];
				fireball.xPos += fireball.xVel;
				fireball.yPos += fireball.yVel;
			}
		}
		if (!(enemy.name === "bat") && !(enemy.name === "dragon") && !(enemy.name === "arrow") && !(enemy.name === "fireball")) { enemy.yVel += gravity*50; }
		enemy.xPos += enemy.xVel/fps;
		enemy.yPos += enemy.yVel/fps;

		for (var e in level.entities) {
			var ent = level.entities[e];
			if (enemy.name === "arrow" && enemy.isColliding(ent)) {
				if (ent.type === "enemy" && ent.HP <= 0) { continue; }
				console.log(ent.name);
				if (ent.type === "enemy" && getBaseName(ent.name) !== "fireball") {
					enemy.HP = 0;
					ent.HP -= enemy.damage;
				}
				else if (ent.type === "terrain" && getBaseName(ent.name) !== "dugdirt" && getBaseName(ent.name) !== "water" && getBaseName(ent.name) !== "lava") {
					enemy.HP = 0;
				}
			}
			if (!ent.isSolid) { continue; }
			switch(name) {
				case "bat":
					if (enemy.xPos >= enemy.xPosInitial + 100) { enemy.xPos = enemy.xPosInitial+99; enemy.xVel = -(Math.random()*50+100); }
					if (enemy.xPos <= enemy.xPosInitial - 100) { enemy.xPos = enemy.xPosInitial-99; enemy.xVel = Math.random()*50+100; }
					if (enemy.yPos >= enemy.yPosInitial + 100) { enemy.yPos = enemy.yPosInitial+99; enemy.yVel = -(Math.random()*50+100); }
					if (enemy.yPos <= enemy.yPosInitial - 100)  { enemy.yPos = enemy.yPosInitial-99; enemy.yVel = Math.random()*50+100; }
					break;
				case "dragon":
					if (enemy.xPos >= enemy.xPosInitial + 400) { enemy.xPos = enemy.xPosInitial+399; enemy.xVel = -(enemy.speed*3); enemy.yVel = enemy.speed*4; }
					if (enemy.xPos <= enemy.xPosInitial - 400) { enemy.xPos = enemy.xPosInitial-399; enemy.xVel = enemy.speed*3; enemy.yVel = enemy.speed*4; }
					if (enemy.yPos >= enemy.yPosInitial + 200) { enemy.yPos = enemy.yPosInitial+199; enemy.yVel = -(enemy.speed*4); }
					if (enemy.yPos <= enemy.yPosInitial - 200) { enemy.yPos = enemy.yPosInitial-199; enemy.yVel = enemy.speed*4; }
					break;
				case "wizard":
					if (enemy.isColliding(ent)) {
						if (enemy.isOnTop(ent) && ent.isSolid) { enemy.yVel = 0; enemy.yPos = ent.yPos-enemy.height-1;}
					}
					break;
				default:
					if (enemy.isColliding(ent)) {
						if (enemy.isOnLeft(ent)) { enemy.xVel = -speed; enemy.xPos = ent.xPos-enemy.width-1;}
						else if (enemy.isOnRight(ent)) { enemy.xVel = speed; enemy.xPos = ent.xPos+ent.width+1;}
						else if (enemy.isOnTop(ent) && ent.isSolid) { enemy.yVel = 0; enemy.yPos = ent.yPos-enemy.height-1;}
						else if (enemy.isOnBottom(ent) && ent.isSolid) { enemy.yVel = 0; enemy.yPos = ent.yPos+ent.height+1;}
					}
					break;
			}	
		}
	}
	return enemy;
}

Terrain = function (name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume,damage,isSolid) {
	var terrain = {};
	terrain = new Entity(name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume);
	terrain.type = "terrain";
	terrain.damage = damage;
	terrain.isSolid = isSolid;
	return terrain;
}

Item = function (name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume,specialPower,value) {
	var item = {};
	item = new Entity(name,xPos,yPos,width,height,xVel,yVel,speed,sound,volume);
	item.type = "item";
	item.collected = false;
	item.specialPower = specialPower;
	item.value = value;
	item.isSolid = false;
	item.draw = function (newName) {
		var img = imageList[newName];
		ctx.drawImage(img,0,0,img.width/3,img.height/3,this.xPos,this.yPos,this.width,this.height);
	}
	return item;
}