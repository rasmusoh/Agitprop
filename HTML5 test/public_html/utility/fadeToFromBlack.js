function fadeToFromBlack(stage, BitmapsToFadeArr, startTimer, isFading, postFade, toNotFrom)
{               
    var tintMultiplier;
    
    tintMultiplier = getTintMultiplier;
    
    function getTintMultiplier()
    {
        if (toNotFrom){return startTimer/2500;}
        if (!toNotFrom){return 1-startTimer/2500;}
    }
    var filter = new createjs.ColorFilter(tintMultiplier(),tintMultiplier(),tintMultiplier(),1)
    BitmapsToFadeArr.forEach(function(entry) {
            entry.filters = [filter];                        
            entry.cache(0, 0, entry.image.width, entry.image.height);
            });   
    
    createjs.Ticker.addEventListener("tick", tickToShow);
   
    isFading =true;
    function tickToShow(event){
        filter.redMultiplier = tintMultiplier();
        filter.greenMultiplier = tintMultiplier();
        filter.blueMultiplier = tintMultiplier();
        BitmapsToFadeArr.forEach(function(entry) {            
            if(entry.image)
            {
                entry.cache(0, 0, entry.image.width, entry.image.height);
            }
        });
        startTimer +=event.delta;                
        stage.update();
        
        if(startTimer>3000)
        {                        
            filter.redMultiplier = 1;
            filter.greenMultiplier = 1;
            filter.blueMultiplier = 1;
            isFading = false;           
            createjs.Ticker.removeEventListener("tick", tickToShow);            
            startTimer=0;
            postFade();            
        }                         
    }        
}