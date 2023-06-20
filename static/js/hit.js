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

	function query(){
		var views = document.getElementById("page-views");
		var totalViews = document.getElementById("total-views");

		var request = new XMLHttpRequest();
		var pageID	= encodeURIComponent(getPageID());

		request.open('GET', 'https://api.rqdmap.top/hitcount?id=' + pageID, true);
		request.send();

		request.onreadystatechange = function() {
			if (request.readyState == 4 &&
				(request.status == 200 || request.status == 304)) {
				res = request.responseText.split(' ');

				if(res == null){
					res = [-1,-1];
				}
				if(views != null) views.innerText += " " + res[0].trim();
				totalViews.append("Total views: " + res[1].trim());

				hit();
			}
		}
	}

	if(document.location.host.includes('localhost')) return ; 
	query();
})();
