export type AdmissionMode = 'Angola' | 'Graduate' | 'Internship' | 'ICTAcademy';

export type UserTrack = 'Programação' | 'Redes' | 'Telecomunicações' | 'Cloud' | 'IA' | 'Segurança' | 'Base de Dados' | 'Desenvolvimento Web' | 'Flutter' | 'DevOps';

export type TrackLevel = 'Júnior' | 'Intermédio' | 'Avançado' | 'Especialista';

export interface UserProfile {
  name: string;
  country: string;
  course: string;
  university: string;
  track: UserTrack;
  englishLevel: string;
  experience: string;
  interviewDate: string;
  admissionMode: AdmissionMode;
  personalizedPlan?: PersonalizedPlan;
}

export interface PersonalizedPlan {
  priorityTech: string[];
  prioritySoft: string[];
  recommendedHours: number;
  preparationRoadmap: string[];
  focusEnglish: string[];
  estimatedDaysToSuccess: number;
}

export interface Question {
  id: string;
  module: 'diagnostico' | 'psicotecnico' | 'ingles' | 'rh' | 'tecnico' | 'gestor';
  category?: string; // e.g. "Sequências Numéricas", "Raciocínio Lógico"
  topic?: string;    // e.g. "Telecomunicações", "Flutter"
  text: string;
  options?: string[]; // Para perguntas psicotécnicas ou múltipla escolha
  correctOption?: number; // Índice da opção correta
  level: TrackLevel;
  idealAnswer?: string;
  hint?: string;
  isCustomGenerated?: boolean;
}

export interface AnswerFeedback {
  grade: number; // 0 a 100
  strengths: string[];
  weaknesses: string[];
  interviewerThoughts: string;
  improvementTips: string;
  idealAnswer: string;
  train: {
    original: string;
    good: string;
    excellent: string;
    huaweiStandard: string;
  };
}

export interface ModuleProgress {
  module: number;
  name: string;
  questionsTotal: number;
  questionsCompleted: number;
  score: number;
}

export interface RankingItem {
  id: string;
  name: string;
  country: string;
  score: number;
  admissionMode: AdmissionMode;
  track: UserTrack;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface SimulationSession {
  id: string;
  startTime: string;
  durationSeconds: number; // 60 mins = 3600
  elapsedSeconds: number;
  isCompleted: boolean;
  score: number;
  admissionMode: AdmissionMode;
  answers: {
    questionId: string;
    questionText: string;
    userAnswer: string;
    spoken: boolean;
    feedback?: AnswerFeedback;
    timeSpent: number;
  }[];
}

export interface DetailedReport {
  summary: string;
  overallScore: number;
  comunicaçãoScore: number;
  inglêsScore: number;
  lógicaScore: number;
  perfilScore: number;
  técnicoScore: number;
  strengths: string[];
  weaknesses: string[];
  roadmap: string[];
  wrongQuestionsCount: number;
  avgResponseTimeSeconds: number;
  approvalProbability: number;
  classification: 'Não Preparado' | 'Parcialmente Preparado' | 'Preparado' | 'Altamente Preparado' | 'Pronto para Entrevista';
}
