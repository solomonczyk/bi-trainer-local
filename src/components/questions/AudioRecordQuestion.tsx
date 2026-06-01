import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Play, Loader2 } from 'lucide-react';
import type { Question } from '../../types/question';

interface AudioRecordQuestionProps {
  question: Question;
  onAnswer: (answer: { blobUrl: string; duration: number }) => void;
  disabled?: boolean;
}

export default function AudioRecordQuestion({
  question,
  onAnswer,
  disabled,
}: AudioRecordQuestionProps) {
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      chunks.current = [];
      setDuration(0);

      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setPlaying(false);
        setRecorded(true);
        onAnswer({ blobUrl: url, duration });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start();
      setRecording(true);
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Не удалось получить доступ к микрофону');
    }
  }, [onAnswer, duration]);

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  }, []);

  const playRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    }
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 text-center">
      {question.description && (
        <p className="text-text-secondary text-sm">{question.description}</p>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-bg-surface border border-border">
        {recording ? (
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 rounded-full bg-error animate-pulse" />
            <span className="text-text-primary font-mono text-lg">{formatTime(duration)}</span>
            <button
              onClick={stopRecording}
              className="w-12 h-12 rounded-full bg-error text-white flex items-center justify-center hover:bg-error/80 transition-all"
            >
              <Square size={16} fill="white" />
            </button>
          </div>
        ) : recorded ? (
          <div className="flex items-center gap-4">
            <button
              onClick={playRecording}
              disabled={disabled}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all"
            >
              {playing ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="white" />}
            </button>
            <span className="text-text-muted text-sm">{formatTime(duration)}</span>
            <button
              onClick={startRecording}
              disabled={disabled}
              className="text-sm text-primary hover:underline"
            >
              Перезаписать
            </button>
          </div>
        ) : (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all disabled:opacity-40"
          >
            <Mic size={24} />
          </button>
        )}

        {!recording && !recorded && (
          <p className="text-text-muted text-sm">Нажмите на микрофон, чтобы начать запись</p>
        )}
        {recorded && !recording && (
          <p className="text-text-muted text-sm">Запись сохранена. Можно прослушать или перезаписать.</p>
        )}
      </div>
    </div>
  );
}
