import Topbar from '../../components/Topbar';
import ChatComposer from '../../components/ChatComposer';

export const metadata = {
  title: 'Quero — Chat',
  description: 'A quiet place to think with Quero.',
};

export default function ChatPage() {
  return (
    <div className="chat-page shell">
      <Topbar app />
      <main className="chat-main">
        <section className="chat-empty" aria-labelledby="chat-title">
          <div>
            <p className="kicker">QUERO</p>
            <h1 id="chat-title">Where should<br /><span>we begin?</span></h1>
            <p>Ask a question, bring an idea, or drop in a problem. The conversation can start messy.</p>
          </div>
        </section>
      </main>
      <ChatComposer />
    </div>
  );
}
