// 文字起こし機能の実装
class Transcription {
  constructor() {
    this.isActive = false;
    this.recognition = null;
  }

  initialize() {
    console.log('Initializing Web Speech API');
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'ja-JP';
      this.setupRecognitionHandlers();
    }
  }

  setupRecognitionHandlers() {
    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        this.updateTranscriptUI(transcript, !event.results[i].isFinal);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };
  }

  updateTranscriptUI(text, isInterim) {
    const container = document.querySelector('.like-a-tactiq-transcript');
    if (!container) return;

    const p = document.createElement('p');
    p.textContent = text;
    p.style.opacity = isInterim ? '0.7' : '1';
    
    if (isInterim) {
      const lastElement = container.lastChild;
      if (lastElement?.classList.contains('interim')) {
        container.removeChild(lastElement);
      }
      p.classList.add('interim');
    }
    
    container.appendChild(p);
    container.scrollTop = container.scrollHeight;
  }

  start() {
    if (!this.isActive && this.recognition) {
      this.isActive = true;
      this.recognition.start();
      console.log('Transcription started');
    }
  }

  stop() {
    if (this.isActive && this.recognition) {
      this.isActive = false;
      this.recognition.stop();
      console.log('Transcription stopped');
    }
  }
}

// グローバルに公開
window.Transcription = Transcription;