<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\StepInitializationFunction
{
	public function execute($rowId = null)
	{
        $newProcessID=$this->getProcessId();
        $isTest=$this->getTableValue("isTest");
        if ($isTest==1) {
            //insert new processID
            $jobDB = $this->getJobDB();
            $sql = "UPDATE HU_Cafe_Helper
                    SET newProcessID = '".$newProcessID."'
                    WHERE oldProcessID='".$newProcessID."'";
            $this->alert($sql);
            $result = $jobDB->exec($sql);
            if ($result === false) {
                throw new JobRouterException($jobDB->getErrorMessage());
            }
            else {
                $this->alert("The new processID has been added into the helper table");
            }
        }
        else {
            $actual_link = "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
            //insert new processID
            $jobDB = $this->getJobDB();
            $sql = "UPDATE HU_Cafe_Helper
                    SET newProcessID = '".$newProcessID."'
                    WHERE urlLink='".$actual_link."'";
            $this->alert($sql);
            $result = $jobDB->exec($sql);
            if ($result === false) {
                throw new JobRouterException($jobDB->getErrorMessage());
            }
            else {
                $this->alert("The new processID has been added into the helper table");
            }
        }
	    
	}
}
?>