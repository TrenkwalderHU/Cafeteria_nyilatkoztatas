  SELECT distinct DimensionName
  FROM [ODS_HU].[Source].[vwDimensionNX]
  where DimensionType_NexonID='MUNKAK' 
  and [DimensionCode] in (SELECT JobTitle FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
  WHERE ProjectName like 'Hyginett%' 
  AND DetailYear = 2024 AND DetailMonth = 11)
  and (validto is null OR validto>GETDATE())

  SELECT *
  FROM [ODS_HU].[Source].[vwDimensionNX]
  where DimensionType_NexonID='MUNKAK' 
  and [DimensionCode] in (SELECT JobTitle FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
  WHERE ProjectName like 'Hyginett%'
  AND DetailYear = 2024 AND DetailMonth = 12)
  and MandantMossID=420
  order by DimensionCode asc

  SELECT distinct DimensionName as GroupName                   
  FROM [ODS_HU].[Source].[vwDimensionNX]                   
  where DimensionType_NexonID='MUNKAK'                    
  and [DimensionCode] in (SELECT JobTitle FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]                   
  WHERE ProjectName = 'Hyginett Gyöngyös'                    AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE()))