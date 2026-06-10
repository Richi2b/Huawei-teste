import React, { useState, useEffect } from 'react';
import { UserProfile, RankingItem } from '../types';
import { 
  Play, BookOpen, Clock, Award, Star, List, ArrowUpRight, CheckCircle, Flame, Target, Sparkles, LogOut, ChevronRight, UserMinus
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  plan: any;
  scores: {
    comunicação: number;
    inglês: number;
    lógica: number;
    perfil: number;
    técnico: number;
  };
  rankingList: RankingItem[];
  onStartSimulation: (moduleType: any) => void;
  onResetProfile: () => void;
  stressMode: boolean;
  onToggleStressMode: () => void;
}

export default function Dashboard({ 
  profile, plan, scores, rankingList, onStartSimulation, onResetProfile, stressMode, onToggleStressMode 
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'ranking'>('roadmap');

  // Calcular probabilidade de aprovação média ponderada
  const overallProb = Math.min(99, Math.round(
    (scores.comunicação * 0.15) + 
    (scores.inglês * 0.20) + 
    (scores.lógica * 0.20) + 
    (scores.perfil * 0.15) + 
    (scores.técnico * 0.30)
  ));

  // Determine Classificação
  let classification = 'Não Preparado';
  let classColor = 'text-red-500 bg-red-500/10 border-red-500/20';
  if (overallProb >= 85) {
    classification = 'Pronto para Entrevista';
    classColor = 'text-green-500 bg-green-500/10 border-green-500/20';
  } else if (overallProb >= 70) {
    classification = 'Altamente Preparado';
    classColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  } else if (overallProb >= 50) {
    classification = 'Preparado';
    classColor = 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  } else if (overallProb >= 30) {
    classification = 'Parcialmente Prepared';
    classColor = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
  }

  // Coordenadas para renderização dinâmica de um Gráfico Radar SVG de Competências
  const labels = [
    { name: 'Comunicação', val: scores.comunicação, angle: 0 },
    { name: 'Inglês', val: scores.inglês, angle: 72 },
    { name: 'Lógica', val: scores.lógica, angle: 144 },
    { name: 'Perfil', val: scores.perfil, angle: 216 },
    { name: 'Técnico', val: scores.técnico, angle: 288 },
  ];

  const radarRadius = 70;
  const radarCenterX = 130;
  const radarCenterY = 110;

  const getCoordinates = (value: number, angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const distance = (value / 100) * radarRadius;
    const x = radarCenterX + distance * Math.cos(rad);
    const y = radarCenterY + distance * Math.sin(rad);
    return { x, y };
  };

  const polyPoints = labels.map(l => {
    const { x, y } = getCoordinates(l.val, l.angle);
    return `${x},${y}`;
  }).join(' ');

  // Círculos concêntricos de referência (25, 50, 75, 100)
  const refsGrid = [25, 50, 75, 100].map(val => {
    return labels.map(l => {
      const { x, y } = getCoordinates(val, l.angle);
      return { x, y };
    });
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6" id="dashboard-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#151515] text-white rounded-2xl p-6 shadow-xl border border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-[#CF0A2C] text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold animate-pulse">
              Modo {profile.admissionMode} 2026
            </span>
            <span className="text-zinc-500 text-xs font-mono">• Luanda, AO</span>
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight text-white mt-1">
            Olá, {profile.name}!
          </h2>
          <p className="text-zinc-400 font-sans text-xs">
            {profile.course} | {profile.university} | Área: <span className="text-[#CF0A2C] font-semibold">{profile.track}</span>
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-2.5">
          <button
            onClick={onToggleStressMode}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-all outline-none cursor-pointer border ${
              stressMode 
                ? 'bg-[#CF0A2C] hover:bg-red-700 text-white border-red-500 shadow-lg shadow-red-500/20'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${stressMode ? 'animate-bounce text-[#CF0A2C]' : 'text-zinc-500'}`} />
            <span>{stressMode ? 'Módulo Pressão Ativo' : 'Ativar Modo Pressão (M8)'}</span>
          </button>

          <button
            onClick={onResetProfile}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer outline-none"
          >
            <UserMinus className="w-3.5 h-3.5" />
            <span>Sair do Perfil</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar de Competências e Indicador de Probabilidade de Aprovação */}
        <div className="bg-[#151515] rounded-2xl p-6 border border-zinc-800 shadow-xl flex flex-col justify-between text-white">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-zinc-300 text-xs uppercase tracking-wider flex items-center space-x-1.5 font-mono">
                <Target className="w-4 h-4 text-[#CF0A2C]" />
                <span>Competências Atuais (M10)</span>
              </h3>
              <span className={`text-[10px] font-mono uppercase border px-2 py-0.5 rounded-full font-bold ${classColor.replace('bg-green-500/10 text-green-500 border-green-500/20', 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20').replace('bg-emerald-500/10 text-emerald-500 border-emerald-500/20', 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20').replace('bg-red-500/10 text-red-500 border-red-500/20', 'bg-red-500/10 text-[#CF0A2C] border-red-500/20').replace('bg-indigo-500/10 text-indigo-500 border-indigo-500/20', 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20')}`}>
                {classification}
              </span>
            </div>

            {/* SVG Radar customizado */}
            <div className="relative flex justify-center py-2 h-[220px]">
              <svg width="260" height="220" className="drop-shadow-sm">
                {/* Linhas de fundo que cortam o centro */}
                {labels.map((l, i) => {
                  const end = getCoordinates(100, l.angle);
                  return (
                    <line 
                      key={i} 
                      x1={radarCenterX} 
                      y1={radarCenterY} 
                      x2={end.x} 
                      y2={end.y} 
                      stroke="#27272a" 
                      strokeWidth="1" 
                      strokeDasharray="2"
                    />
                  );
                })}

                {/* Grelhas concêntricas (Teias) */}
                {refsGrid.map((refPoints, valIdx) => {
                  const pointsStr = refPoints.map(p => `${p.x},${p.y}`).join(' ');
                  return (
                    <polygon 
                      key={valIdx} 
                      points={pointsStr} 
                      fill="none" 
                      stroke="#1f1f23" 
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Polígono da Pontuação Atual */}
                <polygon 
                  points={polyPoints} 
                  fill="rgba(207, 10, 44, 0.15)" 
                  stroke="#CF0A2C" 
                  strokeWidth="2"
                  className="transition-all duration-300 animate-pulse"
                />

                {/* Rótulos de Texto das Categorias */}
                {labels.map((l, i) => {
                  const pos = getCoordinates(120, l.angle);
                  const isLeft = pos.x < radarCenterX;
                  const textAnchor = Math.abs(pos.x - radarCenterX) < 15 ? "middle" : (isLeft ? "end" : "start");
                  return (
                    <g key={i}>
                      <text 
                        x={pos.x} 
                        y={pos.y + 3} 
                        className="text-[10px] font-mono font-bold fill-zinc-400" 
                        textAnchor={textAnchor}
                      >
                        {l.name} ({l.val}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-zinc-500 text-xs font-sans block">Aprovação Prevista</span>
                <span className="font-display font-black text-2xl text-white tracking-tight">{overallProb}% Estabilidade</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl px-3 py-1.5 border border-emerald-500/20">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase">Huawei Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos de Simulação Interativos */}
        <div className="lg:col-span-2 bg-[#151515] rounded-2xl p-6 border border-zinc-800 shadow-xl text-white">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-display font-extrabold text-zinc-300 text-xs uppercase tracking-wider flex items-center space-x-1.5 font-mono">
                <List className="w-4 h-4 text-[#CF0A2C]" />
                <span>Simuladores Pro Max (Módulos 1-6)</span>
              </h3>
              <p className="text-zinc-500 text-xs font-sans mt-0.5">Participe nas entrevistas para acumular competência técnica de evolução.</p>
            </div>
            {stressMode && (
              <span className="bg-[#CF0A2C] text-white font-mono text-[9px] px-2 py-0.5 rounded uppercase animate-pulse font-bold">
                Aceleração Virtual Ativa
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* M1: Avaliação Diagnóstica */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0F0F0F]/60 hover:bg-zinc-800/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-mono rounded px-1.5 py-0.5 font-bold uppercase">Mód 1</span>
                  <span className="text-[10px] font-mono text-zinc-500">Tempo: Livre</span>
                </div>
                <h4 className="font-display font-bold text-zinc-100 text-sm mt-2 leading-snug">Avaliação Diagnóstica</h4>
                <p className="text-zinc-400 text-xs font-sans mt-1">Identificação integral das competências de inglês, lógica e comunicação.</p>
              </div>
              <button
                onClick={() => onStartSimulation('diagnostico')}
                className="mt-3.5 w-full py-2 bg-[#CF0A2C] hover:bg-red-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 border-none cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Iniciar Diagnóstica</span>
              </button>
            </div>

            {/* M2: Simulador Psicotécnico */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0F0F0F]/60 hover:bg-zinc-800/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-mono rounded px-1.5 py-0.5 font-bold uppercase">Mód 2</span>
                  <span className="text-[10px] font-mono text-zinc-500">{stressMode ? 'Tempo: 20s' : 'Tempo: 60s'}</span>
                </div>
                <h4 className="font-display font-bold text-zinc-100 text-sm mt-2 leading-snug">Simulador Psicotécnico</h4>
                <p className="text-zinc-400 text-xs font-sans mt-1">Questões inteiramente dinâmicas de sequências, álgebra, diagramas e dados.</p>
              </div>
              <button
                onClick={() => onStartSimulation('psicotecnico')}
                className="mt-3.5 w-full py-2 bg-[#CF0A2C] hover:bg-red-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 border-none cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Resolver Psicotécnico</span>
              </button>
            </div>

            {/* M3: Simulador de Inglês */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0F0F0F]/60 hover:bg-zinc-800/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-mono rounded px-1.5 py-0.5 font-bold uppercase">Mód 3</span>
                  <span className="text-[10px] font-mono text-zinc-500">{stressMode ? 'Tempo: 45s' : 'Tempo: 90s'}</span>
                </div>
                <h4 className="font-display font-bold text-zinc-100 text-sm mt-2 leading-snug">Simulador de Inglês</h4>
                <p className="text-zinc-400 text-xs font-sans mt-1">Perguntas fundamentais da Huawei no formato oral para testar gramática e fonemas.</p>
              </div>
              <button
                onClick={() => onStartSimulation('ingles')}
                className="mt-3.5 w-full py-2 bg-[#CF0A2C] hover:bg-red-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 border-none cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Start English Speaking</span>
              </button>
            </div>

            {/* M4-M5: Entrevista Técnica / Gestor / RH Conjugados */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0F0F0F]/60 hover:bg-zinc-800/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-mono rounded px-1.5 py-0.5 font-bold uppercase">Mód 4-6</span>
                  <span className="text-[10px] font-mono text-zinc-500">Focado em {profile.track}</span>
                </div>
                <h4 className="font-display font-bold text-zinc-100 text-sm mt-2 leading-snug">Entrevista Técnica e Gestor</h4>
                <p className="text-zinc-400 text-xs font-sans mt-1">Perguntas de comportamento (RH), arquitetura técnica de Engenharia e crises.</p>
              </div>
              <button
                onClick={() => onStartSimulation('tecnico')}
                className="mt-3.5 w-full py-2 bg-[#CF0A2C] hover:bg-red-700 text-white font-mono text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 border-none cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Simular Exame Técnico</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details & Leadership Leaderboards Ranking Tab */}
      <div className="bg-[#151515] rounded-2xl border border-zinc-800 shadow-xl overflow-hidden text-white">
        <div className="border-b border-zinc-800 bg-[#0F0F0F] px-6 py-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`pb-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer ${
                activeTab === 'roadmap' ? 'text-[#CF0A2C] border-b-2 border-[#CF0A2C]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Plano de Estudo IA
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`pb-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer ${
                activeTab === 'ranking' ? 'text-[#CF0A2C] border-b-2 border-[#CF0A2C]' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Exibir Ranking de Evolução
            </button>
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Última Sincronização: Tempo Real
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'roadmap' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Prioridades Tecnológicas */}
              <div className="space-y-3 bg-[#0F0F0F] p-5 rounded-xl border border-zinc-800">
                <h4 className="font-display font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center space-x-1 font-mono">
                  <Star className="w-4 h-4 text-[#CF0A2C]" />
                  <span>Prioridades do Core Técnico</span>
                </h4>
                <ul className="space-y-2">
                  {plan.priorityTech?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 text-xs font-sans text-zinc-300">
                      <span className="text-[#CF0A2C] text-xs font-mono mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Foco de Soft Skills & Inglês */}
              <div className="space-y-3 bg-[#0F0F0F] p-5 rounded-xl border border-zinc-800">
                <h4 className="font-display font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center space-x-1 font-mono">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Foco: Soft Skills & Inglês</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">Idioma</span>
                    <ul className="space-y-1.5 mt-1">
                      {plan.focusEnglish?.map((item: string, i: number) => (
                        <li key={i} className="text-xs font-sans text-zinc-300 flex items-start space-x-2">
                          <span className="text-blue-450 text-xs font-mono">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">Competências Comportamentais</span>
                    <ul className="space-y-1 mt-1">
                      {plan.prioritySoft?.map((item: string, i: number) => (
                        <li key={i} className="text-xs font-sans text-zinc-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Roteiro Sequencial */}
              <div className="space-y-3 bg-[#0F0F0F] p-5 rounded-xl border border-zinc-800">
                <h4 className="font-display font-bold text-zinc-100 text-xs uppercase tracking-wider flex items-center space-x-1 font-mono">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Roteiro de Evolução ({plan.estimatedDaysToSuccess} dias)</span>
                </h4>
                <div className="space-y-2.5">
                  {plan.preparationRoadmap?.map((step: string, i: number) => (
                    <div key={i} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-sans text-zinc-300 font-medium leading-tight">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#0F0F0F] p-3 rounded-lg border border-zinc-800">
                <span className="text-xs font-sans text-zinc-400 leading-relaxed">
                  Suba sua nota pontuando nos módulos para subir no rank e habilitar a classificação <strong>Pronto para Entrevista</strong> na Huawei.
                </span>
                <span className="bg-[#CF0A2C]/10 text-[#CF0A2C] border border-[#CF0A2C]/30 px-2.5 py-1 rounded text-xs font-mono uppercase font-bold text-right shrink-0">
                  Global Leaderboard
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider font-mono">
                      <th className="py-2.5 px-3">Class.</th>
                      <th className="py-2.5">Candidato</th>
                      <th className="py-2.5">País</th>
                      <th className="py-2.5">Programa</th>
                      <th className="py-2.5">Tecnologia</th>
                      <th className="py-2.5 text-right font-mono font-bold text-zinc-200 pr-3">Nota Prep</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankingList.map((cand, idx) => {
                      const isMe = cand.isCurrentUser || cand.name === profile.name;
                      return (
                        <tr 
                          key={cand.id || idx} 
                          className={`border-b border-zinc-900 ${isMe ? 'bg-[#CF0A2C]/10 font-semibold border-l-4 border-l-[#CF0A2C] text-[#CF0A2C]' : ''}`}
                        >
                          <td className="py-3 px-3 font-mono text-zinc-300">
                            {idx + 1 === 1 ? '🥇' : idx + 1 === 2 ? '🥈' : idx + 1 === 3 ? '🥉' : idx + 1}
                          </td>
                          <td className="py-3 flex items-center space-x-2">
                            <span className="text-lg">{cand.avatar || '🎓'}</span>
                            <div>
                              <span className={`${isMe ? 'text-white font-bold' : 'text-zinc-300'} font-medium`}>{cand.name}</span>
                              {isMe && <span className="ml-1.5 bg-[#CF0A2C] text-[8px] font-mono uppercase tracking-widest text-white px-1.5 py-0.5 rounded">VOCÊ</span>}
                            </div>
                          </td>
                          <td className="py-3 text-zinc-400 text-xs">{cand.country}</td>
                          <td className="py-3 text-zinc-400 text-xs font-mono">{cand.admissionMode}</td>
                          <td className="py-3 text-zinc-400 text-xs">{cand.track}</td>
                          <td className="py-3 text-right font-mono font-bold text-zinc-200 pr-3">{cand.score}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
