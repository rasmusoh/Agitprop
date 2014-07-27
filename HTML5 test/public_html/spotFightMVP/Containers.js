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
        this.opponent.graphics.beginFill(this.color).drawRect(0, 0, 50,200);
        this.regX = 50;
        this.regY = 200;

        this.xOffset = 0;
        this.xVelocity = 0;
        this.angVelocity = 0;
        this.rotation = 0;
        this.container.addChild(this.opponent,this.border);
    };    
    
    ToppleOpponent.prototype.UpdateRotation = function(arg)
    {
        this.rotation = arg/3;
    };
    
    ToppleOpponent.prototype.Highlight = function()
    {        
        this.border.alpha=1;
    };
    
    ToppleOpponent.prototype.Redlight = function()
    {
        console.log('Redlight not implemented');
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
    
   return cont; 
});