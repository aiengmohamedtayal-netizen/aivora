const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "32px",
    background: "#0b0d12",
    color: "#f7f7f2",
    fontFamily: "Arial, Helvetica, sans-serif",
  } as const,
  card: {
    width: "min(100%, 620px)",
    padding: "clamp(32px, 7vw, 72px)",
    textAlign: "center" as const,
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "28px",
    background: "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035))",
    boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
  },
  mark: {
    width: "56px",
    height: "56px",
    margin: "0 auto 28px",
    display: "grid",
    placeItems: "center",
    borderRadius: "18px",
    background: "#d7ff3f",
    color: "#0b0d12",
    fontSize: "24px",
    fontWeight: 800,
  },
  eyebrow: {
    margin: "0 0 18px",
    color: "#d7ff3f",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
  },
  heading: {
    margin: "0",
    fontSize: "clamp(36px, 7vw, 64px)",
    lineHeight: 1.02,
    letterSpacing: "-0.045em",
  },
  message: {
    maxWidth: "480px",
    margin: "24px auto 0",
    color: "rgba(247,247,242,0.72)",
    fontSize: "clamp(17px, 2.5vw, 20px)",
    lineHeight: 1.6,
  },
  footer: {
    margin: "40px 0 0",
    color: "rgba(247,247,242,0.42)",
    fontSize: "13px",
  },
} as const

export default function MaintenancePage() {
  return (
    <main style={styles.page}>
      <section style={styles.card} aria-labelledby="maintenance-title">
        <div style={styles.mark} aria-hidden="true">A</div>
        <p style={styles.eyebrow}>Aivora</p>
        <h1 id="maintenance-title" style={styles.heading}>Temporarily paused</h1>
        <p style={styles.message}>
          This link is temporarily paused. We will be back later.
        </p>
        <p style={styles.footer}>Thank you for your patience.</p>
      </section>
    </main>
  )
}
