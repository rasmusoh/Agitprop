var city =(function(){
   var ci={},
   Stage,
   city,
   background,    
   queue;
   
   ci.cityEnum = Object.freeze({"Voksoburg":1, "Discvojotsk":2});

   ci.init = function (cityName) 
   {
       city = cityName;        
       //canvas = document.getElementById('agitpropCanvas');
       Stage = new createjs.Stage("agitpropCanvas");
       Stage.enableMouseOver(20);
       Stage.mouseEventsEnabled = true;
       queue = new createjs.LoadQueue(false);
       queue.installPlugin(createjs.Sound);
       queue.addEventListener("complete", handleComplete);
       if(cityName===this.cityEnum.Voksoburg)
       {
           var manifest = [                
               {id:"bg",src:"content/img/environments/Ivan_Fomin_NKTP_Contest_Entry.jpg"}];
       }
       else if(cityName===this.cityEnum.Discvojotsk)
       {
           var manifest = [                
               {id:"bg",src:"content/img/environments/moscow-palace-of-soviets-5.jpg"}];
       }        
       queue.loadManifest(manifest);                
   };

   function handleComplete (event)
   {   
       drawShapes();        
   };

   function drawShapes()
   {                
       background = new createjs.Bitmap(queue.getResult("bg"));        
       var fightPosX, fightPosY, travelPosX, travelPosY, cityToTravelTo;
       if(city===1)
       {
           fightPosX=630;
           fightPosY=520;
           travelPosX=100;
           travelPosY=470;
           cityToTravelTo = 2;
       }
       else if(city===2)
       {
           fightPosX=50;
           fightPosY=520;
           travelPosX=520;
           travelPosY=500;
           cityToTravelTo = 1;
       }
       fightText = new createjs.Text("Fight!", 
           "20px Arial", "#ffffff"); 
       fightText.x = fightPosX; 
       fightText.y = fightPosY-20;
       fightText.textBaseline = "alphabetic";    
       fightText.alpha = 0;

       travelText = new createjs.Text("Travel to Discvojotsk", 
           "20px Arial", "#ffffff"); 
       travelText.x = travelPosX; 
       travelText.y = travelPosY-20;
       travelText.textBaseline = "alphabetic";    
       travelText.alpha = 0;

       fightShape = new createjs.Shape();
       fightShape.graphics.beginFill("#ff0000").drawCircle(fightPosX, fightPosY, 25);
       fightShape.alpha = 0.3;        
       fightShape.addEventListener('mouseover', function(){
           fightShape.alpha = 0.6;
           fightText.alpha = 1;            
           Stage.update();
       });
       fightShape.addEventListener('mouseout', function(){
           fightShape.alpha = 0.3;
           fightText.alpha = 0;
           Stage.update();
       });
       fightShape.addEventListener('click', function(){
           destroy();
       });

       travelShape = new createjs.Shape();
       travelShape.graphics.beginFill("#ff0000").drawCircle(travelPosX, travelPosY, 25);
       travelShape.alpha = 0.3;        
       travelShape.addEventListener('mouseover', function(){
           travelShape.alpha = 0.6;
           travelText.alpha = 1;            
           Stage.update();
       });
       travelShape.addEventListener('mouseout', function(){
           travelShape.alpha = 0.3;
           travelText.alpha = 0;
           Stage.update();
       });

       travelShape.addEventListener('click', function(){
           alert('no hable');            
       });
       Stage.addChild(background, fightShape, fightText, travelShape, travelText);        
       Stage.addChild(travelText);
       Stage.update();  
   }

   function destroy (){
       Stage.autoClear=true;
       //cityStage.enableEventsfalse;
       Stage.enableDOMEvents(false);
       Stage.removeAllChildren();
       Stage.update();
       interiorInit();
   };
   return ci;
}());