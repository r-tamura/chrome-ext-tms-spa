import "jest"
import { get, set, remove, has, serialize } from "~/helpers/cookie"

describe("cookie/get and cookie/has", () => {
  it("should get cookie session value", () => {
    expect(get("session", "session=12345; foo")).toBe("12345")

    expect(get("session", "session=12345; session=98765")).toBe("12345")

    expect(get("session", "session=\"12345\"; foo=abcde; bar")).toBe("12345")
  })

  it("should check the cookie corresponding to key exists", () => {
    expect(has("session", "session=\"12345\"; foo=abcde; bar")).toBe(true)
  })
})

describe("cookie/serialize", () => {
  it("serialize cookie object", () => {
    expect(serialize("key", "value")).toBe("key=value")
  })

  it("Expires", () => {
    expect(serialize("key", "value", { expires: new Date("1970-01-01") }))
    .toBe("key=value; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
  })

  it("HttpOnly", () => {
    expect(serialize("key", "value", { httpOnly: true }))
      .toBe("key=value; HttpOnly")

    expect(serialize("key", "value", { httpOnly: false }))
      .toBe("key=value")
  })

  it("Secure", () => {
    expect(serialize("key", "value", { secure: true }))
      .toBe("key=value; Secure")
  })

  it("Domain", () => {
    expect(serialize("key", "value", { domain: "example.local" }))
      .toBe("key=value; Domain=example.local")
  })

  it("Path", () => {
    expect(serialize("key", "value", { path: "/" }))
      .toBe("key=value; Path=/")
  })

  it("SameSite", () => {
    expect(serialize("key", "value", { sameSite: "lax" }))
    .toBe("key=value; SameSite=lax")
  })
})
