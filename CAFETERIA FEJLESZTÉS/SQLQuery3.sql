SELECT * FROM [ODS_HU].[ODS].[DimWorkContractDetailNX]
                  WHERE ProjectName = 'Hyginett Gy�ngy�s'
                  AND DetailYear = YEAR(GETDATE()) AND DetailMonth = MONTH(GETDATE())