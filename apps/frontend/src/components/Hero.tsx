'use client';

export default function Hero({ data }: { data?: any }) {
  const desktopVideoUrl = data?.video_desktop_url || "/Logo Animation 1920x1080 Wider Screens.mp4";
  const mobileVideoUrl = data?.video_mobile_url || "/Logo Animation Mobile Screen.mp4";

  return (
    <>
      <section
        id="hero"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* Background video — desktop (≥768px) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video-desktop"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            zIndex: 0,
          }}
        >
          <source src={desktopVideoUrl} type="video/mp4" />
        </video>

        {/* Background video — mobile (<768px) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video-mobile"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            zIndex: 0,
          }}
        >
          <source src={mobileVideoUrl} type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 1,
        }} />
      </section>
    </>
  );
}
