import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, BadgeCheck, Check, Clock3 } from "lucide-react";
import { Lift, Reveal, ServiceIcon } from "./ui";
import { type Service, formatMoney, professionals } from "@/lib/catalog";
export function ServiceCard({ service, detailed = false }: { service: Service; detailed?: boolean }) {
  return <Lift className={`box_section service-card ${detailed ? "service-card-detailed" : ""}`}><div className="service-card-top"><span className="service-icon"><ServiceIcon name={service.icon}/></span>{service.label && <span className="mini-label">{service.label}</span>}<Link href={`/services/${service.slug}`} className="service-details-link" aria-label={`View ${service.name} details`}><ArrowUpRight size={19}/></Link></div><h3><Link href={`/services/${service.slug}`}>{service.name}</Link></h3><p>{service.short}</p>{detailed && <><ul className="included-list">{service.included.slice(0, 3).map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul><Link className="text-link" href={`/services/${service.slug}`}>What is included <ArrowRight size={15}/></Link></>}<div className="service-card-bottom"><div><span>Starting from</span><strong>{formatMoney(service.prices[0])}</strong></div><Link className="book-link" href={`/booking?service=${service.id}`}>Book now <ArrowUpRight size={15}/></Link></div></Lift>;
}
export function ProfessionalCard({ person, index = 0 }: { person: typeof professionals[number]; index?: number }) {
  return <Reveal delay={index * .07} className="professional-card"><div className="professional-photo"><Image src={person.photo} alt="Illustrative portrait photographed in Nairobi, not an actual staff member" fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 44vw, 280px"/><span className="photo-label">Illustrative profile</span></div><div className="professional-info"><div className="pro-title"><h3>{person.name}</h3><BadgeCheck size={19} aria-label="Sample vetting badge"/></div><p>{person.service} specialist</p><div className="pro-stats"><span><strong>{person.rating}</strong> / 5 rating</span><span>{person.jobs} jobs</span></div><div className="pro-availability"><span className={person.available ? "status-dot" : "status-dot unavailable"}/>{person.available ? "Sample: available this week" : "Sample: next week"}</div><Link href={`/booking?service=${person.serviceId}`} className="text-link">Book this service <ArrowRight size={16}/></Link></div></Reveal>;
}
export function SectionHeading({ eyebrow, first, second, description, centered = false }: { eyebrow: string; first: string; second: string; description?: string; centered?: boolean }) {
  return <div className={`section-heading ${centered ? "centered" : ""}`}><span className="eyebrow">{eyebrow}</span><h2 className={centered ? "choose_taital" : "services_taital"}><span>{first}</span> {second}</h2>{description && <p>{description}</p>}</div>;
}
export function BookingAssurances() {
  return <div className="booking-assurances"><span><BadgeCheck size={17}/> Vetted professionals</span><span><Clock3 size={17}/> 2-hour response</span><span><Check size={17}/> Pay after the job</span></div>;
}
