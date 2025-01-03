// Puppeteerのタイムアウト設定
jest.setTimeout(30000); // 30秒

// グローバル変数の設定
global.chrome = {
  runtime: {
    id: 'test-extension-id',
    getManifest: () => require('../manifest.json'),
    getURL: (path) => `chrome-extension://test-extension-id/${path}`
  }
};

// テスト用のヘルパー関数
global.getExtensionId = async (browser) => {
  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return _targetInfo.type === 'background_page' && _targetInfo.title === 'Tactiq Clone';
  });
  const extensionUrl = extensionTarget._targetInfo.url || '';
  const [, , extensionId] = extensionUrl.split('/');
  return extensionId;
}; 