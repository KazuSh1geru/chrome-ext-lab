const puppeteer = require('puppeteer');

describe('Like-a-Tactiq Extension E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--disable-extensions-except=./like-a-tactiq',
        '--load-extension=./like-a-tactiq'
      ]
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('https://meet.google.com');
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
    const extensionId = // 拡張機能のIDを取得する必要があります
    await page.goto(`chrome-extension://${extensionId}/popup/popup.html`);

    // Start transcriptionボタンをクリック
    await page.click('#startTranscription');
    const status = await page.$eval('#status', el => el.textContent);
    expect(status).toBe('Transcribing...');
  });
}); 