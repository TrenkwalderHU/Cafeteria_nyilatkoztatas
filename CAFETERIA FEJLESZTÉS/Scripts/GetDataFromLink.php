<?php

class CafeOption
{
    public $optionName;
    public $optionDisplayName;
    public $optionMultiplier;
    public $optionLimitAmount1;
    public $optionLimitPeriod1;
    public $optionLimitAmount2;
    public $optionLimitPeriod2;
    public $optionLimitAmount3;
    public $optionLimitPeriod3;
    public $optionLimitAmount4;
    public $optionLimitPeriod4;
}

class className extends JobRouter\Engine\Runtime\PhpFunction\DialogFunction
{
	public function execute($rowId = null)
	{
        $returnArray=[];
        $availableOptions=[];
        //get cafe options from jobdata
        $jobDB = $this->getJobDB();
        $sql = "SELECT * FROM HU_CAFE_OPTIONS";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            //$this->dump($row);
            $co=new CafeOption;
            $co->optionName=$row["optionName"];
            $co->optionDisplayName=$row["optionDisplayName"];
            $co->optionMultiplier=$row["optionMultiplier"];
            $co->optionLimitAmount1=$row["optionLimitAmount1"];
            $co->optionLimitPeriod1=$row["optionLimitPeriod1"];
            $co->optionLimitAmount2=$row["optionLimitAmount2"];
            $co->optionLimitPeriod2=$row["optionLimitPeriod2"];
            $co->optionLimitAmount3=$row["optionLimitAmount3"];
            $co->optionLimitPeriod3=$row["optionLimitPeriod3"];
            $co->optionLimitAmount4=$row["optionLimitAmount4"];
            $co->optionLimitPeriod4=$row["optionLimitPeriod4"];
            array_push($availableOptions,$co);
        }

        $options=[];
        $groups=[];

	    $isTest=$this->getTableValue("isTest");
        if ($isTest==1){
            $returnArray["taxID"]=12345678;
            $returnArray["jobTitle"]="Tesztelő";
            $returnArray["firstName"]="Teszt";
            $returnArray["lastName"]="Elek";
            $returnArray["validFrom"]=$this->getTableValue("ValidFromDate");
            $returnArray["birthName"]="Tesztelek";
            $returnArray["email"]="teszt@test.com";
            $returnArray["ProbationPeriodEnd"]=$this->getTableValue("TestProbationPerEnd");

            $returnArray["CafeGroupSelector"]=0;
            $returnArray["TermSelector"]=$this->getTableValue("TermSelector");
            $returnArray["TaxingTypeSelector"]=$this->getTableValue("TaxingTypeSelector");
            $returnArray["AvailableAmount"]=$this->getTableValue("AvailableAmount");
            $returnArray["FirstWDayOfTheYear"]=$this->getTableValue("FirstWDayOfTheYear");
            $returnArray["EqualMonthRule"]=$this->getTableValue("EqualMonthRule");
            $returnArray["ProbationMonthRule"]=$this->getTableValue("ProbationMonthRule");
            $returnArray["ValidMonthRule"]=$this->getTableValue("ValidMonthRule");
            $returnArray["CafeteriaDeadline"]='2050-01-01';

            //check which of the available options were selected and load them into the array
            foreach ($availableOptions as $option) {
                $optionNeeded=$this->getTableValue($option->optionName);
                if ($optionNeeded==1) {
                    array_push($options,$option);
                }
            }
        }
        else{
            $stepID="";
            //get the url from JS
            $url = $this->getParameter('url');
            //parse params from the url
            $queryString = parse_url($url, PHP_URL_QUERY);
            parse_str($queryString, $params);
            $taxID = $params['taxid'];
            $processID = $params['processid'];
            
            //get employee data from DB
            $sql = "SELECT * FROM HU_CAFE_EMPLOYEEDATA where step_id = (select MAX(step_id) as stepid FROM HU_CAFETERIA_NYILATK where processid='".$processID."') and taxID='".$taxID."'";
            $this->alert($sql);
            $result = $jobDB->query($sql);
            if ($result === false) {
                throw new JobRouterException($jobDB->getErrorMessage());
            }
            while ($row = $jobDB->fetchRow($result)) {
                $this->dump($row);
                $taxID=substr($row["taxID"],2);
                $returnArray["taxID"]=$taxID;
                $returnArray["jobTitle"]=$row["jobTitle"];
                $returnArray["firstName"]=$row["firstName"];
                $returnArray["lastName"]=$row["lastName"];
                $returnArray["validFrom"]=$row["validFrom"];
                $returnArray["validTo"]=$row["validTo"];
                $returnArray["birthName"]=$row["birthName"];
                $returnArray["email"]=$row["email"];
                $returnArray["ProbationPeriodEnd"]=$row["ProbationPeriodEnd"];
                $stepID=$row["step_id"];
            }

            //get process table data from the process table
            $sql = "SELECT * FROM HU_CAFETERIA_NYILATK where step_id='".$stepID."'";
            $this->alert($sql);
            $result = $jobDB->query($sql);
            if ($result === false) {
                throw new JobRouterException($jobDB->getErrorMessage());
            }
            while ($row = $jobDB->fetchRow($result)) {
                $this->dump($row);

                //check which of the available options were selected and load them into the array
                foreach ($availableOptions as $option) {
                    $optionNeeded=$row[$option->optionName];
                    if ($optionNeeded==1) {
                        array_push($options,$option);
                    }
                }
                $returnArray["CafeGroupSelector"]=$row['CafeGroupSelector'];
                $returnArray["TermSelector"]=$row['TermSelector'] ;
                $returnArray["TargetSelector"]=$row['TargetSelector'] ;
                $returnArray["TaxingTypeSelector"]=$row['TaxingTypeSelector'] ;
                $returnArray["NoValidMonthRules"]=$row['NoValidMonthRules'] ;
                $returnArray["UnjustifiedAbsence"]=$row['UnjustifiedAbsence'] ;
                $returnArray["NumberOfUnjustifiedA"]=$row['NumberOfUnjustifiedA'] ;
                $returnArray["CafeteriaDeadline"]=$row['CafeteriaDeadline'] ;
                $returnArray["TrenkwalderEntitySel"]=$row['TrenkwalderEntitySel'] ;
                $returnArray["Department"]=$row['Department'] ;
                $returnArray["Branch"]=$row['Branch'] ;
                $returnArray["HRReferee"]=$row['HRReferee'] ;
                $returnArray["Payroller"]=$row['Payroller'] ;
                $returnArray["TaxNumber"]=$row['TaxNumber'] ;
                $returnArray["MandantMossID"]=$row['MandantMossID'] ;
                $returnArray["AvailableAmount"]=$row['AvailableAmount'];
                $returnArray["FirstWDayOfTheYear"]=$row['FirstWDayOfTheYear'];
                $returnArray["EqualMonthRule"]=$row['EqualMonthRule'];
                $returnArray["ProbationMonthRule"]=$row['ProbationMonthRule'];
                $returnArray["ValidMonthRule"]=$row['ValidMonthRule'];
            }
            //if we need to get the cafe title groups and amounts
            if ($returnArray["CafeGroupSelector"]>0) {
                //get process table data from the process table
                $sql = "SELECT * FROM HU_CAFE_GROUPS_LIST where step_id='".$stepID."'";
                $this->alert($sql);
                $result = $jobDB->query($sql);
                if ($result === false) {
                    throw new JobRouterException($jobDB->getErrorMessage());
                }
                while ($row = $jobDB->fetchRow($result)) {
                    //$this->dump($row);
                    array_push($groups,$row);
                }
            }
        }
        $returnArray["Groups"]=$groups;
        $returnArray["Options"]=$options;
        $this->setReturnValue('success', $returnArray);
	}
}
?>