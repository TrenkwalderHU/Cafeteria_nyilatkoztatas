function OnPreviousSettingsFinderChange(){
    let stepID=jr_get_value('PreviousSettingsFinder');
    let splitArr=stepID.split("::");
    stepID=splitArr[2];
    jr_execute_dialog_function('LoadPreviousSettings', {"stepID":stepID}, onLoadSettingsSuccess);
}

function onLoadSettingsSuccess(returnData){
    //All the same or different by jobtitle groups
    jr_set_value('TargetSelector', returnData.result.success["TargetSelector"]);
    jr_set_value('TrenkwalderEntitySelector2', returnData.result.success["TrenkwalderEntitySel"]);
    jr_set_value('MandantMossID', returnData.result.success["MandantMossID"]);
    jr_set_value('Department', returnData.result.success["Department"]);
    jr_set_value('Branch', returnData.result.success["Branch"]);
    jr_set_value('HRReferee', returnData.result.success["HRReferee"]);
    jr_set_value('Payroller', returnData.result.success["Payroller"]);
    jr_set_value('TaxingTypeSelector', returnData.result.success["TaxingTypeSelector"]);
    jr_set_value('TermSelector', returnData.result.success["TermSelector"]);
    jr_set_value('CafeGroupSelector', returnData.result.success["CafeGroupSelector"]);
    if (returnData.result.success["Groups"].length>0) {
        jr_show("HU_CAFE_GROUPS_VIEW");
        jr_hide("AvailableAmount");
        let rowsArray=[];
        for (let groupsI = 0; groupsI < returnData.result.success["Groups"].length; groupsI++) {
            const element = returnData.result.success["Groups"][groupsI];
            var subtableRow={};
            subtableRow.CafeGroupName=element["GroupName"];
            subtableRow.AvailableAmount=element["Amount"];
            rowsArray.push(subtableRow);
        }
        jr_add_subtable_row('HU_CAFE_GROUPS_VIEW', rowsArray, false, rowsAdded);
    }
    jr_set_value('AvailableAmount', returnData.result.success["AvailableAmount"]);
    jr_set_value('EqualMonthRule', returnData.result.success["EqualMonthRule"]);
    var firstWorkDay=new Date(Date.parse(returnData.result.success["FirstWDayOfTheYear"]));
    jr_set_value('FirstWDayOfTheYear', firstWorkDay);
    jr_set_value('ValidMonthRule', returnData.result.success["ValidMonthRule"]);
    jr_set_value('ProbationMonthRule', returnData.result.success["ProbationMonthRule"]);
    jr_set_value('UnjustifiedAbsenceMonthRule', returnData.result.success["UnjustifiedAbsence"]);
    jr_set_value('NumberOfUnjustifiedAbsenceDays', returnData.result.success["NumberOfUnjustifiedA"]);
    var deadline=new Date(Date.parse(returnData.result.success["CafeteriaDeadline"]));
    jr_set_value('CafeteriaDeadline', deadline);

    jr_set_value('CommuteRefund', returnData.result.success["CommuteRefund"]);
    jr_set_value('HousingSupport', returnData.result.success["HousingSupport"]);
    jr_set_value('ZooTicket', returnData.result.success["ZooTicket"]);
    jr_set_value('StudentLoanSupport', returnData.result.success["StudentLoanSupport"]);
    jr_set_value('GlassesRefund', returnData.result.success["GlassesRefund"]);
    jr_set_value('MoneyAllowance', returnData.result.success["MoneyAllowance"]);
    jr_set_value('VolunteerMemberFee', returnData.result.success["VolunteerMemberFee"]);
    jr_set_value('CheckoutPayments', returnData.result.success["CheckoutPayments"]);
    jr_set_value('LowCostPresent', returnData.result.success["LowCostPresent"]);
    jr_set_value('GroupRiskInsurances', returnData.result.success["GroupRiskInsurances"]);
    jr_set_value('WineProducts', returnData.result.success["WineProducts"]);
    jr_set_value('HomeOfficeAllowance', returnData.result.success["HomeOfficeAllowance"]);
    jr_set_value('CarSharing', returnData.result.success["CarSharing"]);
    jr_set_value('BicycleUsage', returnData.result.success["BicycleUsage"]);
    jr_set_value('VirusTestAndVaccine', returnData.result.success["VirusTestAndVaccine"]);
    jr_set_value('KindergartenAllowance', returnData.result.success["KindergartenAllowance"]);
    jr_set_value('SportTicket', returnData.result.success["SportTicket"]);
    jr_set_value('CultureTicket', returnData.result.success["CultureTicket"]);
    jr_set_value('SZEPAboveLimit', returnData.result.success["SZEPAboveLimit"]);
    jr_set_value('SZEPActive', returnData.result.success["SZEPActive"]);
    jr_set_value('SZEPUnderLimit', returnData.result.success["SZEPUnderLimit"]);
}

function rowsAdded(){
    //jr_subtable_refresh();
    //jr_sql_refresh(['Department', 'Branch', 'HRReferee', 'Payroller']);
    console.log("rows have been added");
}