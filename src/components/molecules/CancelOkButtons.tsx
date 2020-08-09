import React from "react";
import { ButtonGroup, Button } from "../atoms";

interface IProps {
  handleCancelClick(e: React.MouseEvent<HTMLButtonElement>): void;
  isCancelDisabled?: boolean;
  cancelText?: string;
  isSubmitDisabled?: boolean;
  submitText?: string;
}

export function CancelOkButtons({
  handleCancelClick,
  isCancelDisabled = false,
  isSubmitDisabled = false,
  cancelText = "キャンセル",
  submitText = "サブミット"
}: IProps) {
  return (
    <ButtonGroup>
      <Button
        variant="contained"
        type="button"
        onClick={handleCancelClick}
        disabled={isCancelDisabled}
      >
        {cancelText}
      </Button>
      <Button variant="contained" color="primary" disabled={isSubmitDisabled}>
        {submitText}
      </Button>
    </ButtonGroup>
  );
}
