export interface Property {
  id: number;
  title: string;
  location: string;
  city: string;
  price: number;
  currency: string;
  type: "sale" | "rent";
  category: "apartment" | "villa" | "land" | "commercial" | "house";
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  featured: boolean;
  description: string;
  amenities: string[];
}

export interface Agent {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
  listings: number;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  message: string;
  rating: number;
}
