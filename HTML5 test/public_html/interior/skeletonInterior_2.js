var skeletonInterior2 = (function(){
    var inter = {},
    avatar, 
    foreground,
    keycontrol,
    stage,
    background,
    person1,
    enemies,
    attackSquare;

    inter.init = function () 
    {
        stage = new createjs.Stage("agitpropCanvas");
        handleComplete();
        
    }

    function handleComplete()
    {

        drawShapes();      
        createjs.Ticker.addEventListener("tick",tick);
    }

    function drawShapes()
    {           
        dialogue = new Dialogue(100,100,"50px Oswald");
        
        background = new createjs.Shape();
        background.graphics.beginFill("#dbeba4").drawRect(0, 0, 800, 600);
        
        foreground = new createjs.Shape();
        foreground.graphics.beginFill("#27231a").drawRect(0, 500, 2000, 200);
        
        attackSquare = new AttackSquare();
        attackSquare.x=620;
        attackSquare.y=260;
        attackSquare.alpha=0;
        
        person1 = new Skeleton("#a05f75",0,avatar, attackSquare);
        person1.x = 600;
        person1.y = 300;
        
        avatar = new HeroSkeleton("#da3f3a",5,2,person1);
        avatar.x = 0;
        avatar.y = 300;
        
        attackSquare.setMasterOpponent(person1,avatar);
        
        keycontrol = new skeletonKeyControl(avatar);
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        
        enemies = [person1];
        stage.addChild(background,  avatar, person1, attackSquare, foreground);  
        stage.update();
    };
    
    function tick(event)
    {
        keycontrol.tick();
        for (i=0;i<enemies.length; i++)
        {
            enemies[i].tick(event);
        }
        attackSquare.attackUpdate(event);
        avatar.tick(event);
        
        if(avatar.state==="walkright"){  
            if(avatar.x>100 && background.x>0){
                person1.x-=event.delta/8;
                attackSquare.x-=event.delta/8;
                background.x-=event.delta/8;                                
            }
            else{
                avatar.x+=event.delta/10;
                //person3.x+=event.delta/15;
            }
        }
        if(avatar.state==="walkleft"){  
            if(avatar.x>100 && background.x>0){
                person1.x+=event.delta/8;
                attackSquare.x+=event.delta/8;
                background.x+=event.delta/8; 
            }
            else{
                avatar.x-=event.delta/10;
                //person3.x+=event.delta/15;
            }
        }
      
        stage.update(event);
    }
    
    
    function avatarAttack(type){
        for (i=0;i<enemies.length; i++)
        {
            dist = enemies[i].x-avatar.x;
            if (dist>0 && dist<150){
                if(type==="bump"){enemies[i].bump();}
                else if(type==="lift"){enemies[i].lift();}
            }
        }
            
    }
    
    function handleKeyDown(event)
    {
        keycontrol.handleKeyDown(event);
    }
    
    function handleKeyUp(event)
    {
        keycontrol.handleKeyUp(event);
    }
    
    return inter;
}());

function AttackSquare() 
{
    this.initialize();
}
//inheritance
AttackSquare.prototype = new createjs.Shape();
AttackSquare.prototype.SkeletonInit = AttackSquare.prototype.initialize;

//props
AttackSquare.prototype.attackState = "none";

//constructor
AttackSquare.prototype.initialize = function () 
{

    this.SkeletonInit();
    this.countdown=1000;
    this.graphics.beginFill("#e0dfd2").drawRect(0, 0, 10,10);
}

AttackSquare.prototype.attackUpdate=function (e)
{
    if(this.countdown<=0)
    {
        if(this.attackState==="none")
        {
            r=Math.random();
            if(r>0.75){this.changeAttackState("blue")}
            else if(r>0.5){this.changeAttackState("red");}
            else{this.changeAttackState("grey");}
        }
        else
        {
           this.changeAttackState("none");
        }
    }
    else
    {
        this.countdown-=e.delta;
    }
}

AttackSquare.prototype.setMasterOpponent = function(master,opponent)
{
    this.master=master;
    this.avatar = opponent;
}
    
AttackSquare.prototype.changeAttackState = function(color)
{
    this.attackState=color;
    if(this.attackState==="none")
    {
        this.master.x+=15;
        this.alpha=0;
        this.countdown=1500;
    }
    else
    {
        this.master.x-=15;
        this.alpha=1;
        this.countdown=1000;
        if(this.attackState==="blue"){this.graphics.beginFill("#333367").drawRect(0,0, 10, 10);}
        if(this.attackState==="red"){this.graphics.beginFill("#da3f3a").drawRect(0,0, 10, 10);}
        if(this.attackState==="grey"){this.graphics.beginFill("#e0dfd2").drawRect(0,0, 10, 10);}
        if(this.master.x-this.avatar.x<100)
        {
            this.avatar.bump();
        }
    }
}