SELECT * FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
                  WHERE ProjectName = 'Hyginett Gyöngyös'
                  AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE())