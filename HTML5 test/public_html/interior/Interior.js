
    var interiorStage;
    var interior;
    var background;
    var tick;

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
        interiorStage.update();
    }

    function interiordrawShapes()
    {   
        background = new createjs.Bitmap(queue.getResult("bg"));
        foreground = new createjs.Bitmap(queue.getResult("fg")); 
        avatar = new createjs.Bitmap(queue.getResult("avatar")); 
        blueguy = new createjs.Bitmap(queue.getResult("blueguy"));
        avatar.x = 100;
        avatar.y = 0;

        blueguy.x = 300; 
        blueguy.y = 200;
        background.scaleX=0.5;
        background.scaleY=0.5;
        foreground.scaleX=0.5;
        foreground.scaleY=0.5;

        interiorStage.addChild(background); //
        interiorStage.addChild(blueguy);
        interiorStage.addChild(avatar);
        interiorStage.addChild(foreground);
        interiorStage.update();     
    };

    function interiorDestroy(){
        interiorStage.autoClear=true;
        //interiorStage.enableEventsfalse;
        interiorStage.enableDOMEvents(false);
        interiorStage.removeAllChildren();
        interiorStage.update();
        fightInit();
    }