import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Globe } from 'lucide-react';
import { AppSettings } from '../types';

interface ContactProps {
  settings: AppSettings;
}

export default function Contact({ settings }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.contactImageTop || "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000"} 
            alt="Contact AL-Hurumah" 
            className="w-full h-full object-cover opacity-50 blur-[2px] scale-105"
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
              Connect With Us
            </span>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-black mb-6">
              Contact.
            </h1>
            <div className="w-12 h-1 bg-black mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Get in Touch.</h2>
              <p className="text-black/50 leading-relaxed max-w-md">
                Have a question about our collections or need assistance with your order? Our concierge team is here to provide exceptional service.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: "Email Us",
                  value: settings.contactEmail || "concierge@alhurumah.com",
                  sub: "Response within 24 hours"
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: "Call Us",
                  value: settings.contactPhone || "+880 1234 567890",
                  sub: "Sun - Thu, 10am - 8pm"
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "Visit Boutique",
                  value: settings.contactAddress || "Gulshan-2, Dhaka",
                  sub: "Bangladesh"
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  label: "Working Hours",
                  value: settings.contactHours || "10:00 AM - 09:00 PM",
                  sub: "Everyday"
                }
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">{item.label}</p>
                  <p className="text-base font-bold text-black mb-1">{item.value}</p>
                  <p className="text-xs text-black/30">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-black/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium">Global shipping available to over 50 countries.</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 sm:p-12 rounded-[3.5rem] border border-black/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <MessageSquare className="w-32 h-32" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 bg-black/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all placeholder:text-black/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com"
                    className="w-full px-6 py-4 bg-black/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all placeholder:text-black/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Subject</label>
                <input 
                  required
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="How can we help?"
                  className="w-full px-6 py-4 bg-black/5 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all placeholder:text-black/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Write your message here..."
                  className="w-full px-6 py-4 bg-black/5 rounded-3xl text-sm focus:outline-none focus:ring-1 focus:ring-black/10 transition-all placeholder:text-black/20 resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={status !== 'idle'}
                className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-black/10 hover:bg-black/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {status === 'idle' && (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
                {status === 'sending' && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {status === 'sent' && (
                  <span>Message Sent Successfully</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map or Image Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto h-[400px] rounded-[3rem] overflow-hidden border border-black/5 shadow-lg grayscale hover:grayscale-0 transition-all duration-700">
          <img 
            src={settings.contactImageBottom || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000"} 
            alt="Office Location" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
