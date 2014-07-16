var skeletonInterior1 = (function(){
    var inter = {},
    avatar,
    foreground,
    stage,
    background,
    battleWon,
    isPaused,
    person1,
    person2,
    person3,
    KEYCODE_W=87,
    KEYCODE_UP=38,
    KEYCODE_DOWN=40,
    KEYCODE_S=83,
    KEYCODE_A=65,
    KEYCODE_LEFT=37,
    KEYCODE_RIGHT=39,
    KEYCODE_SPACE=32,
    KEYCODE_ENTER = 13,
    enemies,
    stateEnum = Object.freeze({"WalkRight":1, "WalkLeft":2,"Talking":3, "Standing":4}),
    avatarState=stateEnum.Standing;

    inter.init = function () 
    {
        stage = new createjs.Stage("agitpropCanvas");
        handleComplete();
        
    }

    function handleComplete()
    {
        isPaused = false;
        battleWon = false;
        createjs.Ticker.addEventListener("tick",tick);
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        drawShapes();        
    }

    function drawShapes()
    {           
        dialogue = new Dialogue(100,100,"50px Oswald");
        
        background = new createjs.Shape();
        background.graphics.beginFill("#e0dfd2").drawRect(0, 0, 1600, 600);
        
        foreground = new createjs.Shape();
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 2000, 200);
        
        avatar = new Skeleton("#da3f3a",2,avatar);
        avatar.x = 0;
        avatar.y = 300;
        
        person1 = new Skeleton("#a05f75",1,0,avatar);
        person1.x = 500;
        person1.y = 300;
        
        person2 = new Skeleton("#8b9b5c",5,0,avatar);
        person2.x = 900
        person2.y = 350;
        
        person3 = new Skeleton("#6b5945",3,2,avatar);
        person3.x = 1300
        person3.y = 350;
        
        enemies = [person1,person2,person3];
        stage.addChild(background, avatar, person1, 
        person2,person3,foreground);  
        stage.update();
    };
    
    function tick(event)
    {
        for (i=0;i<enemies.length; i++)
        {
            enemies[i].tick(event);
        }
        avatar.tick(event);
        
        if(avatarState===stateEnum.WalkRight){  
            if(avatar.x>100 && background.x>-800){
                person1.x-=event.delta/8;
                person2.x-=event.delta/8;            
                person3.x-=event.delta/8;
                background.x-=event.delta/8;                         
            }
            else{
                avatar.x+=event.delta/10;
                //person3.x+=event.delta/15;
            }
        }
        if(avatarState===stateEnum.WalkLeft){  
            if(avatar.x>100 && background.x>-800){
                person1.x+=event.delta/8;
                person2.x+=event.delta/8;            
                person3.x+=event.delta/8;
                background.x+=event.delta/8;                                
            }
            else{
                avatar.x-=event.delta/10;
                //person3.x+=event.delta/15;
            }
        }
        if(avatar.x>800){goToNext()};
        
        stage.update(event);
    }
    
    function goToNext()
    {
        createjs.Ticker.removeAllEventListeners();
        stage.autoClear = true;
        stage.removeAllChildren = true;
        stage.update();        
        skeletonInterior2.init();
    }
    
    
    function avatarAttack(type){
        for (i=0;i<enemies.length; i++)
        {
            dist = enemies[i].x-avatar.x;
            if (dist>0 && dist<150){
                if(type==="bump"){enemies[i].bump();}
                else if(type==="lift"){enemies[i].lift();}
            }
        }
            
    }
    
    
    function handleKeyDown(e) {
        if(e.keyCode===KEYCODE_RIGHT){
            avatarState=stateEnum.WalkRight;
        }
        if(e.keyCode===KEYCODE_LEFT){
            avatarState=stateEnum.WalkLeft;
        }
        if(e.keyCode===KEYCODE_SPACE){
            avatarAttack("bump");
        }
        if(e.keyCode===16){
            avatarAttack("lift");
        }
    }
    
    function handleKeyUp(e) {
        if((e.keyCode===KEYCODE_RIGHT && avatarState===stateEnum.WalkRight)
            || (e.keyCode===KEYCODE_LEFT && avatarState===stateEnum.WalkLeft))
        {
            avatarState=stateEnum.Standing;
        }
    }
    return inter;
}());

