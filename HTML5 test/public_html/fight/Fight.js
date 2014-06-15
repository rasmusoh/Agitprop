 //att göra: 
    //freezzeframes!
    //snygga upp AI-koden, kanske ett markovkedjeobjekt eller så
    //ändra tangentbordslogiken som så att det tittar på förändringar i tangentbordslogik ist för current states
 
var KeyboardCont;
var freezetimer;
var isPaused = false;
var countdown;
var background;
var stage; 
var queue;
var Hero;
var Villain;
var heroPP;
var villainPP;
var heroPower;
var start;
        
//initializes the game and loads components
function init() {
    stage = new createjs.Stage("fightCanvas");
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", handleComplete);
    var manifest = [                
        {id:"bg",src:"../img/bakgrunder/Background1.jpg"},
        {id:"a1tex",src:"../img/A1textures.png"},
        {id:"a2tex",src:"../img/A2textures.png"},
        {id:"sound", src:"../img/VEC2 Bass 007 A.mp3"}];
    queue.loadManifest(manifest);
}
        
//tick function, uppdates game environment
function gameTick(event){
    if(!createjs.Ticker.getPaused()){
        KeyboardCont.tick(event);
        Hero.tick(event);
        Villain.tick(event);
        handleVillainAttacks(event);
        handleHeroAttacks(event);

        if(KeyboardCont.Power >=100){
            heroPower.graphics.clear().beginFill("FF7700").drawRect(5,65,200,50);
        }
        else{
           heroPower.graphics.clear().beginFill("fef6ad").drawRect(5,65,2*KeyboardCont.Power,50); 
        }
        villainPP.graphics.clear().beginFill("d93e39").drawRect(500,5,2*Villain.PP,50);
        heroPP.graphics.clear().beginFill("d93e39").drawRect(5,5,2*Hero.PP,50);


        stage.update(event);
    }
    else if(!isPaused){
        freezetimer-=event.delta;
        if(freezetimer<=0){
            createjs.Ticker.setPaused(false);
            background.alpha = 100;
        }
    }
}
        
function countdownTick(event){
    countdown-=event.delta;
    if (countdown<=0){
        createjs.Ticker.removeEventListener("tick", countdownTick)
        startGame();
    }
    start.text = Math.floor(countdown/1000+1);
    stage.update(event);

}

//called on loadcomplete- sets bg and startbutton, connected to handlestart
function handleComplete(event){
    background = new createjs.Bitmap(queue.getResult("bg"));
    Hero = new Player(queue.getResult("a1tex"));
    Villain = new Opponent("a2tex");

    start = new createjs.Text();
    start.text = "START";
    start.font = "96px Oswald";
    start.color = "#FF7700";
    start.addEventListener("click",handleCountdown);
    start.x = 250;
    start.y = 200;


    heroPower = new createjs.Shape();
    heroPP = new createjs.Shape();
    villainPP = new createjs.Shape();
    Hero.x = 100;
    Hero.y = 200;
    Villain.x = 300; 
    Villain.y = 200;


    stage.addChild(background);  


    stage.addChild(heroPP);
    stage.addChild(villainPP);
    stage.addChild(heroPower);
    stage.addChild(start);
    stage.update();
}

function handleCountdown(event){
    countdown = 3000;
    start.removeEventListener("click",countdown);
    createjs.Ticker.addEventListener("tick", countdownTick);
    start.alpha =100;
    start.x=350;
    villainPP.alpha =100;
    heroPP.alpha =100;
    heroPower.alpha = 100;

    villainPP.graphics.clear().beginFill("d93e39").drawRect(500,5,200,50);
    heroPP.graphics.clear().beginFill("d93e39").drawRect(5,5,200,50);
    heroPower.graphics.clear().beginFill("#FF7700").drawRect(5,65,200,50);
    Hero.reset();
    Villain.reset();
    stage.addChild(Hero);
    stage.addChild(Villain);
}


//starts the game, places the sprites on the canvas and adds nescessary eventListeners
function startGame(){
    //Villain.disable();
    start.alpha=0;
    KeyboardCont = new KeyControl(Hero);
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    createjs.Ticker.addEventListener("tick", gameTick);
}

//translates keyPresses into avatar animation change
function handleKeyDown(e) {
    if (!e) { var e = window.event; }
    if(e.keyCode==KEYCODE_ENTER){
        if(isPaused){
            start.alpha = 0;
            isPaused=false;
            createjs.Ticker.setPaused(false);
        }
        else{
            createjs.Ticker.setPaused(true);
            isPaused=true;
            start.x=225;
            start.alpha=100;
            start.text="PAUSED";
            stage.addChild(start);
            stage.update();
        }
    }
    if (!createjs.Ticker.getPaused()) {
        KeyboardCont.handleKeyDown(e);
    }
}

//translates key releases into avatar animation change
function handleKeyUp(e) {
    //cross browser issues exist
    if (!e) { var e = window.event; }
    if (!createjs.Ticker.getPaused()) {
        KeyboardCont.handleKeyUp(e);
    }
}

//checks for landed player attacks. If player avatar displays a "landed attack" frame 
//while opponent isnt blocking, opponent gets stunned
function handleHeroAttacks(event){

    if(!Villain.stunned && Villain.alive){
        hCurrent = Hero.currentFrame;
        vCurrent = Villain.currentAnimation.slice(0,3);
        if(hCurrent==3 && vCurrent!="dod"){ //aggattack landed
            Villain.gotoAndPlay("stunned");
            Villain.stunned = true;
            Villain.stunTimer=1000;
            Villain.PP -=20;
            freezeframe(70,Villain);
        }
        if(hCurrent==9 && (vCurrent != "low"&& vCurrent!="dod")){ //highattack landed
            Villain.gotoAndPlay("stunned");
            Villain.stunned = true;
            Villain.stunTimer=300;
            Villain.PP -=10;
            freezeframe(50,Villain);
        } 
        if(hCurrent==14 && (vCurrent != "high"&& vCurrent!="dod")){ //lowattack landed
            Villain.gotoAndPlay("stunned");
            Villain.stunned = true;
            Villain.stunTimer=500;
            Villain.PP -=10;
            freezeframe(50,Villain);
        }
        if (Villain.PP<=0){
                handleDeath("Red Guy");
        }
    }
}

function freezeframe(time, guy){
    freezetimer = time;
    if (time>50){background.alpha = 0;}
    createjs.Ticker.setPaused(true);
}

//checks for landed opponent attacks. If opponent displays a "landed attack" frame 
//while player avatar isnt blocking, player gets stunned
function handleVillainAttacks(event){

    if(!Hero.stunned && Hero.alive){
        hCurrent = Villain.currentFrame;
        vCurrent = Hero.currentAnimation.slice(0,3);
        if(hCurrent==3 && vCurrent!="dod"){ //aggattack landed
            Hero.gotoAndPlay("stunned");
            Hero.stunned = true;
            Hero.stunTimer=1000;
            Hero.PP -=20;
            freezeframe(70,Hero);
        }
        if(hCurrent==7 && (vCurrent != "low" && vCurrent != "dod") ){ //highattack landed
            Hero.gotoAndPlay("stunned");
            Hero.stunned = true;
            Hero.stunTimer=300;
            Hero.PP -=10;
            freezeframe(30,Hero);
        } 
        if(hCurrent==12 && (vCurrent!="hig" && vCurrent!="dod")){ //normattack landed
            Hero.gotoAndPlay("stunned");
            Hero.stunned = true;
            Hero.stunTimer=500;
            Hero.PP -=10;
            freezeframe(40,Hero);
        }
        if (Hero.PP<=0){
                handleDeath("Blue Guy");
        }
    }
}

function handleDeath(winner){
    Hero.alive=false;
    Villain.alive=false;
    start.x=200;
    start.text = "RESTART?"; 
    start.alpha = 100;
    background.alpha=100;
    start.addEventListener("click",handleCountdown);
    stage.addChild(start);
    createjs.Ticker.removeEventListener("tick", gameTick);
}