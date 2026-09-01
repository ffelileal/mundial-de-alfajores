export interface PresetAlfajor {
  name: string;
  brand: string;
  flavor: string;
  description: string;
  image?: string;
}

export const PRESET_ALFAJORES: PresetAlfajor[] = [
  {
    name: "Havanna 70% Cacao Puro",
    brand: "Havanna",
    flavor: "Chocolate amargo 70% con dulce de leche vacuno",
    description: "El clásico marplatense recubierto con intenso chocolate semiamargo.",
  },
  {
    name: "Cachafaz Maicena",
    brand: "Cachafaz",
    flavor: "Maicena con abundante dulce de leche y coco rallado",
    description: "Tapas suaves que se deshacen en la boca con dulce de leche premium.",
  },
  {
    name: "Capitán del Espacio Negro",
    brand: "Capitán del Espacio",
    flavor: "Chocolate con dulce de leche clásico",
    description: "Leyenda del conurbano sur bonaerense con masa esponjosa y sabor inconfundible.",
  },
  {
    name: "Guaymallén Triple Chocolate",
    brand: "Guaymallén",
    flavor: "Triple capa de chocolate con dulce de leche",
    description: "El alfajor del pueblo, bicampeón del corazón popular.",
  },
  {
    name: "Rapanui Frambuesa & Dulce de Leche",
    brand: "Rapanui",
    flavor: "Chocolate con corazón de frambuesa patagónica y dulce de leche",
    description: "Creación artesanal de Bariloche con frutas finas y chocolate de autor.",
  },
  {
    name: "Jorgito Negro",
    brand: "Jorgito",
    flavor: "Baño de repostería con dulce de leche",
    description: "Inseparable compañero del recreo y de las tardes argentinas.",
  },
  {
    name: "Suchard Mousse",
    brand: "Suchard",
    flavor: "Relleno de mousse de chocolate con baño amargo",
    description: "El mítico alfajor de los 90 revivido para los amantes del chocolate intenso.",
  },
  {
    name: "Terrabusi Clásico Glaseado",
    brand: "Terrabusi",
    flavor: "Glaseado de azúcar con dulce de leche",
    description: "La textura crocante del glaseado blanco con corazón tierno.",
  },
];

export const PRESET_PARTICIPANTS = [
  { name: "Feli", avatarEmoji: "😎" },
  { name: "Agus", avatarEmoji: "🇦🇷" },
  { name: "Juan", avatarEmoji: "🍫" },
  { name: "Mica", avatarEmoji: "⭐" },
];

export const EMOJI_AVATARS = ["👤", "😎", "🇦🇷", "🍫", "⭐", "🧉", "🏆", "😋", "🔥", "👑", "🎩", "🦊", "🦁", "🚀"];
