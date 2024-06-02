/*nicht funktional:
von chatgpt und youtube tutorial: */

const headers = new Headers();
const username = "test@gmail.com";
const password = "secret";
headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));

const choicesElem = document.getElementById("choices");
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");

async function sendGetRequest(currentQuestionNumber){
    //currentQuestionNumber = 4;
    const data = await fetch('https://idefix.informatik.htw-dresden.de:8888/api/quizzes?page='+currentQuestionNumber, {
    method: 'GET',
    headers: headers,
    });
        const dataJSON = await data.json();
        return dataJSON;
};

async function sendPostRequest(numberAnswer, currentQuestionNumber){
    headers.set("Content-Type", "application/json");
    const data = await fetch('https://idefix.informatik.htw-dresden.de:8888/api/quizzes/2/solve', {
        method: 'POST',
        headers: headers,
        body: "["+numberAnswer+"]"
    });
        const dataJSON = await data.json();
        return dataJSON;
        
};

startGame = () => {
    getNewQuestion(currentQuestionNumber);

};


//console.log(choices);
const MAX_QUESTIONS = 30;
const CORRECT_BONUS = 10;
let currentQuestionNumber = 2;
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
/*
startGame = () => {
    getNewQuestion();
};*/

async function getNewQuestion(currentQuestionNumber){
    const questionData = await sendGetRequest(currentQuestionNumber);
    acceptingAnswers = true;
    const questionElem = document.getElementById("question");
    console.log(questionData);
    questionElem.textContent = questionData.text;
    console.log("currentQuestionNumber: " + currentQuestionNumber);
    //const choicesElem = document.getElementById("choices");
    console.log(questionData.options[1]);
    const children = choicesElem.children;
    for(var i=0; i<children.length; i++){
        const choice = children[i];
        console.log(choice);
        const choiceText = choice.querySelector(".choice-text");
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
        choiceText.textContent = questionData.options[i];
    }
        /*const number = choice.dataset["number"];
        choice.innerText = currentQuestion[questionData.options[1] + number];*/
};

async function postNewAnswer(numberAnswer, currentQuestionNumber){
    const response = await sendPostRequest(numberAnswer, currentQuestionNumber);
    console.log("Response: ")
    console.log(response.success);
    if(response.success == true){
        console.log("This is true ngl");
        incrementScore(CORRECT_BONUS);
        return true;
    }else{
        console.log("This is false ngl");
        return false; 
    }
};

const children = choicesElem.children;
for(var i = 0; i<children.length; i++){
    choicesElem.addEventListener("click", async e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        //console.log(selectedAnswer /* currentQuestion.answer*/);

        const response = await postNewAnswer(selectedAnswer, currentQuestionNumber);
        console.log("new response: ");
        console.log(response);
        const classToApply = response == true ? "correct" : "incorrect";
        console.log("classToApply: " + classToApply);

        selectedChoice.parentElement.classList.add(classToApply);
        
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            currentQuestionNumber++;
            questionCounter++;
            getNewQuestion(currentQuestionNumber);
        }, 300);
    });
};


document.addEventListener("DOMContentLoaded", function(){
//getNewQuestion();
startGame();
},false);

incrementScore = num => {
    score+=num;
    scoreText.innerText = score;
};



/*async function sendGetRequest(){
await fetch('https://irene.informatik.htw-dresden.de:8888/api/quizzes/2', {
    method: 'GET',
    headers: headers,
})
.then(data => console.log(data.json()))
.catch(error => console.log('ERROR'));
};


async function sendPostRequest(){
headers.set("Content-Type", "application/json");
await fetch('https://irene.informatik.htw-dresden.de:8888/api/quizzes/2/solve', {
    method: 'POST',
    headers: headers,
    body: "[1]"
})
    .then(data => console.log(data.json()))
    .catch(error => console.log('ERROR'));
};

sendGetRequest();
sendPostRequest();*/
