

$(document).ready(function() {    

    //CONTROLA BUSCA

    $('#busca').find(':text').keypress(function(event) {
        if (event.which == 13 && $(this).val().trim().length > 0) {
            $('#busca').find('button').click();
            return true;
        }
        if (event.which == 13 && $(this).val().trim().length == 0) {
            return false;
        }
    });

    $('#busca').find(':image').click(function() {
        if ($('#busca').find(':text').val().trim().length == 0) {
            return false;
        }
    });
});


function getQuerystring(key, default_) {
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else
        return qs[1];
}