function Skeleton(color, hp, armor, opponent) 
{
    this.initialize(color,hp,armor, opponent);
}
//inheritance
Skeleton.prototype = new createjs.Shape();
Skeleton.prototype.SkeletonInit = Skeleton.prototype.initialize;

//props
Skeleton.prototype.bounce = 5;
Skeleton.prototype.state = "normal";
Skeleton.prototype.xVelocity = 0;
Skeleton.prototype.yVelocity = 0;
Skeleton.prototype.xOffset = 0;
Skeleton.prototype.yOffset = 0;
Skeleton.prototype.freeze = 0;

//constructor
Skeleton.prototype.initialize = function (color, hp, armor, opponent) 
{
    this.opponent = opponent;
    if(armor===0){this.state = "normal";}
    else{this.state ="guardup";}
    this.Armor = armor;
    this.HP = hp;
    this.color = color;
    this.SkeletonInit();
    this.graphics.beginFill(color).drawRect(0, 0, 50, 200);
}

Skeleton.prototype.tick = function(event)
{
    switch(this.state)
    {
        case "bumped":
            this.bumpTick(event);
            break;
        case "bigbumped":
            this.bigBumpTick(event);
            break;
        case "lifted":
            this.liftTick(event);
            break;
    }
    if(this.state==="finished"){this.x+=this.xVelocity*event.delta;}
}

Skeleton.prototype

Skeleton.prototype.bump = function()
{
    if(this.state==="guardup")
    {
        //this.graphics.beginFill("#fef6ad").drawRect(0, 0, 50, 200);
        this.xVelocity = 1/10;
        this.state="bumped"; 
        this.opponent.x-=this.bounce;
    }
    else if(this.state==="normal")
    {
        this.graphics.beginFill("#FFFFFF").drawRect(0, 0, 50, 200);
        this.cache(0,0,50,200);
        this.xVelocity = 1/10;
        this.HP-=1;
        this.state="bigbumped";
        this.opponent.x+=this.bounce;
    }
}

Skeleton.prototype.bumpTick = function(event)
{
    this.x += this.xVelocity*event.delta;
    this.xOffset+=this.xVelocity*event.delta;
        this.xVelocity-=event.delta/300;
        if(this.xOffset<0)
        {
            //this.graphics.beginFill(this.color).drawRect(0, 0, 50, 200);
            this.x-=this.xOffset;
            this.xOffset = 0;
            this.xVelocity = 0
            this.opponent.x+=this.bounce;
            this.state="guardup";
        }
}

Skeleton.prototype.lift= function()
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

Skeleton.prototype.liftTick = function(event)
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

Skeleton.prototype.bigBumpTick = function(event)
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

Skeleton.prototype.Finished = function()
{
    this.state = "finished";
    this.xVelocity = 1/15;
    this.filters = [
        new createjs.ColorFilter(1.2,1.2,1.2,1,0,0,0,0)
    ];
    this.cache(0,0,50,200);
}


