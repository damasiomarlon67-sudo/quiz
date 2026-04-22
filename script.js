const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

let questions = [];
let currentQuestion = 0;
let score = 0;
let difficulty = "easy";

function startQuiz() {
    difficulty = document.getElementById("difficulty").value;
    document.getElementById("start-screen").style.display = "none";
    questionEl.style.display = "block";
    fetchQuestions();
}

