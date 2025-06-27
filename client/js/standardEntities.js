//Enemies
getStandardEnemies = function (name) {
	var standardEnemies = [];
	standardEnemies["alligator"] = new Enemy("alligator",0,0,3,2,100,100,100,"","",12,20);
	standardEnemies["bat"] = new Enemy("bat",0,0,2,2,100,100,100,"","",3,20);
	standardEnemies["dragon"] = new Enemy("dragon",0,0,3,3,100,100,100,"","",60,50);
	standardEnemies["guard"] = new Enemy("guard",0,0,2,2,100,100,100,"","",12,20);
	standardEnemies["heavyGuard"] = new Enemy("heavyGuard",0,0,2,2,100,100,100,"","",30,40);
	standardEnemies["rat"] = new Enemy("rat",0,0,3,2,100,100,100,"","",3,20);
	standardEnemies["snake"] = new Enemy("snake",0,0,2,2,100,100,100,"","",3,20); 
	standardEnemies["wizard"] = new Enemy("wizard",0,0,2,2,0,0,100,"","",6,50);
	standardEnemies["fireball"] = new Enemy("fireball",0,0,1,1,0,0,100,"","",10,50);
	standardEnemies["arrow"] = new Enemy("arrow",0,0,1,1,0,0,100,"","",10,3);
	if(name) {
		return standardEnemies[name];
	} else {
		return standardEnemies;
	}
}

//Terrain
getStandardTerrains = function (name) {
	var standardTerrains = [];
	standardTerrains["dirt"] = new Terrain("dirt",0,0, 2,2, 0,0,0,"","",0,true);
	standardTerrains["lava"] = new Terrain("lava",0,0, 2,2, 0,0,0,"","",0,false);
	standardTerrains["spike"] = new Terrain("spike",0,0, 2,1, 0,0,0,"","",5,false);
	standardTerrains["water"] = new Terrain("water",0,0, 2,2, 0,0,0,"","",0,false);
	standardTerrains["fire"] = new Terrain("fire",0,0, 2,2, 0,0,0,"","",0,false);
	standardTerrains["gravel"] = new Terrain("gravel",0,0, 2,2, 0,0,0,"","",0,true);
	standardTerrains["mud"] = new Terrain("mud",0,0, 2,2, 0,0,0,"","",0,true);
	standardTerrains["crate"] = new Terrain("crate",0,0, 2,2, 0,0,0,"","",0,true);
	if(name) {
		name = name.replace(/[0-9]/g, "");
		return standardTerrains[name];
	} else {
		return standardTerrains;
	}
}

//Items
getStandardItems = function (name) {
	var standardItems = [];
	standardItems["heart"] = new Item("heart",0,0, 1,1, 0,0,0,"",1,"health", 10);
	standardItems["time"] = new Item("time",0,0, 1,1, 0,0,0,"",1,"time", 5);
	standardItems["checkpoint"] = new Item("checkpoint",0,0, 2,2, 0,0,0,"",1,"checkpoint", 1);
	if(name) {
		return standardItems[name];
	} else {
		return standardItems;
	}
}

/**
 * Editor entity object, used for all possible entities that can be placed in a level
 */
editorEntity = function (name,image_src,width,height) {
	var self = {};
	self.name = name;
	self.image_src = image_src;
	self.width  = width;
	self.height = height;
	return self;
}

//Backgrounds
var editorBackgrounds = [];
editorBackgrounds.push(new editorEntity("background1", "assets/Backgrounds/bricks.png", 0, 0));
editorBackgrounds.push(new editorEntity("background2", "assets/Backgrounds/bg_volcano.png", 0, 0));
editorBackgrounds.push(new editorEntity("background3", "assets/Backgrounds/misty-background.png", 0, 0));

//Sounds
var editorSounds = [];
editorSounds.push(new editorEntity("Battle1", "assets/playing-sound.png", 1, 1));
editorSounds.push(new editorEntity("Highland_Holdfast", "assets/playing-sound.png", 1, 1));
editorSounds.push(new editorEntity("Maximum_Security", "assets/playing-sound.png", 1, 1));
editorSounds.push(new editorEntity("Will_to_Chill", "assets/playing-sound.png", 1, 1));
editorSounds.push(new editorEntity("Modern_City", "assets/playing-sound.png", 1, 1));
editorSounds.push(new editorEntity("Blade_Symphony", "assets/playing-sound.png", 1, 1));

//GameCharacters
var gameCharacters = [];
gameCharacters.push(new Character("fighter",0,0,1,2,0,0,3,"sound","volume",false,1,false,false,false));
gameCharacters.push(new Character("jumper",0,0,1,2,0,0,3,"sound","volume",false,1,true,false,false));
gameCharacters.push(new Character("archer",0,0,1,2,0,0,3,"sound","volume",false,1,false,false,false));
gameCharacters.push(new Character("swimmer",0,0,1,2,0,0,3,"sound","volume",false,1,false,true,false));
gameCharacters.push(new Character("digger",0,0,1,2,0,0,3,"sound","volume",false,1,false,false,true));