var Model = (function(){
    var mod = {},
    agg,    
    exitArray = [],
    opponentArray = [],
    mapInfo = [];
    
    function Exit(x, destination)
    {
        this.x = x;
        this.destination = destination;
    }
    
    function Agitator(x, y, state) 
    {
        this.x = x;
        this.y = y;
        this.state = state;
        this.agitation = 0
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
        var interior=LoadInterior(level);        
        opponentArray = LoadOpponent(interior);
        exitArray = LoadExit(interior);        
        mapInfo = LoadMapInfo(interior);
    };
    
    mod.GetAgitator = function()
    {
        return agg;
    };
    
    mod.GetOpponents = function()
    {
        return opponentArray;
    };
    
    mod.GetExits = function()
    {
        return exitArray;
    };
    
    mod.GetMapInfo = function()
    {
        return mapInfo;
    };
    //mod.SaveToPersistantState = function() {}
    
    function LoadInterior(level){
       
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
        return interior;
    }

    function LoadOpponent(interior)
    {
        opponents = interior.getElementsByTagName("opponent");       
        oA = [];
        for (var i = 0; i<opponents.length; i++)
        {        
            oA.push(
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
        return oA;
    }
    
    function LoadExit(interior)
    {
        exits = interior.getElementsByTagName("exit");
        eA=[];
        for (var i = 0; i<exits.length; i++)
        {
            eA.push(
                    new Exit(
                    exits[i].getElementsByTagName("x")[0].childNodes[0].nodeValue,
                    exits[i].getElementsByTagName("destination")[0].childNodes[0].nodeValue)
                    );
        }
        return eA;
    }
    
    function LoadMapInfo(interior)
    {
        mapInfo=[];
        mapInfo["mapWidth"]= interior.getElementsByTagName("mapWidth")[0].childNodes[0].nodeValue;                
        return mapInfo;
    }
    return mod;        
});