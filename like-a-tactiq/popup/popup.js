document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startTranscription');
  const stopButton = document.getElementById('stopTranscription');
  const statusSpan = document.getElementById('status');

  // 初期状態の設定
  stopButton.disabled = true;
  let isTranscribing = false;

  // 現在のタブを取得する関数
  async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  // ステータスを更新する関数
  function updateStatus(status) {
    statusSpan.textContent = status;
    isTranscribing = status === 'Transcribing...';
    startButton.disabled = isTranscribing;
    stopButton.disabled = !isTranscribing;
  }

  // 初期状態の確認
  getCurrentTab().then(tab => {
    if (tab.url?.includes('meet.google.com')) {
      updateStatus('Waiting for Meet...');
    } else {
      updateStatus('Please open Google Meet');
      startButton.disabled = true;
    }
  });

  // 文字起こし開始
  startButton.addEventListener('click', async () => {
    const tab = await getCurrentTab();
    if (tab.url?.includes('meet.google.com')) {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'startTranscription' });
        updateStatus('Transcribing...');
      } catch (error) {
        console.error('Failed to start transcription:', error);
        updateStatus('Failed to start');
      }
    }
  });

  // 文字起こし停止
  stopButton.addEventListener('click', async () => {
    const tab = await getCurrentTab();
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'stopTranscription' });
      updateStatus('Stopped');
    } catch (error) {
      console.error('Failed to stop transcription:', error);
      updateStatus('Failed to stop');
    }
  });

  // エラーハンドリング
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Popup error:', { message, source, lineno, colno, error });
    updateStatus('Error occurred');
  };
}); 