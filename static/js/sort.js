function toggle_sort_items() {
  var sortItems = document.querySelector('.sort-items');
  if (sortItems.style.display == 'block') {
    sortItems.style.display = 'none';
  } else {
    sortItems.style.display = 'block';
  }
}
function close_sort_items() {
  var sortItems = document.querySelector('.sort-items');
  sortItems.style.display = 'none';
}

function set_sort_url(key_idx) {
  var params = new URLSearchParams(window.location.search);
  params.set('sort', key_idx);
  var newUrl = window.location.pathname + '?' + params.toString();
  window.location.href = newUrl;
}

var sort_items = function(key_idx) {
  const keys = ["front-matter-create-time", "front-matter-lastmod-time", "front-matter-wordcount"];
  const check_home = function () {
    var elem = document.querySelector("main") 
    for(var i = 0; i < elem.children.length; i++) {
      var child = elem.children[i];
      if (child.nodeType === 1 && child.tagName.toLowerCase() === 'div') {
        if (!child.classList.contains("summary")) {
          return false;
        }
      }
    }
    return true
  }
  
  let cmp_order = [key_idx];
  for(var i = 0; i < keys.length; i++) {
    if(i != key_idx) { cmp_order.push(i); }
  }

  let par = document.querySelector("main");
  if(!check_home()) { par = par.querySelector(".list"); }

  var start = -1, end = -1;
  var range = [];
  for(var i = 0; i < par.children.length; i++) {
    if(par.children[i].classList.contains("summary")) {
      if(start == -1) start = i;
      end = i;
      range.push(par.children[i]);
    }
  }
  range.sort(function(a, b) {
    for(var i = 0; i < cmp_order.length; i++) {
      var key = keys[cmp_order[i]];
      var x = a.querySelector("." + key).innerText;
      var y = b.querySelector("." + key).innerText;

      if(x == y) continue;

      if(key == "front-matter-wordcount") {
        x = x.replace(/^[^0-9]*/,"").replace(/[^0-9]*$/,"");
        x = parseInt(x);

        y = y.replace(/^[^0-9]*/,"").replace(/[^0-9]*$/,"");
        y = parseInt(y);
        return x - y;
      }

      return x.localeCompare(y);
    }
  });
  range.reverse();

  for(var i = start; i <= end; i++) {
    par.insertBefore(range[i - start], par.children[i]);
  }

  close_sort_items();
}
