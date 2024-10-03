window.addEventListener('load', () => {

    //get the logged users user profile
    let userID = loggedUserIdHiddenValueID.innerText;
    window['loggedUserObject'] = ajaxGetRequest("/user/byid/" + userID);

    refreshAccCards();
    displayTrxList();


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

        // if (account.status) {
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
        // }
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
            refreshAddAccForm();
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
        alert("Operation cancelled by the Operator");
    }
}

//pass the current balance  when an account/wallet is selected 
//will be called in toggleAccountSelection()
const passCurrentBalance = (elementId) => {

    const expenseRadio = document.getElementById('expense');

    if (expenseRadio.checked && toAccount.checked) {

        inputTrxAmount.value = "";
        transactionObj.amount = null;

        let selectedAcc = JSON.parse(elementId.value);
        let crntBalInAcc = selectedAcc.balance;
        inputTrxAmount.value = crntBalInAcc.toFixed(2);
    }
    if (expenseRadio.checked && toWallet.checked) {

        inputTrxAmount.value = "";
        transactionObj.amount = null;
        inputTrxAmount.value = (loggedUserObject.cash_in_hand).toFixed(2);
    }

}

//changes depend on income/outcome
const changesBasedOnTrxType = () => {

    const incomeRadio = document.getElementById('income');
    const expenseRadio = document.getElementById('expense');

    if (incomeRadio.checked) {

        //clear out any previous values given if changes
        inputTrxAmount.value = "";
        inputTrxAmount.style.border = "2px solid #ced4da";
        transactionObj.amount = null;

        transactionObj.trx_category_id = null;

        labelToOrFrom.innerText = "To :";

        toWalletRadioLabel.innerText = "To Wallet";
        toAccountRadioLabel.innerText = "To an Account";

        const incomeCatList = ajaxGetRequest("/trxcat/income");
        fillDataIntoSelect(selectTrxCategory, "Please Select", incomeCatList, 'name');

        transactionObj.trx_type = incomeRadio.value;

        //enable all disabled input elements
        toWallet.disabled = false;
        toAccount.disabled = false;
        // selectTrxAccount.disabled = false;
        inputTrxAmount.disabled = false;
        inputTrxDate.disabled = false;
        selectTrxCategory.disabled = false;
        inputTrxDescription.disabled = false;


    } else if (expenseRadio.checked) {
        //clear out any previous values given if changes
        inputTrxAmount.value = "";
        inputTrxAmount.style.border = "2px solid #ced4da";

        transactionObj.trx_category_id = null;
        transactionObj.amount = null;

        labelToOrFrom.innerText = "From :";

        toWalletRadioLabel.innerText = "From Wallet";
        toAccountRadioLabel.innerText = "From an Account";

        const expenseCatList = ajaxGetRequest("/trxcat/expense");
        fillDataIntoSelect(selectTrxCategory, "Please Select", expenseCatList, 'name');

        transactionObj.trx_type = expenseRadio.value;

        //enable all disabled input elements
        toWallet.disabled = false;
        toAccount.disabled = false;
        // selectTrxAccount.disabled = false;
        inputTrxAmount.disabled = false;
        inputTrxDate.disabled = false;
        selectTrxCategory.disabled = false;
        inputTrxDescription.disabled = false;

    }
}

//trx is done from/to wallet or account
const toggleAccountSelection = () => {

    const accountSelectionId = document.getElementById('accountSelection');
    const toAccountopt = document.getElementById('toAccount');

    if (toAccountopt.checked) {
        //clear any previous selections
        selectTrxAccount.value = "";
        inputTrxAmount.value = "";
        selectTrxAccount.style.border = "2px solid #ced4da";
        inputTrxAmount.style.border = "2px solid #ced4da";
        accountSelectionId.classList.remove('d-none');

        //for backend
        transactionObj.is_involve_cashinhand = false;

    } else {
        //clear any previous selections
        accountSelectionId.classList.add('d-none');
        transactionObj.account_id = null;
        transactionObj.amount = null;
        inputTrxAmount.style.border = "2px solid #ced4da";

        //for backend
        transactionObj.is_involve_cashinhand = true;

        passCurrentBalance();
    }
}

//validate to prevent spending more than the max amount
const validateTrxAmount = () => {

    const incomeRadio = document.getElementById('income');
    const expenseRadio = document.getElementById('expense');

    let trxAmount = parseFloat(inputTrxAmount.value);
    let cashInhandBal = loggedUserObject.cash_in_hand;

    if (expenseRadio.checked && toAccount.checked) {

        let selectedAcc = JSON.parse(selectTrxAccount.value);
        let crntBalInAcc = selectedAcc.balance;

        if (trxAmount > crntBalInAcc) {

            console.log("Transfer amount exceeds the account balance");
            transactionObj.amount = null;
            inputTrxAmount.style.border = "2px solid red";
            console.log(transactionObj.amount);

        } else {

            transactionObj.amount = inputTrxAmount.value;
            inputTrxAmount.style.border = "2px solid lime";
            console.log(transactionObj.amount);

        }

    } else if (expenseRadio.checked && toWallet.checked) {

        if (trxAmount > cashInhandBal) {

            inputTrxAmount.style.border = "2px solid red";
            transactionObj.amount = null;
            console.log("Transfer amount exceeds the cash in hand balance");
            console.log(transactionObj.amount);

        } else {

            transactionObj.amount = inputTrxAmount.value;
            inputTrxAmount.style.border = "2px solid lime";
            console.log(transactionObj.amount);

        }
    } else if (incomeRadio.checked && toWallet.checked) {

        if (trxAmount > cashInhandBal) {

            inputTrxAmount.style.border = "2px solid red";
            transactionObj.amount = null;
            console.log("Transfer amount exceeds the cash in hand balance");
            console.log(transactionObj.amount);

        } else {

            transactionObj.amount = inputTrxAmount.value;
            inputTrxAmount.style.border = "2px solid lime";
            console.log(transactionObj.amount);

        }
    } else if (incomeRadio.checked && toAccount.checked) {
        let selectedAcc = JSON.parse(selectTrxAccount.value);
        let crntBalInAcc = selectedAcc.balance;

        if (trxAmount > crntBalInAcc) {

            console.log("Transfer amount exceeds the account balance");
            transactionObj.amount = null;
            inputTrxAmount.style.border = "2px solid red";
            console.log(transactionObj.amount);

        } else {

            transactionObj.amount = inputTrxAmount.value;
            inputTrxAmount.style.border = "2px solid lime";
            console.log(transactionObj.amount);

        }
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