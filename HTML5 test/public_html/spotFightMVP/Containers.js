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
    
    cont.ToppleOpponent.prototype.Init = function(color,leverage,resist)
    {        
        cont.ToppleOpponent.prototype.InheritedInit();     

        this.border = new createjs.Shape();
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,50,200);
        this.border.alpha = 0;

        this.centre = new createjs.Shape();
        this.centre.graphics.beginFill("#fef6ad").drawCircle(0,0, 5);
        this.centre.x = 50/2
        this.centre.y = 200/2;
        this.centre.alpha=0;

        this.opponent = new createjs.Shape();
        this.opponent.graphics.beginFill(color).drawRect(0, 0, 50,200);
        this.regX = 50;
        this.regY = 200;

        this.xOffset = 0;
        this.xVelocity = 0;
        this.angVelocity = 0;
        this.rotation = 0;
        this.addChild(this.opponent,this.centre,this.border);
    };    
    
    cont.ToppleOpponent.prototype.UpdateRotation = function(arg)
    {
        
    };
    
    cont.ToppleOpponent.prototype.Highlight = function()
    {
        this.border.alpha=1;
    };

    cont.ToppleOpponent.prototype.Downlight = function()
    {
        this.border.alpha=0;
    };
    
   return cont; 
});