import { useState, useEffect } from "react";

export function useModal(initial: boolean = false) {
  const [isOpen, setIsOpen] = useState(initial);
  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
  }

  // モーダルを開いている間にスクロール不可にする
  useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return { isOpen, open, close };
}
