// バックグラウンドスクリプト
const EXTENSION_NAME = 'Like-a-Tactiq';

chrome.runtime.onInstalled.addListener(() => {
  console.log(`${EXTENSION_NAME} extension installed`);
});

// Meetページが開かれたときの処理を改善
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // URLチェックを改善
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('meet.google.com')) {
    console.log('Google Meet page detected');
    
    // content scriptが正しく動作していることを確認
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        console.log('Content script injection check');
        // 既存のコンテナがない場合のみ初期化
        if (!document.querySelector('.like-a-tactiq-transcript')) {
          window.initializeTranscription?.();
        }
      }
    });
  }
});

// Service Workerを活性化状態に保つ
chrome.runtime.onStartup.addListener(() => {
  console.log(`${EXTENSION_NAME} started`);
}); 