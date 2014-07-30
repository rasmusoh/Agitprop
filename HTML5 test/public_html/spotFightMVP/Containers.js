var Containers = (function(){    
    var cont={};
    cont.GetAgitator = function (color, barColor) 
    {
        return new Agitator(color, barColor);
    };    
    //constructor
    function Agitator(agitatorColor, barColor) 
    {
        this.agitatorColor = agitatorColor;
        this.barColor = barColor;
        this.container = new createjs.Container();
        this.agitatorShape = new createjs.Shape();               
        this.barShape1 = new createjs.Shape();
        this.barShape2 = new createjs.Shape();
        this.barShape3 = new createjs.Shape();
        this.agitatorShape.graphics.beginFill(agitatorColor).drawRect(0, 0, 50, 200);
        this.barShape1.graphics.beginFill(agitatorColor).drawRect(0, -20, 10, 10);
        this.barShape2.graphics.beginFill(agitatorColor).drawRect(20, -20, 10, 10);
        this.barShape3.graphics.beginFill(agitatorColor).drawRect(40, -20, 10, 10);
        
        this.barShapeArray = [];
        this.barShapeArray[0] = this.barShape1;
        this.barShapeArray[1] = this.barShape2;
        this.barShapeArray[2] = this.barShape3;
        this.stutter = new createjs.Text();
        this.stutter.text = "ehm... well... \n\
                            you know.";
        this.stutter.font = "20px Oswald";
        this.stutter.color = "#FF7700";
        this.stutter.x = -30;
        this.stutter.y = -70;
        this.stutter.alpha = 0;
        this.container.addChild(this.agitatorShape, this.barShape1,this.barShape2,this.barShape3, this.stutter);
    };
    
    Agitator.prototype.SetBars = function(howmany)
    {       
        if(howmany===0)
        {
            this.barShape1.alpha = 0;
            this.barShape2.alpha = 0;
            this.barShape3.alpha = 0;
            this.barShape1.graphics.beginFill(this.barColor).drawRect(0, -20, 10, 10);
            this.barShape2.graphics.beginFill(this.barColor).drawRect(20, -20, 10, 10);
            this.barShape3.graphics.beginFill(this.barColor).drawRect(40, -20, 10, 10);
        }
        else if(howmany===1)
        {
            this.barShape1.alpha = 1;                        
        }
        else if(howmany===2)
        {
            this.barShape2.alpha = 1;            
        }
        else if(howmany===3)
        {
            this.barShape3.alpha = 1;            
            this.barShape1.graphics.beginFill(this.agitatorColor).drawRect(0, -20, 10, 10);
            this.barShape2.graphics.beginFill(this.agitatorColor).drawRect(20, -20, 10, 10);
            this.barShape3.graphics.beginFill(this.agitatorColor).drawRect(40, -20, 10, 10);
        }                  
    };        
    
    cont.GetToppleOpponent = function (color,id)
    {
        return new ToppleOpponent(color, id);
    };
    
    function ToppleOpponent (color, id, model) 
    {
        this.ID = id;
        this.color = color;  
        this.facingLeft = true;
           
        this.container = new createjs.Container();
        
        this.border = new createjs.Shape();
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,50,200);
        this.border.alpha = 0;
        
        this.toppleState = "atRest";

        this.opponent = new createjs.Shape();
        this.opponent.graphics.beginFill(this.color).drawRect(0,0, 50,200);
        this.container.regX = 50;
        this.container.regY = 200;
        this.container.addChild(this.opponent,this.border);
    };    
    
    
    ToppleOpponent.prototype.attackCheck = function(attackType)
    {
        if(this.toppleState === "atRest" 
                || this.toppleState === "pushed" 
                || this.toppleState === "stun"
                || this.toppleState === "pulled")
        {
            switch(attackType)
            {
                case "push":
                    this.changeState("pushed");
                    newRotation = this.container.rotation
                            +100/(Math.abs(this.container.rotation)+10);
                    times = [600,150,250];
                    break;
                    
                case "strongPush":
                    this.changeState("pushed");
                    newRotation = this.container.rotation+5;
                    times = [300,100,200];
                    break;
                case "pull":
                    this.changeState("pulled");
                    newRotation = this.container.rotation
                            -200/(Math.abs(this.container.rotation)+20);
                    times = [500,150,500];
                    break;
                case "stun":
                    this.changeState("stunned");
                    newRotation = this.container.rotation;
                    times = [0,800,0];
                    break;
            }
            if(!this.facingLeft)
            {
                newRotation = -newRotation;
            }
            if(newRotation<0)
            {
                this.container.regX =0;
            }
            else
            {
                this.container.regX =50;
            }
            createjs.Tween.removeTweens(this.container);
            tween = createjs.Tween.get(this.container)
                .to({rotation:newRotation},times[0],createjs.Ease.backOut)
                .wait(times[1])
                .to({rotation:0},times[2],createjs.Ease.quadIn)
                .call(this.changeState,["atRest"]);
        }
    };
    
    ToppleOpponent.prototype.changeState = function(state)
    {
        this.toppleState = state;
    }
    
   
   ToppleOpponent.prototype.flip = function(facingLeft)
   {
       if(this.facingLeft!=facingLeft)
       {
           this.facingLeft=facingLeft;
           if(this.container.regX ===50)
           {
               this.container.regX=0;
           }
           else
           {
               this.container.regX=50;
           }
       }
   }
    
    ToppleOpponent.prototype.Highlight = function()
    {
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0, 50,200);
        this.border.alpha=1;
    };
    
    ToppleOpponent.prototype.Redlight = function()
    {
        this.border.graphics.beginStroke("#da3f3a");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,50, 200);
        this.border.alpha=1;
    };

    ToppleOpponent.prototype.Downlight = function()
    {
        this.border.alpha=0;
    };
            
    cont.GetExit = function (destination, x) 
    {
        return new Exit(destination, x);
    };    
    //constructor
    function Exit(destination, x) 
    {
        this.container = new createjs.Container();
        var exitSign = new createjs.Text();
        var exitDoor = new createjs.Shape();
        this.container.x = x;
        this.container.y = 290;
        exitSign.y = -20;
        exitSign.font = "15px Oswald";
        exitSign.color = "#FF7700";
        exitSign.text = "Exit to " + destination;       
        exitDoor.graphics.beginFill("#111111").drawRect(0, 0, 80, 210);
        this.container.addChild(exitSign, exitDoor);
    }
    
   return cont; 
});