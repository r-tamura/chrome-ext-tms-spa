import "jest"
import * as React from "react"
import * as TestUtils from "react-test-renderer/shallow"
import { shallow, mount, render } from "enzyme"
import Hello from "~/components/Hello"

describe("<Hello />", () => {

  it("should named 'Hello'", () => {
    expect(Hello.displayName).toBe("Hello")
  })

  it("should render without throwing errors", () => {
    expect(TestUtils.createRenderer().render(<Hello greetings="Test!" />)).toMatchSnapshot()
  })

  it("should render 'Hello, TypeScript'", () => {
    expect(shallow(<Hello />).contains(<h1 className="hello">Hello, TypeScript</h1>)).toBe(true)
  })

  it("should render '<div>{children}</div>'", () => {
    expect(shallow(<Hello>Hello Children!</Hello>)
      .contains(<div className="hello__children">Hello Children!</div>)).toBe(true)
  })
})
