(function(){
	var dropdownBtn = document.querySelector('.dropdown-btn');
	var list = document.querySelector('.dropdown-list');
	list.style.display = 'none';

	dropdownBtn.addEventListener('click', function(){
		if(list.style.display == 'none'){
			list.style.display = 'flex';
		}
		else{
			list.style.display = 'none';
		}
	});

	dropdownBtn.addEventListener('blur', function(){
		list.style.display = 'none';
	})
})()


addLoadEvent(function() {
	var params = new URLSearchParams(window.location.search);
	var sortParam = params.get('sort');
	if (sortParam != null) {
		sort_items(sortParam);
	}
});
