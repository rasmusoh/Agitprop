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
    
    this.g = 9.82;
    this.delta = 0;
    fps = 30;
    this.stepSize = 1000/fps;
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
    
    this.xOffset = 0;
    this.xVelocity = 0;
    this.angVelocity = 0;
    this.rotation = 0;
    this.addChild(this.opponent,this.centre,this.border);
}

toppleOpponent.prototype.statusDump = function()
{
    dump = "angVelocity: "+this.angVelocity+"\ntorque: "+this.angVelocity+
           "\ntoppleState: "+this.toppleState+"\nxVelocity: "+this.xVelocity;
    return dump;
}

toppleOpponent.prototype.tick = function(event)
{
    this.delta+=event.delta;
    if(this.stepSize<this.delta)
    {
        this.toppleTick(this.delta); //toppling physics
        this.delta = 0;
    }
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
    if(this.toppleState === "atRest" || this.toppleState === "balancing"
            || this.toppleState === "pulled")
    {
        this.angVelocity+=40; 
        this.toppleState = "balancing";
        if(this.regX===0)
        {
            this.regX = this.opponentWidth;
            this.x+= this.opponentWidth;
        }
    }
}

toppleOpponent.prototype.likeCheck = function()
{
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
            this.angVelocity = 0;
            this.rotation=0;
            this.toppleState="atRest";
        }
        else if (this.rotation>35)
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
    else if(this.toppleState==="toppled")
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
}
