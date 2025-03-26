function OnStatementLoad(){
    var url = document.location.href;
    console.log(url);
    jr_execute_dialog_function('getDataFromLink', {"url":url}, onDataFromLinkSuccess);
}

function onDataFromLinkSuccess(returnData){
    var realAvailableAmount=0;
    //All the same or different by jobtitle groups
    if (returnData.result.success["CafeGroupSelector"]==0) {
        jr_set_value('CafeGroup', 'Minden munkavállaló egységes');
        realAvailableAmount=returnData.result.success["AvailableAmount"];
        
    }
    else
    {
        for (let groupsI = 0; groupsI < returnData.result.success["Groups"].length; groupsI++) {
            const element = returnData.result.success["Groups"][groupsI];
            if (element["GroupName"]==returnData.result.success["jobTitle"]) {
                realAvailableAmount=element["Amount"];
                jr_set_value('CafeGroup', element["GroupName"]);
            }
        }
    }
    jr_set_value('AvailableAmount', realAvailableAmount);
    jr_set_value('FirstName', returnData.result.success["firstName"]);
    jr_set_value('LastName', returnData.result.success["lastName"]);
    jr_set_value('JobDescription', returnData.result.success["jobTitle"]);
    var probationEnd=new Date(Date.parse(returnData.result.success["ProbationPeriodEnd"]));
    jr_set_value('ProbationPeriodEnd', probationEnd);
    var firstWorkDay=new Date(Date.parse(returnData.result.success["FirstWDayOfTheYear"]));
    jr_set_value('FirstWDayOfTheYear', firstWorkDay);
    var deadline=new Date(Date.parse(returnData.result.success["CafeteriaDeadline"]));
    jr_set_value('CafeteriaDeadline', deadline);
    var startDate = new Date(Date.parse(returnData.result.success["validFrom"]));
    jr_set_value('StartOfContract', returnData.result.success["validFrom"]);
    var validMonthRule=parseInt(returnData.result.success["ValidMonthRule"]);
    jr_set_value('ValidMonthRule', validMonthRule);
    var probationRule=returnData.result.success["ProbationMonthRule"];
    jr_set_value('ProbationMonthRule', probationRule);

    //We do not care for "After" and "Yes", as they are not relevant
    //After statements only start after the probation period ended
    if (probationRule=="No") {
        startDate=probationEnd;
    }

    var validMonths=0;
    var startYear= startDate.getFullYear();
    var currentYear= firstWorkDay.getFullYear();
    if (startYear<currentYear) {
        validMonths=12;
    }
    else
    {
        var startMonth=startDate.getMonth();
        var startContractDay=startDate.getDate();
        if (startContractDay<validMonthRule) { //2 or 16
            //handle 30/days time based rules/systems
            //We will cross the bridge when we get to it
            validMonths=12-startMonth;
        }
        else
        {
            var firstDayOfYear=firstWorkDay.getDate();
            if (startMonth==0 && startContractDay<=firstDayOfYear) {
                validMonths=12;
            }
            else
            {
                validMonths=11-startMonth;
            }
        }
    }
    jr_set_value('ValidMonthsCount', validMonths);
    jr_set_value('TaxNumber', returnData.result.success["taxID"]);
    jr_set_value('BirthName', returnData.result.success["birthName"]);
    jr_set_value('TaxingType', returnData.result.success["TaxingTypeSelector"]);
    jr_set_value('Term', returnData.result.success["TermSelector"]);
    jr_set_value('EqualMonthRule', returnData.result.success["EqualMonthRule"]);
    realAvailableAmount=Math.floor((realAvailableAmount*validMonths)/12);
    jr_set_value('RealAvailableAmount', realAvailableAmount);


    var optionArray=[];
    returnData.result.success["Options"].forEach(element => {
        let option={};
        option.CafeName=element["optionDisplayName"];
        option.Multiplier=element["optionMultiplier"];
        option.LimitAmount1=element["optionLimitAmount1"];
        option.LimitAmount2=element["optionLimitAmount2"];
        option.LimitAmount3=element["optionLimitAmount3"];
        option.LimitAmount4=element["optionLimitAmount4"];
        option.LimitPeriod1=element["optionLimitPeriod1"];
        option.LimitPeriod2=element["optionLimitPeriod2"];
        option.LimitPeriod3=element["optionLimitPeriod3"];
        option.LimitPeriod4=element["optionLimitPeriod4"];
        optionArray.push(option);
    });

    //insert remainder row at the end
    let monthlyRemainderRow={};
    monthlyRemainderRow.CafeName="Hátralévő felhalmozott maradék (bruttó)";
    optionArray.push(monthlyRemainderRow);

    jr_add_subtable_row('HU_CAFE_AMOUNTS_TABLE_VIEW', optionArray, false, rowsAdded);
    function rowsAdded(addedRowsNum) {
        var columnNameArray=[];
        columnNameArray.push("January");
        columnNameArray.push("February");
        columnNameArray.push("March");
        columnNameArray.push("April");
        columnNameArray.push("May");
        columnNameArray.push("June");
        columnNameArray.push("July");
        columnNameArray.push("August");
        columnNameArray.push("September");
        columnNameArray.push("October");
        columnNameArray.push("November");
        columnNameArray.push("December");
        for (let columnI = 0; columnI < columnNameArray.length; columnI++) {
            const columnName = columnNameArray[columnI];
            var cellElement=document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+columnName+"_"+(addedRowsNum-1));
            cellElement.setAttribute("readonly",true);
        }
        InitTable(addedRowsNum);
    }
}

function InitTable(){
    var viewName='HU_CAFE_AMOUNTS_TABLE_VIEW';
    var availableAmount=parseInt(jr_get_value('RealAvailableAmount'));
    var validMonths=parseInt(jr_get_value('ValidMonthsCount'));
    var showLimit2=false;
    var showLimit3=false;
    var showLimit4=false;
    var availablePerMonth=Math.floor(availableAmount/validMonths);

//----------------------------------------------------------------------------------------------------------------------
    //Go through the rows and check if there are any cafe options with multiple limits
    var rowIDs=jr_get_subtable_row_ids(viewName);
    for (let rowsI = 0; rowsI < rowIDs.length-1; rowsI++) {
        const rowID = rowIDs[rowsI];
        let monthsLimit2=parseInt(jr_get_subtable_value(viewName, rowID, "LimitPeriod2"));
        if (isNaN(monthsLimit2)){
            monthsLimit2=0;
        }
        let monthsLimit3=parseInt(jr_get_subtable_value(viewName, rowID, "LimitPeriod3"));
        if (isNaN(monthsLimit3)){
            monthsLimit3=0;
        }
        let monthsLimit4=parseInt(jr_get_subtable_value(viewName, rowID, "LimitPeriod4"));
        if (isNaN(monthsLimit4)){
            monthsLimit4=0;
        }
        let amountLimit2=parseInt(jr_get_subtable_value(viewName, rowID, "LimitAmount2"));
        if (isNaN(amountLimit2)){
            amountLimit2=0;
        }
        let amountLimit3=parseInt(jr_get_subtable_value(viewName, rowID, "LimitAmount3"));
        if (isNaN(amountLimit3)){
            amountLimit3=0;
        }
        let amountLimit4=parseInt(jr_get_subtable_value(viewName, rowID, "LimitAmount4"));
        if (isNaN(amountLimit4)){
            amountLimit4=0;
        }
        if (monthsLimit2>0) {
            showLimit2=true;
        }
        if (monthsLimit3>0) {
            showLimit3=true;
        }
        if (monthsLimit4>0) {
            showLimit4=true;
        }
    }

    //if there were multiple limits, fix the display of the new columns
    document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod1_header").style.width="50px";
    if (showLimit2) {
        jr_show_subtable_column(viewName, 'LimitPeriod2');
        jr_show_subtable_column(viewName, 'LimitAmount2');
        document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod2_header").style.whiteSpace="normal";
        document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod2_header").style.width="50px";
    }
    if (showLimit3) {
        jr_show_subtable_column(viewName, 'LimitPeriod3');
        jr_show_subtable_column(viewName, 'LimitAmount3');
        document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod3_header").style.whiteSpace="normal";
        document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod3_header").style.width="50px";
    }
    if (showLimit4) {
        jr_show_subtable_column(viewName, 'LimitPeriod4');
        jr_show_subtable_column(viewName, 'LimitAmount4');
        document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod4_header").style.whiteSpace="normal";
        document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod4_header").style.width="50px";
    }

//--------------------------------------------------------------------------------------------------------------
    //Format the table display, color the invalid months and show 0 sums and remaining values
    //get equal month rule value
    var selectAmountRule=jr_get_value('EqualMonthRule');
    //create array for the display
    var allMonthsArrayForSum=[];
    allMonthsArrayForSum.push(['January',availablePerMonth*Math.max(validMonths-11,0),'JanuaryGross']);
    allMonthsArrayForSum.push(['February',availablePerMonth*Math.max(validMonths-10,0),'FebruaryGross']);
    allMonthsArrayForSum.push(['March',availablePerMonth*Math.max(validMonths-9,0),'MarchGross']);
    allMonthsArrayForSum.push(['April',availablePerMonth*Math.max(validMonths-8,0),'AprilGross']);
    allMonthsArrayForSum.push(['May',availablePerMonth*Math.max(validMonths-7,0),'MayGross']);
    allMonthsArrayForSum.push(['June',availablePerMonth*Math.max(validMonths-6,0),'JuneGross']);
    allMonthsArrayForSum.push(['July',availablePerMonth*Math.max(validMonths-5,0),'JulyGross']);
    allMonthsArrayForSum.push(['August',availablePerMonth*Math.max(validMonths-4,0),'AugustGross']);
    allMonthsArrayForSum.push(['September',availablePerMonth*Math.max(validMonths-3,0),'SeptemberGross']);
    allMonthsArrayForSum.push(['October',availablePerMonth*Math.max(validMonths-2,0),'OctoberGross']);
    allMonthsArrayForSum.push(['November',availablePerMonth*Math.max(validMonths-1,0),'NovemberGross']);
    allMonthsArrayForSum.push(['December',availableAmount,'DecemberGross']);

    //go through the rows
    for (let rowsI = 0; rowsI < rowIDs.length-1; rowsI++) {
        const rowID = rowIDs[rowsI];
        //go trough the months array
        for (let monthI = 0; monthI < allMonthsArrayForSum.length; monthI++) {
            //get the array of the current month
            let currentMonthArray = allMonthsArrayForSum[monthI];
            //display the cumulative remainder for both normal and gross months
            jr_set_subtable_value(viewName, rowIDs.length-1, currentMonthArray[0],currentMonthArray[1]);
            jr_set_subtable_value(viewName, rowIDs.length-1, currentMonthArray[2],currentMonthArray[1]);
            //color the gross(readonly) months to differentiate
            document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+currentMonthArray[2]+"_"+rowID).style.background="silver";

            //check the equal month rule and color and set read only for invalid months
            if (selectAmountRule=="egyenlőtlen juttatás összeg választható időarányosan" && monthI<(12-validMonths)) {
                var cellElement=document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+currentMonthArray[0]+"_"+rowsI);
                cellElement.style.background="silver";
                cellElement.setAttribute("readonly",true);
            }
        }
        //display the row's sum as 0
        jr_set_subtable_value(viewName, rowID, "Sum", 0);

        //fix the limits display for each row
        document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod1_"+rowID).style.textAlign="center";
        if (showLimit2) {
            document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod2_"+rowID).style.textAlign="center";
        }
        if (showLimit3) {
            document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod3_"+rowID).style.textAlign="center";
        }
        if (showLimit4) {
            document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod4_"+rowID).style.textAlign="center";
        }
    }
 
//---------------------------------------------------------------------------------------------------------------------------------
    //check rule and show only 1 months if needed
    if (selectAmountRule=="havi egyenlő juttatás összeg választható") {
        //go through the months and hide all except the last
        for (let monthI = 0; monthI < allMonthsArrayForSum.length-1; monthI++) {
            let currentMonthArray = allMonthsArrayForSum[monthI];
            jr_hide_subtable_column(viewName, currentMonthArray[0]);
            jr_hide_subtable_column(viewName, currentMonthArray[2]);
        }

        //rename last column
        jr_set_column_label('HU_CAFE_AMOUNTS_TABLE_VIEW', "December", 'Hónap nettó');
        jr_set_column_label('HU_CAFE_AMOUNTS_TABLE_VIEW', "DecemberGross", 'Hónap bruttó');
        //show amount per month in last month, instead of the cumulative sum
        jr_set_subtable_value(viewName, rowIDs.length-1, "December",availablePerMonth);
        jr_set_subtable_value(viewName, rowIDs.length-1, "DecemberGross",availablePerMonth);
    }
    //show the whole remaining available amount at the last column of the last row
    jr_set_subtable_value(viewName, rowIDs.length-1, "Sum", availableAmount);
}