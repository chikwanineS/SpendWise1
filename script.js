// ---------- DATA ----------
let budget = 0;
let expenses = []; // array of { id, name, amount, category }

// ---------- DOM REFERENCES ----------
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const expenseForm = document.getElementById("expense-form");
const nameInput = document.getElementById("name-input");
const amountInput = document.getElementById("amount-input");
const categoryInput = document.getElementById("category-input");
const errorMessage = document.getElementById("error-message");
const expenseList = document.getElementById("expense-list");
const categorySummary = document.getElementById("category-summary");
const clearBtn = document.getElementById("clear-btn");
const budgetDisplay = document.getElementById("budget-display");
const spentDisplay = document.getElementById("spent-display");
const remainingDisplay = document.getElementById("remaining-display");
const progressBar = document.getElementById("progress-bar");
const statusMessage = document.getElementById("status-message");

// ---------- HELPERS ----------
function formatMoney(value) {
  return "KES " + value.toFixed(2);
}

// Loop through the array to add up all expenses
function calculateTotal() {
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].amount;
  }
  return total;
}

// Loop to group totals by category
function calculateByCategory() {
  const totals = {};
  for (const expense of expenses) {
    if (totals[expense.category] === undefined) {
      totals[expense.category] = 0;
    }
    totals[expense.category] += expense.amount;
  }
  return totals;
}

// ---------- CONDITIONALS: budget feedback ----------
function getStatus(total) {
  if (budget <= 0) {
    return { text: "Set a budget to get started.", css: "" };
  }
  const percent = (total / budget) * 100;
  if (total > budget) {
    return { text: "⚠️ Over budget by " + formatMoney(total - budget) + "!", css: "bad" };
  } else if (percent >= 80) {
    return { text: "Careful! You've used " + percent.toFixed(0) + "% of your budget.", css: "warn" };
  } else if (expenses.length === 0) {
    return { text: "No expenses yet. Great start!", css: "good" };
  } else {
    return { text: "You're on track. " + percent.toFixed(0) + "% of budget used.", css: "good" };
  }
}

// ---------- DOM UPDATES ----------
function renderDashboard() {
  const total = calculateTotal();
  const remaining = budget - total;

  budgetDisplay.textContent = formatMoney(budget);
  spentDisplay.textContent = formatMoney(total);
  remainingDisplay.textContent = formatMoney(remaining);
  remainingDisplay.style.color = remaining < 0 ? "#c0392b" : "#222";

  const percent = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  progressBar.style.width = percent + "%";
  progressBar.style.background =
    total > budget && budget > 0 ? "#c0392b" : percent >= 80 ? "#e67e22" : "#27ae60";

  const status = getStatus(total);
  statusMessage.textContent = status.text;
  statusMessage.className = "status " + status.css;
}

function renderExpenses() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = '<li class="empty">No expenses added yet.</li>';
    return;
  }

  for (const expense of expenses) {
    const li = document.createElement("li");
    // Conditional: highlight large expenses (20%+ of budget)
    if (budget > 0 && expense.amount >= budget * 0.2) {
      li.classList.add("big");
    }

    const info = document.createElement("span");
    info.textContent = expense.name + " - " + formatMoney(expense.amount);
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = expense.category;
    info.appendChild(tag);

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.dataset.id = expense.id;

    li.appendChild(info);
    li.appendChild(del);
    expenseList.appendChild(li);
  }
}

function renderCategories() {
  categorySummary.innerHTML = "";
  const totals = calculateByCategory();
  const names = Object.keys(totals);

  if (names.length === 0) {
    categorySummary.innerHTML = '<li class="empty">Nothing to summarise yet.</li>';
    return;
  }
  for (const name of names) {
    const li = document.createElement("li");
    li.innerHTML = "<span>" + name + "</span><strong>" + formatMoney(totals[name]) + "</strong>";
    categorySummary.appendChild(li);
  }
}

function render() {
  renderDashboard();
  renderExpenses();
  renderCategories();
}

// ---------- EVENTS ----------
budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const value = parseFloat(budgetInput.value);
  if (isNaN(value) || value <= 0) {
    statusMessage.textContent = "Please enter a budget greater than 0.";
    statusMessage.className = "status bad";
    return;
  }
  budget = value;
  budgetInput.value = "";
  render();
});

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  // Conditionals: validate input
  if (name === "") {
    errorMessage.textContent = "Please enter an expense name.";
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    errorMessage.textContent = "Please enter an amount greater than 0.";
    return;
  }
  errorMessage.textContent = "";

  expenses.push({
    id: Date.now(),
    name: name,
    amount: amount,
    category: categoryInput.value
  });

  expenseForm.reset();
  nameInput.focus();
  render();
});

// Event delegation: one listener handles every delete button
expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = Number(event.target.dataset.id);
    expenses = expenses.filter(function (e) { return e.id !== id; });
    render();
  }
});

clearBtn.addEventListener("click", function () {
  if (expenses.length === 0) return;
  if (confirm("Delete all expenses?")) {
    expenses = [];
    render();
  }
});

// Initial paint
render();