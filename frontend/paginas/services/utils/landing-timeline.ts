const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Pure, reversible timeline. No state or time-dependent interpolation. */
export function landingTimeline(progress: number) {
  const p = clamp(progress);
  const morph = smooth((p - .5) / .25);
  const takeover = smooth((p - .15) / .2);
  const messages = [
    1 - smooth((p - .11) / .04),
    smooth((p - .15) / .03) * (1 - smooth((p - .31) / .04)),
    smooth((p - .35) / .03) * (1 - smooth((p - .46) / .04)),
    smooth((p - .5) / .03) * (1 - smooth((p - .72) / .03)),
    smooth((p - .75) / .03) * (1 - smooth((p - .88) / .03)),
    smooth((p - .91) / .04),
  ];
  return { morph, cut: 58 + takeover * 65, preview: 1 - takeover, camera: 1 - smooth((p - .9) / .1) * .035, messages };
}
