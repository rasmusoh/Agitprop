var toppleTesting = (function(){
    var inter = {},
    foreground,
    stage,
    background,
    debugInfo,
    zDown,
    xDown,
    
    pullCount = 0,
    physicsStepSize = 20,
    physicsDelta = 0,
    agitation = 0,
    agitationBar,
    agitationTimer,
    isAgitated,
    state = "atRest",
    attackTimer=0,
    person1;

    inter.init = function() 
    {
        stage = new createjs.Stage("agitpropCanvas");
        handleComplete();
        queue = new createjs.LoadQueue(true);        
        queue.addEventListener("complete", handleComplete);
        var manifest = [                
            {id:"man 1", src:"content/sound/angry man 1.ogg"},
            {id:"man 2", src:"content/sound/angry man 2.ogg"},
            {id:"man 3", src:"content/sound/angry man 3.ogg"},
            {id:"man 4", src:"content/sound/angry man 4.ogg"},
            {id:"man 5", src:"content/sound/angry man 5.ogg"},
            {id:"man 6", src:"content/sound/angry man 6.ogg"},
            {id:"man 7", src:"content/sound/angry man 7.ogg"},
            {id:"jump 1", src:"content/sound/phaseJump1.ogg"},
            {id:"jump 2", src:"content/sound/phaseJump2.ogg"},
            {id:"jump 3", src:"content/sound/phaseJump3.ogg"},
            {id:"jump 4", src:"content/sound/phaseJump4.ogg"},
            {id:"jump 5", src:"content/sound/phaseJump5.ogg"},
            {id:"crowd", src:"content/sound/crowd.mp3"}];
        queue.installPlugin(createjs.Sound);
        queue.loadManifest(manifest);
        
    }

    function handleComplete()
    {

        drawShapes();
        createjs.Ticker.addEventListener("tick",tick);
        spotDown = false;
    }

    function drawShapes()
    {           
        aboutInfo = new createjs.Text("Topple! \nSpace -> push",
            "30px Oswald","black");
        
        
        debugInfo = new createjs.Text("debug Info:","20px Oswald","black");
        debugInfo.x=550;
        background = new createjs.Shape();
        background.graphics.beginFill("#dbeba4").drawRect(0, 0, 800, 600);
        
        agitationBar = new createjs.Shape();
        agitationBar.graphics.beginFill("#da3f3a").drawRect(5,65,200*agitation,50);
        
        foreground = new createjs.Shape();
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 800, 200);
        
        person1 = new createjs.Shape();
        person1.graphics.beginFill("#a05f75").drawRect(0,0,50,200);
        person1.x = 300;
        person1.y = 500;
        person1.regX =50;
        person1.regY =200;
        
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        stage.addChild(background, person1, foreground,agitationBar,debugInfo,aboutInfo);  
        stage.update();
    };
    
    function tick(event)
    {
        agitationTick(event);
        if(attackTimer>0)
        {
            attackTimer-=event.delta;
            if(attackTimer<=0)
            {
                attackTimer=0;
            }
        }
        stage.update(event);
    }
    
    function agitationTick(event)
    {
        if(agitation===1)
        {
            agitationBar.graphics.clear().beginFill("#da3f3a").drawRect(5,65,200*agitation,50);
            agitationTimer-=event.delta;
            if(agitationTimer<=0)
            {
                isAgitated=false;
                agitation-=0.1;
            }
        }
        else if(agitation>0)
        {
            agitationBar.graphics.clear().beginFill("#fef6ad").drawRect(5,65,200*agitation,50);
            agitation-=event.delta/2000;
            if(agitation<0){agitation=0;}
        }
        
    }
    
    function addAgitation(amount)
    {
        if(!isAgitated)
        {
            agitation+=amount;
           if(agitation>=1)
           {
               agitationTimer = 1000;
               agitation=1;
               isAgitated=true;
           }           
        }
    }
    
    function pushCheck()
    {
        switch(state)
        {
            case "vulnerable":
            case "superpulled":
                playSound("jump 3");
                changeState("attacked");
                rightLean();
                createjs.Tween.removeTweens(person1);
                createjs.Tween.get(person1).to({rotation:18},300,
                createjs.Ease.quadOut)
                        .wait(100)
                        .to({rotation:0},200,createjs.Ease.quadIn)
                        .call(aiHandler);
                break;
            case "attacked":
                playSound("jump 3");
                createjs.Tween.removeTweens(person1);
                tween = createjs.Tween.get(person1).to({rotation:22},300,
                createjs.Ease.quadOut);
                tween.to({rotation:0},300,createjs.Ease.quadIn)
                        .call(aiHandler);
                break;
            case "atRest":
            case "counter":
            case "counterLoop":
                counterCheck();
                break;
                
        }
        
    }
    
    function superPushCheck()
    {
        isAgitated=false;
        agitation-=0.2;
        playSound("jump 3");
        changeState("attacked");
        rightLean();
        createjs.Tween.removeTweens(person1);
        createjs.Tween.get(person1).to({rotation:18},300,
        createjs.Ease.quadOut)
            .wait(100)
            .to({rotation:0},200,createjs.Ease.quadIn)
            .call(aiHandler);
    }
    
    function pullCheck()
    {
        
        if(state==="pulled")
        {
            pullCount+=1;
        }
        else{pullCount=1;}
        if(pullCount===3)
        {
            playSound("jump 4");
            createjs.Tween.removeTweens(person1);
            changeState("superpulled");
            leftLean();
            tween = createjs.Tween.get(person1)
            .to({rotation:-20},200,createjs.Ease.backOut)
            .wait(300)
            .to({rotation:0},500,createjs.Ease.quadIn)
            .call(changeState,["atRest"]);
        }
        else
        {
            playSound("jump 1");
            createjs.Tween.removeTweens(person1);
            changeState("pulled");
            leftLean();
            tween = createjs.Tween.get(person1)
                .to({rotation:-10},500,createjs.Ease.backOut)
                .wait(150)
                .to({rotation:0},500,createjs.Ease.quadIn)
                .call(changeState,["atRest"]);
        }

        
    }

    function aiHandler()
    {
        
        rand = Math.random();
        if(rand<0.3)
        {
            counterLoop();
        }
        else if(rand<0.6)
        {
            counterCheck();
        }
        else
        {
            vulnerable();
        }
    }
    
    function vulnerable()
    {
        createjs.Tween.removeTweens(person1);
        changeState("vulnerable");
        rightLean();
        tween = createjs.Tween.get(person1)
            .to({rotation:5},500,createjs.Ease.backOut)
            .wait(200)
            .to({rotation:0},500,createjs.Ease.quadIn)
            .wait(200)
            .call(changeState,["atRest"]);
    }
    
    function counterCheck()
    {
        playSound("jump 2");
        createjs.Tween.removeTweens(person1);
        changeState("counter");
        rightLean();
        tween = createjs.Tween.get(person1)
            .to({rotation:15},100,createjs.Ease.backOut)
            .to({rotation:0},100,createjs.Ease.quadIn)
            .call(leftLean)
            .to({rotation:-1},200,createjs.Ease.backOut)
            .to({rotation:0},500,createjs.Ease.quadIn)
            .wait(300)
            .call(changeState,["atRest"]);
    }
    
    function counterLoop()
    {
        createjs.Tween.removeTweens(person1);
        changeState("counterLoop");
        leftLean();
        tween = createjs.Tween.get(person1)
            .to({rotation:-15},200,createjs.Ease.backOut)
            .to({rotation:0},200,createjs.Ease.quadIn)
            .to({rotation:-15},200,createjs.Ease.backOut)
            .to({rotation:0},200,createjs.Ease.quadIn)
            .to({rotation:-15},200,createjs.Ease.backOut)
            .to({rotation:0},200,createjs.Ease.quadIn)
            .call(changeState,["atRest"]);
    }
    
    
    function playSound(effect)
    {
        sound = createjs.Sound.createInstance(effect);        
        sound.volume= 0.2;       
        sound.play();
    }
    
    function changeState(newState)
    {
        state = newState;
    }
    
    function leftLean()
    {
        person1.regX =0;
        person1.x = 250;
    }
    
   function rightLean()
   {
        person1.regX =50;
        person1.x = 300;
   }
    
    function handleKeyDown(event)
    {
        if(event.keyCode===90 && zDown === false)
        {
            zDown = true;
            if(attackTimer ===0)
            {
                pullCheck();
                attackTimer =380;
            }
        }
        if(event.keyCode===88 && xDown === false)
        {
            xDown = true;
            if(attackTimer ===0)
            {
                if(isAgitated)
                {
                    superPushCheck();
                    attackTimer =800;
                }
                else
                {
                    pushCheck();
                    attackTimer =300;
                    addAgitation(0.4);
                }
            }
        }
    }
    
    function handleKeyUp(event)
    {
        if(event.keyCode===90)
        {
            zDown = false;
        }
        if(event.keyCode===88)
        {
            xDown = false;
        }
    }
    
    return inter;       
}());