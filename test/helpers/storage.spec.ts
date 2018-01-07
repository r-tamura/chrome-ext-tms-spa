import "jest"
import Storage from "~/helpers/storage"

describe("local storage", () => {
  it("should be persistent", async () => {
    const key = "key"
    const data = { key1: 10, key2: 42 }

    const res = await Storage.getFromStorage(key)
    expect(res).toEqual(null)

    await Storage.saveInStorage(key, data)
    expect(localStorage.__STORE__[key]).toBe("{\"key1\":10,\"key2\":42}")

    expect(Storage.getFromStorage(key)).resolves.toEqual(data)
  })
})
