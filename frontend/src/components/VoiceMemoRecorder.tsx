import { useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

type VoiceMemoRecorderProps = {
  onRecordedText?: (text: string) => void;
};

export default function VoiceMemoRecorder({
  onRecordedText = () => {},
}: VoiceMemoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  return (
    <button
      onClick={() => {
        if (isRecording) {
          setIsRecording(false);
          SpeechRecognition.stopListening();
          onRecordedText(transcript);
          resetTranscript();
        } else {
          setIsRecording(true);
          if (browserSupportsSpeechRecognition) {
            SpeechRecognition.startListening();
          }
        }
      }}
      className={`${
        isRecording ? 'bg-red-500' : 'bg-blue-500'
      } text-white font-bold py-2 px-4 rounded-full`}
    >
      Record {isRecording ? 'Stop' : 'Start'}
    </button>
  );
}
