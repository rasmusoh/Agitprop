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
    pushCharge = 100,
    pushRelease = 200,
    stunCharge = 0,
    stunRelease = 1000,
    pullCharge = 150,
    pullRelease =350,
    physicsStepSize = 20,
    physicsDelta = 0,
    mapInfo
    ;
        
    var agitator, opponents, opponentContainers,exits;
    
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
        opponentContainers = view.getOpponentContainers();
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
            view.AgitatorPosition(agitator.x, agitator.y);
        view.AgitatorPushBar(1-((agitatorAttackTimer+stutterDebuff)/(pushRelease+pushCharge)));
        
        view.UpdateStage(event);
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
                    attackCheck("push");
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
                if(agitatorAttackTimer<pullRelease && attackCheckBool)
                {
                    attackCheckBool = false;
                    attackCheck("pull");
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

            case "stunning":                
                agitatorAttackTimer-=e.delta;
                if(agitatorAttackTimer<stunRelease && attackCheckBool)
                {
                    attackCheckBool = false;
                    attackCheck("stun");
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
            
            
            if (agitator.state === "pushing" || agitator.state === "pulling"
                    || agitator.state === "stunning")
            {
                stutter = true;
                firstTimeStutter = true;
                view.AgitatorStutter(true);                
                stutterDebuff += stutterTime;
            }                        
            else
            {
                switch(typeOfAttack)
                {
                    case "push":
                        agitator.state = "pushing";
                        attackCheckBool = true;
                        agitatorAttackTimer = pushCharge+pushRelease;
                        break;                        
                    case "pull":
                        agitator.state = "pulling";
                        attackCheckBool = true;
                        agitatorAttackTimer = pullCharge+pullRelease;
                        break;
                    case "stun":
                        agitator.state = "stunning";
                        attackCheckBool = true;
                        agitatorAttackTimer = pushCharge+pushRelease;
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
    
    function attackCheck(typeOfAttack)
    {
        opponents.forEach(function(opponent)
        {                
            if(opponent.state !== "toppled" && inRange(opponent))
            {
                opponentContainers[opponent.ID].attackCheck(typeOfAttack);
            }
        });
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