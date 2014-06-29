var Menu =(function(){
    var ci={},
    Stage,
    background;
    
    ci.init = function () 
   {
       if(optionals)
       {
        opts = optionals;    
       }
       
       
       cityName = cName;        
       //canvas = document.getElementById('agitpropCanvas');
       Stage = new createjs.Stage("agitpropCanvas");
       Stage.enableMouseOver(20);
       Stage.mouseEventsEnabled = true;
       queue = new createjs.LoadQueue(false);
       queue.installPlugin(createjs.Sound);
       queue.addEventListener("complete", handleComplete);
        var manifest = [                
            {id:"bg",src:"content/img/environments/Ivan_Fomin_NKTP_Contest_Entry.jpg"},
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
       bikeguy
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
            framerate: 10,
            images: [img],
            frames: sheetFrames,
            animations: {
                walk: {
                    frames:[0,1],
                }
            }
        }
        return new createjs.SpriteSheet(data); 
    }
    
}());