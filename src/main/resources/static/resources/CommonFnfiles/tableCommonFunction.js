//create function fill data into table -- with button
const fillDataIntoTable = (tableID, dataList, columnsList, editFunction, deleteFuntion, printFunction, buttonVisibility = true) => {

    const tableBody = tableID.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1; 
        tr.appendChild(tdIndex);

        columnsList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });
        const tdButton = document.createElement('td');

        const buttonEdit = document.createElement('button');
        buttonEdit.className = 'btn btn-warning fw-bold'
        buttonEdit.innerText = 'Edit';
        tdButton.appendChild(buttonEdit);
        buttonEdit.onclick = function () {
            editFunction(element, index);
        }


        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn ms-2 me-2 fw-bold';
        buttonDelete.innerHTML = '<i class="fa-solid fa-trash fa-beat"></i>';
        buttonDelete.onclick = function () {

            deleteFuntion(element, index);
        }
        tdButton.appendChild(buttonDelete);

        const buttonPrint = document.createElement('button');
        buttonPrint.className = 'btn btn-outline-info fw-bold';
        buttonPrint.innerHTML = '<i class="fa-solid fa-eye"></i> Print';
        tdButton.appendChild(buttonPrint);
        buttonPrint.onclick = function () {
            printFunction(element, index);
        }


        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }


        tableBody.appendChild(tr);

    });

}

//create function fill data into table -- with dorpdown
const fillDataIntoTable2 = (tableID, dataList, columnsList, editFunction, deleteFuntion, printFunction) => {

    const tableBody = tableID.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1; tr.appendChild(tdIndex);

        columnsList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });
        const tdButton = document.createElement('td');
        tdButton.className = 'text-center';

        const dropDownDiv = document.createElement('div');
        dropDownDiv.className = 'dropdown';

        const dropdownI = document.createElement('i');
        dropdownI.className = 'fa-solid fa-ellipsis-vertical';
        dropdownI.setAttribute('data-bs-toggle', 'dropdown');
        dropdownI.setAttribute('aria-expanded', 'false');

        const dropdownUl = document.createElement('ul');
        dropdownUl.className = 'dropdown-menu';

        const dropdownMenuLiEdit = document.createElement('li');
        dropdownMenuLiEdit.className = 'dropdown-item';

        const buttonEdit = document.createElement('button');
        buttonEdit.className = 'btn btn-outline-warning w-100 fw-bold'
        buttonEdit.innerHTML = '<i class="fa-solid fa-edit fa-beat"></i> Edit';

        buttonEdit.onclick = function () {
            editFunction(element, index);
        }

        dropdownMenuLiEdit.appendChild(buttonEdit);

        const dropdownMenuLiDelete = document.createElement('li');
        dropdownMenuLiDelete.className = 'dropdown-item';

        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn btn-outline-danger w-100 fw-bold';
        buttonDelete.innerHTML = '<i class="fa-solid fa-trash fa-beat"></i> Delete';
        buttonDelete.onclick = function () {
            // console.log('delete');
            // confirm('Are you sure to delete following employee')
            deleteFuntion(element, index);
        }
        dropdownMenuLiDelete.appendChild(buttonDelete);

        const dropdownMenuLiPrint = document.createElement('li');
        dropdownMenuLiPrint.className = 'dropdown-item';

        const buttonPrint = document.createElement('button');
        buttonPrint.className = 'btn btn-outline-info w-100 fw-bold';
        buttonPrint.innerHTML = '<i class="fa-solid fa-eye fa-beat"></i> Print';
        buttonPrint.onclick = function () {
            printFunction(element, index);
        }

        dropdownMenuLiPrint.appendChild(buttonPrint);

        dropdownUl.appendChild(dropdownMenuLiEdit);
        dropdownUl.appendChild(dropdownMenuLiDelete);
        dropdownUl.appendChild(dropdownMenuLiPrint);

        dropDownDiv.appendChild(dropdownI);
        dropDownDiv.appendChild(dropdownUl);

        tdButton.appendChild(dropDownDiv);
        tr.appendChild(tdButton);

        tableBody.appendChild(tr);

    });

}

//create function fill data into table -- with radio ✅✅✅
const fillDataIntoTable3 = (tableID, dataList, columnsList, buttonVisibility = true, disableButtonsCommonFn) => {

    const tableBody = tableID.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        columnsList.forEach(column => {
            const td = document.createElement('td');
            td.classList.add('text-center');
            td.classList.add('justify-content-center');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            if (column.dataType === 'button') {
                const btn = document.createElement('button');
                btn.classList.add('btn', 'btn-primary');
                btn.textContent = 'Click To View';
                btn.addEventListener('click', () => {
                    column.propertyName(element);
                });
                td.appendChild(btn);
            }

            if (column.dataType == 'imgArray') {
                let img = document.createElement('img');
                img.style.width = '70px';
                img.style.height = '70px';
                if (element[column.propertyName] != null) {
                    img.src = atob(element[column.propertyName]);
                } else {
                    img.src = "resources/images/sigiriya.jpg"
                }

                td.appendChild(img);
            }

            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');
        tdButton.className = 'text-center';

        const inputRadio = document.createElement('input');
        inputRadio.className = 'form-check-input mt-1'
        inputRadio.name = 'modify';
        inputRadio.type = 'radio';

        //radio btn eka click kalama me welawe click karana row eke thiyana emp record eka + eyage row eka dagannawa global accessible window object ekata

        //window object eke property names thamay editOb and editRow kiyanne
        //window,editOb = element kiyala thibbath same
        //brackets use karanne names walata special characters thiyeddi window[new prop name] = element
        inputRadio.onchange = function () {
            window['editOb'] = element;
            window['editRow'] = index;
            divModify.className = 'd-block float-end';
        }

        //element = window['sssfs] kiyala thibba nam ssssfs eke thiyana value eka element var ekata assign wenawa

        tdButton.appendChild(inputRadio);

        if (buttonVisibility) {
            tr.appendChild(tdButton);
        }

        tableBody.appendChild(tr);

        //checking privileges/authorizations
        // if (!userPrivilege.privupdate) {
        //     btnEdit.disabled = true;
        //     btnEdit.style.cursor = "not-allowed"
        // }

        // if (!userPrivilege.privdelete) {
        //     btnDelete.disabled = true;
        //     btnDelete.style.cursor = "not-allowed"
        // }
        // if (!userPrivilege.privselect) {
        //     btnPrint.disabled = true;
        //     btnPrint.style.cursor = "not-allowed"
        // }   
    });

}

const fillDataIntoTable4 = (tableID, dataList, columnsList, buttonVisibility = true) => {

    const tableBody = tableID.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1; tr.appendChild(tdIndex);

        columnsList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });


        if (buttonVisibility) {
            tr.onclick = function () {

                window['editOb'] = element;
                window['editRow'] = index;
                divModify.className = 'd-block';

            }

            const buttonDelete = document.createElement('button');
            buttonDelete.className = 'btn ms-2 me-2 fw-bold';
            buttonDelete.innerHTML = '<i class="fa-solid fa-trash fa-beat"></i>';
            buttonDelete.onclick = function () {
                // console.log('delete');
                // confirm('Are you sure to delete following employee')
                deleteFuntion(element, index);
            }
            tdButton.appendChild(buttonDelete);

        }


        tableBody.appendChild(tr);

    });

}


//create function fill data into table -- row onclick with modal
const fillDataIntoTable5 = (tableID, dataList, columnsList, editFunction, buttonVisibility = true) => {

    const tableBody = tableID.children[1];
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {

        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1; tr.appendChild(tdIndex);

        columnsList.forEach(column => {
            const td = document.createElement('td');

            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });


        if (buttonVisibility) {
            tr.onclick = function () {
                editFunction(element, index)
                window['editOb'] = element;
                window['editRow'] = index;
                divModify.className = 'd-block';
            }

        }

        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn ms-2 me-2 fw-bold';
        buttonDelete.innerHTML = '<i class="fa-solid fa-trash fa-beat"></i>';
        buttonDelete.onclick = function () {
            // console.log('delete');
            // confirm('Are you sure to delete following employee')
            deleteFuntion(element, index);
        }
        tdButton.appendChild(buttonDelete);


        tableBody.appendChild(tr);

    });

}
