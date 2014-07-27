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
        
    var agitator, opponents, exits;
    
    presenter.Init = function(viewArg, controlsArg, modelArg, level)
    {        
        view = viewArg;
        controls = controlsArg;        
        model = modelArg;
        view.Init(level);
        controls.Init(this);
        model.Init(level);
        agitator = model.GetAgitator();
        opponents = model.GetOpponents();
        exits = model.GetExits();        
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
 
        opponents.forEach(updateOps);
      
        exits.forEach(checkExit);
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
                opponent.angVelocity=opponent.leverage;
                opponent.toppleState="pushed";
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
                    opponent.angVelocity -= opponent.resistance*delta/1000;
                    opponent.trueRotation+=opponent.angVelocity*delta/1000;
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
                    opponent.angVelocity += opponent.resistance*delta;
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
                else if(opponent.toppleState==="attacking")
                {
                    opponent.trueRotation+=attackVelocity;
                    if(opponent.trueRotation>attackAngle)
                    {
                        opponent.toppleState==="attackRelease";
                    }
                }
                else if (opponent.toppleState==="attackRelease")
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
        switch(agitator.state)
        {
            case "standing":
                if(right){agitator.state = "walkright";}
                if(left){agitator.state = "walkleft";}

                break;
            case "walkright":
                if(!right){agitator.state = "standing";}
                break;
            case "walkleft":
                if(!left){agitator.state = "standing";}
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
    
   presenter.handleAttack = function(e)
    {
        console.log("attack!");
        opponents.forEach(function(opponent)
        {
            if(inRange(opponent))
            {
                view.Engage(opponent.ID);
                opponent.state = "fight";
            }
        });
        if(agitator.state==="walkright")
        {
            agitator.state = "pulling";
            agitatorTimer = pullCharge+pullRelease;
        }
        else
        {
            agitator.state = "pushing";
            agitatorTimer = pushCharge+pushRelease;
        }
    }
    
    function inRange(opponent)
    {
        if(agitator.x > opponent.x-280 && agitator.x < opponent.x-180){
            return true;}
        else{return false;}
    }
    
    function updateOps(opponent)
    {   
        view.UpdateRotation(opponent.ID,opponent.trueRotation);
        if(inRange(opponent) && 
                opponent.state==="preFight")
        {
            view.InRangeOffOpponent(opponent.ID);
        }
        if(!inRange(opponent))
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

    }
    
    function checkExit(exit) 
    {
        if(Math.abs(agitator.x-exit.x)<10)
        {
            console.log("not implemented. Destination: " + xit.destination);
        }
    };
    
    return presenter;
});