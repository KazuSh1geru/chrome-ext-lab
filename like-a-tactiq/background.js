// バックグラウンドスクリプト
const EXTENSION_NAME = 'Like-a-Tactiq';

chrome.runtime.onInstalled.addListener(() => {
  console.log(`${EXTENSION_NAME} extension installed`);
});

// Meetページが開かれたときの処理
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('meet.google.com')) {
    console.log('Google Meet page detected');
  }
});

// Service Workerを活性化状態に保つ
chrome.runtime.onStartup.addListener(() => {
  console.log(`${EXTENSION_NAME} started`);
}); 