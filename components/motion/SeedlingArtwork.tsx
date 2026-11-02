/** Shared static fallback and frame-driven Remotion artwork. No external assets. */
export function SeedlingArtwork({ stem = 1, leaves = 1, seed = 0 }: { stem?: number; leaves?: number; seed?: number }) {
  return <svg viewBox="0 0 480 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
    <circle cx="240" cy="132" r="104" stroke="#1d6a4b" strokeOpacity=".12" />
    <circle cx="240" cy="132" r="81" stroke="#d5a53e" strokeOpacity=".25" strokeDasharray="2 9" />
    <ellipse cx="240" cy="229" rx="100" ry="9" fill="#113e31" fillOpacity=".06" />
    <path d="M128 225H352" stroke="#a6b894" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="240" cy="217" rx="8" ry="12" fill="#8a6b20" opacity={seed} />
    <path d="M240 224C238 190 235 150 247 104" stroke="#1d6a4b" strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - stem} opacity={stem > 0 ? 1 : 0} />
    <g style={{ transformOrigin: "241px 162px", scale: leaves, opacity: leaves }}>
      <path d="M241 170C201 171 178 150 176 119C212 117 237 134 241 170Z" fill="#7fa84d" />
      <path d="M241 170L190 131" stroke="#1d6a4b" strokeWidth="2" strokeLinecap="round" />
    </g>
    <g style={{ transformOrigin: "243px 137px", scale: leaves, opacity: leaves }}>
      <path d="M243 142C247 103 269 80 303 77C302 115 281 141 243 142Z" fill="#1d6a4b" />
      <path d="M244 141L288 91" stroke="#c7da9d" strokeWidth="2" strokeLinecap="round" />
    </g>
    <path d="M240 227L232 240M240 227L247 240" stroke="#a6b894" strokeWidth="2" strokeLinecap="round" opacity={stem} />
  </svg>;
}
