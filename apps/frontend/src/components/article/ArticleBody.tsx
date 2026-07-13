export default function ArticleBody({ content, isIntro = false }: { content: string[], isIntro?: boolean }) {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: isIntro ? 'clamp(40px, 8vw, 96px) clamp(20px, 4vw, 32px) 0' : '0 clamp(20px, 4vw, 32px)' }}>
      {content.map((paragraph, index) => {
        if (isIntro && index === 0) {
          return (
            <p key={index} style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(20px, 4vw, 26px)', lineHeight: 1.6, color: '#e7e6e1', margin: '0 0 clamp(24px, 4vw, 40px)' }}>
              {paragraph}
            </p>
          );
        }
        return (
          <p key={index} style={{ fontFamily: "'Public Sans', sans-serif", fontSize: 'clamp(16px, 2.5vw, 18px)', lineHeight: 1.9, color: '#c9c8c3', margin: '0 0 clamp(20px, 3vw, 28px)' }}>
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}
