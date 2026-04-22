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

async function fetchQuestions() {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=18&type=multiple&difficulty=${difficulty}`);
    const data = await response.json();
    questions = data.results;
    showQuestion();
}

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}