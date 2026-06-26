/**
 * lib/content.ts
 * Server-side helper — call from async server components or generateStaticParams.
 * Never import this in a client component.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface HeroContent {
  eyebrow: string;
  headingLine1: string;
  headingAccent: string;
  headingLine3: string;
  subheading: string;
  searchPlaceholder: string;
  scrollLabel: string;
  decorativeWord1: string;
  decorativeWord2: string;
  backgroundImage: string;
}

export interface StatsContent {
  items: { num: string; label: string }[];
}

export interface WhyUsCard {
  icon: "Shield" | "Users" | "TrendingUp";
  title: string;
  desc: string;
}

export interface WhyUsContent {
  eyebrow: string;
  heading: string;
  cards: WhyUsCard[];
}

export interface CtaContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
}

export interface FeaturedContent {
  eyebrow: string;
  heading: string;
  viewAllLabel: string;
}

export interface LocationsContent {
  eyebrow: string;
  heading: string;
}

export interface SiteContent {
  hero: HeroContent;
  stats: StatsContent;
  whyus: WhyUsContent;
  cta: CtaContent;
  featured: FeaturedContent;
  locations: LocationsContent;
  [key: string]: unknown;
}

/**
 * Fetch all content blocks in one request.
 * Returns a typed map. Falls back to an empty object on error so the page
 * can still render with hardcoded fallbacks if the API is down.
 */
export async function getAllContent(): Promise<Partial<SiteContent>> {
  try {
    const res = await fetch(`${API_URL}/api/content`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Content API ${res.status}`);

    const data = await res.json();         // read once
    console.log("all content:", data);     // inspect the shape

    // Your API wraps the payload in { data: ... } — unwrap it
    return (data.data ?? data) as Partial<SiteContent>;
  } catch (err) {
    console.error("[content] Failed to fetch:", err);
    return {};
  }
}

/**
 * Fetch a single content block by key.
 */
export async function getContent<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}/api/content/${key}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}