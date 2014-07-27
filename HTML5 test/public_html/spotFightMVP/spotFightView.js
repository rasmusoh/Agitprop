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
        agitator.x=X;
        agitator.y=Y;
    };
    
    view.OpponentPosition = function(id,X,Y)
    {        
        opponentArray.forEach(function(opponent){
		if(opponent.ID===id)
                {
        	      opponent.x=X; 
                      opponent.y=Y; 
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
    
    view.Init = function ()
    {    
        xmlhttp=new XMLHttpRequest();            
        xmlhttp.open("GET","Data/InteriorData.xml",false);
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML;
        
        dialogue = new Dialogue(100,100,"50px Oswald");
        
        background = new createjs.Shape();
        bgColor = xmlDoc.documentElement.getElementsByTagName("backgroundColor")[0].childNodes[0].nodeValue;
        background.graphics.beginFill(bgColor).drawRect(0, 0, 800, 600);
        
        
        foreground = new createjs.Shape();
        fgColor = xmlDoc.documentElement.getElementsByTagName("foregroundColor")[0].childNodes[0].nodeValue;
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 2000, 200);
        
        stage = new createjs.Stage("agitpropCanvas");
        
        cont = new Containers();        
        opponents = xmlDoc.documentElement.getElementsByTagName("opponent");               
        for (var i = 0; i<opponents.length; i++)
        {                    
            opp = new cont.ToppleOpponent(
                    opponents[i].getElementsByTagName("color")[0].childNodes[0].nodeValue,
                    opponents[i].getElementsByTagName("id")[0].childNodes[0].nodeValue
            );                

            opp.x = opponents[i].getElementsByTagName("x")[0].childNodes[0].nodeValue;
            opp.y = opponents[i].getElementsByTagName("y")[0].childNodes[0].nodeValue;
            opponentArray.push(opp);
        }  
        
        agitator = new cont.Agitator("#da3f3a");
        agitator.x = 0;
        agitator.y = 300;                
        
        stage.addChild(background, agitator);
        opponentArray.forEach(function(opponent){stage.addChild(opponent);});       
        stage.addChild(foreground);  
        stage.update();        
    };        
    return view;
});

