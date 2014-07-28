var Presenter = (function(){
    var presenter = {},
    view,
    controls,
    model,
    agitatorAttackTimer =0,
    attackCheckBool=false,
    stutter = false,
    stutter2 = false,
    stutterDebuff =0,
    stutterTime = 1000,
    counterVelocity =300,
    toppleVelocity =20,
    attackVelocity =40,
    attackAngle=-50,
    pushCharge = 0,
    pushRelease = 700,
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
            agitator.x+=event.delta/10;
        }
        
        if(agitator.state==="walkleft") {agitator.x-=event.delta/10;}
 
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
                    || opponent.toppleState === "attackRelease"))
            {
                opponent.toppleState="attacking";
            }
        });
    }
    
    function pushCheck()
    {
        console.log("pushC");
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight"  && !stutter &&(opponent.toppleState === "atRest"                     
                    || opponent.toppleState === "pushed"
                    || opponent.toppleState === "attackRelease"))
            {
                if(agitator.state === "pushing")
                {
                    opponent.angVelocity=opponent.leverage;
                    opponent.toppleState="pushed";
                    
                }
                else if (agitator.state === "filabustering")
                {
                    opponent.angVelocity=0.5*opponent.leverage;
                    opponent.toppleState="pushed";
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
                if(opponent.toppleState==="pushed" && opponent.trueRotation>=0)
                {
                    if(stutter2)
                    {
                        opponent.angVelocity -= opponent.resistance*delta;                        
                        stutter2 = false;
                    }
                    else
                    {
                        opponent.angVelocity -= opponent.resistance*delta/1000;
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
            case "filabustering":
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer<2*pushRelease)
                {
                    pushCheck();
                }
                if(agitatorAttackTimer<0)
                {
                    agitatorAttackTimer = 0;
                    agitator.state = "standing";
                }                
                break;
        }
                
        
    }
    
   presenter.handleAttack = function(typeOfAttack)
    {
            opponents.forEach(function(opponent)
            {
                if(inRange(opponent))
                {
                    view.Engage(opponent.ID);
                    opponent.state = "fight";
                }
            });
            
            
            if (agitator.state === "pushing" || agitator.state === "filabustering")
            {
                stutter = true;
                stutter2 = true;
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
                        break;
                    case "filabuster":
                        agitator.state = "filabustering";
                        attackCheckBool = true;
                        break;
                }                
                    agitatorAttackTimer = pushCharge+pushRelease;
            }
    };
    
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
            presenter.Init(View, Controls, Model, exit.destination);
        }
    };
    
    return presenter;
});