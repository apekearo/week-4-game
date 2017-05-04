// var characterArray = [];

// characterArray.push({
// 	name:"Obama",
// 	health:300,
// 	attack:25,
// 	counter:20,
// 	picture:"http://www.",
// 	//0 is standby, 1 attacking, 2 is countering
// 	//no comma on the last object parameter
// 	status:0
// });
// characterArray.push({
// 	name:"Trump",
// 	health:230,
// 	attack:33,
// 	counter:21,
// 	picture:"../assets/picture.png",
// 	status:2
// });
// characterArray.push({
// 	name:"Clinton",
// 	health:300,
// 	attack:25,
// 	counter:20,
// 	status:1
// });

// $(document).ready(function(){
// 	setUp();

// });
// function setUp(){
// 	$("#standby").html("// write out html")
// };


var characters = {};


characters.Obama ={
	name:'Obama',
 health:300,
 attack:37,	
 counter:20,
 picture:"assets/images/obamaGolf.jpeg",
 //0 is standby, 1 attacking, 2 is countering
 //no comma on the last object parameter
 status:0
};
characters.Trump ={
	name: 'Trump',
 health:230,
 attack:33,
 counter:21,
 picture:"assets/images/trumpGolf.jpeg",
 status:0
};
characters.Clinton ={
	name:'Clinton',
 health:300,
 attack:25,
 counter:20,
 picture:"assets/images/clintonGolf.jpeg",
 status:0
};

 var clickNum = 0;
 var char1;
 var char2;
 var characterName;

$(document).ready(function(){
 setUp();
 //set up event listeners here
 //onclick function: recognize which character you clicked, and call moveCharacter("Trump",2);

 // event delegation: Instead of putting event listeners on items that will be created later,
 // put event listeners on the parent element which won't change. Event listeners on the three divs that hold those pictures


/*<div id="standby"> //parent. <--- event listeners go on this
	//<item2></item2> //child <--- not on this, because it doesn't exist on page load
	//<item3></item3> //child
</div> */

});

function setUp(){
	var obamaHealth = $("<p class='Obama' id='Obama'>ObamaHealth " + characters.Obama.health + "</p>");
	var obamaGolf= $("<img name='Obama' class='clickable Obama' src=" + characters.Obama.picture + ">");
	var trumpHealth = $("<p class='Trump' id='Trump'>TrumpHealth " + characters.Trump.health + "</p>");
	var trumpGolf= $("<img name='Trump' class='clickable Trump' src=" + characters.Trump.picture + ">");
	var clintonHealth = $("<p class='Clinton' id='Clinton'>ClintonHealth " + characters.Clinton.health + "</p>");
	var clintonGolf= $("<img name='Clinton' class='clickable Clinton' src=" + characters.Clinton.picture + ">");
	$("#standby").append([obamaHealth, obamaGolf, trumpHealth, trumpGolf, clintonHealth, clintonGolf]);

	$(".clickable").on('click', function() {
		moveCharacter($(this).attr('name'));
	});
	var attackButton= $("<input type='button' id='attack' value='Attack!!!!'>");
	attackButton.on('click', function(){
		attack(char1, char2);
		
	});
	$("#active").append(attackButton);
	
 // $("#standby").html(characters.health + "Health" + characters.picture) //loop through characterArray, create images with src= picture URL
 // give each of those created images an ID to match character name
};



function moveCharacter(characterName) {

	console.log(characterName, characters[characterName].status)
	clickNum += 1;
    var destination;

	if(clickNum === 1) {
		char1 = characters[characterName];
		characters[characterName].status = 1;
		destination = 'fighting';

	}else if (clickNum === 2) {
		char2 = characters[characterName];
		characters[characterName].status = 2;
		clickNum = 0;
		destination = 'defending';
	}
	movehtml(characterName, destination);
	// $("#active").after(char1);
	// $("#defending").after(char2);
	console.log(characters[characterName].status)
	//find and remove that picture from one Div
	//put it in the other one
	//set 'status' to appropriate code
	
	// $("#defending").html(""); //fill in with image from Trump <img src=""> //
}
function movehtml(characterName, destination){
	$('.' + characterName).appendTo('#' + destination)
}

// attack(characters.Trump, characters.Clinton); inside event
// displayStatus();

// cahr1 and char2 are objects  for example obama or trump

function attack(char1, char2) {
	char2.health -= char1.attack;
	char1.health -= char2.attack;
	console.log(char2.health, char1.health);

	if(char2.health > 0){

		char1.attack+=6;
	}
	else{
		char2.status = 0;
		char1.status = 0;
		var imgs = $(".clickable");
		for(var i = 0; i < imgs.length; i++){
			var img = imgs[i];
			if($(img).attr('name') == char2.name){

				$(img).replaceWith( "<h2>He's Outta The Game!</h2>" );

			}
		};
		
	}

	$('#' + char1.name).text(char1.name +"Health"+char1.health);
	$('#' + char2.name).text(char2.name+"Health"+char2.health);
	// if char2 health is greater than 0	char1.health -= char2.counter
	// else		//handle what the game does when character dies
	// add something to char1.attack+=6
	// char1.attack+=6 is the same thing as char1.attack = char1.attack+6
}
function counter(char2, char1) {

	char1.health -= char2.counter;
	if(char1.health > 0) {
		char2.counter+=2;
	// var trumpGolf= $("<p='Trump' class='clickable' src=" + characters.Trump.picture + ">")
	// var obamaGolf= $("<p='Obama' class='clickable' src=" + characters.Obama.picture + ">")
	// var clintonGolf= $("<p='Clinton' class='clickable' src=" + characters.Clinton.picture + ">")


	}
	else{
		char1.status=0;
		char2.status=0;
		var imgs = $(".clickable");
		for(var i=0; i < imgs.length; i++){
			var img = imgs[i];
			if($(img).attr('name') == char1.name){
				$(img).replaceWith("<h2>He's Outta The Game!</h2>");
			}
		};
	}
}
function display() {
	// some HTML item shows Obama's health to user
	// update it with the current numbers in your object
	// <span id="ObamaHealth">300</span>
	// $('span#ObamaHealth').text(characters.Obama.health)
}