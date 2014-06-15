//this object represents the player avatar animation
//its basically a Sprite with a initializer which creates the sheet from an xml-map
//with some handy game logic such as stunTimer slapped on
//very similar to opponent class
    function Player(imgPlayer) {
        this.initialize(imgPlayer);
    }
    Player.prototype = new createjs.Sprite();

    // public properties:
    Player.prototype.stunned = false; //taken a hit and not allowed to do anything
    Player.prototype.alive = true;
    //Player.prototype.idle = true; //allowed to attack, change stance, dodge - ie in norm- high or lowstance
    Player.prototype.stunTimer = 0; //if stunned, ms until no longer stunned
    Player.prototype.PP = 100//persuasion points (=health points. Hey, nobodys killing anyone :))
    //Player.prototype.dodgeTimer = 0; //player cant dodge indefinetely

    // constructor:
    Player.prototype.Sprite_initialize = Player.prototype.initialize; //unique to avoid overiding base class
 
   
    Player.prototype.initialize = function (imgPlayer) {
        var localSpriteSheet = this.createSpriteSheet(imgPlayer);
        this.Sprite_initialize(localSpriteSheet);

        // start playing the first sequence:
        this.gotoAndPlay("normstance");

        // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
        // of animated monster if you disabled the shadow.
        this.shadow = new createjs.Shadow("#000", 3, 2, 2);
        this.name = "Hero";
        
    }

    //called by games' tick function - counts down stun timer and sets player to idle when nescessary
    Player.prototype.tick = function (event) {
        if (this.stunned) {
            this.stunTimer-=event.delta;
            if(this.stunTimer<=0){
                this.stunned=false;
                this.gotoAndPlay("normstance");
            }
        }
//        else{
//            var frame = this.currentAnimation;
//            if (    frame=="normstance"||
//                    frame=="highstance"||
//                    frame=="lowstance"){
//                this.idle=true;
//            }
//            else if (frame=="dodge"){
//                this.dodgeTimer-=event.delta;
//                if(this.dodgeTimer<=0){
//                    this.idle=true;
//                    this.gotoAndPlay("normstance");
//                }
//            }
//        }
    }
    
 Player.prototype.inControl = function(){
     var frame = this.currentAnimation;
     if(this.alive && !this.stunned && (frame=="highstance" || frame=="lowstance" || frame=="normstance")){
         return true;
     }
     else{
         return false;
     }
 }   
    
    
Player.prototype.reset = function(){
    this.stunned = false;
    this.alive = true;
    //this.idle = true;
    this.PP = 100;
    this.gotoAndPlay("normstance");
}    
    
    //creates and returns sprite sheet by reading the xml map
Player.prototype.createSpriteSheet = function(img){
    var xmlDoc = loadXMLDoc("../img/A1textures.xml");
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
      var oX = frame.getNamedItem("offsetX").nodeValue; // custom values added on to prevent animation from jumping around
      var oY = frame.getNamedItem("offsetY").nodeValue; // custom values added on to prevent animation from jumping around   
      sheetFrames.push([x,y,w,h,0,oX,oY]);
    }
    //puts together parameter object
    data = {
        framerate: 10,
        images: [img],
        frames: sheetFrames,
        animations: {
            aggattack: {
                frames:[0,1,1,1,2,3,4,5,5],
                next:"normstance"
            },
            dodge: [6,6,"normstance",0.22],
            highattack: {
                frames: [7,7,8,9,10],
                next:"highstance"
            },
            highstance: 11,
            lowattack: {
                frames: [12,12,13,14,15,15],
                next: "lowstance"
            },
            lowstance: 16,
            normstance: 17,
            stunned: 18
        }
    }
    return new createjs.SpriteSheet(data);         
}
        
