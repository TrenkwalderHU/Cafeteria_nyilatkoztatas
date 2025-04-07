<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\StepInitializationFunction
{
	public function execute($rowId = null)
	{
        $newProcessID=$this->getProcessId();
	    $actual_link = "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        $rowsFound=0;
        $jobDB = $this->getJobDB();
        $sql = "SELECT * FROM [HU_Cafe_Helper]
                where urlLink ='".$actual_link."'";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            $this->dump($row);
            $corrections=$row["corrections"];
            $corrections++;
            $sql = "UPDATE HU_Cafe_Helper
                    SET corrections = ".$corrections."
                    WHERE urlLink='".$actual_link."'";
            $this->alert($sql);
            $result = $jobDB->exec($sql);
            if ($result === false) {
                throw new JobRouterException($jobDB->getErrorMessage());
            }
            else {
                $this->alert("Corrections has been incremented in the helper table");
            }
            
            $rowsFound++;
        }
        if ($rowsFound==0) {
            $sql = "INSERT INTO [dbo].[HU_Cafe_Helper]
                ([processID],[urlLink])
            VALUES
                ('".$newProcessID."', '".$actual_link."')";
            $this->alert($sql);
            $result = $jobDB->exec($sql);
            if ($result === false) {
                throw new JobRouterException($jobDB->getErrorMessage());
            }
            else {
                $this->alert("New line has been inserted into the helper table");
            }
            
        }
	}
}
?>