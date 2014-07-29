var View =(function(){
    var view ={},    
    dialogue,
    background,    
    foreground,
    stage,
    opponentArray =[],
    agitator,
    startPanX= 400,
    startPan = false,
    oneContainer
    ;
    view.AgitatorPosition = function(X,Y)
    {                             
        
        if (agitator.container.x < startPanX)
        {            
               
        }
        else if(agitator.container.x > 1500-startPanX)
        {
            
        }
        else //if (agitator.container.x > startPanX)
        {                        
            oneContainer.x -= X-agitator.container.x;
        }        
                
        agitator.container.x=X;
        agitator.container.y=Y;
    };
    
    view.OpponentPosition = function(id,X,Y)
    {        
        opponentArray[id].container.x=X; 
        opponentArray[id].container.y=Y;         
    };
    view.UpdateStage = function()
    {
        stage.update();
    };
    
    view.UpdateRotation = function(id,trueRotation)
    {
        opponentArray[id].UpdateRotation(trueRotation);                                         
    };
    view.InRangeOffOpponent = function(id)
    {
       opponentArray[id].Highlight();                                      
    };
    
    view.OutOfRangeOffOpponent = function(id)
    {
        opponentArray[id].Downlight();
    };
    
    view.Engage = function(id)
    {
        opponentArray[id].Redlight();                 
    };
    
    view.Disengage = function(id)
    {       
        opponentArray[id].Downlight();                          
    };
    
    view.AgitatorPushBar = function(pct)
    {
        if(pct<0.25)
            agitator.SetBars(0);
        else if(pct<0.50)
            agitator.SetBars(1);
        else if(pct<0.75)
            agitator.SetBars(2);
        else if(pct>=1) 
            agitator.SetBars(3);
    };
    
    view.AgitatorStutter = function(isStuttering)
    {
        if(isStuttering)
            agitator.stutter.alpha = 1;
        else
            agitator.stutter.alpha = 0;
    };
    
    view.FlipOpponent = function(id, facingLeft)
    {
        if (opponentArray[id].facingLeft !==facingLeft)
        {
            opponentArray[id].facingLeft=facingLeft;     
        }
    };
    
    view.Init = function (level)
    {            
        opponentArray=[];        
        xmlhttp=new XMLHttpRequest();            
        xmlhttp.open("GET","Data/InteriorData.xml",false);
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML;
        
        interiors = xmlDoc.documentElement.getElementsByTagName("interior");                       
        for (var j=0; j<interiors.length;j++)
        {
            if(interiors[j].getElementsByTagName('name')[0].childNodes[0].nodeValue === level)        
                interior = interiors[j];
        }
        
        dialogue = new Dialogue(100,100,"50px Oswald");
        var instructText = new createjs.Text();
        instructText.text = "\
                Arrows: move\n\
                space: normal attack\n\
                z: filabuster (disregard dicplacements effect on angular velocity)\n\
                bars: remember to breathe!";
        instructText.font = "20px Oswald";
        instructText.color = "#FF7700";
        instructText.x = 10;
        instructText.y = 10;
        
        background = new createjs.Shape();
        bgColor = interior.getElementsByTagName("backgroundColor")[0].childNodes[0].nodeValue;
        background.graphics.beginFill(bgColor).drawRect(0, 0, 1500, 600);
        
        
        foreground = new createjs.Shape();
        fgColor = interior.getElementsByTagName("foregroundColor")[0].childNodes[0].nodeValue;
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 2000, 200);
        
        if(stage !== undefined)
        {
            stage.removeAllChildren();
        }
        else
        {
            stage = new createjs.Stage("agitpropCanvas");
        }
        
        cont = new Containers();        
        opponents = interior.getElementsByTagName("opponent");                       
        
        for (var i = 0; i<opponents.length; i++)
        {                    
            opp = cont.GetToppleOpponent(
                    opponents[i].getElementsByTagName("color")[0].childNodes[0].nodeValue,
                    opponents[i].getElementsByTagName("id")[0].childNodes[0].nodeValue
            );                

            opp.x = opponents[i].getElementsByTagName("x")[0].childNodes[0].nodeValue;
            opp.y = opponents[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;            
            opponentArray[opp.ID] = opp;
        }  
        
        agitator = cont.GetAgitator("#da3f3a", "#333333");    
        
        var exits = interior.getElementsByTagName("exit");
        var eA=[];
        for (var i = 0; i<exits.length; i++)
        {
            eA.push(cont.GetExit(
                    exits[i].getElementsByTagName("destination")[0].childNodes[0].nodeValue,
                    exits[i].getElementsByTagName("x")[0].childNodes[0].nodeValue));            
        }
        
        oneContainer = new createjs.Container();
        oneContainer.addChild(background, agitator.container);
        opponentArray.forEach(function(opponent){oneContainer.addChild(opponent.container);});       
        eA.forEach(function(exit){oneContainer.addChild(exit.container);});                       
        oneContainer.addChild(foreground, instructText);
        stage.addChild(oneContainer);
        
//        stage.addChild(background, agitator.container);
//        opponentArray.forEach(function(opponent){stage.addChild(opponent.container);});       
//        eA.forEach(function(exit){stage.addChild(exit.container);});                       
//        stage.addChild(foreground, instructText);  
        stage.update();        
    };        
    return view;
});

