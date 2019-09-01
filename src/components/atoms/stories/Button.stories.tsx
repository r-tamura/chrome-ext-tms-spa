import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ThemeProvider } from "styled-components";
// import { linkTo } from "@storybook/addon-links";
import { Button, ButtonGroup } from "../Button";

import { telema } from "../../../styles/theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

storiesOf("Button", module)
  .add("variant", () => (
    <ThemeProvider theme={telema}>
      <div
        style={{
          display: "grid",
          gridGap: "10px",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))"
        }}
      >
        <>
          <Button onClick={action("clicked")}>Text</Button>
          <Button disabled>Text</Button>
          <Button color={"primary"} onClick={action("clicked")}>
            Text
          </Button>
          <Button color={"secondary"} onClick={action("clicked")}>
            Text
          </Button>
          <Button color={"danger"} onClick={action("clicked")}>
            Text
          </Button>
        </>
        <>
          <Button outline onClick={action("clicked")}>
            Outlined
          </Button>
          <Button outline disabled>
            Outlined
          </Button>
          <Button color={"primary"} outline onClick={action("clicked")}>
            Outlined
          </Button>
          <Button color={"secondary"} outline onClick={action("clicked")}>
            Outlined
          </Button>
          <Button color={"danger"} outline onClick={action("clicked")}>
            Outlined
          </Button>
        </>
        <>
          <Button variant={"contained"} onClick={action("clicked")}>
            Contained
          </Button>
          <Button variant={"contained"} disabled>
            Contained
          </Button>
          <Button
            variant={"contained"}
            color={"primary"}
            onClick={action("clicked")}
          >
            Contained
          </Button>
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={action("clicked")}
          >
            Contained
          </Button>
          <Button
            variant={"contained"}
            color={"danger"}
            onClick={action("clicked")}
          >
            Contained
          </Button>
        </>
        <>
          <Button variant={"circle"} onClick={action("clicked")}>
            +
          </Button>
          <Button variant={"circle"} disabled>
            +
          </Button>
          <Button
            variant={"circle"}
            color={"primary"}
            onClick={action("clicked")}
          >
            +
          </Button>
          <Button
            variant={"circle"}
            color={"secondary"}
            onClick={action("clicked")}
          >
            +
          </Button>
          <Button
            variant={"circle"}
            color={"danger"}
            onClick={action("clicked")}
          >
            +
          </Button>
        </>
        <>
          <Button variant={"icon"}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button variant={"icon"} disabled>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button variant={"icon"} color="primary">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button variant={"icon"} color="secondary">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
          <Button variant={"icon"} color="danger">
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      </div>
    </ThemeProvider>
  ))
  .add("block", () => (
    <ThemeProvider theme={telema}>
      <div style={{ display: "grid", gridGap: "10px" }}>
        <Button block outline color={"primary"}>
          <span role="img" aria-label="so cool">
            Text
          </span>
        </Button>
        <Button
          block
          variant={"contained"}
          color={"primary"}
          onClick={action("clicked")}
        >
          Contained
        </Button>
      </div>
    </ThemeProvider>
  ))
  .add("group", () => (
    <ThemeProvider theme={telema}>
      <>
        <ButtonGroup>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
        <ButtonGroup place={"left"}>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </ButtonGroup>
      </>
    </ThemeProvider>
  ));
