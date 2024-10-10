function do_decrypt(encrypted, password) {
  let key = CryptoJS.enc.Utf8.parse(password);
  let iv = CryptoJS.enc.Utf8.parse(password.substr(16));

  let decrypted_data = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted_data.toString(CryptoJS.enc.Utf8);
};

function decrypt_click_handler(element) {
  if (typeof CryptoJS === 'undefined') {
    console.log("CryptoJS is not ready yet. Waiting for 1 second.");
    window.setTimeout(decrypt_click_handler, 1000, element);
    return;
  }

  let parent = element.parentNode.parentNode;
  let encrypted = parent.querySelector(".hugo-encryptor-cipher-text").innerText;
  let password = parent.querySelector(".hugo-encryptor-input").value;
  password = CryptoJS.MD5(password).toString();

  let index = -1;
  let elements = document.querySelectorAll(".hugo-encryptor-container");
  for (index = 0; index < elements.length; ++index) {
    if (elements[index].isSameNode(parent)) {
      break;
    }
  }

  let decrypted = "";
  try {
    decrypted = do_decrypt(encrypted, password);
  } catch (err) {
    console.error(err);
    alert("Failed to decrypt.");
    return;
  }

  if (!decrypted.includes("--- DON'T MODIFY THIS LINE ---")) {
    alert("Incorrect password.");
    return;
  }

  let storage = localStorage;
  let key = location.pathname + ".password." + index;
  storage.setItem(key, password);
  parent.innerHTML = decrypted;
}

function auto_decrypt() {
  if (typeof CryptoJS === 'undefined') {
    console.log("CryptoJS is not ready yet. Waiting for 1 second.");
    window.setTimeout(auto_decrypt, 1000);
    return;
  }

  let elements = document.querySelectorAll(".hugo-encryptor-container");

  for(let index = 0; index < elements.length; ++index) {
    let key = location.pathname + ".password." + index;
    let password = localStorage.getItem(key);

    if (!password) {
      continue;
    }

    console.log("Found password for part " + index);

    let parent = elements[index];
    let encrypted = parent.querySelector(".hugo-encryptor-cipher-text").innerText;
    let decrypted = do_decrypt(encrypted, password);
    elements[index].innerHTML = decrypted;
  }
}

window.addEventListener('load', auto_decrypt);
window.decrypt_click_handler = decrypt_click_handler;

