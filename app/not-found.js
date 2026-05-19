import { Link } from 'next-view-transitions'

export const metadata = {
  title: '404 — ONE Institute',
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      padding: '0 64px 96px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <span style={{
        position: 'absolute',
        left: '4%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 'clamp(200px, 35vw, 600px)',
        color: 'var(--ink)',
        opacity: 0.08,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        userSelect: 'none',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }} aria-hidden="true">
        404
      </span>

      <p style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '11px',
        letterSpacing: '0.2em',
        color: 'var(--blood)',
        textTransform: 'uppercase',
        marginBottom: '24px',
      }}>
        [+] Wrong Corner
      </p>

      <h1 style={{
        fontFamily: 'var(--font-display), sans-serif',
        fontSize: 'clamp(3.5rem, 8vw, 9rem)',
        lineHeight: 0.88,
        letterSpacing: '-0.025em',
        textTransform: 'uppercase',
        color: 'var(--bone)',
        marginBottom: '40px',
      }}>
        PAGE<br />
        NOT<br />
        FOUND.
      </h1>

      <p style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '13px',
        letterSpacing: '0.1em',
        color: 'var(--bone-2)',
        marginBottom: '40px',
        maxWidth: '360px',
        lineHeight: 1.6,
      }}>
        That page doesn&apos;t exist. Head back to the gym — round one is still waiting.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/" style={{
          background: 'var(--blood)',
          color: 'var(--bone)',
          fontFamily: 'var(--font-sub-display), sans-serif',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '16px 36px',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          Back to Home
        </Link>
        <Link href="/contact" style={{
          color: 'var(--bone-2)',
          fontFamily: 'var(--font-sub-display), sans-serif',
          fontSize: '13px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '16px 36px',
          textDecoration: 'none',
          display: 'inline-block',
          border: '1px solid var(--ink-3)',
        }}>
          Book a Class
        </Link>
      </div>
    </div>
  )
}
