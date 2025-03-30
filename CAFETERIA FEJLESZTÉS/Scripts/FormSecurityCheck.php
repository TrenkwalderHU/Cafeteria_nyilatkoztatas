<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\DialogFunction
{
	public function execute($rowId = null)
	{
		$taxID=$this->getParameter('taxID');
		$customToken=$this->getParameter('customToken');
		$processID=$this->getParameter('processID');
		$customToken=rawurlencode($customToken);
		$this->alert($customToken);
		$jobDB = $this->getJobDB();
	    //get employee data from DB
        $sql = "SELECT * FROM HU_CAFE_EMPLOYEEDATA where step_id = (select MAX(step_id) as stepid FROM HU_CAFETERIA_NYILATK where processid='".$processID."') and customToken='".$customToken."' and taxID='HU".$taxID."'";
        $this->alert($sql);
        $found=0;
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            $this->dump($row);
            $found++;
        }
        if ($found>0)
        {
            $this->setReturnValue('success', true);
        }
        else
        {
            $this->setReturnValue('success', false);
        }
	}
}
?>