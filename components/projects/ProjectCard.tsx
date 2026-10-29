import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import { Arrow } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
export function ProjectCard({ project }: { project: Project }) { const image = project.media?.[0]; return <Link href={`/projects/${project.slug}`} className="gbi-card-lift gbi-surface block h-full overflow-hidden">{image && <div className="relative aspect-[16/9] bg-[#e8e2d2]"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>}<div className="p-6 sm:p-7"><div className="flex items-start justify-between gap-4"><p className="text-[.67rem] font-extrabold uppercase tracking-[.14em] text-[#1e6685]">{project.category}</p><Badge tone="gold">{project.status}</Badge></div><h2 className="font-display mt-8 text-3xl leading-tight">{project.title}</h2><p className="mt-3 text-sm font-semibold text-[#536b61]">{project.location}</p><p className="mt-4 leading-7 text-[#536b61]">{project.summary}</p><span className="mt-7 flex items-center gap-2 text-sm font-bold text-[#17342a]">View project details <Arrow /></span></div></Link>; }
