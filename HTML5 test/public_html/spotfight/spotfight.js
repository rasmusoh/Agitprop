var spotfight = (function(){
    var inter = {},
    avatar, 
    foreground,
    keycontrol,
    stage,
    background,
    person1,
    spotDown,
    fightShade,
    spot;

    inter.init = function() 
    {
        stage = new createjs.Stage("agitpropCanvas");
        handleComplete();
        
    }

    function handleComplete()
    {

        drawShapes();      
        createjs.Ticker.addEventListener("tick",tick);
        spotDown = false;
    }

    function drawShapes()
    {           
        dialogue = new Dialogue(100,100,"50px Oswald");
        
        background = new createjs.Shape();
        background.graphics.beginFill("#dbeba4").drawRect(0, 0, 800, 600);
        
        fightShade = new createjs.Shape();
        fightShade.graphics.beginFill("black").drawRect(0, 0, 800, 600);
        fightShade.alpha = 0;
        
        foreground = new createjs.Shape();
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 2000, 200);
        
        spot = new Spot();
        spot.x=250;
        spot.y=430;
        spot.alpha=0;
        
        
        person1 = new spotOpponent("#a05f75", spot, fightShade);
        person1.x = 500;
        person1.y = 300;
        console.log(person1.getNumChildren());
        
        avatar = new HeroSkeleton("#da3f3a",5,2,person1);
        avatar.x = 0;
        avatar.y = 300;
        

        keycontrol = new skeletonKeyControl(avatar);
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        stage.addChild(background,  fightShade, avatar, person1, foreground, spot);  
        stage.update();
    };
    
    function tick(event)
    {
        keycontrol.tick();
        person1.tick(event);
        avatar.tick(event);
        
        if(avatar.state==="walkright")
        {  
            avatar.x+=event.delta/10;
        }
        if(avatar.state==="walkleft")
        {  
            avatar.x-=event.delta/10;
        }
        if(200<avatar.x && avatar.x<300 && person1.state==="prefight")
        {
            person1.highlight();
            if(keycontrol.attackPressed)
            {
                person1.raise();  
            }
        }
        if(200>avatar.x || avatar.x >300)
        {
            person1.downlight();
            if(person1.state==="fight")
            {
                person1.lower();
            }
        }
        
        stage.update(event);
    }
    
    function handleKeyDown(event)
    {
        keycontrol.handleKeyDown(event);
    }
    
    function handleKeyUp(event)
    {
        keycontrol.handleKeyUp(event);
    }
    
    return inter;
}());