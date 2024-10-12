window.addEventListener('load', () => {

    let userID = loggedUserIdHiddenValueID.innerText;
    window['loggedUserObject'] = ajaxGetRequest("/user/byid/" + userID);

    //get the acc list by user
    accListByUser = ajaxGetRequest("/account/byuserid/" + userID);

    //add "physical wallet" to the same account list in filters
    let physicalWallet = {
        acc_display_name: "Physical Wallet",
        id: -10
    }
    accListByUser.unshift(physicalWallet);

    //add "all" option 
    let allOption = {
        acc_display_name: "All",
        id: -12
    }
    accListByUser.unshift(allOption);

    fillDataIntoSelect(accountFilter, "Select Account", accListByUser, 'acc_display_name')

    displayTrxs();
});

//global vars to be used later
let selectedTransaction, previouslySelectedRow;

//display main trx table(all)
const displayTrxs = () => {
    let userID = loggedUserIdHiddenValueID.innerText;
    let allTrxListByUser = ajaxGetRequest("/alltrx/byuser/" + userID);
    console.log(allTrxListByUser);

    $('#allTrxListDisplayContainer').empty();

    allTrxListByUser.forEach((trx, index) => {

        let toOrFrom, plusOrMinus, classes;

        if (trx.trx_type === "INCOME") {
            toOrFrom = "To";
            plusOrMinus = "+ ";
            classes = "fw-bold";
        } else {
            toOrFrom = "From";
            plusOrMinus = "- ";
            classes = "text-danger fw-bold";
        }

        //will be used later in accountCell
        let accDisplayName = trx.is_involve_cashinhand ? "Cash In Hand" : trx.account_id.acc_display_name;

        // Create table row
        const row = document.createElement('tr');

        // Date cell
        const dateCell = document.createElement('td');
        dateCell.innerText = trx.trx_date;

        // Category cell
        const categoryCell = document.createElement('td');
        categoryCell.innerText = trx.trx_category_id.name;

        // Account cell
        const accountCell = document.createElement('td');
        accountCell.innerText = `${toOrFrom} : ${accDisplayName}`;

        // Amount cell
        const amountCell = document.createElement('td');
        amountCell.className = classes;
        if (trx.trx_type === "INCOME") {
            amountCell.style.color = "lime";
        }
        amountCell.innerText = `${plusOrMinus} ${parseFloat(trx.amount).toFixed(2)}`;

        if (trx.trx_category_id.name !== "Internal Transfer") {
            //row onclick
            row.onclick = function () {
                if (previouslySelectedRow) {
                    previouslySelectedRow.classList.remove('highlight');
                }
                row.classList.add('highlight');
                previouslySelectedRow = row;

                selectedTransaction = trx;

                openEditTrxCanvas(selectedTransaction);

            };

            //row onmouseover
            const hoverTextTransaction = document.getElementById('hoverTextTrx');
            row.onmouseover = function (event) {
                hoverTextTransaction.style.display = 'block';
                hoverTextTransaction.style.left = event.pageX + 'px';
                hoverTextTransaction.style.top = event.pageY + 'px';
            }

            //row onmouseout
            row.onmouseout = function () {
                hoverTextTransaction.style.display = 'none';
            }

        } else {
            row.classList.remove('highlight');

            const hoverTextTransfer = document.getElementById('hoverTextTrfr');
            row.onmouseover = function (event) {
                hoverTextTransfer.style.display = 'block';
                hoverTextTransfer.style.left = event.pageX + 'px';
                hoverTextTransfer.style.top = event.pageY + 'px';
            }
            row.onmouseout = function () {
                hoverTextTransfer.style.display = 'none';
            }

        }

        // Append cells to the row
        row.appendChild(dateCell);
        row.appendChild(categoryCell);
        row.appendChild(accountCell);
        row.appendChild(amountCell);

        document.getElementById('allTrxListDisplayContainer').appendChild(row);
    });

    $('#allTrxTable').DataTable({
        destroy: true, // Allows re-initialization
        paging: true,  // Enable pagination
        searching: false, // Remove the search bar
        info: false, // Show entries count
        pageLength: 10, // Number of rows per page
        lengthChange: false, // Disable ability to change the number of rows
        ordering: false  // Remove up and down arrows
    });

}

//open canvas with already refilled form
const openEditTrxCanvas = (ob) => {

    transactionObj = JSON.parse(JSON.stringify(ob));

    refreshEditTrxForm();

    document.getElementById("inputTrxAmount").value = parseFloat(transactionObj.amount).toFixed(2);

    document.getElementById("inputTrxDate").value = transactionObj.trx_date;

    const incomeCatList = ajaxGetRequest("/trxcat/income");
    const expenseCatList = ajaxGetRequest("/trxcat/expense");

    document.getElementById("inputTrxDescription").value = transactionObj.description || "";

    if (transactionObj.trx_type === "INCOME") {

        document.getElementById("income").checked = true;
        document.getElementById("toWallet").disabled = false;
        document.getElementById("toAccount").disabled = false;
        fillDataIntoSelect(selectTrxCategory, "Please Select", incomeCatList, 'name', transactionObj.trx_category_id.name);

    } else {

        document.getElementById("expense").checked = true;
        document.getElementById("toWallet").disabled = false;
        document.getElementById("toAccount").disabled = false;
        fillDataIntoSelect(selectTrxCategory, "Please Select", expenseCatList, 'name', transactionObj.trx_category_id.name);
    }

    if (transactionObj.is_involve_cashinhand) {
        transactionObj.is_involve_cashinhand = true;
        document.getElementById("toWallet").checked = true;
        document.getElementById("accountSelection").classList.add('d-none');
    } else {
        document.getElementById("toAccount").checked = true;
        document.getElementById("accountSelection").classList.remove('d-none');

        let userID = loggedUserIdHiddenValueID.innerText;
        accListByUser = ajaxGetRequest("/account/byuserid/" + userID);
        fillDataIntoSelect(selectTrxAccount, "Select Account", accListByUser, 'acc_display_name', transactionObj.account_id.acc_display_name)

    }

    $('#offcanvasEditTrx').offcanvas('show');
}

//to clear out any previous values, borders >> will be called in openEditCanvas()
const refreshEditTrxForm = () => {

    let userID = loggedUserIdHiddenValueID.innerText;
    accListByUser = ajaxGetRequest("/account/byuserid/" + userID);

    inputTrxAmount.value = ""
    inputTrxAmount.style.border = "2px solid #ced4da";

    inputTrxDate.value = ""
    inputTrxDate.style.border = "2px solid #ced4da";

    selectTrxAccount.value = ""
    selectTrxAccount.style.border = "2px solid #ced4da";
    fillDataIntoSelect(selectTrxAccount, "Select Account", accListByUser, 'acc_display_name')

    selectTrxCategory.value = ""
    selectTrxCategory.style.border = "2px solid #ced4da";

    inputTrxDescription.value = ""
    inputTrxDescription.style.border = "2px solid #ced4da";

    formEditTransaction.reset();

}

// add new trx record
const editTransaction = () => {
    const userConfirm = confirm("Are You Sure To Save ?");
    if (userConfirm) {

        let putServiceResponse = ajaxRequest('/trx/update', 'PUT', transactionObj)
        if (putServiceResponse == "OK") {
            alert('successfully Updated');
            $('#offcanvasEditTrx').offcanvas('hide');
            formEditTransaction.reset();
            window.location.reload();

        } else {
            alert("An error occured \n" + putServiceResponse);
        }
    } else {
        alert("Operation cancelled by the User");
    }
}

//date pickers display for filters
const displayDateFilters = (fieldId) => {

    var selectedValue = fieldId.value;
    var singleDateField = document.getElementById('singleDateField');
    var dateRangeFields = document.getElementById('dateRangeFields');

    // Hide all fields initially by adding d-none
    singleDateField.classList.add('d-none');
    dateRangeFields.classList.add('d-none');

    // Show the corresponding fields based on the selected value
    if (selectedValue === 'singleDate') {
        singleDateField.classList.remove('d-none');
    } else if (selectedValue === 'dateRange') {
        dateRangeFields.classList.remove('d-none');
    }
}

//fill category list based on this
const changesBasedOnTrxTypeVal = () => {

    let allOption = {
        name: "All",
        id: -12
    }

    switch (trxTypeFilter.value) {

        case "income":

            categoryFilter.disabled = false;
            const incomeCatList = ajaxGetRequest("/trxcat/income");
            incomeCatList.unshift(allOption);
            fillDataIntoSelect(categoryFilter, "Please Select", incomeCatList, 'name');

            break;

        case "expense":

            categoryFilter.disabled = false;
            const expenseCatList = ajaxGetRequest("/trxcat/expense");
            expenseCatList.unshift(allOption);
            fillDataIntoSelect(categoryFilter, "Please Select", expenseCatList, 'name');

            break;

        case "all":
            categoryFilter.disabled = true;

    }
}

//to reset filters to default
const resetFilters = () => {
    // Reset date filter to default
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('singleDateField').classList.add('d-none');
    document.getElementById('dateRangeFields').classList.add('d-none');
    document.getElementById('monthYearFields').classList.add('d-none');

    // Reset transaction type filter
    document.getElementById('trxTypeFilter').value = 'all';

    // Reset account filter
    document.getElementById('accountFilter').value = 'all';

    // Reset category filter
    document.getElementById('categoryFilter').value = 'all';
}

//for apply filter button
const getTrxRecsByFilters = () => {

    //all trx list without any filters
    let userID = loggedUserIdHiddenValueID.innerText;
    let allTrxListByUser = ajaxGetRequest("/alltrx/byuser/" + userID);

    //date related selects, except option 'ALL'
    let singleDateVal = document.getElementById('singleDate').value;
    let startDateVal = document.getElementById('startDate').value;
    let endDateVal = document.getElementById('endDate').value;
    // let monthVal = document.getElementById('monthSelect').value;
    // let yearVal = document.getElementById('yearSelect').value;

    //other selects, except option 'ALL'
    let trxtypeVal = document.getElementById('trxTypeFilter').value;
    let accountVal = document.getElementById('accountFilter').value;
    let categotyVal = document.getElementById('categoryFilter').value;



}

/**SELECT * FROM financeappdb.trx 
WHERE MONTH(trx_date) = MONTH(CURDATE()) AND YEAR(trx_date) = YEAR(CURDATE());
 */



/*Option 1 (Dark and Muted Blue):

Hover: #3a3a3a (dark gray)
Highlight: #4A7A8C (muted blue-gray)
Option 2 (Elegant Dark Cyan):

Hover: #404040 (slate gray)
Highlight: #2C6F91 (dark cyan)
Option 3 (Deep Navy and Gray):

Hover: #484848 (charcoal gray)
Highlight: #2B4A6F (deep navy)*/

/**function openNav() {
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
mainArea.setAttribute('style','margin-left: 300px;')
}
} */
