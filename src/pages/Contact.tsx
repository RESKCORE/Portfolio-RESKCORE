import { useEffect, useRef, useState } from 'react';
import { AnimatedCopy } from '@/components/AnimatedCopy';
import { SEO } from '@/components/SEO';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Mail, Github, Linkedin, Instagram, Copy, Check, Send, Loader2, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { icon: Mail, href: 'mailto:reddysantosh1310@gmail.com', label: 'Email' },
  { icon: Github, href: 'https://github.com/RESKCORE', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/reddy-santosh-kumar/', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/klyn.am', label: 'Instagram' },
];

export function Contact() {
  const iconGridRef = useRef<HTMLDivElement>(null);

  // Form states
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  
  // Copy to clipboard state
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    if (!iconGridRef.current) return;
    const gridIcons = iconGridRef.current.querySelectorAll('.contact-icon');

    const ctx = gsap.context(() => {
      gsap.from(gridIcons, {
        opacity: 0,
        scale: 0.75,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, iconGridRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('reddysantosh1310@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+918977997886');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const botcheck = String(formData.get('botcheck') || '');

    // Anti-spam bot check
    if (botcheck) return;

    if (!name || !email || !message) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setSenderName(name);

    // Web3Forms Access Key: reads from Vite env or user configured key
    const accessKey =
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
      'YOUR_ACCESS_KEY_HERE';

    try {
      // If user hasn't set their key yet, we still check or submit
      const payload: Record<string, string> = {
        access_key: accessKey,
        name,
        email,
        message,
        subject: `[Portfolio Contact] New message from ${name}`,
        from_name: 'RESK Portfolio Contact Form',
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        form.reset();
      } else {
        // If the access key is invalid / missing, provide fallback message
        throw new Error(data.message || 'Unable to submit message. Please try emailing directly.');
      }
    } catch (err: any) {
      console.warn('Form submission error:', err);
      setErrorMessage(
        err.message || 'Transmission failed. You can reach out directly via email at reddysantosh1310@gmail.com'
      );
      setStatus('error');
    }
  };

  return (
    <main className="bg-[var(--bg)] text-[var(--fg)] min-h-screen pt-24 sm:pt-32 pb-32 sm:pb-48">
      <SEO 
        title="Contact Reddy Santosh Kumar (Santosh Reddy) | Portfolio"
        description="Get in touch with Reddy Santosh Kumar (also known as Santosh Reddy or Santosh Kumar), Full Stack Developer & AI/ML Engineer for engineering collaborations and opportunities."
        canonicalPath="/contact"
        keywords="Contact Santosh Kumar, Reddy Santosh Kumar contact, Santosh Reddy email, hire AI ML Engineer, hire full stack developer"
      />

      {/* 1. Contact Hero */}
      <section className="min-h-[45vh] sm:min-h-[55vh] flex flex-col justify-center container relative border-b border-[var(--fg)]/15 pb-10 sm:pb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="type-mono text-[10px] sm:text-[11px] opacity-70 uppercase tracking-widest">
            [ Inquiries & Collaboration ]
          </p>
        </div>
        <AnimatedCopy
          variant="diffuse"
          onScroll={false}
          as="h1"
          className="type-var-1 text-[clamp(3.5rem,11vw,9.5rem)] text-[var(--fg)] leading-none"
        >
          Connect
        </AnimatedCopy>
        <p className="type-var-2 text-xl sm:text-2xl md:text-3xl max-w-3xl mt-6 sm:mt-10 leading-relaxed opacity-90 font-serif italic">
          Have an idea, a project, or a role in mind? Reach out to Reddy Santosh Kumar (Santosh Reddy) directly below or across any channel.
        </p>
      </section>

      <section className="container py-16 sm:py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* 2. Contact Form with Web3Forms & Live Status */}
        <div className="lg:col-span-7">
          {status === 'success' ? (
            <div className="p-8 sm:p-12 border border-[var(--fg)]/30 rounded-xs bg-white/5 backdrop-blur-sm flex flex-col items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="type-var-1 text-2xl sm:text-3xl">Message Sent!</h3>
              <p className="type-var-2 text-lg sm:text-xl opacity-90 leading-relaxed font-serif italic max-w-xl">
                Thank you, <span className="font-semibold text-white">{senderName}</span>. Your message has been dispatched directly to my inbox (<span className="underline">reddysantosh1310@gmail.com</span>). I'll review it and get back to you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="type-mono text-[11px] sm:text-xs tracking-wider px-6 py-3 border border-[var(--fg)]/30 rounded-full hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors mt-2 cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-8 sm:gap-10" onSubmit={handleSubmit}>
              {/* Spam bot trap (invisible to real humans) */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="flex flex-col gap-2.5 sm:gap-3">
                <label htmlFor="name" className="type-mono text-[var(--fg)] opacity-60 text-[10px] sm:text-[11px] uppercase tracking-wider">
                  01 — Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  disabled={status === 'submitting'}
                  className="bg-transparent border-b border-[var(--fg)]/25 pb-3 sm:pb-4 text-xl sm:text-2xl text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:outline-none focus:border-[var(--fg)] transition-colors font-sans"
                  placeholder="e.g. Alex Morgan"
                />
              </div>

              <div className="flex flex-col gap-2.5 sm:gap-3">
                <label htmlFor="email" className="type-mono text-[var(--fg)] opacity-60 text-[10px] sm:text-[11px] uppercase tracking-wider">
                  02 — Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={status === 'submitting'}
                  className="bg-transparent border-b border-[var(--fg)]/25 pb-3 sm:pb-4 text-xl sm:text-2xl text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:outline-none focus:border-[var(--fg)] transition-colors font-sans"
                  placeholder="alex@company.com"
                />
              </div>

              <div className="flex flex-col gap-2.5 sm:gap-3">
                <label htmlFor="message" className="type-mono text-[var(--fg)] opacity-60 text-[10px] sm:text-[11px] uppercase tracking-wider">
                  03 — Project Details or Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  disabled={status === 'submitting'}
                  className="bg-transparent border-b border-[var(--fg)]/25 pb-3 sm:pb-4 text-xl sm:text-2xl text-[var(--fg)] placeholder:text-[var(--fg)]/30 focus:outline-none focus:border-[var(--fg)] transition-colors font-sans resize-none"
                  placeholder="Tell me about your idea, timeline or engineering needs..."
                />
              </div>

              {status === 'error' && (
                <div className="p-4 border border-rose-400/40 bg-rose-500/10 rounded-xs flex items-start gap-3 text-rose-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                  <div className="flex flex-col gap-1">
                    <p className="type-mono text-[11px] leading-relaxed">{errorMessage}</p>
                    <a
                      href={`mailto:reddysantosh1310@gmail.com?subject=Portfolio%20Inquiry`}
                      className="type-mono text-[10px] underline hover:opacity-80 mt-1 inline-block"
                    >
                      Click here to email directly via mail client →
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="self-start type-mono text-[var(--fg)] text-xs sm:text-sm tracking-wider hover:text-[var(--bg)] transition-colors border border-[var(--fg)]/40 hover:bg-[var(--fg)] px-8 sm:px-12 py-4 sm:py-5 rounded-full mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                data-cursor-label="Send"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* 3. Direct Contact & Quick Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="flex flex-col gap-8 sm:gap-12">
            <div>
              <h3 className="type-var-2 text-2xl sm:text-3xl text-[var(--fg)] mb-3">Direct Inquiries</h3>
              <p className="type-var-2 text-base sm:text-lg opacity-80 mb-4 font-serif italic">
                Prefer email or phone? Reach me directly anytime:
              </p>

              {/* Copy Email Button Card */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleCopyEmail}
                  className="cursor-target group flex items-center justify-between p-3.5 sm:p-4 rounded-xs border border-[var(--fg)]/20 hover:border-[var(--fg)]/60 bg-black/10 transition-all text-left cursor-pointer"
                  data-cursor-label="Copy"
                >
                  <div className="flex flex-col">
                    <span className="type-mono text-[9px] opacity-60 uppercase tracking-wider">Email Address</span>
                    <span className="type-mono text-xs sm:text-sm text-[var(--fg)] mt-0.5 break-all">
                      reddysantosh1310@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors ml-2 flex-shrink-0">
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="type-mono text-[9px] text-emerald-400 uppercase tracking-widest">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 opacity-80" />
                        <span className="type-mono text-[9px] opacity-80 uppercase tracking-widest">Copy</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Copy Phone Button Card */}
                <button
                  onClick={handleCopyPhone}
                  className="cursor-target group flex items-center justify-between p-3.5 sm:p-4 rounded-xs border border-[var(--fg)]/20 hover:border-[var(--fg)]/60 bg-black/10 transition-all text-left cursor-pointer"
                  data-cursor-label="Copy"
                >
                  <div className="flex flex-col">
                    <span className="type-mono text-[9px] opacity-60 uppercase tracking-wider">Phone / WhatsApp</span>
                    <span className="type-mono text-xs sm:text-sm text-[var(--fg)] mt-0.5">
                      +91 89779 97886
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors ml-2 flex-shrink-0">
                    {copiedPhone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="type-mono text-[9px] text-emerald-400 uppercase tracking-widest">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 opacity-80" />
                        <span className="type-mono text-[9px] opacity-80 uppercase tracking-widest">Copy</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="type-var-2 text-2xl sm:text-3xl text-[var(--fg)] mb-2">Location & Base</h3>
              <p className="type-mono text-xs sm:text-sm leading-relaxed opacity-85">
                RESK // VIJAYAWADA, INDIA<br />
                SRK INSTITUTE OF TECHNOLOGY<br />
                TIMEZONE: IST (UTC+5:30)
              </p>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="mt-12 sm:mt-16">
            <p className="type-mono text-[10px] opacity-60 uppercase tracking-wider mb-3">
              Network & Socials
            </p>
            <div ref={iconGridRef} className="grid grid-cols-4 gap-4 max-w-xs sm:max-w-sm">
              {socialLinks.map(({ icon: Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className="contact-icon flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 border border-[var(--fg)]/20 rounded-full hover:border-[var(--fg)] hover:text-[var(--bg)] hover:bg-[var(--fg)] transition-all cursor-pointer text-[var(--fg)] shadow-sm"
                  data-cursor-label={label}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}