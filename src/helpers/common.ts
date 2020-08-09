import * as R from "ramda";

/**
 *  汎用関数群
 */

/**
 * コールバック関数を実行し、引数をそのまま返します
 */
export const doAction = (fn: (arg: any) => void) => (arg: any) => {
  fn(arg);
  return arg;
};

/**
 * オブジェクトであるかを判定します
 * @param {any} 評価対象
 * @return {boolean} true: オブジェクトインスタンス
 */
export const isObject = (value: any): boolean => {
  return value != null && typeof value === "object";
};

/**
 * オブジェクトであるかを判定します
 * @param {any} 評価対象
 * @return {boolean} true: オブジェクトインスタンス
 */
export const isArray = (value: any): boolean => {
  return Array.isArray(value);
};

/**
 * 関数オブジェクトであるかを判定します
 * @param {any} 評価対象
 * @return {boolean} true: 関数オブジェクト
 */
export const isFunction = (value: any): boolean => {
  return value && typeof value === "function";
};

/**
 *
 * 文字列処理
 *
 */
export const leftPad = R.curry(
  (padstr: string, digit: number, target: number | string): string =>
    target.toString().padStart(digit, padstr)
);

/**
 * 第二引数で指定された桁数だけ"0"埋めを行った文字列を返す
 * @param {number} numZeros 0埋めの桁数
 * @param {number | string} target 0埋めを行う対象(負の数も対応)
 * @return {string} 0埋めされた文字列
 */
export const zerofill = leftPad("0");

/**
 * 日付を指定されたフォーマットの文字列に変換します(yyyymmddのみ実装)
 * @param {Date} date 日付
 * @param {string} format 出力フォーマット(デフォルトyyyymmdd)
 * @return {string} 指定されたフォーマットに変換された文字列
 */
export const formatDate = (date: Date, format: string = "yyyymmdd"): string => {
  const year: string = zerofill(4, date.getFullYear());
  const month: string = zerofill(2, date.getMonth() + 1);
  const dayOfMonth: string = zerofill(2, date.getDate());
  return `${year}${month}${dayOfMonth}`;
};

/**
 *
 * 配列/オブジェクト処理
 *
 */

/**
 * Iteratableオブジェクトから指定のプロパティの値が指定する値と一致するオブジェクトを取得します
 * @param {Iteratable} iteratable 検索対象のIteratableオブジェクト
 * @param {any} key 検索プロパティ名
 * @param {any} value 検索する値
 * @return {object} 検索条件に最初に該当したオブジェクト(該当対象が存在しない場合はnullを返します)
 */
export const search = (
  iteratable: Iterable<object>,
  key: string,
  value: any
): object => {
  for (const obj of iteratable) {
    if (key in obj && R.prop(key, obj as any) === value) {
      return obj;
    }
  }
  return null;
};

/**
 * Pythonのzipに相当する処理を実行します
 * @param {...rows} 任意数の配列
 * @return {array} Zipped array
 */
export const zip = (...rows: any[]) => {
  return [...rows[0]].map((_, i) => rows.map(row => row[i]));
};

/**
 * 配列をShallow Copyします
 */
export const copyArray = (ary: any[]): any[] => {
  return ary.slice();
};

export const arrayToMap = <T>(
  array: T[],
  keyName: string,
  valueName: string
): Map<string, string> => {
  const map = new Map<string, string>();
  array.forEach((e: T) => {
    map.set(R.prop(keyName, e as any), R.prop(valueName, e as any));
  });
  return map;
};

export const aryOfObjToObj = <T>(
  keyName: keyof T,
  aryOfObj: T[]
): { [s: string]: T } =>
  aryOfObj.reduce((acc, v) => ({ ...acc, [R.prop(keyName, v) as any]: v }), {});

/**
 * エラーオブジェクトを生成します
 * @param {string} name エラー名
 * @param {string} msg エラーメッセージ
 * @return {Error} エラーオブジェクト
 */
export const createError = (name: string, msg: string): Error => {
  const err = new Error(msg);
  err.name = name;
  return err;
};

export const composeAsync = (
  ...fns: Array<(...args: any[]) => any>
): ((...args: any[]) => any) => {
  if (fns.length === 0) {
    return (arg: any) => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce((f, g) => {
    return async (...args: any[]) => {
      const res = g(...args);
      if (res instanceof Promise) {
        return f(await res);
      } else {
        return f(res);
      }
    };
  });
};

/**
 *
 *  オブジェクト操作
 *
 */
export const set = R.curry((key: string | number, value: any, obj: object) => {
  return { ...obj, [key]: value };
});

/**
 * オブジェクトを新しいキーで再定義します
 * @param {object} keyMap 再定義前キーと再定義後キーのマップ
 * @param {object} obj 再定義対象のオブジェクト
 * @return {any} 再定義後オブジェクト
 *
 * ex:
 *  remap({key1: newkey1, key2: newkey2}, {key1: 1, key2: 2, key3: 3}) // {newkey1: 1, newkey2: 2}
 */
export const remap = R.curry((keyMap: { [k: string]: string }, obj: any): any =>
  R.toPairs<string>(keyMap).reduce(
    (acc, [oldKey, newKey]) =>
      R.has(oldKey, obj) ? set(newKey, R.prop(oldKey, obj), acc) : acc,
    {}
  )
);

/**
 *
 *  乱数
 *
 */
/**
 * UUID(v4)文字列を生成します
 * see http://qiita.com/psn/items/d7ac5bdb5b5633bae165
 */
export const uuidv4 = (): string =>
  Array.from("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx")
    .map(c => {
      switch (c) {
        case "x":
          return Math.floor(Math.random() * 16).toString(16);
        case "y":
          return Math.floor(Math.random() * 4 + 8).toString(16);
        default:
          return c;
      }
    })
    .join("");

/**
 *
 * ログ操作
 *
 */
/**
 *  インフォログを出力します
 */
export const log = (msg: string) => {
  console.log(msg);
};

/**
 * エラーログを出力します
 */
export const error = (msg: string) => {
  console.error(msg);
};

/**
 * 警告ログを出力します
 */
export const warn = (msg: string) => {
  console.warn(msg);
};
