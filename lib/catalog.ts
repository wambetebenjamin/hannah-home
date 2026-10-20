export type Service = {
  id: string; slug: string; name: string; category: string; short: string;
  description: string; included: string[]; exclusions: string; expect: string[];
  prices: [number, number, number]; hours: [number, number, number]; icon: string; label?: string;
};
export const services: Service[] = [
  {
    id: "house-cleaning", slug: "house-cleaning", name: "House Cleaning", category: "Cleaning", icon: "brush", label: "Most booked",
    short: "A fresh home, without losing your weekend.",
    description: "Give your everyday spaces a little care. Our routine clean takes care of the dust, floors and surfaces, so you can come home to a space that feels like you again.",
    included: ["Dusting furniture and accessible surfaces", "Vacuuming and mopping every room", "Kitchen counters, sink and hob", "Bathroom and toilet sanitisation", "Making beds and emptying bins"],
    exclusions: "Inside appliances, exterior windows and specialist stain removal are not included. Cleaning supplies are included. Please provide access to water and electricity.",
    expect: ["Your professional calls before arriving.", "Walk through your priorities together.", "We clean room by room using our own supplies.", "Check the work together, then pay when the job is done."],
    prices: [2500, 3500, 4500], hours: [2, 3, 4],
  },
  {
    id: "deep-cleaning", slug: "deep-cleaning", name: "Deep Cleaning", category: "Cleaning", icon: "spray",
    short: "A proper reset, right down to the details.",
    description: "A more thorough clean for move-ins, a new season or the corners that need extra attention. We work through built-up grime and overlooked surfaces, leaving your home ready for a fresh start.",
    included: ["Everything in a routine house clean", "Skirting boards, door frames and switches", "Degreasing kitchen surfaces", "Interior windows within safe reach", "Detailed bathroom descaling"],
    exclusions: "Post-construction debris, hazardous materials and high external windows require a separate quote. Heavy furniture is not moved.",
    expect: ["We confirm the areas needing special attention.", "Protect nearby furniture and belongings.", "A thorough clean follows a room-by-room checklist.", "A final walk-through is completed before payment."],
    prices: [5000, 7000, 9000], hours: [4, 5, 6],
  },
  {
    id: "plumbing", slug: "plumbing", name: "Plumbing", category: "Repairs", icon: "wrench",
    short: "Leaky taps and blocked drains, sorted.",
    description: "Get everyday plumbing problems diagnosed and repaired by a skilled professional. From a dripping kitchen tap to a troublesome toilet, we explain the fix before starting work.",
    included: ["Diagnosis of the reported problem", "Minor tap, toilet or waste-pipe repair", "Basic drain clearing", "Leak testing after the repair", "Tidying the work area"],
    exclusions: "Prices cover labour for one minor repair per bedroom package. Replacement parts, excavation and major pipework require your approval of a separate quote.",
    expect: ["Show the professional the issue and isolation valve.", "Receive a diagnosis and any parts quote.", "Approve the work before repairs begin.", "Test the repair together before paying."],
    prices: [1500, 2500, 3500], hours: [1, 2, 3],
  },
  {
    id: "electrical", slug: "electrical", name: "Electrical", category: "Repairs", icon: "plug",
    short: "Safe fixes for a brighter, better home.",
    description: "For small household electrical repairs and installations. A qualified professional checks the issue, isolates the supply and completes the work with safety in mind.",
    included: ["Fault assessment and safety checks", "Minor socket, switch or light fitting work", "One small repair per package room", "Testing of repaired circuits", "Basic care and safety advice"],
    exclusions: "Rewiring, certificates, new circuits and replacement fittings are quoted separately. This is not an emergency response service.",
    expect: ["We inspect the fault and confirm the work scope.", "The affected supply is safely isolated.", "Repairs are completed and tested.", "Review the result and pay after completion."],
    prices: [1800, 3000, 4200], hours: [1, 2, 3],
  },
  {
    id: "painting", slug: "painting", name: "Painting", category: "Home Improvement", icon: "paint",
    short: "New colour. A whole new feeling.",
    description: "Refresh your home with careful preparation and a clean interior finish. Choose your room package and we will confirm wall condition, area and paint requirements before the day.",
    included: ["Protection of floors and furniture", "Light filling and surface preparation", "Two coats on standard interior walls", "Neat cutting-in at edges", "Work area cleanup"],
    exclusions: "Labour starting price for standard rooms up to 12 square metres each. Paint, ceilings, major wall repairs and extra surface area are quoted and approved separately.",
    expect: ["Agree colours, paint supply and room sizes.", "Cover furniture and prepare the walls.", "Apply paint with appropriate drying time.", "Review the finish in daylight before paying."],
    prices: [6000, 11000, 15000], hours: [4, 6, 8],
  },
  {
    id: "carpentry", slug: "carpentry", name: "Carpentry", category: "Home Improvement", icon: "hammer",
    short: "Thoughtful repairs for the things you love.",
    description: "Give your furniture and fittings a longer life. Our carpentry visit covers small repairs, adjustments and assembly, with an agreed scope before any work begins.",
    included: ["Assessment of furniture or fittings", "Door and cabinet adjustments", "Minor furniture repair or assembly", "One small task per package room", "Cleanup and care recommendations"],
    exclusions: "Custom builds, structural work, timber, hardware and replacement panels are quoted separately.",
    expect: ["Share the problem and desired result.", "Approve the repair approach and any parts.", "We repair or assemble with care.", "Inspect stability and finish together."],
    prices: [2000, 3500, 5000], hours: [2, 3, 4],
  },
  {
    id: "pest-control", slug: "pest-control", name: "Pest Control", category: "Specialist Care", icon: "bug",
    short: "Unwelcome guests? We can help.",
    description: "A targeted inspection and treatment for common household crawling pests. We explain preparation, product safety and re-entry instructions before treatment.",
    included: ["Inspection of affected rooms", "Targeted treatment for crawling pests", "Entry-point and prevention advice", "Written re-entry instructions", "Follow-up guidance"],
    exclusions: "Termites, bedbugs, rodents and repeat visits need a specialist quote. Follow safety advice for children, pets and food storage.",
    expect: ["Confirm the pest and household safety needs.", "Prepare rooms as instructed before arrival.", "Leave the treatment area during application.", "Return only after the specified safe interval."],
    prices: [4000, 5500, 7000], hours: [2, 3, 4],
  },
  {
    id: "appliance-repair", slug: "appliance-repair", name: "Appliance Repair", category: "Specialist Care", icon: "washer",
    short: "Get your everyday essentials working again.",
    description: "A diagnostic visit for your washing machine, cooker or refrigerator. We identify the fault and give you a clear repair quote, so you can decide what is right for your home.",
    included: ["Appliance fault diagnosis", "One appliance per package room", "Minor adjustment where possible", "Clear parts and repair quote", "Safety check and care advice"],
    exclusions: "Starting prices cover diagnosis and minor labour only. Replacement parts, refrigerant, major repairs and warranty work are not included.",
    expect: ["Tell us the model and what is happening.", "The professional performs a diagnostic check.", "Approve any additional repair or parts quote.", "Test operation together before payment."],
    prices: [2000, 3500, 5000], hours: [1, 2, 3],
  },
];
export const categories = ["All services", "Cleaning", "Repairs", "Home Improvement", "Specialist Care"] as const;
export const packageIds = ["1-bedroom", "2-bedroom", "3-bedroom"] as const;
export const packageLabels = ["1 bedroom", "2 bedroom", "3 bedroom"];
export const slots = ["08:00", "10:00", "13:00", "15:00"] as const;
export const getService = (id: string) => services.find(s => s.id === id || s.slug === id);
export const formatMoney = (amount: number) => `KSh ${amount.toLocaleString("en-KE")}`;
export const formatTime = (time: string) => { const h = Number(time.split(":")[0]); return `${h % 12 || 12}:00 ${h < 12 ? "am" : "pm"}`; };
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" }).format(new Date(`${date}T12:00:00+03:00`));
}
// Illustrative profiles only. Replace with consented, vetted records before launch.
export const professionals = [
  { id: "grace", name: "Grace Wanjiku", service: "House Cleaning", serviceId: "house-cleaning", category: "Cleaning", rating: "4.9", jobs: 186, experience: "5 years", available: true, photo: "/images/professional-grace.jpg" },
  { id: "james", name: "James Otieno", service: "Plumbing", serviceId: "plumbing", category: "Repairs", rating: "4.8", jobs: 142, experience: "8 years", available: true, photo: "/images/professional-james.jpg" },
  { id: "faith", name: "Faith Njeri", service: "Deep Cleaning", serviceId: "deep-cleaning", category: "Cleaning", rating: "4.9", jobs: 213, experience: "6 years", available: false, photo: "/images/professional-faith.jpg" },
  { id: "brian", name: "Brian Mwangi", service: "Electrical", serviceId: "electrical", category: "Repairs", rating: "4.8", jobs: 128, experience: "4 years", available: true, photo: "/images/professional-brian.jpg" },
];
