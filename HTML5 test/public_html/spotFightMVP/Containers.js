var Containers = (function(){    
    var cont={};
    cont.GetAgitator = function (color, barColor) 
    {
        return new Agitator(color, barColor);
    };    
    //constructor
    function Agitator(agitatorColor, barColor) 
    {
        this.container = new createjs.Container();
        this.agitatorShape = new createjs.Shape();               
        this.barShape1 = new createjs.Shape();
        this.barShape2 = new createjs.Shape();
        this.barShape3 = new createjs.Shape();
        this.agitatorShape.graphics.beginFill(agitatorColor).drawRect(0, 0, 50, 200);
        this.barShape1.graphics.beginFill(barColor).drawRect(0, -20, 10, 10);
        this.barShape2.graphics.beginFill(barColor).drawRect(20, -20, 10, 10);
        this.barShape3.graphics.beginFill(barColor).drawRect(40, -20, 10, 10);
        this.barShape1.alpha = 0;
        this.barShape2.alpha = 0;
        this.barShape3.alpha = 0;
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
        for (i=0; i<3;i++)
        {
            if(i<howmany)
                this.barShapeArray[i].alpha = 1;
            else
                this.barShapeArray[i].alpha = 0;
        }                  
    };        
    
    cont.GetToppleOpponent = function (color,id)
    {
        return new ToppleOpponent(color, id);
    };
    
    function ToppleOpponent (color, id) 
    {
        this.ID = id;
        this.color = color;  
           
        this.container = new createjs.Container();
        
        this.border = new createjs.Shape();
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,50,200);
        this.border.alpha = 0;

        this.opponent = new createjs.Shape();
        this.opponent.graphics.beginFill(this.color).drawRect(0,0, 50,200);
        this.container.regX = 50;
        this.container.regY = 200;
        this.xOffset = 0;
        this.xVelocity = 0;
        this.angVelocity = 0;
        this.rotation = 0;
        this.container.addChild(this.opponent,this.border);
    };    
    
    ToppleOpponent.prototype.UpdateRotation = function(arg)
    {
        this.container.rotation = arg/3;
    };
    
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
    
    ToppleOpponent.prototype.Raise = function()
    {
        this.Redlight();
    };

    ToppleOpponent.prototype.Lower = function()
    {
        this.Downlight();
    };
    
    ToppleOpponent.prototype.DamageTick = function()
    {
        if (this.xVelocity===14)
        {
            this.opponent.graphics.beginFill(this.color).drawRect(0, 0, 
                            this.opponentWidth,this.opponentHeight);
        }
        if(this.xVelocity>0)
        {
            this.xVelocity-=40*delta/1000;
            this.x+=this.xVelocity;
                if(this.xVelocity<=0)
                {
                    this.xVelocity=0;
                }
        }
        else
        {
            r1 = -4000;
            this.torque = this.g*r1/100;
            this.angVelocity += this.torque*delta/1000;
            this.rotation+=this.angVelocity*delta/1000;
            if(this.rotation<0)
            {
                this.angVelocity = 0;
                this.rotation=0;
                this.toppleState="atRest";
            }
        }
    }
    
   return cont; 
});