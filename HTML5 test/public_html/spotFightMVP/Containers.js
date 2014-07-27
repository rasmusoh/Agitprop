var Containers = (function(){    
    var cont={};
    cont.Agitator = function (color) 
    {
        cont.Agitator.prototype.Init(color);
    };
    //inheritance
    cont.Agitator.prototype = new createjs.Shape();
    cont.Agitator.prototype.InheritedInit = cont.Agitator.prototype.initialize;

    //constructor
    cont.Agitator.prototype.Init = function (color) 
    {
        cont.Agitator.prototype.InheritedInit();
        this.color = color;        
        this.graphics.beginFill(color).drawRect(0, 0, 50, 200);
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