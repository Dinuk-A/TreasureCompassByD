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
        mainArea.setAttribute('style','margin-left: 300px;')
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
const disableFutureDates =(calenderID)=>{

    currentDate = new Date();
    let [date,time] = currentDate.toISOString().split('T');
    calenderID.max = date

}

//type and search example
const fillDataIntoDataList = (fieldId, dataList, propertyName) => {

    fieldId.innerHTML = '';

    for (const obj of dataList) {
        let option = document.createElement('option');
        option.value = obj[propertyName];

        fieldId.appendChild(option);
    }

}

// Custom alert function with embedded styles
const customAlert=(message, backgroundColor = '#fff', buttonColor = '#007bff', buttonTextColor = '#fff')=> {
        // Create the overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        overlay.style.zIndex = '999';

        // Create the alert box
        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '50%';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translate(-50%, -50%)';
        alertBox.style.backgroundColor = backgroundColor;
        alertBox.style.padding = '20px';
        alertBox.style.borderRadius = '8px';
        alertBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        alertBox.style.zIndex = '1000';
        alertBox.style.textAlign = 'center';

        // Create the message element
        const messageElement = document.createElement('div');
        messageElement.className = 'custom-alert-message';
        messageElement.textContent = message;
        messageElement.style.marginBottom = '20px';
        messageElement.style.fontSize = '16px';

        // Create the button
        const button = document.createElement('button');
        button.className = 'custom-alert-button';
        button.textContent = 'OK';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.color = buttonTextColor;
        button.style.backgroundColor = buttonColor;

        // Append elements to the alert box
        alertBox.appendChild(messageElement);
        alertBox.appendChild(button);

        // Append the alert box and overlay to the body
        document.body.appendChild(overlay);
        document.body.appendChild(alertBox);

        // Add click event to the button to close the alert
        button.addEventListener('click', () => {
            document.body.removeChild(alertBox);
            document.body.removeChild(overlay);
        });
    }

    
    
    

//old one💥
// //custom alerts
// window.alert = function (msg) {
//     const alert = document.createElement('div');
//     alert.classList.add('container', 'fade', 'show', 'p-0', 'w-50', 'd-flex', 'border', 'custom-alert', 'mt-2', 'rounded');
//     alert.innerHTML = `<div class="w-25">
//     <div class="w-100 h-100  p-2 d-flex align-items-center justify-content-center">
//         <img src="resources/images/info-alert.png" alt="icon" width="70%"> </div>
//         </div>
//         <div class="w-75">
//         <div class="row p-0 m-0 h-100">
//         <div class="col-10 d-flex align-items-center justify-content-center">
//             <div class=" p-2 ">${msg}</div>
//         </div>
//         <div class="col-2 text-end d-flex align-items-center justify-content-center">
//             <div class="p-2 text-end d-flex align-items-center justify-content-center" >
//                 <button id="confirmOKbtn" class="btn btn-primary btn-md mb-2 align-self-baseline" onclick=alert.remove();>OK</button>
//             </div>
//         </div>


//     </div>
// </div>
// </div>`



//     document.body.appendChild(alert);


// };

// const callAlert = (msg) => {
//     alert(msg);
// };

// window.alert = function (msg) {
//     const alert = document.createElement('div');
//     alert.classList.add('container', 'fade', 'show', 'p-0', 'w-50', 'd-flex', 'border', 'custom-alert', 'mt-2', 'rounded');
//     alert.innerHTML = `
//         <div class="w-25">
//             <div class="w-100 h-100 p-2 d-flex align-items-center justify-content-center">
//                 <img src="resources/images/info-alert.png" alt="icon" width="70%">
//             </div>
//         </div>
//         <div class="w-75 d-flex flex-column">
//             <div class="row p-0 m-0 flex-grow-1 d-flex align-items-center">
//                 <div class="col-10 d-flex align-items-center justify-content-center">
//                     <div class="p-2">${msg}</div>
//                 </div>
//                 <div class="col-2 text-end d-flex align-items-center justify-content-center">
//                     <div class="p-2 text-end">
//                         <button id="confirmOKbtn" class="btn btn-primary btn-md align-self-end"  onclick="this.closest('.container').remove();">OK</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;

//     document.body.appendChild(alert);
// };

// const callAlert = (msg) => {
//     alert(msg);
// };

// window.alert = function (msg) {
//     const alert = document.createElement('div');
//     alert.classList.add('container', 'fade', 'show', 'p-0', 'w-50', 'd-flex', 'border', 'custom-alert', 'mt-2', 'rounded', 'position-relative');
    
//     const leftDiv = document.createElement('div');
//     leftDiv.classList.add('w-25');
    
//     const leftInnerDiv = document.createElement('div');
//     leftInnerDiv.classList.add('w-100', 'h-100', 'p-2', 'd-flex', 'align-items-center', 'justify-content-center');
    
//     const img = document.createElement('img');
//     img.src = 'resources/images/info-alert.png';
//     img.alt = 'icon';
//     img.style.width = '70%';
    
//     leftInnerDiv.appendChild(img);
//     leftDiv.appendChild(leftInnerDiv);
//     alert.appendChild(leftDiv);
    
//     const rightDiv = document.createElement('div');
//     rightDiv.classList.add('w-75', 'd-flex', 'flex-column');
    
//     const msgRow = document.createElement('div');
//     msgRow.classList.add('row', 'p-0', 'm-0', 'flex-grow-1', 'd-flex', 'align-items-center');
    
//     const msgCol = document.createElement('div');
//     msgCol.classList.add('col-12', 'd-flex', 'align-items-center', 'justify-content-center');
    
//     const msgDiv = document.createElement('div');
//     msgDiv.classList.add('p-2');
//     msgDiv.textContent = msg;
    
//     msgCol.appendChild(msgDiv);
//     msgRow.appendChild(msgCol);
//     rightDiv.appendChild(msgRow);
    
//     const btnRow = document.createElement('div');
//     btnRow.classList.add('row', 'p-0', 'm-0');
    
//     const btnCol = document.createElement('div');
//     btnCol.classList.add('col-12', 'text-end', 'd-flex', 'align-items-center', 'justify-content-center');
    
//     const btnDiv = document.createElement('div');
//     btnDiv.classList.add('p-2', 'text-end');
    
//     const btn = document.createElement('button');
//     btn.id = 'confirmOKbtn';
//     btn.classList.add('btn', 'btn-primary', 'btn-md', 'mb-2');
//     btn.textContent = 'OK';
//     btn.onclick = function() {
//         alert.remove();
//     };
    
//     btnDiv.appendChild(btn);
//     btnCol.appendChild(btnDiv);
//     btnRow.appendChild(btnCol);
//     rightDiv.appendChild(btnRow);
    
//     alert.appendChild(rightDiv);
    
//     document.body.appendChild(alert);
// };

// const callAlert = (msg) => {
//     alert(msg);
// };



// const confirmOKbtn = document.getElementById('confirmOKbtn');
//     // confirmOKbtn = getElementById('confirmOKbtn');
//     confirmOKbtn.classList.add('custom-alert-button');
//     confirmOKbtn.onclick = function () {
//         alert.remove();
//     };


// window.alert = function (msg) {
//     // Create the main alert container
//     const alertContainer = document.createElement('div');
//     alertContainer.classList.add('container', 'fade', 'show', 'p-0', 'w-50', 'd-flex', 'border', 'custom-alert', 'mt-2', 'rounded', 'position-relative');
    
//     // Create the left section with the icon
//     const leftDiv = document.createElement('div');
//     leftDiv.classList.add('w-25');
    
//     const leftInnerDiv = document.createElement('div');
//     leftInnerDiv.classList.add('w-100', 'h-100', 'p-2', 'd-flex', 'align-items-center', 'justify-content-center');
    
//     const img = document.createElement('img');
//     img.src = 'resources/images/info-alert.png';
//     img.alt = 'icon';
//     img.style.width = '70%';
    
//     leftInnerDiv.appendChild(img);
//     leftDiv.appendChild(leftInnerDiv);
//     alertContainer.appendChild(leftDiv);
    
//     // Create the right section with the message and button
//     const rightDiv = document.createElement('div');
//     rightDiv.classList.add('w-75', 'd-flex', 'flex-column');
    
//     const msgRow = document.createElement('div');
//     msgRow.classList.add('row', 'p-0', 'm-0', 'flex-grow-1', 'd-flex', 'align-items-center');
    
//     const msgCol = document.createElement('div');
//     msgCol.classList.add('col-12', 'd-flex', 'align-items-center', 'justify-content-center');
    
//     const msgDiv = document.createElement('div');
//     msgDiv.classList.add('p-2');
//     msgDiv.textContent = msg;
    
//     msgCol.appendChild(msgDiv);
//     msgRow.appendChild(msgCol);
//     rightDiv.appendChild(msgRow);
    
//     const btnRow = document.createElement('div');
//     btnRow.classList.add('row', 'p-0', 'm-0');
    
//     const btnCol = document.createElement('div');
//     btnCol.classList.add('col-12', 'text-end', 'd-flex', 'align-items-center', 'justify-content-center');
    
//     const btnDiv = document.createElement('div');
//     btnDiv.classList.add('p-2', 'text-end');
    
//     const btn = document.createElement('button');
//     btn.id = 'confirmOKbtn';
//     btn.classList.add('btn', 'btn-primary', 'btn-md', 'mb-2');
//     btn.textContent = 'OK';
//     btn.onclick = function() {
//         alertContainer.remove();
//     };
    
//     btnDiv.appendChild(btn);
//     btnCol.appendChild(btnDiv);
//     btnRow.appendChild(btnCol);
//     rightDiv.appendChild(btnRow);
    
//     alertContainer.appendChild(rightDiv);
    
//     // Append the alert container to the body
//     document.body.appendChild(alertContainer);
// };

// const callAlert = (msg) => {
//     alert(msg);
// };

// function customConfirm(message, backgroundColor = '#fff', yesButtonColor = '#28a745', noButtonColor = '#dc3545', buttonTextColor = '#fff') {
    //     return new Promise((resolve) => {
    //         // Create the overlay
    //         const overlay = document.createElement('div');
    //         overlay.className = 'custom-confirm-overlay';
    //         overlay.style.position = 'fixed';
    //         overlay.style.top = '0';
    //         overlay.style.left = '0';
    //         overlay.style.width = '100%';
    //         overlay.style.height = '100%';
    //         overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    //         overlay.style.zIndex = '999';
    
    //         // Create the confirm box
    //         const confirmBox = document.createElement('div');
    //         confirmBox.className = 'custom-confirm';
    //         confirmBox.style.position = 'fixed';
    //         confirmBox.style.top = '50%';
    //         confirmBox.style.left = '50%';
    //         confirmBox.style.transform = 'translate(-50%, -50%)';
    //         confirmBox.style.backgroundColor = backgroundColor;
    //         confirmBox.style.padding = '20px';
    //         confirmBox.style.borderRadius = '8px';
    //         confirmBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    //         confirmBox.style.zIndex = '1000';
    //         confirmBox.style.textAlign = 'center';
    
    //         // Create the message element
    //         const messageElement = document.createElement('div');
    //         messageElement.className = 'custom-confirm-message';
    //         messageElement.textContent = message;
    //         messageElement.style.marginBottom = '20px';
    //         messageElement.style.fontSize = '16px';
    
    //         // Create the Yes button
    //         const yesButton = document.createElement('button');
    //         yesButton.className = 'custom-confirm-yes-button';
    //         yesButton.textContent = 'Yes';
    //         yesButton.style.padding = '10px 20px';
    //         yesButton.style.border = 'none';
    //         yesButton.style.borderRadius = '4px';
    //         yesButton.style.cursor = 'pointer';
    //         yesButton.style.color = buttonTextColor;
    //         yesButton.style.backgroundColor = yesButtonColor;
    //         yesButton.style.marginRight = '10px';
    
    //         // Create the No button
    //         const noButton = document.createElement('button');
    //         noButton.className = 'custom-confirm-no-button';
    //         noButton.textContent = 'No';
    //         noButton.style.padding = '10px 20px';
    //         noButton.style.border = 'none';
    //         noButton.style.borderRadius = '4px';
    //         noButton.style.cursor = 'pointer';
    //         noButton.style.color = buttonTextColor;
    //         noButton.style.backgroundColor = noButtonColor;
    
    //         // Append elements to the confirm box
    //         confirmBox.appendChild(messageElement);
    //         confirmBox.appendChild(yesButton);
    //         confirmBox.appendChild(noButton);
    
    //         // Append the confirm box and overlay to the body
    //         document.body.appendChild(overlay);
    //         document.body.appendChild(confirmBox);
    
    //         // Add click event to the Yes button
    //         yesButton.addEventListener('click', () => {
    //             document.body.removeChild(confirmBox);
    //             document.body.removeChild(overlay);
    //             resolve(true); // Resolve promise with true
    //         });
    
    //         // Add click event to the No button
    //         noButton.addEventListener('click', () => {
    //             document.body.removeChild(confirmBox);
    //             document.body.removeChild(overlay);
    //             resolve(false); // Resolve promise with false
    //         });
    
    //         // Optional: handle overlay click to cancel
    //         overlay.addEventListener('click', () => {
    //             document.body.removeChild(confirmBox);
    //             document.body.removeChild(overlay);
    //             resolve(false); // Resolve promise with false
    //         });
    //     });
    // }
