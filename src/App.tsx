
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { SERVICES, PRICING, TEAM, CASE_STUDIES } from './constants';
import AIAssistant from './components/AIAssistant';
import BookingForm from './components/BookingForm';
import HeroImage from './assets/hero-1.jpeg';
import FounderPhoto from './assets/founder-photo.jpeg';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a slight timeout to ensure content is rendered if navigating from another page
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname, hash]);

  return null;
};

const Logo: React.FC<{ className?: string, textSize?: string }> = ({ className = "", textSize = "text-2xl" }) => (
  <div className={`inline-flex bg-white px-3 py-1 items-baseline justify-center shadow-sm select-none ${className}`}>
    <span className={`text-black font-[900] tracking-tighter leading-none flex items-baseline ${textSize}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      FORM<span className="text-[#cc3333] ml-[-0.02em]">.</span>
    </span>
  </div>
);

const Header: React.FC = () => (
  <header className="sticky top-0 z-40 bg-[#4a0000] border-b border-white/10 backdrop-blur-md bg-opacity-95">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <Link to="/" className="hover:opacity-90 transition-opacity">
        <Logo textSize="text-3xl" />
      </Link>
      <nav className="hidden md:flex space-x-8 text-white uppercase tracking-[0.2em] text-[10px] font-bold">
        <Link to="/" className="hover:text-gray-300 transition-colors">HOME</Link>
        <Link to="/about" className="hover:text-gray-300 transition-colors">ABOUT US</Link>
        <Link to="/case-studies" className="hover:text-gray-300 transition-colors">CASE STUDY</Link>
      </nav>
      <Link
        to="/#booking"
        className="bg-white text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 hover:bg-gray-200 hover:scale-105 active:scale-95"
      >
        Inquire
      </Link>
    </div>
  </header>
);

const Hero: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const checkAndGenerateVideo = async () => {
    if (isGenerating || videoUrl) return;

    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      return;
    }

    setIsGenerating(true);
    setLoadingText("Curating brand vision...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const loadingMessages = [
        "Capturing cinematic essence...",
        "Selecting timeless imagery...",
        "Refining the luxury aesthetic..."
      ];

      let msgIndex = 0;
      const interval = setInterval(() => {
        setLoadingText(loadingMessages[msgIndex % loadingMessages.length]);
        msgIndex++;
      }, 7000);

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'Cinematic montage of luxury lifestyle: architectural villas, soft linen textures, high-end skincare, and serene holistic living rituals. Timeless, ethereal light, professional cinematography.',
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      clearInterval(interval);

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await fetchRes.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    checkAndGenerateVideo();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#4a0000]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-25 scale-105"
          />
        ) : (
          <img
            src={HeroImage}
            alt="background"
            className="w-full h-full object-cover object-center opacity-50 filter grayscale"
          />
        )}
        <div className="absolute inset-0 bg-[#4a0000]/30 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a0000]/60 via-[#4a0000]/20 to-[#4a0000]/60"></div>
      </div>

      <div className="relative z-10 max-w-5xl">
        <h2 className="text-white uppercase tracking-[0.6em] text-[10px] mb-12 font-bold opacity-70">Aesthetic Precision · Strategic Prescience · Performance</h2>
        <div className="flex justify-center mb-10">
          <Logo textSize="text-7xl md:text-9xl" className="px-8 py-5 md:px-14 md:py-8 shadow-2xl hover:scale-105 transition-transform duration-700" />
        </div>
        <h1 className="text-white text-4xl md:text-7xl serif mb-8 tracking-tighter leading-[1.1] text-balance">ARCHITECTING INEVITABLE <br /> BRAND AUTHORITY</h1>
        <p className="text-white text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 opacity-90 leading-relaxed italic">
          We curate elegant narratives and timeless aesthetics, bridging the gap between high-vibrational vision and strategic commercial performance.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/about" className="bg-white text-black px-12 py-4 font-bold uppercase tracking-widest text-[11px] transition-all hover:scale-105 shadow-xl">About Us</Link>
          <Link to="/case-studies" className="border border-white text-white px-12 py-4 font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-white hover:text-black">Case Studies</Link>
        </div>

        {isGenerating && (
          <div className="mt-12 flex flex-col items-center">
            <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin mb-4 opacity-50"></div>
            <p className="text-white text-[9px] uppercase tracking-[0.4em] animate-pulse opacity-50">{loadingText}</p>
          </div>
        )}
      </div>
    </section>
  );
};

const PortfolioSection: React.FC = () => (
  <section id="portfolio" className="py-24 px-6 bg-white text-black">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div>
          <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-[#4a0000] mb-4 block">Selected Worlds</span>
          <h2 className="text-5xl md:text-6xl serif italic">The Portfolio</h2>
        </div>
        <Link to="/case-studies" className="text-[10px] font-bold uppercase tracking-[0.3em] border-b-2 border-black pb-1 hover:opacity-60 transition-opacity mt-8 md:mt-0">View Full Case Studies</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CASE_STUDIES.map((item, idx) => (
          <Link to="/case-studies" key={idx} className="group cursor-pointer">
            <div className="aspect-[4/5] overflow-hidden mb-6 bg-gray-100 grayscale hover:grayscale-0 transition-all duration-700">
              <img src={item.images[0]} alt={item.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-1">{item.category}</h4>
            <p className="text-[10px] uppercase tracking-widest text-[#4a0000] font-medium opacity-60 italic">{item.brands.split('·')[0]}</p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const ServicesSection: React.FC = () => (
  <section id="services" className="py-24 px-6 bg-white text-black border-t border-gray-100">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="uppercase tracking-[0.5em] text-[10px] font-bold text-[#4a0000] mb-4 block">Our Offering</span>
        <h2 className="text-6xl serif mb-8 italic">Strategic Solutions</h2>
      </div>
      <div className="grid lg:grid-cols-3 gap-0 border border-gray-100">
        {SERVICES.map((service, idx) => (
          <div key={idx} className={`p-12 transition-colors hover:bg-[#4a0000] hover:text-white group ${idx !== 2 ? 'border-b lg:border-b-0 lg:border-r border-gray-100' : ''}`}>
            <span className="text-4xl serif mb-8 block opacity-10 group-hover:opacity-20 transition-opacity">0{idx + 1}</span>
            <h3 className="text-3xl serif mb-8 leading-tight">{service.title}</h3>
            <ul className="space-y-4">
              {service.items.map((item, i) => (
                <li key={i} className="text-[10px] uppercase tracking-widest leading-relaxed flex items-start gap-3">
                  <span className="text-[#cc3333] group-hover:text-white transition-colors">/</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection: React.FC = () => (
  <section id="pricing" className="py-24 px-6 bg-gray-50 text-black">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl serif mb-4 italic">Strategic Investment</h2>
        <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#4a0000]">Options for Impact & Expansion</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        {PRICING.map((tier, idx) => (
          <div key={idx} className="bg-white rounded-sm overflow-hidden shadow-2xl border border-gray-100 p-1">
            <div className="bg-[#4a0000] text-white p-12">
              <h3 className="text-3xl serif mb-4">{tier.name}</h3>
              <p className="text-sm opacity-80 italic">"{tier.description}"</p>
            </div>
            <div className="p-12">
              <h4 className="uppercase tracking-widest text-[9px] font-bold text-gray-400 mb-8">The Experience Includes</h4>
              <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                {tier.features.map((f, i) => (
                  <li key={i} className="text-[10px] uppercase tracking-widest text-gray-700 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#4a0000] rounded-full"></div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage: React.FC = () => (
  <>
    <Hero />
    <PortfolioSection />
    <ServicesSection />
    <PricingSection />
  </>
);

const CaseStudyPage: React.FC = () => (
  <section className="bg-white min-h-screen text-black overflow-hidden">
    {/* SECTION 1 — HERO */}
    <div className="pt-48 pb-32 px-6 max-w-7xl mx-auto">
      <div className="max-w-4xl">
        <h1 className="text-6xl md:text-8xl serif italic tracking-tighter leading-none mb-8">
          Strategic brand elevation rooted in conversion, clarity, and longevity.
        </h1>
        <p className="text-xl md:text-2xl font-light opacity-70 mb-8 max-w-2xl leading-relaxed">
          FORM partners with founders and brands to build systems, community, and conversion-led positioning — quietly and intentionally.
        </p>
        <p className="uppercase tracking-[0.4em] text-[9px] font-bold opacity-40 mb-12">
          Dubai · Albuquerque · Las Vegas · Seattle
        </p>
        <Link to="/#booking" className="inline-block bg-[#700c0c] text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-xl">
          Apply to Work with FORM
        </Link>
      </div>
    </div>

    {/* SECTION 2 — HOW TO READ */}
    <div className="py-24 px-6 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm italic opacity-60 leading-relaxed">
          These flagship studies are curated examples of strategic orchestration. We prioritize depth over volume, and intentionality over noise. Read them as blueprints for brand sovereignty.
        </p>
      </div>
    </div>

    {/* SECTION 3 — FLAGSHIP CASE STUDIES */}
    <div className="max-w-7xl mx-auto py-32 px-6 space-y-64">
      {CASE_STUDIES.map((cs, idx) => (
        <div key={idx} className="group">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-[#700c0c] mb-4 block">Case Study 0{idx + 1}</span>
              <h2 className="text-4xl md:text-5xl serif italic leading-tight mb-4">{cs.category}</h2>
              <p className="text-sm opacity-50 italic mb-12">{cs.brands}</p>

              <div className="space-y-12 pr-12">
                <div>
                  <h4 className="uppercase tracking-widest text-[10px] font-bold mb-3 opacity-30">Context</h4>
                  <p className="text-base font-light leading-relaxed">{cs.context}</p>
                </div>
                <div>
                  <h4 className="uppercase tracking-widest text-[10px] font-bold mb-3 opacity-30">FORM's Role</h4>
                  <p className="text-base font-light leading-relaxed">{cs.role}</p>
                </div>
                <div>
                  <h4 className="uppercase tracking-widest text-[10px] font-bold mb-3 opacity-30">Strategy Decisions</h4>
                  <p className="text-base font-light leading-relaxed">{cs.strategy}</p>
                </div>
                <div className="pt-8 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="uppercase tracking-widest text-[10px] font-bold mb-3 opacity-30">Outcome</h4>
                      <p className="text-xs italic leading-relaxed opacity-70">{cs.outcome}</p>
                    </div>
                    <div>
                      <h4 className="uppercase tracking-widest text-[10px] font-bold mb-3 opacity-30">Why This Worked</h4>
                      <p className="text-xs italic leading-relaxed opacity-70">{cs.why}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4">
                {cs.images.map((img, i) => (
                  <div key={i} className={`overflow-hidden bg-gray-100 ${i === 1 ? 'mt-12' : ''}`}>
                    <img src={img} alt="Visual context" className="w-full h-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-[2s]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* SECTION 4 — ADDITIONAL BRAND EXPERIENCE */}
    <div className="bg-gray-50 py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-xs uppercase tracking-[0.5em] font-bold text-center mb-16 opacity-40">Additional Brand Experience</h3>
        <ul className="space-y-6 text-center">
          <li className="text-lg serif italic opacity-70">Luxury fashion & beauty brands (Someri — positioning, line sheets, ads)</li>
          <li className="text-lg serif italic opacity-70">Boutique real estate & property brands (Subarashi — strategy, systems)</li>
          <li className="text-lg serif italic opacity-70">Wellness & lifestyle studios</li>
          <li className="text-lg serif italic opacity-70">Product-based and community-driven companies</li>
        </ul>
      </div>
    </div>

    {/* SECTION 5 — TRUST REINFORCEMENT */}
    <div className="py-24 px-6 border-b border-gray-100">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm font-light opacity-50 leading-relaxed italic">
          Conversion is the byproduct of clarity. We normalize the strategic friction required to build something that lasts, ensuring your brand isn't just a moment, but a legacy asset.
        </p>
      </div>
    </div>

    {/* SECTION 6 — FINAL CTA */}
    <div className="py-48 px-6 text-center">
      <h2 className="text-4xl md:text-6xl serif italic mb-12">Work with someone who treats your brand like an asset.</h2>
      <Link to="/#booking" className="inline-block bg-black text-white px-12 py-5 text-[11px] font-bold uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl">
        Apply to Work with FORM
      </Link>
    </div>
  </section >
);

const AboutPage: React.FC = () => {
  const bioParts = TEAM[0].bio.split('\n\n');

  return (
    <section className="bg-[#4a0000] min-h-screen text-white">
      {/* 1. Page Header */}
      <div className="pt-48 pb-24 px-6 border-b border-white/10 text-center">
        <p className="uppercase tracking-[0.6em] text-[9px] font-bold opacity-40 mb-4">Founder-led. Strategically driven.</p>
        <h1 className="text-7xl md:text-[10rem] serif italic tracking-tighter leading-none mb-4">About Us</h1>
      </div>

      {/* 2. Intro Block */}
      <div className="max-w-7xl mx-auto py-32 px-6">
        <div className="grid lg:grid-cols-2 gap-32 items-center mb-48">
          <div>
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold mb-8 block text-[#cc3333]">The Agency Ethos</span>
            <h2 className="text-5xl md:text-6xl serif italic leading-tight mb-8">Architecting <br />Digital Sovereignty.</h2>
            <div className="space-y-6 text-lg font-light opacity-80 leading-relaxed max-w-lg">
              <p>
                FORM is a boutique creative growth studio for visionaries of aesthetic wellness. We bridge the gap between high-vibrational artistry and precise commercial performance.
              </p>
              <p>
                We specialize in the "quiet luxury" of brand building—architecting spaces of immense beauty where authority becomes an inevitable byproduct.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[16/10] bg-white/5 p-1 overflow-hidden shadow-2xl">
              <img src="about_visual.jpg" alt="FORM Aesthetic" className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="absolute -bottom-12 -left-12 bg-white text-black p-10 shadow-2xl hidden md:block max-w-xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Our Metric</p>
              <p className="serif italic text-xl">"Desirability is the only currency that never devalues."</p>
            </div>
          </div>
        </div>

        {/* 3. The Three Pillars */}
        <div className="grid md:grid-cols-3 gap-16 mb-48 border-y border-white/10 py-24 bg-white/5 backdrop-blur-sm -mx-6 px-12">
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[#cc3333] mb-6">Aesthetic Precision</h3>
            <p className="text-sm opacity-60 leading-relaxed italic font-light">
              Every calculated visual move reinforces brand positioning for timeless relevance.
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[#cc3333] mb-6">Strategic Prescience</h3>
            <p className="text-sm opacity-60 leading-relaxed italic font-light">
              We look beyond data to predict market shifts, building strategies on foresight and integrity.
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[#cc3333] mb-6">High-Vibration Growth</h3>
            <p className="text-sm opacity-60 leading-relaxed italic font-light">
              Growth is intentional, prioritizing relationship quality over mindless scaling volume.
            </p>
          </div>
        </div>

        {/* 4. Leadership Section */}
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden shadow-2xl relative z-10 bg-black/20">
              <img src={FounderPhoto} alt="Tamyra Simpson" className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute -top-10 -left-10 w-full h-full border border-white/20 z-0"></div>
          </div>
          <div>
            <span className="uppercase tracking-[0.4em] text-[10px] font-bold mb-8 block opacity-40">The Visionary</span>
            <h2 className="text-5xl md:text-6xl serif mb-10 leading-tight">Directed by <br />Tamyra Simpson.</h2>
            <div className="space-y-12">
              <p className="text-2xl font-light opacity-90 leading-relaxed italic border-l-2 border-[#cc3333] pl-8">
                "{bioParts[0]}"
              </p>
              <p className="text-lg font-light opacity-70 leading-relaxed">
                {bioParts[1]}
              </p>
              <Link to="/case-studies" className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] border-b border-white/40 pb-1 hover:border-white transition-all">View the Work</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-32 px-6 bg-white text-black text-center">
        <h3 className="text-4xl md:text-6xl serif italic mb-8">Ready to initiate your legacy?</h3>
        <Link to="/#booking" className="inline-block border-b-2 border-black pb-1 uppercase tracking-[0.4em] text-[11px] font-bold hover:opacity-50 transition-opacity">Schedule a Strategic Consultation</Link>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-black text-white py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-16 border-b border-white/10 pb-20 mb-12">
        <div className="md:col-span-2">
          <Logo textSize="text-5xl" className="mb-10" />
          <p className="text-gray-400 max-w-sm mb-12 text-sm leading-relaxed italic">
            Architecting visual identity systems and digital flagships for aesthetic wellness and lifestyle founders.
          </p>
          <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em]">
            <a href="https://instagram.com/tamyra.simpson" target="_blank" rel="noopener noreferrer" className="hover:text-[#cc3333] transition-colors">Instagram</a>
          </div>
        </div>
        <div>
          <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-8 text-[#cc3333]">Navigation</h4>
          <ul className="space-y-4 text-xs uppercase tracking-widest text-gray-400">
            <li><Link to="/" className="hover:text-white transition-colors">HOME</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">ABOUT US</Link></li>
            <li><Link to="/case-studies" className="hover:text-white transition-colors">CASE STUDY</Link></li>
            <li><Link to="/#booking" className="hover:text-white transition-colors">Inquire</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase tracking-[0.4em] text-[10px] font-bold mb-8 text-[#cc3333]">Contact</h4>
          <ul className="space-y-4 text-xs uppercase tracking-widest text-gray-400">
            <li>formconvert@gmail.com</li>
            <li className="leading-relaxed">Dubai · Albuquerque · Las Vegas · Seattle</li>
            <li className="pt-2 opacity-60 tabular-nums">+1 505 850 3372</li>
            <li className="opacity-60 tabular-nums">+971 58 528 6636</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:row justify-between text-gray-600 text-[9px] uppercase tracking-[0.4em] font-medium">
        <span>© 2024 FORM Creative Growth Studio.</span>
        <span className="mt-4 md:mt-0 italic">Aesthetic Precision & Strategic Prescience.</span>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/case-studies" element={<CaseStudyPage />} />
          </Routes>
        </main>
        <section id="booking" className="py-24 px-6 bg-[#4a0000] relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <BookingForm />
          </div>
        </section>
        <Footer />
        <AIAssistant />
      </div>
    </Router>
  );
};

export default App;
