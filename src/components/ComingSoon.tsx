import Link from "next/link";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <main className="shell landing">
      <header className="site-header">
        <Link href="/" className="brand">AROGYAGRID</Link>
        <nav><Link href="/voice">Voice Intake</Link></nav>
      </header>
      <section className="landing-hero">
        <div className="hero-kicker">AROGYAGRID NEXT MODULE</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link href="/voice" className="primary-button inline-button">Open current working module</Link>
      </section>
    </main>
  );
}
