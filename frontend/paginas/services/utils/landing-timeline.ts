const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Pure, reversible timeline. No state or time-dependent interpolation. */
export function landingTimeline(progress: number) {
  const p = clamp(progress);
  // Compare, reveal the unanswered chat, then browse the same collection.
  const takeover = smooth((p - .18) / .12);
  const morph = smooth((p - .59) / .15);
  const approach = smooth(p / .12) * (1 - morph);
  const pain = smooth((p - .26) / .08) * (1 - morph);
  const questions = [.31, .36, .41, .46].map(start => smooth((p - start) / .05));
  const browse = smooth((p - .77) / .19);
  return { morph, approach, pain, takeover, browse, questions, preview: 1 - takeover };
}
