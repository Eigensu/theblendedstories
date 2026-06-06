export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: `
          linear-gradient(0deg, rgba(0,0,0,0.78), rgba(0,0,0,0.78)),
          url('/hero-bg.jpg') center/cover no-repeat
        `,
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        zIndex: 2,
        padding: '0 20px',
        textAlign: 'center',
      }}>

        {/* Sunburst icon */}
        <div style={{ marginBottom: '28px', animation: 'fadeUp 0.8s ease-out 0.1s both' }}>
          <img
            src="/sunburst-icon.png"
            alt=""
            style={{ width: 'clamp(60px, 16vw, 130px)', height: 'auto', mixBlendMode: 'screen', display: 'block' }}
          />
        </div>

        {/* Headline — exact Figma spec */}
        <h1
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontVariationSettings: "'opsz' 18",
            fontSize: 'clamp(30px, 8vw, 72px)',
            fontWeight: 400,
            fontStyle: 'normal',
            lineHeight: '120%',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
            margin: 0,
            animation: 'fadeUp 0.8s ease-out 0.3s both',
          }}
        >
          The Blended Stories
        </h1>

        {/* Subtitle — exact Figma spec */}
        <p
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontVariationSettings: "'opsz' 18",
            fontSize: 'clamp(18px, 4.5vw, 32px)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: '120%',
            letterSpacing: '0',
            color: 'white',
            marginTop: '16px',
            animation: 'fadeUp 0.8s ease-out 0.5s both',
          }}
        >
          Explore the stories that define your city.
        </p>

        {/* SUBSCRIBE NOW button */}
        <div style={{ marginTop: '48px', animation: 'fadeUp 0.8s ease-out 0.7s both' }}>
          <a
            href="#newsletter"
            className="btn-pill btn-pill-large"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontVariationSettings: "'opsz' 18",
              fontSize: '18px',
              fontWeight: 400,
              letterSpacing: '0.1em',
            }}
          >
            SUBSCRIBE NOW
          </a>
        </div>
      </div>
    </section>
  );
}
