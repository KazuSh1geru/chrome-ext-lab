const puppeteer = require('puppeteer');
const path = require('path');

describe('Like-a-Tactiq Extension E2E', () => {
  let browser;
  let page;
  let extensionId;

  beforeAll(async () => {
    const extensionPath = path.join(__dirname, '../../');
    browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--allow-file-access-from-files',
        '--use-fake-ui-for-media-stream', // マイクアクセスの自動許可
        '--use-fake-device-for-media-stream' // 仮想メディアデバイスの使用
      ]
    });

    // 拡張機能のIDを取得
    extensionId = await getExtensionId(browser);
  });

  beforeEach(async () => {
    page = await browser.newPage();
    // Google Meetのモックページを使用
    await page.goto('https://meet.google.com/test-meeting-id');
    // ページ読み込み完了まで待機
    await page.waitForTimeout(2000);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('extension injects transcript container', async () => {
    const container = await page.$('.like-a-tactiq-transcript');
    expect(container).toBeTruthy();
  });

  test('popup controls work correctly', async () => {
    // ポップアップページを開く
    const popupPage = await browser.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup/popup.html`);

    // 開始ボタンをクリック
    await popupPage.click('#startTranscription');
    await popupPage.waitForTimeout(1000);

    // ステータスをチェック
    const status = await popupPage.$eval('#status', el => el.textContent);
    expect(status).toBe('Transcribing...');

    // 停止ボタンをクリック
    await popupPage.click('#stopTranscription');
    await popupPage.waitForTimeout(1000);

    // ステータスが更新されたことを確認
    const newStatus = await popupPage.$eval('#status', el => el.textContent);
    expect(newStatus).toBe('Stopped');

    await popupPage.close();
  });

  test('transcription UI updates with speech', async () => {
    // 文字起こしコンテナが表示されていることを確認
    await page.waitForSelector('.like-a-tactiq-transcript');

    // ポップアップを開いて文字起こしを開始
    const popupPage = await browser.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await popupPage.click('#startTranscription');

    // 音声認識のシミュレーション（実際のテストでは、より複雑な音声シミュレーションが必要）
    await page.evaluate(() => {
      const event = new Event('speechrecognition');
      document.dispatchEvent(event);
    });

    // 文字起こしテキストが表示されることを確認
    const transcriptText = await page.$eval('.like-a-tactiq-transcript p', el => el.textContent);
    expect(transcriptText).toBeTruthy();

    await popupPage.close();
  });
}); 