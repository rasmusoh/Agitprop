var City =(function(){
    var ci={},
    stage,
    opts ={},
    startTimer=0,
    isFading = true,
    cityName,
    background,    
    queue;


    ci.init = function (cName, optionals) 
    {
        if(optionals)
        {
         opts = optionals;    
        }

        cityName = cName;        
        stage = new createjs.Stage("agitpropCanvas");
        stage.enableMouseOver(20);
        stage.mouseEventsEnabled = true;
        queue = new createjs.LoadQueue(false);        
        queue.addEventListener("complete", handleComplete);
        if(cityName===Utility.cityEnum.Voksoburg)
        {
            var manifest = [                
                {id:"bg",src:"content/img/environments/Ivan_Fomin_NKTP_Contest_Entry.jpg"},
                {id:"bass",src:"content/sound/VFX2 Sub 13.wav"}
                ];
        }
        else if(cityName===Utility.cityEnum.Discvojotsk)
        {
            var manifest = [                
                {id:"bg",src:"content/img/environments/moscow-palace-of-soviets-5.jpg"}];
        }        
        queue.installPlugin(createjs.Sound);
        queue.loadManifest(manifest);                
    };

    function fadeIn()
    {      
        if (opts['wellcome'])
        {
            opts['wellcome'](background, stage,startTimer,isFading,postFadeIn);
        }  
        else if (opts['fader'])
        {
            stage.addChild(background);
            opts['fader'](stage, [background],startTimer,isFading,postFadeIn, true);                      
        }
        else
        {
            stage.addChild(background);
            postFadeIn();
        }       
    }

    function fadeOut(whatToInitAfter)
    {       
        stage.removeChild(fightText, travelText, fightShape, travelShape);
        if (opts['fader'])
        {                          
            opts['fader'](stage, [background],startTimer,isFading,(function(){destroy(); whatToInitAfter();}), false);           
        }
        else
        {
            destroy();
            Interior.init();
        }
    }
    function handleComplete (event)
    {          
        var bass = createjs.Sound.play("bass");
        bass.volume = 0.5;
        drawShapes();        
    };

    function drawShapes()
    {   
        background = new createjs.Bitmap(queue.getResult("bg"));        

        var fightPosX, fightPosY, travelPosX, travelPosY, cityToTravelTo;
        if(cityName===Utility.cityEnum.Voksoburg)
        {
            fightPosX=630;
            fightPosY=520;
            travelPosX=100;
            travelPosY=470;
            cityToTravelTo = Utility.cityEnum.Discvojotsk;           
        }
        else if(cityName===Utility.cityEnum.Discvojotsk)
        {
            fightPosX=50;
            fightPosY=520;
            travelPosX=520;
            travelPosY=500;
            cityToTravelTo = Utility.cityEnum.Voksoburg;
        }
        fightText = new createjs.Text("Fight!", 
            "20px Arial", "#ffffff"); 
        fightText.x = fightPosX; 
        fightText.y = fightPosY-20;
        fightText.textBaseline = "alphabetic";    
        fightText.alpha = 0;

        travelText = new createjs.Text("Travel to Discvojotsk", 
            "20px Arial", "#ffffff"); 
        travelText.x = travelPosX; 
        travelText.y = travelPosY-20;
        travelText.textBaseline = "alphabetic";    
        travelText.alpha = 0;

        fightShape = new createjs.Shape();
        fightShape.graphics.beginFill("#ff0000").drawCircle(fightPosX, fightPosY, 25);
        fightShape.alpha = 0.3;        
        fightShape.addEventListener('mouseover', function(){
            fightShape.alpha = 0.6;
            fightText.alpha = 1;            
            stage.update();
        });
        fightShape.addEventListener('mouseout', function(){
            fightShape.alpha = 0.3;
            fightText.alpha = 0;
            stage.update();
        });
        fightShape.addEventListener('click', function(){
            fadeOut((function(){Interior.init("first",{"fader":fadeToFromBlack})}));           
        });

        travelShape = new createjs.Shape();
        travelShape.graphics.beginFill("#ff0000").drawCircle(travelPosX, travelPosY, 25);
        travelShape.alpha = 0.3;        
        travelShape.addEventListener('mouseover', function(){
            travelShape.alpha = 0.6;
            travelText.alpha = 1;            
            stage.update();
        });
        travelShape.addEventListener('mouseout', function(){
            travelShape.alpha = 0.3;
            travelText.alpha = 0;
            stage.update();
        });

        travelShape.addEventListener('click', function(){
            alert('no hable');            
        });     

        fadeIn();       
    }

    function postFadeIn()
    {
        stage.addChild(fightShape, fightText, travelShape, travelText);        
        stage.addChild(travelText);
        stage.update();  
    }   

    function destroy ()
    {        
        stage.autoClear=true;
        //citystage.enableEventsfalse;
        stage.enableDOMEvents(false);
        stage.removeAllChildren();
        stage.update();       
    };      
    return ci;
}());