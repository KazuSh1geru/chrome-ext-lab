document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startTranscription');
  const stopButton = document.getElementById('stopTranscription');
  const statusSpan = document.getElementById('status');

  // 現在アクティブなタブを取得
  async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  // 文字起こし開始
  startButton.addEventListener('click', async () => {
    const tab = await getCurrentTab();
    if (tab.url.includes('meet.google.com')) {
      chrome.tabs.sendMessage(tab.id, { action: 'startTranscription' }, (response) => {
        if (response.status === 'started') {
          statusSpan.textContent = 'Transcribing...';
          startButton.disabled = true;
          stopButton.disabled = false;
        }
      });
    } else {
      statusSpan.textContent = 'Please open Google Meet';
    }
  });

  // 文字起こし停止
  stopButton.addEventListener('click', async () => {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id, { action: 'stopTranscription' }, (response) => {
      if (response.status === 'stopped') {
        statusSpan.textContent = 'Stopped';
        startButton.disabled = false;
        stopButton.disabled = true;
      }
    });
  });

  // 初期状態の設定
  stopButton.disabled = true;
}); 