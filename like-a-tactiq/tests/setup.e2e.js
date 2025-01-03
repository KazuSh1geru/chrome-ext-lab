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
  const extensionTarget = targets.find((target) => {
    const targetUrl = target.url() || '';
    return targetUrl.startsWith('chrome-extension://') && targetUrl.includes('background');
  });

  if (!extensionTarget) {
    throw new Error('Extension background page not found');
  }

  const extensionUrl = extensionTarget.url();
  const [,, extensionId] = extensionUrl.split('/');
  return extensionId;
}; 