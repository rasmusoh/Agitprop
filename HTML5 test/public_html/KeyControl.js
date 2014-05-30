//helpclass to keep track of keys pressed, handle keydown/keydown events and
//and control the player animations
//
function KeyControl(Player) {
    this.initialize(Player);
}

    KEYCODE_W=87;
    KEYCODE_UP=38;
    KEYCODE_DOWN=40;
    KEYCODE_S=83;
    KEYCODE_A=65;
    KEYCODE_LEFT=37;
    KEYCODE_SPACE=32;
    KEYCODE_ENTER = 13;
    
KeyControl.prototype.Power = 100;
    

KeyControl.prototype.initialize = function(Player){
    this.dodgePressed = false;
    this.attackPressed = false;
    this.downPressed = false;
    this.upPressed = false;
    this.Hero = Player;
}

KeyControl.prototype.tick = function(event){
    if(this.Hero.inControl()){
       if((this.Hero.currentAnimation=="highstance"&& !this.upPressed) || (this.Hero.currentAnimation=="lowstance"&& !this.downPressed)){
        this.Hero.gotoAndPlay("normstance");
        }
        else if(!this.Hero.currentAnimation=="highstance"&& this.upPressed){
            this.Hero.gotoAndPlay("highstance");
        }
        else if(!this.Hero.currentAnimation=="lowstance"&& this.downPressed){
            this.Hero.gotoAndPlay("lowstance");
        }
    }
    if(this.Power<100 && (this.Hero.inControl() || Hero.currentAnimation=="dodge")){
        this.Power=Math.min(this.Power+event.delta/70,100);
    }
}


KeyControl.prototype.handleKeyDown = function(event){
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
        if (this.dodgePressed==false){
            this.Hero.gotoAndPlay("dodge");
            this.dodgePressed = true;
        }
        break;
    case KEYCODE_SPACE:
        if (this.attackPressed ==false){
            this.attackPressed = true;
            if(this.Hero.currentAnimation=="highstance"&& this.Power>=20){
                this.Hero.gotoAndPlay("highattack");
                this.Power-=30;
            }
            else if(this.Hero.currentAnimation=="lowstance"&& this.Power>=20){
                this.Hero.gotoAndPlay("lowattack");
                this.Power-=30;
            }
            else if(this.Hero.currentAnimation=="normstance" && this.Power>=100){
                this.Hero.gotoAndPlay("aggattack");
                this.Power-=30;
            }
        }
        break;
    }
}

KeyControl.prototype.handleKeyUp = function(event){
    if (this.Hero.inControl()) {
        switch (event.keyCode) {
            case KEYCODE_W: ;
            case KEYCODE_UP: ;  
            case KEYCODE_S: ;
            case KEYCODE_DOWN: ;
                this.Hero.gotoAndPlay("normstance");
                break;
        }
    }
    switch(event.keyCode){
        case KEYCODE_LEFT: ;
         case KEYCODE_A: 
             this.dodgePressed = false;
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

