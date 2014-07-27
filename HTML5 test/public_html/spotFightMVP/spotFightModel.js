var Model = (function(){
    var mod = {},
    agg,
    opp1,
    opp2,
    OpponentsArray = [];
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
    mod.Init = function(level)
    {
        //Should read from persistant state
        agg = new Agitator(0, 300, "standing");    
        LoadOpponents(level);
    };
    
    mod.GetAgitator = function()
    {
        return agg;
    };
    
    mod.GetOpponents = function()
    {
        return OpponentsArray;
    };
    //mod.SaveToPersistantState = function() {}
    
    function LoadOpponents(level){
       
        xmlhttp=new XMLHttpRequest();        
    
        xmlhttp.open("GET","Data/InteriorData.xml",false);
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML;
        
        interiors = xmlDoc.documentElement.getElementsByTagName("interior");                       
        for (var j=0; j<interiors.length;j++)
        {
            if(interiors[j].getElementsByTagName('name')[0].childNodes[0].nodeValue === level)        
                interior = interiors[j];
        }

        opponents = interior.getElementsByTagName("opponent");       
        for (var i = 0; i<opponents.length; i++)
        {        
            OpponentsArray.push(
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