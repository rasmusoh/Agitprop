var Containers = (function(){    
    var cont={};
    cont.GetAgitator = function (color, barColor) 
    {
        return new Agitator(color, barColor);
    };    
    //constructor
    function Agitator(agitatorColor, barColor) 
    {
        this.agitatorColor = agitatorColor;
        this.barColor = barColor;
        this.container = new createjs.Container();
        this.agitationContainer = new createjs.Container();
        this.CDContainer = new createjs.Container();
        this.agitatorShape = new createjs.Shape();               
        this.CDBarShape1 = new createjs.Shape();
        this.CDBarShape2 = new createjs.Shape();
        this.CDBarShape3 = new createjs.Shape();
        this.agitationBarShape1 = new createjs.Shape();
        this.agitationBarShape2 = new createjs.Shape();
        this.agitationBarShape3 = new createjs.Shape();
        
        this.agitationBarShape1.graphics.beginFill(agitatorColor).drawRect(0, 0, 10, 10);
        this.agitationBarShape2.graphics.beginFill(agitatorColor).drawRect(20, 0, 10, 10);
        this.agitationBarShape3.graphics.beginFill(agitatorColor).drawRect(40, 0, 10, 10);
        
        this.CDBarShape1.graphics.beginFill(agitatorColor).drawRect(0, 0, 10, 10);
        this.CDBarShape2.graphics.beginFill(agitatorColor).drawRect(20, 0, 10, 10);
        this.CDBarShape3.graphics.beginFill(agitatorColor).drawRect(40, 0, 10, 10);
        
        this.agitatorShape.graphics.beginFill(agitatorColor).drawRect(0, 0, 50, 200);
        
        this.CDBararray = [];
        this.CDBararray[1] = this.CDBarShape1;
        this.CDBararray[2] = this.CDBarShape2;
        this.CDBararray[3] = this.CDBarShape3;
        
        this.agitationBararray = [];
        this.agitationBararray[1] = this.agitationBarShape1;
        this.agitationBararray[2] = this.agitationBarShape2;
        this.agitationBararray[3] = this.agitationBarShape3;
        
        this.CDContainer.addChild(this.CDBarShape1, this.CDBarShape2, this.CDBarShape3);
        this.CDContainer.y = -20;
        this.agitationContainer.addChild(this.agitationBarShape1, this.agitationBarShape2, this.agitationBarShape3);
        this.agitationContainer.y = -40;
                
        this.stutter = new createjs.Text();
        this.stutter.text = "ehm... well... \n\
                            you know.";
        this.stutter.font = "20px Oswald";
        this.stutter.color = "#FF7700";
        this.stutter.x = -30;
        this.stutter.y = -70;
        this.stutter.alpha = 0;
        
        this.agitationText = new createjs.Text();
        this.agitationText.text = "I'MMA FIRIN' MA \n\
                            LAZZZZOR!!!!!";
        this.agitationText.font = "40px Oswald";
        this.agitationText.color = "#FF0000";
        this.agitationText.x = -30;
        this.agitationText.y = -110;
        this.agitationText.alpha = 0;
        
        this.container.addChild(this.agitationContainer, this.CDContainer, 
            this.stutter, this.agitatorShape, this.agitationText);
    };
    
    Agitator.prototype.Agitated = function (isAgitated)
    {
        if(isAgitated)
        {
            this.agitationText.alpha = 1;
        }
        else
        {
            this.agitationText.alpha = 0;
        }
    };
    
    Agitator.prototype.SetCDBars = function (howmany)
    {
        SetBars(howmany, this.CDBararray);
    };
    
    Agitator.prototype.SetAgitationBars = function (howmany)
    {
        SetBars(howmany, this.agitationBararray);
    };
    
    function SetBars(howmany, barArray)
    {       
        if(howmany===0)
        {
            barArray[1].alpha = 0;
            barArray[2].alpha = 0;
            barArray[3].alpha = 0;
            barArray[1].graphics.beginFill(this.barColor).drawRect(0, 0, 10, 10);
            barArray[2].graphics.beginFill(this.barColor).drawRect(20,0, 10, 10);
            barArray[3].graphics.beginFill(this.barColor).drawRect(40,0, 10, 10);
        }
        else if(howmany===1)
        {
            barArray[1].alpha = 1;                        
            barArray[2].alpha = 0;
            barArray[1].graphics.beginFill(this.barColor).drawRect(0, 0, 10, 10);
            barArray[2].graphics.beginFill(this.barColor).drawRect(20,0, 10, 10);
            barArray[3].graphics.beginFill(this.barColor).drawRect(40,0, 10, 10);
        }
        else if(howmany===2)
        {
            barArray[2].alpha = 1;            
            barArray[3].alpha = 0;
            barArray[1].graphics.beginFill(this.barColor).drawRect(0, 0, 10, 10);
            barArray[2].graphics.beginFill(this.barColor).drawRect(20,0, 10, 10);
            barArray[3].graphics.beginFill(this.barColor).drawRect(40,0, 10, 10);
        }
        else if(howmany===3)
        {
            barArray[3].alpha = 1;
            barArray[1].graphics.beginFill("#110000").drawRect(0, 0, 10, 10);
            barArray[2].graphics.beginFill("#110000").drawRect(20,0, 10, 10);
            barArray[3].graphics.beginFill("#110000").drawRect(40,0, 10, 10);
        }
    };        
    
    cont.GetToppleOpponent = function (color,id)
    {
        return new ToppleOpponent(color, id);
    };
    
    function ToppleOpponent (color, id) 
    {
        this.ID = id;
        this.color = color;  
        this.facingLeft = true;
           
        this.container = new createjs.Container();
        
        this.border = new createjs.Shape();
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,50,200);
        this.border.alpha = 0;

        this.opponent = new createjs.Shape();
        this.opponent.graphics.beginFill(this.color).drawRect(0,0, 50,200);
        this.container.regX = 50;
        this.container.regY = 200;
        this.xOffset = 0;
        this.xVelocity = 0;
        this.angVelocity = 0;
        this.rotation = 0;
        this.container.addChild(this.opponent,this.border);
    };    
    
    ToppleOpponent.prototype.UpdateRotation = function(arg)
    {
        
        if(this.facingLeft)
        {
            this.container.rotation = arg/3;            
            this.container.regX = 50;
        }
        else    
        {
            this.container.rotation = -arg/3;                    
            this.container.regX = 0;
        }
    };
    
    
    
    ToppleOpponent.prototype.Highlight = function()
    {
        this.border.graphics.beginStroke("#fef6ad");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0, 50,200);
        this.border.alpha=1;
    };
    
    ToppleOpponent.prototype.Redlight = function()
    {
        this.border.graphics.beginStroke("#da3f3a");
        this.border.graphics.setStrokeStyle(3); // 2 pixel
        this.border.graphics.drawRect(0,0 ,50, 200);
        this.border.alpha=1;
    };

    ToppleOpponent.prototype.Downlight = function()
    {
        this.border.alpha=0;
    };
            
//    ToppleOpponent.prototype.DamageTick = function()
//    {
//        if (this.xVelocity===14)
//        {
//            this.opponent.graphics.beginFill(this.color).drawRect(0, 0, 
//                            this.opponentWidth,this.opponentHeight);
//        }
//        if(this.xVelocity>0)
//        {
//            this.xVelocity-=40*delta/1000;
//            this.x+=this.xVelocity;
//                if(this.xVelocity<=0)
//                {
//                    this.xVelocity=0;
//                }
//        }
//        else
//        {
//            r1 = -4000;
//            this.torque = this.g*r1/100;
//            this.angVelocity += this.torque*delta/1000;
//            this.rotation+=this.angVelocity*delta/1000;
//            if(this.rotation<0)
//            {
//                this.angVelocity = 0;
//                this.rotation=0;
//            }
//        }
//    };
    cont.GetExit = function (destination, x) 
    {
        return new Exit(destination, x);
    };    
    //constructor
    function Exit(destination, x) 
    {
        this.container = new createjs.Container();
        var exitSign = new createjs.Text();
        var exitDoor = new createjs.Shape();
        this.container.x = x;
        this.container.y = 290;
        exitSign.y = -20;
        exitSign.font = "15px Oswald";
        exitSign.color = "#FF7700";
        exitSign.text = "Exit to " + destination;       
        exitDoor.graphics.beginFill("#111111").drawRect(0, 0, 80, 210);
        this.container.addChild(exitSign, exitDoor);
    }
    
   return cont; 
});