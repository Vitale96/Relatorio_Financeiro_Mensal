
// Listener para mensagens do Vue
window.addEventListener('message', function (event) {
    verificaArmazenaDados(event);


    if (event.data.action === 'FECHAR_MODAL') {
        fecharModal();
    }

    if (event.data.action === 'EMITIR_SALVAR') {
        var dadosIbsCbs = toDadosIBSCBSJson(JSON.parse(hdnIbsCbs.value));
        hdnEmitirIbsCbs.value = dadosIbsCbs;

        btEmitir.click();
    }
});

function validarData() {
    const valor = txtDataFatoGerador.value; // dd/MM/yyyy

    if (!valor || valor.length < 10)
        return;

    const dataDigitada = converterParaISO(valor);

    if (!dataDigitada)
        return;

    // COMPARAÇÃO
    //if (dataDigitada >= inicioLayoutRTOnline) {
    //    // Data >= limite → desabilita versão 1
    //    rbVersao1.disabled = true;
    //    rbVersao2.disabled = false;
    //    rbVersao2.checked = true;
    //} else {
    //    // Data < limite → habilita versão 1
    //    rbVersao1.disabled = false;
    //    rbVersao2.disabled = false;
    //    rbVersao1.checked = true;
    //}
}

// Converte "dd/MM/yyyy" → Date("yyyy-MM-dd")
function converterParaISO(dataBR) {
    const partes = dataBR.split("/");
    if (partes.length !== 3) return null;

    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];

    return `${ano}-${mes}-${dia}`;
}

function verificaArmazenaDados(event) {
    var dadosIbsCbs = "";
    if (event.data?.dadosIbsCbs && Object.keys(event.data.dadosIbsCbs).length > 0) {
        dadosIbsCbs = event.data.dadosIbsCbs;
    }

    hdnIbsCbs.value = JSON.stringify(dadosIbsCbs);
    if (ckNaoVisualizar !== null) {
        ckNaoVisualizar.checked = dadosIbsCbs.visualizarNota;
    }
}

function toDecimal(valor) {
    if (!valor) return 0;

    return Number(valor.replace(/\./g, '').replace(',', '.'));
}

function executarFechar() {
    if (event) event.preventDefault(); // opcional
    //Pegar IFrame
    var iframe = document.getElementById('iframeIbsCbs');
    // Passar dados para o iframe quando carregar
    iframe.contentWindow.postMessage({
        type: "EXECUTAR_FECHAR"
    }, "*");
}

function fecharModal() {
    const modal = document.getElementById("ibcCbsModal");
    //modal.style.display = "none";
    modal.classList.remove('is-visible');
}

function toDadosIBSCBSJson(ibsCbs) {
    const regexLimpaCaracterNumero = /[.,\s-]/g

    let novoIbsCbs = {
        /* Destinatario*/
        indicadorDestinatario: (ibsCbs.destinatario.tipoIdentificacao === '' ? '0' : '1'),
        /*Servico Prestado*/
        cClassTribIBSCBS: ibsCbs.servicoPrestado.cClassTribIBSCBS,
        codigoIndicadorOperacao: ibsCbs.servicoPrestado.codigoIndicadorOperacao,
        nbs: ibsCbs.servicoPrestado.nbs,
        ncm: ibsCbs.servicoPrestado.ncm,
        localPrestacaoServico: ibsCbs.servicoPrestado.localPrestacaoServico,
        paisPrestacaoServico: ibsCbs.servicoPrestado.paisPrestacaoServico,
        cClassTribDeson: ibsCbs.servicoPrestado.cClassTribDeson,
        indicadorFinalidadeOperacao: ibsCbs.servicoPrestado.indicadorFinalidadeOperacao, //Operação de Uso ou Consumo Pessoal
        finalidadeEmissao: ibsCbs.servicoPrestado.finalidadeEmissao, //Finalidade da Emissão da Nota
        tipoOperacaoEnteGov: ibsCbs.servicoPrestado.tipoOperacaoEnteGov,
        exigibilidadeSuspensa: ibsCbs.servicoPrestado.exigibilidadeSuspensa,
        pagamentoParceladoAntecipado: ibsCbs.servicoPrestado.pagamentoParceladoAntecipado,
        /* Calculos */
        valorInicialCobrado: ibsCbs.valores.valorInicialCobrado.replace(regexLimpaCaracterNumero, ""),
        valorFinalCobrado: ibsCbs.valores.valorFinalCobrado.replace(regexLimpaCaracterNumero, ""),
        valorMulta: ibsCbs.valores.valorMulta.replace(regexLimpaCaracterNumero, ""),
        valorJuros: ibsCbs.valores.valorJuros.replace(regexLimpaCaracterNumero, ""),
    };

    if (ibsCbs.destinatario.tipoIdentificacao !== '') {
        let destinatario = {
            enderecoInformado: true,
            razaoSocial: ibsCbs.destinatario.razaoSocial,
            email: ibsCbs.destinatario.email,
            enderecoLogradouro: ibsCbs.destinatario.enderecoLogradouro,
            enderecoNumeroEndereco: ibsCbs.destinatario.enderecoNumeroEndereco,
            enderecoComplementoEndereco: ibsCbs.destinatario.enderecoComplementoEndereco,
            enderecoBairro: ibsCbs.destinatario.enderecoBairro,
        };
        switch (ibsCbs.destinatario.tipoIdentificacao) {
            case 'cpf':
            case 'cnpj':
                destinatario.tipoCpfCnpj = ibsCbs.destinatario.tipoCpfCnpj;
                destinatario.cpfCnpj = ibsCbs.destinatario.cpfCnpj;
                break;
            case 'nif':
                destinatario.nif = ibsCbs.destinatario.nif;
                break;
            case 'semNif':
                destinatario.naoNIF = ibsCbs.destinatario.naoNIF;
                break;
        }
        switch (ibsCbs.destinatario.tipoEndereco) {
            case '1':
                destinatario.enderecoNacCEP = ibsCbs.destinatario.enderecoNacCEP.replace(regexLimpaCaracterNumero, "");
                destinatario.enderecoNacCidadeIBGE = ibsCbs.destinatario.enderecoNacCidadeIBGE;
                break;
            case '2':
                destinatario.enderecoExtPais = ibsCbs.destinatario.enderecoExtPais;
                destinatario.enderecoExtEnderecoPostal = ibsCbs.destinatario.enderecoExtEnderecoPostal;
                destinatario.enderecoExtCidade = ibsCbs.destinatario.enderecoExtCidade;
                destinatario.enderecoExtEstadoProvinciaRegiao = ibsCbs.destinatario.enderecoExtEstadoProvinciaRegiao;
                break;
        }

        novoIbsCbs.destinatario = destinatario;
    }

    if (ibsCbs.docsRefs.length > 0) {
        const listDoc = [];
        let somarDeducao = 0;

        ibsCbs.docsRefs.forEach(item => {
            let novoItem = {
                fornecedor: {
                    razaoSocial: item.nomeRazaoSocial,
                },
                dataEmissaoDocumento: converterParaISO(item.dataEmissaoDocumento),
                dataCompetenciaDocumento: converterParaISO(item.dataCompetenciaDocumento),
                tipoReeRepRes: item.tipoReeRepRes,
                valorReeRepRes: toDecimal(item.valorReeRepRes),
            };
            somarDeducao += toDecimal(item.valorReeRepRes);

            switch (item.tipoDocumento) {
                case '1':
                    novoItem.dFeNacional = {
                        tipoChaveDFe: item.tipoChaveDFe,
                        descrTipoChaveDFe: item.descrTipoChaveDFe,
                        chaveDFe: item.chaveDFe,
                    };
                    break;
                case '2':
                    novoItem.docFiscalOutro = {
                        codigoMunicipioDocFiscal: item.codigoMunicipioDocFiscal,
                        numeroDocFiscal: item.numeroDocFiscal,
                        descrDocFiscal: item.descrDocFiscal,
                    };
                    break;
                case '3':
                    novoItem.docOutro = {
                        numeroDocOutro: item.numeroDocOutro,
                        descrDocOutro: item.descrDocOutro,
                    };
                    break;
            }

            switch (item.tipoIdentificacao) {
                case 'cpf':
                case 'cnpj':
                    novoItem.fornecedor.tipoCpfCnpj = item.tipoCpfCnpj;
                    novoItem.fornecedor.cpfCnpj = item.cpfCnpj;
                    break;
                case 'nif':
                    novoItem.fornecedor.nif = item.nif;
                    break;
                case 'semNif':
                    novoItem.fornecedor.naoNIF = item.naoNIF;
                    break;
            }
            listDoc.push(novoItem);
        });

        novoIbsCbs.listaDocumentosIBS = listDoc;
        novoIbsCbs.valorDeducaoCIBS = (somarDeducao * 100).toString().replace(regexLimpaCaracterNumero, "")
    }


    /*Imovel Obra */
    if (ibsCbs.imovelObra.tipoImovelObra !== '') {
        novoIbsCbs.imovelObraCIB = ibsCbs.imovelObra.imovelObraCIB;
        novoIbsCbs.imovelObraCodigoObra = ibsCbs.imovelObra.imovelObraCodigoObra;
        novoIbsCbs.imovelObraInscImobFisc = ibsCbs.imovelObra.imovelObraInscImobFisc;

        if (ibsCbs.imovelObra.enderecoInformado) {
            let imovelObraEndereco = {
                enderecoInformado: ibsCbs.imovelObra.enderecoInformado,
                enderecoComumLogradouro: ibsCbs.imovelObra.enderecoComumLogradouro,
                enderecoComumNumero: ibsCbs.imovelObra.enderecoComumNumero,
                enderecoComumComplemento: ibsCbs.imovelObra.enderecoComumComplemento,
                enderecoComumBairro: ibsCbs.imovelObra.enderecoComumBairro,
            };
            switch (ibsCbs.imovelObra.tipoEndereco) {
                case '1':
                    imovelObraEndereco.enderecoNacCEP = ibsCbs.imovelObra.enderecoNacCEP;
                    imovelObraEndereco.enderecoNacCidadeIBGE = ibsCbs.imovelObra.enderecoNacCidadeIBGE;
                    break;
                case '2':
                    imovelObraEndereco.enderecoExtPais = ibsCbs.imovelObra.enderecoExtPais;
                    imovelObraEndereco.enderecoExtEnderecoPostal = ibsCbs.imovelObra.enderecoExtEnderecoPostal;
                    imovelObraEndereco.enderecoExtCidade = ibsCbs.imovelObra.enderecoExtCidade;
                    imovelObraEndereco.enderecoExtEstadoProvinciaRegiao = ibsCbs.imovelObra.enderecoExtEstadoProvinciaRegiao;
                    break
            }

            novoIbsCbs.imovelObraEndereco = imovelObraEndereco;
        }
    }

    /* Evento */
    if (ibsCbs.evento.temEvento) {
        novoIbsCbs.eventoAtvNome = ibsCbs.evento.eventoAtvNome;
        novoIbsCbs.eventoAtvDataInicio = ibsCbs.evento.eventoAtvDataInicio;
        novoIbsCbs.eventoAtvDataFim = ibsCbs.evento.eventoAtvDataFim;

        let eventoAtvEndereco = {
            enderecoInformado: ibsCbs.evento.enderecoInformado,
            enderecoComumLogradouro: ibsCbs.evento.enderecoComumLogradouro,
            enderecoComumNumero: ibsCbs.evento.enderecoComumNumero,
            enderecoComumComplemento: ibsCbs.evento.enderecoComumComplemento,
            enderecoComumBairro: ibsCbs.evento.enderecoComumBairro,
        };

        switch (ibsCbs.evento.tipoEndereco) {
            case '1':
                eventoAtvEndereco.enderecoNacCEP = ibsCbs.evento.enderecoNacCEP;
                eventoAtvEndereco.enderecoNacCidadeIBGE = ibsCbs.evento.enderecoNacCidadeIBGE;
                break;
            case '2':
                eventoAtvEndereco.enderecoExtPais = ibsCbs.evento.enderecoExtPais;
                eventoAtvEndereco.enderecoExtEnderecoPostal = ibsCbs.evento.enderecoExtEnderecoPostal;
                eventoAtvEndereco.enderecoExtCidade = ibsCbs.evento.enderecoExtCidade;
                eventoAtvEndereco.enderecoExtEstadoProvinciaRegiao = ibsCbs.evento.enderecoExtEstadoProvinciaRegiao;
                break
        }

        novoIbsCbs.eventoAtvEndereco = eventoAtvEndereco;
    }

    /* Compra Governamentel - EntGov */
    if (ibsCbs.compraGoverno.tipoEnteGov !== '') {
        novoIbsCbs.tipoEnteGov = ibsCbs.compraGoverno.tipoEnteGov;
    }

    /* Documentos Referenciados NFSe */
    if (ibsCbs.outrosDocs.length > 0) {
        const listOutDoc = [];

        ibsCbs.outrosDocs.forEach(chave => {
            let novoItem = {
                notaReferenciadaCompleta: chave,
            };

            listOutDoc.push(novoItem);
        });

        novoIbsCbs.listaNotaReferenciadaIBS = listOutDoc;
    }

    ckNaoVisualizar.checked = ibsCbs.visualizarNota;

    return JSON.stringify(novoIbsCbs);
};