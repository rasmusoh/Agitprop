var Presenter = (function(){
    var presenter = {},
    view,
    controls,
    model,
    agitatorAttackTimer =0,
    attackCheckBool=false,
    stutter = false,
    firstTimeStutter = false,
    stutterDebuff =0,
    stutterTime = 1000,
    counterVelocity =300,
    toppleVelocity =20,
    attackVelocity =40,
    attackAngle=-50,
    pushCharge = 200,
    pushRelease = 500,
    filibusterCharge = 0,
    filibusterRelease = 1000,
    pullCharge = 150,
    pullRelease =350,
    physicsStepSize = 20,
    physicsDelta = 0
    ;
        
    var agitator, opponents, exits;
    
    presenter.Init = function(viewArg, controlsArg, modelArg, level)
    {        
        createjs.Ticker.removeAllEventListeners();
        if(view === undefined)
            view = viewArg;
        if(controls === undefined)
            controls = controlsArg;        
        if(model === undefined)
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
            if(agitator.x<740)            
                agitator.x+=event.delta/1;            
        }
        
        if(agitator.state==="walkleft") 
        {
            if(agitator.x>0)
                agitator.x-=event.delta/1;
        }
 
        opponents.forEach(updateOps);
      
        exits.forEach(checkExit);
        //Update View
        view.AgitatorPosition(agitator.x, agitator.y);
        view.AgitatorPushBar(1-((agitatorAttackTimer+stutterDebuff)/(pushRelease+pushCharge)));
        
        view.UpdateStage(event);
    }
    
    function pullCheck()
    {
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight"  && (opponent.toppleState === "atRest" 
                    || opponent.toppleState === "pushed" 
                    || opponent.toppleState === "filibustered" 
                    || opponent.toppleState === "attackRelease"))
            {
                opponent.toppleState="attacking";
            }
        });
    }
    
    function pushCheck()
    {        
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight"  && !stutter &&(opponent.toppleState === "atRest"                     
                    || opponent.toppleState === "pushed"
                    || opponent.toppleState === "filibustered"
                    || opponent.toppleState === "attackRelease"))
            {
                if(agitator.state === "pushing" )
                {
                    opponent.angVelocity=opponent.leverage;
                    opponent.toppleState="pushed";
                    
                }
                else if (agitator.state === "filibustering")
                {                    
                    opponent.angVelocity=0.5*opponent.leverage;
                    opponent.toppleState="filibustered";
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
            if(opponent.state==="fight" || opponent.toppleState==="pushed")
            {
                if((opponent.toppleState==="pushed" || opponent.toppleState==="filibustered") 
                        && opponent.trueRotation>=0)
                {                   
                    if(firstTimeStutter)
                    {
                        opponent.angVelocity -= opponent.resistance*delta;                        
                        firstTimeStutter = false;
                    }
                    else if(opponent.toppleState==="pushed")
                    {                                                
                        opponent.angVelocity -= opponent.resistance*delta/40000*opponent.trueRotation;
                        opponent.trueRotation+=opponent.angVelocity*delta/1000;                        
                    }
                    else if(opponent.toppleState==="filibustered")
                    {                        
                        opponent.angVelocity -= opponent.resistance*delta/2500;                        
                        opponent.trueRotation+=opponent.angVelocity*delta/1000;                        
                    }
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
                            opponent.state = "toppled";
                            view.Disengage(opponent.ID);
                        }
                        else{opponent.angVelocity = 0;}
                    }                                            
                }
                else if((opponent.toppleState==="pushed" || opponent.toppleState==="filibustered") 
                        && opponent.trueRotation<0)
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
                    opponent.trueRotation-=attackVelocity;
                    if(opponent.trueRotation<attackAngle)
                    {
                        opponent.toppleState="attackRelease";
                    }
                }
                else if (opponent.toppleState==="attackRelease")
                {
                    opponent.trueRotation+=attackVelocity;
                    if(opponent.trueRotation>0)
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
        var right = controls.RightPressed();
        var left = controls.LeftPressed();
        var up = controls.UpPressed();
        var down = controls.DownPressed();        
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
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer<pushRelease && attackCheckBool)
                {          
                    attackCheckBool = false;
                    pushCheck();
                }
                if((agitatorAttackTimer+stutterDebuff)<0)
                {
                    stutterDebuff = 0;
                    stutter = false;
                    agitatorAttackTimer = 0;    
                    view.AgitatorStutter(false);                
                    agitator.state = "standing";
                }
                break;
                
            case "filibustering":                
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer<filibusterRelease && attackCheckBool)
                {
                    attackCheckBool = false;
                    pushCheck();
                }
                if((agitatorAttackTimer+stutterDebuff)<0)
                {
                    stutterDebuff = 0;
                    stutter = false;
                    agitatorAttackTimer = 0;    
                    view.AgitatorStutter(false);                
                    agitator.state = "standing";
                }                
                break;
                
            case "pulling":
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer)
                {
                    pullCheck();
                }
                if(agitatorAttackTimer<0)
                {
                    agitatorAttackTimer = 0;                    
                    agitator.state = "standing";
                }            
        }
                
        
    }
    
   presenter.handleAttack = function(typeOfAttack)
    {
            opponents.forEach(function(opponent)
            {                
                if(opponent.state !== "toppled" && inRange(opponent))
                {
                    view.Engage(opponent.ID);
                    opponent.state = "fight";
                }
            });
            
            
            if (agitator.state === "pushing" || agitator.state === "filibustering")
            {
                stutter = true;
                firstTimeStutter = true;
                view.AgitatorStutter(true);                
                stutterDebuff += stutterTime;
            }                        
            
            else if(agitator.state==="walkleft")
            {
                agitator.state = "pulling";
                agitatorAttackTimer = pullCharge+pullRelease;
            }
            
            else
            {
                switch(typeOfAttack)
                {
                    case "normal":
                        agitator.state = "pushing";
                        attackCheckBool = true;
                        agitatorAttackTimer = pushCharge+pushRelease;
                        break;                        
                    case "filibuster":
                        agitator.state = "filibustering";
                        attackCheckBool = true;
                        agitatorAttackTimer = filibusterCharge+filibusterRelease;
                        break;
                }                                    
            }
    };
    
    function inRange(opponent)
    {
        if(Math.abs(agitator.x - opponent.x) < 280)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    function updateOps(opponent)
    {            
        if(opponent.x<agitator.x && opponent.state==="fight")
        {
            view.FlipOpponent(opponent.ID, false);
        }
        else if(opponent.x>agitator.x && opponent.state==="fight")
        {
            view.FlipOpponent(opponent.ID, true);
        }
                
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
                opponent.state = "preFight";
            }
        }
        view.UpdateRotation(opponent.ID,opponent.trueRotation);
        view.OpponentPosition(opponent.ID, opponent.x, opponent.y);

    }
    
    function checkExit(exit) 
    {
        if(Math.abs(agitator.x-exit.x)<10)
        {
            presenter.Init(View, Controls, Model, exit.destination);
        }
    };
    
    return presenter;
});