# SpendWise

A simple budgeting web app. Set a monthly budget, add expenses, and watch the dashboard update instantly.

## Improvements This Week
- Added a budget form and an expense form (name, amount, category).
- Expenses are stored in an array instead of single variables.
- Dashboard (budget, spent, remaining, progress bar, status message) updates live on the page.
- Added delete buttons, a "Clear All" button, and a per-category summary.
- Input validation with on-page error messages instead of console output.

## How Conditionals Are Used
- `if / else if / else` in `getStatus()` gives feedback: over budget, 80%+ used (warning), on track, or no expenses.
- Form validation checks for empty names and invalid or negative amounts.
- Expenses worth 20% or more of the budget get a highlight class.
- The progress bar colour changes (green, orange, red) based on spending level.

## How Arrays Are Used
All expenses live in the `expenses` array, each as an object: `{ id, name, amount, category }`.
- `push()` adds a new expense.
- `filter()` removes an expense by its `id`.
- Setting `expenses = []` clears everything.

## Loops
- A `for` loop in `calculateTotal()` sums all amounts.
- A `for...of` loop in `calculateByCategory()` groups totals by category.
- `for...of` loops in `renderExpenses()` and `renderCategories()` build the list items.

## How the DOM Is Updated
`render()` calls three functions that refresh the page:
`renderDashboard()` (text, progress bar width/colour, status message), `renderExpenses()` and `renderCategories()` (clear the list with `innerHTML = ""`, then create `li` elements with `createElement` and `appendChild`).

## How Events Are Handled
- `submit` listeners on the budget and expense forms (using `preventDefault()`).
- A `click` listener on the expense list uses event delegation to catch delete buttons.
- A `click` listener on "Clear All".

Flow: user action → event listener → update `budget` / `expenses` → `render()` → page changes.

## Challenges and Solutions
- **Page reloading on form submit:** fixed with `event.preventDefault()`.
- **Delete buttons are created dynamically:** solved with event delegation and a `data-id` on each button.
- **Text inputs returning strings:** used `parseFloat()` and `isNaN()` checks before calculating.
- **Dividing by zero when no budget is set:** added a condition so percentages only calculate when `budget > 0`.

## Run It
Open `index.html` in a browser.