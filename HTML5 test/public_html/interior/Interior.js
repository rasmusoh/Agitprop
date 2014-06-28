
    var interiorStage;
    var interior;
    var background;
    var tick;
    var dialogue;
    var battleWon;

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
        interiordrawShapes();
        battleWon = false;
        createjs.Ticker.addEventListener("tick",interiorTick);
        interiorStage.update();
    }

    function interiordrawShapes()
    {   
        dialogue = new createjs.Text();
        dialogue.text = "ARGUE?";
        dialogue.font = "96px Oswald";
        dialogue.color = "#FF7700";
        dialogue.alpha = 0;
        dialogue.x=300;
        dialogue.y=400;
        
        background = new createjs.Bitmap(queue.getResult("bg"));
        foreground = new createjs.Bitmap(queue.getResult("fg")); 
        avatar = new createjs.Bitmap(queue.getResult("avatar")); 
        blueguy = new createjs.Bitmap(queue.getResult("blueguy"));
        
        avatar.x = 100;
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
        interiorStage.addChild(dialogue);
        interiorStage.update();     
    };

    function interiorDestroy()
    {
        interiorStage.autoClear=true;
        //interiorStage.enableEventsfalse;
        interiorStage.enableDOMEvents(false);
        interiorStage.removeAllChildren();
        interiorStage.update();
        fightInit();
    }
    
    function interiorTick(event)
    {
        if(!createjs.Ticker.getPaused()){
            background.x-=event.delta/50; 
            foreground.x-=event.delta/40;
            blueguy.x-=event.delta/20;
            interiorStage.update();
            if(battleWon==false && blueguy.x-avatar.x<100){
                createjs.Ticker.setPaused(true);
                dialogue.alpha=100;
                dialogue.addEventListener("click",interiorGoFight)
                interiorStage.update();
            }
        }
    }
    
    function interiorGoFight()
    {
        //interiorStage.autoClear=true;
        //interiorStage.enableDOMEvents(false);
        //interiorStage.removeAllChildren();
        //interiorStage.update();
        createjs.Ticker.removeAllEventListeners();
        createjs.Ticker.setPaused(false);
        fightInit();
    }
    
    function backToInterior()
    {
        battleWon = true;
        createjs.Ticker.addEventListener("tick",interiorTick);
    }
