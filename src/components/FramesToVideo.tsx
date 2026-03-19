import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Video, Upload, Play, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function FramesToVideo() {
  const [startFrame, setStartFrame] = useState<string | null>(null);
  const [endFrame, setEndFrame] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'start') setStartFrame(reader.result as string);
        else setEndFrame(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateVideo = async () => {
    if (!startFrame) return;
    
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setStatus('Initializing Gemini Veo...');

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      
      const startBase64 = startFrame.split(',')[1];
      const endBase64 = endFrame ? endFrame.split(',')[1] : null;

      setStatus('Sending request to Veo...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'A smooth cinematic transition between these two frames',
        image: {
          imageBytes: startBase64,
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9',
          ...(endBase64 ? { lastFrame: { imageBytes: endBase64, mimeType: 'image/png' } } : {})
        }
      });

      setStatus('Generating video (this may take a few minutes)...');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        // Update status messages to keep user engaged
        const messages = [
          'Analyzing frames...',
          'Synthesizing motion...',
          'Rendering textures...',
          'Finalizing video...',
          'Almost there...'
        ];
        setStatus(messages[Math.floor(Math.random() * messages.length)]);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error('Failed to get video download link');

      setStatus('Downloading video...');
      
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey || '',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setHasApiKey(false);
          throw new Error('API Key session expired. Please select your key again.');
        }
        throw new Error('Failed to download video');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatus('Generation complete!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during video generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasApiKey === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-surface-high rounded-3xl border border-primary/10">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Video size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-4 font-display">Video Generation Requires a Paid API Key</h2>
        <p className="text-on-surface-variant max-w-md mb-8">
          To use Gemini Veo for video generation, you must select a paid Google Cloud project API key.
          Billing must be enabled on your Google Cloud project.
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={handleOpenSelectKey}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Select API Key
          </button>
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Learn about Gemini API billing
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface font-display">Frames to Video</h2>
        <p className="text-on-surface-variant">Generate cinematic transitions using Gemini Veo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Frame */}
        <div className="relative aspect-video bg-surface-high rounded-3xl border-2 border-dashed border-primary/20 overflow-hidden group">
          {startFrame ? (
            <>
              <img src={startFrame} alt="Start frame" className="w-full h-full object-cover" />
              <button 
                onClick={() => setStartFrame(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => startInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload size={24} className="text-primary" />
              </div>
              <span className="font-medium text-on-surface-variant">Upload Start Frame</span>
            </button>
          )}
          <input 
            type="file" 
            ref={startInputRef} 
            onChange={(e) => handleFileChange(e, 'start')} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* End Frame */}
        <div className="relative aspect-video bg-surface-high rounded-3xl border-2 border-dashed border-primary/20 overflow-hidden group">
          {endFrame ? (
            <>
              <img src={endFrame} alt="End frame" className="w-full h-full object-cover" />
              <button 
                onClick={() => setEndFrame(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => endInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 hover:bg-primary/5 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload size={24} className="text-primary" />
              </div>
              <span className="font-medium text-on-surface-variant">Upload End Frame (Optional)</span>
            </button>
          )}
          <input 
            type="file" 
            ref={endInputRef} 
            onChange={(e) => handleFileChange(e, 'end')} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      <div className="bg-surface-high p-6 rounded-3xl border border-primary/10 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant ml-1">Prompt (Optional)</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the motion or transition (e.g., 'A slow zoom into the horizon with lens flare')"
            className="w-full bg-surface px-4 py-3 rounded-2xl border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24"
          />
        </div>

        <button
          onClick={generateVideo}
          disabled={!startFrame || isGenerating}
          className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3"
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Play size={20} />
              <span>Generate Video</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-primary/10 text-primary rounded-2xl border border-primary/20"
          >
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm font-medium">{status}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 bg-error/10 text-error rounded-2xl border border-error/20"
          >
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 size={20} />
              <span className="font-bold">Video Generated Successfully!</span>
            </div>
            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full"
              />
            </div>
            <div className="flex justify-end">
              <a 
                href={videoUrl} 
                download="generated-video.mp4"
                className="text-primary font-medium hover:underline flex items-center gap-2"
              >
                Download Video
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
