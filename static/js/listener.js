document.addEventListener('DOMContentLoaded', function() {

	if(window.innerWidth > 900)
		return;

	var divs = document.getElementsByClassName('sidebar-item')
	const sidebar_simple = [
		"博文",
		"番剧",
		"关于",
		"日志",
		" ",
		"󰔬 ",
	];

	for (var i = 0; i < divs.length; i++) {
		divs[i].getElementsByTagName('a')[0].innerText = sidebar_simple[i];
	}
});

