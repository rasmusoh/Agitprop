function HeroTopple(color, hp, armor, opponent) 
{
    this.initialize(color,armor, opponent);
}
//inheritance
HeroTopple.prototype = new createjs.Shape();
HeroTopple.prototype.ToppleInit = HeroTopple.prototype.initialize;

//props
HeroTopple.prototype.state = "normal";
HeroTopple.prototype.freeze = 0;

//constructor
HeroTopple.prototype.initialize = function (color, armor, opponent) 
{
    this.opponent = opponent;
    this.color = color;
    this.ToppleInit();
    this.graphics.beginFill(color).drawRect(0, 0, 50, 200);
}

HeroTopple.prototype.tick = function(event)
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

HeroTopple.prototype.gotoAndPlay = function(state)
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

HeroTopple.prototype.inControl = function()
{
    if(this.freeze===0){return true;}
    else{return false;}
}


