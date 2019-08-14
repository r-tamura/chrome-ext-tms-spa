import React from "react"
import ReactDOM from "react-dom"
import { configureStore } from "~/stores"
import { fetchIsLoggedIn } from "~/api/login"
import { fetchMasterInfo } from "~/api/common"
import Root from "~/pages/Root"

// import "~/css/styles.css"

/**
 * アプリケーション起動時に実行される初期化処理
 */
(async function initialaize() {

  // ストア初期化
  const [master, user] = await Promise.all([
      fetchMasterInfo(),
      fetchIsLoggedIn(),
  ])

  const store = configureStore({
    master: { ...master, isFetching: false },
    user: { ...user, isFetching: false },
  })

  const initHtml = () => {
    const body = document.body
    body.innerHTML = ""

    let $content = document.getElementById("content")
    if (!$content) {
      // コンテントDIVが存在しない場合は生成する
      $content = document.createElement("div")
      $content.setAttribute("id", "content")
      document.body.appendChild($content)
    }

    return $content
  }

  // HTML初期化
  ReactDOM.render(<Root store={store} />, initHtml())
}())
