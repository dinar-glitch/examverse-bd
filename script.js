// =================================
// EXAMVERSE BD - JAVASCRIPT
// =================================


// Load dashboard statistics
function loadStatistics() {

    const history = JSON.parse(
        localStorage.getItem("examHistory") || "[]"
    );

    const totalExams = history.length;

    const averageScore = totalExams
        ? history.reduce((sum, exam) => sum + exam.score, 0) / totalExams
        : 0;

    const bestScore = totalExams
        ? Math.max(...history.map(exam => exam.score))
        : 0;

    document.getElementById("totalExams").textContent =
        totalExams;

    document.getElementById("averageScore").textContent =
        averageScore.toFixed(1) + "%";

    document.getElementById("bestScore").textContent =
        bestScore.toFixed(1) + "%";
}


// Start examination
function startExam(type) {

    if (type === "bcs") {

        alert(
            "Welcome to BCS Examination!\n\n" +
            "বিসিএস পরীক্ষার প্রশ্নব্যাংক প্রস্তুত করা হচ্ছে।"
        );

    }

    else if (type === "bank") {

        alert(
            "Welcome to Bank Examination!\n\n" +
            "ব্যাংক পরীক্ষার প্রশ্নব্যাংক প্রস্তুত করা হচ্ছে।"
        );

    }

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

    loadStatistics();

}


// Initialize website
document.addEventListener("DOMContentLoaded", function () {

    loadStatistics();

    console.log("ExamVerse BD is running!");

});
