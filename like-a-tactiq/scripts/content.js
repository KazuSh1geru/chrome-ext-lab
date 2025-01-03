console.log('Content script loaded for Like-a-Tactiq');

export class MeetTranscription {
  constructor() {
    this.isTranscribing = false;
    this.recognition = null;
    this.transcriptContainer = null;
  }

  // 文字起こし用のUIを作成
  createTranscriptUI() {
    this.transcriptContainer = document.createElement('div');
    this.transcriptContainer.className = 'like-a-tactiq-transcript';
    this.transcriptContainer.style.cssText = `
      position: fixed;
      right: 20px;
      top: 20px;
      width: 300px;
      max-height: 80vh;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 16px;
      overflow-y: auto;
      z-index: 9999;
    `;
    document.body.appendChild(this.transcriptContainer);
  }

  // 音声認識の初期化
  initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech Recognition API is not supported in this browser');
      return;
    }

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ja-JP';

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        this.updateTranscript(transcript, !event.results[i].isFinal);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  // 文字起こしテキストの更新
  updateTranscript(text, isInterim) {
    const transcriptElement = document.createElement('p');
    transcriptElement.textContent = text;
    transcriptElement.style.opacity = isInterim ? '0.7' : '1';
    
    if (isInterim) {
      const lastElement = this.transcriptContainer.lastChild;
      if (lastElement && lastElement.classList.contains('interim')) {
        this.transcriptContainer.removeChild(lastElement);
      }
      transcriptElement.classList.add('interim');
    }

    this.transcriptContainer.appendChild(transcriptElement);
    this.transcriptContainer.scrollTop = this.transcriptContainer.scrollHeight;
  }

  // 文字起こし開始
  startTranscription() {
    if (!this.isTranscribing) {
      this.isTranscribing = true;
      this.recognition.start();
      console.log('Transcription started');
    }
  }

  // 文字起こし停止
  stopTranscription() {
    if (this.isTranscribing) {
      this.isTranscribing = false;
      this.recognition.stop();
      console.log('Transcription stopped');
    }
  }
}

// メイン処理
function initializeTranscription() {
  const transcription = new MeetTranscription();
  transcription.createTranscriptUI();
  transcription.initializeSpeechRecognition();

  // メッセージリスナーの設定
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startTranscription') {
      transcription.startTranscription();
      sendResponse({ status: 'started' });
    } else if (request.action === 'stopTranscription') {
      transcription.stopTranscription();
      sendResponse({ status: 'stopped' });
    }
  });
}

// テスト環境でない場合のみ初期化を実行
if (process.env.NODE_ENV !== 'test') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeTranscription();
  });
} 