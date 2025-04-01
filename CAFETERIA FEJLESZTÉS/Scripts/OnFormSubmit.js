function OnFormSubmit(){
    let taxID=jr_get_value('TaxNumber');
    let customToken=jr_get_value('CustomToken');
    let processID=jr_get_value('CustomProcessID');
    var userParameters={};
    userParameters.taxID=taxID;
    userParameters.customToken=customToken;
    userParameters.processID=processID;
    var canSend=jr_get_value('Placeholder');
    if (canSend=="NoYoCA123TKN") {
        jr_enable_send();
    }
    else
    {
        jr_disable_send();
    }
    
    jr_execute_dialog_function('FormSecurityCheck', userParameters, 
    async function(returnObject) {
        //console.log(returnObject.result.success);
        if (returnObject.result.success){
            jr_set_value('Placeholder', "NoYoCA123TKN");
            jr_enable_send();
            await new Promise(r => setTimeout(r, 500));
            jr_execute('send');
        }
        else
        {
            jr_notify_warn('Nem sikerült beazonosítani a személyedet, kérlek ne nyúlj bele az adataidba!', 30);
        }
    }, 
    function(errorReturnObject) {
        console.log(errorReturnObject);
    });
}