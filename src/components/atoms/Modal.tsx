import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { ThemeProps } from "~/styles/theme";

const ESC_KEY_CODE = 27;

interface ModalProps {
  /** モーダルを表示するか */
  isOpen: boolean;
  /** モーダルあ閉じる時に実行されるcallback */
  onRequestClose(): void;
  /** "ESC"ボタンが押された時にモーダルを閉じるか */
  shouldCloseOnEsc?: boolean;
  /** オーバーレイ部分をクリックした際にモーダルを閉じるか */
  shouldCloseOnOverlayClick?: boolean;
}

export const Modal: React.SFC<ModalProps> = ({
  isOpen,
  onRequestClose,
  shouldCloseOnEsc = true,
  shouldCloseOnOverlayClick = true,
  children
}) => {
  const overlay = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlay && overlay.current) {
      overlay.current.focus();
    }
  }, [overlay, isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (shouldCloseOnEsc && event.keyCode === ESC_KEY_CODE) {
      event.stopPropagation();
      onRequestClose();
    }
  }

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (shouldCloseOnOverlayClick && event.target === overlay.current) {
      event.stopPropagation();
      onRequestClose();
    }
  }

  // キーイベントはfocusされている必要がある
  // divがfocusされるにはtab indexが必要
  // -1の場合キーボード操作ではfocusされず、focus()メソッドのみでfocusできる
  // https://github.com/reactjs/react-modal/issues/184#issuecomment-235806818
  return (
    <ModalOverLay
      tabIndex={-1}
      ref={overlay}
      onKeyDown={handleKeyDown}
      onClick={handleOverlayClick}
    >
      <ModalBody ref={content}>{children}</ModalBody>
    </ModalOverLay>
  );
};

const ModalOverLay = styled.div`
  font-family: ${({ theme }: ThemeProps) => theme.fontFamily};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
`;

const ModalBody = styled.div`
  /* animation: fadeIn 0.35s linear; */
  margin: 10px auto;
  padding: 20px;
  max-width: 480px;
  min-height: 100px;

  & > * {
    margin: 0 auto;
  }
`;
