//helpclass to keep track of keys pressed, handle keydown/keydown events and
//and control the player animations
//
function KeyControl(Player) {
    this.initialize(Player);
}



KeyControl.prototype.initialize = function(Player){
    this.dodgePressed = false;
    this.attackPressed = false;
    this.downPressed = false;
    this.upPressed = false;
    this.Hero = Player;
}

KeyControl.prototype.handleKeyDown = function(event){
    switch (e.keyCode) {
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
            if(this.Hero.currentAnimation=="highstance"){
                this.Hero.gotoAndPlay("highattack");
            }
            else if(Hero.currentAnimation=="lowstance"){
                this.Hero.gotoAndPlay("lowattack");
            }
            else if(Hero.currentAnimation=="normstance"){
                this.Hero.gotoAndPlay("aggattack");
            }
        }
        break;
}

KeyControl.prototype.handleKeyUp = function(event)  {
    if (this.Hero.inControl()) {
        switch (e.keyCode) {
            case KEYCODE_W: ;
            case KEYCODE_UP: ;  
            case KEYCODE_S: ;
            case KEYCODE_DOWN: ;
                this.Hero.gotoAndPlay("normstance");
                break;
        }
    }
    switch(e.keyCode){
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
             break
    }
}

