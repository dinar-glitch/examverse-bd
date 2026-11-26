// =================================
// EXAMVERSE BD - JAVASCRIPT
// =================================

let questions = [];
let currentQuestion = 0;
let answers = {};
let markedQuestions = [];
let examTimer = null;
let timeLeft = 60 * 60;


// Load dashboard statistics
function loadStatistics() {
    const history = JSON.parse(
        localStorage.getItem("examHistory") || "[]"
    );

    const total = history.length;

    const average = total
        ? history.reduce((sum, exam) => sum + exam.score, 0) / total
        : 0;

    const best = total
        ? Math.max(...history.map(exam => exam.score))
        : 0;

    const totalElement = document.getElementById("totalExams");
    const averageElement = document.getElementById("averageScore");
    const bestElement = document.getElementById("bestScore");

    if (totalElement) totalElement.textContent = total;
    if (averageElement) averageElement.textContent = average.toFixed(1) + "%";
    if (bestElement) bestElement.textContent = best.toFixed(1) + "%";
}


// Start examination
async function startExam(type) {
    try {
        const file = type === "bcs"
            ? "data/bcs.json"
            : "data/bank.json";

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error("Question database could not be loaded.");
        }

        const data = await response.json();

        const availableExams = data.filter(
            exam => exam.questions && exam.questions.length > 0
        );

        if (!availableExams.length) {
            alert("Question bank is empty. We need to add questions first!");
            return;
        }

        const selectedExam = availableExams[
            Math.floor(Math.random() * availableExams.length)
        ];

       sessionStorage.setItem(
    "examQuestions",
    JSON.stringify(selectedExam.questions)
);

sessionStorage.setItem(
    "examTitle",
    selectedExam.exam || selectedExam.name || "Practice Examination"
);

window.location.href = "exam.html";
    } catch (error) {
        alert("Error loading questions: " + error.message);
    }
}


// Display question
function displayQuestion() {
    if (!questions.length) return;

    const question = questions[currentQuestion];

    document.getElementById("questionText").textContent =
        question.question;

    document.getElementById("questionProgress").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    const container = document.getElementById("optionsContainer");
    container.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.textContent = option;
        button.className = "option-btn";

        if (answers[currentQuestion] === index) {
            button.classList.add("selected");
        }

        button.onclick = () => {
            answers[currentQuestion] = index;
            displayQuestion();
        };

        container.appendChild(button);
    });

    createQuestionPalette();
}


// Question palette
function createQuestionPalette() {
    const palette = document.getElementById("questionPalette");

    if (!palette) return;

    palette.innerHTML = "";

    questions.forEach((question, index) => {
        const button = document.createElement("button");

        button.textContent = index + 1;

        if (answers[index] !== undefined) {
            button.classList.add("answered");
        }

        if (markedQuestions.includes(index)) {
            button.classList.add("marked");
        }

        button.onclick = () => {
            currentQuestion = index;
            displayQuestion();
        };

        palette.appendChild(button);
    });
}


// Next question
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}


// Previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}


// Mark for review
function markForReview() {
    if (!markedQuestions.includes(currentQuestion)) {
        markedQuestions.push(currentQuestion);
    } else {
        markedQuestions = markedQuestions.filter(
            index => index !== currentQuestion
        );
    }

    displayQuestion();
}


// Timer
function startTimer() {
    examTimer = setInterval(() => {
        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        const timer = document.getElementById("timer");

        if (timer) {
            timer.textContent =
                `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }

        if (timeLeft <= 0) {
            submitExam();
        }
    }, 1000);
}


// Submit examination
function submitExam() {
    if (!questions.length) return;

    if (!confirm("Are you sure you want to submit your examination?")) {
        return;
    }

    clearInterval(examTimer);

    let correct = 0;

    questions.forEach((question, index) => {
        if (answers[index] === question.answer) {
            correct++;
        }
    });

    const score = (correct / questions.length) * 100;

    saveExamResult(score, "Practice Exam");

    alert(
        `Examination Completed!\n\n` +
        `Total Questions: ${questions.length}\n` +
        `Correct Answers: ${correct}\n` +
        `Score: ${score.toFixed(2)}%`
    );

    window.location.href = "index.html";
}


// Save examination result
function saveExamResult(score, category) {
    const history = JSON.parse(
        localStorage.getItem("examHistory") || "[]"
    );

    history.push({
        category: category,
        score: score,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem(
        "examHistory",
        JSON.stringify(history)
    );
}


// Initialize website
document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("totalExams")) {
        loadStatistics();
    }

    if (document.getElementById("questionText")) {
        loadExamPage();
    }

    console.log("ExamVerse BD is running!");

});
// Load examination page
function loadExamPage() {
    const savedQuestions = sessionStorage.getItem("examQuestions");

    if (!savedQuestions) {
        alert("No examination selected!");
        window.location.href = "index.html";
        return;
    }

    questions = JSON.parse(savedQuestions);

    currentQuestion = 0;
    answers = {};
    markedQuestions = [];
    timeLeft = 60 * 60;

    document.getElementById("examTitle").textContent =
        sessionStorage.getItem("examTitle") || "Examination";

    displayQuestion();
    startTimer();
}
