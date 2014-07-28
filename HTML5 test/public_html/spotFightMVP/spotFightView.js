var View =(function(){
    var view ={},    
    dialogue,
    background,
    fightShade1,    
    foreground,
    stage,
    opponentArray =[],
    agitator;
    view.AgitatorPosition = function(X,Y)
    {
        agitator.container.x=X;
        agitator.container.y=Y;
    };
    
    view.OpponentPosition = function(id,X,Y)
    {        
        opponentArray.forEach(function(opponent){
		if(opponent.ID===id)
                {
        	    opponent.container.x=X; 
                    opponent.container.y=Y; 
                }
       });
    };
    view.UpdateStage = function()
    {
        stage.update();
    };
    
    view.UpdateRotation = function(id,trueRotation)
    {
        opponentArray.forEach(function(opponent){
                 if(opponent.ID===id)
                 {
                       opponent.UpdateRotation(trueRotation);                        
                 }
        });
    };
    view.InRangeOffOpponent = function(id)
    {
       opponentArray.forEach(function(opponent){
		if(opponent.ID===id)
                {
        	      opponent.Highlight();                      
                }
       });
    };
    
    view.OutOfRangeOffOpponent = function(id)
    {
        opponentArray.forEach(function(opponent){
		if(opponent.ID===id)
                {
        	      opponent.Downlight();
                }
       });
    };
    
    view.Engage = function(id)
    {
        opponentArray.forEach(function(opponent){
		if(opponent.ID===id)
                {
        	      opponent.Raise(); 
                }
       });
    };
    
    view.Disengage = function(id)
    {       
        opponentArray.forEach(function(opponent){
                 if(opponent.ID===id)
                 {
                       opponent.Disengage; 
                 }
        });
    };
    
    view.AgitatorPushBar = function(pct)
    {
        if(pct<0.34)
            agitator.SetBars(1);
        else if(pct<0.67)
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
        
        background = new createjs.Shape();
        bgColor = interior.getElementsByTagName("backgroundColor")[0].childNodes[0].nodeValue;
        background.graphics.beginFill(bgColor).drawRect(0, 0, 800, 600);
        
        
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
            console.log(opponentArray);
            console.log(opponentArray[1]);
            console.log(opponentArray[2]);
            console.log(opp.ID);
            opponentArray[opp.ID] = opp;
        }  
        
        agitator = cont.GetAgitator("#da3f3a", "#333333");        
        
        stage.addChild(background, agitator.container);
        opponentArray.forEach(function(opponent){stage.addChild(opponent.container);});       
        stage.addChild(foreground);  
        stage.update();        
    };        
    return view;
});

