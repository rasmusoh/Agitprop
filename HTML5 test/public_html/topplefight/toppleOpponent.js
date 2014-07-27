function toppleOpponent(color,leverage,resist) 
{
    this.initialize(color,leverage,resist);
}

toppleOpponent.prototype = new createjs.Container();
toppleOpponent.prototype.OpponentInit = toppleOpponent.prototype.initialize;

toppleOpponent.prototype.state = "prefight";
toppleOpponent.prototype.fightState = "normal";

toppleOpponent.prototype.initialize = function(color,leverage,resist)
{
    this.HP=1;
    this.OpponentInit();
    this.color = color;
    
    
    this.opponentHeight =200;
    this.opponentWidth = 50;
    
    this.leverage = leverage;
    this.g = resist;
    this.delta = 0;
    fps = 30;
    this.stepSize = 1000/fps;
    this.toppleState = "atRest";
    
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
}

toppleOpponent.prototype.statusDump = function()
{
    dump = "angVelocity: "+this.angVelocity+"\ntorque: "+this.angVelocity+
           "\ntoppleState: "+this.toppleState+"\nxVelocity: "+this.xVelocity+
           "\nleverage: "+this.leverage;
    return dump;
}

toppleOpponent.prototype.tick = function(event)
{
    this.delta+=event.delta;
    if(this.stepSize<this.delta)
    {
        this.toppleTick(this.delta); //toppling physics
        this.centre.y=this.opponentHeight-this.leverage;
        this.delta = 0;
    }
}
 
toppleOpponent.prototype.raise = function()
{
    this.state = "fight";
    
    this.centre.alpha=1;
    this.redlight();
}

toppleOpponent.prototype.lower = function()
{
    if(this.HP>0){this.state="prefight";}
    else{this.state = "postfight";}
    this.downlight();
    
    this.centre.alpha=0;
}

toppleOpponent.prototype.highlight = function()
{
    this.border.graphics.beginStroke("#da3f3a");
    this.border.graphics.setStrokeStyle(3); // 2 pixel
    this.border.graphics.drawRect(0,0 ,this.opponentWidth,this.opponentHeight);
    this.border.alpha=1;
}

toppleOpponent.prototype.redlight = function()
{
    this.border.graphics.beginStroke("#fef6ad");
    this.border.graphics.setStrokeStyle(3); // 2 pixel
    this.border.graphics.drawRect(0,0 ,this.opponentWidth,this.opponentHeight);
}

toppleOpponent.prototype.downlight = function()
{
    this.border.alpha=0;
}

toppleOpponent.prototype.attackCheck = function()
{
    if(this.toppleState === "atRest" || this.toppleState === "balancing"
            || this.toppleState === "pulled")
    {
        this.angVelocity+=this.leverage/3; 
        if(this.toppleState==="atRest")
        {
            this.toppleState = "balancing";
            if(this.regX===0)
            {
                this.regX = this.opponentWidth;
                this.x+= this.opponentWidth;
            }
        }
    }
}

toppleOpponent.prototype.likeCheck = function()
{
    if(this.leverage<=this.opponentHeight-30)
    {
        //this.leverage+=20;
    }
}

toppleOpponent.prototype.pullCheck = function()
{
    if(this.toppleState === "atRest" || this.toppleState === "balancing"
            || this.toppleState === "pulled")
    {
        this.angVelocity=-40; 
        this.toppleState = "pulled";
        if(this.regX===this.opponentWidth)
        {
            this.regX= 0;
            this.x-= this.opponentWidth;
        }
    }
}

toppleOpponent.prototype.toppleTick = function(delta)
{
    if(this.toppleState==="balancing")
    {
        //rad = this.rotation*2*Math.PI/360;
        //r1 = -this.opponentWidth*Math.cos(rad)/2+this.opponentHeight*Math.sin(rad)/2;
        r1 = -1000;
        
        this.torque = this.g*r1/100;
        this.angVelocity += this.torque*delta/1000;
        this.rotation+=this.angVelocity*delta/1000;
        if(this.rotation<0)
        {
            this.leverage=Math.max(0,this.leverage+this.angVelocity/5)
            this.angVelocity = 0;
            this.rotation=0;
            this.toppleState="atRest";
        }
        else if (this.rotation>25 )
        {
            this.angVelocity = 0;
            this.rotation = 35;
            this.toppleState="toppled";
            this.opponent.graphics.beginFill("white").drawRect(0, 0, 
                    this.opponentWidth,this.opponentHeight);
            this.xVelocity = 14;
        }
    }
    else if(this.toppleState==="pulled")
    {
        //rad = this.rotation*2*Math.PI/360;
        //r1 = -this.opponentWidth*Math.cos(rad)/2+this.opponentHeight*Math.sin(rad)/2;
        r1 = 1000;
        this.torque = this.g*r1/100;
        this.angVelocity += this.torque*delta/1000;
        this.rotation+=this.angVelocity*delta/1000;
        if(this.rotation>0)
        {
            if(this.angVelocity<50)
            {
                this.angVelocity = 0;
                this.rotation=0;
                this.toppleState="atRest";
            }
            else
            {
                this.toppleState="balancing";
                this.regX = this.opponentWidth;
                this.x+= this.opponentWidth;
            }
        }
    }

}
