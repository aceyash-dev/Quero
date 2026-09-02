import Link from 'next/link';
import { Icon } from './Icon';

export default function Topbar({ app = false }) {
  return (
    <div className="nav-wrap">
      <nav className="nav" aria-label="Primary navigation">
        <Link className="brand" href="/" aria-label="Quero home">
          <span className="brand-mark" aria-hidden="true">q</span>
          <span className="brand-name">Quero</span>
        </Link>
        <span className="nav-spacer" />
        {!app && <Link className="nav-link" href="#why">Why Quero</Link>}
        {!app && <Link className="nav-link" href="#capabilities">Capabilities</Link>}
        <Link className="nav-link" href="/privacy">Privacy</Link>
        <Link className="nav-cta" href={app ? '/' : '/chat'}>{app ? 'Home' : 'Open Quero'}</Link>
      </nav>
    </div>
  );
}
