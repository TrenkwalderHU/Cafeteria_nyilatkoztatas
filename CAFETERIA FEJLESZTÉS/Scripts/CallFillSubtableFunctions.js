function CallFillSubtableFunctions(){
    let entity=jr_get_value('MandantMossID');
    let department=jr_get_value('Department');
    var userParameters={};
    userParameters.department=department;
    userParameters.entity=entity;
    CallFillCafeGroupSubTable(userParameters);
    CallFillEmployeeListSubTable(userParameters);
}
function CallFillCafeGroupSubTable(userParameters) {
    let rowIDs=jr_get_subtable_row_ids('HU_CAFE_GROUPS_VIEW');
    rowIDs.forEach((element) => jr_remove_subtable_row('HU_CAFE_GROUPS_VIEW', element));
    
    jr_execute_dialog_function('FillCafeGroupSubTable', userParameters, 
    function(returnObject) {
        console.log("FillCafeGroupSubTable sikeresen visszatért");
        //console.log(returnObject.result.success);
        if (returnObject.result.success.length>0){
            jr_add_subtable_row('HU_CAFE_GROUPS_VIEW', returnObject.result.success);
        }
    }, 
    function(errorReturnObject) {
        console.log(errorReturnObject);
    });
}

function CallFillEmployeeListSubTable(userParameters) {
    let rowIDs=jr_get_subtable_row_ids('HU_CAFE_EMPLOYEE_LIST_VIEW');
    rowIDs.forEach((element) => jr_remove_subtable_row('HU_CAFE_EMPLOYEE_LIST_VIEW', element));
    jr_execute_dialog_function('FillEmployeeListSubTable', userParameters, 
    function(returnObject) {
        console.log("FillEmployeeListSubTable sikeresen visszatért");
        //console.log(returnObject.result.success);
        if (returnObject.result.success.length>0){
            jr_add_subtable_row('HU_CAFE_EMPLOYEE_LIST_VIEW', returnObject.result.success);
        }
    }, 
    function(errorReturnObject) {
        console.log(errorReturnObject);
    });
}