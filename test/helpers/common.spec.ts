import * as Common from "~/helpers/common"

describe("/helpers/common/remap", () => {
  it("should return an empty object", () => {
    const actual = Common.remap({ old1: "new1", old2: "new2"}, { temp1: "tempvalue1" })
    const expected = {}
    expect(actual).toEqual(expected)
  })

  it("should return an objet with 3 keys", () => {
    const actual =
      Common.remap(
        { old1: "new1", old2: "new2", old3: "new3" },
        { old1: "tempvalue1", old2: { foo: "bar" }, old3: null }
      )
    const expected = { new1: "tempvalue1", new2: { foo: "bar" }, new3: null as any }
    expect(actual).toEqual(expected)
  })
})
