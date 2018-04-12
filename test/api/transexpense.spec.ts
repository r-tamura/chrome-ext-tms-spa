import "jest"
import { fetchTemplatesAll } from "~/api/transexpense"

describe("/api/transexpense/fetchTemplatesAll", () => {
  it("should an empty array", async () => {
    localStorage.__STORE__["ls/transpexpensetemplate"] = null
    const expected = [] as any
    expect.assertions(1)
    return expect(fetchTemplatesAll()).resolves.toEqual(expected)
  })

  it("should a transExpense template object", async () => {
    localStorage.__STORE__["ls/transpexpensetemplate"] = "[{\"key1\":10,\"key2\":42}]"
    const expected = [{
      key1: 10,
      key2: 42,
    }]
    expect.assertions(1)
    return expect(fetchTemplatesAll()).resolves.toEqual(expected)
  })
})
