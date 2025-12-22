
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: <>Boas-vindas à <span className="text-primary">Simulação</span></>,
      description: "Descubra como conexões simples geram comportamentos complexos. Construa, observe e aprenda com os Veículos de Braitenberg.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmsvdeUQJvKMXLOj3V276892aAIPurzk7vREnzt5VFVYuL2Vtbn0BatOmt1RRnmoio4R6hwcn0swgP3WvcDDy8Y3SD-yTYh-tbG2D4qMRhmttZyaQuwaslcjAk4ohJWnuMD5WN3M18VkzRtEh2oHnuj8ivvcznJj7NzMU6rxIw66abYEqfWOnheJesWtMcptwpwOWVzfWtLiEDqpQvmkSQ6AZ3CbXshI5KLk-F_ziSo4pr_zvRKd3f0LRiNWIPrKlJGVBzWsdZlJA"
    },
    {
      title: "Crie, Simule, Analise",
      description: "Desvende o poder da robótica simples através da experimentação direta. Monitore sinais de sensores em tempo real.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvfvDXZWgC2MBqBzy2SEIKgg-olh9S3yXO5gNsmrMcqzuifoEzVbixdcz4G4rAwQ3sfcjLJDZQjr4O6BoGf2M_u4hPkbRfvMBHS6-urhZRPoWT72I3wOzDhutUeA818bxAGuliJVYl7kM3oCgB6mLKQHnqmR8aBQ1w7WCH1tUolKlSCg1e91Z1Q6BV1J1vgycbb7XsEF9QJvhpXTa_Vx9EMLDczbmOoMzjcWrE8KlkcG_3Esg9zBSCyJDBCv55Km7xFNsFZBV__g4"
    },
    {
      title: "Comece Sua Jornada",
      description: "Dê vida aos seus veículos e observe comportamentos complexos surgirem de regras simples.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCst4JKDBUt5cXKn74Pvdq0VH-c8kl1mSjR-QehRe4DksNtvBqzV2DMSHM7Nhv3lzoYKRFAqicf7fSFyWycj8LdgJmPTUH0G2yRtCxryZhPAPxGt6SvBLj1n39Obt58ev2D0PRtythMd8Oh-0P4iZTLqO4yvNJIR_9iH5HpkGTRyJ6rdgH6E0MM87g2kWYXG18lCQzVSEJaliPquCQoZpP3HOLxeJHl6EoAyUiR4PTm1Ki8Xb9ycBXc9JHrLzzmJ2LEX7H9ZByYPt0"
    }
  ];

  const next = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else onComplete();
  };

  const slide = slides[step];

  return (
    <div className="relative flex h-screen w-full flex-col justify-between bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 flex items-center p-6 pb-2 justify-end w-full">
        <button onClick={onComplete} className="px-2 py-1 rounded text-slate-500 dark:text-[#9da6b9] text-sm font-bold">Pular</button>
      </div>

      <div className="relative z-10 flex flex-col flex-grow justify-center items-center w-full max-w-md mx-auto px-6 py-4">
        <div className="w-full relative mb-8">
          <div className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden relative" style={{ backgroundImage: `url('${slide.image}')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background-light/20 via-transparent to-transparent dark:from-background-dark/40"></div>
          </div>
          <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-primary/40 rounded-br-2xl opacity-70"></div>
          <div className="absolute -top-3 -left-3 w-12 h-12 border-l-2 border-t-2 border-primary/40 rounded-tl-xl opacity-70"></div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="tracking-tight text-[32px] font-bold leading-tight px-2">{slide.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed px-4 mx-auto max-w-[32ch]">{slide.description}</p>
        </div>
      </div>

      <div className="relative z-10 w-full p-6 pb-8 pt-4 flex flex-col items-center gap-8 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/90 dark:via-background-dark/90 to-transparent">
        <div className="flex flex-row items-center justify-center gap-3">
          {slides.map((_, i) => (
            <div key={i} className={`h-2 transition-all rounded-full ${i === step ? 'w-8 bg-primary shadow-[0_0_10px_rgba(19,91,236,0.5)]' : 'w-2 bg-slate-300 dark:bg-[#3b4354]'}`}></div>
          ))}
        </div>
        <button onClick={next} className="w-full max-w-sm bg-primary hover:bg-blue-600 text-white font-bold text-lg h-14 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 group">
          <span>{step === slides.length - 1 ? 'Iniciar Jornada' : 'Próximo'}</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
