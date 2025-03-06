<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\DialogFunction
{
	public function execute($rowId = null)
	{
        $returnArray=array();
		$department=$this->getParameter('department');
		$entity=$this->getParameter('entity');
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
        $sql = "SELECT distinct DimensionName as CafeGroupName
                  FROM [ODS_HU].[Source].[vwDimensionNX]
                  where DimensionType_NexonID='MUNKAK' 
                  and [DimensionCode] in (SELECT JobTitle FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
                  WHERE ProjectName = '".$departmentName."' and ProjectCodeNX='".$projectCode."'
                  AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE()))
                  and (validto is null OR validto>=CONVERT(date, getdate()))
                  and MandantMossID = ".$entity;
        $result = $externalDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($externalDB->getErrorMessage());
        }
        while ($row = $externalDB->fetchRow($result)) {
            $returnArray[]=$row;
        }
        $this->setReturnValue('success', $returnArray);
	}
}
?>