window.addEventListener('load', () => {

    displayTrxs();

});

let selectedTransaction, previouslySelectedRow;

const displayTrxs = () => {
    let userID = loggedUserIdHiddenValueID.innerText;
    let allTrxListByUser = ajaxGetRequest("/alltrx/byuser/" + userID);

    $('#allTrxListDisplayContainer').empty();

    allTrxListByUser.forEach((trx, index) => {

        let toOrFrom, plusOrMinus, classes;

        if (trx.trx_type == "INCOME") {
            toOrFrom = "To";
            plusOrMinus = "+ ";
            classes = " fw-bold";
        } else {
            toOrFrom = "From";
            plusOrMinus = "- ";
            classes = "text-danger fw-bold";
        }

        let accDisplayName = trx.is_involve_cashinhand ? "Cash In Hand" : trx.account_id.acc_display_name;

        // Create table row
        const row = document.createElement('tr');

        row.onclick = function () {
            if (previouslySelectedRow) {
                previouslySelectedRow.classList.remove('highlight');
            }
            row.classList.add('highlight');
            previouslySelectedRow = row;

            selectedTransaction = trx;
            editTrxButton.style.visibility = "visible";
            console.log(trx.amount);
        }


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
        if (trx.trx_type == "INCOME") {
            amountCell.style.color = "lime";
        }
        amountCell.innerText = `${plusOrMinus} ${parseFloat(trx.amount).toFixed(2)}`;

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
        lengthChange: false // Disable ability to change the number of rows
    });

    // click event to Edit button
    const editButton = document.getElementById("editTrxButton");
    editButton.addEventListener('click', () => {
        openEditModal();
    });
}

//fn for edit button
const openEditModal = () => {
    console.log("Edit modal opening...");

    // Populate the modal fields with the selected transaction data
    document.getElementById("inputTrxAmount").value = parseFloat(selectedTransaction.amount).toFixed(2);
    document.getElementById("inputTrxDate").value = selectedTransaction.trx_date;
    document.getElementById("inputTrxDescription").value = selectedTransaction.description || "";

    // Set radio buttons based on transaction type
    if (selectedTransaction.trx_type === "INCOME") {
        document.getElementById("income").checked = true;
        document.getElementById("toWallet").disabled = false;
        document.getElementById("toAccount").disabled = false;
    } else {
        document.getElementById("expense").checked = true;
        document.getElementById("toWallet").disabled = false;
        document.getElementById("toAccount").disabled = false;
    }

    // Set destination radio buttons
    if (selectedTransaction.is_involve_cashinhand) {
        document.getElementById("toWallet").checked = true;
        document.getElementById("accountSelection").style.display = 'none';
    } else {
        document.getElementById("toAccount").checked = true;
        document.getElementById("accountSelection").style.display = 'block';
        // Populate the account selection dropdown based on the selected transaction
        document.getElementById("selectTrxAccount").value = selectedTransaction.account_id.id; // Assuming account_id contains the selected account's id
    }

    // Show the modal
    $('#modalUpdateTrxRec').modal('show');
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

// $('#allTrxListDisplayContainer').on('click', 'tr', function () {
//     // Use DataTable to get the row node
//     const rowNode = $(this);

//     // Remove highlight from previously selected row
//     if (previouslySelectedRow) {
//         previouslySelectedRow.removeClass('highlight');
//     }

//     // Add highlight to the current row
//     rowNode.addClass('highlight');
//     previouslySelectedRow = rowNode; // Update the reference to the currently selected row

//     selectedTransaction = allTrxListByUser[rowNode.index()]; // Adjust this line to get the correct transaction
//     editTrxButton.style.visibility = "visible"; // Show the edit button
//     console.log(selectedTransaction.amount);
// });

// row.onclick = function () {
//     row.style.backgroundColor = "green";
//     selectedTransaction = trx;
//     editTrxButton.style.visibility = "visible";
//     console.log(trx.amount);
// }

/*Option 1 (Dark and Muted Blue):

Hover: #3a3a3a (dark gray)
Highlight: #4A7A8C (muted blue-gray)
Option 2 (Elegant Dark Cyan):

Hover: #404040 (slate gray)
Highlight: #2C6F91 (dark cyan)
Option 3 (Deep Navy and Gray):

Hover: #484848 (charcoal gray)
Highlight: #2B4A6F (deep navy)*/


