import Link from "next/link";

export default function Home() {
  return (
    <main className="shell landing">
      <header className="site-header">
        <Link href="/" className="brand">CAREFLOW</Link>
        <nav>
          <Link href="/voice">Voice Intake</Link>
          <span className="nav-disabled">Command Center — later</span>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="hero-kicker">HEALTHCARE ORCHESTRATION • PART 1</div>
        <h1>From the first spoken symptom to a clear clinical intake.</h1>
        <p>
          CareFlow is being built as a coordinated healthcare platform. This first working module focuses on voice-first intake for patients and ASHA workers.
        </p>
        <Link href="/voice" className="primary-button inline-button">Open Voice Intake</Link>
      </section>

      <section className="feature-row">
        <article><span>01</span><h2>Listen</h2><p>Gemini Live handles realtime speech interaction.</p></article>
        <article><span>02</span><h2>Understand</h2><p>Gemini extracts only the facts actually stated.</p></article>
        <article><span>03</span><h2>Review</h2><p>A human sees a structured intake before later decisions.</p></article>
      </section>
    </main>
  );
}
