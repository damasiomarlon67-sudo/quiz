
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

let questions = [];
let currentQuestion = 0;
let score = 0;
let difficulty = "easy";
let amount = 10;

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

const fetchTradutor = async (texto) => {
    try {
        const url = `https://clients5.google.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(texto)}`;

        const response = await fetch(url);
        const data = await response.json();

        return data[0].map(item => item[0]).join('');

    } catch (e) {
        console.warn("Erro na tradução:", e.message);
        return texto; // fallback
    }
};

function startQuiz() {
    difficulty = document.getElementById("difficulty").value;
    amount = document.getElementById("amount").value;

    document.getElementById("start-screen").style.display = "none";
    questionEl.style.display = "block";

    fetchQuestions();
}

async function fetchQuestions() {
    questionEl.innerText = "Carregando perguntas...";

    const response = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=18&type=multiple&difficulty=${difficulty}`
);

    const data = await response.json();

    questionEl.innerText = "Traduzindo...";

    questions = await Promise.all(
        data.results.map(async (q) => {

            const textos = [
                decodeHTML(q.question),
                decodeHTML(q.correct_answer),
                ...q.incorrect_answers.map(decodeHTML)
            ];

            // 🔥 traduz tudo de uma vez (muito mais rápido)
            const traduzido = await fetchTradutor(textos.join("|||"));
            const partes = traduzido.split("|||");

            return {
                question: partes[0] || textos[0],
                correct_answer: partes[1] || textos[1],
                incorrect_answers: partes.slice(2) || textos.slice(2)
            };
        })
    );

    currentQuestion = 0;
    score = 0;

    showQuestion();
}

function showQuestion() {
    resetState();

    let q = questions[currentQuestion];
    questionEl.innerText = q.question;

    let answers = [...q.incorrect_answers];
    answers.push(q.correct_answer);

    // embaralhar respostas
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.innerText = answer;
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

        if (button.innerText === correct) {
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

function showScore() {
    resetState();

    questionEl.innerText = "Quiz finalizado!";
    scoreEl.innerText =
        `Dificuldade: ${difficulty.toUpperCase()} | Acertos: ${score}/${questions.length}`;

    nextBtn.innerText = "Reiniciar";
    nextBtn.style.display = "block";
    nextBtn.onclick = () => location.reload();
}