import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Leaf, Heart, ShieldCheck, Sparkles, History } from 'lucide-react';
import { AppSettings } from '../types';

interface AboutProps {
  settings: AppSettings;
}

export default function About({ settings }: AboutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('About page mounted');
  }, []);

  return (
    <div className="bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1583743814966-8936f5b7ec2c?auto=format&fit=crop&q=80&w=2000" 
            alt="About AL-Hurumah" 
            className="w-full h-full object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFCFB]" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-black/40 mb-4 block">
              The Essence of Tradition
            </span>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-black mb-6">
              Our Story.
            </h1>
            <div className="w-12 h-1 bg-black mx-auto mb-8" />
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight">Redefining Elegance Through Authenticity.</h2>
            <p className="text-black/60 leading-relaxed">
              {settings.aboutText1 || `Founded in 2024, ${settings.brandName || 'AL-Hurumah'} began with a simple yet profound vision: to bridge the gap between traditional craftsmanship and contemporary style. Our journey started in the heart of the artisan community, where we discovered the timeless beauty of hand-stitched Panjabis and the mystical allure of organic Attars.`}
            </p>
            <p className="text-black/60 leading-relaxed">
              {settings.aboutText2 || `We believe that clothing and fragrance are more than just products; they are reflections of identity and culture. That's why we source only the finest materials—from premium Egyptian cotton to the rarest essential oils—ensuring that every piece carries the legacy of quality.`}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-black/5 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1590044591235-075047fe1e4e?auto=format&fit=crop&q=80&w=1000" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-black/5 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <History className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-black/40">Established</p>
                  <p className="text-lg font-black">MMXXIV</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-24 relative z-10">
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-8">Our Mission</h2>
            <p className="text-white/60 text-xl leading-relaxed italic">
              "{settings.aboutMission || "To preserve and promote traditional artistry by crafting premium attire and fragrances that inspire confidence and celebrate authenticity in a modern world."}"
            </p>
          </div>
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8">
              <Leaf className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-8">Our Vision</h2>
            <p className="text-white/60 text-xl leading-relaxed italic">
              "{settings.aboutVision || "To become a global symbol of refined traditionalism, where every thread and scent tells a story of heritage, quality, and timeless grace."}"
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 mb-4 block">The Pillars</span>
          <h2 className="text-4xl font-bold tracking-tight">Our Core Values.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Uncompromising Quality",
              desc: "From the first sketch to the final stitch, we never settle for anything less than perfection."
            },
            {
              icon: <Heart className="w-6 h-6" />,
              title: "Rooted in Passion",
              desc: "Our love for tradition drives us to create products that resonate with the soul."
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Ethical Sourcing",
              desc: "We commit to fair practices and sustainable sourcing for all our materials."
            }
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 bg-white rounded-[2rem] border border-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-colors">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-black/50 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto p-12 rounded-[3.5rem] bg-gradient-to-b from-white to-black/5 border border-black/5 shadow-sm"
        >
          <h2 className="text-3xl font-bold mb-6">Experience the Legacy.</h2>
          <p className="text-black/50 mb-10">Discover the collection that defines our commitment to luxury and tradition.</p>
          <a 
            href="/#shop"
            className="inline-block px-12 py-4 bg-black text-white rounded-full font-bold shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            Explore the Collection
          </a>
        </motion.div>
      </section>
    </div>
  );
}
