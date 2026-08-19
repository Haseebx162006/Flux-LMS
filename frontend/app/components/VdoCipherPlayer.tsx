"use client";

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PlayCircle, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

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

  // Helper to extract 32-character VdoCipher Video ID
  const getVdoCipherId = (url: string): string | null => {
    if (!url) return null;
    
    // Direct 32-hex character ID (e.g. fabacc4e02b20d102e7e668d974e3e85)
    const cleanUrl = url.trim();
    if (/^[a-fA-F0-9]{32}$/.test(cleanUrl)) {
      return cleanUrl;
    }

    // Embed dashboard URL: https://www.vdocipher.com/dashboard/video/embed/fabacc4e02b20d102e7e668d974e3e85
    const dashboardMatch = cleanUrl.match(/\/embed\/([a-fA-F0-9]{32})/);
    if (dashboardMatch) {
      return dashboardMatch[1];
    }

    // Player URL with params or ID
    const playerMatch = cleanUrl.match(/\/v2\/\?.*video=([a-fA-F0-9]{32})/);
    if (playerMatch) {
      return playerMatch[1];
    }

    return null;
  };

  const vdoId = getVdoCipherId(videoUrl);

  useEffect(() => {
    if (!vdoId) return;

    const fetchOtp = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<{ otp?: string; playbackInfo?: string; message?: string }>(`/courses/vdocipher-otp/${vdoId}`);
        if (response.data?.otp && response.data?.playbackInfo) {
          setVdoData({
            otp: response.data.otp,
            playbackInfo: response.data.playbackInfo
          });
        } else {
          setVdoData({
            otp: null,
            playbackInfo: null,
            error: response.data?.message || "VdoCipher OTP authentication in progress."
          });
        }
      } catch (err) {
        console.warn("Could not fetch VdoCipher OTP from backend:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOtp();
  }, [vdoId, videoUrl]);

  // Case 1: Active VdoCipher OTP & PlaybackInfo obtained
  if (vdoId && vdoData.otp && vdoData.playbackInfo) {
    const embedSrc = `https://player.vdocipher.com/v2/?otp=${vdoData.otp}&playbackInfo=${vdoData.playbackInfo}`;
    return (
      <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
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

  // Case 2: VdoCipher Video ID detected (with Direct Embed or Quick Embed fallback)
  if (vdoId) {
    const fallbackEmbed = `https://player.vdocipher.com/v2/?video=${vdoId}`;
    return (
      <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        <iframe
          src={fallbackEmbed}
          className="w-full h-full border-0 absolute inset-0"
          allow="encrypted-media; autoplay; fullscreen"
          allowFullScreen
          title={title || "VdoCipher DRM Player"}
        />
        <div className="absolute top-2 right-2 bg-[#121212]/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-[#f85e00] font-bold flex items-center gap-1 border border-[#f85e00]/30 z-20 pointer-events-none">
          <Lock className="w-3 h-3 text-[#f85e00]" /> VdoCipher Secure Stream
        </div>
      </div>
    );
  }

  // Case 3: Iframe embed link provided directly (VdoCipher, YouTube, Vimeo, etc.)
  if (videoUrl.includes('<iframe') || videoUrl.includes('player.vdocipher.com') || videoUrl.includes('youtube.com') || videoUrl.includes('vimeo.com')) {
    if (videoUrl.includes('<iframe')) {
      return (
        <div 
          className="w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: videoUrl }}
        />
      );
    }
    return (
      <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          src={videoUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="encrypted-media; autoplay; fullscreen"
          allowFullScreen
          title={title || "Secure Video Stream"}
        />
      </div>
    );
  }

  // Case 4: Standard HTML5 Video Player (MP4 / WebM / Cloud Storage)
  return (
    <video
      controls
      autoPlay
      className="w-full h-full object-cover rounded-2xl"
      src={videoUrl}
    >
      Your browser does not support video playback.
    </video>
  );
};
