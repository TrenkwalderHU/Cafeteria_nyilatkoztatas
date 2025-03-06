function OnCafeGroupSelectorChanged(){
    let groupSelect=jr_get_value('CafeGroupSelector');
    if (groupSelect==0){
        jr_show('AvailableAmount');
        jr_hide('HU_CAFE_GROUPS_VIEW');
    }
    else{
        jr_show('HU_CAFE_GROUPS_VIEW');
        jr_hide('AvailableAmount');
    }
}