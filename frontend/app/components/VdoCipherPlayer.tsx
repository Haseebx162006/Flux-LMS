"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { PlayCircle, ShieldCheck, Lock, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

interface VdoCipherPlayerProps {
  videoUrl: string;
  title?: string;
}

export const VdoCipherPlayer: React.FC<VdoCipherPlayerProps> = ({ videoUrl, title }) => {
  const [vdoData, setVdoData] = useState<{ otp: string | null; playbackInfo: string | null; error?: string }>({
    otp: null,
    playbackInfo: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Helper to extract 32-character VdoCipher Video ID from any input
  const getVdoCipherId = useCallback((url: string): string | null => {
    if (!url) return null;
    const cleanUrl = url.trim();

    // 1. Check if base64 playbackInfo parameter is present (from dashboard embed snippet)
    const playbackMatch = cleanUrl.match(/playbackInfo=([a-zA-Z0-9_\-+/=]+)/);
    if (playbackMatch && playbackMatch[1]) {
      try {
        const decoded = atob(decodeURIComponent(playbackMatch[1]));
        const parsed = JSON.parse(decoded);
        if (parsed.videoId && /^[a-fA-F0-9]{32}$/.test(parsed.videoId)) {
          return parsed.videoId.toLowerCase();
        }
      } catch {
        // Continue to other patterns
      }
    }

    // 2. Direct 32-hex character ID (e.g. fabacc4e02b20d102e7e668d974e3e85)
    if (/^[a-fA-F0-9]{32}$/.test(cleanUrl)) {
      return cleanUrl.toLowerCase();
    }

    // 3. Extract 32-hex ID from any VdoCipher URL or general string
    const hexMatch = cleanUrl.match(/\b([a-fA-F0-9]{32})\b/);
    if (hexMatch && hexMatch[1]) {
      return hexMatch[1].toLowerCase();
    }

    return null;
  }, []);

  const vdoId = getVdoCipherId(videoUrl);

  const fetchOtp = useCallback(async () => {
    if (!vdoId) return;

    setIsLoading(true);
    setVdoData({ otp: null, playbackInfo: null, error: undefined });

    try {
      const response = await api.get<{ otp?: string; playbackInfo?: string; message?: string }>(
        `/courses/vdocipher-otp/${vdoId}`
      );

      if (response.data?.otp && response.data?.playbackInfo) {
        setVdoData({
          otp: response.data.otp,
          playbackInfo: response.data.playbackInfo
        });
      } else {
        setVdoData({
          otp: null,
          playbackInfo: null,
          error: response.data?.message || "VdoCipher OTP could not be generated for this video ID."
        });
      }
    } catch (err: any) {
      console.warn("Could not fetch VdoCipher OTP from backend:", err);
      const message = err?.response?.data?.message || err?.message || "Failed to contact LMS backend or VdoCipher API.";
      setVdoData({
        otp: null,
        playbackInfo: null,
        error: message
      });
    } finally {
      setIsLoading(false);
    }
  }, [vdoId]);

  useEffect(() => {
    if (vdoId) {
      fetchOtp();
    }
  }, [vdoId, retryCount, fetchOtp]);

  // Case 1: VdoCipher Video ID detected & Active OTP + PlaybackInfo loaded
  if (vdoId && vdoData.otp && vdoData.playbackInfo) {
    const embedSrc = `https://player.vdocipher.com/v2/?otp=${encodeURIComponent(vdoData.otp)}&playbackInfo=${encodeURIComponent(vdoData.playbackInfo)}`;
    return (
      <div className="relative w-full h-full min-h-[320px] bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          src={embedSrc}
          className="w-full h-full border-0 absolute inset-0"
          allow="encrypted-media; autoplay; fullscreen"
          allowFullScreen
          title={title || "VdoCipher Secure DRM Player"}
        />
        <div className="absolute top-2 right-2 bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#f85e00] font-bold flex items-center gap-1 border border-[#f85e00]/30 z-20 pointer-events-none">
          <ShieldCheck className="w-3 h-3 text-[#f85e00]" /> VdoCipher DRM Encrypted
        </div>
      </div>
    );
  }

  // Case 2: VdoCipher Video ID detected - Loading State
  if (vdoId && isLoading) {
    return (
      <div className="relative w-full h-full min-h-[320px] bg-[#121212] rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#f85e00]/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#f85e00] animate-spin" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-4 h-4 text-[#f85e00]" />
          </div>
        </div>
        <div className="space-y-1 max-w-sm">
          <h4 className="text-white font-extrabold text-sm">Securing VdoCipher DRM Stream</h4>
          <p className="text-xs text-[#a8a59b]">
            Requesting encrypted one-time playback token for <span className="font-mono text-[#f85e00] font-semibold">{vdoId.slice(0, 8)}...</span>
          </p>
        </div>
      </div>
    );
  }

  // Case 3: VdoCipher Video ID detected - Error State
  if (vdoId && vdoData.error) {
    return (
      <div className="relative w-full h-full min-h-[320px] bg-[#1a1311] border border-rose-900/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/30">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h4 className="text-white font-extrabold text-sm">VdoCipher Playback Failed</h4>
          <p className="text-xs text-rose-300/80 leading-relaxed font-mono">
            {vdoData.error}
          </p>
          <p className="text-[11px] text-[#a8a59b] pt-1">
            Video ID: <span className="font-mono text-white font-bold">{vdoId}</span>
          </p>
        </div>
        <button
          onClick={() => setRetryCount((prev) => prev + 1)}
          className="px-4 py-2 rounded-xl bg-[#f85e00] hover:bg-[#e05500] text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry Playback
        </button>
      </div>
    );
  }

  // Case 4: Iframe embed string or direct provider URL (YouTube, Vimeo, etc.)
  if (videoUrl && (videoUrl.includes('<iframe') || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com') || videoUrl.includes('player.vdocipher.com'))) {
    if (videoUrl.includes('<iframe')) {
      return (
        <div 
          className="w-full h-full min-h-[320px] rounded-2xl overflow-hidden bg-black flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: videoUrl }}
        />
      );
    }

    // Convert standard YouTube watch URLs to embed URLs
    let formattedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const ytId = videoUrl.split('watch?v=')[1]?.split('&')[0];
      if (ytId) formattedUrl = `https://www.youtube.com/embed/${ytId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const ytId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (ytId) formattedUrl = `https://www.youtube.com/embed/${ytId}`;
    } else if (videoUrl.includes('vimeo.com/') && !videoUrl.includes('player.vimeo.com')) {
      const vimeoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      if (vimeoId) formattedUrl = `https://player.vimeo.com/video/${vimeoId}`;
    }

    return (
      <div className="relative w-full h-full min-h-[320px] bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          src={formattedUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="encrypted-media; autoplay; fullscreen"
          allowFullScreen
          title={title || "Secure Video Stream"}
        />
      </div>
    );
  }

  // Case 5: Direct Video Link (MP4 / WebM / Cloud Storage)
  if (videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.startsWith('http'))) {
    return (
      <video
        controls
        autoPlay
        className="w-full h-full min-h-[320px] object-cover rounded-2xl bg-black"
        src={videoUrl}
      >
        Your browser does not support video playback.
      </video>
    );
  }

  // Case 6: No valid video URL provided
  return (
    <div className="w-full h-full min-h-[320px] bg-[#121212] rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2">
      <PlayCircle className="w-12 h-12 text-[#5a5955]" />
      <p className="text-sm font-extrabold text-white">No Video Source Attached</p>
      <p className="text-xs text-[#a8a59b]">Attach a VdoCipher Video ID or media URL to start watching.</p>
    </div>
  );
};

