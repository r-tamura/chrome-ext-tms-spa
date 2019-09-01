const path = require("path")

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
      },
      {
        // 公式README.mdの手順を行うとloaderがないというエラーが発生する
        // Error: Cannot find module '@storybook/source-loader'
        // @storybook/addon-storysource/loaderであれば動作した
        // Todo: betaブランチでは非推奨とされているので今後置き換えが必要になる。
        // https://github.com/storybookjs/storybook/blob/next/addons/storysource/loader.js
        loader: require.resolve('@storybook/addon-storysource/loader'),
        // require.resolve('@storybook/source-loader'),
        options: { parser: "typescript" }
      },
      // Optional
      {
        loader: require.resolve('react-docgen-typescript-loader'),
      },
    ],
  });
  // このプロジェクト用のモジュール解決エイリアス
  // ex: import { Button } from "~/components/atoms"
  config.resolve.alias = {
    "~": path.resolve(__dirname, "..", "src")
  }
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};