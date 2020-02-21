// Made by Leo London

$(document).ready( function() {
	getNativeSize();
	takeStock();
	sceneLetter();
});

//Display
var screenImage = $("#screenImage");
var nativeImageWidth;
var nativeImageHeight;
var nativeRatio;
var debugCounter = 1;

function getNativeSize() {
	// Create new offscreen image to test
	var theImage = new Image();
	theImage.src = screenImage.attr("src");

	// Get accurate measurements from that.
	nativeImageWidth = theImage.width;
	nativeImageHeight = theImage.height;
	nativeRatio = nativeImageWidth / nativeImageHeight;
	screenResize();
}

function screenResize() {   		
	var iHeight = $(".inventory").height();
	var bHeight = $(".bottom").height();
	var wHeight = $(window).height();
	var sHeight = wHeight - iHeight - bHeight;
	$(".screen").css("height", sHeight);

	var imageHeight = $("#screenImage").height();
	var imageWidth = $("#screenImage").width();
	var newHeight = (1 / nativeRatio) * imageWidth;
	var botGap = $(".screen").height() - imageHeight;
	var sideGaps = $(".screen").width() - imageWidth;

	/*
	if (imageWidth >= $(".screen").width()) {
		$("#screenImage").css("height", newHeight);

	}
	else if (botGap > sideGaps) {
		newHeight = (1 / nativeRatio) * $(".screen").width();
		$("#screenImage").css("height", newHeight);
	}
	else{
		$("#screenImage").css("height", sHeight);
	}
	*/
	$("#screenImage").css("height", sHeight);
	$("#screenImage").css("width", $(".screen").width());
}

$(window).resize( function() {
	screenResize();
});

//Scene and Player variables
var player = {
	name: "Mike",
	weapon: "fists",
	inventory: [],
	health: 2,
	statusEffects: []
}

var weaponList = {};
var weaponListNames = [];
var weaponListSize = 0;
var itemList = {};
var itemListSize = 0;

function takeStock() {
	
	$.getJSON("weaponStock.json", function(stock) {
		$.each(stock, function (name, img) {
			weaponList[name] = img;
			weaponListNames.push(name);
			weaponListSize++;
		});
	});
	
	
	$.getJSON("itemStock.json", function(stock) {
		$.each(stock, function (name, img) {
			itemList[name] = img;
			itemListSize++;
		});
	});
	
}

var mode = "Dialogue";
var currentScene = "Letter";
var innerScene = "";
var gameOver = false;
var inputAction;
var linesOfText = [];
var lineNumber = 0;
var playerHealth = 2;
var wizardHealth = 3;
var witherTimer = 3;
var wizardLinesOfText = 0;


// NOTE: Return here and add Arrow Keys during Input
//Story progression
$(document).on("keyup mouseup", function(event) {
	if (mode == "Dialogue") {
		if (event.type == "keyup" && (event.which == 13 || event.which == 32)) {
			progressText();
		}

		else if (event.type == "mouseup" && event.target.nodeName == "BUTTON") {
			progressText();
		}
	}

	else if (mode == "Input") {
		if (event.type == "mouseup" && event.target.nodeName == "BUTTON") {
			checkInput(event.target.id);
		}
		else if (currentScene == "Letter" && event.type == "keyup" && event.which == 13) {
			checkInput(null);
		}
	}
});


function progressText() {
	$("#dialogueText").html(linesOfText[lineNumber]);
	lineNumber++;
	returnToScene();
}

function returnToScene() {
	switch(currentScene) {
		case "Letter":
			sceneLetter();
			break;

		case "RoadFork":
			sceneRoadFork();
			break;

		case "Forest":
			sceneForest();
			break;

		case "River":
			sceneRiver();
			break;

		case "Shop":
			sceneShop();
			break;

		case "BusRide":
			sceneBusRide();
			break;

		case "Cave":
			sceneCave();
			break;

		case "Palace":
			scenePalace();
			break;

		case "Resurrection":
			eventResurrection();
			break;

		case "Death":
			sceneDeath();
			break;

		case "Victory":
			sceneVictory();
			break;

		default:
			alert("Error: SceneReturn");
			break;
	}
}

function newButton(buttonDisplay) {
	var totalOptions = $("#optionsBox > li").length;
	var newIdString = "option" + totalOptions;
	var newButtonId = "#" + newIdString;
	var buttonString = ("<button id=\"button" + totalOptions + "\">" + buttonDisplay + "</button>");
	$("#optionsBox").append($('<li>', { 
		id: newIdString,
	}));
	$(newButtonId).html(buttonString);
	screenResize();
}

function addItem(item, type) {
	var inventorySize = player["inventory"].length;
	var imageString;
	var imageURL;

	if (type == "weapon") {
		player["weapon"] = item;
		imageURL = "\"img/weapons/" + weaponList[item] + "\" ";
	}
	else {
		imageURL = "\"img/items/" + itemList[item] + "\" ";
	}
	imageString = "<img id=\"item-" + item + "\" src=" + imageURL + " + title=\"" + item + "\">";
	var inventorySlot = "<li id=\"itemSlot-" + inventorySize +"\">" + imageString + "</li>";
	var inventoryObject = $.parseHTML(inventorySlot);

	player["inventory"].push(item);
	$("#inventoryDisplay").append(inventoryObject);

	// ~~ Revisit this later ~~
	/*
		$("#itemSlot-" + item).tooltip({
			container: "body",
			placement: "bottom",
			title: item
		});   
		$("#itemSlot-" + item).tooltip("show"); 
	*/
	screenResize();
}

function removeItem(item, type) {
	if (hasItem(item))
	{
		var inventorySize = player["inventory"].length;
		
		if (type == "weapon") {
			player["weapon"] = "fists";
		}
		var itemIndex = $.inArray(item, player["inventory"]);
		player["inventory"].splice(itemIndex, 1);
		$("#itemSlot-" + itemIndex).remove();

		// Adjusting for new inventory layout
		for (var n = itemIndex + 1; n < inventorySize; n++) {
			var newID = ("itemSlot-" + (n - 1));
			$("#itemSlot-" + n).attr("id", newID);
		}

		screenResize();
	}
	
}

function removeStatus(status) {
	if (hasStatus(status)) {
		var statusIndex = $.inArray(status, player["statusEffects"]);
		player["statusEffects"].splice(statusIndex, 1);
	}
	
}

function checkInput(selectedButton) {
	switch(currentScene) {
		case "Letter":
			if ($("#nameInput").val() == "") {
				$("#dialogueText").html("What was that?");
			}
			else {
				player["name"] = $("#nameInput").val();
				returnToScene();
				progressText();
			}
			break;

		case "RoadFork":
			if (selectedButton == "button0") {
				inputAction = "Forest";
			}
			else{
				inputAction = "River";
			}
			returnToScene();
			progressText();
			break;

		case "Forest":
			if (lineNumber == 4) {
				if (selectedButton == "button0") {
				inputAction = "River";
				}
			}
			else if (lineNumber == 7) {
				if (selectedButton == "button0") {
					inputAction = "Attack";
				}
				else {
					inputAction = "Leave";
				}
			}
			returnToScene();
			progressText();
			break;

		case "River":
			switch (innerScene){
				case "jumpGate":
					if (selectedButton == "button0") {
						inputAction = "Explain";
					}
					else {
						inputAction = "Fight";
					}
					break;

				case "explain":
					if (selectedButton == "button0") {
						inputAction = "Fight";
					}
					else if (selectedButton == "button1") {
						inputAction = "Swim";
					}
					else if (selectedButton == "button2"){
						inputAction = "Forest";
					}
					else {
						inputAction = "Pay";
					}
					break;

				case "swimAcross":
					swimAcross();
					break;

				case "payToll":
					if (lineNumber == 3) {
						if (!hasStatus("failedExplain")){
							if (selectedButton == "button0") {
								inputAction = "Jump";
							}
							else if (selectedButton == "button1") {
								inputAction = "Swim";
							}
							else {
								inputAction = "Forest";
							}
						}
						else {
							if (selectedButton == "button0") {
								inputAction = "Fight";
							}
							else if (selectedButton == "button1") {
								inputAction = "Swim";
							}
							else{
								inputAction = "Forest";
							}
						}
					}
					break;

				default:
					if (lineNumber == 4) {
						if (selectedButton == "button0") {
							inputAction = "Jump";
						}
						else if (selectedButton == "button1") {
							inputAction = "Swim";
						}
						else {
							inputAction = "Pay";
						}
					}
					break;
			}
			returnToScene();
			progressText();
			break;

		case "Shop":
			if (selectedButton == "button0") {
				inputAction = "Ticket";
			}
			else {
				inputAction = "Armor";
			}
			returnToScene();
			progressText();
			break;

		case "Death":
			location.reload();
			break;

		case "Victory":
			if (innerScene != "postChoice") {
				if (selectedButton == "button0") {
					inputAction = "Kill";
				}
				else {
					inputAction = "Spare";
				}
				returnToScene();
				progressText();
			}
			else {
				location.reload();
			}
			break;

		default:
			alert("Error: Input - " + currentScene);
			break;
	}
}

function switchScene(progressionText) {
	progressionText = progressionText || "<i>Traveling...</i>";
	if (gameOver) {
		progressionText = "<font color='red'>YOU DIED</font>"
	}
	linesOfText = [];
	lineNumber = 0;
	$("#dialogueText").html(progressionText);
	innerScene = "";	
}

function hasItem(item){
	return ($.inArray(item, player["inventory"]) > -1);
}

function hasStatus(status){
	return ($.inArray(status, player["statusEffects"]) != -1);
}

//Scenes
function sceneLetter() {
	switch(lineNumber) {

		case 0:
			linesOfText.push("You are walking through the meadow, enjoying the time to yourself.")
			linesOfText.push("You see a glimmer in the distance. You squint to try and figure out what it is.");
			linesOfText.push("Oh, it's the mail man! Looks like he's here to deliver a letter to you.");
			linesOfText.push("\"Excuse me! What is your name?\"");
			break;

		case 4:
			if (mode == "Dialogue") {
				$("#optionsBox").prepend('<li id="tBox"><input type="text" id="nameInput"></li>');
				mode = "Input";
			}
			else {
				linesOfText.push("\"I thought you were " + player["name"] + "! Excellent, I have this letter for you then!\"");
				$("#optionsBox #tBox").remove();
				mode = "Dialogue";
			}
			break;

		case 5:
			linesOfText.push("He hands you a letter. You look down at it, then back up at the mail man.");
			linesOfText.push("He has already run off in the opposite direction. Well, a mail man's job is never done.");
			linesOfText.push("You open the letter...");
			linesOfText.push("\"Dear "+ player["name"] + ", the Evil Wizard has taken over the Palace.");
			linesOfText.push("You have been chosen to defeat the Evil Wizard and save the world.\"");
			linesOfText.push("You realize that you must defeat the Evil Wizard and save the world.");
			linesOfText.push("\"I'm going on an adventure!\"");
			break;

		case 13:
			switchScene();
			sceneRoadFork();
			break;
	}
	
}

function sceneRoadFork() {
	switch(lineNumber) {

		case 0:
			currentScene = "RoadFork";
			$("#screenImage").attr("src", "img/backgrounds/roadFork.jpg");
			getNativeSize();
			linesOfText.push("You continue upon the path until you reach a fork in the road.")
			linesOfText.push("The sign on the left side says Forest Ahead. The sign on the right side says River Ahead.");
			linesOfText.push("Will you go through the forest or the river?");
			break;

		case 3:
			if (mode == "Dialogue") {
				$("#button0").html("Forest");
				newButton("River");
				mode = "Input";
			}
			else {
				if (inputAction == "Forest") {
					linesOfText.push("The forest it is then!");
				}
				else{
					linesOfText.push("The river it is then!");
				}
				$("#button0").html("Continue");
				$("#optionsBox #option1").remove();
				mode = "Dialogue";
			}
			break;

		case 5:
			switchScene();
			if (inputAction == "Forest") {
				sceneForest();
			}
			else{
				sceneRiver();
			}
			break;
	}
}

function sceneForest() {
	switch (innerScene){
		case "escapeForest":
			escapeForest();
			break;

		default:
			switch(lineNumber) {
				case 0:
					currentScene = "Forest";
					$("#screenImage").attr("src", "img/backgrounds/forest.jpg");
					getNativeSize();
					linesOfText.push("You walk into a dense forest. The air around you feels richer from the amount of trees.");
					linesOfText.push("After a fair amount of trekking through the thicket, your keen senses spot a $20 bill pinned to a tree.");
					linesOfText.push("<i>Twenty Dollar Bill added to inventory.</i>");
					break;

				case 3:
					addItem("Twenty Dollar Bill", "consumable");
					if (hasStatus("hasBeenTased")) {
						linesOfText.push("You think about paying the toll, but the guard probably won't let you near the river again.")
						linesOfText.push("Still aching from the taser, you take the money and press forward.");
					}
					else {
						linesOfText.push("You take the money from the tree. Would you like to go back to the river or continue through the forest?");
					}
					break;

				case 4:
					if (mode == "Dialogue" && !hasStatus("hasBeenTased")) {
						$("#button0").html("Back to the river");
						newButton("Continue through forest");
						mode = "Input";
					}
					else if (mode == "Input") {
						if (inputAction == "River") {
							linesOfText.push("Back to road and to the river!");
						}
						else{
							linesOfText.push("Onward through the forest!");
						}
						$("#button0").html("Continue");
						$("#optionsBox #option1").remove();
						mode = "Dialogue";
					}
					break;

				case 5:
					linesOfText.push("After more walking through the forest, you discover a wild rabbit!");
					linesOfText.push("Do you attack it or leave it alone and continue?"); 	
					break;

				case 6:
					if (inputAction == "River") {
						switchScene();
						sceneRiver();
					}
					break;

				case 7:
					if (mode == "Dialogue") {	
						$("#button0").html("Attack");
						newButton("Leave alone");
						mode = "Input";
					}
					else {
						if (inputAction == "Attack") {
							linesOfText.push("You sneak up on the rabbit...");
							linesOfText.push("You pounce towards the rabbit with your fists flying!")
							var rabbitCapture = Math.random();
							if (rabbitCapture > 0.3) {
								linesOfText.push("You slay the rabbit in one punch! Nice job!");
								player["statusEffects"].push("rabbitSlain")
							}
							
						}
						else {
							switchScene();
							innerScene = "escapeForest";
							escapeForest();
						}
						$("#button0").html("Continue");
						$("#optionsBox #option1").remove();
						mode = "Dialogue";
					}
					break;


				case 10:
					if (!hasStatus("rabbitSlain")) {
						switchScene("The rabbit heard you and escaped! That's too bad.");
						innerScene = "escapeForest";
						escapeForest();
					}
					break;

				case 11:
					if (hasStatus("rabbitSlain")) {
						switchScene("<i>Rabbit added to inventory.</i>");
						addItem("Rabbit", "item");
						innerScene = "escapeForest";
						escapeForest();
					}
					break;
			}
			break;
	}

	function escapeForest(){
		switch(lineNumber) {
			case 0:
				if (inputAction == "Leave"){
					linesOfText.push("You leave the rabbit alone and continue your adventure through the forest.");
					linesOfText.push("The forest seems thankful for your mercy, as flowers begin popping up that seem to lead to a way out.")
				}
				else{
					linesOfText.push("You continue your adventure through the forest.");
				}

				var exitForest = Math.random();
				if (inputAction == "Attack" && exitForest < 0.2) {
					linesOfText.push("You get lost in the woods and never find your way out.");
					gameOver = true;
				}
				else if (inputAction == "Leave") {
					linesOfText.push("Following the gift of the forest, you reach the edge of the thicket. Past the trees, you see a small hut up ahead.");
				}
				else {
					linesOfText.push("Finally, you make it out of the forest! You see a small hut up ahead.");
				}
				break;

			case 3:
				if (inputAction == "Attack") {
					switchScene();
					if (gameOver){
						sceneDeath();
					}
					else {
						sceneShop();
					}
				}
				break;

			case 4:
				switchScene();
				sceneShop();
				break;
		}
	}	
}

function sceneRiver() {
	switch (innerScene){
		case "jumpGate":
			jumpGate();
			break;

		case "explain":
			explain();
			break;

		case "fightGuard":
			fightGuard();
			break;

		case "swimAcross":
			swimAcross();
			break;

		case "payToll":
			payToll();
			break;

		case "toForest":
			toForest();
			break;

		default:
			switch(lineNumber) {
				case 0:
					currentScene = "River";
					$("#screenImage").attr("src", "img/backgrounds/river.jpg");
					getNativeSize();
					linesOfText.push("You walk a dirt road until you come across the river.");
					linesOfText.push("The bridge for the river is blocked by a toll booth.");
					linesOfText.push("The guard in the booth asks you politely for $20 to pass the toll.");
					linesOfText.push("Will you jump the gate, swim across the river, or pay the toll?");
					break;

				case 4:
					if (mode == "Dialogue") {
						$("#button0").html("Jump the gate");
						newButton("Swim across river");
						newButton("Pay the toll");
						mode = "Input";
					}
					else if (mode == "Input") {
						$("#button0").html("Continue");
						$("#optionsBox #option1").remove();
						$("#optionsBox #option2").remove();
						mode = "Dialogue";
						switchScene();
						if (inputAction == "Jump") {
							innerScene = "jumpGate"; 
							jumpGate();
						}
						else if (inputAction == "Swim") {
							innerScene = "swimAcross";
							swimAcross();
						}
						else{
							innerScene = "payToll";
							payToll();
						}	
					}
					break;
			}
	}
	

	function jumpGate () {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You begin to slowly back up to get into position.");
				linesOfText.push("You kick off and sprint to jump over the gate!");
				linesOfText.push("The guard flashes out of the booth in front of you, stopping your assault on the law.");
				linesOfText.push("\"Yo, that's not cool, man. What are you doing?\"");
				linesOfText.push("Will you explain the situation or fight the guard?");
				break;

			case 5:
				if (mode == "Dialogue") {
					$("#button0").html("Explain");
					newButton("Fight the guard");
					mode = "Input";
				}
				else if (mode == "Input") {
					$("#button0").html("Continue");
					$("#optionsBox #option1").remove();
					mode = "Dialogue";
					switchScene();
					if (inputAction == "Explain") {
						innerScene = "explain"; 
						explain();
					}
					else{
						innerScene = "fightGuard";
						fightGuard();
					}	
				}
				break;
		}	
	}

	function explain () {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You explain the situation of the letter to the guard.");
				break;

			
			case 1:
				var successfulExplanation = Math.random();
				if (successfulExplanation >= 1.5) {
					linesOfText.push("\"Yeah, man. I can totally relate to that. Alright, I'll let you through, but don't tell my boss.\"");
					linesOfText.push("The guard pulls a lever in the booth and the gate rises.");
					linesOfText.push("You strut onward as the guard waves you off.");
				}
				else {
					linesOfText.push("\"Yo, that's some bull right there. I don't believe you.");
					linesOfText.push("Either pay the toll or get out; don't <i>make</i> me use my taser!\"");
					player["statusEffects"].push("failedExplain");
					if (!hasStatus("failedPay")){
						linesOfText.push("Will you fight the guard, swim across the river, go to the forest, or pay the toll?");
					}
					else {
						linesOfText.push("Will you fight the guard, swim across the river, or go to the forest?");
					}

				}
				break;

			case 4:
				if (!hasStatus("failedExplain")) {
					switchScene();
					sceneShop();
				}
				else if (hasStatus("failedExplain")) {
					if (mode == "Dialogue") {
						if (!hasStatus("failedPay")) {
							$("#button0").html("Fight the guard");
							newButton("Swim across river");
							newButton("Go to forest");
							newButton("Pay the toll");
						}
						else {
							$("#button0").html("Fight the guard");
							newButton("Swim across river");
							newButton("Go to forest");
						}
						mode = "Input";
					}
					else if (mode == "Input") {
						$("#button0").html("Continue");
						$("#optionsBox #option1").remove();
						$("#optionsBox #option2").remove();
						if (!hasStatus("failedPay")) {
							$("#optionsBox #option3").remove();
						}
						mode = "Dialogue";
						switchScene();
						if (inputAction == "Fight") {
							innerScene = "fightGuard"; 
							fightGuard();
						}
						else if (inputAction == "Swim") {
							innerScene = "swimAcross";
							swimAcross();
						}
						else if (inputAction == "Pay"){
							innerScene = "payToll";
							payToll();
						}	
						else {
							innerScene = "toForest";
							toForest();
						}
					}
				}
				break;
		}
	}

	function fightGuard () {
		switch(lineNumber) {
			case 0:
				linesOfText.push("\"Ah hell nah, it is ON!\"");
				linesOfText.push("The guard whips out his weapon of choice: a stun gun");
				linesOfText.push("<i>Fight!</i>");
				break;

			case 3:
				var attemptAttack = Math.random();
				if (attemptAttack < 0.7) {
					linesOfText.push("The guard nimbly stabs you with his charged stun gun.");
					linesOfText.push("You shudder, faint, and fall to the ground in one spasmodic motion.");
					linesOfText.push("...");
					linesOfText.push("You wake up back at the fork in the road to find the road to the river is walled off.");
					linesOfText.push("Sore, you start heading to the forest.");
					player["statusEffects"].push("hasBeenTased");
				}
				else {
					linesOfText.push("The guard nimbly lunges at you with his stun gun.");
					linesOfText.push("With the use of your heroic senses, you dodge the attack and the guard lunges past you!");
					linesOfText.push("After the dodge, you elbow the guard in the back of the head and he faints.");
					linesOfText.push("With the guard unconscious, you hop over the gate and continue forward.");
				}
				break;

			case 8:
				if (!hasStatus("hasBeenTased")) {
					switchScene();
					sceneShop();
				}
				break;

			case 9:
				switchScene();
				sceneForest();
				break;
		}
	}

	function swimAcross () {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You step away from the guard and approach the river.");
				linesOfText.push("You take a deep breath and jump into the river!");
				break;

			case 2:
				var swimSafely = Math.random();
				if (swimSafely < 0.2) {
					linesOfText.push("When you dive into the water, your head smashes into a rock and your skull implodes.");		
					gameOver = true;
				}
				else {
					linesOfText.push("You come up for air and then begin swimming across the river.");					
				}
				break;

			case 3:
				if (!gameOver) {
					var findWeapon = Math.random();
					if (findWeapon > 0.4) {
						linesOfText.push("As you swim, you feel something hit your foot.");
						linesOfText.push("You dive underneath the water...");
						var weaponIndex = Math.floor(Math.random() * (weaponListSize - 0.0001));
						var newWeapon = "";
						for (var i = 0; i < weaponListSize; i++) {
							if (i == weaponIndex) {
								newWeapon = weaponListNames[i];
								player["weapon"] = newWeapon;
							}
						}			
						linesOfText.push("<i>" + newWeapon + " added to inventory.</i>");
						player["statusEffects"].push("foundWeapon");
						
					}
					else {
						linesOfText.push("You are doing well in your journey across the river.");								
					}
					linesOfText.push("You finally reach the other end of the river.");
					linesOfText.push("You climb out and whip your hair back and forth to dry off.");
					linesOfText.push("After drying off, you spot a small hut in the distance.");
				}
				break;

			case 4:
				if (gameOver) {
					switchScene();
					sceneDeath();
				}
				break;

			case 6:
				if (hasStatus("foundWeapon")) {
					var newWeapon = player["weapon"];
					addItem(newWeapon, "weapon");
				}
				break;

			case 8:
				if (!hasStatus("foundWeapon")) {
					switchScene();
					sceneShop();
				}
				break;

			case 10:
					switchScene();
					sceneShop();
				break;
		}	
	}

	function payToll () {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You decide to pay the toll to cross the bridge.");
				if (hasItem("Twenty Dollar Bill")){
					linesOfText.push("You reach into your pocket and pull out the $20 from the forest.");
					linesOfText.push("You hand the money to guard and he pulls a lever in the booth to raise the gate.");
					linesOfText.push("<i>Twenty Dollar Bill removed from inventory.</i>");
					linesOfText.push("You continue onward as the guard waves you off.");
				}
				else {
					linesOfText.push("You reach into your pocket and, to your dismay, find no money.");
					player["statusEffects"].push("failedPay");
					if (!hasStatus("failedExplain")){
						linesOfText.push("Would you like to jump the gate, swim across the river, or go to the forest instead?");
					}
					else {
						linesOfText.push("Would you like to fight the guard, swim across the river or go to the forest instead?");
					}
				}
				break;

			case 3:
				if (mode == "Dialogue" && hasStatus("failedPay")){
					if (!hasStatus("failedExplain")){
						$("#button0").html("Jump the gate");
					}
					else{
						$("#button0").html("Fight the guard");
					}
					newButton("Swim across river");
					newButton("Go to forest");
					mode = "Input";
				}
				else if (mode == "Input") {
					$("#button0").html("Continue");
					$("#optionsBox #option1").remove();
					$("#optionsBox #option2").remove();
					mode = "Dialogue";
					switchScene();
					if (inputAction == "Jump") {
						innerScene = "jumpGate"; 
						jumpGate();
					}
					else if (inputAction == "Fight") {
						innerScene = "fightGuard";
						fightGuard();
					}
					else if (inputAction == "Swim") {
						innerScene = "swimAcross";
						swimAcross();
					}
					else {
						innerScene = "toForest";
						toForest();
					}	
				}
				break;

			case 4:
				if (hasItem("Twenty Dollar Bill")){
					removeItem("Twenty Dollar Bill", "consumable");
				}
				break;

			case 6:
				switchScene();
				sceneShop();
				break;
		}	
	}

	function toForest() {
		switch(lineNumber) {
			case 0:
				linesOfText.push("After exploring your options, you decide to simply go to the forest instead.");
				break;

			case 2:
				switchScene();
				sceneForest();
				break;
		}
	}
}

function sceneShop() {
	switch (innerScene){
		case "ticket":
			ticket();
			break;

		case "armor":
			armor();
			break;

		case "postPurchase":
			postPurchase();
			break;

		default:
			switch(lineNumber) {
				case 0:
					currentScene = "Shop";
					$("#screenImage").attr("src", "img/backgrounds/shop.jpg");
					getNativeSize();
					linesOfText.push("You stride up to a lone hut on the dirt road.");
					linesOfText.push("A small man in the hut spots you and jumps up as you enter.");
					linesOfText.push("\"Hello! Welcome to my humble shop!\"");
					linesOfText.push("\"I have this one-way bus ticket to the Palace.\"");
					linesOfText.push("\"I also have this magma armor on sale.\"");
					linesOfText.push("\"Take your pick!\"");
					break;

				case 6:	
					if (mode == "Dialogue") {
						$("#button0").html("Bus Ticket");
						newButton("Magma Armor");
						mode = "Input";
					}
					else if (mode == "Input") {
						$("#button0").html("Continue");
						$("#optionsBox #option1").remove();
						mode = "Dialogue";
						switchScene();
						if (inputAction == "Ticket") {
							innerScene = "ticket"; 
							ticket();
						}
						else  {
							innerScene = "armor";
							armor();
						}
					}
					break;
			}
			break;
	}

	function ticket() {
		switch(lineNumber) {
			case 0:
				if (hasItem("Twenty Dollar Bill")) {
					linesOfText.push("\"That will be 20 dollars for the bus ticket!\"");
					linesOfText.push("<i>Twenty Dollar Bill removed from inventory.</i>");	
					player["statusEffects"].push("merchant");
				}
				else {
					linesOfText.push("\"Oh, you don't have any money on you.\"");
					linesOfText.push("That\'s ok. I know you\'re the hero, so I\'ll let you have the bus ticket for free.\"");
				}
				break;

			case 2:
				if (hasItem("Twenty Dollar Bill")) {
					removeItem("Twenty Dollar Bill", "consumable");
				}
				break;

			case 3:
				addItem("Bus Ticket", "item");
				switchScene("<i>Bus Ticket added to inventory.</i>");
				innerScene = "postPurchase";
				postPurchase();
				break;
		}
	}

	function armor() {
		switch(lineNumber) {
			case 0:
				if (hasItem("Twenty Dollar Bill")) {
					linesOfText.push("\"That will be 20 dollars for the magma armor!\"");
					linesOfText.push("<i>Twenty Dollar Bill removed from inventory.</i>");	
					player["statusEffects"].push("merchant");
				}
				else {
					linesOfText.push("\"Oh, you don't have any money on you.\"");
					linesOfText.push("That\'s ok. I know you\'re the hero, so I\'ll let you have the magma armor for free.\"");
				}
				
				break;

			case 2:
				if (hasItem("Twenty Dollar Bill")) {
					removeItem("Twenty Dollar Bill", "consumable");
				}
				break;

			case 3:
				addItem("Magma Armor", "item");
				switchScene("<i>Magma Armor added to inventory.</i>");
				innerScene = "postPurchase";
				postPurchase();
				break;
		}
	}

	function postPurchase() {
		switch(lineNumber) {
			case 0:
				if (hasStatus("merchant")) {
					linesOfText.push("\"I <i>appreciate</i> your business, hero!\"");
				}
				else {
					linesOfText.push("\"Thank you for your business!\"");
				}

				if (hasItem("Rabbit")) {
					linesOfText.push("The shopkeeper looks down and notices your rabbit.");
					linesOfText.push("\"Oh, what's this? Is that a rabbit?\"");
					linesOfText.push("\"If you trade me the rabbit and I'll give you a choice weapon in return!\"");	
					linesOfText.push("<i>Rabbit removed from inventory.</i>");
					linesOfText.push("You hand the shopkeeper the rabbit and he hands you a chest.");
					linesOfText.push("You open the chest...");
					var weaponIndex = Math.floor(Math.random() * (weaponListSize - 0.0001));
					var newWeapon = "";
					for (var i = 0; i < weaponListSize; i++) {
						if (i == weaponIndex) {
							newWeapon = weaponListNames[i];
							player["weapon"] = newWeapon;
						}
					}
					linesOfText.push("You got the " + newWeapon + "!");			
					linesOfText.push("<i>" + newWeapon + " added to inventory.</i>");
				}
				break;

			case 2: 
				if (!hasItem("Rabbit")) {
					switchScene("The shopkeeper wishes you good luck in the rest of your adventure as you exit the shop.")
					if (hasItem("Bus Ticket")) {
						sceneBusRide();
					}
					else if (hasItem("Magma Armor")) {
						sceneCave();
					}
					else {
						alert("Error: Scene switch - " + currentScene);
					}
				}
				break;

			case 5:
				removeItem("Rabbit", "consumable");
				break;

			case 9:
				var newWeapon = player["weapon"];
				addItem(newWeapon, "weapon");
				break;

			case 10:
				switchScene("The shopkeeper wishes you good luck in the rest of your adventure as you exit the shop.")
				if (hasItem("Bus Ticket")) {
					sceneBusRide();
				}
				else if (hasItem("Magma Armor")) {
					sceneCave();
				}
				else {
					alert("Error: Scene switch - " + currentScene);
				}
				break;
		}
	}
}

function sceneBusRide() {
	switch (innerScene){
		case "busRideContinue":
			busRideContinue();
			break;

		default:
			switch(lineNumber) {
				case 0:
					currentScene = "BusRide";
					linesOfText.push("You continue along the dirt road until you spot a bus stop.");
					linesOfText.push("You sit down on a bench and the bus arrives shortly afterwards.");
					linesOfText.push("You step onto the bus and hand the driver your ticket.");
					linesOfText.push("<i>Bus Ticket removed from inventory.</i>");
					linesOfText.push("You walk down the rows of seats and sit down next to a window.");
					linesOfText.push("The door closes and the bus resumes its course.");
					break;

				case 1:
					$("#screenImage").attr("src", "img/backgrounds/busStop.jpg");
					break;

				case 4:
					removeItem("Bus Ticket", "consumable");
					break;

				case 5:
					$("#screenImage").attr("src", "img/backgrounds/busInside.jpg");
					break;

				case 6:
					var rightBus = Math.random();
					if (hasStatus("merchant") && player["weapon"] == "fists") {
							rightBus += 0.1;
						}
					if (rightBus <= 0.2) {
						linesOfText.push("You stare out the window and soon realize that this bus isn't leading to the Palace.");
						linesOfText.push("You got on the wrong bus!");
						gameOver = true;
					}
					else {
						linesOfText.push("You stare out the window and realize how peaceful it is outside.");
						linesOfText.push("As you wonder about the innate peace of nature, you start to doze off.");
						linesOfText.push("After a stressful adventure, you fall asleep...");
						var guardedSleep = Math.random();
						if (hasStatus("merchant")) {
							guardedSleep += 0.1;
						}
						if (guardedSleep <= 0.3 && player["weapon"] != "fists") {
							linesOfText.push("As you rest, a thief on the bus pickpockets your weapon!");
							linesOfText.push("<i>" + player["weapon"] + " removed from inventory.</i>");
							player["statusEffects"].push("pickpocketed");
							
						}
					}
					break;

				case 9:
					if (gameOver) {
						switchScene();
						sceneDeath();
					}
					break;

				case 10:
					if (!hasStatus("pickpocketed")) {
						switchScene("...");
						innerScene = "busRideContinue";
						busRideContinue();
					}
					break;

				case 11:
					removeItem(player["weapon"], "weapon");
					break;

				case 12:
					switchScene("...");
					innerScene = "busRideContinue";
					busRideContinue();
					break;
			}
			break;
	}

	function busRideContinue() {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You wake up feeling <i>Well Rested!</i>");
				player["statusEffects"].push("Well Rested");
				linesOfText.push("As you stretch after a nice nap, you notice that you are nearing the Palace.");
				linesOfText.push("When the bus reaches the stop, you thank the driver and step outside.");
				break;

			case 4:
				switchScene();
				scenePalace();
				break;
		}
	}
}

function sceneCave() {
	switch (innerScene){
		case "fightBear":
			fightBear();
			break;

		case "continueCave":
			continueCave();
			break;

		default:
			switch(lineNumber) {
				case 0:
					currentScene = "Cave";
					linesOfText.push("Looking around, you spot a dormant volcano behind the shop.");
					break;

				case 1:
					$("#screenImage").attr("src", "img/backgrounds/mountain.jpg");
					linesOfText.push("That must be what the magma armor is for!");
					linesOfText.push("As you approach the volcano, you start to get a lot hotter, but you notice a small cave at the base.");
					break;

				case 3:
					$("#screenImage").attr("src", "img/backgrounds/caveEntrance.jpg");
					linesOfText.push("You equip the magma armor and head into the dark cave. With the armor, the heat is bearable.");
					linesOfText.push("You step into the cave and use the the light from the Sun as your guide.");
					linesOfText.push("Suddenly, the cave collapses behind you!");
					linesOfText.push("After clearing the dust from your eyes, you realize the rockslide has blocked the entrance.");
					break;

				case 7:
					$("#screenImage").attr("src", "img/backgrounds/darkCave.png");
					linesOfText.push("With the sunlight no longer available to you, you must feel your way along the cave walls to press forward.");
					linesOfText.push("...");
					linesOfText.push("Some time has passed, and you wonder how much longer you'll be stuck down here.");
					break;

				case 10:
					var dontTrip = Math.random();
					if (hasStatus("merchant")) {
							dontTrip += 0.1;
						}
					if (dontTrip < 0.4) {
						linesOfText.push("As you traverse through the darkness, you trip on a rock and fall to the ground, rolling downhill.");
						linesOfText.push("The rolling stops and you slowly stand back up, <i>dazed</i>, your hand propping yourself up against the wall.");
						linesOfText.push("\"Oof, ouch, my bones.\"");
						player["statusEffects"].push("dazed");
					}
					break;

				case 11:
					if (!hasStatus("dazed")) {
						switchScene("Continuing through the cave, you see a source of light around the corner!");
						innerScene = "fightBear";
						fightBear();
					}
					break;

				case 14:
					switchScene("Continuing through the cave, you see a source of light around the corner!");
					innerScene = "fightBear";
					fightBear();
					break;
			}
			break;
	}

	function fightBear() {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You scout the area and see a Lava Bear with a sunfiery pelt!");
				linesOfText.push("The bear spots you and charges!");
				break;

			case 2:
				$("#screenImage").attr("src", "img/backgrounds/litCaveBear.png");
				linesOfText.push("<i>Fight!</i>");
				var armorBreak = Math.random();
				var defeatBear = Math.random();
				if (hasStatus("dazed")) {
					defeatBear -= 0.1;
				}
				if (armorBreak < 0.25) {
					linesOfText.push("You try to dodge, but the bear is too fast!");
					linesOfText.push("With a mighty slash of its molten claws, the Lava Bear cleaves your armor off.");
					linesOfText.push("<i>Magma Armor removed from inventory.</i>");
					linesOfText.push("Without the magma armor, your skin bubbles and boils and your temperature rises until you ignite!");
					linesOfText.push("Within 5 seconds, you burn to death.");
					gameOver = true;
				}
				else {
					linesOfText.push("Despite the speed of the charging bear, you are able to barely evade its attack.");
					linesOfText.push("You turn to fight back!");
					if (defeatBear >= 0.3 && player["weapon"] != "fists") {
						linesOfText.push("With the aid of your cunning skills and mighty weapon, you defeat the Lava Bear!");
						player["statusEffects"].push("bearDefeated");
					}
					else if (defeatBear >= 0.6 && player["weapon"] == "fists") {
						linesOfText.push("With the aid of your cunning skills and powerful fists, you defeat the Lava Bear!");
						player["statusEffects"].push("bearDefeated");
					}
					else {
						linesOfText.push("Despite your assault, your attacks cannot pierce its thick, fiery hide.");
						linesOfText.push("The Lava Bear looks at you disdainfully and, considering you too weak to waste any more energy on, leaves you alone and walks past.");
						linesOfText.push("Disheartened, you continue through the cave.");
					}
				}
				break;

			case 6:
				if (gameOver) {
					removeItem("Magma Armor", "consumable");
				}
				break;

			case 7:
				if (hasStatus("bearDefeated")) {
					switchScene("With the help of a nearby sharp stone edge, you slice the sunfirery pelt off the fallen foe.");
					innerScene = "continueCave";
					continueCave();
				}
				break;

			case 8:
				if (!gameOver) {
					$("#screenImage").attr("src", "img/backgrounds/darkCave.png");
				}
				break;

			case 9:
				if (!gameOver) {
					switchScene("Later, after much walking in the darkness of the cave, you finally spot the exit!");
					innerScene = "continueCave";
					continueCave();
				}	
				else {
					switchScene();
					sceneDeath();
				}	
				break;
		}
	}

	function continueCave() {
		switch(lineNumber) {
			case 0:
				if (hasStatus("bearDefeated")) {
					linesOfText.push("<i>Sunfire Pelt added to inventory.</i>");
					linesOfText.push("You decide the best way to carry the sunfire pelt is to wear it as a cape, to help traverse the cave.");
					linesOfText.push("Continuing through the now lit cave, you spot a chest covered in soot!");
					linesOfText.push("You dust the soot off the chest and open it...");
					linesOfText.push("You got the Amulet of Resurrection!");
					linesOfText.push("<i>Amulet of Resurrection added to inventory.</i>");
					linesOfText.push("You equip the amulet and use the pelt to easily hike the remainder of the volcano.");
					linesOfText.push("Later, after much walking, you spot the exit!");
					linesOfText.push("You sprint to the outside and see the Palace in the distance!");
					linesOfText.push("You run to the Palace with your cape and armor on!");
				}
				else {
					linesOfText.push("You sprint to the outside and you are blinded by the sunlight.");
					linesOfText.push("Shielding your eyes, you see the Palace in the distance!");
					linesOfText.push("After letting your eyes adjust to the light, you begin running to the palace!");
				}
				break;

			case 1:
				if (hasStatus("bearDefeated")) {
					addItem("Sunfire Pelt", "item");
					$("#screenImage").attr("src", "img/backgrounds/litCave.png");
				}
				break;
			
			case 4:
				if (!hasStatus("bearDefeated")) {
					switchScene();
					scenePalace();
				}
				break;

			case 6:
				addItem("Amulet of Resurrection", "item");
				break;

			case 11:
				switchScene();
				scenePalace();
				break;
		}
	}
}

function scenePalace() {
	switch (innerScene){
		case "corruptedGuardFight":
			corruptedGuardFight();
			break;

		case "palaceContinue":
			palaceContinue();
			break;

		case "fightEvilWizard":
			fightEvilWizard();
			break;

		case "evilWizardFightsBack":
			evilWizardFightsBack();
			break;

		default:
			switch(lineNumber) {
				case 0:
					currentScene = "Palace";
					$("#screenImage").attr("src", "img/backgrounds/castleExt.jpg");
					linesOfText.push("You have finally reached the Palace.");
					linesOfText.push("You stand at the front gate and admire the grandeur of the building.");
					linesOfText.push("Inhaling a large breath of air, you shout at the Palace: \"My body, my body is ready!\"");
					linesOfText.push("All of a sudden, the gate opens and a man exits the Palace.");
					linesOfText.push("The man wears a purple uniform and is wielding a dark lance.");
					
					if (!hasStatus("pickpocketed")) {
						linesOfText.push("You ready your " + player["weapon"] + ".");
					}
					else {
						linesOfText.push("You move to draw your weapon, but it's missing!");
						linesOfText.push("Something must have happened to it on the bus.");
					}

					if (player["name"] == "Tristan" || player["name"] == "Tullagen") {
						linesOfText.push("The guard shouts, in a distored voice: \"HE GAVE ME THE PURPLE PIZZA! PRAISE THE EVIL WIZARD!\"");
					}
					else {
						linesOfText.push("The guard shouts, in a distored voice: \"ALL HAIL THE OVERMIND! GLORY TO THE EVIL WIZARD!\"");
					}
					linesOfText.push("With that, the corrupted guard charges you!");
					break;

				case 9:
					if (!hasStatus("pickpocketed")) {
						switchScene("<i>Fight!</i>");
						innerScene = "corruptedGuardFight";
						corruptedGuardFight();
					}
					break;

				case 10:
					switchScene("<i>Fight!</i>");
					innerScene = "corruptedGuardFight";
					corruptedGuardFight();
					break;
			}
			break;
	}

	function corruptedGuardFight() {
		switch(lineNumber) {
			case 0:
				var attackGuard = Math.random();
				if (hasStatus("surpriseAttack")) {
					attackGuard += 0.3;
					removeStatus("surpriseAttack");
				}
				if (hasStatus("Well Rested")) {
					attackGuard += 0.1;
					removeStatus("Well Rested");
				}
				if (attackGuard >= 0.4 && player["weapon"] != "fists") {
					linesOfText.push("Before the corrupted guard can land a blow, you defeat him with your weapon and skills.");
				}
				else if (attackGuard >= 0.6) {
					linesOfText.push("Before the corrupted guard can land a blow, you defeat him with nothing but your fists and skills.");
				}
				else {
					if (player["name"] == "Tristan" || player["name"] == "Tullagen") {
						if (hasItem("Magma Armor")) {
							linesOfText.push("The corrupt guard lets loose a guttural \"REEEEEEE\", pierces your armor, and impales you with his dark lance.");
						}
						else {
							linesOfText.push("The corrupt guard lets loose a guttural \"REEEEEEE\" and impales you with his dark lance.");
						}
					}
					else {
						if (hasItem("Magma Armor")) {
							linesOfText.push("The corrupt guard lets loose a guttural screech, pierces your armor, and impales you with his dark lance.");
						}
						else {
							linesOfText.push("The corrupt guard lets loose a guttural screech and impales you with his dark lance.");
						}
					}
					player["statusEffects"].push("fallen");
				}
				break;

			case 2:
				if (!hasStatus("fallen")) {
					if (player["name"] == "Tristan" || player["name"] == "Tullagen") {
						switchScene("The corrupted guard utters \"The pizza wasn't boneless...\" before slipping away.");
					}
					else {
						switchScene("The corrupted guard utters \"I'm sorry, Carissa...\" before slipping away.");
						
					}
					innerScene = "palaceContinue";
					palaceContinue();
				}
				else {
					if (hasItem("Amulet of Resurrection")) {
						switchScene("As your body limply falls to the ground, a blinding light emits from your chest.");
						innerScene = "corruptedGuardFight";
						eventResurrection();
					}
					else {
						gameOver = true;
						switchScene();
						sceneDeath();
					}
				}
				break;
		}
	}

	function palaceContinue() {
		switch(lineNumber) {
			case 0:
				if (player["weapon"] == "fists") {
					linesOfText.push("Looking down at the ground, you notice the guard's dark lance.");
					linesOfText.push("\"You've been good to me, fists, but it's time for a stronger weapon.\"");
					linesOfText.push("<i>Dark Lance added to inventory.</i>");
				}
				linesOfText.push("You step over the corpse of the poor guard and enter the Palace gate.");
				linesOfText.push("Inside the Palace, the walls are lined with dark banners.");
				linesOfText.push("You walk up the center stairway toward the top of the Palace.");
				linesOfText.push("You reach the throne room and notice a large keyhole with horns on the door.");
				linesOfText.push("Sighing, you look down and spot a large yellow horned key.");
				linesOfText.push("You scratch your head in confusion, pick up and insert the big key into the keyhole, and enter the throne room.");
				linesOfText.push("Inside, the Evil Wizard is sitting on the throne, reading. He looks up to you, jumps up, and sets down his book.");
				linesOfText.push("\"Ha ha ha. Man, what took you so long, " + player["name"] + "?\"");
				linesOfText.push("\"Well, let's hurry this up. I've got a triwizard tournament to attend in an hour.\"");
				break;

			case 2:
				if (player["weapon"] != "fists") {
					$("#screenImage").attr("src", "img/backgrounds/castleStair.png");
				}
				break;

			case 3:
				if (player["weapon"] == "fists") {
					addItem("Dark Lance", "item");
					player["weapon"] = "Dark Lance";
				}
				break;

			case 4:
				if (player["weapon"] != "Dark Lance") {
					$("#screenImage").attr("src", "img/backgrounds/throneDoor.png");
				}
				break;

			case 5:
				if (player["weapon"] == "Dark Lance") {
					$("#screenImage").attr("src", "img/backgrounds/castleStair.png");
				}
				break;

			case 7:
				if (player["weapon"] != "Dark Lance") {
					$("#screenImage").attr("src", "img/backgrounds/throne.png");
				}
				else {
					$("#screenImage").attr("src", "img/backgrounds/throneDoor.png");
				}
				break;
			
			case 10:
				if (player["weapon"] != "Dark Lance") {
					switchScene("<i>Fight!</i>");
					innerScene = "fightEvilWizard";
					fightEvilWizard();
				}
				else {
					$("#screenImage").attr("src", "img/backgrounds/throne.png");
				}
				break;

			case 13:
				switchScene("<i>Fight!</i>");
				innerScene = "fightEvilWizard";
				fightEvilWizard();
				break;
		}
	}

	function fightEvilWizard() {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You charge at the Evil Wizard with your " + player["weapon"] + " and attack!");
				var attackWizard = Math.random();
				if (hasStatus("surpriseAttack")) {
					attackWizard += 0.3;
					removeStatus("surpriseAttack");
				}
				if (hasStatus("withered")) {
					attackWizard -= 0.15;
				}

				if (attackWizard >= 0.3) {
					wizardHealth -= 1;
					if (wizardHealth == 2) {
						linesOfText.push("The Evil Wizard is knocked back by your attack with a grunt of pain.");
					}
					else if (wizardHealth == 1) {
						linesOfText.push("The Evil Wizard is knocked back far, barely standing this time.");
					}
					else {
						linesOfText.push("Your final attack knocks him into the wall, cracking it on impact. He collapses to the floor.");
						player["statusEffects"].push("wizardDefeated");
					}
				}
				else {
					linesOfText.push("The Evil Wizard shunpos away to a ward on the ground, dodging your attack.")
				}
				break;

			case 3:
				if (hasStatus("wizardDefeated")) {
					switchScene("You approach the Evil Wizard as he lays on the ground, bloodied and barely counscious.");
					sceneVictory();
				}
				else {
					switchScene("The Evil Wizard begins casting a spell.");
					innerScene = "evilWizardFightsBack";
					evilWizardFightsBack();
				}
				break;
		}
	}

	function evilWizardFightsBack() {
		switch(lineNumber) {
			case 0:
				var wizardSpell = Math.random();
				if (wizardSpell > 0.85) {
					linesOfText.push("The wizard conjures and draws back a magical bow. \"You belong in a museum!\"");
					linesOfText.push("A barrage of arcane energy launches from the bow in your direction.");
					var dodge = Math.random();
					if (hasStatus("withered")) {
						dodge -= 0.15;
					}

					if (dodge >= 0.4) {
						linesOfText.push("You tumble out of the way of the barrage and stand for another attack.");
					}
					else {
						linesOfText.push("The mystical shot of energy penetrates you, disintegrating your body.");
						player["statusEffects"].push("fallen");
					}
					wizardLinesOfText = 3;
				}
				else if (wizardSpell > 0.55 && !hasStatus("withered")) {
					linesOfText.push("\"The cycle of life and death continues. I will live, you will die.\"");
					linesOfText.push("A sandstorm emits from the hand of the Wizard, surrounding you and slowing your movements.");
					player["statusEffects"].push("withered");
					witherTimer = 3;
					wizardLinesOfText = 2;
				}
				else {
					linesOfText.push("\"I fight for a darker tomorrow.\"");
					linesOfText.push("The Evil Wizard fires an orb of electricity towards you, through an acceleration gate.");
					var dodge = Math.random();
					if (hasStatus("withered")) {
						dodge -= 0.15;
					}

					if (dodge >= 0.3) {
						linesOfText.push("You sidestep away from the incoming shot.");
						linesOfText.push("The wizard's rage is beyond his control.");
						wizardLinesOfText = 4;
					}
					else {
						linesOfText.push("The shocking blast explodes on contact with you.");
						if (hasItem("Magma Armor")) {
							linesOfText.push("Your magma armor crumbles as it absorbs the blow.");
							linesOfText.push("<i>Magma Armor removed from inventory.</i>");
							player["statusEffects"].push("crumbledArmor");
						}
						else {
							playerHealth -= 1;
							if (playerHealth == 1) {
								linesOfText.push("You're knocked back, but still standing as electricity courses through you.");
								linesOfText.push("You clutch your throbbing head, doubtful that you could take another blast.");
							}
							else {
								linesOfText.push("You've lost your resistance and you fall to the ground.");
								linesOfText.push("The electricity is too much to handle, as it turns your body into ash.");
								player["statusEffects"].push("fallen");
							}
						}
						linesOfText.push("\"My enemies shall <i>fall!</i>\"");
						wizardLinesOfText = 6;
					}
				}

				break;

			case 1:
				if (hasStatus("withered")) {
					witherTimer -= 1;
					if (witherTimer == 0) {
						linesOfText.push("The sandstorm has dissipated, allowing you full movement again.");
						removeStatus("withered");
						wizardLinesOfText += 1;
					}
				}
				break;

			default:
				if (hasStatus("crumbledArmor") && lineNumber == wizardLinesOfText - 1) {
					removeItem("Magma Armor", "consumable");
					removeStatus("crumbledArmor");
				}
				else if (lineNumber == wizardLinesOfText + 1) {
					if (hasStatus("fallen")) {
						if (hasItem("Amulet of Resurrection")) {
							if (playerHealth == 0) {
								playerHealth += 1;
							}
							switchScene("As your remains lie on the ground, a blinding light emits from the ashes, reforming your figure.");
							innerScene = "fightEvilWizard";
							eventResurrection();
						}
						else {
							gameOver = true;
							switchScene();
							sceneDeath();
						}
					}
					else {
						switchScene("You draw back and ready another assault.");
						innerScene = "fightEvilWizard";
						fightEvilWizard();
					}
				}
				break;
		}
	}
}

function eventResurrection() {
	switch(lineNumber) {
		case 0:
			currentScene = "Resurrection";
			linesOfText.push("The light envelopes your body and levitates you back up to your feet.");
			linesOfText.push("The light dissipates and the Amulet of Resurrection breaks in your hand.");
			linesOfText.push("<i>Amulet of Resurrection removed from inventory.</i>");
			break;

		case 3:
			removeItem("Amulet of Resurrection", "consumable");
			removeStatus("fallen");
			player["statusEffects"].push("surpriseAttack");
			break;

		case 4:
			var currentFight = innerScene;
			switchScene("With renewed energy, you charge at your surprised attacker.");
			innerScene = currentFight;
			currentScene = "Palace";
			scenePalace();
			break;
	}
}

function sceneDeath() {
	switch(lineNumber) {
		case 0:
			currentScene = "Death";
			$("#screenImage").attr("src", "img/backgrounds/castleExtRed.jpg");
			getNativeSize();
			linesOfText.push("Try again?");
			break;

		case 1:
			$("#button0").html("Restart");
			mode = "Input";
			break;
	}
}

function sceneVictory() {
	switch (innerScene){
		case "killWizard":
			killWizard();
			break;

		case "spareWizard":
			spareWizard();
			break;

		case "postChoice":
			postChoice();
			break;

		default:
			switch(lineNumber) {
				case 0:
					currentScene = "Victory";
					linesOfText.push("You look down into the eyes of the downed Evil Wizard. What do you do now?");
					break;

				case 1:
					if (mode == "Dialogue") {
						$("#button0").html("Kill him");
						newButton("Spare him");
						mode = "Input";
					}
					else if (mode == "Input") {
						$("#button0").html("Continue");
						$("#optionsBox #option1").remove();
						mode = "Dialogue";
						switchScene();
						if (inputAction == "Kill") {
							innerScene = "killWizard"; 
							killWizard();
						}
						else{
							innerScene = "spareWizard";
							spareWizard();
						}	
					}
					break;
			}
	}

	function killWizard() {
		switch(lineNumber) {
			case 0:
				if (player["weapon"] == "Crossbow and Quiver") {
					linesOfText.push("You nock one last arrow, take aim, and fire it through his skull, ending his reign.");
				}
				else if (player["weapon"] == "Dagger") {
					linesOfText.push("You slowly walk behind him and stab the dagger in his back, ending his reign.");
				}
				else if (player["weapon"] == "Iron Gauntlets") {
					linesOfText.push("You bring back your fisted guantlet before driving it and his skull into the ground, ending his reign.");
				}
				else if (player["weapon"] == "Spinning Axe") {
					linesOfText.push("You whirl around the axe and step back before laughing and throwing the spinning axe and lodging it in his skull, ending his reign.");
				}
				else if (player["weapon"] == "Magical Staff") {
					linesOfText.push("You blast the Evil Wizard with a fireball from your magical staff, ending his reign.");
				}
				else if (player["weapon"] == "Sword") {
					linesOfText.push("You drive your sword through his chest, ending his reign.");
				}
				else if (player["weapon"] == "Axe") {
					linesOfText.push("With a swing of your axe, you slice the Evil Wizard's head off, ending his reign.");
				}
				else  {
					linesOfText.push("You step back to get a running start before charging at and impaling the Evil Wizard with your lance, ending his reign.");
				}
				linesOfText.push("You exit the palace, leaving the remains of the Evil Wizard.");
				linesOfText.push("Outside, several guards see you. Some rush to you.");
				linesOfText.push("You explain to the guards what happened and they nod in understanding.");
				if (playerHealth == 1) {
					linesOfText.push("A guard tends to your wounds, while others enter the palace to investigate.");
				}
				else {
					linesOfText.push("Multiple guards leave to enter the palace and investigate.");
				}
				linesOfText.push("You smile, proud that you defeated the Evil Wizard and saved the world.");
				break;

			case 3:
				$("#screenImage").attr("src", "img/backgrounds/castleExt.jpg");
				break;

			case 7:
				switchScene("Just then, the mail man from earlier appears over the horizon and runs up to you.");
				innerScene = "postChoice";
				postChoice();
				break;
		}
	}

	function spareWizard() {
		switch(lineNumber) {
			case 0:
				linesOfText.push("You lay down your weapon.");
				linesOfText.push("\"...why are you showing me mercy?\"");
				linesOfText.push("\"I took over this kingdom. I tried to kill you.\"");
				linesOfText.push("You tell him that you have faith in him, that he can change.");
				linesOfText.push("That, if he promises to seek atonement for his actions, that he can live.");
				linesOfText.push("\"It's not worth taking any more lives,\" you say to him.");
				linesOfText.push("The wizard looks away at the ground, in silence.");
				linesOfText.push("Finally, the wizard speaks: \"I can't believe you've done this.\"");
				linesOfText.push("\"...I'll try. I'll try to make up for what I've done.\"");
				linesOfText.push("Proud, you offer your hand to the wizard.");
				linesOfText.push("He looks at your hand and takes it as he stands up.");
				linesOfText.push("The wizard stares at you, searching your face for signs of deception.");
				linesOfText.push("You close your eyes and smile at him. He smiles back.");
				linesOfText.push("Together, the two of you walk out of the palace.");
				linesOfText.push("Outside, several guards see you. Some rush to you and the wizard.");
				linesOfText.push("You explain to the guards what happened and they nod in understanding, looking at the wizard.");
				if (playerHealth == 1) {
					linesOfText.push("Two guards tend to the wounds of you and the wizard, while others enter the palace to investigate.");
				}
				else {
					linesOfText.push("A guard tends to the wounds of the wizard, while others enter the palace to investigate.");
				}
				linesOfText.push("You smile, happy about the outcome of this adventure.");
				break;

			case 15:
				$("#screenImage").attr("src", "img/backgrounds/castleExt.jpg");
				break;

			case 19:
				switchScene("As you stand there, the mail man from earlier appears over the horizon and runs up to you.");
				innerScene = "postChoice";
				postChoice();
				break;

		}
	}

	function postChoice() {
		switch(lineNumber) {
			case 0:
				linesOfText.push("\"I thought you were " + player["name"] + "! Excellent, I have this letter for you then!\"");
				linesOfText.push("He hands you a letter. You look down at it, then back up at the mail man.");
				linesOfText.push("He has already run off in the opposite direction. Well, a mail man's job is never done.");
				linesOfText.push("You open the letter...");
				linesOfText.push("...");
				linesOfText.push("<i>Thank you so much for playing my game!</i>");
				linesOfText.push("Would you like to play again?");
				break;

			case 7:
				$("#button0").html("Play again");
				mode = "Input";
				break;
		}
	}
}