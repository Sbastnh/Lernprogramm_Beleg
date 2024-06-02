//console.log("Hello world")
/*have a look into snippets for shortcuts */
const question =  document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");

console.log(choices);

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [
    {
        question: "x^{3} = 8",
        choice1: "1",
        choice2: "2",
        choice3: "3",
        choice4: "4",
        answer: 2,
    },
    {
        question: "x^{4} = 256",
        choice1: "4",
        choice2: "3",
        choice3: "5",
        choice4: "6",
        answer: 1,
    },
    {
        question: " \\int_{1}^2(2x+4)\\,dx",
        choice1: "7",
        choice2: "6",
        choice3: "13",
        choice4: "5",
        answer: 2,
    },
    {
        question: "5 * 10^{-2} =",
        choice1: "0,05",
        choice2: "0,5",
        choice3: "0,005",
        choice4: "500",
        answer: 1,
    },
    {
        question: "5(x-3)=-10",
        choice1: "-2",
        choice2: "-5",
        choice3: "3",
        choice4: "4",
        answer: 1,
    },
    {
        question: "\\text{Der Radius eines Kreises}\\\\ \\text{betraegt 10 cm.}\\\\ \\text{Wie gross ist sein Umfang?}",
        choice1: "62,8 cm",
        choice2: "31,4 cm",
        choice3: "102,6 cm",
        choice4: "188,4 cm",
        answer: 1,
    },
    {
        question: "\\text{Berechnen Sie den Grenzwert}\\\\ \\\\ \\lim\\limits_{x\\to\\infty } ({8x+3 \\over 2x+6})",
        choice1: "4",
        choice2: "4",
        choice3: "8",
        choice4: "2",
        answer: 1,
    },
    {
        question: "\\text{Berechnen Sie den Grenzwert}\\\\ \\\\ \\lim\\limits_{x\\to\\infty } ({4x^2+5 \\over 2x+4})",
        choice1: "1",
        choice2: "2",
        choice3: "4",
        choice4: "unbekannt",
        answer: 3,
    },
    {
        question: "\\text{Wie hoch ist die Zinsen,} \\\\ \\text{wenn du bei einem Zinssatz} \\\\ \\text{ von 1,5\\% im Jahr, Sparguthaben in Hoehe} \\\\ \\text{von 3000  erhaeltst?}",
        choice1: "45",
        choice2: "30",
        choice3: "150",
        choice4: "75",
        answer: 1,
    } ]
//constants for bar etc.
const CORRECT_BONUS = 10; //how much points per questions
const MAX_QUESTIONS = 3;  //how many questions can get answered by the user

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];//spread operator for a full copy
    console.log(availableQuestions);
    getNewQuestion();

};

function getNewQuestion() {
    if (availableQuestions.length ==0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        //go to the end page
        console.log("Go to end page")
        return window.location.assign("/pages/end.html");
    }
    questionCounter++;
    progressText.innerText = "Question: " + questionCounter + "/" + MAX_QUESTIONS;
    //Updating the bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`; //here you go into the styles and can edit the css file, cool

    const questionIndex = Math.floor(Math.random()*availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    //question.innerText = currentQuestion.question;

    //question.innerText = currentQuestion.question

    choices.forEach( choice =>{
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;

};

choices.forEach(choice => {
    choice.addEventListener("click", e => {

        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        console.log(selectedAnswer == currentQuestion.answer);

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if(classToApply == "correct"){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            if (availableQuestions.length ==0 || questionCounter >= MAX_QUESTIONS){
                localStorage.setItem("mostRecentScore", score);
                //go to the end page
                console.log("Go to end page")
                return window.location.assign("/pages/end.html");
            }
            questionCounter++;
            progressText.innerText = "Question: " + questionCounter + "/" + MAX_QUESTIONS;
            //Updating the bar
            progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`; //here you go into the styles and can edit the css file, cool
        
            const questionIndex = Math.floor(Math.random()*availableQuestions.length);
            currentQuestion = availableQuestions[questionIndex];
            //question.innerText = currentQuestion.question;
            katex.render(currentQuestion.question, question, {
                throwOnError:false
            });
            //question.innerText = currentQuestion.question
        
            choices.forEach( choice =>{
                const number = choice.dataset["number"];
                choice.innerText = currentQuestion["choice" + number];
            });
            availableQuestions.splice(questionIndex, 1);
            acceptingAnswers = true;
        }, 300);
        
    });
});

incrementScore = num => {
    score+=num;
    scoreText.innerText = score;
};

startGame();

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

  // Formel in Element boo schreiben  
katex.render(currentQuestion.question, question, {
    throwOnError:false
});

});