var Model = (function(){
    var mod = {},
    agg,
    opp1,
    opp2,
    opponentsArray = [];
    function Agitator(x, y, state) 
    {
        this.x = x;
        this.y = y;
        this.state = state;
    };
    
    function Opponent(x, y, leverage, resistance, 
        ID, state)
    {
        this.x = x;
        this.y = y;
        this.leverage = leverage;
        this.resistance = resistance;
        this.ID = ID;
        this.state = state;
        this.trueRotation = 0;
        this.angVelocity = 0;
        this.toppleState = "atRest";        
    };       
    
    mod.Init = function()
    {
        //Should read from persistant state
        agg = new Agitator(0, 300, "prefight");    
        LoadOpponents();
    };
    
    mod.GetAgitator = function()
    {
        return agg;
    };
    
    mod.GetOpponents = function()
    {
        return opponentsArray;
    };
    //mod.SaveToPersistantState = function() {}
    
    function LoadOpponents(){
        xmlhttp=new XMLHttpRequest();        
    
        xmlhttp.open("GET","Data/InteriorData.xml",false);
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML;

        opponents = xmlDoc.documentElement.getElementsByTagName("opponent");       
        for (var i = 0; i<opponents.length; i++)
        {        
            opponentsArray.push(
                new Opponent(
                opponents[i].getElementsByTagName("x")[0].childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("y")[0].childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("leverage")[0].childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("resistance")[0].childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("id")[0].childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("state")[0].childNodes[0].nodeValue
                )
            );        
        }                
    }
    return mod;        
});