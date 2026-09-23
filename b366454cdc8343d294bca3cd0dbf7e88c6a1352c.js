var NUM_DIGITOS_CPF = 11;
var NUM_DIGITOS_CNPJ = 14;
var NUM_DGT_CNPJ_BASE = 8;
var NUM_DIGITOS_MATR_OBRA = 12;
var mskFlag = "blank";

/* Conversao */
function convertDate(data) {
    var partes;
    var d;
    partes = data.split("/")
    if (partes.length = 3)
        d = new Date(partes[2], partes[1], partes[0])
    else
        d = new date();
    return d
}

function formatCurrency(num) {

    num = num.toString().replace(/\$|\,/g, '');

    if (isNaN(num))
        num = "0";

    sign = (num == (num = Math.abs(num)));

    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();

    if (cents < 10)
        cents = "0" + cents;

    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));

    return (((sign) ? '' : '-') + '' + num + ',' + cents);
}

/* Validações */
function FmtValorMonetario(Dado) {

    var Result, i;
    Dado = PassaDominio(Dado, "0123456789");

    if (Dado.length > 2) {
        Result = "," + Dado.substr(Dado.length - 2, 2);
        for (i = 5; i <= Dado.length; i += 3) {
            Result = Dado.substr(Dado.length - i, 3) + Result;
            if (Dado.length > i) Result = "." + Result;
        }
        Result = Dado.substr(0, Dado.length - i + 3) + Result;
    }
    else {
        Result = Dado;
    }

    if (Result.indexOf("-") > -1) {
        if (Result.substring(1, 2) == ".") {
            Result = Result.substring(0, 1) + Result.substring(2, Result.length)
        }
    }
    return Result;
}

function FmtAliquota(Dado) {

    var Result, i;
    Dado = PassaDominio(Dado, "0123456789");

    if (Dado.length == 4) {
        Result = Dado.substr(0, 2) + "," + Dado.substr(2, 2);
    }

    else if (Dado.length > 1) {
        Result = Dado.substr(0, 1) + "," + Dado.substr(1, 2);
    }

    else {
        Result = Dado;
    }

    if (Result.indexOf("-") > -1) {
        if (Result.substring(1, 2) == ".") {
            Result = Result.substring(0, 1) + Result.substring(2, Result.length)
        }
    }

    return Result;
}


function PassaDominio(StrDado, Dominio) {
    var i, j, c;
    var Result;

    Result = "";
    for (i = 0; i < StrDado.length; i++) {
        c = StrDado.substr(i, 1);
        for (j = 0; j < Dominio.length; j++) {
            if (c == Dominio.substr(j, 1)) break;
        }
        if (j < Dominio.length) {
            Result = Result + c;
        }
    }
    return Result;
}

function Moeda(key) {

    if (document.all)
        var aKey = key.keyCode;
    else
        var aKey = key.which;

    if (!(aKey == 0 || aKey == 37 || aKey == 9 || aKey == 8 || (aKey > 43 && aKey < 45) || (aKey > 45 && aKey < 47) || (aKey > 47 && aKey < 58))) {
        if (document.all)
            key.returnValue = false;
        else
            return false;
    }
}

//apenas números e %
function NumbersOnly(key) {
    if (document.all)
        var aKey = key.keyCode;
    else
        var aKey = key.which;

    //alert( aKey );
    if (!(aKey == 0 || aKey == 9 || aKey == 8 || (aKey > 47 && aKey < 58))) {
        if (document.all)
            key.returnValue = false;
        else
            return false;
    }
}

//apenas números e não aceita %
function NumbersOnly2(key) {
    var charCode = (key.which) ? key.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}
function NumbersOnly3(key) {
    var charCode = (key.which) ? key.which : event.keyCode

    if (charCode == 44)
        return true;

    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function ValidateEmail(elm) {
    var val = elm;
    // Do not trust this. Server should do a proper validation
    if (!val.match(/(.+)@(.+)\.(.+)/)) {
        return false;
    }

    return true;
}

function isData(campo) {
    if (campo.value == "")
        return true;

    situacao = true;
    var msg = "Data invalida (" + campo.value + ").";

    if (campo.value.length < 10) {
        msg = "Data invalida (" + campo.value + "). Informe a data no formato: dd/mm/aaaa.";
        situacao = false;
    } else {
        var dtaux = campo.value.split("/");
        if (dtaux[0].length != 2 || dtaux[1].length != 2 || dtaux[2].length != 4) {
            msg = "Data invalida (" + campo.value + "). Informe a data no formato: dd/mm/aaaa.";
            situacao = false;
        }
    }

    if (situacao) {
        dia = (campo.value.substring(0, 2));
        mes = (campo.value.substring(3, 5));
        ano = (campo.value.substring(6, 10));

        // verifica o dia valido para cada mes
        if ((dia < "01") || (dia < "01" || dia > "30") &&
            (mes == "04" || mes == "06" || mes == "09" || mes == "11") || dia > 31) {
            situacao = false;
        }

        // verifica se o mes e valido
        if (mes < 01 || mes > 12) {
            situacao = false;
        }

        // verifica se e ano bissexto
        if (mes == 2 && (dia < 01 || dia > 29 || (dia > 28 && (parseInt(ano / 4) != ano / 4)))) {
            situacao = false;
        }

        if (campo.value == "") {
            situacao = false;
        }
    }

    if (!situacao) {
        alert(msg);
        campo.value = "";
    }
}

//retorna erro via texto e não alert.
//(opcional) validaDataMaiorQueAtual = verifica se a data informada e maior que a atual
function isData3(campo, idCampoErro, validaDataMaiorQueAtual) {
    if (campo.value == "")
        return true;

    situacao = true;
    var msg = "Data invalida (" + campo.value + ").";
    document.getElementById(idCampoErro).innerHTML = "";

    if (campo.value.length < 10) {
        msg = "Data invalida (" + campo.value + "). Informe a data no formato: dd/mm/aaaa.";
        situacao = false;
    } else {
        var dtaux = campo.value.split("/");
        if (dtaux[0].length != 2 || dtaux[1].length != 2 || dtaux[2].length != 4) {
            msg = "Data invalida (" + campo.value + "). Informe a data no formato: dd/mm/aaaa.";
            situacao = false;
        }
    }

    if (situacao) {
        dia = (campo.value.substring(0, 2));
        mes = (campo.value.substring(3, 5));
        ano = (campo.value.substring(6, 10));

        // verifica o dia valido para cada mes
        if ((dia < "01") || (dia < "01" || dia > "30") &&
            (mes == "04" || mes == "06" || mes == "09" || mes == "11") || dia > 31) {
            situacao = false;
        }

        // verifica se o mes e valido
        if (mes < 01 || mes > 12) {
            situacao = false;
        }

        // verifica se e ano bissexto
        if (mes == 2 && (dia < 01 || dia > 29 || (dia > 28 && (parseInt(ano / 4) != ano / 4)))) {
            situacao = false;
        }

        if (campo.value == "") {
            situacao = false;
        }

        if (situacao && validaDataMaiorQueAtual) {
            var hoje = new Date();
            var diaAtual = hoje.getDate().toString();
            if (hoje.getDate().toString().length == 1) { diaAtual = '0' + hoje.getDate().toString(); }
            var mesAtual = (hoje.getMonth() + 1);
            if (mesAtual.toString().length == 1) { mesAtual = '0' + mesAtual.toString(); }

            var int_date1 = parseInt(ano + mes + dia);
            var int_date2 = parseInt(hoje.getFullYear().toString() + mesAtual + diaAtual);

            if (int_date1 > int_date2) {
                msg = "A data nao pode ser maior que a data atual.";
                situacao = false;
            }
        }
    }

    if (!situacao) {
        document.getElementById(idCampoErro).innerHTML = msg;
        campo.value = "";
    }
}


function isDataSoMesAno(campo) {
    if (campo.value == "")
        return true;

    situacao = true;
    var msg = "Data invalida (" + campo.value + ").";

    if (campo.value.length < 7) {
        msg = "Data invalida (" + campo.value + "). Informe a data no formato: mm/aaaa.";
        situacao = false;
    } else {
        var dtaux = campo.value.split("/");

        if (dtaux[0].length != 2 || dtaux[1].length != 4) {
            msg = "Data invalida (" + campo.value + "). Informe a data no formato: mm/aaaa.";
            situacao = false;
        }
    }

    if (situacao) {
        mes = (campo.value.substring(0, 2));
        ano = (campo.value.substring(3, 7));

        // verifica se o mes e valido
        if (mes < 01 || mes > 12) {
            situacao = false;
        }

        if (campo.value == "") {
            situacao = false;
        }
    }

    if (!situacao) {
        alert(msg);
        campo.value = "";
    }
}

// ===== Helpers de uso geral (se ainda não tiver de forma correta) =====
function onlyDigits(s) { return String(s || '').replace(/\D/g, ''); }
function unmaskUpper(s) { return String(s || '').replace(/[.\-\/]/g, '').toUpperCase(); }


//prm new
function unformatNumber(str) {
    return str.replace(/\D/g, '');
}

//PRM New
function formatCpfCnpj(pCpfCnpj, pUseSepar, pIsCnpj) {
    if (pIsCnpj == null) pIsCnpj = false;
    if (pUseSepar == null) pUseSepar = true;
    var maxDigitos = pIsCnpj ? NUM_DIGITOS_CNPJ : NUM_DIGITOS_CPF;
    var numero = unformatNumber(pCpfCnpj);

    while (numero.length < maxDigitos)
        numero = '0' + numero;

    if (!pUseSepar) return numero;

    if (pIsCnpj) {
        var reCnpj = /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
        numero = numero.replace(reCnpj, "$1.$2.$3/$4-$5");
    } else {
        var reCpf = /(\d{3})(\d{3})(\d{3})(\d{2})$/;
        numero = numero.replace(reCpf, "$1.$2.$3-$4");
    }
    return numero;
}


//prm new
function dvCpfCnpj(pEfetivo, pIsCnpj) {
    if (pIsCnpj == null) pIsCnpj = false;
    var i, j, k, soma, dv;
    var cicloPeso = pIsCnpj ? 8 : 10;
    var calculado = unformatNumber(pEfetivo);
    var result = "";

    for (j = 1; j <= 2; j++) {
        k = 2;
        soma = 0;
        for (i = calculado.length - 1; i >= 0; i--) {
            soma += parseInt(calculado.charAt(i)) * k;
            k = (k - 1) % cicloPeso + 2;
        }
        dv = 11 - (soma % 11);
        if (dv > 9) dv = 0;
        calculado += dv;
        result += dv;
    }

    return result;
}

// --- Função auxiliar faltante ---
function containsLetters(str) {
    return /[A-Za-z]/.test(str);
}

//prm new
function isCpf(elem, msgbox) {
    var pCpf = elem.value || elem;
    if (pCpf == "") return true;

    if (containsLetters(pCpf)) {
        if (msgbox) alert('CPF contém caracteres inválidos.');
        return false;
    }

    // Dentro de isCpf(...)
    var numero = unformatNumber(pCpf || '');
    if (containsLetters(pCpf)) { if (msgbox) alert('CPF contém caracteres inválidos.'); return false; }
    if (numero.length !== NUM_DIGITOS_CPF) return false; // não valida parcial


    var base = numero.substring(0, NUM_DIGITOS_CPF - 2);
    var digitos = dvCpfCnpj(base, false);

    if (numero !== base + digitos) {
        if (msgbox) alert('CPF inválido (' + pCpf + ').');
        return false;
    }

    var algUnico = true;
    for (var i = 1; i < NUM_DIGITOS_CPF; i++) {
        algUnico = algUnico && (numero.charAt(i - 1) === numero.charAt(i));
    }

    if (algUnico) {
        if (msgbox) alert('CPF inválido (' + pCpf + ').');
        return false;
    }

    return true;
}






//Validação via CnpjValidador
function isCnpj(cCNPJ, showMsg) {
    if (!cCNPJ) return false;

    cCNPJ = cCNPJ.replace(/[^\d]/g, '');

    if (cCNPJ.length !== 14) return false;

    //Rejeita CNPJs com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cCNPJ)) return false;

    //Bloqueia CNPJs com ordem 0000 (posição 9–12)
    const ordem = parseInt(cCNPJ.substring(8, 12), 10);
    if (ordem === 0) {
        if (showMsg) alert("CNPJ com ordem 0000 é inválido");
        return false;
    }

    let tamanho = cCNPJ.length - 2;
    let numeros = cCNPJ.substring(0, tamanho);
    let digitos = cCNPJ.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cCNPJ.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
}




//Roteador onBlur
function isCpfCnpj(elem, msgbox) {
    const raw = (elem && typeof elem.value !== 'undefined') ? elem.value : elem;
    const s = unmaskUpper(raw);
    if (s.length === 0) return true;
    if (s.length === 14) return isCnpj(raw, msgbox);
    if (s.length === 11) return (typeof isCpf === 'function') ? isCpf(raw, msgbox) : true;
    if (msgbox) alert('Informe 11 dígitos (CPF) ou 14 caracteres (CNPJ).');
    return false;
}

//PRM NEW
function validaCpf(source, args) {
    args.IsValid = args.Value ? isCpf(args.Value, false) : isCpf(args, false);
    source.style.display = args.IsValid ? 'none' : 'inline';
    return args.IsValid;
}



//Valida apenas CNPJ Alfanumerico
function validaCnpj(source, args) {
    const valorBruto = args.Value || "";
    //Remove máscara e converte para maiúsculas
    const valor = valorBruto.replace(/[.\-\/]/g, '').toUpperCase();

    //Padrões aceitos:
    const padraoAntigo = /^\d{14}$/;           //CNPJ antigo (somente números)
    const padraoNovo = /^[A-Z0-9]{12}\d{2}$/;  //Novo CNPJ: 12 alfanuméricos + 2 dígitos finais

    let valido = false;
    let mensagemErro = "CNPJ inválido";

    //Bloqueia o bloco de filial "0000" (posições 9–12)
    if (valor.length >= 12) {
        const blocoFilial = valor.substring(8, 12);
        if (blocoFilial === "0000") {
            args.IsValid = false;
            source.innerText = "Filial 0000 inválida";
            return;
        }
    }

    if (padraoAntigo.test(valor)) {
        //CNPJ tradicional numérico
        valido = isCnpj(valor);
        mensagemErro = "CNPJ numérico inválido";
    }
    else if (padraoNovo.test(valor)) {
        //Novo CNPJ alfanumérico
        if (typeof CnpjValidador !== "undefined" && CnpjValidador.isValid) {
            valido = CnpjValidador.isValid(valor);
            mensagemErro = "CNPJ alfanumérico inválido";
        }
    } else {
        //Formato incorreto
        valido = false;
        mensagemErro = "Formato de CNPJ inválido";
    }

    args.IsValid = !!valido;
    if (!args.IsValid) {
        source.innerText = mensagemErro;
    }
    return args.IsValid;
}





// CustomValidator (ClientValidationFunction="validaCpfCnpj")
function validaCpfCnpj(sender, args) {
    const raw = args.Value || "";
    const valor = raw.replace(/[^\w\d]/g, '').toUpperCase();

    //CPF válido
    if (/^\d{11}$/.test(valor) && isCpf(valor)) {
        args.IsValid = true;
        return;
    }

    //CNPJ numérico (com bloqueio de 0000)
    if (/^\d{14}$/.test(valor)) {
        if (isCnpj(valor)) {
            args.IsValid = true;
        } else {
            args.IsValid = false;
        }
        return;
    }

    //CNPJ alfanumérico (novo padrão) — usa o validador da classe
    if (/^[A-Z0-9]{14}$/.test(valor)) {
        if (typeof CnpjValidador !== "undefined" && CnpjValidador.isValid) {
            args.IsValid = CnpjValidador.isValid(valor);
            return;
        }
    }

    //Qualquer outro formato inválido
    args.IsValid = false;
}




// copiar a classe de validação do arquivo CnpjValidador.js
class CnpjValidador {
    static tamanhoCNPJSemDV = 12;
    static regexCNPJSemDV = /^([A-Z\d]){12}$/;
    static regexCNPJ = /^([A-Z\d]){12}(\d){2}$/;
    static regexCaracteresMascara = /[./-]/g;
    static regexCaracteresNaoPermitidos = /[^A-Z\d./-]/i;
    static valorBase = "0".charCodeAt(0);
    static pesosDV = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    static cnpjZerado = "00000000000000";

    static isValid(cnpj) {
        if (!this.regexCaracteresNaoPermitidos.test(cnpj)) {
            let cnpjSemMascara = this.removeMascaraCNPJ(cnpj);
            if (this.hasAllSameDigitsGeneric(cnpjSemMascara)) {
                return false;
            }
            if (this.regexCNPJ.test(cnpjSemMascara) && cnpjSemMascara !== this.cnpjZerado) {
                const dvInformado = cnpjSemMascara.substring(this.tamanhoCNPJSemDV);
                const dvCalculado = this.calculaDV(cnpjSemMascara.substring(0, this.tamanhoCNPJSemDV));
                return dvInformado === dvCalculado;
            }
        }
        return false;
    }

    static calculaDV(cnpj) {
        if (!this.regexCaracteresNaoPermitidos.test(cnpj)) {
            var regexItem = /^[a-zA-Z0-9 ]*$/;
            var charInicial = cnpj[0];
            var charFinal = cnpj[cnpj.length - 1];

            if (!regexItem.test(charInicial)) return false;
            if (!regexItem.test(charFinal)) return false;

            let cnpjSemMascara = this.removeMascaraCNPJ(cnpj);
            if (this.regexCNPJSemDV.test(cnpjSemMascara) && cnpjSemMascara !== this.cnpjZerado.substring(0, this.tamanhoCNPJSemDV)) {
                let somatorioDV1 = 0;
                let somatorioDV2 = 0;
                for (let i = 0; i < this.tamanhoCNPJSemDV; i++) {
                    const asciiDigito = cnpjSemMascara.charCodeAt(i) - this.valorBase;
                    somatorioDV1 += asciiDigito * this.pesosDV[i + 1];
                    somatorioDV2 += asciiDigito * this.pesosDV[i];
                }
                const dv1 = somatorioDV1 % 11 < 2 ? 0 : 11 - (somatorioDV1 % 11);
                somatorioDV2 += dv1 * this.pesosDV[this.tamanhoCNPJSemDV];
                const dv2 = somatorioDV2 % 11 < 2 ? 0 : 11 - (somatorioDV2 % 11);
                return `${dv1}${dv2}`;
            }
        }
        throw new Error("Não é possível calcular o DV pois o CNPJ fornecido é inválido");
    }

    static hasAllSameDigitsGeneric(cnpj) {
        const unmaskedCnpj = cnpj.replace(/[\\./-]/g, "");
        if (unmaskedCnpj.length !== 14) return false;
        const firstDigit = unmaskedCnpj[0];
        return unmaskedCnpj.split('').every(c => c === firstDigit);
    }

    static removeMascaraCNPJ(cnpj) {
        return cnpj.replace(this.regexCaracteresMascara, "");
    }
}

// Torna a classe acessível no escopo global
window.CnpjValidador = CnpjValidador;


//Máscara inteligente de CPF/CNPJ (com suporte ao novo CNPJ alfanumérico)
function CNPJCPFMsk(campo) {
    let valor = campo.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    if (valor.length === 0) {
        campo.value = "";
        return;
    }

    if (valor.length <= 11 && /^[0-9]+$/.test(valor)) {
        campo.value = CPFMsk(valor);
    } else {
        campo.value = CNPJMsk(valor);
    }
}

//Máscara CPF
function CPFMsk(valor) {
    valor = valor.substring(0, 11);
    return valor
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3}).(\d{3})(\d)/, "$1.$2.$3")
        .replace(/.(\d{3})(\d)/, ".$1-$2");
}

//CNPJ Msk
function CNPJMsk(input) {
    // Pode receber tanto o elemento quanto a string
    let valor = (typeof input === "string" ? input : input.value || "")
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();

    // Mantém apenas letras/números nos 12 primeiros e dígitos nos 2 últimos
    let prefixo = valor.substring(0, 12).replace(/[^A-Z0-9]/g, "");
    let sufixo = valor.substring(12, 14).replace(/[^0-9]/g, ""); // apenas números nos 2 últimos

    valor = (prefixo + sufixo).substring(0, 14);

    if (valor.length === 0) {
        if (typeof input !== "string") input.value = "";
        return "";
    }

    // ⚠️ Bloqueia a sequência "0000" nas posições 9–12
    if (valor.length >= 12) {
        const blocoFilial = valor.substring(8, 12);
        if (blocoFilial === "0000") {
            // Remove os últimos dígitos até antes da filial inválida
            valor = valor.substring(0, 8);
            // Exibe um alerta visual leve (opcional)
            if (typeof input !== "string") {
                input.classList.add("input-error");
                if (!document.getElementById("msgFilial0000")) {
                    const msg = document.createElement("div");
                    msg.id = "msgFilial0000";
                    msg.textContent = "⚠️ Filial '0000' não é permitida.";
                    msg.style.color = "red";
                    msg.style.fontSize = "11px";
                    msg.style.marginTop = "2px";
                    input.parentNode.insertBefore(msg, input.nextSibling);
                    setTimeout(() => msg.remove(), 2500);
                }
            }
        }
    }

    // Máscara adaptativa
    let masked = valor;

    if (valor.length > 12) {
        masked = valor.replace(
            /^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})(\d{0,2})$/,
            "$1.$2.$3/$4-$5"
        );
    } else if (valor.length > 8) {
        masked = valor.replace(
            /^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{0,4})$/,
            "$1.$2.$3/$4"
        );
    } else if (valor.length > 5) {
        masked = valor.replace(
            /^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{0,3})$/,
            "$1.$2.$3"
        );
    } else if (valor.length > 2) {
        masked = valor.replace(
            /^([A-Z0-9]{2})([A-Z0-9]{0,3})$/,
            "$1.$2"
        );
    }

    if (typeof input !== "string") {
        input.value = masked;
    }

    return masked;
}






function validaNumObra(source, elem) {
    var numObra;
    if (elem.value) {
        numObra = elem.value;
    } else {
        numObra = elem;
    }

    if (numObra.length == 0 || numObra.value == undefined) return true;

    var tempObra = numObra.replace('/', '').replace('-', '').substr(0, 11);
    var soma = 0;
    var somaPar = 0;
    var somaImpar = 0;
    var digito = 0;

    for (i = 0; i < tempObra.length; i++) {
        if (i % 2) {
            somaPar += Number(tempObra.substr([i], 1));
        }
        else {
            somaImpar += Number(tempObra.substr([i], 1));
        }
    }

    soma = (somaImpar * 3) + somaPar;
    digito = 10 - (soma % 10);

    if (digito == 10) digito = 0;

    if (endsWith(numObra, digito.toString())) {
        elem.IsValid = true;
        source.style.display = 'none';

        return true;

    }
    else {
        elem.IsValid = false;
        source.style.display = 'inline';
        source.innerHTML = "D&iacutegito verificador do n&uacutemero de obra inv&aacutelido.";
        return false;
    }


}


//PRM NEW
function endsWith(str, end) {
    return str.substr(str.length - end.length) === end;
}


//PRM NEW
function strip(str, c) {
    return str.split(c).join("");
}




function CEPMsk(aWidget) {
    if (mskFlag == "getOut") return true;
    var tmp = strip(aWidget.value, "-");
    if (5 < tmp.length) aWidget.value = tmp.substr(0, 5) + '-' + tmp.substr(5, 3);
    else aWidget.value = tmp;
}


//prm new
function stopMskVerificacao(key) {
    mskFlag = "blank";
    var aKey = document.all ? key.keyCode : key.which;
    if (!((aKey > 47 && aKey < 58) || (aKey > 64 && aKey < 91) || (aKey > 96 && aKey < 123))) mskFlag = "getOut";
}


// Garantir que seja global:
window.stopMsk = function (key) {
    mskFlag = "blank";
    var aKey = document.all ? key.keyCode : key.which;
    if (!((aKey > 47 && aKey < 58) || (aKey > 95 && aKey < 106))) {
        mskFlag = "getOut";
    }
};


function dateMsk(aWidget) {
    if (mskFlag == "getOut") return true;
    var tmp = strip(aWidget.value, "/");
    if (4 < tmp.length) aWidget.value = tmp.substr(0, 2) + '/' + tmp.substr(2, 2) + '/' + tmp.substr(4, 4);
    else if (2 < tmp.length) aWidget.value = tmp.substr(0, 2) + '/' + tmp.substr(2, 2);
    else aWidget.value = tmp;
}


function dateMskSoMesAno(aWidget) {
    if (mskFlag == "getOut") return true;
    var tmp = strip(aWidget.value, "/");
    if (2 < tmp.length) aWidget.value = tmp.substr(0, 2) + '/' + tmp.substr(2, 4);
    else aWidget.value = tmp;
}









function CCMMsk(aWidget) {
    if (mskFlag == "getOut") return true;
    var tmp = strip(aWidget.value, ".");
    tmp = strip(tmp, "-");
    if (7 < tmp.length) aWidget.value = tmp.substr(0, 1) + '.' + tmp.substr(1, 3) + '.' + tmp.substr(4, 3) + '-' + tmp.substr(7);
    else if (4 < tmp.length) aWidget.value = tmp.substr(0, 1) + '.' + tmp.substr(1, 3) + '.' + tmp.substr(4, 3);
    else if (1 < tmp.length) aWidget.value = tmp.substr(0, 1) + '.' + tmp.substr(1, 3);
    else aWidget.value = tmp;
}

function SQLNMsk(aWidget) {

    if (mskFlag == "getOut") return true;

    var tmp = strip(aWidget.value, ".");

    tmp = strip(tmp, "/");

    tmp = strip(tmp, "-");

    if (10 < tmp.length) aWidget.value = tmp.substr(0, 3) + '.' + tmp.substr(3, 3) + '.' + tmp.substr(6, 4) + '-' + tmp.substr(10, 1);

    else if (6 < tmp.length) aWidget.value = tmp.substr(0, 3) + '.' + tmp.substr(3, 3) + '.' + tmp.substr(6, 4);

    else if (3 < tmp.length) aWidget.value = tmp.substr(0, 3) + '.' + tmp.substr(3, 3);

    else aWidget.value = tmp;

}



function VerificacaoMsk(aWidget) {
    if (mskFlag == "getOut") return true;
    var tmp = strip(aWidget.value, "-");
    if (4 < tmp.length) aWidget.value = tmp.substr(0, 4) + '-' + tmp.substr(4, 4);
    else aWidget.value = tmp;
}

function CEIMsk(aWidget) {
    if (mskFlag == "getOut") return true;

    var tmp = strip(aWidget.value, ".");
    tmp = strip(tmp, "/");
    if (10 < tmp.length) aWidget.value = tmp.substr(0, 2) + '.' + tmp.substr(2, 3) + '.' + tmp.substr(5, 5) + '/' + tmp.substr(10, 2);
    else if (5 < tmp.length) aWidget.value = tmp.substr(0, 2) + '.' + tmp.substr(2, 3) + '.' + tmp.substr(5, 5);
    else if (2 < tmp.length) aWidget.value = tmp.substr(0, 2) + '.' + tmp.substr(2, 3);
    else aWidget.value = tmp;
}

function NumObraMsk(aWidget) {
    var tmp = strip(aWidget.value, ".");
    tmp = strip(tmp, "/");
    tmp = strip(tmp, "-");

    if (11 < tmp.length) aWidget.value = tmp.substr(0, 4) + '/' + tmp.substr(4, 7) + '-' + tmp.substr(11, 1);
    else if (tmp.length == 4) aWidget.value = tmp.substr(0, 4)
    else if (3 < tmp.length) aWidget.value = tmp.substr(0, 4) + '/' + tmp.substr(4, 9)
    else aWidget.value = tmp;
}

// Processo SEI: Sistema Eletrônico de Identificação (16 dígitos | formato 9999.9999/9999999-9)
function processoSEIMsk(campo) {
    if (mskFlag == "getOut") return true;
    debugger;

    var digits = "0123456789.-/"
    var mascara = '????.????/???????-?';
    var campo_temp
    var x = campo.value.length;

    if (mascara.charAt(x) != '?') {
        campo.value = campo.value + mascara.charAt(x);
    }

    for (var i = 0; i < campo.value.length; i++) {
        campo_temp = campo.value.charAt(i)
        if (digits.indexOf(campo_temp) == -1) {
            campo.value = campo.value.substring(0, i);
            break;
        }
    }
}
