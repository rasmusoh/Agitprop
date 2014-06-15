//this object represents the player avatar animation
//its basically a Sprite with a initializer which creates the sheet from an xml-map
//with some handy game logic such as stunTimer slapped on
//very similar to Player class
function Opponent(imgOpponent) {
    this.initialize(imgOpponent);
}
Opponent.prototype = new createjs.Sprite();

// public properties:
Opponent.prototype.hit = 0;
Opponent.prototype.alive = true;
Opponent.prototype.stunned = false;
Opponent.prototype.stunTimer = 0;
Opponent.prototype.PP = 100; //persuasion points (=health points. Hey, nobodys killing anyone :))

// constructor:
Opponent.prototype.Sprite_initialize = Opponent.prototype.initialize; //unique to avoid overiding base class


Opponent.prototype.initialize = function (imgPlayer) {
    var localSpriteSheet = this.createSpriteSheet(imgPlayer);
    this.Sprite_initialize(localSpriteSheet);

    // start playing the first sequence:
    this.gotoAndPlay("normstance");     //animate

    // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
    // of animated monster if you disabled the shadow.
    this.shadow = new createjs.Shadow("#000", 3, 2, 2);
    this.name = "Villain";
    this.patterDone = true; //sets to tr
    this.patternNrAttacks = 0; //used for keeping track off current place in a combo
    this.currentPattern = 0; //index of the current attack pattern
    this.idleTimer = 0; //used for keeping track of dodges etc

}

//uppdates attack patterns, or if done, chooses a new attack pattern at random
Opponent.prototype.handleUpdate= function(event){
    patterns =["idle1200high","idle1200low","highattack3x", "dodge1000", "lowattack2x", "aggattack"]; 
    if (this.alive){
        if (this.patternDone == true){
            this.currentPattern = Math.floor(Math.random()*patterns.length);
            switch(patterns[this.currentPattern]){
                case "idle1200high":
                    Villain.gotoAndPlay("highstance");
                    break;
                case "idle1200low":
                    Villain.gotoAndPlay("lowstance");
                    break;
                case "highattack3x":
                    Villain.gotoAndPlay("highattack");
                    break;
                case "dodge1000":
                    Villain.gotoAndPlay("dodge");
                    break;
                case "lowattack2x":
                    Villain.gotoAndPlay("lowattack");
                    break;
                case "aggattack":
                    Villain.gotoAndPlay("aggattack");
                    break;
            }
            this.patternDone=false;
        }
        else{
            switch(patterns[this.currentPattern]){
                case "idle1200high": ;
                case "idle1200low":
                    this.idleTimer+=event.delta;
                    if(this.idleTimer>1200){
                        this.idleTimer=0;
                        Villain.gotoAndPlay("normstance");
                        this.patternDone=true;
                    }
                    break;
                case "highattack3x":
                    if(Villain.currentAnimation=="highstance"){
                        Villain.gotoAndPlay("highattack");
                        this.patternNrAttacks++;
                    if(this.patternNrAttacks>=3){
                        this.patternNrAttacks=0;
                        Villain.gotoAndPlay("normstance");
                        this.patternDone=true;
                    }}

                    break;
                case "dodge1000":
                    this.idleTimer+=event.delta;
                    if(this.idleTimer>1000){
                        this.idleTimer=0;
                        Villain.gotoAndPlay("normstance");
                        this.patternDone=true;
                    }
                    break;
                case "lowattack2x":
                    if(Villain.currentAnimation=="lowstance"){
                        Villain.gotoAndPlay("lowattack");
                        this.patternNrAttacks++;

                    if(this.patternNrAttacks==2){
                        this.patternNrAttacks=0;
                        Villain.gotoAndPlay("lowstance");
                        this.patternDone=true;
                    }
                    }
                case "aggattack":
                    if(Villain.currentAnimation=="normstance"){
                        this.patternDone=true;
                    }
                    break;
            }
        }
    }
}

Opponent.prototype.disable = function(){
    this.alive=false;
}


Opponent.prototype.reset = function(){
    this.stunned = false;
    this.alive = true;
    this.patternDone = true;
    this.PP = 100;
    this.gotoAndPlay("normstance")
}

//called by games' tick function - counts down stun timer etc
Opponent.prototype.tick = function (event) {
    if (this.stunned && this.alive) {
        this.stunTimer-=event.delta;
        if(this.stunTimer<=0){
            this.stunned=false;
             this.gotoAndPlay("normstance");
            this.patterDone=true;
            this.patternNrAttacks = 0; 
            this.currentPattern = 0;
        }
    }
    else{this.handleUpdate(event);}
}

//creates and returns sprite sheet by reading the xml map
Opponent.prototype.createSpriteSheet= function(){
    var xmlDoc = loadXMLDoc("../img/A2textures.xml");
    var frames=xmlDoc.getElementsByTagName("sprite");
    var sheetFrames =[];
    for (var i = 0; i < frames.length; i++)
    {
      var frame = frames[i].attributes;
      // Access each of the data values and construct the sourceRect.
      var Name = frame.getNamedItem("n").nodeValue;
      var x = frame.getNamedItem("x").nodeValue;
      var y = frame.getNamedItem("y").nodeValue;
      var w = frame.getNamedItem("w").nodeValue;
      var h = frame.getNamedItem("h").nodeValue;
      var oX = frame.getNamedItem("offsetX").nodeValue;
      var oY = frame.getNamedItem("offsetY").nodeValue;    
      sheetFrames.push([x,y,w,h,0,oX,oY]);
    }
    //puts together parameter object
    data = {
        framerate: 7
        ,
        images: ["../img/A2textures.png"],
        frames: sheetFrames,
        animations: {
            aggattack: {
                frames:[0,1,1,2,3,4,4,4],
                next:"normstance"
            },
            dodge: 5,
            highattack: {
                frames:[6,6,7,8,8],
                next: "highstance"
            },
            highstance: 9,
            lowattack: {
                frames: [10,11,11,12,13,13],
                next: "lowstance",
            },
            lowstance: 14,
            normstance: 15,
            stunned: 16
        }
    }
    return new createjs.SpriteSheet(data);         
}