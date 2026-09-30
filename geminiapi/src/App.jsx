// import { useState } from "react";

// export default function App() {
//   const [prompt, setPrompt] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleAsk = async () => {
//     if (!prompt.trim()) return;
//     setLoading(true);
//     setAnswer("");

//     try {
//       const res = await fetch("http://localhost:5000/api/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await res.json();
//       setAnswer(data.text || data.error);
//     } catch {
//       setAnswer("Could not reach the server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h2>Ask Gemini</h2>
//       <textarea
//         rows={4}
//         style={{ width: "100%" }}
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Ask something..."
//       />
//       <button onClick={handleAsk} disabled={loading}>
//         {loading ? "Thinking..." : "Ask"}
//       </button>
//       <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
//     </div>
//   );
// }


import React from 'react'
import PromptBox from './components/PromptBox'

const App = () => {
  return (
    <div>
      <PromptBox />
    </div>
  )
}

export default App
