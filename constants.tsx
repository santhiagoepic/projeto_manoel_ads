
import { LandingPageData } from './types';

export const INITIAL_DATA: LandingPageData = {
  theme: {
    primaryColor: "#003B46", // Azul Petróleo Profundo (Cor Principal)
    secondaryColor: "#00252D", // Tom mais escuro para fundos
    bgColor: "#FFFFFF",
    accentBgColor: "#F0F5F6", // Fundo claro levemente azulado
    heroOverlayColor: "#001A21E6", // Overlay escuro com transparência (90%)
    textDark: "#1A202C", // Texto padrão escuro
    textLight: "#FFFFFF", // Texto claro
    heroBgImage: "/images/photo-1589829545856-d10d557cf95f.avif",
    puzzleImage: "/images/Gemini_Generated_Image_jir5rcjir5rcjir5d.png",
    lawImage: "/images/photo-1505664194779-8beaceb93744.avif",
    pillsImage: "/images/photo-1584308666744-24d5c474f2ae.avif",
    handshakeImage: "/images/business-agreement-handshake-hand-gesture.jpg",
    lawyerImage: ""
  },
  hero: {
    title: "Seu Filho com Autismo Possui Plano de Saúde?",
    subtitle: "Saiba Quais São Seus Direitos e Garanta o Tratamento Necessário",
    description: "Você não está sozinho nessa luta. Todos os dias, inúmeras famílias enfrentam recusas indevidas dos planos de saúde ao tentar assegurar terapias essenciais para crianças com Transtorno do Espectro Autista (TEA). A boa notícia é que a legislação brasileira protege esses direitos — e é possível garanti-los com o apoio jurídico adequado.",
    ctaText: "FALE AGORA COM O ADVOGADO",
    whatsappNumber: "5599981716515"
  },
  challenges: {
    title: "Uma Caminhada Que Não Precisa Ser Solitária",
    description: "Cuidar de uma criança com TEA exige atenção constante, dedicação e enfrentamento de desafios diários. Um dos principais obstáculos é garantir acesso a tratamentos especializados, indispensáveis para o desenvolvimento físico, emocional e social da criança.",
    urgencyTitle: "Por Que Agir Imediatamente é Fundamental",
    urgencyText: "O desenvolvimento infantil ocorre em fases decisivas. Existe um período conhecido como janela de desenvolvimento, no qual as intervenções terapêuticas produzem melhores resultados. Quando o tratamento é adiado, a criança pode perder avanços importantes."
  },
  legal: {
    title: "O Que a Legislação Garante",
    description: "A Lei nº 12.764/2012 (Lei Berenice Piana) assegura uma série de direitos às pessoas com TEA, entre eles: Diagnóstico precoce, Tratamento contínuo e adequado, Atendimento por equipe multidisciplinar, Cobertura de terapias e medicamentos e Atendimento digno e humanizado.",
    recusalTitle: "O Plano de Saúde Pode Recusar o Tratamento?",
    recusalText: "Não pode. Sempre que houver prescrição médica, a negativa do plano é considerada abusiva. Argumentos como 'Não consta no rol da ANS' ou 'Tratamento experimental' são frequentemente rejeitados pelo Poder Judiciário."
  },
  denial: {
    title: "O Que Fazer Diante da Negativa?",
    description: "A orientação é clara: busque auxílio jurídico o quanto antes. Não é obrigatório aguardar análise interna do plano ou registrar reclamação prévia na ANS. Com a atuação jurídica adequada, é possível ingressar com ação judicial e obter decisão liminar para garantir o início imediato do tratamento.",
    medsTitle: "Medicamentos de Alto Custo Também São Direito?",
    medsText: "Sim. Caso o médico responsável prescreva medicamentos para o tratamento do TEA — inclusive de alto custo — o plano de saúde tem a obrigação de fornecer. Negativas baseadas em exclusão do rol ou experimentalidade são, na maioria dos casos, revertidas judicialmente."
  },
  helpGrid: [
    { title: "Garantir terapias, exames e consultas", icon: "🏥" },
    { title: "Exigir o fornecimento de medicamentos", icon: "💊" },
    { title: "Obter decisões judiciais urgentes (liminares)", icon: "⚖️" },
    { title: "Acompanhar o cliente em todas as etapas", icon: "👥" }
  ],
  process: [
    { title: "Entre em Contato", description: "Agende uma reunião online com nossa equipe para iniciarmos o atendimento.", icon: "🎧" },
    { title: "Análise do Caso", description: "Avaliamos sua situação e explicamos todo o procedimento jurídico de forma clara e transparente.", icon: "ℹ️" },
    { title: "Atuação Jurídica", description: "Trabalhamos com agilidade para garantir seus direitos e o tratamento adequado para seu filho.", icon: "✅" }
  ],
  about: {
    title: "Quem Somos",
    description: "Atuação focada em Direito Médico e da Saúde, oferecendo consultoria jurídica preventiva e defesa do consumidor em ações contra planos de saúde. Atendemos de forma online em todo o Brasil, com foco em agilidade e responsabilidade.",
    lawyerName: "MANOEL MOREIRA PINTO NETO",
    lawyerOab: "OAB/MA 18.630"
  },
  encouragement: {
    title: "Tempo é Desenvolvimento",
    text: "Sabemos que, para sua família, tempo é precioso. Trabalhamos com agilidade e responsabilidade para garantir o tratamento adequado para seu filho. Nosso escritório especializado em Direito à Saúde está pronto para guiá-lo nessa jornada."
  },
  reviews: [
    { author: "Juliane Rodrigues", text: "Atendimento profissional, comprometimento com o cliente e excelência jurídica. Recomendo.", rating: 5 },
    { author: "Marcelo Silva", text: "Transparência, competência e seriedade. Esses foram os motivos da minha escolha.", rating: 5 },
    { author: "Gabriel Villela (Coda)", text: "Ótima estrutura e profissional altamente qualificado.", rating: 5 }
  ],
  contact: {
    email: "adv_manoelpinto@outlook.com",
    phone: "(99) 98171-6515",
    instagram: "@piluladedireitomedico",
    hours: "Segunda a sexta, das 8h às 19h"
  }
};
