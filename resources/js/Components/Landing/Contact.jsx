import { Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { generateWhatsAppLink } from '@/lib/utils';

export default function Contact() {
    const revealRef = useReveal();
    const whatsappLink = generateWhatsAppLink('06 17 93 37 97', 'Hello Coach! I have a question regarding your training programs.');

    return (
        <section id="contact" className="py-16 lg:py-28 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div ref={revealRef} className="reveal-up grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Info Column */}
                    <div>
                        <h2 className="text-sm font-bold text-[var(--color-primary-dark)] uppercase tracking-widest mb-2">
                            Get In Touch
                        </h2>
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tight leading-tight mb-6">
                            Ready To Build <br />
                            <span className="text-[var(--color-primary-dark)]">Your Best Self?</span>
                        </h3>
                        <p className="text-slate-600 mb-10 text-sm sm:text-base leading-relaxed max-w-md">
                            Fill out the form to ask a question, or reach out directly on social media. I usually respond within 24 hours.
                        </p>

                        {/* Social Links */}
                        <div className="flex flex-col gap-6">
                            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Connect With Me</h4>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#25D366] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                                    aria-label="WhatsApp"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#E1306C] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#1877F2] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#FF0000] hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                                    aria-label="YouTube"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="bg-[#f9fbf6] rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                                    placeholder="Tell me about your fitness goals..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-slate-900 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
                            >
                                Send Message
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
