function OnFormSubmit(){
    let taxID=jr_get_value('TaxNumber');
    let customToken=jr_get_value('CustomToken');
    let processID=jr_get_value('CustomProcessID');
    var userParameters={};
    userParameters.taxID=taxID;
    userParameters.customToken=customToken;
    userParameters.processID=processID;
    jr_disable_send();
    
    jr_execute_dialog_function('FormSecurityCheck', userParameters, 
    async function(returnObject) {
        console.log("FormSecurityCheck sikeresen visszatért");
        console.log(returnObject.result);
        //console.log(returnObject.result.success);
        if (returnObject.result.success){
            //jr_set_value('CanSendStep', 1);
            jr_enable_send();
            await new Promise(r => setTimeout(r, 500));
            jr_execute('send');
        }
        else
        {
            console.log("hackelt");
            jr_notify_warn('Nem sikerült beazonosítani a személyedet, kérlek ne nyúlj bele az adataidba!', 30);
        }
    }, 
    function(errorReturnObject) {
        console.log(errorReturnObject);
    });
}