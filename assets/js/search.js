import params from "@params";

export function clear_input() {
  let inp = document.querySelector('.search-input');
	inp.value = '';
}

function close_search_window() {
  let windowElem = document.querySelector('.search-window');
	let overlay = document.querySelector('.search-overlay');
	let table = document.querySelector('.search-result');

	windowElem.classList.remove('show');
	windowElem.style.display = 'none';
	overlay.style.display = 'none';
	table.innerHTML = '';

	clear_input();
}

function toggle_search_window() {
  var windowElem = document.querySelector('.search-window');
  var inp = document.querySelector('.search-input');
	var overlay = document.querySelector('.search-overlay');

	if(windowElem.style.display == 'flex') {
		close_search_window()
	}
	else {
		windowElem.classList.add('show');
		windowElem.style.display = 'flex';
		overlay.style.display = 'block';
		clear_input();
		inp.focus();
	}
}

function debounce(func, wait){
  return function(...args) {
    if (search_timer) { clearTimeout(search_timer); }
    search_timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  }
}

var search_timer;
function search_input() {
	function dim_tag(content) {
		return '<span class="search-dim">' + content + '</span>';
	}
	function highlight_tag(content) {
		return '<span class="search-highlight">' + content + '</span>';
	}


	// 不传递DOM节点, 而是传递HTML内容即可
	function highlight(content, indices, width) {
		if(width == -1) { width = 0x3f3f3f3f; }
		let htmlStr = "";
		let start = Math.max(0, indices[0][0] - width);


		for(let i = 0; i < indices.length; i++) {
			let index = indices[i];

			let pre_text = "";
			if(i == 0 && start > 0) {
				pre_text = '..'
			}
			pre_text += content.substring(start, index[0]);

			let match = content.substring(index[0], index[1] + 1);
			start = index[1] + 1;
			htmlStr += dim_tag(pre_text);
			htmlStr += highlight_tag(match);
		}


		let suf_text = content.substring(start, Math.min(content.length, start + width))
		if(start + width < content.length) {
			suf_text += '..';
		}
		htmlStr += dim_tag(suf_text)

		return htmlStr
	}


	const render_html = function(result, width){
		let res = document.querySelector('.search-result');
		res.innerHTML = ''

		let totalCountElem = document.createElement('div');
		totalCountElem.classList.add('search-total-count');
		let total_count = 0;
		for(let i = 0; i < result.length; i++) {
			let tmp = 0;
			for(let j = 0; j < result[i].matches.length; j++){
				tmp += result[i].matches[j].indices.length;
			}
			total_count += tmp;
		}
		totalCountElem.innerHTML = '检索到 ' + result.length + ' 篇文章, 关键词 ' + total_count + ' 次'
		res.append(totalCountElem);

		let totalTimeElem = document.createElement('div');
		totalTimeElem.classList.add('search-time-count');
		res.append(totalTimeElem);

		// 遍历每一个搜索到的文章
		for(let i = 0; i < result.length; i++) {
			let itemElem = document.createElement('div');
			itemElem.classList.add('search-item');

			var titleElem = document.createElement('div');
			titleElem.innerHTML = result[i].title;
			titleElem.classList.add('search-item-title');

			// 遍历所有的match的位置
			for(let j = 0; j < result[i].matches.length; j++) {
				let match = result[i].matches[j];
				let key = match['key']
				let content = result[i][key];
				let indices = match['indices'];

				if(key == 'title') {
					titleElem = document.createElement('div');
					titleElem.innerHTML = highlight(content, indices, -1);
					titleElem.classList.add('search-item-title');
					continue;
				}

				var idx = [];
				var k = 0;
				let elem = document.createElement('div');
				let count = null;
				let limit = 3;
				elem.classList.add('search-item-content');
				while(k < indices.length){
					idx = []
					while(idx.length == 0 || (k < indices.length && k < limit && indices[k][0] - idx[idx.length - 1][1] <= width)) {
						idx.push(indices[k]);
						k++;
					}
					elem.innerHTML += highlight(content, idx, width);

					if(k < indices.length && k >= limit){
						count = document.createElement('div');
						count.classList.add('search-read-more');
						count.innerHTML = '省略其余 ' + (indices.length - k) + ' 次出现';
						break;
					}
				}
				itemElem.appendChild(elem);
				if(count != null) itemElem.appendChild(count)
			}

			titleElem.onclick = function() {
				window.location.href = result[i].url;
			}

			itemElem.insertBefore(titleElem, itemElem.firstChild);
			if(itemElem.children.length == 1) {
				let elem = document.createElement('div');
				let content = result[i].content.length == 0 ? "(无内容)" : result[i].content;
				elem.innerHTML = highlight(content, [[-1,0]], width);
				elem.classList.add('search-item-content');
				itemElem.appendChild(elem);
			}
			res.appendChild(itemElem);
		}
	}

	const get_indices = function(str, key) {
		function escapeRegExp(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		}
		let regex = new RegExp(escapeRegExp(key), 'gi');
		let indices = []
		let match;
		while((match = regex.exec(str)) != null) {
			indices.push([match.index, match.index + key.length - 1]);
		}
		return indices;
	}

	const get_matches = function(contents, value) {
		var res = []
		for(let i = 0; i < contents.length; i++) {
			// console.log("get_match: " + (i+1) + "/" + contents.length);
			let content = contents[i];
			let keys = Object.keys(content);
			let matches = []
			let tmp = {}
			
			for(let i = 0; i < keys.length; i++) {
				let k = keys[i];
				let v = content[k];
				tmp[k] = v;

				if(k != 'content' && k != 'title') continue;
				let indices = get_indices(v, value);
				if(indices.length > 0)
					matches.push({
						key: k,
						indices: indices,
					});
			}

			tmp.matches = matches;
			if(matches.length > 0) res.push(tmp);
		}

		return res;
	}

	const real_search = function() {
		var startTime = performance.now();

		var input = document.querySelector('.search-input');
		var value = input.value;
		// console.log('搜索: ', value)

		if(value.length == 0) {
			let res = document.querySelector('.search-result');
			res.innerHTML = ''
			return;
		}

		setTimeout(function() {
			let res = document.querySelector('.search-result');
			let inp = document.querySelector('.search-input');
			if(res.innerHTML.length != 0 || inp.value.length == 0) {
				return
			}
			res.innerHTML = '';
			let pendingElem = document.createElement('div');
			pendingElem.classList.add('search-pending');
			pendingElem.innerHTML = '正在从 ' + params.total_chars + ' 个字符中玩命搜索...';

			res.append(pendingElem);
		}, 500)


		loadXMLFile("/search/index.xml", function(result) {
			let res = []
			if(value.length > 0) {
				res = get_matches(result, value);
			}

			res.sort(function(a, b) {
				let ma = a.matches;
				let mb = b.matches;
				const match_title = function(m) {
					for(let i = 0; i < m.length; i++) {
						if(m[i].key == 'title'){
							return true;
						}
					}
					return false;
				}
				const count_match = function(m) {
					let res = 0;
					for(let i = 0; i < m.length; i++) {
						res += m[i].indices.length;
					}
					return res;
				}

				// let a_match_title = match_title(ma);
				// let b_match_title = match_title(mb);
				// if(a_match_title == b_match_title) {
				// 	return count_match(mb) - count_match(ma)
				// }
				// else {
				// 	return a_match_title ? -1 : 1;
				// }
				return count_match(mb) - count_match(ma)
			})

			render_html(res, 50)
			let endTime = performance.now();
			let elapsedTime = endTime - startTime;
			document.querySelector('.search-time-count').innerHTML = '󱎫 ' + elapsedTime.toFixed(2) + ' ms'
		})
	}

	let isCaseSensitive = false;

	debounce(real_search, 300)(
		isCaseSensitive,
	)
}

function loadXMLFile(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var xmlData = xhr.responseXML;
			var jsonObject = xmlToJson(xmlData);
			callback(jsonObject);
		}
  };
  xhr.send();
}

function xmlToJson(xmlString) {
  var result = {};

  function parseNode(node, obj) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      var nodeName = node.nodeName;
      var childNodes = node.childNodes;

      if (childNodes.length === 1) {
        obj[nodeName] = childNodes[0].nodeValue;
      }
			else {
				if (!obj[nodeName]) {
          obj[nodeName] = [];
        }
        obj[nodeName].push({});
        for (var i = 0; i < childNodes.length; i++) {
          parseNode(childNodes[i], obj[nodeName][obj[nodeName].length - 1]);
        }
      }
    }
  }

  parseNode(xmlString.documentElement, result);
  return result.search[0].entry;
}

// Silent load the search index
loadXMLFile("/search/index.xml", () => {});

var btnElem = document.querySelector('.search-btn');
if(btnElem) btnElem.addEventListener('click', toggle_search_window);

var overlayElem = document.querySelector('.search-overlay');
if(overlayElem) overlayElem.addEventListener('click', close_search_window);

var inp = document.querySelector('.search-input');
if(inp) inp.addEventListener('input', search_input);
