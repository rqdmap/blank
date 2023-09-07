var addLoadEvent = (func) => {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	}
	else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

var onModifyHtml = () => {};
var addActionOnModifyHtml = (func) => {
	var oldfunc = onModifyHtml;
	onModifyHtml = function() {
		oldfunc();
		func();
	}
}
	
