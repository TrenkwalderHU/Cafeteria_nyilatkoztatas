function OnApprovalLoad(){
    var viewName='HU_CAFE_AMOUNTS_TABLE_VIEW';
    //need to do security before this
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
            //color the gross(readonly) months to differentiate
            document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+currentMonthArray[2]+"_"+rowID).style.background="silver";
            //set the normal month columns to be read only too, for the approval
            const columnName = currentMonthArray[0];
            var cellElement2=document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+columnName+"_"+rowsI);
            cellElement2.setAttribute("readonly",true);
            var cellElement3=document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+columnName+"_"+(rowIDs.length-1));
            cellElement3.setAttribute("readonly",true);

            //check the equal month rule and color and set read only for invalid months
            if (selectAmountRule=="egyenlőtlen juttatás összeg választható időarányosan" && monthI<(12-validMonths)) {
                var cellElement=document.getElementById("HU_CAFE_AMOUNTS_TABLE_VIEW_"+currentMonthArray[0]+"_"+rowsI);
                cellElement.style.background="silver";
                cellElement.setAttribute("readonly",true);
            }
        }

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
    }
}