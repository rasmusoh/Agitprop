
function Dialogue(x,y){
    this.initialize(x,y)

}


Dialogue.prototype.initialize = function(x,y)
{
    this.container = new createjs.Container();
    this.previousY = 0;
    this.container.x = x;
    this.container.y = y;
}

Dialogue.prototype.addOption = function(name, ifClicked)
{
    start = new createjs.Text();
    start.text = name;
    start.font = "96px Oswald";
    start.color = "#FF7700";
    start.x = 0;
    start.y = this.previousY+start.getMeasuredHeight()
//    rekt = start.getBounds();
//    var shape = new createjs.Shape();
//    shape.graphics.beginFill("#ff0000").drawRect(rekt);
//    shape.aplha = 0.5;
//    this.container.addChild(rekt,start);
    //shape.addEventListener("click",ifClicked);
}

Dialogue.prototype.getDialogue = function()
{
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
