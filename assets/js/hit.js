function render(data) {
	var total_pv = document.getElementById("footer-pv");
	var total_uv = document.getElementById("footer-uv");
  total_pv.innerText = data['total_pv'];
  total_uv.innerText = data['total_uv'];
  document.getElementById("footer-statistics").classList.remove("hidden");

  var page_pv = document.getElementById("page-pv");
  var page_uv = document.getElementById("page-uv");
  if(page_pv == null || page_uv == null) return;
  page_pv.innerText = data['page_pv'];
  page_uv.innerText = data['page_uv'];
  document.getElementById("page-statistics").classList.remove("hidden");
}

function hit_and_query() {
	if(document.location.host.includes('localhost')) return ; 

	var script = document.createElement('script');
	script.async = true;
	script.src = 'https://umami.rqdmap.top/random-string.js';
	script.setAttribute('data-website-id', '02564888-eb0f-4d2c-85eb-b38595a52ca9');
	document.head.appendChild(script);

  browser.getInfo(["browser", "language", "system", "platform", "device", "screen"]).then(info => {
    const data = {
      page_id: document.getElementsByTagName('meta')['id'].content,
      browser: info.browser,
      lang: info.language,
      system: info.system,
      platform: info.platform,
      device: info.device,
      screen_width: info.screenWidth,
      screen_height: info.screenHeight,
      referrer: document.referrer,
    };
    fetch('http://127.0.0.1:1323/hit_and_query', {
    // fetch('http://rqdmap.top:8088/hit_and_query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      render(jsonData); // 假设 render 函数用于处理 JSON 数据
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }).catch(error => {
    console.log("Promise 被拒绝，错误为:", error);
  });
}
hit_and_query()
