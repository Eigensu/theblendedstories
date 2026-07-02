'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function SuccessModal({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      padding: '20px',
    }}>
      <div className="tbs-nights-success" style={{
        boxShadow: '0 0 80px rgba(0,0,0,0.8)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>

        {/* Left: content */}
        <div style={{
          flex: '0 0 55%',
          background: '#0c0c0c',
          padding: 'clamp(28px, 4vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: 0 }}>TBS</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: 0 }}>NIGHTS</p>
            </div>
            <div style={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
              padding: '5px 14px',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '8px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
            }}>
              BEYOND THE FEED
            </div>
          </div>

          {/* Main heading */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 400,
              color: 'white',
              textTransform: 'uppercase',
              lineHeight: '1.1',
              margin: '0 0 4px 0',
              letterSpacing: '0.02em',
            }}>
              YOU&apos;RE ON
            </h2>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(26px, 3.8vw, 42px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'white',
              margin: 0,
              lineHeight: '1.1',
            }}>
              our list
            </p>
          </div>

          {/* Subheading */}
          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            margin: '0 0 16px 0',
          }}>
            THANK YOU FOR APPLYING<br />TO TBS NIGHTS.
          </p>

          {/* Body text */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', margin: '0 0 14px 0' }}>
              We&apos;re currently reviewing applications and carefully curating our next gathering. Every guest is selected with intention to create a table that&apos;s as interesting as the conversations around it.
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', margin: '0 0 14px 0' }}>
              If selected, you&apos;ll receive an invitation from us soon.
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', margin: '0 0 20px 0' }}>
              We look forward to possibly sharing a table with you.
            </p>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 28px 0' }}>
              — The Blended Stories
            </p>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 4px 0' }}>
              UNTIL THEN,
            </p>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '18px', color: 'rgba(255,255,255,0.55)', margin: '0 0 20px 0' }}>
              we&apos;ll be in touch.
            </p>
            <button
              onClick={onBack}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                border: '1px solid rgba(255,255,255,0.35)',
                background: 'transparent', color: 'white',
                padding: '12px 0',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '10px', letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
            >
              BACK TO TBS →
            </button>
          </div>
        </div>

        {/* Right: image */}
        <div className="tbs-nights-success-img" style={{
          flex: '0 0 45%',
          backgroundImage: `url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(80,30,0,0.35)' }} />
        </div>

      </div>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.18)',
  color: 'white',
  fontFamily: "'Poppins', sans-serif",
  fontSize: 'clamp(13px, 1.1vw, 15px)',
  padding: '9px 0',
  outline: 'none',
  boxSizing: 'border-box',
};

const lbl: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 'clamp(13px, 1.05vw, 15px)',
  fontWeight: 600,
  color: 'white',
  display: 'block',
  marginBottom: '10px',
  lineHeight: '1.4',
};

const secHead: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  margin: '0 0 6px 0',
};

const secSub: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 'clamp(12px, 1vw, 14px)',
  color: 'rgba(255,255,255,0.4)',
  margin: '0 0 28px 0',
};

function F({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}{req && <span style={{ color: 'rgba(255,255,255,0.35)', marginLeft: '3px' }}>*</span>}</label>
      {children}
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="form-two-col">{children}</div>;
}

function RatingScale({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="rating-row">
      <span className="rating-endlabel">Not me at all</span>
      <div className="rating-dots">
        {[1, 2, 3, 4, 5].map(n => {
          const filled = !!value && n < value;
          const selected = n === value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="rating-dot"
              style={{
                background: selected ? 'white' : filled ? 'rgba(255,255,255,0.14)' : 'transparent',
                borderColor: selected ? 'white' : filled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.16)',
                color: selected ? 'black' : filled ? 'white' : 'rgba(255,255,255,0.5)',
                borderWidth: '1px', borderStyle: 'solid',
                fontWeight: selected ? 600 : 500,
                transform: selected ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <span className="rating-endlabel right">Completely me</span>
    </div>
  );
}

function VibeQ({
  n, label, value, onChange,
}: { n: number; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <span style={{
          fontFamily: "'Fraunces', serif", fontStyle: 'italic',
          fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4', flexShrink: 0,
        }}>{String(n).padStart(2, '0')}</span>
        <span style={{ ...lbl, marginBottom: 0 }}>{label}</span>
      </div>
      <RatingScale value={value} onChange={onChange} />
    </div>
  );
}

const DINNER_TABLE_OPTIONS = [
  'The storyteller.',
  'The listener.',
  'The one asking all the questions.',
  'The one making everyone laugh.',
  'The one introducing people.',
  'The one discovering the next restaurant.',
  'The one who stays until the lights come on.',
];

const STEPS = [
  { label: 'About you' },
  { label: 'Your vibe' },
  { label: 'A little extra' },
];

function StepList({ current }: { current: number }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '26px',
      marginTop: '36px', flexShrink: 0,
    }}>
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 600,
              background: active ? 'white' : 'transparent',
              color: active ? 'black' : done ? 'white' : 'rgba(255,255,255,0.35)',
              border: active ? '1px solid white' : done ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.18)',
            }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{
              fontFamily: "'Poppins', sans-serif", fontSize: '14px',
              fontWeight: active ? 600 : 500,
              color: active ? 'white' : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
            }}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function TBSNightsPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', age: '', occupation: '', city: '', instagram: '',
    vibe1: 0, vibe2: 0, vibe3: 0, vibe4: 0, vibe5: 0, vibe6: 0, vibe7: 0,
    somethingElse: '', dinnerTable: '',
    updates: false,
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const setVibe = (key: keyof typeof form) => (v: number) => setForm(f => ({ ...f, [key]: v }));

  const fieldCol: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  };

  const aboutValid = !!(form.fullName && form.age && form.occupation && form.city);
  const canContinue = step === 0 ? aboutValid : true;
  const isLastStep = step === STEPS.length - 1;

  const nextBtnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    border: 'none',
    background: canContinue ? '#EDE9E1' : 'rgba(237,233,225,0.25)',
    color: 'black',
    padding: '13px 28px',
    borderRadius: '4px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.02em',
    cursor: canContinue ? 'pointer' : 'not-allowed',
    transition: 'opacity 0.2s',
  };

  return (
    <>
    {submitted && <SuccessModal onBack={() => router.push('/')} />}
    <form
      onSubmit={e => {
        e.preventDefault();
        if (isLastStep) setSubmitted(true);
      }}
      className="tbs-nights-form"
    >

      {/* ── Sidebar ── */}
      <div className="tbs-wizard-sidebar">
        <button
          type="button"
          onClick={() => router.push('/')}
          style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '10px', letterSpacing: '0.14em',
            textTransform: 'uppercase', cursor: 'pointer',
            padding: 0, marginBottom: '20px', alignSelf: 'flex-start',
            flexShrink: 0,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          ← Back
        </button>

        <p style={{
          fontFamily: "'Poppins', sans-serif", fontSize: '10px',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)', margin: '0 0 20px 0',
          flexShrink: 0,
        }}>TBS NIGHTS</p>

        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 'clamp(26px, 2.6vw, 36px)',
          fontWeight: 400, color: 'white', lineHeight: '1.15',
          textTransform: 'uppercase', margin: '0 0 20px 0',
          flexShrink: 0,
        }}>
          CURATED DINNERS.<br />MEANINGFUL<br />CONVERSATIONS.
        </h1>

        <p style={{
          fontFamily: "'Poppins', sans-serif", fontSize: '13px',
          color: 'rgba(255,255,255,0.55)', lineHeight: '1.7', margin: '0 0 14px 0',
          flexShrink: 0,
        }}>
          TBS Nights is an invite-only dinner series that brings together inspiring people for intentional evenings of great food and even better conversation.
        </p>
        <p style={{
          fontFamily: "'Poppins', sans-serif", fontSize: '13px',
          color: 'rgba(255,255,255,0.35)', lineHeight: '1.7', margin: 0,
          flexShrink: 0,
        }}>
          Apply below to be considered for our upcoming gathering.
        </p>

        <StepList current={step} />
      </div>

      {/* ── Main ── */}
      <div className="tbs-wizard-main">
        <div className="tbs-wizard-content">

          {step === 0 && (
            <div className="form-col">
              <p style={secHead}>SECTION 1 — ABOUT YOU</p>
              <p style={secSub}>The basics, so we know who we&apos;d be seating.</p>
              <div style={fieldCol}>
                <F label="Full name" req>
                  <input style={inp} placeholder="Your answer" value={form.fullName} onChange={set('fullName')} required />
                </F>
                <TwoCol>
                  <F label="Age" req>
                    <input type="number" min={0} style={inp} placeholder="Your answer" value={form.age} onChange={set('age')} required />
                  </F>
                  <F label="Occupation" req>
                    <input style={inp} placeholder="Your answer" value={form.occupation} onChange={set('occupation')} required />
                  </F>
                </TwoCol>
                <F label="City" req>
                  <input style={inp} placeholder="Your answer" value={form.city} onChange={set('city')} required />
                </F>
                <F label="Instagram handle">
                  <input style={inp} placeholder="@yourhandle" value={form.instagram} onChange={set('instagram')} />
                </F>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-col">
              <p style={secHead}>SECTION 2 — YOUR VIBE</p>
              <p style={secSub}>Seven quick reads. Go with your gut.</p>
              <div style={{ ...fieldCol, gap: '0' }}>
                <VibeQ n={1} label="I enjoy conversations that leave me thinking long after the evening ends." value={form.vibe1} onChange={setVibe('vibe1')} />
                <VibeQ n={2} label="I'd rather meet five interesting strangers than spend another evening with the same group." value={form.vibe2} onChange={setVibe('vibe2')} />
                <VibeQ n={3} label="I naturally make people around me feel comfortable." value={form.vibe3} onChange={setVibe('vibe3')} />
                <VibeQ n={4} label="I'm curious about people whose lives, careers or perspectives are completely different from mine." value={form.vibe4} onChange={setVibe('vibe4')} />
                <VibeQ n={5} label="I enjoy beautiful spaces, thoughtful food and experiences where every detail feels intentional." value={form.vibe5} onChange={setVibe('vibe5')} />
                <VibeQ n={6} label="The best nights usually happen when nothing is over-planned." value={form.vibe6} onChange={setVibe('vibe6')} />
                <VibeQ n={7} label="I leave social gatherings feeling more energised than exhausted." value={form.vibe7} onChange={setVibe('vibe7')} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-col">
              <p style={secHead}>SECTION 3 — A LITTLE EXTRA</p>
              <p style={secSub}>Optional, but this is often what gets you a seat.</p>
              <div style={fieldCol}>
                <F label="Tell us something we'd never guess about you.">
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', margin: '-4px 0 12px 0' }}>
                    A favourite restaurant, an unusual hobby, your latest obsession or anything that gives us a better sense of who you are.
                  </p>
                  <textarea rows={3} style={{ ...inp, resize: 'none' }} placeholder="Your answer" value={form.somethingElse} onChange={set('somethingElse')} />
                </F>

                <div>
                  <label style={lbl}>Which dinner table sounds most like you?</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                    {DINNER_TABLE_OPTIONS.map(opt => (
                      <label
                        key={opt}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          fontFamily: "'Poppins', sans-serif", fontSize: '13.5px',
                          color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="dinnerTable"
                          value={opt}
                          checked={form.dinnerTable === opt}
                          onChange={set('dinnerTable')}
                          style={{ accentColor: 'white', width: '16px', height: '16px', flexShrink: 0 }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <label style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  fontFamily: "'Poppins', sans-serif", fontSize: '12px',
                  color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={form.updates as boolean}
                    onChange={set('updates')}
                    style={{ accentColor: 'white', width: '13px', height: '13px' }}
                  />
                  I&apos;d like to receive updates about future TBS events and gatherings.
                </label>
              </div>
            </div>
          )}

        </div>

        {/* ── Bottom nav ── */}
        <div className="tbs-wizard-nav">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.max(0, s - 1))}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: "'Poppins', sans-serif", fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: 0, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            >
              ← Back
            </button>
          ) : <span />}

          <span style={{
            fontFamily: "'Poppins', sans-serif", fontSize: '12px',
            color: 'rgba(255,255,255,0.35)',
          }}>
            Step {step + 1} of {STEPS.length}
          </span>

          <button
            type="button"
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue) return;
              if (isLastStep) setSubmitted(true);
              else setStep(s => Math.min(STEPS.length - 1, s + 1));
            }}
            style={nextBtnStyle}
          >
            {isLastStep ? 'Submit' : 'Continue'}
          </button>
        </div>
      </div>

    </form>
    </>
  );
}
