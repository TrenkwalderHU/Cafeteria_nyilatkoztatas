<?php
class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
        //get the processID
        $newProcessID=$this->getProcessId();
        //get URL from helper table
        $url="";
        $oldprocessID="";
        $jobDB = $this->getJobDB();
        $sql = "SELECT * FROM HU_Cafe_Helper
                where newProcessID='".$newProcessID."'";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            $this->dump($row);
            $url=$row["urlLink"];
            $oldprocessID=$row["oldProcessID"];
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
                , '".$row["firstName"]."', '".$row["lastName"]."', '".$row["validTo"]."', '".$row["validFrom"]."', '".$row["birthName"]."', '".$row["ProbationPeriodEnd"]."', '".$row["customToken"]."')";
            $result2 = $jobDB2->exec($sql2);
            if ($result2 === false) {
                throw new JobRouterException($jobDB2->getErrorMessage());
            }
            else
            {
                $this->alert("Inserted the employee's data into the subtable");
            }
        }

        //get the process starter's username
        $sql = "SELECT * FROM HU_CAFETERIA_NYILATK
                where step_id=( 
                    Select MAX(cdata.step_id) 
                    from HU_CAFETERIA_NYILATK as cdata 
                    where cdata.processid ='".$oldprocessID."')";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            $this->dump($row);
            $this->setTableValue("ProcessStarter", $row["ProcessStarter"]);
        }
	}
}
?>