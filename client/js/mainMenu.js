//Main Menu images
var menuBackground = new Image();
var logoImg = new Image();
var buildImg = new Image();
var playImg = new Image();
var settingsImg = new Image();
var actImg = new Image();

//img parameters
logoImg.selectable = false;
buildImg.function = "levelEditorContent";
playImg.function = "selectLevel";
settingsImg.function = "settings"
actImg.function = "actSettings";

var WbuildImg = new Image();
var WplayImg = new Image();
var WsettingsImg = new Image();
var WactImg = new Image();

//Normal image sources
menuBackground.src = "assets/menuImages/menuBackground.jpg";
logoImg.src = "assets/menuImages/AFO.png";
playImg.src = "assets/menuImages/play.png";
buildImg.src = "assets/menuImages/buildLevel.png";
settingsImg.src = "assets/menuImages/settings.png";
actImg.src = "assets/menuImages/actImg.png";

//selected image sources
WplayImg.src = "assets/menuImages/Wplay.png";
WbuildImg.src = "assets/menuImages/WbuildLevel.png";
WsettingsImg.src = "assets/menuImages/Wsettings.png";
WactImg.src = "assets/menuImages/WactImg.png";

var menuImgs = [logoImg, playImg, buildImg, settingsImg, actImg];
var selectedMenuImgs = [logoImg, WplayImg, WbuildImg, WsettingsImg, WactImg];

//menuOptions indexes: 0=logo,1=play,2=build,3=settings,4=actSettings
var menuOptionsX = [-1, -1, -1, -1, 1190]; //if =-1, then img will be drawn on center of canvas
var menuOptionsY = [0, 200, 350, 500, 10];


drawMain = function () {
	ctx.clearRect(0,0,1280,720); 
      //draw background
      ctx.drawImage(menuBackground, 0, 0, 1280, 720);
      //console.log(menuOptionsX);
      //draw centre elements
      for (i = 0; i < menuImgs.length; i++) {
            if (menuOptionsX[i] == -1) {
                  menuOptionsX[i] = getCentreX(menuImgs[i])
            }
            if (menuImgs[i].selected == true) {
                  ctx.drawImage(selectedMenuImgs[i], menuOptionsX[i], menuOptionsY[i]);
            } else {
                  ctx.drawImage(menuImgs[i], menuOptionsX[i], menuOptionsY[i]);
            }
      }     
}