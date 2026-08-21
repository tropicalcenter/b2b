import { Product, TripDestination, UserProfile } from './types';

export const FATOR_CONVERSAO = 0.03;
export const WHATSAPP_LINK = "https://wa.me/5596991968631";

export const INITIAL_CATALOG: Product[] = [
  {
    id: 'iphone-16',
    name: 'iPhone 16 128GB',
    category: 'Tecnologia',
    price: 11999,
    description: 'O smartphone definitivo para gerenciar suas obras e registrar cada detalhe com qualidade cinematográfica.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80',
    highlight: true,
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air M3 15" 16GB / 512GB SSD',
    category: 'Tecnologia',
    price: 16499,
    description: 'Desempenho extraordinário para orçamentos complexos e renderização de projetos BIM em qualquer lugar.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    highlight: false,
  },
  {
    id: 'smart-tv-75',
    name: 'Smart TV 75" Samsung Crystal UHD 4K',
    category: 'Escritório & Climatização',
    price: 8499,
    description: 'Transforme a sala de reuniões da sua construtora em um centro de apresentações de alto impacto.',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80',
    highlight: true,
  },
  {
    id: 'herman-miller-style',
    name: 'Cadeira Ergonômica Presidente Premium',
    category: 'Escritório & Climatização',
    price: 5899,
    description: 'Design refinado e ergonomia avançada para o escritório da diretoria e longas jornadas de planejamento.',
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=400&q=80',
    highlight: false,
  },
  {
    id: 'ar-split-18k',
    name: 'Ar Condicionado Split Inverter WindFree 18.000 BTU',
    category: 'Escritório & Climatização',
    price: 6699,
    description: 'Economia de energia extrema e conforto térmico sob medida para o escritório central da sua construtora.',
    image: 'https://i.imgur.com/GWOtch5.jpeg', 
    highlight: false,
  },
  {
    id: 'expresso-oster',
    name: 'Cafeteira Expresso Super Automática Oster PrimaLatte',
    category: 'Lazer',
    price: 6299,
    description: 'Ofereça café expresso e capuccino de altíssima qualidade para os seus clientes e parceiros estratégicos.',
    image: 'https://images.unsplash.com/photo-1606791405792-1004f1718d0c?auto=format&fit=crop&w=400&q=80', 
    highlight: false,
  },
  {
    id: 'cervejeira-venax',
    name: 'Cervejeira Premium Venax Blue Light 100L',
    category: 'Lazer',
    price: 5499,
    description: 'O complemento perfeito para a área gourmet da sua construtora ou celebrações de entrega de chaves.',
    image: 'https://imgur.com/d67X0an.jpeg',
    highlight: false,
  },
  {
    id: 'churrasqueira-parrilla',
    name: 'Parrilla Gourmet Inox com Base de Tijolos Refratários',
    category: 'Lazer',
    price: 7800,
    description: 'Para celebrar o faturamento de grandes incorporações e confraternizações da equipe de engenharia.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    highlight: true,
  }
];

export const TRIP_DESTINATIONS: TripDestination[] = [
  {
    id: 'campos',
    name: 'Campos do Jordão',
    subtitle: 'A Suíça Brasileira',
    target: 600000,
    desc: 'Uma viagem para aproveitar o clima e a beleza da Serra da Mantiqueira, com passeios, gastronomia local e muita natureza.',
    duration: '4 Dias / 3 Noites',
    badge: 'Nível Prata • Romântico & Gourmet',
    colorTheme: 'from-slate-400 to-slate-500',
    textTheme: 'text-slate-300',
    borderTheme: 'border-slate-500/30',
    image: 'https://imgur.com/76XXvkl.jpeg'
  },
  {
    id: 'maragogi',
    name: 'Salinas Maragogi',
    subtitle: 'Caribe Brasileiro All Inclusive',
    target: 700000,
    desc: 'Aproveite o famoso resort pé na areia com sistema All Inclusive e desfrute das águas claras de Maragogi.',
    duration: '6 Dias / 5 Noites',
    badge: 'Nível Ouro • Sol, Praia & Resort 5★',
    colorTheme: 'from-amber-400 to-amber-600',
    textTheme: 'text-amber-400',
    borderTheme: 'border-amber-500/30',
    image: 'https://imgur.com/0NqnCEF.jpeg'
  },
  {
    id: 'gramado',
    name: 'Gramado - RS',
    subtitle: 'Estilo de Vida Europeu na Serra',
    target: 900000,
    desc: 'Viva o charme da Serra Gaúcha. Roteiros turísticos de Gramado, visitas em vinícolas de Bento Gonçalves e jantares típicos.',
    duration: '5 Dias / 4 Noites',
    badge: 'Nível Diamante • Elite & Prestígio',
    colorTheme: 'from-cyan-400 to-cyan-600',
    textTheme: 'text-cyan-400',
    borderTheme: 'border-cyan-500/30',
    image: 'https://imgur.com/NIRcY9u.jpeg'
  },
  {
    id: 'lisboa',
    name: 'Lisboa - Portugal',
    subtitle: 'Experiência Europeia',
    target: 1200000,
    desc: 'Descubra as riquezas de Portugal. Uma viagem para explorar a cultura, os pontos turísticos e a culinária típica do país.',
    duration: '7 Dias / 6 Noites',
    badge: 'Nível Black • Viagem Internacional',
    colorTheme: 'from-fuchsia-400 to-fuchsia-600',
    textTheme: 'text-fuchsia-400',
    borderTheme: 'border-fuchsia-500/30',
    image: 'https://imgur.com/QigA3sz.jpeg'
  }
];

export const DEFAULT_USER: UserProfile = {
  companyName: 'Construtora Gama',
  cnpj: '49.614.391/0001-23',
  registrationDate: '12 de Janeiro de 2026',
  avatar: 'CG',
  totalPurchases: 0, 
  pointsRedeemed: 0, 
  lastPurchase: null as any,
  purchaseHistory: [],
  redemptionHistory: []
};
