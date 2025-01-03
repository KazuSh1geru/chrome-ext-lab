import { MeetTranscription } from '../../scripts/content';

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
}); 