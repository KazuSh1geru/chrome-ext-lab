// Chrome API のモック
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn()
  },
  tabs: {
    query: jest.fn()
  }
};

// Web Speech API のモック
global.webkitSpeechRecognition = class {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.lang = '';
    this.onresult = null;
    this.onerror = null;
  }

  start() {}
  stop() {}
}; 