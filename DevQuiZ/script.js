const questions = [
    {
        question: "Which keyword creates a block-scoped variable?",
        answers: [
            { text: "var", correct: false },
            { text: "let", correct: true },
            { text: "define", correct: false },
            { text: "constantly", correct: false }
        ]
    },
    {
        question: "Which method converts JSON into JavaScript objects?",
        answers: [
            { text: "JSON.parse()", correct: true },
            { text: "JSON.stringify()", correct: false },
            { text: "JSON.object()", correct: false },
            { text: "JSON.convert()", correct: false }
        ]
    },
    {
        question: "What does DOM stand for?",
        answers: [
            { text: "Document Object Model", correct: true },
            { text: "Data Object Method", correct: false },
            { text: "Document Order Method", correct: false },
            { text: "Display Object Management", correct: false }
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score");

let currentQuestionIndex = 0;
let score = 0;

startQuiz();

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex];

    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");

        button.innerText = answer.text;

        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        button.addEventListener("click", selectAnswer);

        answerButtons.appendChild(button);
    });
}

function resetState() {
    nextButton.style.display = "none";

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;

    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        score++;
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else {
            button.classList.add("wrong");
        }

        button.disabled = true;
    });

    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        questionElement.innerText = "Quiz Completed!";

        answerButtons.innerHTML = "";

        nextButton.style.display = "none";

        scoreDisplay.innerText =
            `Your Score: ${score} / ${questions.length}`;
    }
});
