const headers = new Headers();
const username = "test@gmail.com";
const password = "secret";
headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));

const choicesElem = document.getElementById("choices");
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");

async function sendPostRequest(numberAnswer, currentQuestionNumber) {
    headers.set("Content-Type", "application/json");
    try {
        const response = await fetch("https://idefix.informatik.htw-dresden.de:8888/api/quizzes/" + currentQuestionNumber + "/solve", {
            method: 'POST',
            headers: headers,
            body: "[" + numberAnswer + "]"
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const dataJSON = await response.json();
        return dataJSON;
    } catch (error) {
        console.error("Error in sendPostRequest:", error);
        return null;  // Return null if there was an error
    }
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
async function getNewQuestion(currentQuestionNumber) {
    try {
        const questionData = await sendGetRequest(currentQuestionNumber);
        console.log("Received question data:", questionData);

        // Checking the validity of the question data structure
        if (!questionData || !questionData.content || questionData.content.length === 0) {
            console.error("Question data is empty or not structured correctly:", questionData);
            throw new Error("Invalid question data structure");
        }

        const question = questionData.content[0];  // Accessing the first question
        if (!question) {
            console.error("No question available at index 0");
            throw new Error("Question data is undefined");
        }

        // Check if options exist and are in an array format
        if (!question.options || !Array.isArray(question.options)) {
            console.error("Options are not defined or not an array:", question.options);
            throw new Error("Options not found or invalid");
        }

        acceptingAnswers = true;
        const questionElem = document.getElementById("question");
        questionElem.textContent = question.text;

        const choicesElem = document.getElementById("choices");
        const children = choicesElem.children;
        progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

        for (var i = 0; i < children.length; i++) {
            const choice = children[i];
            const choiceText = choice.querySelector(".choice-text");
            if (i < question.options.length) {
                choiceText.textContent = question.options[i];
            } else {
                choiceText.textContent = ""; // Handle case where there are fewer options than expected
            }
        }
    } catch (error) {
        console.error("Error fetching new question:", error);
    }
};


async function sendGetRequest(currentQuestionNumber) {
    try {
        const response = await fetch('https://idefix.informatik.htw-dresden.de:8888/api/quizzes?page=' + currentQuestionNumber, {
            method: 'GET',
            headers: headers,
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const dataJSON = await response.json();
        return dataJSON;
    } catch (error) {
        console.error("Error in sendGetRequest:", error);
        return null;  // Return null if there was an error
    }
};


startGame = () => {
    getNewQuestion(currentQuestionNumber);

};

async function postNewAnswer(numberAnswer, currentQuestionNumber) {
    const response = await sendPostRequest(numberAnswer, currentQuestionNumber);
    console.log("Response: ")
    console.log(response.success);
    if (response.success == true) {
        console.log("This is true ngl");
        incrementScore(CORRECT_BONUS);
        return true;
    } else {
        console.log("This is false ngl");
        return false;
    }
};

const choiceContainers = document.querySelectorAll(".choice-container");
choiceContainers.forEach((container, index) => {
    container.addEventListener("click", async e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.currentTarget; // Current target to ensure we get the container
        const selectedAnswer = selectedChoice.querySelector(".choice-text").dataset.number;

        // Assuming `postNewAnswer` processes the choice correctly
        const response = await postNewAnswer(selectedAnswer, currentQuestionNumber);
        const classToApply = response ? "correct" : "incorrect";

        selectedChoice.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.classList.remove(classToApply);
            currentQuestionNumber++;
            questionCounter++;
            getNewQuestion(currentQuestionNumber);
        }, 1000); // Giving some time to show feedback
    });
});


document.addEventListener("DOMContentLoaded", function () {
    //getNewQuestion();
    startGame();
}, false);

incrementScore = num => {
    score += num;
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