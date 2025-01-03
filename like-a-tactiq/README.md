# like-a-tactiq

Google Meetのリアルタイム文字起こしを行うChrome拡張機能

## ディレクトリ構成

```plaintext
like-a-tactiq/
├── manifest.json
├── background.js
├── scripts/
│   ├── content.js
│   └── transcription.js
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

## 機能

- Google Meet会議の音声をリアルタイムで文字起こし
- 文字起こしテキストの表示と保存
- ポップアップUIでの簡単な操作

## 開発方法

1. このリポジトリをクローン
2. Chrome拡張機能の管理ページ(`chrome://extensions/`)を開く
3. デベロッパーモードを有効化
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、このディレクトリを選択 