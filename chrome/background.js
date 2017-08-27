
(function setupChromeBackground(c) {

  // Chromeの拡張機能をリロードする
  c.runtime.onMessage.addListener(() => {
    chrome.runtime.reload();
  })

  // TCPコネクション前に処理を割り込ませる
  c.webRequest.onBeforeRequest.addListener(details => {
    console.log(details)
  })
}(chrome))
