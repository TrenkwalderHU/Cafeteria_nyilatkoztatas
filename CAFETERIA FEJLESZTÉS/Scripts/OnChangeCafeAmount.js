function OnChangeCafeAmount(currentRowID,columnName){
    //Need to get the valid months value from the form element
    //de ez itt megint security issue
    //át tudja ő írni a validmonths, és akkor máshogy számol a changecafé
    var selectAmountRule=jr_get_value('EqualMonthRule');
    if (selectAmountRule=="egyenlőtlen juttatás összeg választható időarányosan") {
        differentAmounts(currentRowID,columnName);
    }
    else
    {
        sameAmounts(currentRowID,columnName);
    }
}

function differentAmounts(currentRowID,columnName){
    var valueOverError = checkLimits(currentRowID, columnName);
    if (!valueOverError){
        displaySums(currentRowID, columnName);
    }
}

function sameAmounts(currentRowID,columnName){
    var viewName='HU_CAFE_AMOUNTS_TABLE_VIEW';
    var originalValue=parseInt(jr_get_value('SaveCellValueHelper'));
    var availableAmount=parseInt(jr_get_value('AvailableAmount'));
    var validMonthsCount=parseInt(jr_get_value('ValidMonthsCount'));
    if (isNaN(originalValue)){
        originalValue=0;
    }
    var valueOverError=false;
    var availablePerMonth=Math.floor(availableAmount/12);
    var rowIDs=jr_get_subtable_row_ids(viewName);
    var sum=0;
    for (let rowsI = 0; rowsI < rowIDs.length-1; rowsI++) {
        const rowID = rowIDs[rowsI];
        
        //Exits if the value has been exceeded
        if (valueOverError){
            break;
        }
        let value=parseInt(jr_get_subtable_value(viewName, rowID, columnName));
        if (isNaN(value)){
            value=0;
        }
        let multiplier=Number(jr_get_subtable_value(viewName, rowID, "Multiplier"));
        let grossModifiedValue=value*multiplier;
        sum+=grossModifiedValue;
        if (sum>availablePerMonth) {
            jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
            //Exits if the value has been exceeded
            jr_notify_warn('Átlépted a megengedett havi keretedet, ezért visszaállítottuk a legutóbb megadott értéket!', 10);
            valueOverError=true;
            break;
        }

        let monthsLimit=parseInt(jr_get_subtable_value(viewName, rowID, "LimitPeriod1"));
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
        let amountLimit=parseInt(jr_get_subtable_value(viewName, rowID, "LimitAmount1"));
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
        let optionName=jr_get_subtable_value(viewName, rowID, "CafeName");

        var firstMonthLimitRelevantMonthsCount=monthsLimit-(12-validMonthsCount);
        if (value*firstMonthLimitRelevantMonthsCount>amountLimit && amountLimit>0) {
            //ez még nem számít a nem éves limitekkel, pl szép aktív, vagy rosszabbak
            jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
            //Exits if the value has been exceeded
            jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, az 1. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
            valueOverError=true;
            break;
        }

        var secondMonthLimitRelevantMonthsCount=monthsLimit+monthsLimit2-(12-validMonthsCount);
        secondMonthLimitRelevantMonthsCount=Math.min(secondMonthLimitRelevantMonthsCount, monthsLimit2);
        if (secondMonthLimitRelevantMonthsCount<=0) {
            secondMonthLimitRelevantMonthsCount=0;
        }
        if (value*secondMonthLimitRelevantMonthsCount>amountLimit2 && amountLimit2>0) {
            //ez még nem számít a nem éves limitekkel, pl szép aktív, vagy rosszabbak
            jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
            //Exits if the value has been exceeded
            jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, a 2. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
            valueOverError=true;
            break;
        }

        var thirdMonthLimitRelevantMonthsCount=monthsLimit+monthsLimit2+monthsLimit3-(12-validMonthsCount);
        thirdMonthLimitRelevantMonthsCount=Math.min(thirdMonthLimitRelevantMonthsCount, monthsLimit3);
        if (thirdMonthLimitRelevantMonthsCount<=0) {
            thirdMonthLimitRelevantMonthsCount=0;
        }
        if (value*thirdMonthLimitRelevantMonthsCount>amountLimit3 && amountLimit3>0) {
            //ez még nem számít a nem éves limitekkel, pl szép aktív, vagy rosszabbak
            jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
            //Exits if the value has been exceeded
            jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, a 3. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
            valueOverError=true;
            break;
        }
        var fourthMonthLimitRelevantMonthsCount=monthsLimit+monthsLimit2+monthsLimit3+monthsLimit4-(12-validMonthsCount);
        fourthMonthLimitRelevantMonthsCount=Math.min(fourthMonthLimitRelevantMonthsCount, monthsLimit4);
        if (value*fourthMonthLimitRelevantMonthsCount>amountLimit4 && amountLimit4>0) {
            //ez még nem számít a nem éves limitekkel, pl szép aktív, vagy rosszabbak
            jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
            //Exits if the value has been exceeded
            jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, a 4. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
            valueOverError=true;
            break;
        }
    }
    if (!valueOverError){
        for (let rowsI = 0; rowsI < rowIDs.length-1; rowsI++) {
            const rowID = rowIDs[rowsI];
            let value=parseInt(jr_get_subtable_value(viewName, rowID, columnName));
            if (isNaN(value)){
                value=0;
            }
            jr_set_subtable_value(viewName, rowID, "Sum", value*validMonthsCount);
        }
        jr_set_subtable_value(viewName, rowIDs.length-1, "December",availablePerMonth-sum);
        jr_set_subtable_value(viewName, rowIDs.length-1, "DecemberGross",availablePerMonth-sum);
        jr_set_subtable_value(viewName, rowIDs.length-1, "Sum", availableAmount-sum*validMonthsCount);
        let value=parseInt(jr_get_subtable_value(viewName, currentRowID, columnName));
        if (isNaN(value)){
            value=0;
        }
        let multiplier=Number(jr_get_subtable_value(viewName, currentRowID, "Multiplier"));
        jr_set_subtable_value(viewName, currentRowID, "DecemberGross", value*multiplier);
    }
}

function checkLimits(currentRowID, columnName)
{
    var viewName='HU_CAFE_AMOUNTS_TABLE_VIEW';
    var originalValue=parseInt(jr_get_value('SaveCellValueHelper'));
    var availableAmount=parseInt(jr_get_value('AvailableAmount'));
    if (isNaN(originalValue)){
        originalValue=0;
    }
    var valueOverError=false;
    var availablePerMonth=Math.floor(availableAmount/12);
    var rowIDs=jr_get_subtable_row_ids(viewName);
    var allMonthsArray=[];
    allMonthsArray.push(['January',availablePerMonth,0]);
    allMonthsArray.push(['February',availablePerMonth*2,0]);
    allMonthsArray.push(['March',availablePerMonth*3,0]);
    allMonthsArray.push(['April',availablePerMonth*4,0]);
    allMonthsArray.push(['May',availablePerMonth*5,0]);
    allMonthsArray.push(['June',availablePerMonth*6,0]);
    allMonthsArray.push(['July',availablePerMonth*7,0]);
    allMonthsArray.push(['August',availablePerMonth*8,0]);
    allMonthsArray.push(['September',availablePerMonth*9,0]);
    allMonthsArray.push(['October',availablePerMonth*10,0]);
    allMonthsArray.push(['November',availablePerMonth*11,0]);
    allMonthsArray.push(['December',availableAmount,0]);
    //Check all limits
    //Go through the rows
    for (let rowsI = 0; rowsI < rowIDs.length-1; rowsI++) {
        const rowID = rowIDs[rowsI];
        //Exits if the value has been exceeded
        if (valueOverError){
            break;
        }
        let sum=0;
        let timesThroughLimit=0;
        let optionName=jr_get_subtable_value(viewName, rowID, "CafeName");
        let monthsLimit=parseInt(jr_get_subtable_value(viewName, rowID, "LimitPeriod1"));
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
        let amountLimit=parseInt(jr_get_subtable_value(viewName, rowID, "LimitAmount1"));
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
        //Go through the months
        for (let monthI = 0; monthI < allMonthsArray.length; monthI++) {
            let currentMonthArray = allMonthsArray[monthI];

            //Exits if the value has been exceeded
            if (valueOverError){
                break;
            }
            let value=parseInt(jr_get_subtable_value(viewName, rowID, currentMonthArray[0]));
            if (isNaN(value)){
                value=0;
            }
            let multiplier=Number(jr_get_subtable_value(viewName, rowID, "Multiplier"));
            let grossModifiedValue=value*multiplier;

            if (monthI<monthsLimit) {
                sum+=value;
                if (sum>amountLimit && amountLimit>0) {
                    jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
                    //Exits if the value has been exceeded
                    jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, az 1. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
                    valueOverError=true;
                    break;
                }
            }
            else
            {
                if (monthI<monthsLimit+monthsLimit2) {
                    if (timesThroughLimit==0) {
                        timesThroughLimit=1;
                        sum=0;
                    }
                    sum+=value;
                    if (sum>amountLimit2 && amountLimit2>0) {
                        jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
                        //Exits if the value has been exceeded
                        jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, a 2. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
                        valueOverError=true;
                        break;
                    }
                }
                else
                {
                    if (monthI<monthsLimit+monthsLimit2+monthsLimit3) {
                        if (timesThroughLimit==1) {
                            timesThroughLimit=2;
                            sum=0;
                        }
                        sum+=value;
                        if (sum>amountLimit3 && amountLimit3>0) {
                            jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
                            //Exits if the value has been exceeded
                            jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, a 3. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
                            valueOverError=true;
                            break;
                        }
                    }
                    else
                    {
                        if (monthI<monthsLimit+monthsLimit2+monthsLimit3+monthsLimit4) {
                            if (timesThroughLimit==2) {
                                timesThroughLimit=3;
                                sum=0;
                            }
                            sum+=value;
                            if (sum>amountLimit4 && amountLimit4>0) {
                                jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
                                //Exits if the value has been exceeded
                                jr_notify_warn('Átlépted a '+ optionName + '-ból/ből a megengedett keretedet, a 4. időszakban ezért visszaállítottuk a legutóbb megadott értéket!', 10);
                                valueOverError=true;
                                break;
                            }
                        }
                    }
                }
            }
            //Cummulate values through all the remaining months
            for (let remainingMonthI = monthI; remainingMonthI < allMonthsArray.length; remainingMonthI++) {
                let element = allMonthsArray[remainingMonthI];
                element[2]+=grossModifiedValue;

                //Check if the current month's remaining value has been exceeded and exits if it has
                if (element[2]>element[1]) {
                    jr_set_subtable_value(viewName, currentRowID, columnName, originalValue);
                    //Exits if the value has been exceeded
                    jr_notify_warn('Átlépted a megengedett havi keretedet, ezért visszaállítottuk a legutóbb megadott értéket!', 10);
                    valueOverError=true;
                    break;
                }
            }
        }
    }
}

function displaySums(currentRowID, columnName){
    var viewName='HU_CAFE_AMOUNTS_TABLE_VIEW';
    var rowIDs=jr_get_subtable_row_ids(viewName);
    var availableAmount=parseInt(jr_get_value('AvailableAmount'));
    var availablePerMonth=Math.floor(availableAmount/12);
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
    var modifiedMonthArray=[];
    for (let rowsI = 0; rowsI < rowIDs.length-1; rowsI++) {
        //console.log('###############################################');
        //console.log(rowsI);
        const rowID = rowIDs[rowsI];
        let sum=0;
        for (let monthI = 0; monthI < allMonthsArrayForSum.length; monthI++) {
            //console.log("--------------------------------------------------------------------------------hónap sorszáma jelenleg:");
            //console.log(monthI);
            let currentMonthArray = allMonthsArrayForSum[monthI];
            if (columnName==currentMonthArray[0]) {
                modifiedMonthArray=currentMonthArray;
            }
            let value=parseInt(jr_get_subtable_value(viewName, rowID, currentMonthArray[0]));
            if (isNaN(value)){
                value=0;
            }
            let multiplier=Number(jr_get_subtable_value(viewName, rowID, "Multiplier"));
            let grossModifiedValue=value*multiplier;
            //console.log("bruttósított érték:");
            //console.log(grossModifiedValue);
            sum+=value;
            //console.log("összeg:");
            //console.log(sum);
            //Cummulate values through all the remaining months
            for (let remainingMonthI = monthI; remainingMonthI < allMonthsArrayForSum.length; remainingMonthI++) {
                /*console.log("hátralévő hónap sorszáma:");
                console.log(remainingMonthI);
                let element = allMonthsArrayForSum[remainingMonthI];
                console.log("értékei:");
                console.log(element[1]);
                console.log(element[2]);
                console.log(grossModifiedValue);
                element[2]+=grossModifiedValue;
                console.log("hozzáadva a mostani:");
                console.log(element[2]);*/
                let element = allMonthsArrayForSum[remainingMonthI];
                element[2]+=grossModifiedValue;
                jr_set_subtable_value(viewName, rowIDs.length-1, element[0],element[1]-element[2]);
                jr_set_subtable_value(viewName, rowIDs.length-1, element[3],element[1]-element[2]);
            }
        }
        jr_set_subtable_value(viewName, rowID, "Sum", sum);
        jr_set_subtable_value(viewName, rowIDs.length-1, "Sum", allMonthsArrayForSum[11][1]-allMonthsArrayForSum[11][2]);
    }

    //update Gross cell value corresponding to the user-modified cell
    let value=parseInt(jr_get_subtable_value(viewName, currentRowID, columnName));
    if (isNaN(value)){
        value=0;
    }
    let multiplier=Number(jr_get_subtable_value(viewName, currentRowID, "Multiplier"));
    if (modifiedMonthArray.length>0) {
        jr_set_subtable_value(viewName, currentRowID, modifiedMonthArray[3], value*multiplier);
    }
}