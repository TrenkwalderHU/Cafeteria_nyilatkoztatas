function SaveCellValue(rowID, columnName){
    let viewName='HU_CAFE_AMOUNTS_TABLE_VIEW';
    let value=jr_get_subtable_value(viewName, rowID, columnName);
    jr_set_value('SaveCellValueHelper', value);
}