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


function toggleFold(codeBlockId) {
  const codeblock = document.getElementById(codeBlockId);
  const codeContainer = codeblock.lastElementChild;

  if(codeContainer.classList.contains("codeblock-fold")) {
    codeContainer.classList.remove("codeblock-fold");
    codeContainer.classList.add("codeblock-unfold");
  }
  else if(codeContainer.classList.contains("codeblock-unfold")) {
    codeContainer.classList.remove("codeblock-unfold");
    codeContainer.classList.add("codeblock-fold");
  }
}
