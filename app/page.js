import Link from 'next/link';
import Topbar from '../components/Topbar';
import { Icon } from '../components/Icon';

const capabilities = [
  ['01', 'Think', 'Work through questions, decisions, ideas, and difficult problems without losing the thread.'],
  ['02', 'Create', 'Write, plan, brainstorm, code, and turn rough thoughts into something real.'],
  ['03', 'Explore', 'Research ideas and discover information when an answer needs more than a guess.'],
  ['04', 'Act', 'Turn conversations into useful work instead of leaving good answers sitting in a chat.'],
  ['05', 'Remember', 'Keep useful context around so every conversation does not have to start from zero.'],
  ['06', 'Control', 'A workspace designed around clarity, transparency, and deliberate interaction.'],
];

export default function Home() {
  return (
    <div className="shell">
      <Topbar />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-inner">
            <div className="eyebrow"><span className="dot" /> A quieter AI workspace</div>
            <h1 id="hero-title">Curiosity,<br /><span>Answered.</span></h1>
            <p className="hero-copy">
              A quiet place to think, explore ideas, create, learn, and find your way through difficult questions.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/chat">Open Quero <Icon name="arrow" size={17} /></Link>
              <Link className="button secondary" href="#capabilities">Explore the idea</Link>
            </div>
          </div>
        </section>

        <section className="section" id="why" aria-labelledby="why-title">
          <div className="section-head">
            <div>
              <p className="kicker">THE PREMISE</p>
              <h2 id="why-title">A little more<br />than chat.</h2>
            </div>
            <p className="section-copy">Most AI products stop at the answer. Quero is built around what happens next.</p>
          </div>
          <div className="quote">
            <p>You do not need the perfect prompt. You just need a place to begin.</p>
            <small>01 / CURIOSITY IS WORTH FOLLOWING</small>
          </div>
        </section>

        <section className="section" id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-head">
            <div>
              <p className="kicker">THE WORKSPACE</p>
              <h2 id="capabilities-title">Think. Create.<br />Explore. Act.</h2>
            </div>
            <p className="section-copy">One focused place for the work that grows out of a conversation.</p>
          </div>
          <div className="feature-grid">
            {capabilities.map(([number, title, copy]) => (
              <article className="card" key={number}>
                <span className="card-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="start-title">
          <div className="section-head">
            <div>
              <p className="kicker">START ANYWHERE</p>
              <h2 id="start-title">Bring the question.<br />Quero can meet you there.</h2>
            </div>
            <p className="section-copy">Ask a question. Explore an idea. Work through a problem. Turn a thought into something useful.</p>
          </div>
          <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
            <Link className="button primary" href="/chat">Start a conversation <Icon name="arrow" size={17} /></Link>
          </div>
        </section>

        <footer>
          <span>© 2026 The Ace Base · Quero</span>
          <span>Curiosity is worth following.</span>
        </footer>
      </main>
    </div>
  );
}
