export type TimelineEntry = { label: string; title: string; description: string };

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return <ol className="relative border-l border-[#a8b9ad] pl-7 sm:pl-10">{entries.map(entry => <li key={entry.label} className="relative pb-11 last:pb-0"><span className="absolute -left-[2.03rem] top-1.5 grid h-4 w-4 place-items-center rounded-full border-4 border-[#f7f5ee] bg-[#d5a53e] sm:-left-[2.78rem]"/><p className="text-[.68rem] font-extrabold uppercase tracking-[.15em] text-[#1e6685]">{entry.label}</p><h3 className="font-display mt-2 text-3xl leading-tight text-[#17342a]">{entry.title}</h3><p className="mt-3 max-w-xl leading-7 text-[#536b61]">{entry.description}</p></li>)}</ol>;
}
