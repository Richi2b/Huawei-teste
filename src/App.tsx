import React, { useState, useEffect } from 'react';
import { UserProfile, RankingItem } from './types';
import IntroForm from './components/IntroForm';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import ReportCard from './components/ReportCard';
import { Cpu, Award, Zap, HelpCircle } from 'lucide-react';

const LOCAL_PROFILE_KEY = 'huawei_prep_profile_2026';
const LOCAL_SCORES_KEY = 'huawei_prep_scores_2026';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<any>(null);
  
  // Pontuações iniciais de partida
  const [scores, setScores] = useState({
    comunicação: 60,
    inglês: 60,
    lógica: 60,
    perfil: 60,
    técnico: 60
  });

  const [rankingList, setRankingList] = useState<RankingItem[]>([]);
  const [activeModule, setActiveModule] = useState<'diagnostico' | 'psicotecnico' | 'ingles' | 'tecnico' | 'gestor' | null>(null);
  const [sessionHistory, setSessionHistory] = useState<{ questionText: string; answerText: string; score: number }[]>([]);
  const [viewState, setViewState] = useState<'intro' | 'dashboard' | 'report'>('intro');
  const [stressMode, setStressMode] = useState(false);

  // Carregar dados salvos no localStorage no boot da aplicação
  useEffect(() => {
    const savedProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
    const savedScores = localStorage.getItem(LOCAL_SCORES_KEY);

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        
        // Re-gerar o roteiro técnico customizado do servidor
        fetch('/api/profile/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPlan(data.plan);
            setViewState('dashboard');
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Buscar ranking geral de evolução ao carregar o profile
  const fetchRanking = async (scoreToSync?: number, candProfile?: UserProfile) => {
    const activeProf = candProfile || profile;
    if (!activeProf) return;

    try {
      const scoreQuery = scoreToSync !== undefined ? scoreToSync : Math.round(
        (scores.comunicação * 0.15) + (scores.inglês * 0.20) + (scores.lógica * 0.20) + (scores.perfil * 0.15) + (scores.técnico * 0.30)
      );

      const url = `/api/ranking?userScore=${scoreQuery}&userName=${encodeURIComponent(activeProf.name)}&userTrack=${encodeURIComponent(activeProf.track)}&userMode=${encodeURIComponent(activeProf.admissionMode)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRankingList(data.ranking);
      }
    } catch (err) {
      console.error("Failed to load rankings leaderboard:", err);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchRanking();
    }
  }, [profile]);

  // Manipular setup inicial de perfil
  const handleProfileCreated = (newProfile: UserProfile, generatedPlan: any) => {
    setProfile(newProfile);
    setPlan(generatedPlan);
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
    setViewState('dashboard');
    fetchRanking(60, newProfile);
  };

  // Sair do Perfil / Resetar
  const handleResetProfile = () => {
    localStorage.removeItem(LOCAL_PROFILE_KEY);
    localStorage.removeItem(LOCAL_SCORES_KEY);
    setProfile(null);
    setPlan(null);
    setScores({
      comunicação: 60,
      inglês: 60,
      lógica: 60,
      perfil: 60,
      técnico: 60
    });
    setViewState('intro');
  };

  // Concluir um simulado individual
  const handleFinishSimulationSession = (
    newScores: { comunicação: number; inglês: number; lógica: number; perfil: number; técnico: number },
    history: { questionText: string; answerText: string; score: number }[]
  ) => {
    // Mesclar valores de teste ponderados
    const mergedScores = { ...scores };
    if (activeModule === 'diagnostico') {
      mergedScores.comunicação = newScores.comunicação;
      mergedScores.perfil = newScores.perfil;
    } else if (activeModule === 'psicotecnico') {
      mergedScores.lógica = newScores.lógica;
    } else if (activeModule === 'ingles') {
      mergedScores.inglês = newScores.inglês;
    } else if (activeModule === 'tecnico') {
      mergedScores.técnico = newScores.técnico;
    }

    setScores(mergedScores);
    localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(mergedScores));
    setSessionHistory(history);
    setActiveModule(null);
    setViewState('report');

    // Calcular nota integral para atualizar o top rank
    const overall = Math.round(
      (mergedScores.comunicação * 0.15) + (mergedScores.inglês * 0.20) + (mergedScores.lógica * 0.20) + (mergedScores.perfil * 0.15) + (mergedScores.técnico * 0.30)
    );
    fetchRanking(overall);
  };

  const handleFinishReport = () => {
    setViewState('dashboard');
    setSessionHistory([]);
  };

  const overallScoreCalc = Math.min(99, Math.round(
    (scores.comunicação * 0.15) + (scores.inglês * 0.20) + (scores.lógica * 0.20) + (scores.perfil * 0.15) + (scores.técnico * 0.30)
  ));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans" id="application-root">
      {/* Barra de Navegação Superior Integrada */}
      <header className="border-b border-zinc-800 bg-[#0F0F0F]" id="main-navigation-bar">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#CF0A2C] rounded flex items-center justify-center font-bold text-lg select-none">
              <span className="text-white">H</span>
            </div>
            <div>
              <span className="font-display font-extrabold text-sm text-white uppercase tracking-tight block">
                HUAWEI PREP PRO MAX <span className="text-[#CF0A2C]">2026</span>
              </span>
              <span className="font-mono text-[9px] text-zinc-500 block tracking-widest uppercase">
                Centro Inteligente de Preparação Profissional
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 font-semibold uppercase flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping" />
              Sincronizado IA
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Layout Dinâmico */}
      <main className="py-6" id="main-content-layout">
        {viewState === 'intro' && (
          <IntroForm onProfileCreated={handleProfileCreated} />
        )}

        {viewState === 'dashboard' && profile && plan && !activeModule && (
          <Dashboard
            profile={profile}
            plan={plan}
            scores={scores}
            rankingList={rankingList}
            onStartSimulation={mod => setActiveModule(mod)}
            onResetProfile={handleResetProfile}
            stressMode={stressMode}
            onToggleStressMode={() => setStressMode(prev => !prev)}
          />
        )}

        {activeModule && profile && (
          <Simulator
            profile={profile}
            moduleType={activeModule}
            stressMode={stressMode}
            onFinishSession={handleFinishSimulationSession}
            onBack={() => setActiveModule(null)}
          />
        )}

        {viewState === 'report' && profile && (
          <ReportCard
            profile={profile}
            overallScore={overallScoreCalc}
            sessionHistory={sessionHistory}
            onFinishReport={handleFinishReport}
          />
        )}
      </main>

      {/* Rodapé corporativo unificado */}
      <footer className="border-t border-zinc-800 bg-[#0F0F0F] py-6 text-center text-zinc-500 text-xs font-mono" id="main-footer">
        <p>© 2026 Huawei Prep Pro Max. Todos os direitos reservados.</p>
        <p className="text-[10px] text-zinc-600 mt-1">Concebido em conformidade com as diretivas das Huawei ICT Academies em Angola e Internacional.</p>
      </footer>
    </div>
  );
}
