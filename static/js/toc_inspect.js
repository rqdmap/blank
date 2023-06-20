(function(){

	const selector =  ['h2', 'h3', 'h4']

	var content = document.querySelector('article, .list');
	if(content == null)
		return


	const all_toc = content.querySelectorAll(selector.join());
	const toc = document.querySelector('.toc');


	const throttle = function(func, wait){
		let timeoutId;
		return function() {
			if (!timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					timeoutId = null;
					func.apply(this, arguments);
				}, wait);
			}
		}
	}

	const scrollHandler = function(){
		var now = null;
		for (var i = all_toc.length - 1; i >= 0; i--){
			if(all_toc[i].offsetTop <= window.scrollY + 5){
				now = all_toc[i];
				break;
			}
		}

		if(now == null)
			return

		if(toc.getElementsByTagName('a').length == 0)
			return 

		for(let i of toc.getElementsByTagName('a')){
			if(i.text == now.innerText){
				i.classList.add('active');
			}
			else{
				i.classList.remove('active');
			}
		}
	}

	window.addEventListener('scroll', throttle(scrollHandler, 500));

})()
