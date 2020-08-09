/**
 * ObjectタイプインスタンスをFormDataインスタンスへ変換します
 * @param input Objectタイプインスタンス
 * @return FormDataインスタンス
 * @example
 * import toFormData from "to-formdata"
 * const formdata = toFormData({foo: "bar"})
 * formdata.get("foo") // "bar"
 * formdata.has("foo") // true
 */
const toFormData = (input: object): FormData => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(input)) {
    fd.append(k, v);
  }
  return fd;
};

export default toFormData;
