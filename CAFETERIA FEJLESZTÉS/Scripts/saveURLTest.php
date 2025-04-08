<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
        $processID=$this->getProcessId();
        $jobDB = $this->getJobDB();

        //insert a new row for the test employee's cafe instance into the DB
        $sql = "INSERT INTO [dbo].[HU_Cafe_Helper] ([oldProcessID])
                VALUES ('".$processID."')";
        $this->alert($sql);
        $result = $jobDB->exec($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        else {
            $this->alert("New line has been inserted into the helper table for the test);
        }
	}
}
?>