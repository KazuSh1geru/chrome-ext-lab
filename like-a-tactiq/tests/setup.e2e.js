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
  
  // より詳細なデバッグ情報
  console.log('All targets:', targets.map(t => ({
    url: t.url(),
    type: t.type(),
    title: t.type() === 'service_worker' ? 'Service Worker' : t._targetInfo?.title
  })));

  const extensionTarget = targets.find((target) => {
    const targetUrl = target.url() || '';
    const targetType = target.type();
    return (
      targetUrl.startsWith('chrome-extension://') && 
      (targetType === 'service_worker' || targetType === 'background_page')
    );
  });

  if (!extensionTarget) {
    throw new Error('Extension service worker not found');
  }

  const extensionUrl = extensionTarget.url();
  const [,, extensionId] = extensionUrl.split('/');
  return extensionId;
}; 