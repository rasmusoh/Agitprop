var player1 = [],
    player2 = [],    
    cardsEnum = Object.freeze({"CatCatcher":0, "AcademicRenome":1, "StrawMan":2, "Filbuster":3}),
    cards = [],
    stage,
    player1Shape,
    player2Shape,
    choosenCard,
    player1Text,
    player2Text,
    cardText,
    dia;

function skelletonFightInit()
{        
    stage = new createjs.Stage("agitpropCanvas");
    
    cards[cardsEnum.CatCatcher] = ['... which reminds me of back when I caught cats in a Voksoburg back alley...', 'Let\'s you attack twice'];
    cards[cardsEnum.AcademicRenome] = ['...having a firm grip of the methodology of the mentioned article, I can assure you that...', 'Boosts your credibility'];
    cards[cardsEnum.Strawman] = ['...and we all detest rat meat in our pies...', 'Your next attack will bypass credebility'];
    cards[cardsEnum.Filbuster] = ['I\'mma talk \'til I drop, motherfuckers!', 'Your opponent will have on less move on her next round'];

    drawShapes();
    //set hp, credibility, and cards    
    player1["name"] = "The Agitator";
    player1["hp"] = 5;
    player1["dmg"] = 1;
    player1["credibility"] = 5;
    player1["attacks"] = 1;
    player1["moves"] = 1;   
    player1["curMoves"] = 0;
    player1["buffs"] = [];
    player1["buffs"]["attacksBuffs"] = [];
    player1["buffs"]["credibilityBuffs"] = [];
    player1["buffs"]["moveBuffs"] = [];
    player1["cards"] = [cardsEnum.CatCatcher, cardsEnum.AcademicRenome];
    player1["enemy"] = player2;     
    player1["text"] = (function(){return player1Text;});
    
    player2["name"] = "Bildt";
    player2["hp"] = 5;
    player2["dmg"] = 1;
    player2["credibility"] = 5;
    player2["attacks"] = 1;
    player2["moves"] = 1;
    player2["curMoves"] = 0;
    player2["buffs"] = [];
    player2["buffs"]["attacksBuffs"] = [];
    player2["buffs"]["credibilityBuffs"] = [];
    player2["buffs"]["moveBuffs"] = [];
    player2["cards"] = [cardsEnum.Strawman, cardsEnum.Filbuster];
    player2["enemy"] = player1;        
    player2["text"] = (function(){return player2Text;});
    
    updateText(player1);
    updateText(player2);
    stage.update();
    playerTurn(player1);
}

function drawShapes()
{
     player1Shape = new createjs.Shape();
    player1Shape.graphics.beginFill("#0000ff").drawRect(0, 350, 50, 200);
    player2Shape = new createjs.Shape();
    player2Shape.graphics.beginFill("#00ff00").drawRect(750, 350, 50, 200);
                
    player1Text = new createjs.Text();    
    player1Text.text = "text";
    player1Text.font = "20px Oswald";
    player1Text.color = "#FFFFFF";
    player1Text.x = 0;
    player1Text.y = 0;
    player1Text.alpha=1;   
    
    player2Text = new createjs.Text();    
    player2Text.text = "text";
    player2Text.font = "20px Oswald";
    player2Text.color = "#FFFFFF";
    player2Text.x = 650;
    player2Text.y = 0;
    player2Text.alpha=1;    
    
    cardText = new createjs.Text();    
    cardText.text = "text";
    cardText.font = "20px Oswald";
    cardText.color = "#FF7700";
    cardText.x = 200;
    cardText.y = 200;
    cardText.alpha=1;    
    stage.addChild(player1Shape, player2Shape, player1Text, player2Text);    
}

function updateText(player)
{    
    player["text"]().text = 'Name: '+player["name"] + '\n\ ' + 
                            'HP: '+player["hp"] + '\n\ ' + 
                            'Credibility: '+player["credibility"] ;//+ '\n\ ' + 
}

//function fight()
//{
//      var players = [player1, player2];
//    var isWon = false;
//    while (!isWon)
//    {
//        players.forEach(function(player){PlayerTurn(player); if (player["enemy"]["hp"]<1) isWon=true; });        
//    }       
//    endGame(player);
//}
function playerTurn(player)
{            
    player["curMoves"] = player["moves"]
    choosenCard = [];
    chooseCards(player);
}

function chooseCards(player)
{
    //show cards
    dia = new Dialogue(250,150, '20px Oswald');    
    player["cards"].forEach(function(card)
                            {
                                dia.addOption(player["name"]+': '+cards[card][1], 
                                    function()
                                    {   
                                        return clickCard(card, player);
                                    });
                            });                                
    stage.addChild(dia.getDialogue());    
    stage.update();
}

function clickCard(card, player)
{
    dia.destroy();
    choosenCard.push(card);    
    stage.update();
    player["curMoves"]--;
    if(player["curMoves"]>0)
    {
        chooseCards(player);
    }
    else
    {
        playerLogic(player);
    }
    
}


function playerLogic(player)
{
    if(choosenCard.indexOf(cardsEnum.CatCatcher))
    {
        player["attacks"]++;
    }
    if(choosenCard.indexOf(cardsEnum.AcademicRenome))
    {
        player["buffs"]["credibilityBuffs"].push = [2,1];
    }
    if(choosenCard.indexOf(cardsEnum.Strawman))
    {
        player["enemy"]["buffs"]["credibilityBuffs"].push = [-100,1];
    }
    if(choosenCard.indexOf(cardsEnum.Filbuster))
    {
        player["enemy"]["buffs"]["moveBuffs"].push = [-1,1];
    }
    
    //apply buffs
    //remove all buffs cd===0
    //countdown buffs
    
    if((player["credibility"] + player["dmg"])>player["enemy"]["credibility"])
    {
        player["enemy"]["hp"] -= player["dmg"];
    }
    else
    {
        var multiplier = player["enemy"]["credibility"] -player["credibility"];
        if(math.rnd()<(0.5+0.*multiplier))
        {
            player["enemy"]["hp"]--;
        }
    }
        
    player["credibilityBuff"] = 0;
    player["moveBuff"] = 0;
    doAnimations(choosenCard, player);
    
    updateText(player1);
    updateText(player2);
    
    playerTurn(player["enemy"]);
}
function doAnimations(animationsToDo, player)
{
    
    animationsToDo.forEach(function(animation){
        cardText.text = cards[animation][1];
        //TIMER
        stage.update();
    });    
}

function endGame(player)
{
    alert(player["name"]+' has defeated '+player["enemy"]["name"]);
}

