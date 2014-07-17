function HeroSkeleton(color, hp, armor, opponent) 
{
    this.initialize(color,armor, opponent);
}
//inheritance
HeroSkeleton.prototype = new createjs.Shape();
HeroSkeleton.prototype.SkeletonInit = HeroSkeleton.prototype.initialize;

//props
HeroSkeleton.prototype.state = "normal";
HeroSkeleton.prototype.freeze = 0;

//constructor
HeroSkeleton.prototype.initialize = function (color, armor, opponent) 
{
    this.opponent = opponent;
    this.color = color;
    this.SkeletonInit();
    this.graphics.beginFill(color).drawRect(0, 0, 50, 200);
}

HeroSkeleton.prototype.tick = function(event)
{
    if (this.freeze>0)
    {
        this.freeze-=event.delta;
        if(this.freeze<=0)
        {
            this.freeze = 0;
            state = "normalstance";
        }
    }
}

HeroSkeleton.prototype.gotoAndPlay = function(state)
{

    if (state==="aggattack" || state==="lowatttack" || state==="highattack")
    {
        if(this.inControl() && this.opponent.state==="fight" && 
                    this.opponent.fightState=="normal")
        {
            if(state==="highattack")
            {
                this.opponent.likeCheck(); 
            }
            else
            {
                this.opponent.attackCheck(); 
                this.freeze = 100;
            }
        }

    }
    else
    {
        this.state = state;
    }
}

HeroSkeleton.prototype.inControl = function()
{
    if(this.freeze===0){return true;}
    else{return false;}
}


