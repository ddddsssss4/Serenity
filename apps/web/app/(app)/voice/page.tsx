"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { authClient } from '../../../lib/auth-client';

type Status = 'idle' | 'connecting' | 'listening' | 'processing' | 'thinking' | 'responding' | 'error';

const STATUS_LABEL: Record<Status, string> = {
  idle: 'Tap the mic to begin',
  connecting: 'Connecting...',
  listening: 'Listening...',
  processing: 'Understanding your context...',
  thinking: 'Serenity is thinking...',
  responding: 'Serenity is speaking...',
  error: 'Connection error. Try again.',
};

const PROCESSING_TEXTS = ['Understanding your context...', 'Bringing best advice...'];

export default function PersonalVoiceAgent() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'there';

  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [processingTextIndex, setProcessingTextIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0); // for gapless scheduling

  const stopSession = () => {
    setIsListening(false);
    setStatus('idle');
    wsRef.current?.close();
    wsRef.current = null;
    nextPlayTimeRef.current = 0;
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
  };

  // Rotate text when in processing state
  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setProcessingTextIndex(prev => (prev + 1) % PROCESSING_TEXTS.length);
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setProcessingTextIndex(0);
    }
  }, [status]);

  const toggleListen = async () => {
    if (isListening) {
      stopSession();
      setTranscript('');
      return;
    }

    setStatus('connecting');
    setErrorMsg('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      mediaStreamRef.current = stream;

      // Browser automatically sends the better-auth session cookie
      // in the WebSocket upgrade request headers — no token needed in URL
      const socket = new WebSocket(`ws://localhost:3001/api/voice/stream`);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsListening(true);
        setStatus('listening');
        setTranscript('');
        socket.send(JSON.stringify({ type: 'mic_open', lastMessage: 'how are you feeling today' }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data as string);

        if (data.type === 'ready') {
          console.log('✅ Voice WS ready, sessionId:', data.sessionId);
        }

        if (data.type === 'context_loaded') {
          console.log(`✅ Context loaded: ${data.memoryCount} memories`);
          setStatus('listening');
        }

        if (data.type === 'processing') {
          setStatus('processing');
        }

        if (data.type === 'researching') {
          setStatus('thinking');
          console.log('🔍 Firecrawl search:', data.query);
        }

        if (data.type === 'text_delta' && data.delta) {
          setStatus('responding');
          setTranscript(prev => prev + data.delta);
        }

        if (data.type === 'audio' && data.audio_event?.audio_base_64) {
          const playChunk = async (b64: string) => {
            // Ensure AudioContext is alive
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
              // 16kHz matches ElevenLabs default PCM output
              audioContextRef.current = new AudioCtx({ sampleRate: 16000 });
            }
            if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
            }
            const audioCtx = audioContextRef.current;

            // Base64 → raw bytes
            const binary = atob(b64);
            const uint8 = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) uint8[i] = binary.charCodeAt(i);

            let audioBuf: AudioBuffer;

            try {
              // First attempt: try decoding as MP3/AAC/OGG (compressed formats)
              audioBuf = await audioCtx.decodeAudioData(uint8.buffer.slice(0));
              console.log(`🔊 Decoded compressed audio: ${audioBuf.duration.toFixed(2)}s`);
            } catch {
              // Fallback: treat as raw signed 16-bit PCM mono (ElevenLabs default)
              console.log('🔁 Fallback: decoding as raw Int16 PCM...');
              const int16 = new Int16Array(uint8.buffer);
              audioBuf = audioCtx.createBuffer(1, int16.length, 16000);
              const channelData = audioBuf.getChannelData(0);
              for (let i = 0; i < int16.length; i++) {
                channelData[i] = (int16[i] || 0) / 32768; // Int16 → Float32 [-1,1]
              }
              console.log(`🔊 PCM decoded: ${audioBuf.duration.toFixed(2)}s (${int16.length} samples)`);
            }

            const now = audioCtx.currentTime;
            const startAt = Math.max(nextPlayTimeRef.current, now);
            nextPlayTimeRef.current = startAt + audioBuf.duration;

            const source = audioCtx.createBufferSource();
            source.buffer = audioBuf;
            source.connect(audioCtx.destination);
            source.start(startAt);
          };

          // Fire and forget — non-async handler
          playChunk(data.audio_event.audio_base_64).catch(e => console.error('Playback error:', e));
        }

        if (data.type === 'response_complete') {
          setStatus('listening');
          // Keep transcript showing Serenity's last message until user speaks again
        }

        if (data.type === 'voice_disconnected') {
          stopSession();
        }

        if (data.type === 'error') {
          setErrorMsg(data.message || 'Something went wrong.');
          setStatus('error');
          stopSession();
        }
      };

      socket.onerror = () => {
        setErrorMsg('Could not connect to voice server.');
        setStatus('error');
        stopSession();
      };

      socket.onclose = (e) => {
        if (e.code !== 1000) {
          console.warn('WS closed unexpectedly:', e.code, e.reason);
        }
        setIsListening(false);
        setStatus('idle');
      };

      // Setup Web Audio API to capture raw 16kHz PCM
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        
        // Convert Float32 to Int16
        for (let i = 0; i < inputData.length; i++) {
          const val = inputData[i] || 0;
          const s = Math.max(-1, Math.min(1, val));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Convert Int16Array to Base64 manually to avoid large string chunking limits
        const uint8Array = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < uint8Array.byteLength; i++) {
          binary += String.fromCharCode(uint8Array[i] || 0);
        }
        
        socket.send(JSON.stringify({ user_audio_chunk: btoa(binary) }));
      };

      // Connect to a muted gain node to prevent local echoing
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 0;
      
      source.connect(processor);
      processor.connect(gainNode);
      gainNode.connect(audioCtx.destination);

    } catch (err: any) {
      console.error('Mic error:', err);
      if (err?.name === 'NotAllowedError') {
        setErrorMsg('Microphone permission denied. Please allow access in your browser settings.');
      } else {
        setErrorMsg('Could not start voice session. Please try again.');
      }
      setStatus('error');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSession();
  }, []);

  const blobScale = isListening && (status === 'listening' || status === 'responding') ? 'scale(1.18)' : 'scale(1)';
  const blobShadow = status === 'responding'
    ? '0 40px_80px_-15px_rgba(217,154,143,0.8)'
    : '0 30px 60px -15px rgba(217,154,143,0.5)';

  return (
    <main className="h-full relative flex flex-col items-center justify-center p-12 overflow-hidden bg-background">
      {/* Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="visualizer-ring w-[600px] h-[600px] rounded-full border border-primary/5 bg-primary/5 blur-3xl opacity-30"></div>
        <div className="visualizer-ring w-[450px] h-[450px] rounded-full border border-primary/10 bg-primary/10 blur-2xl opacity-20" style={{ animationDelay: '-2s' }}></div>
        <div className="visualizer-ring w-[300px] h-[300px] rounded-full border border-primary/20 bg-primary/20 blur-xl" style={{ animationDelay: '-4s', opacity: status === 'responding' ? 0.5 : 0.15, transition: 'opacity 1s ease' }}></div>
      </div>

      <div className="relative w-full max-w-4xl flex flex-col items-center">
        {/* Morphing Floating Blob */}
        <div
          className="blob w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-[#EABFB9] to-[#D99A8F] flex items-center justify-center relative overflow-hidden"
          style={{
            animation: 'morph 12s linear infinite alternate, float 6s ease-in-out infinite',
            transform: blobScale,
            boxShadow: `0 30px 60px -15px rgba(217,154,143,${status === 'responding' ? '0.8' : '0.5'})`,
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.8s ease',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.7)_0%,_transparent_60%)]"></div>
          <div className="absolute inset-0 shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.08)]"></div>
          {/* Inner pulse rings when responding */}
          {status === 'responding' && (
            <div className="absolute inset-4 rounded-full border border-white/20 animate-ping"></div>
          )}
        </div>

        {/* Status Label */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-secondary/70">
            {(status === 'listening' || status === 'responding' || status === 'thinking' || status === 'processing') && (
              <span className={`w-2 h-2 rounded-full ${(status === 'thinking' || status === 'processing') ? 'bg-amber-400 animate-pulse' : status === 'responding' ? 'bg-tertiary animate-ping' : 'bg-primary animate-pulse'}`}></span>
            )}
            <span className="text-xs font-medium uppercase tracking-widest font-sans">
              {status === 'processing' ? PROCESSING_TEXTS[processingTextIndex] : STATUS_LABEL[status]}
            </span>
          </div>
          {errorMsg && (
            <p className="text-xs text-error font-medium text-center max-w-xs">{errorMsg}</p>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mt-8 text-center max-w-2xl px-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="font-serif text-2xl md:text-3xl text-on-surface leading-relaxed italic opacity-90">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        )}

        {/* Idle Greeting */}
        {!transcript && status === 'idle' && (
          <div className="mt-12 text-center max-w-2xl px-6">
            <p className="font-serif text-2xl md:text-3xl text-on-surface leading-relaxed italic opacity-60">
              {`"Hi ${userName}. I'm here whenever you're ready to talk."`}
            </p>
          </div>
        )}
      </div>

      {/* Floating Controls Dock */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 ml-36">
        <div className="flex items-center gap-8 bg-surface/80 backdrop-blur-2xl p-4 rounded-3xl shadow-[40px_40px_60px_-10px_rgba(28,28,24,0.06)] border border-outline-variant/15 ring-1 ring-white/20">
          {/* Keyboard → Reflection */}
          <Link
            href="/reflection"
            className="w-14 h-14 rounded-full bg-surface-container-high text-primary flex items-center justify-center transition-all hover:bg-surface-container-highest active:scale-95 group shadow-sm"
            title="Switch to text reflection"
            onClick={stopSession}
          >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">keyboard</span>
          </Link>

          {/* Microphone — Primary */}
          <div className="relative">
            {isListening && (
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150 opacity-30"></div>
            )}
            <button
              onClick={toggleListen}
              disabled={status === 'connecting'}
              className="w-20 h-20 rounded-full bg-gradient-to-b from-primary to-primary-container text-on-primary flex items-center justify-center shadow-2xl shadow-primary/40 relative z-10 hover:scale-105 transition-all active:scale-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'connecting' ? (
                <svg className="animate-spin w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: isListening ? "'FILL' 1" : "'FILL' 0" }}>
                  {isListening ? 'mic' : 'mic_off'}
                </span>
              )}
            </button>
          </div>

          {/* Volume / Mute */}
          <button className="w-14 h-14 rounded-full bg-surface-container-high text-primary flex items-center justify-center transition-all hover:bg-surface-container-highest active:scale-95 group shadow-sm" title="Volume">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">volume_up</span>
          </button>
        </div>
      </div>

      {/* Contextual hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 ml-36 opacity-30 hover:opacity-100 transition-opacity cursor-default hidden md:block">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-on-surface font-sans">
          {isListening ? 'Tap mic to pause session' : 'Tap mic to start'}
        </p>
      </div>

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-150 mix-blend-multiply z-[100]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3T3wFtOWPS8L9heCC9-maHgDS7plg7M_lUy0l2epKYCqWty-RMqez4Xp9x5m_bVfqPiuyPiGmjUX0ghVPVOquL3xmyE2FnP5wT7rSh8uyLjs7rOmNg3kHmxnKnN3ysO82b7Re6XBTnZL3yInXQzYgqEICkAEFQmOiPtC3GVhKJqQ1pDfHAy6N_VSNFWowxlhXkH3q762wCfDc9HD6x7J9y-DOQ64R0WwTdSikqNtqz4-eTGEWE5yYCJB6qGSpuS82-jo7Qezyv1yn')" }}></div>
    </main>
  );
}
