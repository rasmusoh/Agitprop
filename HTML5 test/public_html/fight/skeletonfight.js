var player1 = [],
    player2 = [],    
    cardsEnum = Object.freeze({"CatCatcher":0, "AcademicRenome":1, "StrawMan":2, "Filbuster":3}),
    buffTypeEnum = Object.freeze({"attacksBuffs":0, "moveBuffs":1, "damageBuffs":2, "credibilityBuffs":3}),
    cards = [],
    stage,
    player1Shape,
    player2Shape,
    choosenCard,
    player1Text,
    player2Text,
    cardText,
    dia,
    currentPlayer,
    isCountdown,
    countdown;

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
    player1["buffs"][buffTypeEnum.attacksBuffs] = [];
    player1["buffs"][buffTypeEnum.attacksBuffs]["type"] = "attacks";
    player1["buffs"][buffTypeEnum.credibilityBuffs] = [];
    player1["buffs"][buffTypeEnum.credibilityBuffs]["type"] = "credibility";
    player1["buffs"][buffTypeEnum.moveBuffs] = [];
    player1["buffs"][buffTypeEnum.moveBuffs]["type"] = "move";
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
    player2["buffs"][buffTypeEnum.attacksBuffs] = [];
    player2["buffs"][buffTypeEnum.attacksBuffs]["type"] = "attacks";
    player2["buffs"][buffTypeEnum.credibilityBuffs] = [];
    player2["buffs"][buffTypeEnum.credibilityBuffs]["type"] = "credibility";
    player2["buffs"][buffTypeEnum.moveBuffs] = [];
    player2["buffs"][buffTypeEnum.moveBuffs]["type"] = "move";
    player2["cards"] = [cardsEnum.Strawman, cardsEnum.Filbuster];
    player2["enemy"] = player1;        
    player2["text"] = (function(){return player2Text;});
  
    createjs.Ticker.addEventListener("tick", SkeletonTick);
    
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
    stage.addChild(player1Shape, player2Shape, player1Text, player2Text, cardText);    
}

function SkeletonTick(event)
{
    if (isCountdown)
    {
        countdown-=event.delta;
        if(countdown<=0)
        {
            isCountdown = false;
            cardText.text = "";
            playerTurn(currentPlayer["enemy"]);
        }
    }
}

function startCountdown(milliseconds)
{
    isCountdown = true;
    countdown = milliseconds;
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
    player["curMoves"] =0;
    currentPlayer = player;    
    choosenCard = [];     
    if(player["curMoves"]<player["moves"])    
    {
        player["curMoves"]++;
        chooseCards(player);    
    }
    else
    {
        playerTurn(player["enemy"]);       
    }
}

function clickCard(card, player)
{
    dia.destroy();
    choosenCard[card] = cards[card];    
    stage.update();      
    if(player["curMoves"]<player["moves"])    
    {
        player["curMoves"]++;
        chooseCards(player);    
    }
    else
    {
        playerLogic(player);       
    }
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

function playerLogic(player)
{
    if(choosenCard.indexOf(cards[cardsEnum.CatCatcher])!==-1)
    {
        player["buffs"][buffTypeEnum.attacksBuffs].push([2,1]);
    }
    if(choosenCard.indexOf(cards[cardsEnum.AcademicRenome])!==-1)
    {
        player["buffs"][buffTypeEnum.credibilityBuffs].push([2,2]);
    }
    if(choosenCard.indexOf(cards[cardsEnum.Strawman])!==-1)
    {
        player["enemy"]["buffs"][buffTypeEnum.credibilityBuffs].push([-100,1]);
    }
    if(choosenCard.indexOf(cards[cardsEnum.Filbuster])!==-1)
    {
        player["enemy"]["buffs"][buffTypeEnum.moveBuffs].push([-1,2]);                        
    }
    var players=[];
    players.push(player1);
    players.push(player2);
    players.forEach(function(plyr){
        plyr["buffs"].forEach(function(typeOfBuff){            
            typeOfBuff.forEach(function(buff)
            {
               if(buff[1]>0)
               {
                    player[typeOfBuff["type"]] +=buff[0];
                    buff[1]--;
                }
                else
                {                
                    typeOfBuff.splice(typeOfBuff.indexOf(buff),1);
                }       
            });
        });
    });
    
    for(i = 0; i<player["attacks"]; i++)
    {
        if((player["credibility"] + player["dmg"])>player["enemy"]["credibility"])
        {
            player["enemy"]["hp"] -= player["dmg"];
        }
        else
        {
            var multiplier = player["enemy"]["credibility"] -player["credibility"];
            if(Math.random()<(0.5+0.*multiplier))
            {
                player["enemy"]["hp"]--;
            }
        }
    }
            
    doAnimations(choosenCard, player);
    updateText(player1);
    updateText(player2);
    startCountdown(2000);
}
function doAnimations(animationsToDo, player)
{
    
    animationsToDo.forEach(function(animation){
        cardText.text = animation[0];
        
        stage.update();
    });    
}

function endGame(player)
{
    alert(player["name"]+' has defeated '+player["enemy"]["name"]);
}

