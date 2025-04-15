function OnTrenkwalderEntityChanged() {
    jr_set_value('Department', '');
    let entity=jr_get_value('TrenkwalderEntitySelector2');
    entity=entity.substring(0, 4);
    var userParameters={};
    userParameters.entity=entity;
    jr_execute_dialog_function('GetMandantMossID', userParameters, 
    function(returnObject) {
        jr_set_value('MandantMossID', returnObject.result.ID);
        jr_sql_refresh(['Department', 'Branch', 'HRReferee', 'Payroller']);
    }, 
    function(errorReturnObject) {
        console.log(errorReturnObject);
    });
}