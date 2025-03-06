 SELECT *
  FROM [ODS_HU].[ODS].[DimEmployee]
  where id in (SELECT EmployeeID FROM [ODS_HU].[ODS].[DimWorkContractBaseNX]
WHERE id in (SELECT WorkContractBaseID FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
  WHERE ProjectName like 'Hyginett%'
  AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE()))
                  and (validto is null OR validto>GETDATE()))
				  and MandantMossID=420
  order by LastName asc


  Select * from [ODS_HU].[ODS].[DimWorkContractBaseNX]
  where EmployeeID='12942326'

  SELECT * FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
  where WorkContractBaseID='21538139'