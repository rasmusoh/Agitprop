
    var interiorStage;
    var interior;
    var background;
    var tick;
    var dialogue;
    var battleWon;
    var isPaused;
    var armRotateBack;

    InteriorEnum = Object.freeze({"Voksoburg":1, "Discvojotsk":2});



    function interiorInit(interiorName) 
    {
        interior = interiorName;
        //this.canvas = document.getElementById('agitpropCanvas');
        interiorStage = new createjs.Stage("agitpropCanvas");
        interiorStage.enableMouseOver(20);
        interiorStage.mouseEventsEnabled = true;
        queue = new createjs.LoadQueue(false);
        queue.installPlugin(createjs.Sound);
        queue.addEventListener("complete", interiorHandleComplete);
        var manifest = [                
            {id:"bg",src:"content/img/environments/småstad.png"},
            {id:"fg",src:"content/img/environments/staket.png"},
            {id:"avatar",src:"content/img/sprites/guywalk.png"},
            {id:"blueguy",src:"content/img/sprites/bluestand.png"},
            {id:"blueguyarm",src:"content/img/sprites/smoking arm.png"}];
        queue.loadManifest(manifest);
    }

    function interiorHandleComplete(event)
    {   
        isPaused = false;
        battleWon = false;
        interiordrawShapes();
        document.onkeydown = interiorHandleKeyDown;
        createjs.Ticker.addEventListener("tick",interiorTick);
        interiorStage.update();
    }

    function interiordrawShapes()
    {   
        dialogue = new Dialogue(100,100,"50px Oswald");
        
        background = new createjs.Bitmap(queue.getResult("bg"));
        foreground = new createjs.Bitmap(queue.getResult("fg")); 
        blueguy = new createjs.Bitmap(queue.getResult("blueguy")); 
        blueguyarm = new createjs.Bitmap(queue.getResult("blueguyarm")); 
        sheet = interiorCreateSpriteSheet(queue.getResult("avatar"));
        avatar = new createjs.Sprite(sheet ,"walk");
        
        avatar.x = 0;
        avatar.y = 250;
        avatar.scaleX=0.5;
        avatar.scaleY=0.5;

        blueguy.x = 900; 
        blueguy.y = 260;
        blueguy.scaleX=0.5;
        blueguy.scaleY=0.5;
        
        
        blueguyarm.x = 1000; 
        blueguyarm.y = 420;
        blueguyarm.scaleX=0.5;
        blueguyarm.scaleY=0.5;
        blueguyarm.rotation = 180;
        armRotateBack = false;
        
        background.scaleX=0.8;
        background.scaleY=0.8;
        foreground.scaleX=0.8;
        foreground.scaleY=0.8;

        interiorStage.addChild(background,blueguy, blueguyarm, avatar, foreground, 
            dialogue.getDialogue());
 //           dia2);
        interiorStage.update();     
    };
    
    function interiorTick(event)
    {
        if(!isPaused && !createjs.Ticker.getPaused()){
            rekt = foreground.getTransformedBounds();
            if(rekt.x+rekt.width>800 && avatar.x>100){
                background.x-=event.delta/13; 
                foreground.x-=event.delta/10;
                blueguy.x-=event.delta/10;
                blueguyarm.x-=event.delta/10;
            }
            else{
                avatar.x+=event.delta/10;
            }

            if(battleWon==false && blueguy.x-avatar.x<143){
                console.log('ttTalk');
                createjs.Ticker.setPaused(true);
                avatar.gotoAndPlay("stand");
                dialogue.addOption("ARGUE?",interiorGoFight);                                                
                dialogue.addOption("NEVERMIND",backToInterior);
                interiorStage.update();
            }
            if(avatar.x > 800)
            {
                interiorGoCity();
            }
        }
        
        if(armRotateBack){
            blueguyarm.rotation-=1.5;
            armRotateBack = (blueguyarm.rotation>180);
        }
        else{
            blueguyarm.rotation+=1.5;
            armRotateBack = (blueguyarm.rotation>220);
        }
        interiorStage.update(event);
    }
    
    function interiorHandleKeyDown(e) {
        if(e.keyCode==32 && !createjs.Ticker.getPaused()){
            if(isPaused){
                isPaused=false;
                //createjs.Ticker.setPaused(false);
                avatar.gotoAndPlay("walk");
            }
            else{
                isPaused=true;
                //createjs.Ticker.setPaused(true);
                avatar.gotoAndPlay("stand");
            }
        }
    }
    
    function interiorGoFight()
    {
        createjs.Ticker.removeAllEventListeners();
        createjs.Ticker.setPaused(false);
        fightInit();
    }
    
    function interiorGoCity()
    {

        interiorStage.autoClear = true;
        interiorStage.removeAllChildren = true;
        interiorStage.update();
        createjs.Ticker.removeAllEventListeners();
        createjs.Ticker.setPaused(false);
        city.init(2);
    }
    
    function backToInterior()
    {
//        dialogue1.alpha = 0;
//        dialogue1.removeAllEventListeners();
//        dialogue2.alpha = 0;
//        dialogue2.removeAllEventListeners();
        dialogue.destroy();
        battleWon = true;
        createjs.Ticker.addEventListener("tick",interiorTick);
        createjs.Ticker.setPaused(false);
        avatar.gotoAndPlay("walk");
        interiorStage.update();     
    }
    
    interiorCreateSpriteSheet = function(img)
    {
        var xmlDoc = loadXMLDoc("content/img/sprites/guywalk.xml");
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
                    frames:[4,5,6,7,0,1,2,3],
                },
                stand: 8
            }
        }
        return new createjs.SpriteSheet(data); 
    }

 