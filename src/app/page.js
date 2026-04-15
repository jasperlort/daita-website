'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

// Lazy load heavy 3D components
const SplatViewer = dynamic(() => import('../components/SplatViewer'), { ssr: false });
const ParticleHero = dynamic(() => import('../components/ParticleHero'), { ssr: false });

// ââ Fade-in animation wrapper ââ
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ââ Nav ââ
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1.2rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(8,8,12,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
      transition: 'all 0.4s ease',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <img src="/logo.svg" alt="DAITA" style={{ height: 32 }} />
      </a>
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {['Technology', 'How It Works', 'Vision'].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} style={{
            color: '#999', textDecoration: 'none', fontSize: '0.8rem',
            letterSpacing: '0.12em', fontWeight: 500, transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#C4A265'}
            onMouseLeave={e => e.target.style.color = '#999'}
          >
            {item.toUpperCase()}
          </a>
        ))}
        <a href="#contact" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>
          JOIN NETWORK
        </a>
      </div>
    </nav>
  );
}

// ââ Hero Section ââ
function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const y = useTransform(scrollY, [0, 600], [0, 120]);

  return (
    <section style={{
      position: 'relative', height: '100vh', display: 'flex',
      alignItems: 'center', overflow: 'hidden',
    }}>
      {/* 3D particle background */}
      <ParticleHero />

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(196,162,101,0.04) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30vh', zIndex: 1,
        background: 'linear-gradient(to top, #08080C, transparent)',
      }} />

      <motion.div style={{ opacity, y, position: 'relative', zIndex: 2, padding: '0 4rem', maxWidth: 800 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="section-label" style={{ marginBottom: '1.5rem' }}>THE DECENTRALIZED VISUAL DATA NETWORK</p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: 600, color: '#fff', lineHeight: 1.08, marginBottom: '1.5rem',
          }}
        >
          We're building a<br />
          <span style={{
            background: 'linear-gradient(135deg, #C4A265, #E8D5A8, #C4A265)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite',
          }}>
            digital twin
          </span>
          {' '}of<br />the entire world.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontSize: '1.1rem', color: '#888', maxWidth: 480, lineHeight: 1.8, marginBottom: '2.5rem' }}
        >
          Thousands of people with 360-degree cameras, capturing reality and converting it
          into navigable Gaussian Splats. Get paid per kilometer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{ display: 'flex', gap: '1rem' }}
        >
          <a href="#technology" className="btn-primary">EXPLORE THE TECH</a>
          <a href="#how-it-works" className="btn-outline">HOW IT WORKS</a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}
      >
        <span style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.2em' }}>SCROLL</span>
        <div style={{
          width: 1, height: 40, background: 'linear-gradient(to bottom, #C4A265, transparent)',
        }} />
      </motion.div>
    </section>
  );
}

// ââ Stats Bar ââ
function StatsBar() {
  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '3rem 0',
    }}>
      <div className="container" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem',
      }}>
        {[
          { value: '360Â°', label: 'Spatial Capture' },
          { value: '$280B+', label: 'Market by 2030' },
          { value: '<24h', label: 'To Gaussian Splats' },
          { value: '100%', label: 'Crowdsourced' },
        ].map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600,
                color: 'var(--gold)', marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.15em' }}>
                {s.label.toUpperCase()}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ââ Technology Section with Splat Viewer ââ
function TechnologySection() {
  return (
    <section id="technology" style={{ padding: '8rem 0', position: 'relative' }}>
      {/* Subtle glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '-10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(196,162,101,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="container">
        <Reveal>
          <p className="section-label">TECHNOLOGY</p>
          <h2 className="section-title">From raw footage to<br />Gaussian Splats</h2>
          <p className="section-subtitle" style={{ marginBottom: '4rem' }}>
            Our pipeline transforms 360-degree video into photorealistic 3D environments using
            state-of-the-art 3D Gaussian Splatting â the same technology being standardized by
            Khronos, NVIDIA, and Apple.
          </p>
        </Reveal>

        {/* Interactive Splat Viewer */}
        <Reveal delay={0.2}>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'var(--bg-card)', marginBottom: '4rem',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 16, left: 20, zIndex: 10,
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#C4A265', animation: 'pulse 2s ease infinite',
              }} />
              <span style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.15em' }}>
                INTERACTIVE GAUSSIAN SPLAT
              </span>
            </div>
            <div style={{ height: 500 }}>
              <SplatViewer />
            </div>
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#555' }}>
                Drag to orbit. Scroll to zoom. This is what your data becomes.
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>
                3D GAUSSIAN SPLATTING
              </span>
            </div>
          </div>
        </Reveal>

        {/* Pipeline steps */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem',
        }}>
          {[
            { num: '01', title: '360 Capture', desc: 'Raw 8K spherical video from thousands of contributors worldwide.' },
            { num: '02', title: 'AI Processing', desc: 'Depth estimation, semantic segmentation, and multi-view alignment.' },
            { num: '03', title: 'Gaussian Splats', desc: 'Millions of 3D ellipsoids create photorealistic, navigable scenes.' },
            { num: '04', title: 'Digital Twin', desc: 'A continuously updated, explorable mirror of the physical world.' },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="glass-card" style={{ height: '100%' }}>
                <span style={{
                  fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 600,
                  color: 'rgba(196,162,101,0.15)',
                }}>{step.num}</span>
                <h3 style={{
                  color: '#fff', fontSize: '1.1rem', fontWeight: 600,
                  margin: '0.8rem 0 0.5rem', fontFamily: 'var(--font-sans)',
                }}>{step.title}</h3>
                <p style={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ââ How It Works ââ
function HowItWorks() {
  return (
    <section id="how-it-works" style={{
      padding: '8rem 0', position: 'relative',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="container">
        <Reveal>
          <p className="section-label">HOW IT WORKS</p>
          <h2 className="section-title">The Uber model,<br />applied to spatial data</h2>
          <p className="section-subtitle" style={{ marginBottom: '4rem' }}>
            We give you a camera. You walk, bike, or drive. You get paid per kilometer.
            We handle everything else.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
                </svg>
              ),
              title: 'Get a Camera',
              desc: 'We provide 360-degree cameras at cost price. Mount on your car dashboard, bike helmet, or backpack. No expensive equipment â just a small, weatherproof device.',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              ),
              title: 'Capture the World',
              desc: 'Walk, bike, or drive as you normally would. The camera captures continuously. Our app handles background uploading over WiFi â zero extra effort.',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              ),
              title: 'Get Paid Per km',
              desc: 'Every kilometer of new data captured earns you money. The more you move, the more you earn. Priority bonuses for unmapped areas and fresh recaptures.',
            },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="glass-card" style={{ height: '100%' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(196,162,101,0.08)', border: '1px solid rgba(196,162,101,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}>
                  {step.icon}
                </div>
                <h3 style={{
                  color: '#fff', fontSize: '1.2rem', fontWeight: 600,
                  marginBottom: '0.8rem', fontFamily: 'var(--font-sans)',
                }}>{step.title}</h3>
                <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ââ Vision Section ââ
function VisionSection() {
  return (
    <section id="vision" style={{
      padding: '10rem 0', position: 'relative', overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Large ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,162,101,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Reveal>
          <p className="section-label">THE VISION</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 600, color: '#fff', lineHeight: 1.12, marginBottom: '2rem',
          }}>
            Whoever controls the world's<br />
            spatial data layer, controls<br />
            <span style={{
              background: 'linear-gradient(135deg, #C4A265, #E8D5A8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>the future.</span>
          </h2>
          <p style={{
            fontSize: '1.1rem', color: '#666', maxWidth: 560, margin: '0 auto 4rem',
            lineHeight: 1.8, fontStyle: 'italic',
          }}>
            Navigation. Commerce. Simulation. AI training.<br />
            It all starts with a complete model of reality.
          </p>
        </Reveal>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem',
          maxWidth: 900, margin: '0 auto',
        }}>
          {[
            { title: 'Navigation', desc: 'Beyond flat maps â true 3D spatial wayfinding' },
            { title: 'Commerce', desc: 'Spatial retail, location intelligence, AR advertising' },
            { title: 'Simulation', desc: 'Autonomous vehicle & robotics training environments' },
            { title: 'AI Infrastructure', desc: 'The world model that powers the next generation of AI' },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', margin: '0 auto 1rem',
                  background: 'rgba(196,162,101,0.06)', border: '1px solid rgba(196,162,101,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', color: 'var(--gold)',
                }}>
                  {['â', 'â', 'â¬¡', 'â'][i]}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  {p.title}
                </h3>
                <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ââ Competitive Edge ââ
function CompetitiveSection() {
  const competitors = [
    ['360 capture', 'Yes', 'No', 'No', 'Yes'],
    ['3D Gaussian Splats', 'Yes', 'No', 'No', 'No'],
    ['Pay per km', 'Yes', 'Tokens', 'No', 'No'],
    ['Digital twin output', 'Yes', 'No', 'No', 'Limited'],
    ['Pedestrian + vehicle', 'Yes', 'Vehicle only', 'Partial', 'Limited'],
    ['Decentralized', 'Yes', 'Blockchain', 'Meta-owned', 'Google-owned'],
  ];

  return (
    <section style={{
      padding: '8rem 0',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div className="container">
        <Reveal>
          <p className="section-label">COMPETITIVE EDGE</p>
          <h2 className="section-title">We operate where<br />no one else does</h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
            The intersection of crowdsourced 360 capture, Gaussian Splatting, and
            a pay-per-km incentive model is unoccupied.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['', 'DAITA', 'Hivemapper', 'Mapillary', 'Google SV'].map((h, i) => (
                    <th key={i} style={{
                      padding: '1rem 1.2rem', textAlign: i === 0 ? 'left' : 'center',
                      fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
                      color: i === 1 ? '#C4A265' : '#555',
                      background: i === 1 ? 'rgba(196,162,101,0.06)' : 'var(--bg-card)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: '0.75rem 1.2rem',
                        textAlign: ci === 0 ? 'left' : 'center',
                        fontSize: '0.85rem',
                        color: ci === 1 ? '#C4A265' : '#777',
                        fontWeight: ci === 1 ? 600 : 400,
                        background: ci === 1 ? 'rgba(196,162,101,0.03)' : 'transparent',
                        borderBottom: ri < competitors.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      }}>
                        {ci === 1 && cell === 'Yes' ? 'â Yes' : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ââ CTA / Contact ââ
function ContactSection() {
  return (
    <section id="contact" style={{
      padding: '8rem 0', textAlign: 'center', position: 'relative',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,162,101,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Reveal>
          <p className="section-label">JOIN THE NETWORK</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600, color: '#fff', marginBottom: '1rem',
          }}>
            See the world. Own the data.
          </h2>
          <p style={{
            color: '#666', fontSize: '1rem', maxWidth: 500, margin: '0 auto 2.5rem',
            lineHeight: 1.8,
          }}>
            Investor, collector, or enterprise customer â we'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:jasper@aerointel.eu" className="btn-primary">
              GET IN TOUCH
            </a>
          </div>
          <p style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '1.5rem', letterSpacing: '0.05em' }}>
            jasper@aerointel.eu
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ââ Footer ââ
function Footer() {
  return (
    <footer style={{
      padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.04)',
      textAlign: 'center',
    }}>
      <div className="container" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <img src="/logo.svg" alt="DAITA" style={{ height: 24, opacity: 0.5 }} />
        <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          DAITA &copy; 2026. THE DECENTRALIZED VISUAL DATA NETWORK.
        </p>
      </div>
    </footer>
  );
}

// ââ Main Page ââ
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />
      <TechnologySection />
      <HowItWorks />
      <VisionSection />
      <CompetitiveSection />
      <ContactSection />
      <Footer />
    </>
  );
}
