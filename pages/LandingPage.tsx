
import React, { useEffect } from 'react';
import { LandingPageData, Review, ProcessStep } from '../types';
import { WhatsAppButton } from '../components/WhatsAppButton';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = "" }) => (
  <h2 className={`text-3xl md:text-4xl font-black tracking-tight leading-tight ${className}`} style={{ color: 'var(--text-dark)' }}>
    {children}
  </h2>
);

export const LandingPage: React.FC<{ data: LandingPageData }> = ({ data }) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', data.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', data.theme.secondaryColor);
    document.documentElement.style.setProperty('--bg-color', data.theme.bgColor);
    document.documentElement.style.setProperty('--accent-bg-color', data.theme.accentBgColor);
    document.documentElement.style.setProperty('--hero-overlay', data.theme.heroOverlayColor);
    document.documentElement.style.setProperty('--text-dark', data.theme.textDark);
    document.documentElement.style.setProperty('--text-light', data.theme.textLight);
  }, [data.theme]);

  return (
    <div className="font-sans selection:bg-[#003B46] selection:text-white" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-dark)' }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <img src={data.theme.heroBgImage} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--hero-overlay)' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <div className="mb-12">
             {/* Logo Completo Branco - Versão Hero */}
             <div className="flex flex-col md:flex-row items-center md:items-start gap-8 opacity-90 mb-12">
                {/* Symbol */}
                 <div className="h-20 w-72 md:h-24 md:w-[420px] relative shrink-0">
                   <img src="/logos/logo na horizontal sem oab.svg" alt="Logo" className="w-full h-full object-contain drop-shadow-2xl" />
                 </div>
                
                {/* Text Block */}
                {/* Textos removidos conforme solicitado */}
             </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
            {data.hero.title}<br/>
            <span style={{ color: '#4FD1C5', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{data.hero.subtitle}</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed mb-10 font-light">
            {data.hero.description}
          </p>
          <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} />
        </div>
      </section>

      {/* Challenges */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center max-w-6xl">
          <div className="space-y-8">
            <SectionTitle>{data.challenges.title}</SectionTitle>
            <p className="text-lg opacity-80 leading-relaxed">{data.challenges.description}</p>
            <div className="pt-4">
               <h3 className="text-2xl font-black mb-4">{data.challenges.urgencyTitle}</h3>
               <p className="text-lg opacity-80 leading-relaxed">{data.challenges.urgencyText}</p>
            </div>
            <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} />
          </div>
          <div className="relative">
            <img src={data.theme.puzzleImage} alt="Desafio" className="rounded-2xl shadow-2xl w-full aspect-square object-cover grayscale-[20%]" />
          </div>
        </div>
      </section>

      {/* Legal Info */}
      <section className="py-24" style={{ backgroundColor: 'var(--accent-bg-color)' }}>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center max-w-6xl">
          <div className="order-2 md:order-1">
            <img src={data.theme.lawImage} alt="Justiça" className="rounded-2xl shadow-2xl w-full aspect-video object-cover grayscale-[20%]" />
          </div>
          <div className="space-y-8 order-1 md:order-2">
            <SectionTitle>{data.legal.title}</SectionTitle>
            <p className="text-lg opacity-80 leading-relaxed">{data.legal.description}</p>
            <div className="pt-4">
               <h3 className="text-2xl font-black mb-4">{data.legal.recusalTitle}</h3>
               <p className="text-lg opacity-80 leading-relaxed">{data.legal.recusalText}</p>
            </div>
            <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} />
          </div>
        </div>
      </section>

      {/* Denial Info */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center max-w-6xl">
          <div className="space-y-8">
            <SectionTitle>{data.denial.title}</SectionTitle>
            <p className="text-lg opacity-80 leading-relaxed">{data.denial.description}</p>
            <div className="pt-4">
               <h3 className="text-2xl font-black mb-4">{data.denial.medsTitle}</h3>
               <p className="text-lg opacity-80 leading-relaxed">{data.denial.medsText}</p>
            </div>
            <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} />
          </div>
          <div className="relative">
            <img src={data.theme.pillsImage} alt="Medicamentos" className="rounded-2xl shadow-2xl w-full aspect-video object-cover grayscale-[20%]" />
          </div>
        </div>
      </section>

      {/* Como podemos ajudar */}
      <section className="py-24 text-center" style={{ backgroundColor: 'var(--accent-bg-color)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <SectionTitle className="mb-4">Como podemos te ajudar</SectionTitle>
          <p className="mb-16 opacity-60">Nossa equipe é especializada em direito à saúde, com ampla experiência em ações relacionadas ao TEA.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.helpGrid.map((item, idx) => (
              <div key={idx} className="p-10 rounded-2xl shadow-sm border border-black/5 flex flex-col items-center hover:shadow-md transition-shadow" style={{ backgroundColor: 'var(--bg-color)' }}>
                <span className="text-4xl mb-6">{item.icon}</span>
                <p className="font-bold text-sm leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
             <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} className="mx-auto" />
          </div>
        </div>
      </section>

      {/* Quem somos */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className={`container mx-auto px-6 grid gap-16 items-center max-w-6xl ${data.theme.lawyerImage ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {data.theme.lawyerImage && (
            <div className="relative">
              <img src={data.theme.lawyerImage} alt="Foto" className="rounded-2xl shadow-2xl w-full aspect-[4/5] object-cover grayscale-[20%]" />
            </div>
          )}
          <div className={`space-y-8 ${data.theme.lawyerImage ? '' : 'max-w-3xl mx-auto'}`}>
            <SectionTitle>{data.about.title}</SectionTitle>
            <p className="text-lg opacity-80 leading-relaxed">{data.about.description}</p>
            <div className="pt-6 border-t border-black/10">
               <h4 className="text-2xl font-black" style={{ color: 'var(--primary-color)' }}>{data.about.lawyerName}</h4>
               <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-1">{data.about.lawyerOab}</p>
            </div>
            <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} />
          </div>
        </div>
      </section>

      {/* Luz no fim do túnel */}
      <section className="py-24" style={{ backgroundColor: 'var(--accent-bg-color)' }}>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center max-w-6xl">
          <div className="space-y-8">
            <SectionTitle>{data.encouragement.title}</SectionTitle>
            <p className="text-lg opacity-80 leading-relaxed">{data.encouragement.text}</p>
            <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} />
          </div>
          <div className="relative">
            <img src={data.theme.handshakeImage} alt="Encorajamento" className="rounded-2xl shadow-2xl w-full aspect-video object-cover grayscale-[20%]" />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container mx-auto px-6 text-center mb-16 max-w-6xl">
           <SectionTitle className="mb-12">Veja o que dizem sobre nós</SectionTitle>

           <div className="-mx-6 px-6 md:-mx-12 md:px-12">
              <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scroll-px-6 md:scroll-px-12">
                {data.reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="w-[85vw] sm:w-[520px] md:w-[560px] lg:w-[680px] shrink-0 snap-start p-10 rounded-3xl text-left border border-black/5 shadow-sm hover:shadow-md transition-shadow"
                    style={{ backgroundColor: 'var(--accent-bg-color)' }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-1 text-[#003B46]">★★★★★</div>
                      <div className="flex items-center gap-1 opacity-20">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z"/></svg>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Verificado</span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-6 italic opacity-80">"{review.text}"</p>
                    <p className="font-black text-xs uppercase tracking-widest opacity-60">{review.author}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Processo */}
      <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--text-light)' }}>
        <div className="container mx-auto px-6 text-center max-w-6xl">
          <h2 className="text-4xl font-black mb-16 tracking-tight">Como Iniciar o Processo</h2>
          <div className="grid md:grid-cols-3 gap-10">
             {data.process.map((step, idx) => (
               <div key={idx} className="p-10 rounded-2xl border border-white/10 text-left hover:bg-white/10 transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-4xl mb-8 block">{step.icon}</span>
                  <h4 className="text-xl font-black mb-4">{step.title}</h4>
                  <p className="text-sm opacity-60 leading-relaxed">{step.description}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Contato Final */}
      <section className="py-24" style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
           <div className="space-y-10 flex flex-col items-center">
              <SectionTitle>Fale Conosco</SectionTitle>
              <p className="opacity-70 max-w-2xl mx-auto">Clicando no botão verde para o WhatsApp, o atendimento é imediato.</p>
              
              <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
                 <div className="flex items-center justify-center gap-4 p-6 rounded-2xl border border-black/5 hover:border-black/10 transition-all bg-white shadow-sm">
                    <span className="w-10 h-10 flex items-center justify-center rounded-lg text-xl" style={{ backgroundColor: 'var(--accent-bg-color)' }}>📞</span>
                    <span className="font-bold text-sm md:text-base">{data.contact.phone}</span>
                 </div>
                 <div className="flex items-center justify-center gap-4 p-6 rounded-2xl border border-black/5 hover:border-black/10 transition-all bg-white shadow-sm">
                    <span className="w-10 h-10 flex items-center justify-center rounded-lg text-xl" style={{ backgroundColor: 'var(--accent-bg-color)' }}>📸</span>
                    <span className="font-bold text-sm md:text-base">{data.contact.instagram}</span>
                 </div>
                 {data.contact.hours && (
                    <div className="flex items-center justify-center gap-4 p-6 rounded-2xl border border-black/5 hover:border-black/10 transition-all bg-white shadow-sm md:col-span-2">
                        <span className="w-10 h-10 flex items-center justify-center rounded-lg text-xl" style={{ backgroundColor: 'var(--accent-bg-color)' }}>🕘</span>
                        <span className="font-bold text-sm md:text-base">{data.contact.hours}</span>
                    </div>
                 )}
              </div>
              
              <WhatsAppButton number={data.hero.whatsappNumber} text={data.hero.ctaText} style={{ backgroundColor: 'var(--primary-color)' }} />
           </div>
        </div>
      </section>
    </div>
  );
};
