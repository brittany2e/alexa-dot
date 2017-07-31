'use strict';
var Alexa = require('alexa-sdk');

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.  
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID;

var SKILL_NAME = "Space Facts";
var GET_FACT_MESSAGE = "Here's a fun fact: ";
var HELP_MESSAGE = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
var HELLO_MESSAGE = 'I didn\'t understand that. Are you sure you guessed a number?';
var HELP_PROMPT = "What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

var randomNumber = -1;
var numberOfTries = 5;
var gameIsOver = false;

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
var data = [
    "A year on Mercury is just 88 days long.",
    "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
    "Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.",
    "On Mars, the Sun appears about half the size as it does on Earth.",
    "Earth is the only planet not named after a god.",
    "Jupiter has the shortest day of all the planets.",
    "The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.",
    "The Sun contains 99.86% of the mass in the Solar System.",
    "The Sun is an almost perfect sphere.",
    "A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.",
    "Saturn radiates two and a half times more energy into space than it receives from the sun.",
    "The temperature inside the Sun can reach 15 million degrees Celsius.",
    "The Moon is moving approximately 3.8 cm away from our planet every year."
];

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        var factArr = data;
        var factIndex = Math.floor(Math.random() * factArr.length);
        var randomFact = factArr[factIndex];
        var speechOutput = GET_FACT_MESSAGE + randomFact;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomFact)
    },
    'Unhandled': function () {
        this.emit(':ask', "Sorry I did not understand that.");
    },
    'StartGuessingGame': function () {
        randomNumber = Math.round(Math.random() * 100);
        var message = 'Ok. Pick a number 1 through 100.';
        numberOfTries = 5;
        gameIsOver = false;
        this.emit(':tell', message);
    },
    'NumberGuessingGame': function () {
        
        if (gameIsOver === true) {
            this.emit(':tell', "The game is over. Say \"let's play a game\" to start over");
        }
        
        var numberSlot = this.event.request.intent.slots.guess;
        var guessNumber;
        var message = '';
        var guessResponse = 'I didn\'t understand that. Are you sure you guessed a number?';
        if (numberSlot && numberSlot.value) {
            guessNumber = numberSlot.value;
            guessResponse = "You guessed the number " + guessNumber + ". ";
        }
        
        // Compare the guess to the secret number and give the player a hint.
        if (guessNumber > randomNumber) {
            numberOfTries = numberOfTries - 1;
            message = "Incorrect! Try something lower. You have " + numberOfTries + " turns left.";
        }
        else if (guessNumber < randomNumber) {
            numberOfTries = numberOfTries - 1;
            message = "Wrong! Try something higher. You have " + numberOfTries + " turns left.";
        }
        else if (guessNumber == randomNumber) {
            message = "Ding ding ding. You found the number! :)";
            gameIsOver = true;
        }

        if (numberOfTries === 0) {
            gameIsOver = true;
            message =  "You are out of turns. The game is over. The correct number was " + randomNumber + ". Say let's play a game to start over.";
        }
        
        var response = guessResponse + message;
        this.emit(':tell', response);
    },
    'Testing': function () {
        this.emit(':tell', HELLO_MESSAGE);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};
