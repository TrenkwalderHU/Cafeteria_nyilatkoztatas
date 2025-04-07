<?php
class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
        //get the processID
        $newProcessID=$this->getProcessId();
        //get URL from helper table
        $url="";
        $jobDB = $this->getJobDB();
        $sql = "SELECT * FROM HU_Cafe_Helper
                where processID='".$newProcessID."'";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            $this->dump($row);
            $url=$row["urlLink"];
        }

        //get employee data from DB
        $sql = "SELECT * FROM HU_CAFE_EMPLOYEEDATA
                where step_id=( 
                    Select MAX(edata.step_id) 
                    from HU_CAFE_EMPLOYEEDATA as edata 
                    where edata.link ='".$url."')";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            $this->dump($row);
            $this->setTableValue("CustomProcessID", $row["processid"]);
            
            $newStepID=$this->getStepId();
            $newProcessID=$this->getProcessId();
            
            $jobDB2 = $this->getJobDB();
            $sql2 = "INSERT INTO HU_CAFE_EMPLOYEEDATA
                VALUES ('".$newProcessID."', '".$newStepID."', 1, '".$row["email"]."', '".$row["taxID"]."', '".$url."', 1, '".$row["jobTitle"]."'
                , '".$row["firstName"]."', '".$row["lastName"]."', '".$row["validFrom"]."', '".$row["validTo"]."', '".$row["birthName"]."', '".$row["ProbationPeriodEnd"]."', '".$row["customToken"]."')";
            $result2 = $jobDB2->exec($sql2);
            if ($result2 === false) {
                throw new JobRouterException($jobDB2->getErrorMessage());
            }
            else
            {
                $this->alert("Sikeresen beszurtam a sort a dolgozo adatairol a kesobbi javitasokhoz");
            }
        }
	}
}
?>