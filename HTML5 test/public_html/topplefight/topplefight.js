var topplefight = (function(){
    var inter = {},
    avatar, 
    foreground,
    keycontrol,
    stage,
    background,
    spotDown,
    debugInfo,
    npcs,
    person1;

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
        aboutInfo = new createjs.Text("Topple! \nSpace -> push\
            \nSpace+down ->  pull \nSpace+up ->  leverage bump",
            "30px Oswald","black");
        
        
        debugInfo = new createjs.Text("debug Info:","20px Oswald","black");
        debugInfo.x=550;
        background = new createjs.Shape();
        background.graphics.beginFill("#dbeba4").drawRect(0, 0, 1600, 600);
        
        
        foreground = new createjs.Shape();
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 2000, 200);
        
        npcs=[];
        
        person1 = new toppleOpponent("#a05f75",300,30);
        person1.x = 300;
        person1.y = 500;
        npcs[0]=person1;
        
        person2 = new toppleOpponent("#a05f75",10,1);
        person2.x = 600;
        person2.y = 500;
        npcs[1]=person2;
        
        person3 = new toppleOpponent("#a05f75",200,100);
        person3.x = 1000;
        person3.y = 500;
        npcs[2]=person3;
        
        person4 = new toppleOpponent("#a05f75",50,10);
        person4.x = 1400;
        person4.y = 500;
        npcs[3]=person4;
        
        avatar = new HeroTopple("#da3f3a",5,2,person1);
        avatar.x = 0;
        avatar.y = 300;
        

        keycontrol = new toppleKeyControl(avatar);
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        stage.addChild(background, avatar, person1, person2,person3,person4,foreground, aboutInfo,debugInfo);  
        stage.update();
    };
    
    function tick(event)
    {
        keycontrol.tick();
        for (i=0;i<npcs.length;i++){npcs[i].tick(event);}
        avatar.tick(event);
        if(avatar.state==="walkright")
        {
            if(avatar.x>100 && background.x>-800)
            {
                for (i=0;i<npcs.length;i++){npcs[i].x-=event.delta/8;}
                background.x-=event.delta/8;                         
            }
            else
            {
                avatar.x+=event.delta/10;
            }
        }
        if(avatar.state==="walkleft")
        {   
            if(avatar.x<100 && background.x<0)
            {
                for (i=0;i<npcs.length;i++){npcs[i].x+=event.delta/8;}
                background.x+=event.delta/8;                                
            }
            else
            {
                avatar.x-=event.delta/10;
            }

        }
        for (i=0;i<npcs.length;i++)
        {
            if(npcs[i].x-250<avatar.x && avatar.x<npcs[i].x-100 && npcs[i].state==="prefight")
            {
                npcs[i].highlight();
                if(keycontrol.attackPressed)
                {
                    npcs[i].raise();
                    avatar.opponent = npcs[i];
                }
            }
            if(npcs[i].x-250>avatar.x || avatar.x >npcs[i].x-100)
            {
                npcs[i].downlight();
                if(npcs[i].state==="fight")
                {
                    npcs[i].lower();
                    avatar.opponent = null;
                }
            }
        }

        
        //debugInfo.text = person1.statusDump();
    
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