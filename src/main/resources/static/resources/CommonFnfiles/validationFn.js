//define fn for validate text element
const inputFieldValidator = (fieldId, pattern, object, property) => {

    //create var for assign regexp object
    const regPattern = new RegExp(pattern);

    if (fieldId.value != "") {
        //if a value exists
        if (regPattern.test(fieldId.value)) {
            //if value is valid
            fieldId.style.border = "2px solid lime";

            window[object][property] = fieldId.value;
        } else {
            //if value is invalid
            fieldId.style.border = "2px solid red";
            window[object][property] = null;
        }
    } else {
        window[object][property] = null;
        if (fieldId.required) {
            fieldId.style.border = "2px solid red";
        } else {
            fieldId.style.border = "2px solid #ced4da";
        }
    }
}

//define fn for validate select element >> FOR SELECTS DATA FILLED BY TABLES

const selectDynamicVal = (fieldId, pattern, object, property) => {
    if (fieldId.value != '') {

        //if valid
        fieldId.style.border = '2px solid lime';
        window[object][property] = JSON.parse(fieldId.value);

    } else {

        //if invlaid
        fieldId.style.border = '2px solid red';
        window[object][property] = null
    }
}

//datalist validation
const dataListValidator = (fieldId, dataListName, object, property, displayProperty) => {

    const fieldValue = fieldId.value;

    if (fieldValue !== "") {
        let dataList = window[dataListName];
        let existIndex = -1;
        for (const index in dataList) {
            if (fieldValue == dataList[index][displayProperty]) {
                existIndex = index
                break;
            }
        }
        if (existIndex != -1) {
            window[object][property] = dataList[existIndex];
            fieldId.style.border = '2px solid lime';
        } else {
            fieldId.style.border = '2px solid red';
            window[object][property] = null
        }
    } else {
        fieldId.style.border = '2px solid red';
        window[object][property] = null
    }
}


//>> For selects data filled by HTML given values
const selectStaticVal = (fieldId, pattern, object, property) => {
    if (fieldId.value != '') {
        //valid
        fieldId.style.border = '2px solid lime';
        window[object][property] = fieldId.value;
    } else {
        //invlaid
        fieldId.style.border = '2px solid red';
        window[object][property] = null;
    }
}

