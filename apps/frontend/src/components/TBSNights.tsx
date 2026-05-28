import ScrollReveal from './ScrollReveal';

export default function TBSNights() {
  return (
    <section
      id="nights"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(500px, 60vh, 720px)',
        overflow: 'hidden',
        background: `
          linear-gradient(90deg, rgba(5,13,24,0) 50%, rgba(5,13,24,0.40) 100%),
          linear-gradient(0deg, rgba(0,0,0,0.60), rgba(0,0,0,0.60)),
          url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1440&q=80') center/cover no-repeat
        `,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="flex w-full justify-end max-w-[1440px] mx-auto"
        style={{ padding: 'var(--py-section) var(--px-page)' }}
      >
        <ScrollReveal>
          <div
            className="nights-content"
            style={{
              maxWidth: '540px',
              textAlign: 'right',
            }}
          >
            <h2 style={{
              fontFamily: 'var(--font-bodoni), serif',
              fontSize: 'var(--fs-section)',
              fontWeight: 400,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'white',
              lineHeight: '120%',
            }}>
              TBS Nights
            </h2>

            <p style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              fontWeight: 500,
              color: 'white',
              marginTop: '24px',
            }}>
              Jan 03, 2030
            </p>

            <p style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              fontWeight: 500,
              color: 'white',
              marginTop: '8px',
            }}>
              Andheri (W), Mumbai, 400001
            </p>

            <p style={{
              fontFamily: 'var(--font-martel-sans), sans-serif',
              fontSize: 'clamp(24px, 3vw, 40px)',
              textTransform: 'uppercase',
              color: 'white',
              marginTop: '32px',
              lineHeight: '120%',
            }}>
              Lorem ipsum dolor sit
            </p>

            <p style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: 'var(--fs-body)',
              lineHeight: '160%',
              color: 'white',
              marginTop: '32px',
            }}>
              An evening where art, culture, and conversation converge. TBS Nights is our flagship event series bringing together the city&apos;s creative class for an unforgettable night of curated experiences, performances, and connections.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#" className="btn-pill btn-pill-join">JOIN NOW</a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
