
(function setupChromeBackground(chrome) {

  // Chromeの拡張機能をリロードする
  chrome.runtime.onMessage.addListener(() => {
    chrome.runtime.reload()
  })

  // TCPコネクション前に処理を割り込ませる
  chrome.webRequest.onBeforeRequest.addListener(details => {
    console.log(details)
  })
}(chrome))
