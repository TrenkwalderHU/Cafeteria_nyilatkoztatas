<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\DialogFunction
{
	public function execute($rowId = null)
	{
	    $returnArray=[];
		$department=$this->getParameter('department');
		$mandantMossID=$this->getParameter('entity');
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
        $sql = "SELECT e.FirstName, e.LastName, e.BirthName, e.TaxID, e.Email, base.ValidFrom, base.ValidTo, dim.DimensionName, base.ProbationPeriodEnd
				FROM [ODS_HU].[ODS].[DimEmployee] e 
				inner join [ODS_HU].[ODS].[DimWorkContractBaseNX] base on e.ID=base.EmployeeID
				inner join [ODS_HU].[ODS].[DimWorkContractDetailNX] detail on base.ID=detail.WorkContractBaseID
				inner join [ODS_HU].[Source].[vwDimensionNX] dim on dim.DimensionCode=detail.JobTitle
  				where detail.ProjectName = '".$departmentName."' and detail.ProjectCodeNX='".$projectCode."'
				AND detail.DetailYear = YEAR(GETDATE()) AND detail.DetailMonth = MONTH(GETDATE())
				and (base.validto is null OR base.validto>=CONVERT(date, getdate()))
				and e.MandantMossID=".$mandantMossID."
				and dim.DimensionType_NexonID='Munkak'
				and dim.MandantMossID=".$mandantMossID."
				order by e.LastName asc";
        //$this->alert($sql);
        $result = $externalDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($externalDB->getErrorMessage());
        }
        /*$rowID=1;
		while ($row = $externalDB->fetchRow($result)) {
            //$this->dump($row);
            $name= $row['FullName'];
            $tax = $row['TaxID'];
            $email = $row['Email'];
            $validFrom = $row['ValidFrom'];
            $jobTitle = $row['DimensionName'];
            
            $returnArray = array(
                'name' => $name,
                'taxid' => "HU".$tax,
                'email' => $email,
                'validFrom' => $validFrom,
                'jobTitle' => $jobTitle,
                'link' => "https://jobrouter.trenkwalder.io/jobrouter/?cmd=PublicStart&ps=e1b927e1599a72e58297572b68d5b4fe&username=publicuserHU&taxid=".$tax
            ); 
            $this->insertSubtableRow('HU_CAFE_EMPLOYEEDATA', $rowID, $returnArray);
            
            $rowID++;
        }*/
        while ($row = $externalDB->fetchRow($result)) {
			$row['TaxID']="HU".$row['TaxID'];
			$row['Link']=[jr_link];
            $returnArray[]=$row;
			//$this->dump($row);
        }
        $this->setReturnValue('success', $returnArray);
	}
}
?>