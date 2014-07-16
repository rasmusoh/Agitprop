function HeroSkeleton(color, hp, armor, opponent, opponentSquare) 
{
    this.initialize(color,armor, opponent, opponentSquare);
}
//inheritance
HeroSkeleton.prototype = new createjs.Shape();
HeroSkeleton.prototype.SkeletonInit = HeroSkeleton.prototype.initialize;

//props
HeroSkeleton.prototype.bounce = 5;
HeroSkeleton.prototype.state = "normal";
HeroSkeleton.prototype.xVelocity = 0;
HeroSkeleton.prototype.yVelocity = 0;
HeroSkeleton.prototype.xOffset = 0;
HeroSkeleton.prototype.yOffset = 0;
HeroSkeleton.prototype.freeze = 0;

//constructor
HeroSkeleton.prototype.initialize = function (color, armor, opponent, opponentSquare) 
{
    this.opponentSquare = opponentSquare;
    this.opponent = opponent;
    if(armor===0){this.state = "normal";}
    else{this.state ="guardup";}
    this.Armor = armor;
    this.HP = 5;
    this.color = color;
    this.isBumped=false;
    this.SkeletonInit();
    this.graphics.beginFill(color).drawRect(0, 0, 50, 200);
}

HeroSkeleton.prototype.tick = function(event)
{
    if(this.isBumped){this.bumpTick(event);}
    if(this.state==="finished"){this.x+=this.xVelocity*event.delta;}
}

HeroSkeleton.prototype.bump = function()
{
    this.xVelocity = 1/10;
    this.isBumped = true;
}

HeroSkeleton.prototype.bumpTick = function(event)
{
    this.x += this.xVelocity*event.delta;
    this.xOffset+=this.xVelocity*event.delta;
        this.xVelocity-=event.delta/300;
        if(this.xOffset<0)
        {
            this.x-=this.xOffset;
            this.xOffset = 0;
            this.xVelocity = 0
            this.isBumped=false;
        }
}

HeroSkeleton.prototype.lift= function()
{
    if(this.state ==="normal" || this.state ==="guardup" )
    {
        this.Armor = Math.max(0,this.Armor-1);
        this.yVelocity = -1/4;
        this.opponent.x+=this.bounce;
        this.state="lifted"; 
        
        this.filters = [
        new createjs.ColorFilter(1.2,1,1,1,0,0,0,0)
        ];
        this.cache(0,0,50,200);
    }
}

HeroSkeleton.prototype.liftTick = function(event)
{
    if(this.freeze===0)
    {
        this.y+=this.yVelocity*event.delta;
        this.yOffset+=this.yVelocity*event.delta;
        if(this.yVelocity<0 && this.yVelocity+event.delta/300>0){
            this.freeze=350;
        }
        this.yVelocity+=event.delta/300;
        if(this.yOffset>0)
        {
            this.y-=this.yOffset;
            this.yOffset = 0;
            this.yVelocity = 0
            
            this.filters = [];
            this.cache(0,0,50,200);
            this.opponent.x-=this.bounce;
            if(this.Armor===0){this.state="normal";}
            else{this.state="guardup";}
        }
    }
    else
    {
        this.freeze=Math.max(this.freeze-event.delta,0);
    }
}

HeroSkeleton.prototype.bigBumpTick = function(event)
{
    if(this.freeze===0)
    {
        this.xOffset+=this.xVelocity*event.delta;
        this.xVelocity-=event.delta/1300;
        if(this.xVelocity>0 && this.xVelocity-event.delta/1300<0)
        {
            this.freeze=100;
            this.graphics.beginFill(this.color).drawRect(0, 0, 50, 200);
            this.cache(0,0,50,200);
        }
        if(this.xOffset<0)
        {
            this.x-=this.xOffset;
            this.xOffset = 0;
            this.xVelocity = 0
            if(this.HP<=0){this.Finished();}
            else{this.state="normal";}
            this.opponent.x-=this.bounce;
        }
    }
    else
    {
        this.freeze=Math.max(this.freeze-event.delta,0);
    }
    this.x += this.xVelocity*event.delta;
}

HeroSkeleton.prototype.Finished = function()
{
    this.state = "finished";
    this.xVelocity = 1/15;
    this.filters = [
        new createjs.ColorFilter(1.2,1.2,1.2,1,0,0,0,0)
    ];
    this.cache(0,0,50,200);
}

HeroSkeleton.prototype.gotoAndPlay = function(state)
{
    if (state==="highstance")
    {
        this.graphics.beginFill(this.color).drawRect(0, 0, 50, 200);
        this.state = state;
    }
    if (state==="normstance" || state==="lowstance")
    {
        this.graphics.beginFill("#333367").drawRect(0, 0, 50, 200);
        this.state = state;
    }
    if(state==="lowattack" || state==="highattack" || state==="aggattack")
    {
        if(this.opponent.x-this.x<150)
        {
            this.opponentSquare.attackCheck(state);
        }
    }
    
}

HeroSkeleton.prototype.inControl = function()
{
    return true;
}


