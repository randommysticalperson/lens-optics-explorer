/* ============================================================
   QUIZ / CHALLENGE MODE — Blueprint Lab Design
   Randomized optics challenges with live ray diagram feedback
   ============================================================ */
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import RayDiagram from "@/components/RayDiagram";

const CYAN = "#22d3ee";
const AMBER = "#fbbf24";
const GREEN = "#34d399";
const RED = "#f87171";

type QuizType = "identify_image" | "set_focal" | "set_object" | "identify_lens";

interface Question {
  type: QuizType;
  prompt: string;
  lensType: "converging" | "concave";
  focalLength: number;
  objectDistance: number;
  objectHeight: number;
  correctAnswer: string;
  options: string[];
  hint: string;
}

function generateQuestion(idx: number): Question {
  const rng = (min: number, max: number, step = 1) =>
    Math.round((Math.random() * (max - min) + min) / step) * step;

  const types: QuizType[] = ["identify_image", "identify_lens", "set_focal", "set_object"];
  const type = types[idx % types.length];

  if (type === "identify_image") {
    const lt = Math.random() > 0.5 ? "converging" : "concave";
    const f = rng(60, 140, 10);
    const u = lt === "converging" ? rng(20, 280, 10) : rng(40, 250, 10);
    const v = lt === "converging"
      ? (f * u) / (u - f)
      : ((-f) * u) / (u - (-f));
    const isReal = v > 0;
    const isInverted = -(v / u) < 0;
    const correct = isReal ? (isInverted ? "Real, Inverted" : "Real, Upright") : "Virtual, Upright";
    const options = ["Real, Inverted", "Virtual, Upright", "Real, Upright", "Virtual, Inverted"];
    return {
      type, lensType: lt, focalLength: lt === "concave" ? -f : f, objectDistance: u, objectHeight: 55,
      prompt: `A ${lt} lens (f = ${lt === "concave" ? "−" : ""}${f} px) has an object placed ${u} px away. What type of image is formed?`,
      correctAnswer: correct, options, hint: `Use 1/v = 1/f + 1/u. v ${isReal ? ">" : "<"} 0 → ${isReal ? "real" : "virtual"}.`,
    };
  }

  if (type === "identify_lens") {
    const lt = Math.random() > 0.5 ? "converging" : "concave";
    const f = rng(60, 130, 10);
    const u = rng(80, 220, 10);
    const correct = lt === "converging" ? "Converging (convex)" : "Concave (diverging)";
    const options = ["Converging (convex)", "Concave (diverging)", "Plano-convex", "Aspheric"];
    return {
      type, lensType: lt, focalLength: lt === "concave" ? -f : f, objectDistance: u, objectHeight: 55,
      prompt: `The ray diagram below shows a lens with f = ${lt === "concave" ? "−" : "+"}${f} px. What type of lens is this?`,
      correctAnswer: correct, options, hint: `Focal length sign: positive = converging, negative = diverging.`,
    };
  }

  if (type === "set_focal") {
    const lt = "converging" as const;
    const f = rng(60, 130, 10);
    const u = rng(f * 1.5, 260, 10);
    const v = (f * u) / (u - f);
    const m = -(v / u);
    const correct = `${f} px`;
    const opts = [f, f + 20, f - 20, f + 40].map(x => `${Math.abs(x)} px`);
    return {
      type, lensType: lt, focalLength: f, objectDistance: u, objectHeight: 55,
      prompt: `The image distance is ${v.toFixed(0)} px and object distance is ${u} px. What is the focal length?`,
      correctAnswer: correct, options: opts, hint: `1/f = 1/v + 1/u (real-is-positive: u negative for real object).`,
    };
  }

  // set_object
  const lt = "converging" as const;
  const f = rng(70, 120, 10);
  const u = rng(f * 1.4, 250, 10);
  const v = (f * u) / (u - f);
  const correct = `${u} px`;
  const opts = [u, u + 30, u - 30, u + 60].map(x => `${Math.abs(x)} px`);
  return {
    type, lensType: lt, focalLength: f, objectDistance: u, objectHeight: 55,
    prompt: `A converging lens (f = ${f} px) forms an image at ${v.toFixed(0)} px. Where is the object?`,
    correctAnswer: correct, options: opts, hint: `1/u = 1/f − 1/v.`,
  };
}

export default function Quiz() {
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [question, setQuestion] = useState<Question>(() => generateQuestion(0));
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const isCorrect = selected === question.correctAnswer;

  const nextQuestion = useCallback(() => {
    const next = qIdx + 1;
    setQIdx(next);
    setQuestion(generateQuestion(next));
    setSelected(null);
    setShowHint(false);
  }, [qIdx]);

  const handleSelect = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    setTotal(t => t + 1);
    if (opt === question.correctAnswer) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      <div className="pt-24 pb-10" style={{ borderBottom: "1px solid oklch(0.25 0.04 250)" }}>
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="inline-block px-2.5 py-1 rounded text-xs font-bold mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", background: "oklch(0.65 0.15 160 / 0.12)", border: "1px solid oklch(0.65 0.15 160 / 0.3)", color: GREEN }}>
              CHALLENGE MODE
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
              Optics Quiz
            </h1>
            <p className="text-base" style={{ color: "oklch(0.65 0.04 250)" }}>
              Test your understanding of lenses, ray diagrams, and the thin lens equation.
            </p>
          </div>

          {/* Score panel */}
          <div className="flex gap-4">
            {[
              { label: "Score", value: `${score}/${total}`, color: CYAN },
              { label: "Accuracy", value: `${accuracy}%`, color: total > 0 && accuracy >= 70 ? GREEN : total > 0 ? AMBER : "oklch(0.55 0.04 250)" },
              { label: "Streak", value: `${streak} 🔥`, color: streak >= 3 ? AMBER : "oklch(0.55 0.04 250)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl px-5 py-3 text-center" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
                <p className="text-xs mb-1" style={{ color: "oklch(0.55 0.04 250)" }}>{label}</p>
                <p className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question + options */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.50 0.04 250)" }}>
                  Question {qIdx + 1}
                </span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.17 0.04 250)", color: CYAN, fontFamily: "'JetBrains Mono', monospace" }}>
                  {question.type.replace(/_/g, " ").toUpperCase()}
                </span>
              </div>
              <p className="text-base leading-relaxed mb-6" style={{ color: "oklch(0.85 0.01 250)" }}>
                {question.prompt}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {question.options.map(opt => {
                  let bg = "oklch(0.17 0.04 250)";
                  let border = "oklch(0.28 0.04 250)";
                  let color = "oklch(0.75 0.04 250)";
                  if (selected !== null) {
                    if (opt === question.correctAnswer) {
                      bg = "rgba(52,211,153,0.12)"; border = GREEN; color = GREEN;
                    } else if (opt === selected) {
                      bg = "rgba(248,113,113,0.12)"; border = RED; color = RED;
                    }
                  } else if (opt === selected) {
                    bg = "oklch(0.22 0.04 250)"; border = CYAN;
                  }
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      className="p-3 rounded-lg text-sm font-medium text-left transition-all duration-150"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", background: bg, border: `1px solid ${border}`, color }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-5 p-4 rounded-lg" style={{ background: isCorrect ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${isCorrect ? GREEN : RED}30` }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? GREEN : RED }}>
                    {isCorrect ? "✓ Correct!" : `✗ Incorrect — answer: ${question.correctAnswer}`}
                  </p>
                  <p className="text-xs" style={{ color: "oklch(0.65 0.04 250)" }}>{question.hint}</p>
                </div>
              )}

              <div className="flex gap-3 mt-5">
                {selected === null && (
                  <button
                    onClick={() => setShowHint(h => !h)}
                    className="px-4 py-2 rounded text-sm font-medium transition-all"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", background: "oklch(0.17 0.04 250)", border: "1px solid oklch(0.28 0.04 250)", color: AMBER }}
                  >
                    {showHint ? "Hide hint" : "Show hint"}
                  </button>
                )}
                {selected !== null && (
                  <button
                    onClick={nextQuestion}
                    className="flex-1 py-2.5 rounded text-sm font-semibold transition-all"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", background: CYAN, color: "oklch(0.12 0.04 250)" }}
                  >
                    Next Question →
                  </button>
                )}
              </div>

              {showHint && selected === null && (
                <div className="mt-3 p-3 rounded text-xs" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", color: AMBER }}>
                  💡 {question.hint}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "oklch(0.55 0.04 250)" }}>
                <span>Progress</span>
                <span>{total} answered</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.22 0.03 250)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(accuracy, 100)}%`, background: `linear-gradient(to right, ${CYAN}, ${GREEN})` }}
                />
              </div>
            </div>
          </div>

          {/* Live ray diagram */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
              Ray Diagram Reference
            </h2>
            <div style={{ height: "300px" }}>
              <RayDiagram
                lensType={question.lensType}
                focalLength={question.focalLength}
                objectDistance={question.objectDistance}
                objectHeight={question.objectHeight}
                showVirtualRays={true}
              />
            </div>

            {/* Formula reference */}
            <div className="rounded-xl p-5" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h3 className="text-xs font-bold mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.50 0.04 250)" }}>Formula Reference</h3>
              <div className="space-y-2 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {[
                  { eq: "1/f = 1/v − 1/u", desc: "Thin lens equation" },
                  { eq: "m = −v/u", desc: "Magnification" },
                  { eq: "f > 0", desc: "Converging lens" },
                  { eq: "f < 0", desc: "Diverging lens" },
                  { eq: "v > 0 → Real image", desc: "Real-is-positive" },
                ].map(({ eq, desc }) => (
                  <div key={eq} className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: CYAN, minWidth: "160px" }}>{eq}</span>
                    <span className="text-xs" style={{ color: "oklch(0.55 0.04 250)" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
