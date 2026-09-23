$(document).ready(function() {
    $("#reduzirFonte").click(function() {
        var tamanhoFonte = descobreTamanhoAtual('#placeHolder');
        if (tamanhoFonte > 12) {

            $('#placeHolder').css('font-size', descobreTamanhoAtual('#placeHolder') - 1);

            $('#placeHolder h1:not(#menuDireita h1)').css('font-size', descobreTamanhoAtual('#placeHolder h1') - 1);
            $('#placeHolder h2:not(#menuDireita h2)').css('font-size', descobreTamanhoAtual('#placeHolder h2') - 1);
            $('#placeHolder h3:not(#menuDireita h3)').css('font-size', descobreTamanhoAtual('#placeHolder h3') - 1);
            $('#placeHolder a:not(#menuDireita a)').css('font-size', descobreTamanhoAtual('#placeHolder a') - 1);
            $('#placeHolder p:not(#menuDireita p)').css('font-size', descobreTamanhoAtual('#placeHolder p') - 1);
            $('#placeHolder p a:not(#menuDireita p a)').css('font-size', descobreTamanhoAtual('#placeHolder p a') - 1);

            $('#placeHolder > div > div').css('font-size', descobreTamanhoAtual('#placeHolder > div > div') - 1);
            $('#placeHolder table tr td').css('font-size', descobreTamanhoAtual('#placeHolder table tr td') - 1);
        }

        return false;
    });

    $("#aumentarFonte").click(function() {
        var tamanhoFonte = descobreTamanhoAtual('#placeHolder');
        if (tamanhoFonte < 20) {

            $('#placeHolder').css('font-size', descobreTamanhoAtual('#placeHolder') + 1);

            $('#placeHolder h1:not(#menuDireita h1)').css('font-size', descobreTamanhoAtual('#placeHolder h1') + 1);
            $('#placeHolder h2:not(#menuDireita h2)').css('font-size', descobreTamanhoAtual('#placeHolder h2') + 1);
            $('#placeHolder h3:not(#menuDireita h3)').css('font-size', descobreTamanhoAtual('#placeHolder h3') + 1);
            $('#placeHolder a:not(#menuDireita a)').css('font-size', descobreTamanhoAtual('#placeHolder a') + 1);
            $('#placeHolder p:not(#menuDireita p)').css('font-size', descobreTamanhoAtual('#placeHolder p') + 1);
            $('#placeHolder p a:not(#menuDireita p a)').css('font-size', descobreTamanhoAtual('#placeHolder p a') + 1);

            $('#placeHolder > div > div').css('font-size', descobreTamanhoAtual('#placeHolder > div > div') + 1);
            $('#placeHolder table tr td').css('font-size', descobreTamanhoAtual('#placeHolder table tr td') + 1);
        }

        return false;
    });
});

function descobreTamanhoAtual(seletor) {
    var tamanhoAtual = $(seletor).css('font-size');
    return parseFloat(tamanhoAtual, 10);
}