
export interface ServiceItem {
  id: number;
  title: string;
  items: string[];
}

export interface PricingTier {
  name: string;
  description: string;
  startup: string;
  growth: string;
  premium: string;
  features: string[];
}

export interface CaseStudy {
  category: string;
  brands: string;
  images: string[];
  context: string;
  role: string;
  strategy: string;
  outcome: string;
  why: string;
  videoUrls?: string[];
}

export interface BusinessPillar {
  title: string;
  tagline: string;
  image: string;
}

export interface TeamMember {
  name: string;
  role: string;
  strengths: string[];
  bio: string;
  image: string;
}

export interface Testimonial {
  name: string;
  company: string;
  quote: string;
  image?: string;
}
