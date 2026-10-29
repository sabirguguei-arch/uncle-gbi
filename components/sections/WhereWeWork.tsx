const locations = [
  { name: "Duk County", label: "Food security and livelihoods" },
  { name: "Twic East County", label: "Water, sanitation and hygiene" },
  { name: "Aweil East", label: "WASH and agriculture" },
];

export function WhereWeWork() {
  return <section className="bg-[#113e31] px-5 py-20 text-white sm:px-10 lg:py-28"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="gbi-eyebrow text-[#f5e6bd]">WHERE WE WORK</p><h2 className="font-display mt-5 text-4xl leading-[1.06] sm:text-5xl">Grounded in South Sudan.</h2><p className="mt-6 max-w-md leading-7 text-white/72">Selected activities have taken place in the locations below.</p></div><div className="relative overflow-hidden border border-white/15 bg-[#1d6a4b] p-6 sm:p-8"><div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[32px] border-[#d5a53e]/15"/><div aria-hidden="true" className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full border-[26px] border-[#e1eff0]/10"/><div className="relative"><p className="text-[.68rem] font-extrabold uppercase tracking-[.15em] text-[#f5e6bd]">Selected locations</p><ul className="mt-8 divide-y divide-white/15">{locations.map((location, index) => <li key={location.name} className="grid gap-2 py-5 sm:grid-cols-[2rem_1fr_auto] sm:items-center"><span className="font-display text-2xl text-[#d5a53e]">0{index + 1}</span><strong className="font-display text-2xl font-normal">{location.name}</strong><span className="text-sm leading-5 text-white/70 sm:max-w-52">{location.label}</span></li>)}</ul></div></div></div></section>;
}
