export interface Photo {
  src: string
  small: string
  alt: string
  category: string
  title: string
  width: number
  height: number
}

export const photos: Photo[] = [
  {
    src: '/images/editorial-vestido-mar.webp',
    small: '/images/editorial-vestido-mar-800.webp',
    alt: 'Isadora de vestido branco em um mirante à beira-mar',
    category: 'Editorial / Moda',
    title: 'Brisa',
    width: 1064,
    height: 1600,
  },
  {
    src: '/images/fitness-tennis.webp',
    small: '/images/fitness-tennis-800.webp',
    alt: 'Isadora sorrindo apoiada na rede de uma quadra de tênis',
    category: 'Fitness',
    title: 'Esporte',
    width: 852,
    height: 1280,
  },
  {
    src: '/images/cream-blazer-fashion-portrait.webp',
    small: '/images/cream-blazer-fashion-portrait-800.webp',
    alt: 'Retrato de Isadora usando blazer off-white e cropped marrom em fundo cinza neutro',
    category: 'Editorial / Moda',
    title: 'Alfaiataria',
    width: 854,
    height: 1280,
  },
  {
    src: '/images/swim-laranja.webp',
    small: '/images/swim-laranja-800.webp',
    alt: 'Isadora com biquíni terracota entre samambaias',
    category: 'Lifestyle / Praia',
    title: 'Maré',
    width: 1064,
    height: 1600,
  },
  {
    src: '/images/beauty-corset-azul.webp',
    small: '/images/beauty-corset-azul-800.webp',
    alt: 'Retrato de Isadora com corset azul-claro',
    category: 'Close / Beauty',
    title: 'Céu de Janeiro',
    width: 1200,
    height: 1600,
  },
  {
    src: '/images/white-swimsuit-seaside-deck.webp',
    small: '/images/white-swimsuit-seaside-deck-800.webp',
    alt: 'Isadora de maiô branco cut-out em um deck com guarda-sol e vista para o mar azul',
    category: 'Lifestyle / Praia',
    title: 'Infinito',
    width: 852,
    height: 1280,
  },
  {
    src: '/images/sheer-black-outfit-garden.webp',
    small: '/images/sheer-black-outfit-garden-800.webp',
    alt: 'Isadora sentada em um banco de madeira no jardim com vestido preto translúcido',
    category: 'Editorial / Moda',
    title: 'Contraste',
    width: 852,
    height: 1280,
  },
  {
    src: '/images/elegant-white-top-portrait.webp',
    small: '/images/elegant-white-top-portrait-800.webp',
    alt: 'Retrato em close de Isadora apoiando o queixo na mão, com blusa branca',
    category: 'Close / Beauty',
    title: 'Serenidade',
    width: 854,
    height: 1280,
  },
  {
    src: '/images/editorial-vestido-ceu.webp',
    small: '/images/editorial-vestido-ceu-800.webp',
    alt: 'Isadora de vestido branco contra o céu azul',
    category: 'Editorial / Moda',
    title: 'Horizonte',
    width: 1064,
    height: 1600,
  },
  {
    src: '/images/beauty-golden-hour.webp',
    small: '/images/beauty-golden-hour-800.webp',
    alt: 'Retrato de Isadora sob a luz dourada do fim de tarde',
    category: 'Close / Beauty',
    title: 'Golden Hour',
    width: 1064,
    height: 1600,
  },
]

export const heroPhoto = photos.find((p) => p.src.includes('beauty-golden-hour')) || photos[9]
export const sobrePhoto = photos.find((p) => p.src.includes('beauty-corset-azul')) || photos[4]
export const sobrePhotoDetail = photos.find((p) => p.src.includes('editorial-vestido-ceu')) || photos[8]

export interface ServiceItem {
  label: string
  price: string
  note?: string
}

export interface Service {
  id: string
  index: string
  title: string
  blurb: string
  fromPrice: string
  items: ServiceItem[]
}

export const services: Service[] = [
  {
    id: 'ensaio',
    index: '01',
    title: 'Ensaio Fotográfico',
    blurb:
      'Produção de fotos profissionais para campanhas, catálogos, e-commerce ou lookbooks.',
    fromPrice: 'R$ 500',
    items: [
      { label: 'Meia diária', price: 'R$ 500,00', note: '+ 1 look' },
      { label: 'Diária completa', price: 'R$ 800,00', note: '+ 2 looks' },
    ],
  },
  {
    id: 'provador',
    index: '02',
    title: 'Provador em Loja',
    blurb:
      'Demonstração dinâmica de looks — caimento, detalhes do tecido e sugestões de uso. Ideal para Stories e Reels.',
    fromPrice: 'R$ 250',
    items: [
      { label: 'Pacote 08 looks', price: 'R$ 250,00' },
      { label: 'Pacote 10 looks', price: 'R$ 350,00' },
      { label: 'Pacote 12 looks', price: 'R$ 450,00' },
      {
        label: 'Mensal · provador semanal, 08 looks',
        price: 'R$ 500,00',
        note: '+ R$ 500,00 em permuta',
      },
      {
        label: 'Mensal · provador semanal, 10 looks',
        price: 'R$ 700,00',
        note: '+ R$ 500,00 em permuta',
      },
    ],
  },
  {
    id: 'experiencia',
    index: '03',
    title: 'Experiência & Gastronomia',
    blurb:
      'Presença em restaurantes e eventos com produção de conteúdo lifestyle — fotos e vídeos do espaço e do menu.',
    fromPrice: 'R$ 300',
    items: [
      { label: 'Taxa de divulgação', price: 'R$ 300,00' },
      { label: 'Com collab', price: 'R$ 400,00' },
    ],
  },
  {
    id: 'ugc',
    index: '04',
    title: 'Vídeo UGC',
    blurb:
      'Conteúdo em vídeo com estética nativa de feed, criado para gerar desejo de compra.',
    fromPrice: 'R$ 150',
    items: [{ label: 'Vídeo UGC', price: 'R$ 150,00' }],
  },
]

export const niches = [
  { index: '01', label: 'Moda Casual' },
  { index: '02', label: 'Praia' },
  { index: '03', label: 'Fitness' },
  { index: '04', label: 'Lifestyle' },
]

export const manifesto =
  'Sou a Isadora Galvão, criadora de conteúdo e modelo. Meu trabalho é traduzir a essência de marcas através de uma estética cuidada e autêntica — da moda casual e praia ao fitness e lifestyle — para gerar desejo de compra e fortalecer a imagem dos meus parceiros.'

export const contact = {
  instagram: {
    label: '@isadoragboni',
    href: 'https://www.instagram.com/isadora_gboni',
  },
  whatsapp: {
    label: '+55 27 99958-5918',
    href: 'https://wa.me/5527999585918',
  },
  email: {
    label: 'isadoragbonita@gmail.com',
    href: 'mailto:isadoragbonita@gmail.com',
  },
  location: 'Guarapari — ES, Brasil',
}

export const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Contato', href: '#contato' },
]
