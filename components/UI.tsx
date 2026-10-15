import { ArrowDown, ArrowUpRight } from 'lucide-react';
export function CTA({compact=false}:{compact?:boolean}){return <a className="button" href="#consultation">{compact?'Get My Free Checklist':'Get My Free Checklist + Demo'}<ArrowUpRight size={19}/></a>}
export function SectionTitle({eyebrow,title,ne,children}:{eyebrow:string,title:string,ne:string,children?:React.ReactNode}){return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children}</div>}
