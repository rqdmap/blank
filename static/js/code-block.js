// var code_block = function(){
// 	const addCopyButtons = () => {
// 			const pre = codeBlock.parentNode;
// 			pre.parentNode.insertBefore(clickBtn, pre.nextSibling);
//
// 			const notice = document.createElement("div");
// 			notice.innerHTML = "代码块已折叠";
// 			notice.className = "code-notice";
// 			const foldBtn = document.createElement("button");
// 			foldBtn.className = "code-toggle";
// 			foldBtn.type = "button";
// 			foldBtn.innerHTML = svgFold;
//
// 			foldBtn.addEventListener("click", () => {
// 				if(pre.classList.contains('code-folded')) {
// 					pre.classList.remove('code-folded');
// 					pre.firstElementChild.style.display = "block";
// 					pre.removeChild(notice);
// 					foldBtn.innerHTML = svgFold;
// 				}
// 				else {
// 					pre.classList.add('code-folded');
// 					pre.appendChild(notice);
// 					pre.firstElementChild.style.display = "none";
// 					foldBtn.innerHTML = svgUnfold;
// 				}
// 			})
// 			pre.parentNode.insertBefore(foldBtn, pre.nextSibling);
// 			if(pre.parentNode.parentNode.classList.contains("__flag__"))
// 				foldBtn.click();
// 		});
// 	};
//
// 	addCopyButtons()
// }

function copycode(codeBlockId) {
	const getCodeContent = (codeblock) => {
    const code = codeblock.getElementsByTagName("code")[0]
		var res = ""
		var elem = code.firstChild;
    /** Two spans: Line numer & code */
		while (elem != null) {
			res += elem.lastChild.textContent;
			elem = elem.nextSibling;
		}
		return res;
	}
  const codeblock = document.getElementById(codeBlockId);
  const codeText = getCodeContent(codeblock)
  navigator.clipboard.writeText(codeText)

  const copyButton = codeblock.getElementsByClassName("copy-button")[0];
  const checkButton = codeblock.getElementsByClassName("check-button")[0];

  copyButton.blur();
  copyButton.classList.add("codeblock-tool-hidden");
  checkButton.classList.remove("codeblock-tool-hidden");
  setTimeout(() => {
    checkButton.classList.add("codeblock-tool-hidden");
    copyButton.classList.remove("codeblock-tool-hidden");
  }, 500);
}



