# chrome-ext-lab

Chrome拡張で遊んでみよう.

## tips: TypeScript を使用する

VSCode や Atom などのコードエディタを使用して開発している場合は、npm パッケージ chrome-types を使用して Chrome API のオートコンプリートを利用できます。この npm パッケージは、Chromium ソースコードが変更されると自動的に更新されます。

<https://www.npmjs.com/package/chrome-types>

<https://developer.chrome.com/docs/extensions/reference?hl=ja>

## ディレクトリ構成

```plaintext
my-extension/
├── manifest.json
├── background.js
├── scripts/
│   ├── content.js
│   └── react.production.min.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
└── images/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-48.png
    └── icon-128.png
```
