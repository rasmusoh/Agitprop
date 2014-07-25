var View =(function(){
    var view ={},
    fightShade = new createjs.Shape(),
    dialogue,
    background,
    fightShade1,
    fightShade2,
    foreground,
    stage,
    spot1,
    opp1,
    spot2,
    opp2,
    agitator;
    view.AgitatorPosition = function(X,Y)
    {
        agitator.x=X;
        agitator.y=Y;
    };
    
    view.OpponentPosition = function(id,X,Y)
    {
        if (id===1)
        {
            opp1.x=X;          
            opp1.y=Y;
        }
        else
        {
            opp2.x=X;          
            opp2.y=Y;
        }
    };
    view.UpdateStage = function()
    {
        stage.update();
    };
    
    view.InRangeOffOpponent = function(id)
    {
       if (id===1)
       {
            opp1.Highlight(); 
       }
       else
       {
           opp2.Highlight();
       }
    };
    
    view.OutOfRangeOffOpponent = function(id)
    {
        if (id===1)
        {
            opp1.Downlight(); 
        }
        else
        {
           opp2.Downlight();
        }
    };
    
    view.Engage = function(id)
    {
        if (id===1)
        {
            opp1.Raise();        
        }
        else
        {
            opp2.Raise();       
        }
    };
    
    view.Disengage = function(id)
    {       
       if (id===1)
        {
            opp1.Lower();        
        }
        else
        {
            opp2.Lower();       
        }
    };
    
    view.Init = function ()
    {          
        dialogue = new Dialogue(100,100,"50px Oswald");
        
        background = new createjs.Shape();
        background.graphics.beginFill("#dbeba4").drawRect(0, 0, 800, 600);
        
        fightShade1 = new createjs.Shape();
        fightShade1.graphics.beginFill("black").drawRect(0, 0, 800, 600);
        fightShade1.alpha = 0;
        
        foreground = new createjs.Shape();
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 2000, 200);
        
        stage = new createjs.Stage("agitpropCanvas");
        fightShade2 = new createjs.Shape();
        fightShade2.graphics.beginFill("black").drawRect(0, 0, 800, 600);
        fightShade2.alpha = 0;
        spot1 = new SpotShape();
        spot1.x=200;
        spot1.y=430;
        spot1.alpha=0;
                
        opp1 = new OpponentContainer("#a05f75", spot1, fightShade1);
        opp1.x = 500;
        opp1.y = 300;        
        
        spot2 = new SpotShape();
        spot2.x=450;
        spot2.y=430;
        spot2.alpha=0;
                
        opp2 = new OpponentContainer("#a05f75", spot2, fightShade2);
        opp2.x = 700;
        opp2.y = 300;        
        
        agitator = new HeroShape("#da3f3a");
        agitator.x = 0;
        agitator.y = 300;                
        
        stage.addChild(background,  fightShade1, fightShade2,agitator, opp1, opp2, spot1, spot2, foreground);  
        stage.update();        
    };        
    return view;
});
