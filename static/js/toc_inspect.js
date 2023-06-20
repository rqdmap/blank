(function(){

	const selector =  ['h2', 'h3', 'h4']


	var content = document.querySelector('article');
	if(content == null)
		content = document.querySelector('list')
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

		if(now == null) now = all_toc[0];

		for(let i of toc.getElementsByTagName('a')){
			console.log(i.text, now.innerText);
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
