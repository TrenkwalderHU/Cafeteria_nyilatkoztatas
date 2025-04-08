function OnProbationClick(isNeeded){
    if (isNeeded=="no") {
        jr_hide("ProbationPeriodEnd");
    }
    else
    {
        jr_show("ProbationPeriodEnd");
    }
}