export default function EditorialNote({ note }: { note: string }) {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <div style={{ borderLeft: '2px solid #f5f4f0', background: '#141412', padding: '32px 36px', margin: '0 0 48px' }}>
        <span style={{ display: 'block', fontFamily: "'Poppins', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a3a19b', marginBottom: '14px', fontWeight: 600 }}>
          Editor's Note
        </span>
        <p style={{ margin: 0, fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '19px', lineHeight: 1.7, color: '#e7e6e1' }}>
          {note}
        </p>
      </div>
    </div>
  );
}
