var Presenter = (function(){
    var presenter = {},
    view,
    controls,
    model,
    agitatorAttackTimer =0,
    attackCheckBool=false,
    stutter = false,   
    stutterDebuff =0,
    stutterTime = 1000,   
    pushCharge = 200,
    pushRelease = 500,
    filibusterCharge = 0,
    filibusterRelease = 1000,
    pullCharge = 150,
    pullRelease =350,
    physicsStepSize = 20,
    physicsDelta = 0,
    mapInfo,
    postAgitation = false,
    agitatorIsAgitated = false
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
        mapInfo = model.GetMapInfo();
        createjs.Ticker.addEventListener("tick",tick);
        //initial position for the Agitator
        view.AgitatorPosition(agitator.x, agitator.y);
    };
        
    //One tick to rule them all
    function tick(event)
    {                        
        //Check Controls and update state logic        
        updateAgitatorState(event);
        //update topple physics
        updateTopple(event);
        if(agitator.agitation >0)
        {
            agitator.agitation -= event.delta/8000;
        }                         
        if(postAgitation ===true)
        {
            agitator.agitation -= event.delta/8000;
        }
        if(agitator.agitation <=0.25)
        {
            postAgitation = false;
        }
        
        if(agitator.agitation <=0.9)
        {
            view.AgitatorAgitated(false);
            agitatorIsAgitated = false;
        }
        
        view.AgitationBars(agitator.agitation);
        
        
        //update position
        if(agitator.state==="walkright") 
        {
            if(agitator.x<mapInfo["mapWidth"])            
                agitator.x+=event.delta/5;            
        }
        
        if(agitator.state==="walkleft") 
        {
            if(agitator.x>0)
                agitator.x-=event.delta/5;
        }
 
        opponents.forEach(updateOps);
      
        exits.forEach(checkExit);
        //Update View
        if(agitator.state ==="walkleft" || agitator.state ==="walkright")
        {
            view.AgitatorPosition(agitator.x, agitator.y);
        }
        view.CDBars(1-((agitatorAttackTimer+stutterDebuff)/(pushRelease+pushCharge)));
        
        view.UpdateStage(event);
    }
    
    function attackCheck()
    {
        var agitationMultplier;
        if(agitatorIsAgitated===true)
        {
            agitationMultplier = 2;
            agitatorIsAgitated=false;
        }
        else
        {
            agitationMultplier = 1;
        }
        opponents.forEach(function(opponent)
        {
            if(opponent.state==="fight" && !stutter )
            {   
                if(agitator.fightState === "pulling" )
                {
                    opponent.angVelocity+=-opponent.leverage*agitationMultplier;
                }                        
                else if(agitator.fightState === "pushing" )
                {
                    opponent.angVelocity+=opponent.leverage*agitationMultplier;                    
                    
                }
                else if (agitator.fightState === "filibustering")
                {                    
                    opponent.angVelocity=0.5*opponent.leverage*agitationMultplier;
                }    
            }
        });
        if(agitator.agitation <1)
        {
            agitator.agitation += 0.34;            
        }                                                        
        if(agitator.agitation >= 1)
        {
            view.AgitatorAgitated(true);                    
            agitatorIsAgitated=true;
        }
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
                opponent.angVelocity -= opponent.resistance*delta/40000*opponent.trueRotation;
                opponent.angVelocity/=1.02;                    
                opponent.trueRotation+=opponent.angVelocity*delta/1000;                                                            
                if(opponent.trueRotation>100)
                {
                    opponent.state = "toppled";
                   view.Disengage(opponent.ID);
                }
                //stops completly at low speed
                if(opponent.trueRotation>-10 && opponent.trueRotation<10 && Math.abs(opponent.angVelocity) <0.8*opponent.leverage)
                {
                    opponent.trueRotation = 0;                   
                    opponent.angVelocity = 0;                   
                }
            }
            else if(opponent.state === "preFight")
            {
                opponent.trueRotation = 0;                   
                opponent.angVelocity = 0;                   
            }
        });
    }
    function updateAgitatorState(e)
    {
        var right = controls.RightPressed();
        var left = controls.LeftPressed();        
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
        }
        switch(agitator.fightState)
        {
            case "N/a":
                break
            case "pushing":            
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer<pushRelease && attackCheckBool)
                {          
                    attackCheckBool = false;
                    attackCheck();
                }
                if((agitatorAttackTimer+stutterDebuff)<0)
                {
                    stutterDebuff = 0;
                    stutter = false;
                    agitatorAttackTimer = 0;    
                    view.AgitatorStutter(false);                
                    agitator.fightState = "N/a";
                }
                break;
                
            case "filibustering":                
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer<filibusterRelease && attackCheckBool)
                {
                    attackCheckBool = false;
                    attackCheck();
                }
                if((agitatorAttackTimer+stutterDebuff)<0)
                {
                    stutterDebuff = 0;
                    stutter = false;
                    agitatorAttackTimer = 0;    
                    view.AgitatorStutter(false);                
                    agitator.fightState = "N/a";
                }                
                break;
                
            case "pulling":
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer<pushRelease && attackCheckBool)
                {
                    attackCheckBool = false;
                    attackCheck();
                }
                if((agitatorAttackTimer+stutterDebuff)<0)
                {
                    agitatorAttackTimer = 0;                    
                    agitator.fightState = "N/a";
                    stutter = false;                    
                    view.AgitatorStutter(false);                
                }                                            
                break;       
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
            
            
            if (agitator.fightState === "pushing" || agitator.fightState === "filibustering" 
                    || agitator.fightState === "pulling")
            {
                stutter = true;
                firstTimeStutter = true;
                view.AgitatorStutter(true);                
                stutterDebuff += stutterTime;
            }                        
                                    
            else if(postAgitation === false)
            {
                if(agitator.agitation >1)
                {
                    postAgitation = true;
                }
                switch(typeOfAttack)
                {
                    case "normal":
                        agitator.fightState = "pushing";
                        attackCheckBool = true;
                        agitatorAttackTimer = pushCharge+pushRelease;
                        break;                        
                    case "filibuster":
                        agitator.fightState = "filibustering";
                        attackCheckBool = true;
                        agitatorAttackTimer = filibusterCharge+filibusterRelease;
                        break;
                        
                    case "pulling":
                        agitator.fightState = "pulling";
                        attackCheckBool = true;
                        agitatorAttackTimer = pullCharge+pullRelease;
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