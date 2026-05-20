import ScrollReveal from './ScrollReveal';

const speakers = [
  {
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=616&q=80',
    event: 'The Future of Fashion',
    body: 'An intimate conversation with the designers and tastemakers reshaping the fashion industry for a new generation of consumers.',
  },
  {
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=616&q=80',
    event: 'City & Culture',
    body: 'Exploring how urban spaces inspire creativity and how our cities become living canvases for cultural expression and community identity.',
  },
  {
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=616&q=80',
    event: 'The Art of Storytelling',
    body: "A masterclass with leading journalists, filmmakers, and authors on the craft of narrative and its power to change minds and move hearts.",
  },
  {
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=616&q=80',
    event: 'Beauty Redefined',
    body: "Challenging industry standards and celebrating diversity — a candid dialogue on beauty, self-expression, and the wellness revolution.",
  },
];

export default function TBSTalks() {
  return (
    <section
      id="talks"
      style={{
        width: '100%',
        padding: 'var(--py-section) var(--px-page)',
        background: `
          linear-gradient(180deg, #000000 0%, rgba(0,0,0,0) 30%),
          linear-gradient(0deg, rgba(0,0,0,0.80), rgba(0,0,0,0.80)),
          url('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1440&q=80') center/cover no-repeat
        `,
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1352px', margin: '0 auto' }}>
        <ScrollReveal>
          <h2 style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'var(--fs-section)',
            fontWeight: 400,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'white',
            textAlign: 'center',
            marginBottom: '60px',
          }}>
            TBS Talks
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[44px] w-full justify-items-center">
          {speakers.map((speaker, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div style={{ width: '100%' }}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '50%', overflow: 'hidden' }}>
                  <img src={speaker.img} alt={speaker.event}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ width: '100%', height: '1px', background: 'var(--white-20)', margin: '24px 0 20px' }} />
                <h3 style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontSize: 'clamp(18px, 2.2vw, 32px)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'white',
                  lineHeight: '120%',
                  marginBottom: '12px',
                }}>
                  {speaker.event}
                </h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'var(--fs-body)',
                  lineHeight: '160%',
                  color: 'white',
                }}>
                  {speaker.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
            <a href="#" className="btn-pill btn-pill-view">
              VIEW ALL <span className="btn-separator" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
