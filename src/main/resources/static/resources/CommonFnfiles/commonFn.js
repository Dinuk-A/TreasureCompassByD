//old set
function openNav() {
    var sidebar = document.getElementById("dashboardSidebarID");
    var mainArea = document.getElementById("mainAreaID");

    if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        sidebar.style.width = "0px";
        mainArea.style.marginLeft = "0px";
    } else {
        sidebar.classList.add("open");
        sidebar.style.width = "300px";
        // mainArea.style.marginLeft = "300px"; 
        mainArea.setAttribute('style', 'margin-left: 300px;')
    }
}

//fn for GET mappings
const ajaxGetRequest = (url) => {

    let getResponse;

    $.ajax(url, {
        type: "GET",
        contentType: "json",
        async: false,

        success: function (data) {

            // console.log(url);
            // console.log(data);
            getResponse = data;

        },

        error: function (resOb) {
            console.log("get common fn failed");
            console.log(url);
            console.log(resOb);
            getResponse = [];
        }
    });

    return getResponse;

}

//fn for post/put/delete services
const ajaxRequest = (url, method, object) => {

    let serviceRequestResponse;
    $.ajax(url, {
        type: method,
        data: JSON.stringify(object),
        contentType: "application/json",
        async: false,

        success: function (data) {
            console.log(url + "\n" + "success");
            serviceRequestResponse = data;

        },
        error: function (resOb) {
            console.log(resOb);
            serviceRequestResponse = resOb
        }
    });


    return serviceRequestResponse;
}

//define fn for fill data into select element

const fillDataIntoSelect = (fiedId, msg, dataList, propertyName, selectedValue) => {
    fiedId.innerHTML = '';

    //penna one msg eka hadagannawa
    if (msg != "") {
        const optionMsg = document.createElement('option');
        optionMsg.innerText = msg;
        optionMsg.value = "";
        optionMsg.selected = 'selected';
        optionMsg.disabled = 'disabled';
        fiedId.appendChild(optionMsg);
    }

    dataList.forEach(element => {
        const options = document.createElement('option');
        options.innerText = element[propertyName];
        options.value = JSON.stringify(element); //JSON STRING 1K SE KARAGANNA ONE NISA...select element wala option wala value
        //thiyenne string walin.. this is an dynamic dropdown, data comes from back end, forein key ekak awama hadenne, 

        if (selectedValue == element[propertyName]) {
            options.selected = "selected";
        }


        fiedId.appendChild(options);

    });
}

//DISPLAY 2 PROPERTIES
const fillDataIntoSelect2 = (fiedId, msg, dataList, propertyName1, propertyName2, selectedValue) => {

    fiedId.innerHTML = '';

    //penna one msg eka hadagannawa
    const optionMsg = document.createElement('option');
    optionMsg.innerText = msg;
    optionMsg.selected = 'selected';
    optionMsg.disabled = 'disabled';
    fiedId.appendChild(optionMsg);

    dataList.forEach(element => {
        const options = document.createElement('option');
        options.innerText = element[propertyName1] + "     " + element[propertyName2];

        options.value = JSON.stringify(element); //JSON STRING 1K SE KARAGANNA ONE NISA...select element wala option wala value
        //thiyenne string walin.. this is an dynamic dropdown, data comes from back end, forein key ekak awama hadenne, 

        if (selectedValue == element[propertyName2]) {
            options.selected = "selected";
        }


        fiedId.appendChild(options);

    });
}

//restrict future dates
const disableFutureDates = (calenderID) => {

    currentDate = new Date();
    let [date, time] = currentDate.toISOString().split('T');
    calenderID.max = date

}


//new set 
//changes depend on income/outcome
const changesBasedOnTrxType = () => {

    const incomeRadio = document.getElementById('income');
    const expenseRadio = document.getElementById('expense');

    if (incomeRadio.checked) {

        //clear out any previous values given if changes
        inputTrxAmount.value = "";
        inputTrxAmount.style.border = "2px solid #ced4da";
        selectTrxAccount.value = "";
        selectTrxAccount.style.border = "2px solid #ced4da";
        selectTrxCategory.style.border = "2px solid #ced4da";
        transactionObj.trx_category_id = null;
        transactionObj.amount = null;
        transactionObj.account_id = null;

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
        selectTrxAccount.value = "";
        selectTrxAccount.style.border = "2px solid #ced4da";
        selectTrxCategory.style.border = "2px solid #ced4da";
        transactionObj.trx_category_id = null;
        transactionObj.amount = null;
        transactionObj.account_id = null;

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

//validate to prevent spending more than the max amount
const validateTrxAmount = () => {

    const incomeRadio = document.getElementById('income');
    const expenseRadio = document.getElementById('expense');

    let trxAmount = parseFloat(inputTrxAmount.value);
    let cashInhandBal = loggedUserObject.cash_in_hand;

    if (expenseRadio.checked) {

        if (toAccount.checked) {
            let selectedAcc = JSON.parse(selectTrxAccount.value);
            let crntBalInAcc = selectedAcc.balance;

            if (trxAmount > crntBalInAcc || trxAmount <= 0 || isNaN(trxAmount)) {
                console.log("Transfer amount exceeds the account balance or invalid amount");
                transactionObj.amount = null;
                inputTrxAmount.style.border = "2px solid red";
            } else {
                transactionObj.amount = inputTrxAmount.value;
                inputTrxAmount.style.border = "2px solid lime";
            }
        }

        else if (toWallet.checked) {
            if (trxAmount > cashInhandBal || trxAmount <= 0 || isNaN(trxAmount)) {
                console.log("Transfer amount exceeds the cash in hand balance or invalid amount");
                transactionObj.amount = null;
                inputTrxAmount.style.border = "2px solid red";
            } else {
                transactionObj.amount = inputTrxAmount.value;
                inputTrxAmount.style.border = "2px solid lime";
            }
        }
    }

    else if (incomeRadio.checked) {

        if (toAccount.checked) {
            let selectedAcc = JSON.parse(selectTrxAccount.value);
            let crntBalInAcc = selectedAcc.balance;

            if (trxAmount <= 0 || isNaN(trxAmount)) {
                console.log("Invalid income amount");
                transactionObj.amount = null;
                inputTrxAmount.style.border = "2px solid red";
            } else {
                transactionObj.amount = inputTrxAmount.value;
                inputTrxAmount.style.border = "2px solid lime";
            }
        }

        else if (toWallet.checked) {
            if (trxAmount <= 0 || isNaN(trxAmount)) {
                console.log("Invalid income amount");
                transactionObj.amount = null;
                inputTrxAmount.style.border = "2px solid red";
            } else {
                transactionObj.amount = inputTrxAmount.value;
                inputTrxAmount.style.border = "2px solid lime";
            }
        }
    }
}

