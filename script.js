const WEBHOOK_URL = "https://kalaga.app.n8n.cloud/webhook/studymind";

let quizMode = false;
let currentQuiz = null;


// =====================================
// SEND MESSAGE
// =====================================

async function sendMessage() {

    const input = document.getElementById("userInput");
    const messages = document.getElementById("messages");

    const text = input.value.trim();

    if (text === "") {
        return;
    }

    addUserMessage(text);

    input.value = "";

    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";

    botMessage.innerHTML =
        "🤖 <b>StudyMind AI</b><br><br>Thinking... 💭";

    messages.appendChild(botMessage);

    scrollToBottom();

    try {

        const response = await fetch(WEBHOOK_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({
                chatInput: text
            })
        });

        const responseText = await response.text();

        console.log("n8n response:", responseText);

        if (responseText.trim() === "") {

            botMessage.innerHTML =
                "⚠️ <b>StudyMind AI</b><br><br>" +
                "No response was returned.";

            return;
        }

        let data;

        try {
            data = JSON.parse(responseText);
        } catch (error) {

            botMessage.innerHTML =
                formatAIResponse(responseText);

            return;
        }

        const message = data.message || "";

        // =====================================
        // CHECK FOR QUIZ JSON
        // =====================================

        let quizData = null;

        try {

            quizData = typeof message === "string"
                ? JSON.parse(message)
                : message;

        } catch (error) {

            quizData = null;

        }

        // =====================================
        // SHOW QUIZ
        // =====================================

        if (
            quizData &&
            quizData.type === "quiz" &&
            Array.isArray(quizData.questions)
        ) {

            currentQuiz = quizData;

            quizMode = true;

            showQuiz(quizData, botMessage);

        }

        // =====================================
        // NORMAL MESSAGE
        // =====================================

        else {

            botMessage.innerHTML =
                formatAIResponse(message);

        }

    }

    catch (error) {

        console.error(error);

        botMessage.innerHTML =
            "❌ <b>Connection problem</b><br><br>" +
            "Please try again.";

    }

    scrollToBottom();
}


// =====================================
// QUICK BUTTON
// =====================================

function quickMessage(text) {

    const input = document.getElementById("userInput");

    input.value = text;

    sendMessage();

}


// =====================================
// SHOW QUIZ
// =====================================

function showQuiz(quiz, container) {

    let html = "";

    html += `
        <div class="quiz-container">

            <h2>📝 ${escapeHTML(quiz.topic)} Practice</h2>

            <p>Choose the correct answer for each question.</p>
    `;


    quiz.questions.forEach((q, index) => {

        html += `
            <div class="quiz-question">

                <h3>
                    Question ${index + 1}/${quiz.questions.length}
                </h3>

                <p class="question-text">
                    ${escapeHTML(q.question)}
                </p>

                <div class="quiz-options">
        `;


        ["A", "B", "C", "D"].forEach(letter => {

            html += `
                <button
                    class="quiz-option"
                    onclick="selectAnswer(${index}, '${letter}', this)"
                >
                    <strong>${letter}</strong>
                    ${escapeHTML(q.options[letter])}
                </button>
            `;

        });


        html += `
                </div>

            </div>
        `;

    });


    html += `

            <button
                class="submit-quiz"
                onclick="submitQuiz()"
            >
                🎯 Submit Quiz
            </button>

        </div>
    `;


    container.innerHTML =
        "🤖 <b>StudyMind AI</b><br><br>" +
        html;

}


// =====================================
// STORE SELECTED ANSWERS
// =====================================

let selectedAnswers = {};


// =====================================
// SELECT ANSWER
// =====================================

function selectAnswer(questionIndex, answer, button) {

    selectedAnswers[questionIndex] = answer;


    // Remove selection from same question
    const parent =
        button.parentElement;

    const buttons =
        parent.querySelectorAll(".quiz-option");


    buttons.forEach(btn => {

        btn.classList.remove("selected");

    });


    // Highlight selected answer
    button.classList.add("selected");

}


// =====================================
// SUBMIT QUIZ
// =====================================

function submitQuiz() {

    if (!currentQuiz) {
        return;
    }


    const total =
        currentQuiz.questions.length;


    const answered =
        Object.keys(selectedAnswers).length;


    if (answered < total) {

        alert(
            `Please answer all ${total} questions before submitting.`
        );

        return;

    }


    let answerText = "";


    for (let i = 0; i < total; i++) {

        answerText +=
            `${i + 1}-${selectedAnswers[i]}`;

        if (i < total - 1) {
            answerText += "\n";
        }

    }


    console.log(
        "Submitting quiz answers:",
        answerText
    );


    // Reset quiz state
    selectedAnswers = {};
    quizMode = false;


    // Send answers to n8n
    sendQuizAnswers(answerText);

}


// =====================================
// SEND QUIZ ANSWERS
// =====================================

async function sendQuizAnswers(answerText) {

    const messages =
        document.getElementById("messages");


    const userMessage =
        document.createElement("div");


    userMessage.className =
        "bot-message";


    userMessage.innerHTML =
        "👨‍🎓 <b>Your Answers</b><br><br>" +
        escapeHTML(answerText)
            .replace(/\n/g, "<br>");


    messages.appendChild(userMessage);


    const botMessage =
        document.createElement("div");


    botMessage.className =
        "bot-message";


    botMessage.innerHTML =
        "🤖 <b>StudyMind AI</b><br><br>" +
        "Checking your answers... 🧠";


    messages.appendChild(botMessage);


    scrollToBottom();


    try {

        const response =
            await fetch(WEBHOOK_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({
                    chatInput: answerText
                })

            });


        const responseText =
            await response.text();


        console.log(
            "Quiz result:",
            responseText
        );


        if (responseText.trim() === "") {

            botMessage.innerHTML =
                "⚠️ No result was returned.";

            return;

        }


        try {

            const data =
                JSON.parse(responseText);


            botMessage.innerHTML =
                formatAIResponse(
                    data.message || responseText
                );

        }

        catch (error) {

            botMessage.innerHTML =
                formatAIResponse(
                    responseText
                );

        }

    }

    catch (error) {

        console.error(error);

        botMessage.innerHTML =
            "❌ Unable to submit the quiz.";

    }


    scrollToBottom();

}


// =====================================
// ADD USER MESSAGE
// =====================================

function addUserMessage(text) {

    const messages =
        document.getElementById("messages");


    const userMessage =
        document.createElement("div");


    userMessage.className =
        "bot-message";


    userMessage.innerHTML =
        "👨‍🎓 <b>You</b><br><br>" +
        escapeHTML(text);


    messages.appendChild(userMessage);

}


// =====================================
// FORMAT NORMAL AI RESPONSE
// =====================================

function formatAIResponse(text) {

    let formatted =
        escapeHTML(text);


    formatted =
        formatted.replace(
            /━━━━━━━━━━━━━━━━━━/g,
            "<hr>"
        );


    formatted =
        formatted.replace(
            /(Question\s+\d+\/\d+)/gi,
            "<strong>📝 $1</strong>"
        );


    formatted =
        formatted.replace(
            /(Question\s+\d+:)/gi,
            "<strong>📝 $1</strong>"
        );


    formatted =
        formatted.replace(
            /(STUDY PROGRESS)/gi,
            "<strong>📊 $1</strong>"
        );


    formatted =
        formatted.replace(
            /(Recommended Next Topic:)/gi,
            "<strong>📚 $1</strong>"
        );


    formatted =
        formatted.replace(
            /(Score:\s*\d+\s*\/\s*\d+)/gi,
            "<strong>🏆 $1</strong>"
        );


    formatted =
        formatted.replace(
            /(Percentage:\s*\d+%)/gi,
            "<strong>📈 $1</strong>"
        );


    formatted =
        formatted.replace(
            /(Status:\s*(Strong|Developing|Weak))/gi,
            "<strong>🎯 $1</strong>"
        );


    formatted =
        formatted.replace(
            /(Correct)/gi,
            "<strong>✅ $1</strong>"
        );


    formatted =
        formatted.replace(
            /(Incorrect)/gi,
            "<strong>❌ $1</strong>"
        );


    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return (
        "🤖 <b>StudyMind AI</b><br><br>" +
        formatted
    );

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// =====================================
// SCROLL
// =====================================

function scrollToBottom() {

    const messages =
        document.getElementById("messages");

    messages.scrollTop =
        messages.scrollHeight;

}