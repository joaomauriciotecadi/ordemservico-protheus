#INCLUDE 'totvs.ch'
#INCLUDE 'restful.ch'

WSRESTFUL Ordens DESCRIPTION "Monintor Serviços"

    WSDATA filial   as String OPTIONAL
    WSDATA cliente  as String OPTIONAL
    WSDATA loja     as String OPTIONAL
    WSDATA datade   as String OPTIONAL
    WSDATA dataate  as String OPTIONAL
	WSDATA page     as INTEGER OPTIONAL 
    WSDATA pageSize as INTEGER OPTIONAL

WSMETHOD GET listaOrdens;
    DESCRIPTION "Lista ordem de serviço";
    WSSYNTAX "api/v1/ordens" ;
    PATH "api/v1/ordens" ; 

END WSRESTFUL

WSMETHOD GET listaOrdens QUERYPARAM page, pageSize, filial, cliente, loja, datade, dataate WSSERVICE Ordens
    Local oJson as object
    Local oJsonRes := JsonObject():New()

    Local cAliasOS  := GetNextAlias() 
	Local cNumOs    := ""
    Local cQueryOS  := ""
    Local nAux      := 0
	Local nCount    := 0
	Local nReg      := 0
	Local nStart    := 1

	Default ::page      := 1
    Default ::pageSize  := 20

    // define o tipo de retorno do método
	::SetContentType("application/json")

    cQueryOS := "SELECT *, CASE         "
    cQueryOS += "      WHEN Z05.Z05_TPOPER = 'S' THEN 'Saída'"
    cQueryOS += "      WHEN Z05.Z05_TPOPER = 'E' THEN 'Entrada'"
    cQueryOS += "      WHEN Z05.Z05_TPOPER = 'I' THEN 'Interno'"
    cQueryOS += "      END AS 'DESC_OPERACAO' "
    cQueryOS += "      FROM Z05010 Z05 "
    cQueryOS += " WHERE Z05.D_E_L_E_T_ = ''  "

	If !Empty(::filial)
 		cQueryOS += " AND Z05.Z05_FILIAL  = '"+::filial+"'  "   
	EndIf

	If !Empty(::cliente) .and. !Empty(::loja)
    	cQueryOS += " AND Z05.Z05_CLIENT = '"+::cliente+"'  "
    	cQueryOS += " AND Z05.Z05_LOJA  = '"+::loja+"'  "
	Endif

	If !Empty(::datade) .and. !Empty(::dataate)	
		cQueryOS += " AND Z05.Z05_DTEMIS BETWEEN '"+STRTRAN(::datade,'-')+"' AND '"+STRTRAN(::dataate,'-')+"' "
	EndIf

   	// executa a query
	dbUseArea(.T., "TOPCONN", TcGenQry(,,cQueryOS), cAliasOS, .F., .T.)

	oJsonRes['ordens_servico'] := {}

	cTimeIni := Time()

    If (cAliasOS)->(!Eof()) 

		COUNT TO nRecord

		oJsonRes['page'] := ::page

		If ::page > 1
			nStart := ( ( ::page - 1 ) * ::pageSize ) + 1
			nReg := nRecord - nStart + 1
		Else
			nReg := nRecord
		EndIf

		( cAliasOS )->( DBGoTop() )
	
		If nReg  > ::pageSize
			oJsonRes['hasNext'] := .T.
		Else
			oJsonRes['hasNext'] := .F.
		EndIf
	Else		 
        oJsonRes['hasNext'] := .F.
	EndIf

    While (cAliasOS)->(!EoF())	
	  	nCount++
        If nCount >= nStart
			cTimeOS := Time()
			
            nAux++

			cNumOs := (cAliasOS)->(Z05_NUMOS)
			cFil := (cAliasOS)->(Z05_FILIAL)

			conout("Inicio busca OS "+cNumOs+"")

			oJson := JsonObject():New()              
			oJson[ 'filial' ]       := cFil
			oJson[ 'numos' ]        := cNumOs
			oJson[ 'cliente' ]      := (cAliasOS)->(Z05_CLIENT)
			oJson[ 'loja' ]         := (cAliasOS)->(Z05_LOJA)
			oJson[ 'data_emissao' ] := (cAliasOS)->(Z05_DTEMIS)
			oJson[ 'hora_emissao' ] := (cAliasOS)->(Z05_HREMIS)
			oJson[ 'operacao' ]     := (cAliasOS)->(DESC_OPERACAO)
			//oJson[ 'sequencias' ]   := {}

			/*cQuerySeq := "SELECT * ,      "
			cQuerySeq += "		Z06.Z06_SERVIC AS 'SERVICO_COD', "
			cQuerySeq += "		SX5_SERV.X5_DESCRI AS 'SERVICO_DESC', "
			cQuerySeq += "		Z06.Z06_TAREFA AS 'TAREFA_COD', "
			cQuerySeq += "		SX5_TAREFA.X5_DESCRI AS 'TAREFA_DESC', "
			cQuerySeq += "		Z06.Z06_DTINIC AS 'DATA_EMISSAO_SEQ',
			cQuerySeq += "		Z06.Z06_HRINIC  AS 'HORA_EMISSAO_SEQ',
			cQuerySeq += "		Z06.Z06_DTFIM  AS 'DATA_FIM_SEQ',
			cQuerySeq += "		Z06.Z06_HRFIM  AS 'HORA_FIM_SEQ'
			cQuerySeq += " FROM Z06010 Z06 "
			cQuerySeq += "	INNER JOIN SX5010 SX5_SERV ON ( "
			cQuerySeq += "		SX5_SERV.D_E_L_E_T_ = '' AND  "
			cQuerySeq += "		SX5_SERV.X5_TABELA = 'L4' AND  "
			cQuerySeq += "		SX5_SERV.X5_CHAVE = Z06.Z06_SERVIC  "
			cQuerySeq += "	) "
			cQuerySeq += "	INNER JOIN SX5010 SX5_TAREFA ON ( "
			cQuerySeq += "		SX5_TAREFA.D_E_L_E_T_ = '' AND  "
			cQuerySeq += "		SX5_TAREFA.X5_TABELA = 'L2' AND  "
			cQuerySeq += "		SX5_TAREFA.X5_CHAVE = Z06.Z06_TAREFA   "
			cQuerySeq += "	) "
			cQuerySeq += " WHERE Z06.D_E_L_E_T_ = ''  "
			cQuerySeq += " AND Z06.Z06_FILIAL  = '107'  "
			cQuerySeq += " AND Z06.Z06_NUMOS  = '"+cNumOs+"'  "

			// executa a query
			dbUseArea(.T., "TOPCONN", TcGenQry(,,cQuerySeq), cAliasSeq, .F., .T.)

			While (cAliasSeq)->(!EoF())				
				oJsonSeq                       := JsonObject():New()
				oJsonSeq[ 'tarefa_desc' ]      := Alltrim((cAliasSeq)->(TAREFA_DESC))
				oJsonSeq[ 'servico_desc' ]     := Alltrim((cAliasSeq)->(SERVICO_DESC))
				oJsonSeq[ 'DATA_EMISSAO_SEQ' ] := Alltrim((cAliasSeq)->(DATA_EMISSAO_SEQ))
				oJsonSeq[ 'HORA_EMISSAO_SEQ' ] := Alltrim((cAliasSeq)->(HORA_EMISSAO_SEQ))
				oJsonSeq[ 'DATA_FIM_SEQ' ]     := Alltrim((cAliasSeq)->(DATA_FIM_SEQ))
				oJsonSeq[ 'HORA_FIM_SEQ' ]     := Alltrim((cAliasSeq)->(HORA_FIM_SEQ))

				Aadd(oJson[ 'sequencias' ], oJsonSeq)

				(cAliasSeq)->(DbSkip())
			EndDo*/
		
			conout("Inicio busca perc_apanhe "+cNumOs+"")
			oJson[ 'perc_apanhe' ]     := fPerc002(cFil,cNumOs)	

			Aadd(oJsonRes['ordens_servico'], oJson)

			conout('Tempo busca OS '+cNumOs+':', ELAPTIME(cTimeOS, TIME()) )

			If Len(oJsonRes['ordens_servico']) >= ::pageSize
                Exit
            EndIf
		EndIf
		
        (cAliasOS)->(DbSkip())
    EndDo
    (cAliasOS)->(DbCloseArea())

	conout('difernça tempo resposta:', ELAPTIME(cTimeIni, TIME()) )

    ::SetResponse(EncodeUTF8(oJsonRes:toJson()))   
Return


/*/{Protheus.doc} fPerc002
	Perc. do apanhe
	@type  Static Function
	@author mauricio
	@since 25/05/2023
	@version 1.0
	@param numos, char, numero da os
	@param numos, char, numero da os
	@return nperc, numeric, perc. concluido do apanhe
/*/
Static Function fPerc002(cFil,cNumOs)
	Local nTotal := 0
	Local nQtd := 0
	Local nPerc002 := 0
	Local cAlias  := GetNextAlias() 
	Local cQuery  := ""

	cQuery := " SELECT Z08.Z08_TAREFA  ,Z08_STATUS  ,SUM(Z08_QUANT) QUANT "
	cQuery += " FROM Z08010 Z08 "
	cQuery += " WHERE Z08.Z08_FILIAL = '"+cFil+"'  "
	cQuery += " AND Z08.Z08_NUMOS =  '"+cNumOs+"'  "
	cQuery += " AND Z08.D_E_L_E_T_ = '' "
	cQuery += " GROUP BY Z08.Z08_STATUS, Z08.Z08_TAREFA   "

	// executa a query
	dbUseArea(.T., "TOPCONN", TcGenQry(,,cQuery), cAlias, .F., .T.)

	oJsonCalc  := JsonObject():New()

	
	While (cAlias)->(!EoF())	
		cTarefa := (cAlias)->Z08_TAREFA				

		If (cAlias)->Z08_STATUS == "R"
			oJsonCalc[cTarefa] := (cAlias)->(QUANT)
		EndIf

		nTotal += (cAlias)->(QUANT)

		(cAlias)->(DbSkip())
	EndDo

	(cAlias)->(DbCloseArea())

	If oJsonCalc:hasproperty('002')
		nQtd := oJsonCalc[cTarefa]
	endif

	nPerc002 := round((nQtd/nTotal) * 100,2)

Return nPerc002

/*/{Protheus.doc} fPerc003
	(long_description)
	@type  Static Function
	@author user
	@since 25/05/2023
	@version version
	@param param_name, param_type, param_descr
	@return return_var, return_type, return_description
	@example
	(examples)
	@see (links_or_references)
/*/
Static Function fPerc003(param_name)
	
Return nPerc003

