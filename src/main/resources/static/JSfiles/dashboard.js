window.addEventListener('load', () => {

    //get the logged users user profile
    let userID = loggedUserIdHiddenValueID.innerText;
    window['loggedUserObject'] = ajaxGetRequest("/user/byid/" + userID);

    refreshAccCards();
    displayTrxList();

    fetchAndCreateAccountBalanceChart();
    fetchAndCreateMonthlyTrxChart();


});

// ======CASH IN HAND=======
//for thr cash in hand edit form
const openCashInHandEditForm = () => {

    $('#modalEditCashInHand').modal('show');

    currs = ajaxGetRequest("currency/all");
    fillDataIntoSelect(selectBaseCurrency, "Select Currency", currs, 'code');
};

// refill the cash in hand amount
const editCashInHand = (ob) => {

    $('#modalEditCashInHand').modal('show');

    //clone the user object so modifications don't affect the original object directly
    user = JSON.parse(JSON.stringify(ob));

    inputAmount.value = (user.cash_in_hand).toFixed(2);

    currs = ajaxGetRequest("currency/all");
    fillDataIntoSelect(selectBaseCurrency, "Select Currency", currs, 'code', user.base_currency_id.code);
};

//submit new cash in hand amount
const submitCashInHandChanges = () => {
    const userConfirm = confirm("Are You Sure To Update ?");
    if (userConfirm) {

        let putServiceResponse = ajaxRequest('/user/update', 'PUT', window.loggedUserObject)
        if (putServiceResponse == "OK") {
            alert('successfully updated');
            $('#modalEditCashInHand').modal('hide');
            formEditCashInHand.reset();
            window.location.reload();

        } else {
            alert("An error occured \n" + putServiceResponse);
        }
    } else {
        alert("Operation cancelled by the Operator");
    }
};
// ======CASH IN HAND=======



// ======ACCOUNT=======
//display acc cards based on account count of user
const refreshAccCards = () => {

    accountObj = new Object;

    // Get the logged-in user's accounts
    let userID = loggedUserIdHiddenValueID.innerText;
    accListByUser = ajaxGetRequest("/account/byuserid/" + userID);
    accCount = accListByUser.length;

    // Clear the account card section before repopulating
    const sectionAccCardList = document.getElementById('sectionAccCardList');
    sectionAccCardList.innerHTML = "";

    // Display account cards
    accListByUser.forEach(account => {

        const mainCol = document.createElement('div');
        mainCol.className = "col-md-4";

        const cardDiv = document.createElement('div');
        cardDiv.className = "card";
        cardDiv.style.height = "210px";

        const cardHeader = document.createElement('div');
        cardHeader.className = "card-header";
        const h3Div = document.createElement('h3');
        h3Div.className = "text-primary my-auto text-center";
        h3Div.innerText = account.acc_display_name;

        cardHeader.appendChild(h3Div);

        const cardBody = document.createElement('div');
        cardBody.className = "card-body";

        const h2Balance = document.createElement('h2');
        h2Balance.className = "card-title text-success d-flex justify-content-center";
        const spanBalance = document.createElement('span');
        spanBalance.innerText = account.balance.toFixed(2);
        const spanCurrency = document.createElement('span');
        spanCurrency.className = "ms-4 text-primary";
        spanCurrency.innerText = account.acc_currency_id.code;
        h2Balance.appendChild(spanBalance);
        h2Balance.appendChild(spanCurrency);
        cardBody.appendChild(h2Balance);

        const accDetailsDiv = document.createElement('div');
        accDetailsDiv.className = "mt-3 text-start";
        accDetailsDiv.innerHTML = `${account.acc_number} (${account.acc_type_id.name})`;
        cardBody.appendChild(accDetailsDiv);

        const buttonDiv = document.createElement('div');
        buttonDiv.className = "mt-2 d-flex justify-content-end";

        const button = document.createElement('button');
        button.className = "btn btn-info me-1";
        button.type = "button";
        button.innerText = "Edit Amount";
        button.onclick = function () {
            refillAccountInfo(account);
        };


        const dltBtn = document.createElement('button');
        dltBtn.className = "btn btn-danger";
        dltBtn.type = "button";
        dltBtn.innerText = "Delete";
        dltBtn.onclick = function () {
            deleteAccount(account);
        };

        buttonDiv.appendChild(button);
        buttonDiv.appendChild(dltBtn);
        cardBody.appendChild(buttonDiv);

        cardDiv.appendChild(cardHeader);
        cardDiv.appendChild(cardBody);
        mainCol.appendChild(cardDiv);

        sectionAccCardList.appendChild(mainCol);

    });

    // If fewer than 3 accounts(and also status is must true), show the "Add New Account" card dynamically
    if (accCount < 3) {
        // Create the "Add New Account" card
        const addNewAccountCard = document.createElement('div');
        addNewAccountCard.className = "col-md-4";

        const cardDiv = document.createElement('div');
        cardDiv.className = "card";
        cardDiv.style.height = "210px";

        // Card header
        const cardHeader = document.createElement('div');
        cardHeader.className = "card-header";
        const h3Div = document.createElement('h3');
        h3Div.className = "text-primary my-auto text-center";
        h3Div.innerText = "< Your Account Name>";
        cardHeader.appendChild(h3Div);
        cardDiv.appendChild(cardHeader);

        // Card body
        const cardBody = document.createElement('div');
        cardBody.className = "card-body";

        const pDescription = document.createElement('p');
        pDescription.className = "card-text mt-2 mb-0";
        pDescription.innerText = "To Manage Your Other Assets And Transactions From Them";
        cardBody.appendChild(pDescription);

        // Button to add a new account
        const buttonDiv = document.createElement('div');
        buttonDiv.className = "d-flex justify-content-center mt-3";
        const button = document.createElement('button');
        button.className = "btn btn-primary";
        button.type = "button";
        button.innerText = "Add New Account";
        button.onclick = function () {
            openAddNewAccForm();
        };
        // button.setAttribute("data-bs-toggle", "modal");
        // button.setAttribute("data-bs-target", "#modalAddNewAccount");
        buttonDiv.appendChild(button);
        cardBody.appendChild(buttonDiv);
        // openAddNewAccForm

        // Append card body to cardDiv
        cardDiv.appendChild(cardBody);

        // Append cardDiv to addNewAccountCard
        addNewAccountCard.appendChild(cardDiv);

        // Add the "Add New Account" card to the card section
        sectionAccCardList.appendChild(addNewAccountCard);
    }
};

//refresh new account form
const openAddNewAccForm = () => {

    $('#modalAddNewAccount').modal('show');

    currs = ajaxGetRequest("currency/all");
    fillDataIntoSelect(selectAccCurrency, "Select Currency", currs, 'code');

    acctypes = ajaxGetRequest("acctype/all");
    fillDataIntoSelect(selectAccType, "Select Account Type", acctypes, 'name');
};

//save new account
const submitNewAccount = () => {
    const userConfirm = confirm("Are You Sure To Save ?");
    if (userConfirm) {

        let postServiceResponse = ajaxRequest('/account/save', 'POST', accountObj)
        if (postServiceResponse == "OK") {
            alert('successfully saved');
            $('#modalAddNewAccount').modal('hide');
            formAddNewAccount.reset();
            window.location.reload();

        } else {
            alert("An error occured \n" + postServiceResponse);
        }
    } else {
        alert("Operation cancelled by the Operator");
    }
};

//refill acc details to edit
const refillAccountInfo = (obj) => {

    accountObj = JSON.parse(JSON.stringify(obj));

    btnAccUpdate.disabled = false;

    $('#modalAddNewAccount').modal('show');

    inputAccName.value = accountObj.acc_display_name;
    inputAccNumber.value = accountObj.acc_number;

    acctypes = ajaxGetRequest("acctype/all");
    fillDataIntoSelect(selectAccType, "Select Account Type", acctypes, 'name', accountObj.acc_type_id.name);

    inputAccBalance.value = accountObj.balance.toFixed(2);

    currs = ajaxGetRequest("currency/all");
    fillDataIntoSelect(selectAccCurrency, "Select Currency", currs, 'code', accountObj.acc_display_name);

};

//save acc changes
const updateAccount = () => {
    const userConfirm = confirm("Are You Sure To Update? ");
    if (userConfirm) {
        let putServiceResponce = ajaxRequest("/account/update", "PUT", accountObj);
        if (putServiceResponce == "OK") {
            alert("Successfully Updated");
            $('#modalAddNewAccount').modal('hide');
            formAddNewAccount.reset();

            window.location.reload();

        } else {
            alert("An Error Occured " + putServiceResponce);
        }
    }
}

//delete account
const deleteAccount = (ob) => {
    const userConfirm = confirm('Are You Sure To Delete ?');

    if (userConfirm) {
        let deleteServerResponse = ajaxRequest("/account/delete", "DELETE", ob);

        if (deleteServerResponse == "OK") {
            alert("successfully Deleted");
            // refreshDayPlanTable();
        } else {
            alert("An Error Occured \n" + deleteServerResponse);
        }
    } else {
        alert('Operator Cancelled The Task');
    }
}

// ======ACCOUNT=======



// ======TRX RECORDS=======
//setting the form
const openTrxForm = () => {

    $('#modalAddNewTrxRec').modal('show');

    transactionObj = new Object;

    //get acc list by user id
    let userID = loggedUserIdHiddenValueID.innerText;
    accListByUser = ajaxGetRequest("/account/byuserid/" + userID);
    fillDataIntoSelect(selectTrxAccount, "Select Account", accListByUser, 'acc_display_name')

    const trxDateInput = document.getElementById('inputTrxDate');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    trxDateInput.setAttribute('max', formattedDate);

}

// add new trx record
const submitNewTransaction = () => {
    const userConfirm = confirm("Are You Sure To Save ?");
    if (userConfirm) {

        let postServiceResponse = ajaxRequest('/trx/save', 'POST', transactionObj)
        if (postServiceResponse == "OK") {
            alert('successfully saved');
            $('#modalAddNewTrxRec').modal('hide');
            formAddNewTransaction.reset();
            window.location.reload();

        } else {
            alert("An error occured \n" + postServiceResponse);
        }
    } else {
        alert("Operation cancelled by the User");
    }
}

//display trx list
const displayTrxList = () => {
    let userID = loggedUserIdHiddenValueID.innerText;
    let trxListByUser = ajaxGetRequest("/recenttrx/byuser/" + userID);

    trxListDisplayContainer.innerHTML = '';
    trxListByUser.forEach(trx => {

        let toOrFrom;
        let plusOrMinus;
        let classes;

        if (trx.trx_type == "INCOME") {
            toOrFrom = "To";
            plusOrMinus = "+ ";
            classes = "col-3 text-success fw-bold text-end";

        } else {
            toOrFrom = "From";
            plusOrMinus = "- ";
            classes = "col-3 text-danger fw-bold text-end";
        }

        //for differentiate records that doesnt have an account id
        let accDisplayName;
        if (!trx.is_involve_cashinhand) {
            accDisplayName = trx.account_id.acc_display_name;
        } else {
            accDisplayName = "Cash In Hand";
        }

        //main row
        const row = document.createElement('div');
        row.className = "row mx-auto mb-1 border-bottom border-success";

        // date col-2
        const date = document.createElement('div');
        date.className = "col-2";
        date.innerText = trx.trx_date;

        // category col-3
        const category = document.createElement('div');
        category.classList.add('col-3')
        category.innerText = trx.trx_category_id.name;

        //account/cash col-3
        const account = document.createElement('div');
        account.classList.add('col-3')
        account.textContent = `${toOrFrom} : ${accDisplayName}`;

        //space col-1
        const emptySpace = document.createElement('div');
        emptySpace.classList.add('col-1')

        //amount col-3
        const amountDiv = document.createElement('div');
        amountDiv.className = classes;
        amountDiv.textContent = `${plusOrMinus} ${parseFloat(trx.amount).toFixed(2)}`;

        row.appendChild(date);
        row.appendChild(category);
        row.appendChild(account);
        row.appendChild(emptySpace);
        row.appendChild(amountDiv);

        trxListDisplayContainer.appendChild(row);

    })
}

// ======TRX RECORDS=======


//======TRANSFER======
//get data to selects
const openTransferForm = () => {

    $('#modalInternalTransfers').modal('show');

    trfrObj = new Object;

    let userID = loggedUserIdHiddenValueID.innerText;
    accListByUser = ajaxGetRequest("/account/byuserid/" + userID);

    let physicalWallet = {
        acc_display_name: "Physical Wallet",
        balance: loggedUserObject.cash_in_hand,
        id: -10
    }

    //add new item to the start
    accListByUser.unshift(physicalWallet);

    fillDataIntoSelect(selectSourceAcc, "Select Account", accListByUser, 'acc_display_name')

    const trfrDateInput = document.getElementById('inputTrfrDate');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    trfrDateInput.setAttribute('max', formattedDate);

}

//change destination acc list without the source acc
const changesBasedOnSourceAcc = () => {

    //change destination acc list
    selectDestiAcc.disabled = false;

    let userID = loggedUserIdHiddenValueID.innerText;
    defaultAccListByUser = ajaxGetRequest("/account/byuserid/" + userID);

    let physicalWallet = {
        acc_display_name: "Physical Wallet",
        balance: loggedUserObject.cash_in_hand,
        id: -10
    }

    //add new item to the start
    defaultAccListByUser.unshift(physicalWallet);

    let sourceSelectElement = document.getElementById('selectSourceAcc');

    let selectedSourceAcc = JSON.parse(sourceSelectElement.value);
    console.log(selectedSourceAcc);

    //also working
    // let indexOfSelectedSourceAcc = defaultAccListByUser.map(acc => acc.acc_display_name).indexOf(selectedSourceAcc.acc_display_name);
    // if (indexOfSelectedSourceAcc != -1) {
    //     defaultAccListByUser.splice(indexOfSelectedSourceAcc, 1)
    // }

    let accNamesListOnly = defaultAccListByUser.map(acc => acc.acc_display_name);

    let indexOfSelectedSourceAcc = accNamesListOnly.indexOf(selectedSourceAcc.acc_display_name);

    if (indexOfSelectedSourceAcc != -1) {
        defaultAccListByUser.splice(indexOfSelectedSourceAcc, 1);
    }

    console.log(accNamesListOnly);
    console.log(indexOfSelectedSourceAcc);

    fillDataIntoSelect(selectDestiAcc, "Select Account", defaultAccListByUser, 'acc_display_name');

    //change amount
    trfrObj.amount = null;
    inputTrfrAmount.style.border = "2px solid #ced4da";
    inputTrfrAmount.value = selectedSourceAcc.balance.toFixed(2);
    inputTrfrAmount.disabled = false;

    console.log("inputTrfrAmount end");

    //others
    inputTrfrDate.disabled = false;
    inputTrfrDescription.disabled = false;

    console.log("end");

}

//validate the transfering amount
const validateTrfrAmount = () => {

    let selectedSourceAcc = JSON.parse(selectSourceAcc.value);
    let transferAmount = parseFloat(inputTrfrAmount.value);

    if (transferAmount > selectedSourceAcc.balance) {
        console.log("Transfer amount exceeds the account balance");
        trfrObj.amount = null;
        inputTrfrAmount.style.border = "2px solid red";
    }
    else if (transferAmount <= 0) {
        console.log("Invalid amount: must be greater than zero");
        trfrObj.amount = null;
        inputTrfrAmount.style.border = "2px solid red";
    } else {
        trfrObj.amount = inputTrfrAmount.value;
        inputTrfrAmount.style.border = "2px solid lime";
    }

}

//save
const submitNewTransfer = () => {
    const userConfirm = confirm("Are You Sure To Save ?");
    if (userConfirm) {

        let postServiceResponse = ajaxRequest('/trfr/save', 'POST', trfrObj)
        if (postServiceResponse == "OK") {
            alert('successfully saved');
            $('#modalInternalTransfers').modal('hide');
            formTransferFunds.reset();
            window.location.reload();

        } else {
            alert("An error occured \n" + postServiceResponse);
        }
    } else {
        alert("Operation cancelled by the Operator");
    }
}

//======TRANSFER======


//======CHARTS ======

//dashboard pie chart shows how much money in diff accs/cih
function fetchAndCreateAccountBalanceChart() {
    const userID = document.getElementById('loggedUserIdHiddenValueID').innerText;

    // Retrieve account details and user's cash-in-hand balance with AJAX requests
    const accListByUser = ajaxGetRequest("/account/byuserid/" + userID) || [];
    const user = ajaxGetRequest("/user/byid/" + userID);
    const cashInHand = user?.cash_in_hand || 0;

    // If no accounts and no cash-in-hand, exit function
    if (accListByUser.length === 0 && cashInHand === 0) {
        console.log("No accounts or cash in hand to display.");
        return;
    }

    // Prepare data for the chart
    const accountNames = accListByUser.map(acc => acc.acc_display_name);
    const accountBalances = accListByUser.map(acc => acc.balance);

    // If cash in hand exists, add it as a separate entry
    if (cashInHand > 0) {
        accountNames.push('Cash in Hand');
        accountBalances.push(cashInHand);
    }

    // Calculate total balance including cash in hand
    const totalBalance = accountBalances.reduce((a, b) => a + b, 0);

    // Create the chart
    createAccountBalanceChart(accountNames, accountBalances, totalBalance);
}

// Function to create the chart with data passed as parameters
function createAccountBalanceChart(accountNames, accountBalances, totalBalance) {
    const ctx = document.getElementById('accountBalanceChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: accountNames,  // Account names and 'Cash in Hand' label
            datasets: [{
                label: 'Account Balances',
                data: accountBalances,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',   // Soft Teal
                    'rgba(54, 162, 235, 0.8)',   // Light Blue
                    'rgba(153, 102, 255, 0.8)',  // Lavender
                    'rgba(255, 159, 64, 0.8)'    // Peach
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'white'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw;
                            return `${label}: $${value.toLocaleString()}`;
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function (chart) {
                const { width, height, ctx } = chart;
                ctx.restore();
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`Total: $${totalBalance.toLocaleString()}`, width / 2, height / 2);
                ctx.save();
            }
        }]
    });
}


function fetchAndCreateMonthlyTrxChart() {
    const userID = document.getElementById('loggedUserIdHiddenValueID').innerText;
    const trxListByUser = ajaxGetRequest("/recenttrx/byuser/" + userID);

    // Get the current month and year for filtering
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = new Date().getFullYear();

    // Initialize income and expense totals
    let totalIncome = 0;
    let totalExpense = 0;

    // Filter and sum transactions based on type and current month/year
    trxListByUser.forEach(trx => {
        const trxDate = new Date(trx.trx_date);
        const trxMonth = trxDate.getMonth() + 1;
        const trxYear = trxDate.getFullYear();

        // Check if transaction is within the current month and year
        if (trxMonth === currentMonth && trxYear === currentYear) {
            if (trx.trx_type === 'INCOME') {
                totalIncome += parseFloat(trx.amount);
            } else if (trx.trx_type === 'EXPENSE') {
                totalExpense += parseFloat(trx.amount);
            }
        }
    });

    // Create the chart with the processed data
    createMonthlyTrxChart(totalIncome, totalExpense);
}

// Step 2: Create the Bar Chart
function createMonthlyTrxChart(totalIncome, totalExpense) {
    const ctx = document.getElementById('monthlyTrxChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Total Amount ($)',
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.8)',  // Lime for Income
                    'rgba(255, 0, 0, 0.8)'   // Red for Expense
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            return `${label}: $${value.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)',
                        color: 'white'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Transaction Type',
                        color: 'white'
                    }
                }
            }
        }
    });
}




//======CHARTS ======