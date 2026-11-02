"use client";

// Replaces the root layout when it fails, so it brings its own <html> and plain styles (no theme, fonts or Tailwind guarantees).
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "#f8f4ea",
          color: "#1f2a44",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div role="alert" style={{ maxWidth: "24rem" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Something went wrong</h1>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.5 }}>Please try again. If it keeps happening, come back in a little while.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              minHeight: "3rem",
              padding: "0 1.5rem",
              border: 0,
              borderRadius: "999px",
              background: "#1f2a44",
              color: "#f8f4ea",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
