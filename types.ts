
export interface Lawyer {
  name: string;
  oab: string;
  image: string;
}

export interface ServiceCard {
  title: string;
  description: string;
  bullets: string[];
  icon: string;
}

export interface Review {
  author: string;
  text: string;
  rating: number;
}

export interface ProcessStep {
  title: string;
  description: string;
  icon: string;
}

export interface LandingPageData {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bgColor: string;
    accentBgColor: string;
    heroOverlayColor: string;
    textDark: string;
    textLight: string;
    heroBgImage: string;
    puzzleImage: string;
    lawImage: string;
    pillsImage: string;
    handshakeImage: string;
    lawyerImage: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    whatsappNumber: string;
  };
  challenges: {
    title: string;
    description: string;
    urgencyTitle: string;
    urgencyText: string;
  };
  legal: {
    title: string;
    description: string;
    recusalTitle: string;
    recusalText: string;
  };
  denial: {
    title: string;
    description: string;
    medsTitle: string;
    medsText: string;
  };
  helpGrid: Array<{ title: string; icon: string }>;
  process: ProcessStep[];
  about: {
    title: string;
    description: string;
    lawyerName: string;
    lawyerOab: string;
  };
  encouragement: {
    title: string;
    text: string;
  };
  reviews: Review[];
  contact: {
    email: string;
    phone: string;
    instagram: string;
    hours: string;
  };
}
