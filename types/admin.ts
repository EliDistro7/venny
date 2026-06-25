export type PropertyType = "sale" | "rent";
export type PropertyCategory = "apartment" | "villa" | "house" | "land" | "commercial";
export type PropertyStatus = "delivered" | "work_in_progress";

export interface AdminProperty {
  _id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  videos?: string[];
  currency: string;
  type: PropertyType;
  category: PropertyCategory;
  bedrooms: number;
  bathrooms: number;
  area: number;
    availability?: "available" | "sold" | "rented" | "reserved";

  status: PropertyStatus;
  images: string[];
  featured: boolean;
  description: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormValues {
  title: string;
  location: string;
  city: string;
  price: string;
  videos?: string[];
  currency: string;
  type: PropertyType;
  category: PropertyCategory;
  bedrooms: string;
  bathrooms: string;
  area: string;
  status: PropertyStatus;
  featured: boolean;
  description: string;
  amenities: string; // comma-separated in the form, parsed on submit
}

export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}
