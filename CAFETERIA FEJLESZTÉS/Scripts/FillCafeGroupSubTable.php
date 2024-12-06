<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\DialogFunction
{
	public function execute($rowId = null)
	{
        $returnArray=array();
		$department=$this->getParameter('department');
		$entity=$this->getParameter('entity');
		$departmentName = substr($department, 0, (strpos($department, "(")-1));
		$projectCode = substr($department, strpos($department, "(")+1, strpos($department, ")")-strpos($department, "(")-1);
		$externalDB = $this->getDBConnection('ODS_HU');
        $sql = "SELECT distinct DimensionName as CafeGroupName
                  FROM [ODS_HU].[Source].[vwDimensionNX]
                  where DimensionType_NexonID='MUNKAK' 
                  and [DimensionCode] in (SELECT JobTitle FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
                  WHERE ProjectName = '".$departmentName."' and ProjectCodeNX='".$projectCode."'
                  AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE()))
                  and (validto is null OR validto>GETDATE())
                  and Mandant = '".$entity."'";
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