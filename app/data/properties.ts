import { Property, Agent, Testimonial } from "../types";

export const properties: Property[] = [
  {
    id: 1,
    title: "Luxury Penthouse in Masaki",
    location: "Masaki Peninsula, Dar es Salaam",
    city: "Dar es Salaam",
    price: 2_210_000_000,
    currency: "TZS",
    type: "sale",
    category: "apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
     status: "delivered",
    image:
      "/featured/f1.jpeg",
    featured: true,
    description:
      "A stunning penthouse with panoramic views of the Indian Ocean. Features high-end finishes, a private rooftop terrace, and access to world-class amenities in the heart of Dar es Salaam's most prestigious neighborhood.",
    amenities: [
      "Ocean View",
      "Rooftop Terrace",
      "Swimming Pool",
      "24/7 Security",
      "Parking",
      "Generator",
    ],
  },
  {
    id: 2,
    title: "Modern Villa in Oyster Bay",
    location: "Oyster Bay, Dar es Salaam",
    city: "Dar es Salaam",
    price: 3_120_000_000,
    currency: "TZS",
    type: "sale",
    category: "villa",
    bedrooms: 5,
    status: "work_in_progress",
    bathrooms: 4,
    area: 480,
    image:
      "/featured/f2.jpeg",
    featured: true,
    description:
      "An architecturally striking villa set in lush tropical gardens steps from the beach. This home blends contemporary design with Swahili coastal living, featuring open-plan spaces and natural materials.",
    amenities: [
      "Private Pool",
      "Garden",
      "Gym",
      "Staff Quarters",
      "Backup Power",
      "Borehole",
    ],
  },
  {
    id: 3,
    title: "City Apartment in Kariakoo",
    location: "Kariakoo, Dar es Salaam",
    city: "Dar es Salaam",
    price: 4_680_000,
    currency: "TZS",
    type: "rent",
    category: "apartment",
    bedrooms: 2,
    status: "delivered",
    bathrooms: 1,
    area: 95,
    image:
      "/featured/f3.jpeg",
    featured: false,
    description:
      "A well-appointed apartment in the vibrant Kariakoo district. Close to markets, transport links, and amenities. Ideal for young professionals or small families.",
    amenities: ["Security", "Water Tank", "Parking", "Internet Ready"],
  },
  {
    id: 4,
    title: "Serene Retreat in Arusha",
    location: "Arusha Town Centre",
    city: "Arusha",
    price: 1_092_000_000,
    currency: "TZS",
    type: "sale",
    category: "house",
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    status: "delivered",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    featured: true,
    description:
      "A charming home set against the backdrop of Mount Kilimanjaro. Perfect for those who want proximity to the Northern Safari Circuit while enjoying urban conveniences.",
    amenities: [
      "Mountain View",
      "Garden",
      "Solar Power",
      "Borehole",
      "Carport",
    ],
  },
  {
    id: 5,
    title: "Beachfront Land, Zanzibar",
    location: "Nungwi, Zanzibar",
    city: "Zanzibar",
    price: 1_456_000_000,
    currency: "TZS",
    type: "sale",
    category: "land",
    bedrooms: 0,
    bathrooms: 0,
    area: 2000,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    featured: true,
    description:
      "A rare beachfront plot in Nungwi, Zanzibar's premier resort destination. Ideal for a boutique hotel, private villa, or resort development. Title deed available.",
    amenities: [
      "Direct Beach Access",
      "Title Deed",
      "Road Access",
      "Utilities Nearby",
    ],
  },
  {
    id: 6,
    title: "Commercial Space in CBD",
    location: "Central Business District, Dar es Salaam",
    city: "Dar es Salaam",
    price: 14_300_000,
    currency: "TZS",
    type: "rent",
    category: "commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 350,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    featured: false,
    description:
      "Prime office space in Dar es Salaam's CBD. Open-plan layout with modern fit-out, high-speed internet infrastructure, and excellent transport links.",
    amenities: [
      "Open Plan",
      "Reception",
      "Server Room",
      "Parking",
      "24/7 Access",
      "Generator",
    ],
  },
  {
    id: 7,
    title: "Garden Cottage in Mwanza",
    location: "Capri Point, Mwanza",
    city: "Mwanza",
    price: 2_210_000,
    currency: "TZS",
    type: "rent",
    category: "house",
    bedrooms: 2,
    bathrooms: 1,
    area: 110,
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    featured: false,
    description:
      "A cozy cottage with lake views in one of Mwanza's most desirable neighbourhoods. Well-maintained property with lush garden and easy access to the city.",
    amenities: ["Lake View", "Garden", "Water Tank", "Security"],
  },
  {
    id: 8,
    title: "New Build in Dodoma",
    location: "Chamwino, Dodoma",
    city: "Dodoma",
    price: 728_000_000,
    currency: "TZS",
    type: "sale",
    category: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 240,
    image:
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    featured: false,
    description:
      "A brand-new build in Tanzania's growing capital. Modern finishes, spacious layout, and excellent investment potential as Dodoma continues to develop.",
    amenities: ["New Build", "Solar Ready", "Borehole", "Perimeter Wall"],
  },
  {
    id: 9,
    title: "Stone Town Heritage House",
    location: "Stone Town, Zanzibar",
    city: "Zanzibar",
    price: 832_000_000,
    currency: "TZS",
    type: "sale",
    category: "house",
    bedrooms: 3,
    bathrooms: 2,
    area: 185,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    featured: false,
    description:
      "A beautifully restored Swahili-Arab townhouse in UNESCO-listed Stone Town. Original carved wooden doors, coral stone walls, and rooftop terrace with sea views.",
    amenities: ["Heritage Property", "Rooftop Terrace", "Sea View", "Central"],
  },
  {
    id: 10,
    title: "Residential Plot in Mbezi Beach",
    location: "Mbezi Beach, Dar es Salaam",
    city: "Dar es Salaam",
    price: 364_000_000,
    currency: "TZS",
    type: "sale",
    category: "land",
    bedrooms: 0,
    bathrooms: 0,
    area: 500,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    featured: false,
    description:
      "A well-positioned residential plot in the sought-after Mbezi Beach corridor. Close to international schools, shopping centres, and the Northern Beach Road. Title deed and survey plan available.",
    amenities: ["Title Deed", "Road Access", "Electricity Nearby", "Water Nearby"],
  },
  {
    id: 11,
    title: "Industrial Land in Kigamboni",
    location: "Kigamboni, Dar es Salaam",
    city: "Dar es Salaam",
    price: 910_000_000,
    currency: "TZS",
    type: "sale",
    category: "land",
    bedrooms: 0,
    bathrooms: 0,
    area: 3000,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&q=80",
    featured: false,
    description:
      "A large, level industrial plot on the Kigamboni peninsula, benefiting from proximity to the ferry crossing and ongoing infrastructure development. Ideal for a warehouse, logistics yard, or light manufacturing facility.",
    amenities: ["Large Area", "Road Access", "Near Ferry", "Title Deed"],
  },
  {
    id: 12,
    title: "Prime Corner Plot in Mikocheni",
    location: "Mikocheni, Dar es Salaam",
    city: "Dar es Salaam",
    price: 546_000_000,
    currency: "TZS",
    type: "sale",
    category: "land",
    bedrooms: 0,
    bathrooms: 0,
    area: 800,
    image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&q=80",
    featured: true,
    description:
      "A rare corner plot in the established Mikocheni neighbourhood, offering excellent visibility and dual road frontage. Suitable for a commercial building, mixed-use development, or a premium private residence.",
    amenities: ["Corner Plot", "Dual Road Frontage", "Title Deed", "Utilities Connected"],
  },
  {
    id: 13,
    title: "Agricultural Land, Chamwino Outskirts",
    location: "Chamwino, Dodoma",
    city: "Dodoma",
    price: 182_000_000,
    currency: "TZS",
    type: "sale",
    category: "land",
    bedrooms: 0,
    bathrooms: 0,
    area: 10000,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    featured: false,
    description:
      "A vast, flat agricultural plot on the outskirts of Chamwino, Dodoma. Fertile red soil with seasonal water access. Well-suited for large-scale farming, poultry, or agribusiness investment.",
    amenities: ["Fertile Soil", "Seasonal Water", "Road Access", "Large Plot"],
  },
  {
    id: 14,
    title: "Serviced Plot near Parliament, Dodoma",
    location: "Dodoma City Centre",
    city: "Dodoma",
    price: 273_000_000,
    currency: "TZS",
    type: "sale",
    category: "land",
    bedrooms: 0,
    bathrooms: 0,
    area: 650,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    featured: false,
    description:
      "A fully serviced residential plot minutes from the Parliament buildings and government offices in Tanzania's capital. Water, electricity, and tarmac road access already in place. Strong investment potential in a rapidly growing city.",
    amenities: ["Serviced Plot", "Electricity Connected", "Water Connected", "Tarmac Road"],
  },
];

export const agents: Agent[] = [
  {
    id: 1,
    name: "Amina Mwangi",
    role: "Senior Property Consultant",
    phone: "+255 712 345 678",
    email: "amina@nyumbatz.co.tz",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    listings: 24,
  },
  {
    id: 2,
    name: "Joseph Kimaro",
    role: "Luxury & Commercial Specialist",
    phone: "+255 754 987 321",
    email: "joseph@nyumbatz.co.tz",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    listings: 31,
  },
  {
    id: 3,
    name: "Fatuma Hassan",
    role: "Zanzibar Property Expert",
    phone: "+255 778 654 432",
    email: "fatuma@nyumbatz.co.tz",
    image:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80",
    listings: 18,
  },
  
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "David Ochieng",
    location: "Nairobi, Kenya",
    message:
      "NyumbaTZ made buying our vacation home in Zanzibar effortless. Fatuma was knowledgeable, patient, and handled all the paperwork on our behalf.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rehema Salehe",
    location: "Dar es Salaam",
    message:
      "I was relocating from Mwanza and needed to find an apartment quickly. Joseph found me the perfect place in Masaki within a week. Incredible service.",
    rating: 5,
  },
  {
    id: 3,
    name: "Michael Thompson",
    location: "London, UK",
    message:
      "As a foreign investor, I was nervous about buying property in Tanzania. Amina and the team guided me through every step and I now own a beautiful villa in Oyster Bay.",
    rating: 5,
  },
];

export const cities = [
  "All Cities",
  "Dar es Salaam",
  "Zanzibar",
  "Arusha",
  "Mwanza",
  "Dodoma",
];
export const propertyTypes = [
  "All Types",
  "apartment",
  "villa",
  "house",
  "land",
  "commercial",
];


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function normalize(doc: any): Property {
  return { ...doc, id: doc._id, image: doc.images?.[0] || "" } as Property;
}

export async function getProperties(params?: {
  city?: string; type?: string; category?: string; featured?: boolean;
}): Promise<Property[]> {
  const query = new URLSearchParams();
  if (params?.city) query.set("city", params.city);
  if (params?.type) query.set("type", params.type);
  if (params?.category) query.set("category", params.category);
  if (params?.featured !== undefined) query.set("featured", String(params.featured));

  const res = await fetch(`${API_URL}/api/properties?${query.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return (await res.json()).map(normalize);
}

export async function getProperty(id: string): Promise<Property | null> {
  const res = await fetch(`${API_URL}/api/properties/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return normalize(await res.json());
}
export const dealTypes = ["All", "sale", "rent"];