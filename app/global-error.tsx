"use client";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en-KE"><head><link rel="stylesheet" href="/fonts/local.css"/></head><body style={{ fontFamily: "Poppins", background: "#f0faff", color: "#1f1f1f", padding: "8vw" }}><h1>Something went wrong.</h1><p>Please try again, or contact Hannah Home on WhatsApp at +254112272061.</p><button onClick={reset} style={{ font: "inherit", padding: "12px 24px", background: "#367d99", color: "white", border: 0, cursor: "pointer" }}>Try Again</button><p><a href="/services">Back to Services</a></p></body></html>;
}
