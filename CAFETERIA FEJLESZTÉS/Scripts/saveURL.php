<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
        $processID=$this->getProcessId();
        $cafeInstanceArray=[];
        
        //get the url links from the JR db
        $jobDB = $this->getJobDB();
        $sql = "SELECT * FROM HU_CAFE_EMPLOYEEDATA
                where step_id = (
                        select MAX(step_id) as stepid FROM HU_CAFETERIA_NYILATK 
                        where processid='".$processID."')";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            //$this->dump($row);
            $cafeInstanceArray[]=$row;
        }

        //insert a new row for each employee's cafe instance into the DB
        foreach ($cafeInstanceArray as $key => $value) {
            $sql = "INSERT INTO [dbo].[HU_Cafe_Helper] ([oldProcessID],[urlLink])
                    VALUES ('".$processID."', '".$value["link"]."')";
            $this->alert($sql);
            $result = $jobDB->exec($sql);
            if ($result === false) {
                throw new JobRouterException($jobDB->getErrorMessage());
            }
            else {
                $this->alert("New line has been inserted into the helper table for ".$value["birthName"]);
            }
        }
	}
}
?>