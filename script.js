
// ======================================
// AI PROMPT QUALITY CHECKER
// JavaScript Functionality
// ======================================


// Get HTML elements
const promptInput = document.getElementById("promptInput");

const checkBtn = document.getElementById("checkBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");

const scoreValue = document.getElementById("scoreValue");
const rating = document.getElementById("rating");
const ratingDescription = document.getElementById("ratingDescription");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

const componentResults = document.getElementById("componentResults");
const suggestions = document.getElementById("suggestions");

const errorMessage = document.getElementById("errorMessage");
const charCount = document.getElementById("charCount");


// ======================================
// COMPONENT KEYWORDS
// ======================================

// Each component has a list of keywords.
// Detection is case-insensitive.

const components = {

    role: {
        keywords: [
            "act as",
            "you are",
            "assume the role",
            "role:",
            "as a",
            "acting as"
        ],

        suggestion:
            "Add a Role: Tell the AI who it should act as. Example: Act as a professional teacher."
    },

    task: {
        keywords: [
            "your task",
            "task:",
            "explain",
            "write",
            "create",
            "generate",
            "analyze",
            "summarize",
            "describe",
            "develop",
            "calculate",
            "compare",
            "prepare",
            "design"
        ],

        suggestion:
            "Add a Task: Clearly explain what you want the AI to do. Example: Your task is to explain artificial intelligence."
    },

    context: {
        keywords: [
            "context:",
            "background",
            "for college students",
            "for students",
            "target audience",
            "designed for",
            "purpose",
            "scenario",
            "for beginners",
            "in the context"
        ],

        suggestion:
            "Add Context: Provide background information or identify your target audience. Example: This explanation is for first-year college students."
    },

    constraints: {
        keywords: [
            "constraints",
            "constraint:",
            "limit",
            "maximum",
            "minimum",
            "within",
            "must",
            "should",
            "do not",
            "don't",
            "avoid",
            "less than",
            "no more than",
            "word limit",
            "simple language",
            "formal english"
        ],

        suggestion:
            "Add Constraints: Mention rules or limitations. Example: Use simple English and keep the answer under 200 words."
    },

    output: {
        keywords: [
            "output format",
            "format:",
            "bullet points",
            "in a table",
            "as a list",
            "step by step",
            "paragraph",
            "json",
            "markdown",
            "report format",
            "numbered list",
            "present the answer"
        ],

        suggestion:
            "Add Output Format: Specify how the answer should be presented. Example: Present the answer in bullet points."
    }

};


// ======================================
// UPDATE CHARACTER COUNT
// ======================================

promptInput.addEventListener("input", function () {

    charCount.textContent =
        this.value.length + " characters";

    // Clear old error when user starts typing
    errorMessage.textContent = "";

});


// ======================================
// CHECK PROMPT FUNCTION
// ======================================

function checkPrompt() {

    // Get entered prompt
    const prompt = promptInput.value.trim();

    // Validate empty input
    if (prompt === "") {

        errorMessage.textContent =
            "⚠️ Please enter a prompt before checking.";

        resetResults();

        promptInput.focus();

        return;
    }

    // Clear error message
    errorMessage.textContent = "";

    // Convert prompt into lowercase
    // This makes detection case-insensitive.
    const lowerPrompt = prompt.toLowerCase();

    let score = 0;

    let detectedCount = 0;

    let resultsHTML = "";

    let suggestionsHTML = "";


    // ==================================
    // CHECK EACH COMPONENT
    // ==================================

    for (const component in components) {

        const keywords = components[component].keywords;

        // Check whether any keyword exists
        const isDetected = keywords.some(keyword =>
            lowerPrompt.includes(keyword.toLowerCase())
        );

        if (isDetected) {

            // Add 20 marks
            score += 20;

            detectedCount++;

            // Green detected result
            resultsHTML += `
                <div class="component-item detected">
                    <span>✓ ${getComponentName(component)}</span>
                    <span class="component-status">+20</span>
                </div>
            `;

        } else {

            // Red missing result
            resultsHTML += `
                <div class="component-item missing">
                    <span>✗ ${getComponentName(component)}</span>
                    <span class="component-status">Missing</span>
                </div>
            `;

            // Add improvement suggestion
            suggestionsHTML += `
                <div class="suggestion-item">
                    💡 ${components[component].suggestion}
                </div>
            `;

        }

    }


    // ==================================
    // DISPLAY RESULTS
    // ==================================

    componentResults.innerHTML = resultsHTML;

    // Display suggestions
    if (suggestionsHTML === "") {

        suggestions.innerHTML = `
            <div class="suggestion-item">
                🎉 Excellent! All five components
                are detected. Your prompt has a complete structure.
            </div>
        `;

    } else {

        suggestions.innerHTML = suggestionsHTML;

    }


    // ==================================
    // UPDATE SCORE
    // ==================================

    scoreValue.textContent = score;

    // Update progress bar
    progressBar.style.width = score + "%";

    progressPercent.textContent = score + "%";


    // ==================================
    // GENERATE RATING
    // ==================================

    let ratingText = "";
    let descriptionText = "";

    if (score === 100) {

        ratingText = "Excellent 🌟";

        descriptionText =
            "Your prompt includes all five important components.";

    } else if (score === 80) {

        ratingText = "Very Good 👍";

        descriptionText =
            "Your prompt is well structured. Add the missing component.";

    } else if (score === 60) {

        ratingText = "Good 😊";

        descriptionText =
            "Your prompt has a good foundation. Improve the missing components.";

    } else if (score === 40) {

        ratingText = "Average 📘";

        descriptionText =
            "Your prompt needs more details to improve its quality.";

    } else {

        ratingText = "Needs Improvement 📖";

        descriptionText =
            "Add more prompt components to make your instructions clearer.";

    }


    // Display rating
    rating.textContent = ratingText;

    ratingDescription.textContent = descriptionText;

}


// ======================================
// GET COMPONENT DISPLAY NAME
// ======================================

function getComponentName(component) {

    const names = {

        role: "Role",

        task: "Task",

        context: "Context",

        constraints: "Constraints",

        output: "Output Format"

    };

    return names[component];

}


// ======================================
// LOAD SAMPLE PROMPT
// ======================================

function loadSample() {

    const samplePrompt = `
Act as a professional computer science teacher.

Your task is to explain Artificial Intelligence
and its applications.

Context: This explanation is designed for
first-year college students who are beginners
in computer science.

Constraints: Use simple English, provide clear
examples, and keep the explanation under 300 words.

Output Format: Present the answer in bullet points
with suitable headings.
`;

    promptInput.value = samplePrompt.trim();

    charCount.textContent =
        promptInput.value.length + " characters";

    errorMessage.textContent = "";

    // Automatically analyze the sample
    checkPrompt();

}


// ======================================
// RESET RESULTS
// ======================================

function resetResults() {

    // Reset score
    scoreValue.textContent = "0";

    // Reset rating
    rating.textContent = "Not Analyzed";

    ratingDescription.textContent =
        "Check your prompt to see its quality.";

    // Reset progress bar
    progressBar.style.width = "0%";

    progressPercent.textContent = "0%";

    // Reset component results
    componentResults.innerHTML = `
        <div class="empty-state">
            <span>📝</span>
            <p>Your prompt analysis will appear here.</p>
        </div>
    `;

    // Reset suggestions
    suggestions.innerHTML = `
        <p class="suggestion-placeholder">
            Suggestions will appear after analysis.
        </p>
    `;

}


// ======================================
// CLEAR BUTTON
// ======================================

function clearPrompt() {

    // Clear textarea
    promptInput.value = "";

    // Reset character count
    charCount.textContent = "0 characters";

    // Clear error message
    errorMessage.textContent = "";

    // Reset all results
    resetResults();

}


// ======================================
// BUTTON EVENT LISTENERS
// ======================================

checkBtn.addEventListener("click", checkPrompt);

sampleBtn.addEventListener("click", loadSample);

clearBtn.addEventListener("click", clearPrompt);
