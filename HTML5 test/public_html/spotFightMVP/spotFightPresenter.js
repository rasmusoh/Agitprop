var Presenter = (function(){
    var presenter = {},
    view,
    controls,
    model;
        
    var agitator, opponents;
    
    presenter.Init = function(viewArg, controlsArg, modelArg)
    {
        view = viewArg;
        controls = controlsArg;        
        model = modelArg;
        view.Init();
        controls.Init();
        model.Init();
        agitator = model.GetAgitator();
        opponents = model.GetOpponents();
        createjs.Ticker.addEventListener("tick",tick);        
    };
    
    //One tick to rule them all
    function tick(event)
    {        
        //Check Controls and position
        if(controls.RightGetter()){agitator.x += event.delta/5;}
        if(controls.LeftGetter()){agitator.x -= event.delta/5;}        

        opponents.forEach(function(opponent){
            if(opponent.rising && opponent.y > (300-opponent.HP)){opponent.y -= event.delta/5;}        
            if(!opponent.rising && opponent.y < 300){opponent.y += event.delta/5;}

            if(agitator.x > opponent.x-280 && agitator.x < opponent.x-180 && opponent.state==="prefight")
            {
                view.InRangeOffOpponent(opponent.ID);
                if(controls.AttackGetter())
                {
                    view.Engage(opponent.ID);
                    opponent.state = "fight";
                    opponent.rising = true;
                }
            }
            if(agitator.x < opponent.x-280 || agitator.x > opponent.x-180)
            {
                view.OutOfRangeOffOpponent(opponent.ID);
                if(opponent.state==="fight")
                {
                    view.Disengage(opponent.ID);
                    opponent.state ="prefight";
                    opponent.rising = false;
                }
            }
            view.OpponentPosition(opponent.ID, opponent.x, opponent.y);
        });
        
        //Update View
        view.AgitatorPosition(agitator.x, agitator.y);
        
        view.UpdateStage(event);
    }    
    return presenter;
});