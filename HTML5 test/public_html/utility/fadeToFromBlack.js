function fadeToFromBlack(stage, startTimer, isFading, postFade, toNotFrom)
{            
    var tintMultiplier;
    
    tintMultiplier = getTintMultiplier;
    
    function getTintMultiplier()
    {
        if (toNotFrom){return startTimer/2000;}
        if (!toNotFrom){return 1-startTimer/2000;}
    }
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
        stage.children.forEach(function(entry) {
            entry.filters = [
                new createjs.ColorFilter(tintMultiplier(),tintMultiplier(),tintMultiplier(),1)
            ];
            entry.cache(0, 0, entry.image.width, 
            entry.image.height);
        });
        startTimer +=event.delta;                
        
        if(startTimer>2000)
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