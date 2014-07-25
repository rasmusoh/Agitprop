var Controls = (function(){
    
    var ctrls = {}
    ,up, down, left, right, attack;
    ctrls.UpGetter = function(){return up;};
    ctrls.DownGetter = function(){return down;};
    ctrls.LeftGetter = function(){return left;};
    ctrls.RightGetter = function(){return right;};
    ctrls.AttackGetter = function(){return attack;};
    
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

    ctrls.Init = function(){        
        down = false;
        up = false;        
        left = false;
        right = false;      
        attack = false;
        document.onkeydown = function (event)
        {
            handleKeyDown(event);
        };
        document.onkeyup = function (event)
        {
             handleKeyUp(event);
        };   
    }
    
    function handleKeyDown (event){
        switch (event.keyCode) {
        case KEYCODE_UP:
                up = true;
            break;
        case KEYCODE_DOWN:
                down = true;
            break;
        case KEYCODE_LEFT: ;
        case KEYCODE_A:            
                left = true;            
            break;
        case KEYCODE_RIGHT: ;
        case KEYCODE_D:
                right = true;
            break;
        case KEYCODE_SPACE:     
            attack = true;
            break;
        }
    }

    function handleKeyUp (event){             
        switch (event.keyCode) {
        case KEYCODE_UP:
                up = false;
            break;
        case KEYCODE_DOWN:
                down = false;
            break;
        case KEYCODE_LEFT: ;
        case KEYCODE_A:            
                left = false;            
            break;
        case KEYCODE_RIGHT: ;
        case KEYCODE_D:
                right = false;
            break;
        case KEYCODE_SPACE:   
                attack = false;
            break;
        }
    }
    return ctrls;
});