var Interior = (function(){
    var inter = {},
    avatar,
    blueguy, 
    blueguyarm,
    foreground,
    dialogue,
    stage,
    interior,
    background,
    tick,
    dialogue,
    battleWon,
    isPaused,
    armRotateBack,
    opts,
    startTimer=0,
    isFading=true,
    person1,
    person2,
    person3,
    cat,
    catWalksLeft = 1,
    catSpeedMultiplier = 8,
    catcatchTip,
    stateEnum = Object.freeze({"Walking":1, "Talking":2, "Standing":3}),
    avatarState=stateEnum.Walking;

    inter.init = function (interiorName, optionals) 
    {
        interior = interiorName;
        opts = optionals;        
             
        stage = new createjs.Stage("agitpropCanvas");
        stage.enableMouseOver(20);
        stage.mouseEventsEnabled = true;
        queue = new createjs.LoadQueue(true);        
        queue.addEventListener("complete", handleComplete);
        var manifest = [                
            {id:"bg",src:"content/img/environments/småstad.png"},
            {id:"fg",src:"content/img/environments/staket.png"},
            {id:"avatar",src:"content/img/sprites/guywalk.png"},
            {id:"blueguy",src:"content/img/sprites/bluestand.png"},
            {id:"blueguyarm",src:"content/img/sprites/smoking arm.png"},            
            {id:"crowd", src:"content/sound/crowd.mp3"}];
        queue.installPlugin(createjs.Sound);
        queue.loadManifest(manifest);
        
    }

    function handleComplete(event)
    {   
        crowd = createjs.Sound.createInstance("crowd");        
        crowd.volume= 0.2;       
        crowd.play({loop:-1});
        isPaused = false;
        battleWon = false;
        drawShapes();        
    }
    
    function postFadeIn()
    {        
        document.onkeydown = handleKeyDown;
        createjs.Ticker.addEventListener("tick",tick);
        avatar.gotoAndPlay("walk");
        stage.addChild(dialogue.getDialogue());
        stage.update();        
    }

    function drawShapes()
    {           
        dialogue = new Dialogue(100,100,"50px Oswald");
        
        background = new createjs.Bitmap(queue.getResult("bg"));
        foreground = new createjs.Bitmap(queue.getResult("fg")); 
        blueguy = new createjs.Bitmap(queue.getResult("blueguy")); 
        blueguyarm = new createjs.Bitmap(queue.getResult("blueguyarm")); 
        sheet = createSpriteSheet(queue.getResult("avatar"));
        avatar = new createjs.Sprite(sheet ,"stand");
               
        person1 = new createjs.Shape();
        person1.graphics.beginFill("#ff0000").drawRect(800, 300, 50, 200);
        person2 = new createjs.Shape();
        person2.graphics.beginFill("#00ff00").drawRect(830, 350, 50, 200);
        person3 = new createjs.Shape();
        person3.graphics.beginFill("#0000ff").drawRect(-200, 350, 50, 200);
        cat = new createjs.Shape();
        cat.graphics.beginFill("#ffffff").drawRect(0, 380, 40, 20);
        
        catcatchTip = new createjs.Text();
        catcatchTip.text = "Gotta stand still and focus to catch a cat";
        catcatchTip.font = "30px Oswald";
        catcatchTip.color = "#FF7700";
        catcatchTip.x = 10;
        catcatchTip.y = 200;
        catcatchTip.alpha=0;
        
        cat.x = 500;
        cat.addEventListener("click", catchCat);
        cat.addEventListener("mouseover", function(){cat.alpha=0.5;});
        cat.addEventListener("mouseout", function(){cat.alpha=1});                
        
        catcatchDialog = new createjs.Text();
        catcatchDialog.text = "You have gained the cat catcher argument! \n\ \n\
                                \"This reminds me of when I catched cats \n\
                               in a Voksoburg backalley. \n\
                               You see it's all about perspective (...)\"";
        catcatchDialog.font = "30px Oswald";
        catcatchDialog.color = "#FF7700";
        catcatchDialog.x = 50;
        catcatchDialog.y = 50;   
        catcatchDialog.alpha = 0;
        
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

        stage.addChild(background, blueguy, blueguyarm, avatar, person1, 
        person2,person3, cat, foreground, catcatchTip, catcatchDialog);  
        fadeIn()
    };
    
    function tick(event)
    {                
        if(!isPaused && !createjs.Ticker.getPaused()){            
            rekt = foreground.getTransformedBounds();            
            if(rekt.x+rekt.width>800 && avatar.x>100){
                person1.x-=event.delta/8;
                person2.x-=event.delta/8;            
                person3.x-=event.delta/32;
                background.x-=event.delta/13; 
                foreground.x-=event.delta/10;
                blueguy.x-=event.delta/10;
                blueguyarm.x-=event.delta/10;                                     
            }
            else{
                avatar.x+=event.delta/10;
                person3.x+=event.delta/15;
            }

            if(battleWon==false && blueguy.x-avatar.x<143){
                avatarState = stateEnum.Talking;
                createjs.Ticker.setPaused(true);
                avatar.gotoAndPlay("stand");
                dialogue.addOption("ARGUE?",goFight);                                                
                dialogue.addOption("NEVERMIND",Interior.backToInterior);
                stage.update();
            }
            if(avatar.x > 800)
            {
                createjs.Ticker.removeAllEventListeners();
                createjs.Ticker.setPaused(false);
                fadeOut();                            
            }
        }
        else
        {
            person3.x+=event.delta/15;
            person1.x-=event.delta/15;
            person2.x-=event.delta/15;            
        }
        
        cat.x -= catWalksLeft*event.delta/catSpeedMultiplier;
        if(Math.random()>0.8)
        {            
            catSpeedMultiplier * Math.random()+0.5;
            if(catSpeedMultiplier < 3 || catSpeedMultiplier > 13)
            {
                catSpeedMultiplier=8;
            }
        }
        if(Math.random()>0.95)
        {
            catWalksLeft = -1*catWalksLeft;            
        }
        
        if(cat.x<avatar.x-300 && catWalksLeft===-1)
        {
            cat.x -= catWalksLeft*event.delta/catSpeedMultiplier;
        }
        else if(cat.x>avatar.x+300 && catWalksLeft===1)
        {
            cat.x -= catWalksLeft*event.delta/catSpeedMultiplier;
        }
        if(armRotateBack){
            blueguyarm.rotation-=1.5;
            armRotateBack = (blueguyarm.rotation>180);
        }
        else{
            blueguyarm.rotation+=1.5;
            armRotateBack = (blueguyarm.rotation>220);
        }
        if(catcatchTip.alpha>0)
        {
            catcatchTip.alpha-=0.02;
        }
        stage.update(event);
    }
    
    function handleKeyDown(e) {
        if(e.keyCode==32 && !createjs.Ticker.getPaused()){
            if(isPaused){
                isPaused=false;
                //createjs.Ticker.setPaused(false);
                avatar.gotoAndPlay("walk");
                avatarState = stateEnum.Walking;
                catcatchDialog.alpha = 0;
            }
            else{
                isPaused=true;
                //createjs.Ticker.setPaused(true);
                avatar.gotoAndPlay("stand");
                avatarState = stateEnum.Standing;
            }
        }
    }
    
    function goFight()
    {
        createjs.Ticker.removeAllEventListeners();
        createjs.Ticker.setPaused(false);
        fightInit();
    }
    
    function goToCity()
    {
        createjs.Sound.removeAllSounds();
        stage.autoClear = true;
        stage.removeAllChildren = true;
        stage.update();        
        City.init(Utility.cityEnum.Voksoburg, {"fader":fadeToFromBlack});
    }
    
    inter.backToInterior = function()
    {
//        dialogue1.alpha = 0;
//        dialogue1.removeAllEventListeners();
//        dialogue2.alpha = 0;
//        dialogue2.removeAllEventListeners();
        dialogue.destroy();
        battleWon = true;
        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setPaused(false);
        avatar.gotoAndPlay("walk");
        avatarState = stateEnum.Walking;
        stage.update();     
    }
    
    createSpriteSheet = function(img)
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
    
    function fadeIn()
    {      
        console.log('interior.fadeIn');
        if (opts['wellcome'])
        {
            opts['wellcome'](stage,startTimer,isFading,postFadeIn);
        }  
        else if (opts['fader'])
        {            
            console.log('interior.ifFader');
            opts['fader'](stage, [background, foreground], startTimer,isFading,postFadeIn, true);                      
        }
        else
        {
            postFadeIn();
        }       
    }
    
    function fadeOut()
    {               
        if (opts['fader'])
        {                          
            opts['fader'](stage, [background, foreground],startTimer,isFading,goToCity, false);           
        }
        else
        {
            goToCity;
        }
    }
    function catchCat(){                
        if(avatarState !== stateEnum.Talking)
        {
            if(!isPaused)
            {
                catcatchTip.alpha=1;
            }
            else if(Math.abs(avatar.x+50-cat.x)< 100)
            {
                catcatchTip.alpha-=0;
                stage.removeChild(cat);                                    
                catcatchDialog.alpha=1;
            }
        }
    }
    return inter;
 }());

 