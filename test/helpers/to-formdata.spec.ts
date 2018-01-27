import toFormData from "~/helpers/to-formdata"

describe("helpers/toFormData", () => {
  it("should convert an Object to FormData", () => {
    const input = {
      foo: "bar",
      x: "y",
    }
    const output = toFormData(input)
    expect(output.has("foo")).toBeTruthy()
    expect(output.get("foo").toString()).toBe("bar")
    expect(output.get("x").toString()).toBe("y")
  })
})
