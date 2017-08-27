/**
 * Chrome管理画面のリロードショートカット
 */
document.addEventListener("keydown", (e) => {
  if (e.keyCode == 81 && e.ctrlKey) { // Ctrl + q
    chrome.runtime.sendMessage({}, response => setTimeout(() => location.reload(true), 800))
  }
})
