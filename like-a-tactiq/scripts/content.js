console.log('Content script loaded for Like-a-Tactiq');

// グローバルスコープで関数を定義
window.initializeTranscription = function() {
  console.log('Initializing transcription...');
  
  // すでに存在する場合は作成しない
  if (document.querySelector('.like-a-tactiq-transcript')) {
    console.log('Transcript container already exists');
    return;
  }

  // UIの注入を確実に行う
  const container = document.createElement('div');
  container.className = 'like-a-tactiq-transcript';
  container.style.cssText = `
    position: fixed;
    right: 20px;
    top: 20px;
    width: 300px;
    max-height: 80vh;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 16px;
    z-index: 9999;
  `;
  document.body.appendChild(container);
  console.log('Transcript container created');

  // 音声取得とWeb Speech APIの初期化処理
  window.transcription = new Transcription();
  window.transcription.initialize();
};

// 即時実行を試みる
console.log('Attempting immediate initialization');
if (document.body) {
  window.initializeTranscription();
}

// MutationObserverを使用してbodyの出現を監視
const observer = new MutationObserver((mutations, obs) => {
  if (document.body) {
    console.log('Body found, initializing...');
    window.initializeTranscription();
    obs.disconnect();
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// バックアップとしてDOMContentLoaded時にも実行
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  window.initializeTranscription();
});

// メッセージリスナーの設定
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  try {
    switch (request.action) {
      case 'startTranscription':
        if (window.transcription) {
          window.transcription.start();
          sendResponse({ status: 'started' });
        } else {
          window.initializeTranscription();
          window.transcription.start();
          sendResponse({ status: 'started' });
        }
        break;
      case 'stopTranscription':
        if (window.transcription) {
          window.transcription.stop();
          sendResponse({ status: 'stopped' });
        } else {
          sendResponse({ error: 'Transcription not initialized' });
        }
        break;
      default:
        sendResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ error: error.message });
  }
  return true; // 非同期レスポンスのために必要
});