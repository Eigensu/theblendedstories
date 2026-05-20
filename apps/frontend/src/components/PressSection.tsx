import ScrollReveal from './ScrollReveal';

const pressItems = [
  {
    category: 'Press',
    date: 'Jan 03, 2030',
    headline: 'THE BLENDED STORIES LAUNCHES ITS MOST AMBITIOUS EDITORIAL SEASON YET',
    offset: false,
  },
  {
    category: 'Press',
    date: 'Feb 12, 2030',
    headline: 'HOW TBS IS REDEFINING CULTURAL JOURNALISM IN THE DIGITAL AGE',
    offset: true,
  },
  {
    category: 'Press',
    date: 'Mar 20, 2030',
    headline: 'TBS NIGHTS SELLS OUT ACROSS THREE CITIES IN UNDER FORTY-EIGHT HOURS',
    offset: false,
  },
];

export default function PressSection() {
  return (
    <section
      id="press"
      style={{
        width: '100%',
        background: 'var(--black)',
        padding: 'var(--py-section) var(--px-page)',
      }}
    >
      <div style={{ maxWidth: '1352px', margin: '0 auto' }}>
        <div className="h-divider" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[44px] press-grid" style={{ paddingTop: '60px' }}>
          {pressItems.map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div style={{ paddingTop: item.offset ? 'clamp(0px, 3vw, 50px)' : '0' }}>
                <div style={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontSize: 'clamp(16px, 1.5vw, 20px)',
                  fontStyle: 'italic',
                  color: 'white',
                  marginBottom: '16px',
                }}>
                  {item.category} — {item.date}
                </div>

                <h3 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(16px, 2vw, 24px)',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: 'white',
                  lineHeight: '160%',
                }}>
                  {item.headline}
                </h3>

                <div style={{
                  width: '100%',
                  maxWidth: '340px',
                  height: '1px',
                  background: 'var(--white-20)',
                  marginTop: '40px',
                }} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
