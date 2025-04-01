function OnSettingsSubmit(){
    var canSendStep=0;
    let value=jr_get_value('SZEPUnderLimit');
    let value2=jr_get_value('SZEPAboveLimit');
    let value3=jr_get_value('SZEPActive');
    let value4=jr_get_value('CultureTicket');
    let value5=jr_get_value('SportTicket');
    let value6=jr_get_value('KindergartenAllowance');
    let value7=jr_get_value('VirusTestAndVaccine');
    let value8=jr_get_value('BicycleUsage');
    let value9=jr_get_value('CarSharing');
    let value10=jr_get_value('HomeOfficeAllowance');
    let value11=jr_get_value('WineProducts');
    let value12=jr_get_value('GroupRiskInsurances');
    let value13=jr_get_value('CheckoutPayments');
    let value14=jr_get_value('VolunteerMemberFee');
    let value15=jr_get_value('MoneyAllowance');
    let value16=jr_get_value('CommuteRefund');
    let value17=jr_get_value('GlassesRefund');
    let value18=jr_get_value('StudentLoanSupport');
    let value19=jr_get_value('ZooTicket');
    let value20=jr_get_value('HousingSupport');
    let value20=jr_get_value('LowCostPresent');
    canSendStep+=value;
    canSendStep+=value2;
    canSendStep+=value3;
    canSendStep+=value4;
    canSendStep+=value5;
    canSendStep+=value6;
    canSendStep+=value7;
    canSendStep+=value8;
    canSendStep+=value9;
    canSendStep+=value10;
    canSendStep+=value11;
    canSendStep+=value12;
    canSendStep+=value13;
    canSendStep+=value14;
    canSendStep+=value15;
    canSendStep+=value16;
    canSendStep+=value17;
    canSendStep+=value18;
    canSendStep+=value19;
    canSendStep+=value20;
    console.log(canSendStep);
    if (canSendStep==0) {
        jr_disable_send();
    }
    else
    {
        jr_enable_send();
    }
}