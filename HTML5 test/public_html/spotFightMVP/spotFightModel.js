var Model = (function(){
    var mod = {},
    agg,
    opp1,
    opp2;
    function Agitator(x, y, state) 
    {
        this.x = x;
        this.y = y;
        this.state = state;
    };
    
    function Opponent(x, y, rising, HP, ID, state)
    {
        this.x = x;
        this.y = y;
        this.rising = rising;
        this.HP = HP;
        this.ID = ID;
        this.state = state;
    };   
    mod.Init = function()
    {
        //Should read from persistant state
        agg = new Agitator(0, 300, "prefight");    
        opp1 = new Opponent(390, 300, false, 150, 1, "prefight");
        opp2 = new Opponent(700, 300, false, 150, 2, "prefight");
    };
    
    mod.GetAgitator = function()
    {
        return agg;
    };
    
    mod.GetOpponents = function()
    {
        return [opp1, opp2];
    };
    //mod.SaveToPersistantState = function() {}
    
    return mod;        
});