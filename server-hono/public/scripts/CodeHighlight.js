class CodeHighlight {
  constructor(group) {
    this.group = group;
    this.copyBtn = group.querySelector(".copy");
    this.code = group.querySelector("code");
    this.copied = group.querySelector(".copied");
    this.textarea = group.querySelector("textarea");

    this.init();
  }

  init() {
    this.copyBtn.addEventListener("click", this.copyCode.bind(this));
    this.setTextarea();
  }

  setTextarea() {
    const text = this.code.innerText;
    this.textarea.value = text;
  }

  copyCode() {
    this.textarea.select();
    document.execCommand("copy");
    this.showCopied();
  }

  showCopied() {
    this.copied.classList.add("show");
    setTimeout(() => {
      this.copied.classList.remove("show");
    }, 1000);
  }
}

// For browser use
if (typeof window !== "undefined") {
  window.CodeHighlight = CodeHighlight;
}

// For module use
if (typeof module !== "undefined") {
  module.exports = CodeHighlight;
}
