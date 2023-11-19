import { useState, useEffect } from "react";

export const Whisper = ({
  onConvertedText,
  apiKey,
}: {
  onConvertedText: (text: string) => void;
  apiKey: string | null;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [hasRecordingSupport, setHasRecordingSupport] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && MediaRecorder) {
      setHasRecordingSupport(true);
    }
  }, []);

  const onDataAvailable = (e: BlobEvent) => {
    const formData = new FormData();
    formData.append("file", e.data, "recording.webm");
    formData.append("model", "whisper-1");

    setIsTranscribing(true);

    fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => onConvertedText(data.text))
      .catch((err) => console.error("Error transcribing: ", err))
      .finally(() => setIsTranscribing(false));
  };

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", onDataAvailable);
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error starting recorder: ", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  return (
    <>
      {hasRecordingSupport && (
        <div
          style={{
            position: "absolute",
            bottom: "1px",
            right: "1px",
            zIndex: 10,
          }}
        >
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
            style={{
              border: "0px",
              padding: "1px",
              cursor: isTranscribing ? "not-allowed" : "pointer",
            }}
          >
            {
              isRecording
                ? "Stop Recording" // Text to indicate stopping the recording
                : "Start Recording" // Text to indicate starting the recording
            }
          </button>
        </div>
      )}
    </>
  );
};
