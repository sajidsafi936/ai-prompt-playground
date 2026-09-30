import { useState } from "react";
import "./PromptBox.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Keep in sync with ALLOWED_MODELS in server.js
const MODELS = ["gemini-3.8-flash"];
const MAX_CHARS = 1000;

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState(MODELS[0]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSend = prompt.trim().length > 0 && !loading;

  async function handleSend() {
    if (!canSend) return;
    setLoading(true);
    setError("");
    setReply("");
    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Request failed.");
      setReply(data.text || "No response received.");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Could not reach the server. Is it running on port 5000?"
          : err.message || "The request failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setPrompt("");
    setReply("");
    setError("");
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSend();
  }

  return (
    <div className="pb-page">
      <section className="pb-card" aria-label="Prompt playground">
        <header className="pb-head">
          <h1>Prompt playground</h1>
          <p>Write a prompt, send it, read the reply.</p>
        </header>

        <label className="pb-field">
          <span>Model</span>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            {MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="pb-field">
          <span>Your prompt</span>
          <textarea
            rows={5}
            value={prompt}
            maxLength={MAX_CHARS}
            placeholder="Explain closures in JavaScript to a beginner."
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <small className="pb-count">
            {prompt.length} / {MAX_CHARS}. Press Ctrl + Enter to send.
          </small>
        </label>

        <div className="pb-actions">
          <button
            className="pb-btn pb-ghost"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
          <button
            className="pb-btn pb-primary"
            onClick={handleSend}
            disabled={!canSend}
          >
            {loading ? (
              <>
                <span className="pb-spinner" aria-hidden="true" /> Sending
              </>
            ) : (
              "Send prompt"
            )}
          </button>
        </div>

        <div className="pb-output" aria-live="polite">
          <span className="pb-output-label">Response</span>
          {error ? (
            <p className="pb-error">{error}</p>
          ) : loading ? (
            <div className="pb-skeleton" aria-label="Thinking...">
              <i />
              <i />
              <i style={{ width: "60%" }} />
            </div>
          ) : reply ? (
            <pre>{reply}</pre>
          ) : (
            <p className="pb-empty">
              Nothing yet. Send a prompt to see the reply here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
