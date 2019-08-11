/**
 * ストレージから指定されたキー値のデータを取得します
 * @param {string} key ストレージのキー
 * @return {Promise<object>} キーに対応したデータ
 */
const getFromStorage = <T>(key: string): Promise<T> => {
  const serializedData = localStorage.getItem(key);
  return Promise.resolve(serializedData ? JSON.parse(serializedData) : null);
};

/**
 * ストレージへデータを保存します
 * getFromStorageで
 *
 * @param {string} key ストレージのキー
 * @param data object 保存するデータオブジェクト
 */
const saveInStorage = (key: string, data: object): Promise<void> => {
  localStorage.setItem(key, JSON.stringify(data));
  return Promise.resolve();
};

export default {
  getFromStorage,
  saveInStorage
};
