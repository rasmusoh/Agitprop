function Spot() 
{
    this.initialize();
}
//inheritance
Spot.prototype = new createjs.Shape();
Spot.prototype.SpotInit = Spot.prototype.initialize;

//props
Spot.prototype.spotLevel = 100;

//constructor
Spot.prototype.initialize = function() 
{
    this.SpotInit();
    this.graphics.beginFill("#FF0").drawPolyStar(0,0,200,3,0,0);
    this.scaleY = 4;
    this.rotation = 20;
}

Spot.prototype.setLevel = function(level)
{
    this.spotLevel = level;
    this.alpha=level/100;
}
