
import { ServiceItem, PricingTier, TeamMember, CaseStudy, BusinessPillar } from './types';

export const PILLARS: BusinessPillar[] = [
  {
    title: "Brand Environments",
    tagline: "Atmosphere as strategy.",
    image: "/src/assets/enviroment.jpeg"
  },
  {
    title: "Lifestyle & Culture",
    tagline: "Brands live where people move.",
    image: "/src/assets/lifestyle.jpeg"
  },
  {
    title: "Product & Detail",
    tagline: "Designed objects, placed with intention.",
    image: "/src/assets/product-detail.jpeg"
  },
  {
    title: "Wellness & Movement",
    tagline: "Modern wellness as a brand language.",
    image: "/src/assets/wellness-photo.jpeg"
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    category: "Luxury Wellness / Beauty",
    brands: "Luxury Wellness Brand — Dubai · Boutique Spa Experience — Santa Fe",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
    ],
    videoUrls: [
      "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTYyOTc3MTI1OTY5NDkz?story_media_id=3722166529983960649&igsh=dzV4eGJleXNyNndr",
      "https://www.instagram.com/p/DQ5GvX2EsZF/embed"
    ],
    context: "These wellness brands required elevated content that reflected their environment, values, and clientele — without overproduced or misaligned marketing.",
    role: "FORM led content creation with a focus on conversion through trust: clean visuals, intentional pacing, and a luxury feel that aligned with the in-person experience.",
    strategy: "Prioritized brand feeling over volume. Focused on visual trust and clarity. Created content designed to convert aligned clients, not everyone.",
    outcome: "Stronger brand perception. Increased conversion through trust-based content. Content assets reusable across platforms.",
    why: "In luxury wellness, conversion follows credibility. The strategy focused on restraint, not noise."
  },
  {
    category: "Fitness Studio / Movement",
    brands: "Studio 14 — Dubai",
    images: [
      "https://images.unsplash.com/photo-1518611012118-29a8d63ee0c2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
    ],
    context: "The studio sought to strengthen community, visibility, and brand alignment beyond traditional fitness marketing.",
    role: "FORM acted as both strategist and brand ambassador — creating content, attending events, and intentionally bringing aligned women into the ecosystem.",
    strategy: "Focused on community-driven conversion. Elevated the studio as a lifestyle space, not just workouts. Used organic content to support events and retention.",
    outcome: "Increased brand visibility. Stronger sense of community. Consistent content supporting events and engagement.",
    why: "Fitness brands grow when people feel they belong. FORM prioritized community over campaigns."
  },
  {
    category: "Community Product / Cause-Driven",
    brands: "The Paw Collection — Las Vegas · Albuquerque · Dubai",
    images: [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=800"
    ],
    context: "The Paw Collection was built as a community-first brand blending product, lifestyle, and purpose.",
    role: "FORM founded and led every aspect — from strategy and systems to community activation and conversion-focused marketing.",
    strategy: "Built community before scaling ads. Positioned the brand around lifestyle + cause. Converted social content into paid ads and sales systems.",
    outcome: "Strong brand identity. Active community. Clear conversion pathways. Scalable systems for growth.",
    why: "Sustainable brands convert because people trust them. Community was the strategy."
  },
  {
    category: "Personal Brand / Mindset / Education",
    brands: "Gamma x Rhythm — Seattle · Las Vegas",
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    ],
    context: "Gamma x Rhythm required structure, clarity, and positioning to translate mindset education into a scalable brand.",
    role: "FORM built the brand architecture — shaping content, systems, and messaging to support education, conversion, and longevity.",
    strategy: "Created clear educational pathways. Built systems before scaling traffic. Positioned the brand for long-term relevance.",
    outcome: "Clear brand positioning. Structured education system. Strong foundation for growth and ads.",
    why: "Education brands succeed when structure supports the message. FORM built both."
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: "Visual Sovereignty",
    items: [
      "Signature Brand Identity & Market Positioning",
      "Design Systems & Visual Standards",
      "Boutique Commerce Architecture"
    ]
  },
  {
    id: 2,
    title: "Community Ecosystems",
    items: [
      "Retention-Focused Communication Flows",
      "Community-Centric Growth Frameworks",
      "High-Vibration Content Production"
    ]
  },
  {
    id: 3,
    title: "Strategic Direction",
    items: [
      "Brand Integrity Audits",
      "Offer Refinement & Value Design",
      "Go-to-Market Strategy"
    ]
  }
];

export const PRICING: PricingTier[] = [
  {
    name: "The Identity Foundation",
    description: "Establishing visual authority for emerging founders.",
    startup: "",
    growth: "",
    premium: "",
    features: ["Core Value Architecture", "Brand Narrative", "Visual Identity System", "Creative Direction", "Tactical Execution Roadmap"]
  },
  {
    name: "The Digital Flagship",
    description: "A high-performance commerce destination designed for desirability.",
    startup: "",
    growth: "",
    premium: "",
    features: ["End-to-End Commerce Build", "Search Authority Optimization", "Responsive Experience Design", "High-Conversion Styling", "Seamless Transactional Flow"]
  }
];

export const TEAM: TeamMember[] = [
  {
    name: "Tamyra Simpson",
    role: "Founder & Creative Director",
    bio: "Tamyra Simpson, Founder of FORM, orchestrates global brand transformations through a unique lens of athletic discipline and international sophistication. Her leadership—informed by a collegiate sports background and refined in the visionary landscape of Dubai—emphasizes intentionality, strategic composure, and the seamless integration of wellness into high-level commerce.\n\nShe specializes in guiding founders toward sustainable, high-vibration growth, architecting brand legacies that balance ambitious expansion with profound clarity and ease. Her mission is to ensure that every project honors the authentic soul of the brand while achieving undeniable commercial authority.",
    strengths: ["Creative Orchestration", "Experiential Strategy", "Market Positioning"],
    image: "WhatsApp Image 2026-01-02 at 21.40.18.jpeg"
  }
];

export const BRAND_VALUES = [
  "Aesthetic Precision",
  "Strategic Prescience",
  "Community-Led Prosperity",
  "Visionary Leadership",
  "High-Vibration Integrity",
  "Intention Over Volume"
];
