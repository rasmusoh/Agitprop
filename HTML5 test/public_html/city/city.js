var cityStage;
var city;
var background;

CityEnum = Object.freeze({"Voksoburg":1, "Discvojotsk":2});



function cityInit(cityName) 
{
    city = cityName;
    //this.canvas = document.getElementById('agitpropCanvas');
    cityStage = new createjs.Stage("agitpropCanvas");
    cityStage.enableMouseOver(20);
    cityStage.mouseEventsEnabled = true;
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", cityHandleComplete);
    if(cityName===CityEnum.Voksoburg)
    {
        var manifest = [                
            {id:"bg",src:"content/img/environments/Ivan_Fomin_NKTP_Contest_Entry.jpg"}];
    }
    else if(cityName===CityEnum.Discvojotsk)
    {
        var manifest = [                
            {id:"bg",src:"content/img/environments/moscow-palace-of-soviets-5.jpg"}];
    }
    queue.loadManifest(manifest);
}

function cityHandleComplete(event)
{        
    citydrawShapes();
    cityStage.update();
}

function citydrawShapes()
{   
    background = new createjs.Bitmap(queue.getResult("bg"));        
        
    var fightPosX, fightPosY, TravelPosX, TravelPosY, TravelDestination;
    if(city===CityEnum.Voksoburg)
    {
        fightPosX=630;
        fightPosY=520;
        travelPosX=100;
        travelPosY=470;
        cityToTravelTo = CityEnum.Discvojotsk;
    }
    else if(city===CityEnum.Discvojotsk)
    {
        fightPosX=50;
        fightPosY=520;
        travelPosX=520;
        travelPosY=500;
        cityToTravelTo = CityEnum.Voksoburg;
    }
    var fightText = new createjs.Text("Fight!", 
        "20px Arial", "#ffffff"); 
    fightText.x = fightPosX; 
    fightText.y = fightPosY-20;
    fightText.textBaseline = "alphabetic";    
    fightText.alpha = 0;
    
    var travelText = new createjs.Text("Travel to Discvojotsk", 
        "20px Arial", "#ffffff"); 
    travelText.x = travelPosX; 
    travelText.y = travelPosY-20;
    travelText.textBaseline = "alphabetic";    
    travelText.alpha = 0;
    
    var fightShape = new createjs.Shape();
    fightShape.graphics.beginFill("#ff0000").drawCircle(fightPosX, fightPosY, 25);
    fightShape.alpha = 0.3;        
    fightShape.addEventListener('mouseover', function(){
        fightShape.alpha = 0.6;
        fightText.alpha = 1;
        cityStage.update();
    });
    fightShape.addEventListener('mouseout', function(){
        fightShape.alpha = 0.3;
        fightText.alpha = 0;
        cityStage.update();
    });
    
    fightShape.addEventListener('click', function(){
        cityDestroy();

    });
    
    var travelShape = new createjs.Shape();
    travelShape.graphics.beginFill("#ff0000").drawCircle(travelPosX, travelPosY, 25);
    travelShape.alpha = 0.3;        
    travelShape.addEventListener('mouseover', function(){
        travelShape.alpha = 0.6;
        travelText.alpha = 1;
        cityStage.update();
    });
    travelShape.addEventListener('mouseout', function(){
        travelShape.alpha = 0.3;
        travelText.alpha = 0;
        cityStage.update();
    });
    
    travelShape.addEventListener('click', function(){
        init(cityToTravelTo);
        //window.location.href = "..//travel/travel.html?city="+cityToTravelTo;
    });
    cityStage.addChild(background, fightShape, fightText, travelShape, travelText)    ; //
    cityStage.update();     
};

function cityDestroy(){
    cityStage.autoClear=true;
    //cityStage.enableEventsfalse;
    cityStage.enableDOMEvents(false);
    cityStage.removeAllChildren();
    cityStage.update();
    interiorInit();
}