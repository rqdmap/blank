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
})()
