<?php

class className extends JobRouter\Engine\Runtime\PhpFunction\DialogFunction
{
	public function execute($rowId = null)
	{
		$stepID = $this->getParameter('stepID');
        $returnArray=[];
        $groups=[];
        $jobDB = $this->getJobDB();
        $sql = "SELECT * FROM HU_CAFETERIA_NYILATK where step_id = '".$stepID."'";
        $this->alert($sql);
        $result = $jobDB->query($sql);
        if ($result === false) {
            throw new JobRouterException($jobDB->getErrorMessage());
        }
        while ($row = $jobDB->fetchRow($result)) {
            //$this->dump($row);
            $returnArray["TargetSelector"]=$row['TargetSelector'];
            $returnArray["TrenkwalderEntitySel"]=$row['TrenkwalderEntitySel'];
            $returnArray["MandantMossID"]=$row['MandantMossID'];
            $returnArray["Department"]=$row['Department'];
            $returnArray["Branch"]=$row['Branch'];
            $returnArray["HRReferee"]=$row['HRReferee'];
            $returnArray["Payroller"]=$row['Payroller'];
            $returnArray["TaxingTypeSelector"]=$row['TaxingTypeSelector'];
            $returnArray["TermSelector"]=$row['TermSelector'];
            $returnArray["CafeGroupSelector"]=$row['CafeGroupSelector'];
            //meg kell írni a groupokat if-el
            $returnArray["AvailableAmount"]=$row['AvailableAmount'];
            $returnArray["EqualMonthRule"]=$row['EqualMonthRule'];
            $returnArray["FirstWDayOfTheYear"]=$row['FirstWDayOfTheYear'];
            $returnArray["ValidMonthRule"]=$row['ValidMonthRule'];
            $returnArray["ProbationMonthRule"]=$row['ProbationMonthRule'];
            $returnArray["UnjustifiedAbsence"]=$row['UnjustifiedAbsence'];
            $returnArray["NumberOfUnjustifiedA"]=$row['NumberOfUnjustifiedA'];
            $returnArray["CafeteriaDeadline"]=$row['CafeteriaDeadline'];

            $returnArray["CommuteRefund"]=$row['CommuteRefund'];
            $returnArray["HousingSupport"]=$row['HousingSupport'];
            $returnArray["ZooTicket"]=$row['ZooTicket'];
            $returnArray["StudentLoanSupport"]=$row['StudentLoanSupport'];
            $returnArray["GlassesRefund"]=$row['GlassesRefund'];
            $returnArray["MoneyAllowance"]=$row['MoneyAllowance'];
            $returnArray["VolunteerMemberFee"]=$row['VolunteerMemberFee'];
            $returnArray["CheckoutPayments"]=$row['CheckoutPayments'];
            $returnArray["LowCostPresent"]=$row['LowCostPresent'];
            $returnArray["GroupRiskInsurances"]=$row['GroupRiskInsurances'];
            $returnArray["WineProducts"]=$row['WineProducts'];
            $returnArray["HomeOfficeAllowance"]=$row['HomeOfficeAllowance'];
            $returnArray["CarSharing"]=$row['CarSharing'];
            $returnArray["BicycleUsage"]=$row['BicycleUsage'];
            $returnArray["VirusTestAndVaccine"]=$row['VirusTestAndVaccine'];
            $returnArray["KindergartenAllowance"]=$row['KindergartenAllowance'];
            $returnArray["SportTicket"]=$row['SportTicket'];
            $returnArray["CultureTicket"]=$row['CultureTicket'];
            $returnArray["SZEPAboveLimit"]=$row['SZEPAboveLimit'];
            $returnArray["SZEPActive"]=$row['SZEPActive'];
            $returnArray["SZEPUnderLimit"]=$row['SZEPUnderLimit'];
        }

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
        $returnArray["Groups"]=$groups;
        
        $this->setReturnValue('success', $returnArray);
	}
}
?>