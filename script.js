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

function showQuestion() {
    resetState();
    let q = questions[currentQuestion];

    questionEl.innerText = decodeHTML(q.question);

    let answers = [...q.incorrect_answers];
    answers.push(q.correct_answer);
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.innerText = decodeHTML(answer);
        btn.onclick = () => selectAnswer(answer, q.correct_answer);
        answersEl.appendChild(btn);
    });
}    

function resetState() {
    nextBtn.style.display = "none";
    answersEl.innerHTML = "";
}

function selectAnswer(selected, correct) {
    if (selected === correct) score++;

    Array.from(answersEl.children).forEach(button => {
        button.disabled = true;
        if (button.innerText === decodeHTML(correct)) {
            button.style.backgroundColor = "green";
        } else {
            button.style.backgroundColor = "red";
        }
    });

    nextBtn.style.display = "block";
}

nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
};