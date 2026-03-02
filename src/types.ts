export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  ageGroup: string;
  theme: string;
  activities: string[];
  leaders: string[];
  materials: string[];
  notes: string;
  program?: {
    opening: string;
    dynamic: string;
    mainActivity: string;
    message: string;
    prayer: string;
    closing: string;
  };
}

export interface MeetingTemplate {
  id: string;
  name: string; // Nome do modelo para identificação
  title: string;
  location: string;
  ageGroup: string;
  theme: string;
  activities: string[];
  materials: string[];
  notes: string;
  program?: {
    opening: string;
    dynamic: string;
    mainActivity: string;
    message: string;
    prayer: string;
    closing: string;
  };
}

export interface Activity {
  id: string;
  title: string;
  category: 'recreativa' | 'natureza' | 'acampamento' | 'sobrevivencia' | 'especialidade' | 'missionaria';
  objective: string;
  ageGroup: string;
  materials: string[];
  steps: string[];
  duration: string;
  spiritualization?: string;
}

export interface SpiritualContent {
  id: string;
  type: 'meditacao' | 'devocional' | 'oracao' | 'versiculo' | 'desafio';
  title: string;
  content: string;
  reference?: string; // Bible reference
  isFavorite: boolean;
  isCompleted: boolean;
  date: string;
}

export interface UserProfile {
  name: string;
  clubName: string;
  role: 'lider' | 'desbravador';
  age: number;
  unit: string;
}
