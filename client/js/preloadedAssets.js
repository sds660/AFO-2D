var loading = 0;
var imageList = [];
var soundList = [];
var soundFXList = [];

getBaseName = function (name) {
      return name.replace(/[0-9]/g, "");
}

//GUI
imageList["healthBar"] = new Image();
imageList["healthBar"].onload = function () { loading++; }
imageList["healthBar"].src = "assets/gameImages/healthBar.png";
imageList["clock"] = new Image();
imageList["clock"].onload = function () { loading++; }
imageList["clock"].src = "assets/gameImages/clock.png";

//Characters
imageList["fighter"] = new Image();
imageList["fighter"].onload = function () { loading++; }
imageList["fighter"].src = "assets/characters/fighter.png";
imageList["jumper"] = new Image();
imageList["jumper"].onload = function () { loading++; }
imageList["jumper"].src = "assets/characters/ninja.png";
imageList["archer"] = new Image();
imageList["archer"].onload = function () { loading++; }
imageList["archer"].src = "assets/characters/archer.png";
imageList["swimmer"] = new Image();
imageList["swimmer"].onload = function () { loading++; }
imageList["swimmer"].src = "assets/characters/swimmer.png";
imageList["digger"] = new Image();
imageList["digger"].onload = function () { loading++; }
imageList["digger"].src = "assets/characters/digger.png";

//Terrain
imageList["dirt1"] = new Image();
imageList["dirt1"].onload = function () { loading++; }
imageList["dirt1"].src = "assets/terrain/dirt/Tiles/Tile(1).png";
imageList["dirt2"] = new Image();
imageList["dirt2"].onload = function () { loading++; }
imageList["dirt2"].src = "assets/terrain/dirt/Tiles/Tile2.png";
imageList["dirt3"] = new Image();
imageList["dirt3"].onload = function () { loading++; }
imageList["dirt3"].src = "assets/terrain/dirt/Tiles/Tile(3).png";
imageList["dirt4"] = new Image();
imageList["dirt4"].onload = function () { loading++; }
imageList["dirt4"].src = "assets/terrain/dirt/Tiles/Tile(4).png";
imageList["dirt5"] = new Image();
imageList["dirt5"].onload = function () { loading++; }
imageList["dirt5"].src = "assets/terrain/dirt/Tiles/Tile(5).png";
imageList["dirt6"] = new Image();
imageList["dirt6"].onload = function () { loading++; }
imageList["dirt6"].src = "assets/terrain/dirt/Tiles/Tile(6).png";
imageList["dirt7"] = new Image();
imageList["dirt7"].onload = function () { loading++; }
imageList["dirt7"].src = "assets/terrain/dirt/Tiles/Tile(8).png";
imageList["dirt8"] = new Image();
imageList["dirt8"].onload = function () { loading++; }
imageList["dirt8"].src = "assets/terrain/dirt/Tiles/Tile(10).png"
imageList["dirt9"] = new Image();
imageList["dirt9"].onload = function () { loading++; }
imageList["dirt9"].src = "assets/terrain/dirt/Tiles/Tile(11).png";
imageList["dirt10"] = new Image();
imageList["dirt10"].onload = function () { loading++; }
imageList["dirt10"].src = "assets/terrain/dirt/Tiles/Tile(7).png";
imageList["dirt11"] = new Image();
imageList["dirt11"].onload = function () { loading++; }
imageList["dirt11"].src = "assets/terrain/dirt/Tiles/Tile(12).png";
imageList["dirt12"] = new Image();
imageList["dirt12"].onload = function () { loading++; }
imageList["dirt12"].src = "assets/terrain/dirt/Tiles/Tile(9).png";
imageList["dirt13"] = new Image();
imageList["dirt13"].onload = function () { loading++; }
imageList["dirt13"].src = "assets/terrain/dirt/Tiles/Tile(13).png";

imageList["dirt"] = imageList["dirt2"];

//TerrainDug
imageList["dugdirt1"] = new Image();
imageList["dugdirt1"].onload = function () { loading++; }
imageList["dugdirt1"].src = "assets/terrain/dirt/dug/Tile(1)dug.png";
imageList["dugdirt2"] = new Image();
imageList["dugdirt2"].onload = function () { loading++; }
imageList["dugdirt2"].src = "assets/terrain/dirt/dug/Tile2dug.png";
imageList["dugdirt3"] = new Image();
imageList["dugdirt3"].onload = function () { loading++; }
imageList["dugdirt3"].src = "assets/terrain/dirt/dug/Tile(3)dug.png";
imageList["dugdirt4"] = new Image();
imageList["dugdirt4"].onload = function () { loading++; }
imageList["dugdirt4"].src = "assets/terrain/dirt/dug/Tile(4)dug.png";
imageList["dugdirt5"] = new Image();
imageList["dugdirt5"].onload = function () { loading++; }
imageList["dugdirt5"].src = "assets/terrain/dirt/dug/Tile(5)dug.png";
imageList["dugdirt6"] = new Image();
imageList["dugdirt6"].onload = function () { loading++; }
imageList["dugdirt6"].src = "assets/terrain/dirt/dug/Tile(6)dug.png";
imageList["dugdirt7"] = new Image();
imageList["dugdirt7"].onload = function () { loading++; }
imageList["dugdirt7"].src = "assets/terrain/dirt/dug/Tile(8)dug.png";
imageList["dugdirt8"] = new Image();
imageList["dugdirt8"].onload = function () { loading++; }
imageList["dugdirt8"].src = "assets/terrain/dirt/dug/Tile(10)dug.png"
imageList["dugdirt9"] = new Image();
imageList["dugdirt9"].onload = function () { loading++; }
imageList["dugdirt9"].src = "assets/terrain/dirt/dug/Tile(11)dug.png";
imageList["dugdirt10"] = new Image();
imageList["dugdirt10"].onload = function () { loading++; }
imageList["dugdirt10"].src = "assets/terrain/dirt/dug/Tile(7)dug.png";
imageList["dugdirt11"] = new Image();
imageList["dugdirt11"].onload = function () { loading++; }
imageList["dugdirt11"].src = "assets/terrain/dirt/dug/Tile(12)dug.png";
imageList["dugdirt12"] = new Image();
imageList["dugdirt12"].onload = function () { loading++; }
imageList["dugdirt12"].src = "assets/terrain/dirt/dug/Tile(9)dug.png";
imageList["dugdirt13"] = new Image();
imageList["dugdirt13"].onload = function () { loading++; }
imageList["dugdirt13"].src = "assets/terrain/dirt/dug/Tile(13)dug.png";

imageList["dugdirt"] = imageList["dugdirt2"];

imageList["fire1"] = new Image();
imageList["fire1"].onload = function () { loading++; }
imageList["fire1"].src = "assets/terrain/dirt/Tiles/Tile(14).png";

imageList["fire"] = imageList["fire1"];

imageList["gravel1"] = new Image();
imageList["gravel1"].onload = function () { loading++; }
imageList["gravel1"].src = "assets/terrain/dirt/Tiles/Tile(15).png";

imageList["gravel"] = imageList["gravel1"];

imageList["lava1"] = new Image();
imageList["lava1"].onload = function () { loading++; }
imageList["lava1"].src = "assets/terrain/lava/lava(1).png";
imageList["lava2"] = new Image();
imageList["lava2"].onload = function () { loading++; }
imageList["lava2"].src = "assets/terrain/lava/lava(2).png";
imageList["lava3"] = new Image();
imageList["lava3"].onload = function () { loading++; }
imageList["lava3"].src = "assets/terrain/lava/lava(3).png";

imageList["lava"] = imageList["lava1"];

imageList["mud1"] = new Image();
imageList["mud1"].onload = function () { loading++; }
imageList["mud1"].src = "assets/terrain/dirt/Tiles/Tile(16).png";

imageList["mud"] = imageList["mud1"];

imageList["spike1"] = new Image();
imageList["spike1"].onload = function () { loading++; }
imageList["spike1"].src = "assets/terrain/spikes/Spikes(1).png";
imageList["spike2"] = new Image();
imageList["spike2"].onload = function () { loading++; }
imageList["spike2"].src = "assets/terrain/spikes/Spikes(2).png";
imageList["spike3"] = new Image();
imageList["spike3"].onload = function () { loading++; }
imageList["spike3"].src = "assets/terrain/spikes/Spikes(3).png";
imageList["spike4"] = new Image();
imageList["spike4"].onload = function () { loading++; }
imageList["spike4"].src = "assets/terrain/spikes/Spikes(4).png";

imageList["spike"] = imageList["spike1"];

imageList["water1"] = new Image();
imageList["water1"].onload = function () { loading++; }
imageList["water1"].src = "assets/terrain/water/water(0).png";
imageList["water2"] = new Image();
imageList["water2"].onload = function () { loading++; }
imageList["water2"].src = "assets/terrain/water/water(1).png";
imageList["water3"] = new Image();
imageList["water3"].onload = function () { loading++; }
imageList["water3"].src = "assets/terrain/water/water(2).png";
imageList["water4"] = new Image();
imageList["water4"].onload = function () { loading++; }
imageList["water4"].src = "assets/terrain/water/water(3).png";

imageList["water"] = imageList["water1"];

imageList["crate1"] = new Image();
imageList["crate1"].onload = function () { loading++; }
imageList["crate1"].src = "assets/terrain/Crate.png";

imageList["crate"] = imageList["crate1"];

//Enemies
imageList["snake"] = new Image();
imageList["snake"].onload = function () { loading++; }
imageList["snake"].src = "assets/enemies/snakes.png";
imageList["bat"] = new Image();
imageList["bat"].onload = function () { loading++; }
imageList["bat"].src = "assets/enemies/bats.png";
imageList["rat"] = new Image();
imageList["rat"].onload = function () { loading++; }
imageList["rat"].src = "assets/enemies/rats.png";
imageList["alligator"] = new Image();
imageList["alligator"].onload = function () { loading++; }
imageList["alligator"].src = "assets/enemies/crocodiles.png";
imageList["dragon"] = new Image();
imageList["dragon"].onload = function () { loading++; }
imageList["dragon"].src = "assets/enemies/dragons.png";
imageList["guard"] = new Image();
imageList["guard"].onload = function () { loading++; }
imageList["guard"].src = "assets/enemies/guard.png";
imageList["heavyGuard"] = new Image();
imageList["heavyGuard"].onload = function () { loading++; }
imageList["heavyGuard"].src = "assets/enemies/heavyGuard.png";
imageList["wizard"] = new Image();
imageList["wizard"].onload = function () { loading++; }
imageList["wizard"].src = "assets/enemies/wizard.png";
imageList["fireball"] = new Image();
imageList["fireball"].onload = function () { loading++; }
imageList["fireball"].src = "assets/enemies/fireball.png";
imageList["arrow"] = new Image();
imageList["arrow"].onload = function () { loading++; }
imageList["arrow"].src = "assets/characters/arrow.png";

//items
imageList["heart"] = new Image();
imageList["heart"].onload = function () { loading++; }
imageList["heart"].src = "assets/items/heart-sprite.png";
imageList["time"] = new Image();
imageList["time"].onload = function () { loading++; }
imageList["time"].src = "assets/items/clock-sprite.png";
imageList["checkpoint"] = new Image();
imageList["checkpoint"].onload = function () { loading++; }
imageList["checkpoint"].src = "assets/items/$torches2.png";

//sounds
soundList["Battle1"] = new Audio("assets/sounds/music/Battle1.mp3");
soundList["Battle1"].oncanplaythrough = function () { loading++; }
soundList["Highland_Holdfast"] = new Audio("assets/sounds/music/Highland_Holdfast.mp3");
soundList["Highland_Holdfast"].oncanplaythrough = function () { loading++; }
soundList["Maximum_Security"] = new Audio("assets/sounds/music/Maximum_Security.mp3");
soundList["Maximum_Security"].oncanplaythrough = function () { loading++; }
soundList["Will_to_Chill"] = new Audio("assets/sounds/music/Will_to_Chill.mp3");
soundList["Will_to_Chill"].oncanplaythrough = function () { loading++; }
soundList["Modern_City"] = new Audio("assets/sounds/music/Modern_City.mp3");
soundList["Modern_City"].oncanplaythrough = function () { loading++; }
soundList["Blade_Symphony"] = new Audio("assets/sounds/music/Blade_Symphony.mp3");
soundList["Blade_Symphony"].oncanplaythrough = function () { loading++; }

//sound Effects
soundFXList["jump"] = new Audio("assets/sounds/soundEffects/stepstone_1.wav");
soundFXList["jump"].oncanplaythrough = function () { loading++; }
soundFXList["enemy_hit"] = new Audio("assets/sounds/soundEffects/roblox-death-sound-effect.mp3");
soundFXList["enemy_hit"].oncanplaythrough = function () { loading++; }
soundFXList["item_collection"] = new Audio("assets/sounds/soundEffects/SUCCESSPICKUPCollectChime01.wav");
soundFXList["item_collection"].oncanplaythrough = function () { loading++; }
soundFXList["game_over"] = new Audio("assets/sounds/soundEffects/VictoryTheme.mp3");
soundFXList["game_over"].oncanplaythrough = function () { loading++; }
soundFXList["level_complete"] = new Audio("assets/sounds/soundEffects/success_complete_orchestral_horns.mp3");
soundFXList["level_complete"].oncanplaythrough = function () { loading++; }

pauseSounds = function () {
      for (var name in soundList) {
            soundList[name].pause();
      }
}


//load Campaign
var campaignLevels = getCampaign();
//create myLevels
var myLevels =[];
var otherLevels = [];

