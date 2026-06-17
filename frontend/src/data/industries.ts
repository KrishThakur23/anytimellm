export type IndustrySEOData = {
  id: string;
  name: string;
  title: string;
  description: string;
  benefits: string[];
  features: string[];
};

export const industries: IndustrySEOData[] = [
  {
    id: "restaurants",
    name: "Restaurants",
    title: "WhatsApp AI for Restaurants",
    description: "Automate table bookings, take delivery orders, and answer menu questions 24/7 on WhatsApp.",
    benefits: [
      "No more missed orders during peak hours",
      "Instantly share digital menus",
      "Automated reservation management"
    ],
    features: ["Menu Ingestion", "Order Parsing", "Booking Confirmation"]
  },
  {
    id: "gyms",
    name: "Gyms & Fitness Centers",
    title: "WhatsApp AI for Gyms",
    description: "Handle membership inquiries, class schedules, and trial bookings automatically.",
    benefits: [
      "Convert inquiries into memberships instantly",
      "Share class schedules on demand",
      "Automate trial session bookings"
    ],
    features: ["Schedule Sync", "Lead Capture", "Membership FAQs"]
  },
  {
    id: "jewelers",
    name: "Jewelry Stores",
    title: "WhatsApp AI for Jewelers",
    description: "Showcase collections, schedule private viewings, and answer pricing queries securely.",
    benefits: [
      "Provide premium 24/7 concierge service",
      "Securely book in-store appointments",
      "Share latest catalog securely"
    ],
    features: ["High-Value Lead Routing", "Catalog Showcase", "Appointment Booking"]
  },
  {
    id: "schools",
    name: "Schools & Education",
    title: "WhatsApp AI for Schools",
    description: "Automate admissions inquiries, share fee structures, and handle parent FAQs effortlessly.",
    benefits: [
      "Reduce admin workload during admissions",
      "Provide instant answers to parents",
      "Automate fee reminders and circulars"
    ],
    features: ["Admissions Bot", "Document Sharing", "Parent Support"]
  }
];

export function getIndustry(id: string) {
  return industries.find(i => i.id === id);
}
