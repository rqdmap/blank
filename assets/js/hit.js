(function(){
	function getTimestamp() {
		var timestamp = Date.parse(new Date());
		return timestamp;
	}

	function getPageID() {
		return document.getElementsByTagName('meta')['id'].content
	}

	function getPlatform() {
		var plat = navigator.platform;
		var valid = ["Win", "Linux", "Mac", "Android", "iPhone", "iPad"]
		for(var i in valid){
			if (plat.toLowerCase().indexOf(valid[i].toLowerCase()) != -1) {
				return valid[i]
			}
		}
		return "Others"
	}

	function getBrowser() {
		var ua = navigator.userAgent;
		if (ua.indexOf("Maxthon") != -1) {
			return "Maxthon";
		} else if (ua.indexOf("MSIE") != -1) {
			return "MSIE";
		} else if (ua.indexOf("Firefox") != -1) {
			return "Firefox";
		} else if (ua.indexOf("Chrome") != -1) {
			return "Chrome";
		} else if (ua.indexOf("Opera") != -1) {
			return "Opera";
		} else if (ua.indexOf("Safari") != -1) {
			return "Safari";
		} else {
			return "Others";
		}
	}

	function getBrowserLanguage() {
		var lang = navigator.language;
		return lang != null && lang.length > 0 ? lang : "";
	}

	function hit(){
		var pageID	= encodeURIComponent(getPageID());

		if(pageID.length == 0)
			return;

		var browser = encodeURIComponent(getBrowser());
		var lang	= encodeURIComponent(getBrowserLanguage());
		var plat	= encodeURIComponent(getPlatform());

		var request = new XMLHttpRequest();
		request.open('GET', 'https://api.rqdmap.top/hit?id=' + pageID + '&browser=' + browser + '&lang=' + lang + '&plat=' + plat, true);
		request.send();

		request.onreadystatechange = function() {
			if (request.readyState == 4 &&
				(request.status == 200 || request.status == 304)) {
				console.log(request.responseText);
			}
		}
	}

	function checkDigit(s){
		var res = true;
		for(var i = 0; i < s.length; i++){
			if(s[i] == ' ') continue;
			if(s[i] < '0' || s[i] > '9'){
				res = false;
				break;
			}
		}
		return res;
	}

	var totalViews = document.getElementById("total-views");
	var views = document.getElementById("page-views");



	function setViews(total, page){
			totalViews.append("Total views: " + total);
			if(views != null && page != null)
				views.innerText += " " + page;
	}

	function query(){
		var request = new XMLHttpRequest();
		if(views != null){
			var pageID	= encodeURIComponent(getPageID());
			request.open('GET', 'https://api.rqdmap.top/hitcount?id=' + pageID, true);
		}
		else{
			request.open('GET', 'https://api.rqdmap.top/hitcount', true);
		}
		request.send();

		request.onreadystatechange = function() {
			if (request.readyState == 4 && (request.status == 200 || request.status == 304)) {
				var res = request.responseText;
				if (checkDigit(res) == false){
					console.log("Hit Count API error: " + res)
					setViews("Err", "Err")
					return
				}

				res = res.split(' ');
				if(res.length != 2 && res.length != 1){
					console.log("Hit Count API error: " + res)
					setViews("Err", "Err")
					return
				}

				if(res.length == 1)
					setViews(res[0].trim(), null)
				else
					setViews(res[1].trim(), res[0].trim())

				hit();
			}
		}
	}

	if(document.location.host.includes('localhost')) return ; 

	var script = document.createElement('script');
	script.async = true;
	script.src = 'https://umami.rqdmap.top/random-string.js';
	script.setAttribute('data-website-id', '02564888-eb0f-4d2c-85eb-b38595a52ca9');
	document.head.appendChild(script);

	query();
})();
