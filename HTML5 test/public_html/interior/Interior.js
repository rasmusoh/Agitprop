
    var interiorStage;
    var interior;
    var background;
    var tick;
    var dialogue;
    var battleWon;
    var isPaused;

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
            {id:"avatar",src:"content/img/sprites/AVATAR W LEGS.png"},
            {id:"blueguy",src:"content/img/sprites/A2textures.png"}];
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
        dialogue1 = new createjs.Text();
        dialogue1.text = "ARGUE?";
        dialogue1.font = "96px Oswald";
        dialogue1.color = "#FF7700";
        dialogue1.alpha = 0;
        dialogue1.x=0;
        dialogue1.y=0;
        
        dialogue2 = new createjs.Text();
        dialogue2.text = "NEVERMIND";
        dialogue2.font = "96px Oswald";
        dialogue2.color = "#FF7700";
        dialogue2.alpha = 0;
        dialogue2.x=0;
        dialogue2.y=100;
        
        background = new createjs.Bitmap(queue.getResult("bg"));
        foreground = new createjs.Bitmap(queue.getResult("fg")); 
        avatar = new createjs.Bitmap(queue.getResult("avatar")); 
        blueguy = new createjs.Bitmap(queue.getResult("blueguy"));
        
        avatar.x = 0;
        avatar.y = 250;
        avatar.scaleX=0.5;
        avatar.scaleY=0.5;

        blueguy.x = 900; 
        blueguy.y = 250;
        blueguy.scaleX=0.5;
        blueguy.scaleY=0.5;
        blueguy.sourceRect = new createjs.Rectangle(641,1216,439,376);
        
        background.scaleX=0.8;
        background.scaleY=0.8;
        foreground.scaleX=0.8;
        foreground.scaleY=0.8;

        interiorStage.addChild(background); //
        interiorStage.addChild(blueguy);
        interiorStage.addChild(avatar);
        interiorStage.addChild(foreground);
        interiorStage.addChild(dialogue1);
        interiorStage.addChild(dialogue2);
        interiorStage.update();     
    };
    
    function interiorTick(event)
    {
        if(!createjs.Ticker.getPaused()){
            rekt = foreground.getTransformedBounds();
            if(rekt.x+rekt.width>800 && avatar.x>100){
                background.x-=event.delta/13; 
                foreground.x-=event.delta/10;
                blueguy.x-=event.delta/10;
            }
            else{
                avatar.x+=event.delta/10;
            }

            interiorStage.update();
            if(battleWon==false && blueguy.x-avatar.x<100){
                createjs.Ticker.setPaused(true);
                dialogue1.alpha=100;
                dialogue1.addEventListener("click",interiorGoFight)
                dialogue2.alpha=100;
                dialogue2.addEventListener("click",backToInterior)
                interiorStage.update();
            }
            if(avatar.x > 800)
            {
                interiorGoCity();
            }
        }
    }
    
    function interiorHandleKeyDown(e) {
        if(e.keyCode==32){
            if(isPaused){
                isPaused=false;
                createjs.Ticker.setPaused(false);
            }
            else{
                isPaused=true;
                createjs.Ticker.setPaused(true);
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
        dialogue1.alpha = 0;
        dialogue1.removeAllEventListeners();
        dialogue2.alpha = 0;
        dialogue2.removeAllEventListeners();
        battleWon = true;
        createjs.Ticker.addEventListener("tick",interiorTick);
        createjs.Ticker.setPaused(false);
        interiorStage.update();     
    }
