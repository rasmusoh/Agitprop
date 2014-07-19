//helpclass to keep track of keys pressed, handle keydown/keydown events and
//and control the player animations
//
function toppleKeyControl(Player) {
    this.initialize(Player);
}

    KEYCODE_W=87;
    KEYCODE_UP=38;
    KEYCODE_DOWN=40;
    KEYCODE_S=83;
    KEYCODE_A=65;
    KEYCODE_D =68;
    KEYCODE_LEFT=37;
    KEYCODE_RIGHT=39;
    KEYCODE_SPACE=32;
    KEYCODE_ENTER = 13;

toppleKeyControl.prototype.initialize = function(Player){
    this.attackPressed = false;
    this.downPressed = false;
    this.upPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.Hero = Player;
}

toppleKeyControl.prototype.tick = function(event){
    if(this.Hero.inControl()){
       if((this.Hero.state==="highstance"&& !this.upPressed) || (this.Hero.state==="lowstance"&& !this.downPressed)){
        this.Hero.gotoAndPlay("normstance");
        }
        else if(!this.Hero.state==="highstance"&& this.upPressed){
            this.Hero.gotoAndPlay("highstance");
        }
        else if(!this.Hero.state==="lowstance"&& this.downPressed){
            this.Hero.gotoAndPlay("lowstance");
        }
    }
}


toppleKeyControl.prototype.handleKeyDown = function(event){
    switch (event.keyCode) {
    case KEYCODE_W: ;
    case KEYCODE_UP:
            this.Hero.gotoAndPlay("highstance");
            this.upPressed = true;
        break;
    case KEYCODE_S: ;
    case KEYCODE_DOWN:
            this.Hero.gotoAndPlay("lowstance");
            this.downPressed = true;
        break;
    case KEYCODE_LEFT: ;
    case KEYCODE_A:
        if (this.leftPressed==false){
            this.Hero.gotoAndPlay("walkleft");
            this.leftPressed = true;
        }
        break;
    case KEYCODE_RIGHT: ;
    case KEYCODE_D:
        if (this.rightPressed==false){
            this.Hero.gotoAndPlay("walkright");
            this.rightPressed = true;
        }
        break;
        
    case KEYCODE_SPACE:
        if (this.attackPressed ==false){
            this.attackPressed = true;
            if(this.Hero.state==="highstance"){
                this.Hero.gotoAndPlay("highattack");
            }
            else if(this.Hero.state==="lowstance"){
                this.Hero.gotoAndPlay("lowattack");
            }
            else if(this.Hero.state==="normstance"){
                 this.Hero.gotoAndPlay("aggattack");
            }
        }
        break;
    }
}

toppleKeyControl.prototype.handleKeyUp = function(event){
    if (this.Hero.inControl()) {
        switch (event.keyCode) {
            case KEYCODE_W: ;
            case KEYCODE_UP: ;  
            case KEYCODE_S: ;
            case KEYCODE_DOWN: ;
            case KEYCODE_RIGHT: ;
            case KEYCODE_LEFT: ;
                this.Hero.gotoAndPlay("normstance");
                break;
        }
    }
    switch(event.keyCode){
        case KEYCODE_LEFT: ;
         case KEYCODE_A: 
             this.leftPressed = false;
             break;
        case KEYCODE_RIGHT: ;
         case KEYCODE_D: 
             this.rightPressed = false;
             break;
         case KEYCODE_SPACE:
             this.attackPressed = false;
             break;

         case KEYCODE_W: ;
         case KEYCODE_UP: 
             this.upPressed = false;
             break;

         case KEYCODE_S: ;
         case KEYCODE_DOWN: 
             this.downPressed = false;
             break;
         
    }
}

