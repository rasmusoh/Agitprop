function wellcomeToVoksoburg(background, stage, startTimer, isFading, postFade)
{            
   var foreGround = new createjs.Bitmap("content/img/environments/zoomtest.png");
   var char =new createjs.Bitmap("content/img/sprites/stand.png");   
   fadeArray=[foreGround, char];
   foreGround.x = 0;
   foreGround.y = -300;    
   char.x = 300;
   char.y = 500;
   char.scaleX = 0.3;
   char.scaleY = 0.3;
   
   var filter = new createjs.ColorFilter(0,0,0,1);
   fadeArray.forEach(function(entry) {
           entry.filters = [filter];            
           entry.cache(0, 0, entry.image.width, entry.image.height);
       }); 
    var blurFilter = new createjs.BlurFilter(20,20,1);
    
    createjs.Ticker.addEventListener("tick", tickToShow);
    background.filters =[blurFilter];
    background.cache(0,0,background.image.width,background.image.height);
    
    stage.addChild(background, foreGround, char);
    
    isFading =true;
    function tickToShow(event){
        startTimer +=event.delta;                             
        if (startTimer <1000)
        {
            filter.redMultiplier = startTimer/1000;
            filter.greenMultiplier = startTimer/1000;
            filter.blueMultiplier = startTimer/1000;
             fadeArray.forEach(function(entry) {                
                entry.cache(0, 0, entry.image.width,entry.image.height);
             });                  
         }

        if (startTimer > 1500 && startTimer < 3500)
        {
            char.x = char.x + 3;
            char.y = char.y - 3;
        }

        if (startTimer > 4000 && startTimer < 5500)
        {
            blurFilter.blurX = 20 - 20*(startTimer-4000)/1000;
            blurFilter.blurY = 20 - 20*(startTimer-4000)/1000;    
            background.cache(0, 0, background.image.width,background.image.height);
        }

        if (startTimer>5500)
        {            
            foreGround.y = foreGround.y + 15;
            foreGround.x = foreGround.x - 55;
            foreGround.scaleX = foreGround.scaleX + 0.10;

            char.y = char.y + 10;
            char.x = char.x - 55;
            char.scaleX = char.scaleX + 0.05;
            char.scaleY = char.scaleY + 0.05;
        }
        stage.update();
        if(startTimer>6500)
        {                        
            isFading = false;
            createjs.Ticker.removeEventListener("tick", tickToShow);       
            background.filters=[];
            stage.removeChild(foreGround, char);
            background.cache(0, 0, background.image.width, background.image.height);
            startTimer=0;
            postFade();            
        }                        
    }        
}