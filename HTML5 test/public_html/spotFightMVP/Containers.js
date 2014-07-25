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
    
    cont.ToppleOpponent = function(color,leverage,resist) 
    {
        cont.ToppleOpponent.prototype.Init(color,leverage,resist);
    };

    cont.ToppleOpponent.prototype = new createjs.Container();
    cont.ToppleOpponent.prototype.InheritedInit = cont.ToppleOpponent.prototype.initialize;
    
    cont.ToppleOpponent.prototype.Init = function(color,id)
    {           
        cont.ToppleOpponent.prototype.InheritedInit();     
        this.ID = id;
        this.color = color; 
        
        this.border = new createjs.Shape();
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,50,200);
        this.border.alpha = 0;

        this.opponent = new createjs.Shape();
        this.opponent.graphics.beginFill(color).drawRect(0, 0, 50,200);
        this.regX = 50;
        this.regY = 200;

        this.xOffset = 0;
        this.xVelocity = 0;
        this.angVelocity = 0;
        this.rotation = 0;
        this.addChild(this.opponent,this.border);
    };    
    
    cont.ToppleOpponent.prototype.UpdateRotation = function(arg)
    {
        this.rotation = arg/3;
    };
    
    cont.ToppleOpponent.prototype.Highlight = function()
    {
        this.border.graphics.beginStroke("#da3f3a");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,this.opponentWidth,this.opponentHeight);
        this.border.alpha=1;
    };
    
    cont.ToppleOpponent.prototype.Redlight = function()
    {
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,this.opponentWidth,this.opponentHeight);
    }

    cont.ToppleOpponent.prototype.Downlight = function()
    {
        this.border.alpha=0;
    };
    
   return cont; 
});