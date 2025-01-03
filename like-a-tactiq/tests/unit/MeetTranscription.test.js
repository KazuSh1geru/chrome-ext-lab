const { MeetTranscription } = require('../../scripts/content');

describe('MeetTranscription', () => {
  let transcription;
  
  beforeEach(() => {
    document.body.innerHTML = '';
    transcription = new MeetTranscription();
  });

  test('creates UI container when initialized', () => {
    transcription.createTranscriptUI();
    const container = document.querySelector('.like-a-tactiq-transcript');
    expect(container).toBeTruthy();
  });

  test('starts transcription when not already running', () => {
    transcription.initializeSpeechRecognition();
    const startSpy = jest.spyOn(transcription.recognition, 'start');
    
    transcription.startTranscription();
    expect(startSpy).toHaveBeenCalled();
    expect(transcription.isTranscribing).toBe(true);
  });

  test('stops transcription when running', () => {
    transcription.initializeSpeechRecognition();
    transcription.isTranscribing = true;
    const stopSpy = jest.spyOn(transcription.recognition, 'stop');
    
    transcription.stopTranscription();
    expect(stopSpy).toHaveBeenCalled();
    expect(transcription.isTranscribing).toBe(false);
  });

  test('handles speech recognition errors', () => {
    transcription.initializeSpeechRecognition();
    const errorSpy = jest.spyOn(console, 'error');
    
    transcription.recognition.onerror({ error: 'test error' });
    expect(errorSpy).toHaveBeenCalledWith('Speech recognition error:', 'test error');
  });

  test('updates transcript text correctly', () => {
    transcription.createTranscriptUI();
    
    // 通常のテキスト
    transcription.updateTranscript('Hello', false);
    let transcriptElements = document.querySelectorAll('p');
    expect(transcriptElements[0].textContent).toBe('Hello');
    expect(transcriptElements[0].style.opacity).toBe('1');
    
    // 中間テキスト
    transcription.updateTranscript('Hello World', true);
    transcriptElements = document.querySelectorAll('p');
    expect(transcriptElements[1].textContent).toBe('Hello World');
    expect(transcriptElements[1].style.opacity).toBe('0.7');
  });

  test('handles chrome messages correctly', () => {
    const transcription = new MeetTranscription();
    const sendResponse = jest.fn();
    
    chrome.runtime.onMessage.addListener((listener) => {
      listener({ action: 'startTranscription' }, {}, sendResponse);
      expect(sendResponse).toHaveBeenCalledWith({ status: 'started' });
      
      listener({ action: 'stopTranscription' }, {}, sendResponse);
      expect(sendResponse).toHaveBeenCalledWith({ status: 'stopped' });
    });
  });
}); 