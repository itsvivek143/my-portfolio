
const form = document.getElementById("expenseForm");

const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");
const emptyMessage = document.getElementById("emptyMessage");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

const themeBtn = document.getElementById("themeBtn");
const submitBtn = document.getElementById("submitBtn");

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;

function displayTransactions() {

    transactionList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const selectedCategory = filterCategory.value;


    const filteredTransactions = transactions.filter(function(transaction) {

        const matchesSearch =
            transaction.description
                .toLowerCase()
                .includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            transaction.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    if (filteredTransactions.length === 0) {

        emptyMessage.style.display = "block";

        return;

    } else {

        emptyMessage.style.display = "none";
    }


    filteredTransactions.forEach(function(transaction) {

        const div = document.createElement("div");

        div.className = "transaction";


        const amountClass =
            transaction.type === "income"
                ? "income-text"
                : "expense-text";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        div.innerHTML = `

            <div class="transaction-info">

                <h3>${transaction.description}</h3>

                <p>
                    ${transaction.category}
                    • ${transaction.date}
                </p>

            </div>


            <div class="transaction-amount ${amountClass}">
                ${sign} ₹${transaction.amount}
            </div>


            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>

            </div>

        `;


        transactionList.appendChild(div);

    });

}

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;
    const date = dateInput.value;


    // Validation

    if (
        amount <= 0 ||
        description === "" ||
        date === ""
    ) {

        alert("Please enter valid details.");

        return;
    }


    if (editId !== null) {

        const transaction =
            transactions.find(function(item) {

                return item.id === editId;

            });


        transaction.amount = amount;
        transaction.type = type;
        transaction.description = description;
        transaction.category = category;
        transaction.date = date;


        editId = null;

        submitBtn.textContent = "Add Transaction";

    }


    // ADD

    else {

        const transaction = {

            id: Date.now(),

            amount: amount,

            type: type,

            description: description,

            category: category,

            date: date

        };


        transactions.push(transaction);

    }


    saveData();

    displayTransactions();

    calculateTotal();

    form.reset();

});



function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {

        return transaction.id !== id;

    });


    saveData();

    displayTransactions();

    calculateTotal();

}


// ===============================
// EDIT
// ===============================

function editTransaction(id) {

    const transaction =
        transactions.find(function(item) {

            return item.id === id;

        });


    amountInput.value = transaction.amount;

    typeInput.value = transaction.type;

    descriptionInput.value = transaction.description;

    categoryInput.value = transaction.category;

    dateInput.value = transaction.date;


    editId = id;

    submitBtn.textContent = "Update Transaction";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


function calculateTotal() {

    let income = 0;

    let expense = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });


    const currentBalance = income - expense;


    totalIncome.textContent =
        `₹${income.toFixed(2)}`;

    totalExpense.textContent =
        `₹${expense.toFixed(2)}`;

    balance.textContent =
        `₹${currentBalance.toFixed(2)}`;

}


function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}



searchInput.addEventListener(
    "input",
    displayTransactions
);



filterCategory.addEventListener(
    "change",
    displayTransactions
);



themeBtn.addEventListener("click", function() {

    document.body.classList.toggle("dark");


    const darkMode =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "darkMode",
        darkMode
    );


    themeBtn.textContent =
        darkMode ? "☀️" : "🌙";

});



if (
    localStorage.getItem("darkMode") === "true"
) {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}



displayTransactions();

calculateTotal();