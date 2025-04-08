<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
		$processID=$this->getProcessId();        
		$jobDB = $this->getJobDB();
        $sql = "UPDATE HU_Cafe_Helper
                SET corrections = corrections + 1
                WHERE newProcessID='".$processID."'";
        $this->alert($sql);
        $result = $jobDB->exec($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        else {
            $this->alert("Incremented corrections");
        }
	}
}
?>