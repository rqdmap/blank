// 添加代码块复制按钮
var code_block = function(){
	const svgCopy =
		'<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>';

	const svgCheck =
		'<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';

	const svgFold = 
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-collapse" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/> </svg>';

	const svgUnfold = 
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-bar-down" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"/> </svg>';


	const getCodeContent = (codeBlock) => {
		var res = ""
		var elem = codeBlock.firstChild;
		while (elem != null) {
			res += elem.firstChild.nextSibling.textContent;
			elem = elem.nextSibling;
		}

		return res;
	}

	// add button function
	const addCopyButtons = () => {
		document.querySelectorAll("pre > code").forEach((codeBlock) => {
			const clickBtn = document.createElement("button");
			clickBtn.className = "code-copy";
			clickBtn.type = "button";
			clickBtn.innerHTML = svgCopy;
			clickBtn.addEventListener("click", () => {
				const textarea = document.createElement('textarea');

				textarea.value = getCodeContent(codeBlock);

				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);

				clickBtn.blur();
				clickBtn.innerHTML = svgCheck;
				setTimeout(() => (clickBtn.innerHTML = svgCopy), 500);

			});

			const pre = codeBlock.parentNode;
			pre.parentNode.insertBefore(clickBtn, pre.nextSibling);

			const notice = document.createElement("div");
			notice.innerHTML = "代码块已折叠";
			notice.className = "code-notice";
			const foldBtn = document.createElement("button");
			foldBtn.className = "code-toggle";
			foldBtn.type = "button";
			foldBtn.innerHTML = svgFold;
			foldBtn.addEventListener("click", () => {
				if(pre.classList.contains('code-folded')) {
					pre.classList.remove('code-folded');
					pre.firstElementChild.style.display = "block";
					pre.removeChild(notice);
					foldBtn.innerHTML = svgFold;
				}
				else {
					pre.classList.add('code-folded');
					pre.appendChild(notice);
					pre.firstElementChild.style.display = "none";
					foldBtn.innerHTML = svgUnfold;
				}
			})
			pre.parentNode.insertBefore(foldBtn, pre.nextSibling);
			if(pre.parentNode.parentNode.classList.contains("__flag__"))
				foldBtn.click();
		});
	};

	addCopyButtons()
}

code_block()
addActionOnModifyHtml(code_block)


