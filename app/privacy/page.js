import Topbar from '../../components/Topbar';

export const metadata = {
  title: 'Quero — Privacy',
  description: 'Quero privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="shell">
      <Topbar />
      <main>
        <section className="section" style={{ borderTop: 0, paddingTop: 80 }}>
          <p className="kicker">LEGAL / PRIVACY</p>
          <h1 style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}>Privacy.</h1>
          <p className="hero-copy" style={{ marginLeft: 0 }}>
            This route is now part of the Next.js application. The existing privacy document remains in the repository while the policy content is migrated into React pages.
          </p>
          <p style={{ color: 'var(--muted)', maxWidth: 620, lineHeight: 1.8 }}>
            For the production migration, replace this page with the current policy text from the existing privacy.html document rather than maintaining two competing sources of truth.
          </p>
        </section>
      </main>
    </div>
  );
}
