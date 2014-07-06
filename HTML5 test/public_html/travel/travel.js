/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var dist;

function init(cityFrom, cityTo) 
{          
    canvas = document.getElementById('travelCanvas');
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    stage.mouseEventsEnabled = true;
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", handleComplete);
    
    var manifest = [                
        {id:"bg",src:"../img/bakgrunder/vasili-baksheyev-a-winter-landscape.jpg"},
        {id:"train",src:"../img/travel/train.png"},
        {id:"smoke",src:"../img/travel/smoke.png"}];
        
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
    trainShape = new createjs.Bitmap(queue.getResult("train")); 
    trainShape.x= 280;
    trainShape.y= 180;        
    stage.addChild(background, trainShape); 
    stage.update();
    stage.addEventListener("click", function(){
        window.location.href = "..//city/city.html" + "?city=" + dist;
    });
}