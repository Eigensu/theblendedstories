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
  fontSize: 'clamp(12px, 1.2vw, 14px)',
  padding: '8px 0',
  outline: 'none',
  boxSizing: 'border-box',
};

const lbl: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 'clamp(11px, 0.9vw, 12px)',
  color: 'rgba(255,255,255,0.85)',
  display: 'block',
  marginBottom: '6px',
  lineHeight: '1.4',
};

const sel = (hasValue: boolean): React.CSSProperties => ({
  ...inp,
  appearance: 'none',
  cursor: 'pointer',
  color: hasValue ? 'white' : 'rgba(255,255,255,0.38)',
});

const secHead: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: '9px',
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  margin: '0 0 2px 0',
};

const secSub: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: '8px',
  color: 'rgba(255,255,255,0.25)',
  margin: '0 0 16px 0',
};

function F({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}{req && <span style={{ color: 'rgba(255,255,255,0.35)' }}>*</span>}</label>
      {children}
    </div>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="form-two-col">{children}</div>;
}

const OPT = { background: '#111' };

export default function TBSNightsPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', role: '', city: '', birthday: '', phone: '',
    dietaryPref: '', dietaryOther: '', instagram: '',
    citiesInspire: '', recentTravel: '', topRestaurants: '',
    currentObsession: '', currentFocus: '', perfectWeekend: '', playlist: '',
    whyAttend: '', hopeToExperience: '', heardAbout: '', drewYou: '',
    updates: false,
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const fieldCol: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flex: 1,
    paddingTop: '8px',
  };

  return (
    <>
    {submitted && <SuccessModal onBack={() => router.push('/')} />}
    <form
      onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
      className="tbs-nights-form"
    >

      {/* ── Col 1: IMAGE PANEL (left) ── */}
      <div className="tbs-nights-image-col" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.78)' }} />
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '56px 18px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}>
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{
              position: 'absolute', top: '20px', left: '18px',
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '9px', letterSpacing: '0.14em',
              textTransform: 'uppercase', cursor: 'pointer',
              padding: 0, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            ← Back
          </button>
          <div>
            <p style={{
              fontFamily: "'Poppins', sans-serif", fontSize: '8px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', margin: '0 0 10px 0',
            }}>TBS NIGHTS</p>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: '18px',
              fontWeight: 400, color: 'white', lineHeight: '1.25',
              textTransform: 'uppercase', margin: '0 0 14px 0',
            }}>
              CURATED DINNERS.<br />MEANINGFUL<br />CONVERSATIONS.
            </h1>
            <p style={{
              fontFamily: "'Poppins', sans-serif", fontSize: '9px',
              color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', margin: '0 0 8px 0',
            }}>
              TBS Nights is an invite-only dinner series that brings together inspiring people for intentional evenings of great food and even better conversations.
            </p>
            <p style={{
              fontFamily: "'Poppins', sans-serif", fontSize: '9px',
              color: 'rgba(255,255,255,0.38)', lineHeight: '1.75', margin: 0,
            }}>
              Apply below to be considered for our upcoming gathering.
            </p>
          </div>
        </div>
      </div>

      {/* ── Col 2: ABOUT YOU ── */}
      <div className="form-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={secHead}>ABOUT YOU</p>
        <p style={secSub}>Purpose: Basic information &amp; guest verification</p>
        <div style={fieldCol}>
          <F label="What's your full name?" req>
            <input style={inp} placeholder="Your answer" value={form.fullName} onChange={set('fullName')} required />
          </F>
          <F label="What's your email address?" req>
            <input type="email" style={inp} placeholder="your.email@example.com" value={form.email} onChange={set('email')} required />
          </F>
          <TwoCol>
            <F label="What do you currently do?" req>
              <input style={inp} placeholder="Your answer" value={form.role} onChange={set('role')} required />
            </F>
            <F label="What city are you currently based in?" req>
              <input style={inp} placeholder="Your answer" value={form.city} onChange={set('city')} required />
            </F>
          </TwoCol>
          <TwoCol>
            <F label="Birthday" req>
              <input style={inp} placeholder="DD / MM / YYYY" value={form.birthday} onChange={set('birthday')} required />
            </F>
            <F label="Daytime phone number" req>
              <input type="tel" style={inp} placeholder="+91 · Your number" value={form.phone} onChange={set('phone')} required />
            </F>
          </TwoCol>
          <TwoCol>
            <F label="Dietary preference or restrictions?">
              <select style={sel(!!form.dietaryPref)} value={form.dietaryPref} onChange={set('dietaryPref')}>
                <option value="" style={OPT}>Select</option>
                <option value="none" style={OPT}>None</option>
                <option value="vegetarian" style={OPT}>Vegetarian</option>
                <option value="vegan" style={OPT}>Vegan</option>
                <option value="gluten-free" style={OPT}>Gluten Free</option>
                <option value="halal" style={OPT}>Halal</option>
                <option value="other" style={OPT}>Other</option>
              </select>
            </F>
            <F label="Other">
              <input style={inp} placeholder="Your answer" value={form.dietaryOther} onChange={set('dietaryOther')} />
            </F>
          </TwoCol>
          <F label="Your Instagram handle?">
            <input style={inp} placeholder="@yourhandle" value={form.instagram} onChange={set('instagram')} />
          </F>
        </div>
      </div>

      {/* ── Col 3: YOUR WORLD ── */}
      <div className="form-col" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={secHead}>YOUR WORLD</p>
        <p style={secSub}>Purpose: Understand interests, tastes &amp; cultural fit</p>
        <div style={fieldCol}>
          <TwoCol>
            <F label="Which cities or places (apart from Mumbai) inspire you?">
              <input style={inp} placeholder="Your answer" value={form.citiesInspire} onChange={set('citiesInspire')} />
            </F>
            <F label="Recently travelled to?">
              <input style={inp} placeholder="Your answer" value={form.recentTravel} onChange={set('recentTravel')} />
            </F>
          </TwoCol>
          <F label="Your top 3 favourite restaurants in Mumbai?">
            <input style={inp} placeholder="Your answer" value={form.topRestaurants} onChange={set('topRestaurants')} />
          </F>
          <TwoCol>
            <F label="What do you currently obsess over?">
              <textarea rows={2} style={{ ...inp, resize: 'none' }} placeholder="Your answer" value={form.currentObsession} onChange={set('currentObsession')} />
            </F>
            <F label="What are you currently focused on? (Open Text)">
              <textarea rows={2} style={{ ...inp, resize: 'none' }} placeholder="Your answer" value={form.currentFocus} onChange={set('currentFocus')} />
            </F>
          </TwoCol>
          <TwoCol>
            <F label="How do you spend a perfect weekend in Mumbai?">
              <input style={inp} placeholder="Your answer" value={form.perfectWeekend} onChange={set('perfectWeekend')} />
            </F>
            <F label="What's on your playlist?">
              <input style={inp} placeholder="Your answer" value={form.playlist} onChange={set('playlist')} />
            </F>
          </TwoCol>
          {/* spacer to match ABOUT YOU's 6 items */}
          <div style={{ visibility: 'hidden', pointerEvents: 'none' }}>
            <label style={lbl}>‌</label>
            <input style={inp} />
          </div>
        </div>
      </div>

      {/* ── Col 4: WHY TBS NIGHTS? + submit ── */}
      <div className="form-col">
        <p style={secHead}>WHY TBS NIGHTS?</p>
        <p style={secSub}>Purpose: Understand intent &amp; fit</p>
        <div style={{ ...fieldCol }}>
          <F label="Why would you like to attend TBS Nights?" req>
            <textarea rows={2} style={{ ...inp, resize: 'none' }} placeholder="Your answer" value={form.whyAttend} onChange={set('whyAttend')} required />
          </F>
          <F label="What do you hope to experience?" req>
            <textarea rows={2} style={{ ...inp, resize: 'none' }} placeholder="Your answer" value={form.hopeToExperience} onChange={set('hopeToExperience')} required />
          </F>
          <TwoCol>
            <F label="How did you hear about TBS Nights?">
              <select style={sel(!!form.heardAbout)} value={form.heardAbout} onChange={set('heardAbout')}>
                <option value="" style={OPT}>Your answer</option>
                <option value="instagram" style={OPT}>Instagram</option>
                <option value="friend" style={OPT}>Friend / Word of mouth</option>
                <option value="newsletter" style={OPT}>Newsletter</option>
                <option value="event" style={OPT}>At an event</option>
                <option value="other" style={OPT}>Other</option>
              </select>
            </F>
            <F label="What drew you to The Blended Stories?">
              <select style={sel(!!form.drewYou)} value={form.drewYou} onChange={set('drewYou')}>
                <option value="" style={OPT}>Your answer</option>
                <option value="content" style={OPT}>Content &amp; storytelling</option>
                <option value="community" style={OPT}>Community</option>
                <option value="events" style={OPT}>Events</option>
                <option value="aesthetic" style={OPT}>Aesthetic &amp; vibe</option>
                <option value="other" style={OPT}>Other</option>
              </select>
            </F>
          </TwoCol>

          {/* Newsletter + Submit at bottom */}
          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: "'Poppins', sans-serif", fontSize: '9px',
              color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
              marginBottom: '14px',
            }}>
              <input
                type="checkbox"
                checked={form.updates as boolean}
                onChange={set('updates')}
                style={{ accentColor: 'white', width: '11px', height: '11px' }}
              />
              I&apos;d like to receive updates about future TBS events and gatherings.
            </label>
            <button
              type="submit"
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'transparent', color: 'white',
                padding: '11px 0',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '10px', letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            >
              SUBMIT APPLICATION →
            </button>
          </div>
        </div>
      </div>

    </form>
    </>
  );
}
