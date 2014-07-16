function spotOpponent(color,spot,fightShade) 
{
    this.initialize(color,spot,fightShade);
}

spotOpponent.prototype = new createjs.Container();
spotOpponent.prototype.OpponentInit = spotOpponent.prototype.initialize;

spotOpponent.prototype.state = "prefight";

spotOpponent.prototype.initialize = function(color,spot,fightShade)
{
    this.OpponentInit();
    this.color = color;
    this.HP = 180;
    this.freeze = 0;
    this.xVelocity = 0;
    this.xOffset = 0;
    this.fightState = 0;
    
    this.spot  =spot;
    this.fightShade = fightShade;
    
    this.border = new createjs.Shape();
    this.border.graphics.beginStroke("#fef6ad");
    this.border.graphics.setStrokeStyle(3); // 2 pixel
    this.border.graphics.drawRect(50,0, 50, 200);
    this.border.alpha = 0;
    
    this.opponent = new createjs.Shape();
    this.opponent.graphics.beginFill(color).drawRect(50, 0, 50, 200);
    
    this.stage = new createjs.Shape();
    this.stage.graphics.beginFill("black").drawRect(0, 200, 150, 400);
    
    this.addChild(this.opponent,this.border,this.stage);

}

spotOpponent.prototype.tick = function(event)
{
    if(this.state==="fight" && this.y>300-this.HP)
    {
        this.y-=event.delta;
        if(this.y<300-this.HP){this.y=300-this.HP;}
    }
    
    if(this.state!="fight" && this.y<300)
    {
        this.y+=event.delta;
        if(this.y>300){this.y=300;}
    }
    if(this.state==="fight" && this.y<300-this.HP)
    {
        this.y+=event.delta/10;
        if(this.y>300-this.HP){this.y=300-this.HP;}
    }
    
    if(this.fightState==="bigbumped")
    {
        this.bigBumpTick(event);
    }
}
 
spotOpponent.prototype.raise = function()
{
    this.state = "fight";
    this.downlight();
    this.spot.alpha = 0.7;
    this.fightShade.alpha = 0.3;
}

spotOpponent.prototype.lower = function()
{
    if(this.HP>0){this.state="prefight";}
    else{this.state = "postfight";}
    this.spot.alpha = 0;
    this.fightShade.alpha = 0;
}

spotOpponent.prototype.highlight = function()
{
    this.border.alpha=1;
}

spotOpponent.prototype.downlight = function()
{
    this.border.alpha=0;
}

spotOpponent.prototype.attackCheck = function()
{
    this.HP-=20;
    this.bump();
    if(this.HP<0)
    {
        this.lower();
    }
}

spotOpponent.prototype.bump = function()
{
        this.opponent.graphics.beginFill("#FFFFFF").drawRect(50, 0, 50, 200);
        this.opponent.cache(50,0,50,200);
        this.xVelocity = 1/10;
        this.fightState="bigbumped";
}

spotOpponent.prototype.bigBumpTick = function(event)
{
    if(this.freeze===0)
    {
        this.xOffset+=this.xVelocity*event.delta;
        this.opponent.x+=this.xVelocity*event.delta;
        this.xVelocity-=event.delta/1300;
        if(this.xVelocity>0 && this.xVelocity-event.delta/1300<0)
        {
            this.freeze=100;
            this.opponent.graphics.beginFill(this.color).drawRect(25, 0, 50, 200);
            this.opponent.cache(25,0,50,200);
        }
        if(this.xOffset<0)
        {
            this.opponent.x-=this.xOffset;
            this.xOffset = 0;
            this.xVelocity = 0
            this.fightState="normal";
        }
    }
    else
    {
        this.freeze=Math.max(this.freeze-event.delta,0);
    }
    this.x += this.xVelocity*event.delta;
}