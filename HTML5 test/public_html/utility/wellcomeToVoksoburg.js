function wellcomeToVoksoburg(stage, startTimer, isFading, postFade, toNotFrom)
{            
   var tintMultiplier;
   
   tintMultiplier = getTintMultiplier;
   
   function getTintMultiplier()
   {
       return startTimer/2000;
   }
   var foreGround = new createjs.Bitmap("content/img/environments/zoomtest.png");
   var char =new createjs.Bitmap("content/img/sprites/stand.png");   
   foreGround.x = 0;
   foreGround.y = -300;    
   char.x = 300;
   char.y = 500;
   char.scaleX = 0.3;
   char.scaleY = 0.3;
   stage.addChild(foreGround, char);
   stage.children.forEach(function(entry) {
           console.log(entry);
           entry.filters = [
               new createjs.ColorFilter(tintMultiplier(),tintMultiplier(),tintMultiplier(),1)
           ];            
           entry.cache(0, 0, entry.image.width, 
           entry.image.height);
       });
   var timer = 0;
   createjs.Ticker.addEventListener("tick", tickToShow);
   
   isFading =true;
   function tickToShow(event){
       startTimer +=event.delta;                
     
        if (startTimer <2000)
        {
             stage.children.forEach(function(entry) {
                entry.filters = [
                    new createjs.ColorFilter(tintMultiplier(),tintMultiplier(),tintMultiplier(),1)
                ];
                entry.cache(0, 0, entry.image.width, 
                entry.image.height);
             });                  
         }
         
       if (startTimer > 2000 && startTimer < 4000)
       {
           char.x = char.x + 3;
           char.y = char.y - 3;
       }
                  
       
       
       if (startTimer>5000)
       {            
           foreGround.y = foreGround.y + 15;
           foreGround.x = foreGround.x - 55;
           foreGround.scaleX = foreGround.scaleX + 0.10;
           
           char.y = char.y + 10;
           char.x = char.x - 55;
           char.scaleX = char.scaleX + 0.05;
           char.scaleY = char.scaleY + 0.05;
       }
       
       if(startTimer>6000)
       {                        
           isFading = false;
           createjs.Ticker.removeEventListener("tick", tickToShow);            
           stage.removeChild(start);
           startTimer=0;
           postFade();            
       }                 
       stage.update();
   }        
}