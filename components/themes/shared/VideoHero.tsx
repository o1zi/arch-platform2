'use client'

import { useState, useRef } from 'react'
import { Play, Pause, VolumeX, Volume2 } from 'lucide-react'

interface VideoHeroProps {
  videoUrl: string          // رابط YouTube أو Vimeo أو mp4 مباشر
  overlayOpacity?: number   // 0-1
  className?: string
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

export function VideoHero({ videoUrl, overlayOpacity = 0.5, className = '' }: VideoHeroProps) {
  const ytId = getYouTubeId(videoUrl)
  const vmId = getVimeoId(videoUrl)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(p => !p)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(m => !m)
  }

  if (ytId) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 scale-110">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; fullscreen"
            className="w-full h-full"
            style={{ border: 'none', pointerEvents: 'none' }}
            title="background video"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      </div>
    )
  }

  if (vmId) {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 scale-110">
          <iframe
            src={`https://player.vimeo.com/video/${vmId}?autoplay=1&muted=1&loop=1&background=1`}
            allow="autoplay; fullscreen"
            className="w-full h-full"
            style={{ border: 'none', pointerEvents: 'none' }}
            title="background video"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      </div>
    )
  }

  // mp4 مباشر
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      />
      {/* أدوات التحكم */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 z-10">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

// مكوّن مصغّر للفيديو في قسم منفصل (ليس خلفية)
interface VideoSectionProps {
  videoUrl: string
  title?: string
  description?: string
  accentColor?: string
  bgColor?: string
  textColor?: string
}

export function VideoSection({ videoUrl, title, description, accentColor = '#3b82f6', bgColor = '#0f0f0f', textColor = '#ffffff' }: VideoSectionProps) {
  const ytId = getYouTubeId(videoUrl)
  const vmId = getVimeoId(videoUrl)
  const [showVideo, setShowVideo] = useState(false)

  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
    : vmId
      ? `https://player.vimeo.com/video/${vmId}?autoplay=1`
      : null

  if (!embedUrl && !videoUrl.includes('.mp4')) return null

  return (
    <section className="py-20 px-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-5xl mx-auto" dir="rtl">
        {(title || description) && (
          <div className="text-center mb-10">
            {title && <h2 className="text-3xl font-black mb-4" style={{ color: textColor }}>{title}</h2>}
            {description && <p className="text-base opacity-60" style={{ color: textColor }}>{description}</p>}
          </div>
        )}

        <div className="relative aspect-video rounded-xl overflow-hidden" style={{ backgroundColor: '#000' }}>
          {!showVideo ? (
            /* Thumbnail / Play button */
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center group w-full"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: accentColor }}
              >
                <Play className="w-8 h-8 text-white fill-white mr-[-4px]" />
              </div>
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
            </button>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
              title="video"
            />
          ) : (
            <video src={videoUrl} controls autoPlay className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
      </div>
    </section>
  )
}
