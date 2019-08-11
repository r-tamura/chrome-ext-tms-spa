import { isObject } from "./common";
import flatMap from "./flatMap";

const convertBoolAttrs = (o: string | object) => {
  if (isObject(o)) {
    return [...Object.entries(o)].map(([k, v]: [string, boolean]) =>
      v ? k : ""
    );
  }
  return o;
};

/**
 * クラス名のリストからHTMLノードのclass属性の文字列を出力します
 * @param ...classes クラス名リスト
 * @example <caption></caption>
 * classNames("class1", "class2") // "class1 class2"
 * @example <caption>空文字の要素は出力結果から除外される</caption>
 * classNames("foo", "", "bar") // "foo bar"
 * @example <caption>booleanを値としたObjectを引数としてとる場合は値がtrueのkey値を返す</caption>
 * classNames("foo", { block: false, circle: true }) // "foo circle"
 */
const classNames = (...classes: Array<string | object>) => {
  return flatMap<string | object>(convertBoolAttrs, classes)
    .filter(c => !!c)
    .join(" ");
};

export default classNames;
