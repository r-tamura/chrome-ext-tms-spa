import "jest"
import { fetchIsLoggedIn, login, logout } from "~/api/login"

describe("/api/login/login", () => {
  it("should login", () => {
    const expected = { isAuthenticated: true, name: "Alice Cooper" }
    expect.assertions(1)
    return expect(login("alice", "password")).resolves.toEqual(expected)
  })

  it("should occur login error", () => {
    const expected = { isAuthenticated: false }
    expect.assertions(1)
    return expect(login("chris", "passw0rd")).resolves.toEqual(expected)
  })
})

describe("/api/login/logout", () => {
  it("should logout user", () => {
    const expected = { isAuthenticated: false }
    expect(logout()).toEqual(expected)
  })
})
