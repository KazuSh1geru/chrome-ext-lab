// 文字起こし機能のダミー実装
class Transcription {
  constructor() {
    this.isActive = false;
    this.recognition = null;
  }

  // 文字起こしの初期化
  initialize() {
    console.log('Transcription service initialized');
    // Web Speech APIのダミー初期化
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'ja-JP';
    }
    return true;
  }

  // 文字起こし開始
  start() {
    console.log('Starting transcription service');
    this.isActive = true;
    if (this.recognition) {
      this.recognition.start();
    }
    return true;
  }

  // 文字起こし停止
  stop() {
    console.log('Stopping transcription service');
    this.isActive = false;
    if (this.recognition) {
      this.recognition.stop();
    }
    return true;
  }

  // ステータス確認
  getStatus() {
    return {
      active: this.isActive,
      available: !!this.recognition
    };
  }
}

// グローバルに公開
window.Transcription = Transcription;

// デフォルトのインスタンスをエクスポート
const transcription = new Transcription();
export default transcription; 