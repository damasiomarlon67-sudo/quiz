
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");

let questions = [];
let currentQuestion = 0;
let score = 0;
let difficulty = "easy";

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

async function translateText(text) {
    try {
        const response = await fetch("https://libretranslate.de/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                q: text,
                source: "en",
                target: "pt",
                format: "text"
            })
        });

        const data = await response.json();
        return data.translatedText;

    } catch (error) {
        console.error("Erro na tradução:", error);
        return text; // fallback (caso falhe)
    }
}

function startQuiz() {
    difficulty = document.getElementById("difficulty").value;
    document.getElementById("start-screen").style.display = "none";
    questionEl.style.display = "block";
    fetchQuestions();
}

async function fetchQuestions() {
    questionEl.innerText = "Carregando e traduzindo perguntas...";
    
    const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=18&type=multiple&difficulty=${difficulty}`
    );
    const data = await response.json();

    questions = await Promise.all(
        data.results.map(async (q) => {

            const translatedQuestion = await translateText(decodeHTML(q.question));
            const translatedCorrect = await translateText(decodeHTML(q.correct_answer));

            const translatedIncorrect = await Promise.all(
                q.incorrect_answers.map(ans =>
                    translateText(decodeHTML(ans))
                )
            );

            return {
                question: translatedQuestion,
                correct_answer: translatedCorrect,
                incorrect_answers: translatedIncorrect
            };
        })
    );

    showQuestion();
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

function showScore() {
    resetState();
    questionEl.innerText = "Quiz finalizado!";
    scoreEl.innerText = `Dificuldade: ${difficulty.toUpperCase()} | Acertos: ${score}/${questions.length}`;
    nextBtn.innerText = "Reiniciar";
    nextBtn.style.display = "block";
    nextBtn.onclick = () => location.reload();
}