function CenterWindowPos(width, height) {
	var x,y;
	x=(screen.availWidth-width)/2;
	y=(screen.availHeight-height)/2;
	return 'height='+height+',width='+width+',left='+x+',top='+y+',screenX='+x+',screenY='+y;
}

function CenterWindow(url, width, height) {
	var pos, w;
	pos=CenterWindowPos(width,height);
	w=window.open(url,'_blank','menubar=no,resizable=yes,scrollbars=yes,toolbar=no,location=no,status=no,'+pos,true);
	if (w == null) 
		alert('Nao foi possivel abrir uma nova janela pois o seu navegador de internet esta configurado para bloquear janelas pop-up. Configure o desbloqueio de janelas pop-up abertas por este site e tente novamente.');
	return w;
}

function AbreNota(url) {
	var pos, w;
	pos=CenterWindowPos(800,600);
	w=window.open(url,'_blank','menubar=no,resizable=yes,scrollbars=yes,toolbar=no,location=no,status=no,'+pos,true);
	if (w == null) 
		alert('Nao foi possivel abrir uma nova janela pois o seu navegador de internet esta configurado para bloquear janelas pop-up. Configure o desbloqueio de janelas pop-up abertas por este site e tente novamente.');
	return w;
}

function ProgressWindow(url, width, height){
    var pos, w;
	pos=CenterWindowPos(width,height);
	w=window.open(url,'_blank','menubar=no,resizable=no,scrollbars=no,toolbar=no,location=no,status=no,'+pos,true);
	if (w == null) 
		alert('Nao foi possivel abrir uma nova janela pois o seu navegador de internet esta configurado para bloquear janelas pop-up. Configure o desbloqueio de janelas pop-up abertas por este site e tente novamente.');
	return w;
}

function Recarregar()
{
	__doPostBack('','');
}

function AbrirNota(diretorio, inscricao, nf, verificacao, cancelar, tipo)
{
    // O paramentro 'tipo' indica se a fun��o AbrirNota deve retornar ou n�o algum valor
    
    if (tipo == 1)
    	return CenterWindow(diretorio+'notaprint.aspx?nf='+nf+'&inscricao='+inscricao+'&verificacao='+verificacao+'&cancelar='+cancelar,750,500);
    else
        CenterWindow(diretorio+'notaprint.aspx?nf='+nf+'&inscricao='+inscricao+'&verificacao='+verificacao+'&cancelar='+cancelar,750,500);
}

function AbrirNotaTomador(diretorio, inscricao, nf, verificacao, cancelar, tipo) {
    // O paramentro 'tipo' indica se a fun��o AbrirNota deve retornar ou n�o algum valor

    if (tipo == 1)
        return CenterWindow(diretorio + 'notatomadorprint.aspx?nft=' + nf + '&inscricao=' + inscricao + '&verificacao=' + verificacao + '&cancelar=' + cancelar, 750, 500);
    else
        CenterWindow(diretorio + 'notatomadorprint.aspx?nft=' + nf + '&inscricao=' + inscricao + '&verificacao=' + verificacao + '&cancelar=' + cancelar, 750, 500);
}

//
// getPageScroll()
// Returns array with x,y page scroll values.
//
function getPageScroll(){

	var yScroll;

	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop){	 // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
	}

	arrayPageScroll = new Array('',yScroll) 
	return arrayPageScroll;
}

//
// getPageSize()
// Returns array with page width, height and window width, height
//
function getPageSize(){
	
	var xScroll, yScroll;
	
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	
	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}


	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
	return arrayPageSize;
}
