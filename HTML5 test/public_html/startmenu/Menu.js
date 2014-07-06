var Menu =(function(){
    var ci={},
    Stage,
    background,
    bikeguy,
    starttext;
    
    ci.init = function () 
   {  
       //canvas = document.getElementById('agitpropCanvas');
       Stage = new createjs.Stage("agitpropCanvas");
       queue = new createjs.LoadQueue(false);
       queue.installPlugin(createjs.Sound);
       queue.addEventListener("complete", handleComplete);
        var manifest = [                
            {id:"bg",src:"content/img/environments/STARTSCREEN.jpg"},
            {id:"bikeguy", src:"content/img/sprites/bikeguy.png"}];           
       queue.loadManifest(manifest);                
   };
   
   function handleComplete (event)
   {          
       drawShapes();        
   };
   
   function drawShapes()
   {
       background = new createjs.Bitmap(queue.getResult("bg"));
       background.x = -250;
       background.scaleX = 0.7;
       background.scaleY = 0.8;
       
       var sheet = CreateSpriteSheet(queue.getResult("bikeguy"));
       bikeguy = new createjs.Sprite(sheet,"peddle");
       bikeguy.x = 800;
       bikeguy.y = 315;
       bikeguy.scaleX = 0.5;
       bikeguy.scaleY = 0.5;
       
       starttext = new Dialogue(160,400,"96px Oswald");
       starttext.addOption("START GAME", startGame)
       
       Stage.addChild(background,bikeguy, starttext.getDialogue());
       Stage.update();
       
       createjs.Ticker.addEventListener("tick",tick)
   }
   
   function tick(e)
   {
       bikeguy.x-=e.delta/35;
       Stage.update(e);
   }
   
   function startGame()
   {
       createjs.Ticker.removeAllEventListeners();
       starttext.destroy();
       Stage.autoClear=true;
       Stage.enableDOMEvents(false);
       Stage.removeAllChildren();
       Stage.update();
       City.init(Utility.cityEnum.Voksoburg, {"fader":fadeToFromBlack, "wellcome":wellcomeToVoksoburg}); 
   }
   
    
    function CreateSpriteSheet(img)
    {
        var xmlDoc = loadXMLDoc("content/img/sprites/bikeguy.xml");
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
          //var oX = frame.getNamedItem("offsetX").nodeValue; // custom values added on to prevent animation from jumping around
          //var oY = frame.getNamedItem("offsetY").nodeValue; // custom values added on to prevent animation from jumping around   
          sheetFrames.push([x,y,w,h]);
        }
        //puts together parameter object
        data = {
            framerate: 3,
            images: [img],
            frames: sheetFrames,
            animations: {
                peddle: {
                    frames:[0,1],
                }
            }
        }
        return new createjs.SpriteSheet(data); 
    }
    return ci;
}());