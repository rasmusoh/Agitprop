function toppleOpponent(color,width,height) 
{
    this.initialize(color,width,height);
}

toppleOpponent.prototype = new createjs.Container();
toppleOpponent.prototype.OpponentInit = toppleOpponent.prototype.initialize;

toppleOpponent.prototype.state = "prefight";
toppleOpponent.prototype.fightState = "normal";

toppleOpponent.prototype.initialize = function(color,width,height)
{
    this.OpponentInit();
    this.color = color;
    this.HP = 180;
    this.Like = 0.7;
    
    this.opponentHeight =height;
    this.opponentWidth = width;
    
    this.g = 1/20;
    this.toppleState = "atRest";
    
    this.border = new createjs.Shape();
    this.border.graphics.beginStroke("#fef6ad");
    this.border.graphics.setStrokeStyle(3); // 2 pixel
    this.border.graphics.drawRect(0,0 ,width,height);
    this.border.alpha = 0;
    
    this.centre = new createjs.Shape();
    this.centre.graphics.beginFill("#fef6ad").drawCircle(width/2,height/2, 5);
    
    this.opponent = new createjs.Shape();
    this.opponent.graphics.beginFill(color).drawRect(0, 0, width,height);
    this.regX = width;
    this.regY = height;
    
    this.toppling = false;
    this.angVelocity = 0;
    this.rotation = 0;
    this.addChild(this.opponent,this.centre,this.border);
}

toppleOpponent.prototype.tick = function(event)
{
    this.toppleTick(event);
//    if(!this.twist)
//    {
//        this.rotation+=event.delta*45/1000;
//        if(this.rotation>45)
//        {
//            this.twist=true;
//        }
//    }
//    else
//    {
//        this.rotation-=event.delta*45/1000;
//        if(this.rotation<0)
//        {
//            this.twist=false;
//        }
//    }
}
 
toppleOpponent.prototype.raise = function()
{
    this.state = "fight";
    this.downlight();
}

toppleOpponent.prototype.lower = function()
{
    if(this.HP>0){this.state="prefight";}
    else{this.state = "postfight";}
}

toppleOpponent.prototype.highlight = function()
{
    this.border.alpha=1;
}

toppleOpponent.prototype.downlight = function()
{
    this.border.alpha=0;
}

toppleOpponent.prototype.attackCheck = function()
{
    if(this.toppleState === "atRest" || this.toppleState === "balancing")
    {
        this.angVelocity+=6;  
        this.rotation+=5;  
        this.toppleState = "balancing";
    }
}

toppleOpponent.prototype.likeCheck = function()
{
}

toppleOpponent.prototype.toppleTick = function(event)
{
    if(this.toppleState==="balancing" || this.toppleState === "toppling")
    {
        if(this.toppleState==="balancing")
        {
            r1 = -this.opponentWidth/2+this.opponentHeight*Math.tan(this.rotation)/2; 
            if(r1>=0){this.toppling=true;}
        }
        else
        {
            r1 = this.opponentHeight/2-this.opponentWidth/(Math.tan(this.rotation)*2);
        }
        this.torque = this.g*r1;
        this.angVelocity += this.torque*event.delta/200;
        this.rotation+=this.angVelocity;
        if(this.rotation<0)
        {
            this.angVelocity = 0;
            this.rotation=0;
            this.toppleState="atRest";
        }
        else if (this.rotation>90)
        {
            this.angVelocity = 0;
            this.rotation = 90;
            this.toppleState="toppled";
        }
    }
}