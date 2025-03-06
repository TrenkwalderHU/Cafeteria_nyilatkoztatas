function OnStatementLoad(){
    var url = document.location.href;
    console.log(url);
    jr_execute_dialog_function('getDataFromLink', {"url":url}, onDataFromLinkSuccess);
}

function onDataFromLinkSuccess(returnData){
    //All the same or different by jobtitle groups
    if (returnData.result.success["CafeGroupSelector"]==0) {
        jr_set_value('CafeGroup', 'Minden munkavállaló egységes');
        jr_set_value('AvailableAmount', returnData.result.success["AvailableAmount"]);
    }
    else
    {
        for (let groupsI = 0; groupsI < returnData.result.success["Groups"].length; groupsI++) {
            const element = returnData.result.success["Groups"][groupsI];
            if (element["GroupName"]==returnData.result.success["jobTitle"]) {
                jr_set_value('AvailableAmount', element["Amount"]);
                jr_set_value('CafeGroup', element["GroupName"]);
            }
            
        }
    }
    jr_set_value('FirstName', returnData.result.success["firstName"]);
    jr_set_value('LastName', returnData.result.success["lastName"]);
    jr_set_value('JobDescription', returnData.result.success["jobTitle"]);
    jr_set_value('StartOfContract', returnData.result.success["validFrom"]);
    jr_set_value('TaxNumber', returnData.result.success["taxID"]);
    jr_set_value('BirthName', returnData.result.success["birthName"]);
    jr_set_value('TaxingType', returnData.result.success["TaxingTypeSelector"]);
    jr_set_value('Term', returnData.result.success["TermSelector"]);
    jr_set_value('FullMonthRule', returnData.result.success["FullMonthRule"]);


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
    function rowsAdded(addedRows) {
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
            var cellElement=document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+columnName+"_"+(addedRows-1));
            cellElement.setAttribute("readonly",true);
        }
        InitTable();
    }
}

function InitTable(){
    var viewName='HU_CAFE_AMOUNTS_TABLE_VIEW';
    var availableAmount=parseInt(jr_get_value('AvailableAmount'));
    var showLimit2=false;
    var showLimit3=false;
    var showLimit4=false;
    var availablePerMonth=Math.floor(availableAmount/12);
    var rowIDs=jr_get_subtable_row_ids(viewName);
    //Go through the rows
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
        
        if (showLimit2) {
            jr_show_subtable_column(viewName, 'LimitPeriod2');
            jr_show_subtable_column(viewName, 'LimitAmount2');
            document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod2_header").style.whiteSpace="normal";
        }
        if (showLimit3) {
            jr_show_subtable_column(viewName, 'LimitPeriod3');
            jr_show_subtable_column(viewName, 'LimitAmount3');
            document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod3_header").style.whiteSpace="normal";
        }
        if (showLimit4) {
            jr_show_subtable_column(viewName, 'LimitPeriod4');
            jr_show_subtable_column(viewName, 'LimitAmount4');
            document.getElementById("div_HU_CAFE_AMOUNTS_TABLE_VIEW_LimitPeriod4_header").style.whiteSpace="normal";
        }
    
        //Calculate all the sums and remaining values to display them in the table
        var allMonthsArrayForSum=[];
        allMonthsArrayForSum.push(['January',availablePerMonth,0,'JanuaryGross']);
        allMonthsArrayForSum.push(['February',availablePerMonth*2,0,'FebruaryGross']);
        allMonthsArrayForSum.push(['March',availablePerMonth*3,0,'MarchGross']);
        allMonthsArrayForSum.push(['April',availablePerMonth*4,0,'AprilGross']);
        allMonthsArrayForSum.push(['May',availablePerMonth*5,0,'MayGross']);
        allMonthsArrayForSum.push(['June',availablePerMonth*6,0,'JuneGross']);
        allMonthsArrayForSum.push(['July',availablePerMonth*7,0,'JulyGross']);
        allMonthsArrayForSum.push(['August',availablePerMonth*8,0,'AugustGross']);
        allMonthsArrayForSum.push(['September',availablePerMonth*9,0,'SeptemberGross']);
        allMonthsArrayForSum.push(['October',availablePerMonth*10,0,'OctoberGross']);
        allMonthsArrayForSum.push(['November',availablePerMonth*11,0,'NovemberGross']);
        allMonthsArrayForSum.push(['December',availableAmount,0,'DecemberGross']);

        for (let rowsI = 0; rowsI < rowIDs.length-1; rowsI++) {
            const rowID = rowIDs[rowsI];
            for (let monthI = 0; monthI < allMonthsArrayForSum.length; monthI++) {
                let currentMonthArray = allMonthsArrayForSum[monthI];
                jr_set_subtable_value(viewName, rowIDs.length-1, currentMonthArray[0],currentMonthArray[1]);
                jr_set_subtable_value(viewName, rowIDs.length-1, currentMonthArray[3],currentMonthArray[1]);
                document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+currentMonthArray[3]+"_"+rowID).style.background="silver";
            }
            jr_set_subtable_value(viewName, rowID, "Sum", 0);
            jr_set_subtable_value(viewName, rowIDs.length-1, "Sum", allMonthsArrayForSum[11][1]-allMonthsArrayForSum[11][2]);

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
    }
}