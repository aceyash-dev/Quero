"use client";

import { useEffect, useRef, useState } from "react";
import AcidSquares from "@/components/AcidSquares";

const prompts = [
  "Explain quantum computing simply",
  "Why do we dream?",
  "How does the internet actually work?",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [activePrompt, setActivePrompt] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePrompt((current) => (current + 1) % prompts.length);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!prompt.trim()) return;

    console.log("Quero query:", prompt);
  };

  return (
    <main className="site">
      {/* ───────────────── HERO ───────────────── */}

      <section className="hero" ref={heroRef}>
        <div className="hero-background">
          <AcidSquares
            color1="#080808"
            color2="#181818"
            color3="#ffffff"
            detail="medium"
            speed={0.42}
            mouseInteraction
            mouseInteractionFactor={0.35}
            distortion={0.12}
            distortionScale={2}
            refraction={0}
            bendRadius={5}
            bendStrength={-0.4}
            blur={0}
            animationType="rotate"
            grain
          />
        </div>

        <div className="noise" />

        <nav className="nav">
          <a href="#" className="wordmark">
            Quero<span>.</span>
          </a>

          <div className="nav-links">
            <a href="#why">Why Quero</a>
            <a href="#experience">Experience</a>
            <a href="#about">The Ace Base</a>
          </div>

          <button className="nav-button">
            Open Quero
            <span>↗</span>
          </button>
        </nav>

        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            A new way to be curious
          </div>

          <h1>
            Curiosity
            <em>answered.</em>
          </h1>

          <p className="hero-description">
            Ask better questions. Follow ideas further.
            <br />
            Turn curiosity into understanding.
          </p>

          <form className="ask-box" onSubmit={handleSubmit}>
            <div className="ask-icon">✦</div>

            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={prompts[activePrompt]}
              aria-label="Ask Quero"
            />

            <button type="submit" aria-label="Ask Quero">
              <span>↑</span>
            </button>
          </form>

          <div className="suggestions">
            <span>Try asking</span>

            {prompts.map((item, index) => (
              <button
                key={item}
                onClick={() => setPrompt(item)}
                className={index === activePrompt ? "active" : ""}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-footer">
          <span>THE ACE BASE</span>

          <span className="scroll-indicator">
            <span className="scroll-line" />
            Scroll to explore
          </span>

          <span>01 / 05</span>
        </div>
      </section>

      {/* ───────────────── STATEMENT ───────────────── */}

      <section className="statement" id="why">
        <div className="section-number">01</div>

        <div className="statement-copy">
          <p className="section-label">THE IDEA</p>

          <h2>
            One question
            <br />
            can change
            <br />
            <em>everything.</em>
          </h2>

          <p className="large-copy">
            Quero is built around a simple belief:
            <strong> curiosity deserves better answers.</strong>
          </p>
        </div>

        <div className="statement-side">
          <div className="vertical-text">QUESTION → UNDERSTANDING</div>
        </div>
      </section>

      {/* ───────────────── FEATURES ───────────────── */}

      <section className="features" id="experience">
        <div className="features-header">
          <div>
            <p className="section-label">THE EXPERIENCE</p>
            <h2>
              Think
              <br />
              <em>further.</em>
            </h2>
          </div>

          <p>
            Not just answers.
            <br />
            A place to explore the
            <br />
            space between them.
          </p>
        </div>

        <div className="feature-track">
          <article className="feature-card feature-card-large">
            <span className="card-number">01</span>

            <div className="card-visual">
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
              <div className="orbit-core">?</div>
            </div>

            <div>
              <p className="card-kicker">ASK</p>
              <h3>Start anywhere.</h3>
              <p>
                From a tiny question to a giant idea. Quero gives curiosity
                somewhere to go.
              </p>
            </div>
          </article>

          <article className="feature-card">
            <span className="card-number">02</span>

            <div className="card-visual lines-visual">
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>

            <div>
              <p className="card-kicker">EXPLORE</p>
              <h3>Go deeper.</h3>
              <p>
                Follow connected ideas instead of stopping at the first
                answer.
              </p>
            </div>
          </article>

          <article className="feature-card">
            <span className="card-number">03</span>

            <div className="card-visual type-visual">
              <span>WHY?</span>
              <span>HOW?</span>
              <span>WHAT IF?</span>
            </div>

            <div>
              <p className="card-kicker">UNDERSTAND</p>
              <h3>Make it click.</h3>
              <p>
                Complex ideas become clearer without stripping away what makes
                them interesting.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ───────────────── BIG TYPE ───────────────── */}

      <section className="big-type">
        <div className="marquee">
          <span>ASK MORE.</span>
          <span>THINK FURTHER.</span>
          <span>STAY CURIOUS.</span>
        </div>

        <div className="big-type-center">
          <p>THE POINT ISN'T TO KNOW EVERYTHING.</p>

          <h2>
            It's to keep
            <br />
            <em>asking.</em>
          </h2>
        </div>
      </section>

      {/* ───────────────── DEMO ───────────────── */}

      <section className="demo">
        <div className="demo-header">
          <p className="section-label">A QUESTION IN MOTION</p>

          <span>04</span>
        </div>

        <div className="demo-window">
          <div className="demo-top">
            <span>QUERO</span>
            <span>CURIOUS / 01</span>
          </div>

          <div className="demo-question">
            <span>Q.</span>

            <h3>Why does the ocean look blue?</h3>
          </div>

          <div className="demo-answer">
            <span>ANSWER</span>

            <p>
              Sunlight contains every color of visible light. Water absorbs
              colors toward the red end of the spectrum more strongly, while
              blue light travels farther through it and reaches our eyes.
            </p>
          </div>

          <div className="demo-footer">
            <span>01</span>
            <span>UNDERSTANDING SOMETHING NEW</span>
            <span>→</span>
          </div>
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}

      <section className="cta">
        <div className="cta-mark">Q</div>

        <p className="section-label">YOUR NEXT QUESTION</p>

        <h2>
          Stay
          <br />
          <em>curious.</em>
        </h2>

        <p>
          There is always another question.
          <br />
          Might as well make it a good one.
        </p>

        <button className="cta-button">
          Enter Quero
          <span>↗</span>
        </button>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}

      <footer className="footer" id="about">
        <div className="footer-top">
          <div className="footer-brand">
            Quero<span>.</span>
          </div>

          <div className="footer-note">
            <span>A product by</span>
            <strong>The Ace Base</strong>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 THE ACE BASE</span>

          <div>
            <a href="#">Instagram</a>
            <a href="#">GitHub</a>
            <a href="#">X</a>
          </div>

          <span>MADE FOR THE CURIOUS</span>
        </div>
      </footer>
    </main>
  );
}