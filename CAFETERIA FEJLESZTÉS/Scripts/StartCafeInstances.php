<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\RuleExecutionFunction
{
	public function execute($rowId = null)
	{
		$objArray=$this->getParameter('objArr');
        $creator='szabopet';
        $this->dbWrite = $this->getDBConnection('JobRouter_DB_Write');
        $version = $this->getVersion();
        $incident = $this->getIncident();
        $subtableInsstring = "";
        $date = date("Y-m-d H:i:s");
        foreach ($objArray as $key => $row) {
            $insstring = '';
		    $mapping = array
		    (
		        'BRANCH_CODE' => $row['BranchCode'],
		        'BRANCH_NAME' => $row['BranchName'],
		        'Region' => $row['Region'],
		        'UNIT' => $row['Unit'],
		        'USER_NAME' => $row['TLName'],
		        'FIRSTYEAR' => $row['FirstYear'],
		        'FIRSTMONTH' => $row['FirstMonth']
			);
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