const form = document.getElementById("tipForm");
const billInput = document.getElementById("billAmount");
const customTipInput = document.getElementById("customTip");
const peopleInput = document.getElementById("people");
const tipButtons = document.querySelectorAll(".tip-btn");
const errorElement = document.getElementById("error");

const tipAmountElement = document.getElementById("tipAmount");
const totalBillElement = document.getElementById("totalBill");
const perPersonElement = document.getElementById("perPerson");
const resetBtn = document.getElementById("resetBtn");

let selectedTip = 10;

function formatCurrency(amount) {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

tipButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedTip = Number(button.dataset.tip);
        customTipInput.value = "";

        tipButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        calculateTip();
    });
});

customTipInput.addEventListener("input", () => {
    if (customTipInput.value !== "") {
        tipButtons.forEach(btn => btn.classList.remove("active"));
    } else {
        tipButtons.forEach(btn => {
            btn.classList.toggle(
                "active",
                Number(btn.dataset.tip) === selectedTip
            );
        });
    }

    calculateTip();
});

function calculateTip() {
    const bill = Number(billInput.value);
    const people = Number(peopleInput.value);
    const tipPercentage = customTipInput.value !== ""
        ? Number(customTipInput.value)
        : selectedTip;

    errorElement.textContent = "";

    if (billInput.value === "" || !Number.isFinite(bill) || bill <= 0) {
        clearResults();
        if (billInput.value !== "") {
            errorElement.textContent = "Please enter a bill amount greater than zero.";
        }
        return;
    }

    if (
        peopleInput.value === "" ||
        !Number.isInteger(people) ||
        people < 1
    ) {
        clearResults();
        errorElement.textContent = "Please enter a whole number of people (at least 1).";
        return;
    }

    if (
        !Number.isFinite(tipPercentage) ||
        tipPercentage < 0 ||
        tipPercentage > 100
    ) {
        clearResults();
        errorElement.textContent = "Tip percentage must be between 0 and 100.";
        return;
    }

    const tip = bill * tipPercentage / 100;
    const total = bill + tip;
    const eachPersonPays = total / people;

    tipAmountElement.textContent = formatCurrency(tip);
    totalBillElement.textContent = formatCurrency(total);
    perPersonElement.textContent = formatCurrency(eachPersonPays);
}

function clearResults() {
    tipAmountElement.textContent = formatCurrency(0);
    totalBillElement.textContent = formatCurrency(0);
    perPersonElement.textContent = formatCurrency(0);
}

form.addEventListener("submit", event => {
    event.preventDefault();
    calculateTip();
});

billInput.addEventListener("input", calculateTip);
peopleInput.addEventListener("input", calculateTip);

resetBtn.addEventListener("click", () => {
    form.reset();
    selectedTip = 10;

    tipButtons.forEach(button => {
        button.classList.toggle(Number(button.dataset.tip) === 10);
        button.classList.toggle(
            "active",
            Number(button.dataset.tip) === 10
        );
    });

    errorElement.textContent = "";
    clearResults();
});

clearResults();
