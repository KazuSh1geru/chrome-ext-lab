chrome.runtime.onInstalled.addListener(() => {
  console.log('Tactiq Clone extension installed');
});

// Meetページが開かれたときの処理
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('meet.google.com')) {
    console.log('Google Meet page detected');
  }
}); 