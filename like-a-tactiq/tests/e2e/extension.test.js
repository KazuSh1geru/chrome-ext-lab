const puppeteer = require('puppeteer');
const path = require('path');

describe('Like-a-Tactiq Extension E2E', () => {
  let browser;
  let page;
  let extensionId;

  beforeAll(async () => {
    const extensionPath = path.resolve(__dirname, '../../');
    browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--allow-file-access-from-files',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--no-sandbox',
        '--disable-web-security'
      ],
      devtools: true
    });

    // 拡張機能の読み込み待機時間を増やす
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
      const targets = await browser.targets();
      console.log('Initial targets:', targets.map(t => ({
        url: t.url(),
        type: t.type()
      })));

      extensionId = await getExtensionId(browser);
      console.log('Successfully found extension ID:', extensionId);
    } catch (error) {
      console.error('Failed to get extension ID:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      page = await browser.newPage();
      await page.goto('https://meet.google.com/test-meeting-id', {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
    } catch (error) {
      console.error('Failed to setup test page:', error);
      throw error;
    }
  });

  afterEach(async () => {
    if (page) {
      await page.close().catch(console.error);
    }
  });

  afterAll(async () => {
    if (browser) {
      await browser.close().catch(console.error);
    }
  });

  test('extension injects transcript container', async () => {
    try {
      await page.waitForSelector('.like-a-tactiq-transcript', { timeout: 5000 });
      const container = await page.$('.like-a-tactiq-transcript');
      expect(container).toBeTruthy();
    } catch (error) {
      console.error('Failed to find transcript container:', error);
      throw error;
    }
  });

  test('popup controls work correctly', async () => {
    try {
      const popupPage = await browser.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup/popup.html`);
      
      await popupPage.waitForSelector('#startTranscription');
      await popupPage.click('#startTranscription');
      await popupPage.waitForTimeout(1000);

      const status = await popupPage.$eval('#status', el => el.textContent);
      expect(status).toBe('Transcribing...');

      await popupPage.click('#stopTranscription');
      await popupPage.waitForTimeout(1000);

      const newStatus = await popupPage.$eval('#status', el => el.textContent);
      expect(newStatus).toBe('Stopped');

      await popupPage.close();
    } catch (error) {
      console.error('Failed in popup test:', error);
      throw error;
    }
  });

  test('transcription UI updates with speech', async () => {
    try {
      await page.waitForSelector('.like-a-tactiq-transcript');

      const popupPage = await browser.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup/popup.html`);
      await popupPage.click('#startTranscription');

      await page.evaluate(() => {
        const event = new CustomEvent('speechrecognition', {
          detail: { text: 'Test transcription' }
        });
        document.dispatchEvent(event);
      });

      await page.waitForFunction(
        () => document.querySelector('.like-a-tactiq-transcript p')?.textContent === 'Test transcription',
        { timeout: 5000 }
      );

      const transcriptText = await page.$eval('.like-a-tactiq-transcript p', el => el.textContent);
      expect(transcriptText).toBe('Test transcription');

      await popupPage.close();
    } catch (error) {
      console.error('Failed in transcription test:', error);
      throw error;
    }
  });
}); 