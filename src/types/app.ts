export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export type MainSection =
  | 'overview'
  | 'encyclopedia'
  | 'labs'
  | 'calculators'
  | 'toolkit';

export type EncyclopediaDiscipline =
  | 'all'
  | 'physics'
  | 'mathematics'
  | 'chemistry'
  | 'biology'
  | 'earth_space'
  | 'history'
  | 'geography'
  | 'computing';

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export interface ChemicalElement {
  number: number;
  symbol: string;
  nameAr: string;
  nameEn: string;
  mass: number;
  category: ElementCategory;
  group: number;
  period: number;
  xPos: number;
  yPos: number;
  phase: 'Solid' | 'Liquid' | 'Gas';
  shells: number[];
  electronegativity: number | null;
  meltK: number | null;
  boilK: number | null;
  discoveredYear: string;
  summaryAr: string;
  summaryEn: string;
}

export interface EncyclopediaArticle {
  id: string;
  discipline: Exclude<EncyclopediaDiscipline, 'all'>;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  eraOrDomainAr: string;
  eraOrDomainEn: string;
  summaryAr: string;
  summaryEn: string;
  keyLaws: {
    nameAr: string;
    nameEn: string;
    formula: string;
  }[];
  factsAr: string[];
  factsEn: string[];
}

export interface PlanetData {
  id: string;
  nameAr: string;
  nameEn: string;
  typeAr: string;
  typeEn: string;
  distanceAU: number;
  orbitalDays: number;
  radiusKm: number;
  gravityMs2: number;
  meanTempC: number;
  moons: number;
  color: string;
  hasRings?: boolean;
  summaryAr: string;
  summaryEn: string;
}

export interface ConstantItem {
  id: string;
  symbol: string;
  nameAr: string;
  nameEn: string;
  value: string;
  unit: string;
  domain: 'physics' | 'math' | 'chemistry' | 'astronomy';
  descriptionAr: string;
  descriptionEn: string;
}

export interface CountryAtlasItem {
  code: string;
  nameAr: string;
  nameEn: string;
  capitalAr: string;
  capitalEn: string;
  continentAr: string;
  continentEn: string;
  populationM: number;
  areaKm2: number;
  currencyAr: string;
  currencyEn: string;
  timezone: string;
}

export interface QuizQuestion {
  id: string;
  discipline: Exclude<EncyclopediaDiscipline, 'all'>;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  category: string;
}

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}
