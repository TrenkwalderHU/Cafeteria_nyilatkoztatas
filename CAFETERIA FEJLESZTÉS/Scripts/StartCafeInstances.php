<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
		$department=$this->getTableValue('Department');
		$entity=$this->getTableValue('TrenkwalderEntitySel');
		$mandantMossID=$this->getTableValue('MandantMossID');
		$departmentArray = explode("(", $department);
		$departmentName="";
		for ($i=0;$i<count($departmentArray)-1;$i++){
			if ($i==0){
				$departmentName=$departmentArray[$i];
			}
			else{
				$departmentName.="(".$departmentArray[$i];
			}
		}
		$projectCode = substr($departmentArray[count($departmentArray)-1], 0, strlen($departmentArray[count($departmentArray)-1])-1);
		$externalDB = $this->getDBConnection('ODS_HU');
        $sql = "SELECT * 
				FROM [ODS_HU].[ODS].[DimEmployee]
  				where id in (SELECT EmployeeID FROM [ODS_HU].[ODS].[DimWorkContractBaseNX]
					WHERE id in (SELECT WorkContractBaseID FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
  						WHERE ProjectName like '".$departmentName."' and ProjectCodeNX='".$projectCode."'
  						AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE()))
                  and (validto is null OR validto>=CONVERT(date, getdate())))
				and MandantMossID=".$mandantMossID."
  				order by LastName asc";
        $result = $externalDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($externalDB->getErrorMessage());
        }
        while ($row = $externalDB->fetchRow($result)) {
            $returnArray[]=$row;
        }
        $creator='szabopet';
        $this->dbWrite = $this->getDBConnection('JobRouter_DB_Write');
		$insstring = '';
		    $mapping = array
		    (
		        'TargetSelector' => $this->getTableValue('TargetSelector'),
		        'TrenkwalderEntitySel' => $this->getTableValue('TrenkwalderEntitySel'),
		        'Department' => $this->getTableValue('Department'),
		        'Branch' => $this->getTableValue('Branch'),
		        'HRReferee' => $this->getTableValue('HRReferee'),
		        'Payroller' => $this->getTableValue('Payroller'),
		        'TaxingTypeSelector' => $this->getTableValue('TaxingTypeSelector'),
		        'TermSelector' => $this->getTableValue('TermSelector'),
		        'CafeGroupSelector' => $this->getTableValue('CafeGroupSelector'),
		        'AvailableSum' => $this->getTableValue('AvailableSum'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTYEAR' => $this->getTableValue('TargetSelector'),
		        'FIRSTMONTH' => $this->getTableValue('TargetSelector')
			);
        $version = $this->getVersion();
        $incident = $this->getIncident();
        $subtableInsstring = "";
        $date = date("Y-m-d H:i:s");
        foreach ($objArray as $key => $row) {
            
    		foreach($mapping as $column => $value) 
    		{
    		    $insstring .= $column . '=' . $value . ';';
    		}
    		$sql = "INSERT INTO JRJOBIMPORT
    					   (processname
    					   ,version
    					   ,step
    					   ,initiator
    					   ,insstring
    					   ,subtable_insstring
    					   ,username
    					   ,create_date)
    				  SELECT :processname
    					   ,'". $version ."' AS 'version'
    					   ,19
    					   ,:initiator
    					   ,:insstring
    					   ,:subtable_insstring
    					   ,:username
    					   ,:create_date";
    		$parameterValues = array('processname' => 'HU_Employee_Forecast'
    								,'initiator' => $creator
    								,'insstring' => $insstring
    								,'subtable_insstring' => $subtableInsstring
    								,'username' => $creator //hardcoded to myself so they do not get it into the inbox
    								,'create_date' => $date);
        	$parameterTypes = array(JobDB::TYPE_TEXT,JobDB::TYPE_TEXT
    								,JobDB::TYPE_TEXT,JobDB::TYPE_TEXT
    								,JobDB::TYPE_TEXT,JobDB::TYPE_DATETIME);
    
    		$result = $this->dbWrite->preparedExecute($sql, $parameterValues, $parameterTypes, new LogInfo(__METHOD__));
    		$this->dbWrite->free($result);
        }
	}
}
?>