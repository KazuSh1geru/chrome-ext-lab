console.log('Content script loaded for Like-a-Tactiq');

// Google Meetページの音声を取得するための初期化処理
function initializeTranscription() {
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
  const transcription = new Transcription();
  transcription.initialize();
}

// 即時実行を試みる
console.log('Attempting immediate initialization');
if (document.body) {
  initializeTranscription();
} else {
  // bodyが利用可能になるまで待機
  const observer = new MutationObserver((mutations, obs) => {
    if (document.body) {
      console.log('Body found, initializing...');
      initializeTranscription();
      obs.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

// バックアップとしてDOMContentLoaded時にも実行
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  if (!document.querySelector('.like-a-tactiq-transcript')) {
    initializeTranscription();
  }
});

// ES ModulesとCommonJSの両方をサポート
if (typeof exports !== 'undefined') {
  module.exports = { MeetTranscription };
} else {
  window.MeetTranscription = MeetTranscription;
} 