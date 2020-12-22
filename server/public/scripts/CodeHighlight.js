function CodeHighlight(_parent) {
  let parent;
  let copy;
  let copyConfirmation;

  const strReg1 = /"(.*?)"/g;
  const strReg2 = /'(.*?)'/g;
  const strReg3 = /`(.*?)`/g;
  const tempLit = /`${(.*?)}`/g;
  const numReg = /\b(\d+)/g;
  const jsReg1 = /\b(new|if|else|do|while|switch|for|foreach|in|continue|break|return|typeof)(?=[^\w])/g;
  const methods = /(fetch|\.then|\.catch|\.json|\.log)/g;
  const things = /(err|resp|data)/g;
  const jsReg2 = /\b(document|window|Array|String|Object|Number|Function|function|var|const|let|fetch\.\w+)(?=[^\w])/g;
  const funcReg = /\b(function<\/span>)(\s+\w+)(\()(.*?)(?=[\)])(?=[^\w])/g;
  const urlReg = /("https:\/\/.*")/g;
  const commentReg = /(\/\/\/.*)/g;

  function init() {
    selectDOM();
    highlight();
    addEventListeners();
  }

  function selectDOM() {
    parent = typeof _parent == "string" ? document.querySelector(_parent) : _parent;
    copy = parent.querySelector(".copy");
    copyConfirmation = parent.querySelector(".copied");
  }

  function addEventListeners() {
    copy.addEventListener("click", (e) => {
      e.preventDefault();
      copyFunc();
      copyConfirmation.classList.add("fadeAway");
    });

    copyConfirmation.addEventListener("animationend", (e) => {
      copyConfirmation.classList.remove("fadeAway");
    });
  }

  function highlight() {
    const code = [...parent.querySelectorAll("code p")];
    code.map(c => {
      let string = c.innerText;
      let parsed = string.replace(/[ \t]/g, "&nbsp;");
      parsed = parsed.replace(strReg1, "<span class=\"string\">\"$1\"</span>");
      parsed = parsed.replace(strReg2, "<span class=\"string\">'$1'</span>");
      parsed = parsed.replace(strReg3, "<span class=\"string\">`$1`</span>");
      parsed = parsed.replace(tempLit, "<span class=\"js2\">$1</span>");
      parsed = parsed.replace(jsReg1, "<span class=\"js1\">$1</span>");
      parsed = parsed.replace(jsReg2, "<span class=\"js2\">$1</span>");
      parsed = parsed.replace(things, "<span class=\"js1\">$1</span>");
      parsed = parsed.replace(methods, "<span class=\"methods\">$1</span>");
      parsed = parsed.replace(numReg, "<span class=\"js-num\">$1</span>");
      parsed = parsed.replace(funcReg, "$1<span class=\"func-name\">$2</span>$3<span class=\"func-args\">$4</span>");
      parsed = parsed.replace(commentReg, "<span class=\"comment\">$1</span>");
      parsed = parsed.split("\n").join("<br>");
      c.innerHTML = parsed;
    });
  }

  function copyFunc() {
    var code = parent.querySelector("code").innerText;
    var copyText = parent.querySelector("textarea");
    copyText.value = code;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  }

  init();
}






