SELECT distinct DimensionName as CafeGroupName
                  FROM [ODS_HU].[Source].[vwDimensionNX]
                  where DimensionType_NexonID='MUNKAK' 
                  and [DimensionCode] in (SELECT JobTitle FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
                  WHERE ProjectName = 'Hyginett Gyöngyös' and ProjectCodeNX='BFC24'
                  AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE()))
                  and (validto is null OR validto>GETDATE())
                  and Mandant = '4MTL'