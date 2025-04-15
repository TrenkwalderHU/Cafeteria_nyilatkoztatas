<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
	    $initiator=$this->getInitiator();
	    $this->setTableValue("ProcessStarter", $initiator);
	    $subtable="HU_CAFE_EMPLOYEEDATA";
	    $rowIDs=$this->getSubtableRowIds($subtable);
	    for($i = count($rowIDs) - 1; $i >= 0; $i--)
        {
            $isNeeded=$this->getSubtableValue($subtable, $rowIDs[$i], "isNeeded", True);
            if ($isNeeded==0)
            {
                $this->deleteSubtableRow($subtable, $rowIDs[$i]);
            }
        }
	}
}
?>