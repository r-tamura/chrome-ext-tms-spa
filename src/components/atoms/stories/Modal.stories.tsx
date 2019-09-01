import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Modal, Button, Panel } from "~/components/atoms";
import { useModal } from "~/components/hooks";
import { ThemeProvider } from "styled-components";
import { telema } from "~/styles/theme";

// storybookは
// addの第二引数をただ関数として呼び出しているのでhooksを使う場合はコンポーネントとして外に定義する必要がある
// 他にも回避手段はある
// https://github.com/storybookjs/storybook/issues/5721

function Simple() {
  const { isOpen, open, close } = useModal(true);
  return (
    <ThemeProvider theme={telema}>
      <>
        <Button variant="contained" onClick={() => open()}>
          Open Modal
        </Button>
        <Modal isOpen={isOpen} onRequestClose={() => close()}>
          <Panel>
            <h3>Simple modal demo</h3>
            <p>To close this modal:</p>
            <ul>
              <li>Press 'ESC' key</li>
              <li>Click overlay area</li>
            </ul>
          </Panel>
        </Modal>
      </>
    </ThemeProvider>
  );
}

function Form() {
  const { isOpen, open, close } = useModal(false);
  return (
    <ThemeProvider theme={telema}>
      <>
        <Button variant="contained" onClick={() => open()}>
          Open Modal
        </Button>
        <div style={{ fontSize: "40px" }}>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It
          has roots in a piece of classical Latin literature from 45 BC, making
          it over 2000 years old. Richard McClintock, a Latin professor at
          Hampden-Sydney College in Virginia, looked up one of the more obscure
          Latin words, consectetur, from a Lorem Ipsum passage, and going
          through the cites of the word in classical literature, discovered the
          undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
          1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and
          Evil) by Cicero, written in 45 BC. This book is a treatise on the
          theory of ethics, very popular during the Renaissance. The first line
          of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
          section 1.10.32. The standard chunk of Lorem Ipsum used since the
          1500s is reproduced below for those interested. Sections 1.10.32 and
          1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also
          reproduced in their exact original form, accompanied by English
          versions from the 1914 translation by H. Rackham.
        </div>
        <Modal
          isOpen={isOpen}
          onRequestClose={() => {
            action("close")();
            close();
          }}
        >
          <Panel>
            <code>
              モーダル表示中は'body'タグにoverflow:
              hiddenを付加することでスクロールをできないようにすることができる
            </code>
          </Panel>
        </Modal>
      </>
    </ThemeProvider>
  );
}

storiesOf("Modal", module)
  .add("simple", () => <Simple />)
  .add("form", () => <Form />);
