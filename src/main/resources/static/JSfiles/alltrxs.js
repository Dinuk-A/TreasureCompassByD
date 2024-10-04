window.addEventListener('load', () => {

    let userID = loggedUserIdHiddenValueID.innerText;
    window['loggedUserObject'] = ajaxGetRequest("/user/byid/" + userID);

    displayTrxs();

});

//global vars to be used later
let selectedTransaction, previouslySelectedRow;

//display main trx table(all)
const displayTrxs = () => {
    let userID = loggedUserIdHiddenValueID.innerText;
    let allTrxListByUser = ajaxGetRequest("/alltrx/byuser/" + userID);

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


//original
const displayTrxsOri = () => {
    let userID = loggedUserIdHiddenValueID.innerText;
    let allTrxListByUser = ajaxGetRequest("/alltrx/byuser/" + userID);

    allTrxListByUser.forEach(trx => {
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

        allTrxListDisplayContainer.appendChild(row);
    });


}

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
