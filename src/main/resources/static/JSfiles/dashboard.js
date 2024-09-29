window.addEventListener('load', () => {

    //get the logged users user profile
    let userID = loggedUserIdHiddenValueID.innerText;
    window['loggedUserObject'] = ajaxGetRequest("/user/byid/" + userID);

    refreshAccCards();
    refreshAddAccForm();
    refreshCashInHandEditForm();
    refreshTrxForm();

    displayTrxList();

});

// ======CASH IN HAND=======
//for thr cash in hand edit form
const refreshCashInHandEditForm = () => {

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
            refreshCashInHandEditForm();
            window.location.reload();

        } else {
            alert("An error occured \n" + putServiceResponse);
        }
    } else {
        alert("Operation cancelled by the Operator");
    }
};
// ======CASH IN HAND=======



// ======NEW ACCOUNT=======
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
        spanBalance.innerText = account.balance;
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
        button.className = "btn btn-primary";
        button.type = "button";
        button.innerText = "Edit Amount";
        button.onclick = function () {
            // Add function to handle edit
            editAmount(account.acc_id);
        };
        buttonDiv.appendChild(button);
        cardBody.appendChild(buttonDiv);

        cardDiv.appendChild(cardHeader);
        cardDiv.appendChild(cardBody);
        mainCol.appendChild(cardDiv);

        sectionAccCardList.appendChild(mainCol);
    });

    // If fewer than 3 accounts, show the "Add New Account" card dynamically
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

        // const h2Title = document.createElement('h2');
        // h2Title.className = "card-title";
        // h2Title.innerText = "Your Account Balance";
        // cardBody.appendChild(h2Title);

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
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#modalAddNewAccount");
        buttonDiv.appendChild(button);
        cardBody.appendChild(buttonDiv);

        // Append card body to cardDiv
        cardDiv.appendChild(cardBody);

        // Append cardDiv to addNewAccountCard
        addNewAccountCard.appendChild(cardDiv);

        // Add the "Add New Account" card to the card section
        sectionAccCardList.appendChild(addNewAccountCard);
    }
};

//refresh new account form
const refreshAddAccForm = () => {

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
            refreshAddAccForm();
            window.location.reload();

        } else {
            alert("An error occured \n" + postServiceResponse);
        }
    } else {
        alert("Operation cancelled by the Operator");
    }
};
// ======NEW ACCOUNT=======



// ======TRX RECORDS=======
//setting the form
const refreshTrxForm = () => {

    transactionObj = new Object;

    //get acc list by user id
    let userID = loggedUserIdHiddenValueID.innerText;
    accListByUser = ajaxGetRequest("/account/byuserid/" + userID);
    fillDataIntoSelect(selectTrxAccount, "Select Account", accListByUser, 'acc_display_name')
    console.log(accListByUser);

}

// add new income record
const submitNewTransaction = () => {
    const userConfirm = confirm("Are You Sure To Save ?");
    if (userConfirm) {

        let postServiceResponse = ajaxRequest('/trx/save', 'POST', transactionObj)
        if (postServiceResponse == "OK") {
            alert('successfully saved');
            $('#modalAddNewTrxRec').modal('hide');
            formAddNewTransaction.reset();
            refreshTrxForm();
            window.location.reload();

        } else {
            alert("An error occured \n" + postServiceResponse);
        }
    } else {
        alert("Operation cancelled by the Operator");
    }
}

//changes depend on income/outcome
const changeTrxCatList = () => {

    const incomeRadio = document.getElementById('income');
    const expenseRadio = document.getElementById('expense');

    if (incomeRadio.checked) {

        const inputAmount = document.getElementById('inputTrxAmount');
        inputAmount.disabled = false;

        const incomeCatList = ajaxGetRequest("/trxcat/income");
        fillDataIntoSelect(selectTrxCategory, "Please Select", incomeCatList, 'name');

        transactionObj.trx_type = incomeRadio.value;
        console.log(incomeRadio.value);

    } else if (expenseRadio.checked) {

        const inputAmount = document.getElementById('inputTrxAmount');
        inputAmount.disabled = false;

        const expenseCatList = ajaxGetRequest("/trxcat/expense");
        fillDataIntoSelect(selectTrxCategory, "Please Select", expenseCatList, 'name');

        transactionObj.trx_type = expenseRadio.value;
        console.log(expenseRadio.value);
    }
}

//trx is done from/to wallet or account
const toggleAccountSelection = () => {

    const accountSelectionId = document.getElementById('accountSelection');
    const toAccountopt = document.getElementById('toAccount');

    if (toAccountopt.checked) {
        accountSelectionId.classList.remove('d-none');
        transactionObj.is_from_cashinhand = false;

    } else {
        accountSelectionId.classList.add('d-none');
        transactionObj.account_id = null;
        transactionObj.is_from_cashinhand = true;
    }
}

//display trx list
const displayTrxList = () => {
    let userID = loggedUserIdHiddenValueID.innerText;
    let trxListByUser = ajaxGetRequest("/trx/byuser/" + userID);

    trxListDisplayContainer.innerHTML = '';
    trxListByUser.forEach(trx => {

        let toOrFrom;
        let plusOrMinus;
        let classes ;

        if (trx.trx_type == "INCOME") {
            toOrFrom = "To";
            plusOrMinus = "+ ";
            classes = "col-3 text-success fw-bold text-end";

        } else {
            toOrFrom = "From";
            plusOrMinus = "- ";
            classes = "col-3 text-danger fw-bold text-end" ;
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
        account.textContent = `${toOrFrom} : ${trx.account_id.acc_display_name}`;

        //space col-1
        const emptySpace = document.createElement('div');
        emptySpace.classList.add('col-1')

        //amount col-3
        const amountDiv = document.createElement('div');
        amountDiv.className = classes ;
        amountDiv.textContent = `${plusOrMinus} ${parseFloat(trx.amount).toFixed(2)}`;


        // amountDiv.innerText = trx.amount;

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

const refreshTransferForm =()=>{

}

//======TRANSFER======