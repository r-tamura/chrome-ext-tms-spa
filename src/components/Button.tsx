import * as React from "react"
import classNames from "~/helpers/classNames"
import { Link } from "react-router-dom"

enum Color {
  DEFAULT          = "",
  PRIMARY          = "primary",
  SECONDARY        = "secondary",
  DANGER           = "danger",
  LINK             = "link",
}

interface IButtonProps extends React.ButtonHTMLAttributes<{}> {
  /* button要素とするかa要素とするか true: button / false: a*/
  button?: boolean
  className?: string
  color?: Color
  /* ボタンをblock要素とするか コンテナコンポーネントに対して最大幅と同じになる */
  block?: boolean
  circle?: boolean
  component?: React.AllHTMLAttributes<{}>
  to?: string
  size?: string
}

const Button: React.SFC<IButtonProps> = ({
  button        = true,
  disabled      = false,
  color         = Color.DEFAULT,
  block         = false,
  circle        = false,
  className: classNameProps,
  component,
  children,
  ...otherProps
} = {}) => {
  const className = classNames(
    button ? "tms-btn" : null,
    color || Color.DEFAULT,
    { disabled, block, circle },
    classNameProps
  )
  const Component = component || button ? "button" : Link

  return (
    <Component className={className} {...otherProps}>
      {children}
    </Component>
  )
}

export {
  IButtonProps,
  Color,
  Button,
}

export default Button
