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
		$tokenHelperArray=array(
			"a",
			"á",
			"b",
			"c",
			"d",
			"e",
			"é",
			"f",
			"g",
			"h",
			"i",
			"í",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"ó",
			"ö",
			"ő",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"ú",
			"ü",
			"ű",
			"v",
			"w",
			"x",
			"y",
			"z",
			"+",
			"!",
			"%",
			"/",
			"=",
			"(",
			")",
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			",",
			".",
			"-",
			"_",
			"$",
			"ß",
			"÷",
			"<",
			">",
			"&",
			"@",
		);
        while ($row = $externalDB->fetchRow($result)) {
			$token="";
			for ($j=0; $j < 8; $j++) {
				$randomNum=rand(0,count($tokenHelperArray)-1);
				$token.=$tokenHelperArray[$randomNum];
			}
			$token=rawurlencode($token);
			$row['TaxID']="HU".$row['TaxID'];
			$row['CustomToken']=$token;
			$row['Link']="https://jobrouter.trenkwalder.io/jobrouter/?cmd=PublicStart&ps=e1b927e1599a72e58297572b68d5b4fe&username=publicuserHU&token=".$token."&taxid=".$row['TaxID']."&processid=".$this->getProcessId();
            $returnArray[]=$row;
			//$this->dump($row);
        }
        $this->setReturnValue('success', $returnArray);
	}
}
?>