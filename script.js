const queryInput = document.getElementById("query");
const resultCard = document.getElementById("result-card");
const resultContent = document.getElementById("result-content");

function setQuery(text) {
    queryInput.value = text;
    queryInput.focus();
}

function handleKey(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        calculate();
    }
}

function calculate() {

    const query = queryInput.value.trim();

    if (!query) {
        queryInput.focus();
        return;
    }

    resultCard.classList.remove("hidden");

    let result = processCalculation(query);

    resultContent.innerHTML = `
        <div class="result-main">

            <div>
                <div class="result-label">Answer</div>

                <div class="result-number">
                    ${result.answer}
                </div>
            </div>

        </div>

        <div class="steps">

            <h4>✦ HOW I CALCULATED</h4>

            <p>${result.steps}</p>

        </div>
    `;

    resultCard.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* BASIC AI-LIKE CALCULATION ENGINE */

function processCalculation(query) {

    const q = query.toLowerCase();


    // GST
    if (q.includes("gst")) {

        const numbers = extractNumbers(query);

        if (numbers.length >= 2) {

            let amount = numbers[0];
            let gst = numbers[1];

            let gstAmount = amount * gst / 100;
            let total = amount + gstAmount;

            return {
                answer: `₹${format(gstAmount)} GST`,
                steps:
                    `Original amount = ₹${format(amount)}<br>
                     GST rate = ${gst}%<br>
                     GST = ₹${format(amount)} × ${gst} / 100 = <b>₹${format(gstAmount)}</b><br>
                     Final amount = ₹${format(total)}`
            };
        }
    }


    // DISCOUNT
    if (q.includes("discount")) {

        const numbers = extractNumbers(query);

        if (numbers.length >= 2) {

            let amount = numbers[0];
            let discount = numbers[1];

            let saved = amount * discount / 100;
            let finalPrice = amount - saved;

            return {
                answer: `₹${format(finalPrice)}`,
                steps:
                    `Original price = ₹${format(amount)}<br>
                     Discount = ${discount}%<br>
                     Discount amount = ₹${format(saved)}<br>
                     Final price = ₹${format(amount)} − ₹${format(saved)} = <b>₹${format(finalPrice)}</b>`
            };
        }
    }


    // PERCENTAGE
    if (
        q.includes("% of") ||
        q.includes("percent of") ||
        q.includes("percentage of")
    ) {

        const numbers = extractNumbers(query);

        if (numbers.length >= 2) {

            let percentage = numbers[0];
            let amount = numbers[1];

            let result = percentage * amount / 100;

            return {
                answer: format(result),
                steps:
                    `${percentage}% of ${format(amount)}<br>
                     = ${percentage} / 100 × ${format(amount)}<br>
                     = <b>${format(result)}</b>`
            };
        }
    }


    // PROFIT
    if (
        q.includes("profit") &&
        (q.includes("cost") || q.includes("selling"))
    ) {

        const numbers = extractNumbers(query);

        if (numbers.length >= 2) {

            let cp = numbers[0];
            let sp = numbers[1];

            let profit = sp - cp;
            let percentage = profit / cp * 100;

            return {
                answer: `${format(percentage)}% Profit`,
                steps:
                    `Cost Price = ₹${format(cp)}<br>
                     Selling Price = ₹${format(sp)}<br>
                     Profit = ₹${format(sp)} − ₹${format(cp)} = ₹${format(profit)}<br>
                     Profit % = ${format(profit)} / ${format(cp)} × 100 = <b>${format(percentage)}%</b>`
            };
        }
    }


    // NORMAL MATH
    try {

        let expression = query
            .replace(/[^0-9+\-*/().% ]/g, "")
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        if (expression.trim()) {

            let answer = Function(
                `"use strict"; return (${expression})`
            )();

            if (Number.isFinite(answer)) {

                return {
                    answer: format(answer),
                    steps:
                        `${expression}<br>
                         = <b>${format(answer)}</b>`
                };
            }
        }

    } catch (error) {}


    // DEFAULT AI RESPONSE

    return {
        answer: "Ready for AI",
        steps:
            `I understood your query as:<br>
             <b>"${escapeHTML(query)}"</b><br><br>
             Connect the AI backend to let the agent understand complex natural-language calculations automatically.`
    };
}


function extractNumbers(text) {

    return (text.match(/-?\d+(?:\.\d+)?/g) || [])
        .map(Number);

}


function format(number) {

    return Number(number).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

}


function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function copyResult() {

    const text =
        resultContent.innerText;

    navigator.clipboard.writeText(text);

}


function newChat() {

    queryInput.value = "";

    resultCard.classList.add("hidden");

    queryInput.focus();

}