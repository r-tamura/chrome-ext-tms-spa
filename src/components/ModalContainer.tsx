import * as React from "react"
import * as ReactDOM from "react-dom"

/**
 * モーダルウィンドウのコンテナーコンポーネント
 */
interface IProps extends React.Props<{}> {
  isOpen: boolean
  onClose?: () => void
}

const ModalContainer: React.SFC<IProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const closeHandler = (e: React.SyntheticEvent<HTMLElement>) => {
    if (e.currentTarget === e.target) {
      if (onClose) {
        onClose()
      }
      e.stopPropagation()
    }
  }

  return isOpen ?
  /* モーダル有効時 */
  (
    <div
      className="modal-background"
      onClick={closeHandler}
    >
      {children}
    </div>
  )
  :
  /* モーダル非有効時 */
  (
    null
  )
}

export default ModalContainer
