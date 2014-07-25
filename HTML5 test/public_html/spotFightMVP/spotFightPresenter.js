var Presenter = (function(){
    var presenter = {},
    view,
    controls,
    model,
    agitatorTimer,
    pushCharge = 150,
    pushRelease = 350,
    pullCharge = 150,
    pullRelease =350,
    physicsStepSize = 20,
    physicsDelta = 0
    ;
        
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
        updateAgitatorState(event);
        if(agitator.state==="walkright") {agitator.x+=event.delta/10;}
        if(agitator.state==="walkleft") {agitator.x-=event.delta/10;}

        opponents.forEach(function(opponent){
            view.UpdateRotation(opponent.ID,opponent.trueRotation)
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
    
    function pullCheck()
    {
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight"  && (opponent.toppleState === "atRest" 
                    || opponent.toppleState === "pushed" 
                    || opponent.toppleState === "pulled"))
            {
                opponent.angVelocity=-opponent.leverage;
                
                if(opponent.toppleState==="atRest")
                {
                    opponent.toppleState==="pulled";
                }
            }
        });
    }
    
    function pushCheck()
    {
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight"  && (opponent.toppleState === "atRest" 
                    || opponent.toppleState === "pushed"
                    || opponent.toppleState === "pulled"))
            {
                opponent.angVelocity+=opponent.leverage;
                
                if(opponent.toppleState==="atRest")
                {
                    opponent.toppleState==="pushed";
                }
            }
        });
    }
    
    function updateTopple(e)
    {
        physicsDelta+=e.delta;
        if(physicsStepSize<physicsDelta)
        {
            toppleTick(physicsDelta); //toppling physics           
            physicsDelta = 0;
        }
    }
    
    function toppleTick(delta)
    {
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight")
            {
                if(opponent.toppleState==="pushed")
                {
                    opponent.angVelocity += opponent.resistance*delta;
                    opponent.trueRotation+=opponent.angVelocity*delta;
                    if(opponent.trueRotation<0)
                    {
                        opponent.leverage=Math.max(0,opponent.leverage+
                                opponent.angVelocity/5)
                        opponent.angVelocity = 0;
                        opponent.trueRotation=0;
                        opponent.toppleState="atRest";
                    }
                    else if (opponent.trueRotation>25 )
                    {
                        opponent.angVelocity = 0;
                        opponent.trueRotation = 35;
                        opponent.toppleState="toppled";
                    }
                }
                else if(opponent.toppleState==="pulled")
                {
                    opponent.angVelocity += -opponent.resistance*delta;
                    opponent.trueRotation+=opponent.angVelocity*delta;
                    if(opponent.trueRotation>0)
                    {
                        if(opponent.angVelocity<50)
                        {
                            opponent.angVelocity = 0;
                            opponent.trueRotation=0;
                            opponent.toppleState="atRest";
                        }
                        else
                        {
                            opponent.toppleState="balancing";
                        }
                    }   
                }
            }
        });
    }
    
    return presenter;
});