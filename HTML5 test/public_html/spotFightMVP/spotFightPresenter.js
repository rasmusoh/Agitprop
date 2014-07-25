var Presenter = (function(){
    var presenter = {},
    view,
    controls,
    model,
    agitatorTimer,
    counterVelocity =50,
    toppleVelocity =20,
    attackVelocity =40,
    attackAngle=50,
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
        //Check Controls and update state logic
        updateAgitatorState(event);
        //update topple physics
        updateTopple(event);
        
        
        //update position
        if(agitator.state==="walkright") 
        {
            agitator.x+=event.delta/10;
        }
        
        if(agitator.state==="walkleft") {agitator.x-=event.delta/10;}
        opponents.forEach(function(opponent){
            view.UpdateRotation(opponent.ID,opponent.trueRotation)
            if(agitator.x > opponent.x-280 && agitator.x < opponent.x-180 && 
                    opponent.state==="preFight")
            {
                view.InRangeOffOpponent(opponent.ID);
                if(controls.AttackPressed)
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
                    opponent.state ="preFight";
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
                    || opponent.toppleState === "attackRelease"))
            {
                opponent.toppleState==="attacking";
            }
        });
    }
    
    function pushCheck()
    {
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight"  && (opponent.toppleState === "atRest" 
                    || opponent.toppleState === "pushed"
                    || opponent.toppleState === "attackRelease"))
            {
                opponent.angVelocity+=opponent.leverage;
                opponent.toppleState==="pushed";
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
                if(opponent.toppleState==="pushed" && opponent.trueRotation>=0)
                {
                    opponent.angVelocity += opponent.resistance*delta;
                    opponent.trueRotation+=opponent.angVelocity*delta;
                    if(opponent.trueRotation<0)
                    {
                        opponent.angVelocity = 0;
                        opponent.trueRotation=0;
                        opponent.toppleState="atRest";
                    }
                    else if (opponent.trueRotation>100)
                    {
                        opponent.trueRotation = 100;
                        if(opponent.angVelocity>toppleVelocity) 
                        {
                            opponent.toppleState="toppled";
                        }
                        else{opponent.angVelocity = 0;}
                    }
                }
                else if(opponent.toppleState==="pushed" && opponent.trueRotation<0)
                {
                    opponent.angVelocity += -opponent.resistance*delta;
                    opponent.trueRotation+=opponent.angVelocity*delta;
                    if(opponent.trueRotation>0)
                    {
                        if(opponent.angVelocity<counterVelocity)
                        {
                            opponent.angVelocity = 0;
                            opponent.trueRotation=0;
                            opponent.toppleState="atRest";
                        }
                    }   
                }
                else if(opponent.toppleState=="attacking")
                {
                    opponent.trueRotation+=attackVelocity;
                    if(opponent.trueRotation>attackAngle)
                    {
                        opponent.toppleState=="attackRelease";
                    }
                }
                else if (opponent.toppleState=="attackRelease")
                {
                    opponent.trueRotation-=attackVelocity;
                    if(opponent.trueRotation<0)
                    {
                        opponent.trueRotation=0;
                        opponent.toppleState="atRest";
                    }
                }
            }
        });
    }
    function updateAgitatorState(e)
    {
        right = controls.RightPressed();
        left = controls.LeftPressed();
        up = controls.UpPressed();
        down = controls.DownPressed();
        attack = controls.AttackPressedNew();
        switch(agitator.state)
        {
            case "standing":
                if(right){agitator.state = "walkright";}
                if(left){agitator.state = "walkleft";}
                if(attack)
                {
                    agitator.state = "pushing";
                    agitatorTimer = pushCharge+pushRelease;
                }
                break;
            case "walkright":
                if(!right){agitator.state = "standing";}
                if(attack)
                {
                    agitator.state = "pulling";
                    agitatorTimer = pullCharge+pullRelease;
                }
                break;
            case "walkleft":
                if(!left){agitator.state = "standing";}
                if(attack)
                {
                    agitator.state = "pushing";
                    agitatorTimer = pushCharge+pushRelease;
                }
                break;
            case "pushing":
                agitatorTimer-=e.delta;
                if(agitatorTimer<pushRelease)
                {
                    pushCheck();
                }
                if(agitatorTimer<0)
                {
                    agitatorTimer = 0;
                    agitator.state = "standing";
                }
                break;
                
            case "pulling":
                agitatorTimer-=e.delta;
                if(agitatorTimer<pullRelease)
                {
                    pullCheck();
                }
                if(agitatorTimer<0)
                {
                    agitatorTimer = 0;
                    agitator.state = "standing";
                }
                break;
        }
                
        
    }
    
    return presenter;
});