
function Dialogue(x,y, font)
{
    this.initialize(x,y, font)
}


Dialogue.prototype.initialize = function(x,y, font)
{
    this.container = new createjs.Container();
    this.previousY = 0;
    this.container.x = x;
    this.container.y = y;
    this.font = font;
}

Dialogue.prototype.addOption = function(name, ifClicked)
{
    start = new createjs.Text();
    start.text = name;
    start.font = this.font;
    start.color = "#FF7700";
    start.x = 0;
    start.y = this.previousY;
    rekt = start.getBounds();
    var shape = new createjs.Shape();
    shape.graphics.beginFill("#ff0000").drawRect(rekt.x,rekt.y+this.previousY+
            rekt.height/3,rekt.width,rekt.height);
    shape.alpha = 0.01;
    this.container.addChild(shape,start);
    shape.addEventListener("click",ifClicked);
    this.previousY += rekt.height*1.5;
}

Dialogue.prototype.getDialogue = function()
{
    console.log('getDialogue');
    return this.container;
}

Dialogue.prototype.destroy = function()
{
    ls = this.container.children;
    for(i = 0; i < ls; i++)
    {
        ls[i].removeAllEventListeners();
    }
    this.container.removeAllChildren();
}
