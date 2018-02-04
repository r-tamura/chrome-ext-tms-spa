import classNames from "~/helpers/classNames"

describe("classNames", () => {
  it("should be class name string", () => {
    expect(classNames("class1", "class2")).toBe("class1 class2")
  })

  it("should get rid of empty strings", () => {
    expect(classNames("foo", "", "bar")).toBe("foo bar")
  })

  it("", () => {
    expect(classNames(
      "foo",
      "bar",
      {
        block: true,
        circle: true,
        disabled: false,
      }
    )).toBe("foo bar block circle")
  })
})
