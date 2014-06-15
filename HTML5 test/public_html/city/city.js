var city;
var canvas;
var stage;
var background;
var CityEnum = Object.freeze({"Voksoburg":1, "Discvojotsk":2});

function init(city) 
{
    this.city = city;
    canvas = document.getElementById('cityCanvas');
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    stage.mouseEventsEnabled = true;
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", handleComplete);
    console.log('1');
    if(city===CityEnum.Voksoburg)
    {
        console.log('2');
        var manifest = [                
            {id:"bg",src:"../img/bakgrunder/Ivan_Fomin_NKTP_Contest_Entry.jpg"}];
    }
    else if(city===CityEnum.Discvojotsk)
    {var manifest = [                
            {id:"bg",src:"../img/bakgrunder/moscow-palace-of-soviets-5.jpg"}];}
    queue.loadManifest(manifest);
}

function handleComplete(event)
{        
    drawShapes();
    stage.update();    
}

function drawShapes()
{   
    background = new createjs.Bitmap(queue.getResult("bg"));        
        
    var fightPosX, fightPosY, TravelPosX, TravelPosY, TravelDestination;
    if(city===CityEnum.Voksoburg)
    {
        console.log('4');
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
        stage.update();
    });
    fightShape.addEventListener('mouseout', function(){
        fightShape.alpha = 0.3;
        fightText.alpha = 0;
        stage.update();
    });
    
    fightShape.addEventListener('click', function(){
        window.location.href = "..//fight/fight.html";
    });
    
    var travelShape = new createjs.Shape();
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
        init(cityToTravelTo);
        //window.location.href = "..//travel/travel.html?city="+cityToTravelTo;
    });
    
    stage.addChild(background, fightShape, fightText, travelShape, travelText);    
    stage.update();          
}