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
        this.fightState = "N/a";        
        this.agitation = 0;
    };
    
    function Opponent(x, y, leverage, resistance, ID, state)
    {
        this.x = x;
        this.y = y;
        this.leverage = leverage;
        this.resistance = resistance;
        this.ID = ID;
        this.state = "standing";
        this.fightState = state;
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
            if(interiors[j].getElementsByTagName('name')[0].
                    childNodes[0].nodeValue === level)        
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
                opponents[i].getElementsByTagName("x")[0].
                childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("y")[0].
                        childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("leverage")[0].
                        childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("resistance")[0].
                        childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("id")[0].
                        childNodes[0].nodeValue,
                opponents[i].getElementsByTagName("state")[0].
                        childNodes[0].nodeValue
                )
            );        
        }    
        return oA;
    }
    
    function LoadExit(interior)
    {
        geometry = interior.getElementsByTagName("geometry")[0];
        exits = geometry.getElementsByTagName("exit");
        eA=[];
        for (var i = 0; i<exits.length; i++)
        {
            eA.push(
                    new Exit(
                    exits[i].getElementsByTagName("x")[0].childNodes[0].
                    nodeValue,
                    exits[i].getElementsByTagName("destination")[0].
                            childNodes[0].nodeValue)
                    );
        }
        return eA;
    }
    
    function LoadMapInfo(interior)
    {
        var mapInfo=[];
        geometry = interior.getElementsByTagName("geometry")[0];
        mapInfo["mapWidth"]= geometry.getElementsByTagName("mapWidth")[0].
                childNodes[0].nodeValue;
        mapInfo["tracks"] = [];               
        mapInfo["barriers"] = [];                
        
        var tracks = geometry.getElementsByTagName("tracks")[0].
                getElementsByTagName("track");        
        var barriers = geometry.getElementsByTagName("barriers")[0].
                getElementsByTagName("barrier");
        
        for (var i = 0; i<tracks.length; i++)
        {            
            var ID = tracks[i].getElementsByTagName("ID")[0].childNodes[0].
                    nodeValue;                        
            var points = tracks[i].getElementsByTagName("points")[0].
                    getElementsByTagName("point");
            mapInfo["tracks"][ID] = [];            
            mapInfo["tracks"][ID]["EntryType"] = tracks[i].
                    getElementsByTagName("EntryType")[0].childNodes[0].
                    nodeValue;
            mapInfo["tracks"][ID]["ExitType"] = tracks[i].
                    getElementsByTagName("ExitType")[0].childNodes[0].
                    nodeValue;
            mapInfo["tracks"][ID]["points"] = [];            
            for (var j = 0; j<points.length; j++)
            {
                mapInfo["tracks"][ID]["points"][j] =[];
                mapInfo["tracks"][ID]["points"][j]["x"]= points[j].
                        getElementsByTagName("x")[0].childNodes[0].nodeValue;
                mapInfo["tracks"][ID]["points"][j]["y"]= points[j].
                        getElementsByTagName("y")[0].childNodes[0].nodeValue;
            }            
        }
        
        for (var i = 0; i<barriers.length; i++)
        {                        
            var points = tracks[i].getElementsByTagName("points")[0].
                    getElementsByTagName("point");
            mapInfo["barriers"][i] = [];                        
            mapInfo["barriers"][i]["points"] = [];
            for (var j = 0; j<points.length; j++)
            {
                mapInfo["barriers"][i]["points"][j] =[];
                mapInfo["barriers"][i]["points"][j]["x"]= points[j].
                        getElementsByTagName("x")[0].childNodes[0].nodeValue;
                mapInfo["barriers"][i]["points"][j]["y"]= points[j].
                        getElementsByTagName("y")[0].childNodes[0].nodeValue;
            }            
        }
        
        return mapInfo;
    }
    return mod;        
});