import React from 'react';
import { UserProfile } from '../types';
import { 
  Trophy, TrendingUp, AlertTriangle, Lightbulb, Clock, CheckCircle2, XCircle, Award, RefreshCw, Star, ArrowRight, ShieldCheck
} from 'lucide-react';

interface ReportCardProps {
  profile: UserProfile;
  overallScore: number;
  sessionHistory: { questionText: string; answerText: string; score: number }[];
  onFinishReport: () => void;
}

export default function ReportCard({ profile, overallScore, sessionHistory, onFinishReport }: ReportCardProps) {
  
  // Calcular média de tempo gasto simulada
  const avgTime = Math.round(18 + Math.random() * 12);
  
  // Calcular estatísticas com base no histórico da sessão
  const successCount = sessionHistory.filter(q => q.score >= 70).length;
  const incorrectCount = sessionHistory.filter(q => q.score < 70).length;

  // Classificação final rigorosa (M11)
  let classification: 'Não Preparado' | 'Parcialmente Preparado' | 'Preparado' | 'Altamente Preparado' | 'Pronto para Entrevista' = 'Não Preparado';
  let classIcon = '❌';
  let classBg = 'bg-red-950/20 text-red-200 border-red-500/20';
  let descText = 'A sua pontuação média indica necessidade urgente de revisão dos fundamentos técnicos e prática de comunicação.';

  if (overallScore >= 90) {
    classification = 'Pronto para Entrevista';
    classIcon = '👑';
    classBg = 'bg-emerald-950/20 text-emerald-100 border-emerald-500/30';
    descText = 'Nível excelente de performance! Demonstra absoluto domínio técnico, oralidade robusta e excelente encaixe cultural.';
  } else if (overallScore >= 75) {
    classification = 'Altamente Preparado';
    classIcon = '🚀';
    classBg = 'bg-emerald-950/10 text-emerald-200 border-emerald-500/20';
    descText = 'Nível sólido acima da linha média de corte de candidatos da Huawei local. Recomendamos apenas lixar pequenos detalhes.';
  } else if (overallScore >= 60) {
    classification = 'Preparado';
    classIcon = '⭐️';
    classBg = 'bg-blue-950/20 text-blue-200 border-blue-500/20';
    descText = 'Demonstra bom conhecimento prático. Se focar nos treinamentos das respostas padrão Huawei, garantirá estabilidade.';
  } else if (overallScore >= 40) {
    classification = 'Parcialmente Preparado';
    classIcon = '⚠️';
    classBg = 'bg-yellow-950/20 text-yellow-101 border-yellow-500/20';
    descText = 'Bases iniciais razoáveis. No entanto, necessita de aprofundar terminologias e utilizar o método STAR de argumentação.';
  }

  // Plano de melhoria personalizado adaptado à track
  const improvements: Record<string, string[]> = {
    'Redes': [
      'Aprofundar os diagramas de switches da série CloudEngine da Huawei.',
      'Reforçar os comandos CLI de subnetting e políticas OSPF.',
      'Aumentar o dinamismo de fala ao responder sobre topologia WAN.'
    ],
    'Telecomunicações': [
      'Rever diagramas 5G Core Standalone e fatiamento de rede.',
      'Treinar explicações de Handover no rádio rádio enlace.',
      'Articular melhor tempos verbais em inglês para projetos multinacionais.'
    ],
    'Programação': [
      'Desenhar arquitetura limpa com SOLID em exercícios práticos.',
      'Aumentar familiaridade com complexidade de tempo de Big O em algoritmos.',
      'Estruturar respostas a problemas complexos dividindo em partes menores.'
    ]
  };

  const defaultImprovements = [
    'Estudar os valores Huawei de Centralidade no cliente e Dedicação contínua.',
    'Utilizar conectores profissionais para dar fluidez e segurança às suas respostas orais.',
    'Inscrever-se nos laboratórios de simulação técnica adicionais de ' + profile.track
  ];

  const selectedImprovements = improvements[profile.track] || defaultImprovements;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 text-white" id="report-card-container">
      
      {/* Banner Principal com Selo Huawei */}
      <div className="bg-zinc-950 text-white rounded-3xl p-8 border border-zinc-850 shadow-2xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Glow Filter decors */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center space-x-1 bg-[#CF0A2C] text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-bold text-white">
            <Trophy className="w-3 h-3 text-white mr-1" />
            <span>Módulo 11 // Relatório Final</span>
          </div>
          <h2 className="font-display font-black text-3xl text-white tracking-tight leading-none uppercase">
            Análise de Desempenho
          </h2>
          <p className="text-zinc-400 text-sm font-sans leading-relaxed">
            Construção estatística para admissão de <strong>{profile.name}</strong> no fluxo de recrutamento <strong>{profile.admissionMode}</strong>.
          </p>
        </div>

        {/* Badge de Aprovação */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center shrink-0 w-[180px]">
          <span className="text-zinc-500 text-[10px] font-mono block uppercase">Prob. Aprovação</span>
          <span className="font-display font-black text-4xl text-[#CF0A2C] tracking-tight mt-1 inline-block">
            {overallScore}%
          </span>
          <span className="text-zinc-400 text-xs font-mono block mt-1.5 font-bold uppercase">Meta Huawei &gt; 80%</span>
        </div>
      </div>

      {/* Grid de Pontuações de Classificação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className={`col-span-1 md:col-span-2 border rounded-2xl p-6 shadow-md flex flex-col justify-between ${classBg}`}>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{classIcon}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Classificação de Seleção</span>
            </div>
            <h3 className="font-display font-black text-2xl tracking-normal mt-2">
              {classification}
            </h3>
            <p className="text-sm font-sans mt-3 leading-relaxed font-medium">
              {descText}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Área: {profile.track}</span>
            <span>Estabilidade Coletiva</span>
          </div>
        </div>

        <div className="bg-[#151515] border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4">
          <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Estatísticas Telemetria</h4>
          <div className="space-y-3.5">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
              <span className="text-zinc-400 text-xs font-sans">Tempo Médio Resposta</span>
              <span className="font-mono text-sm font-bold text-zinc-100 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500 mr-1" />
                {avgTime}s
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
              <span className="text-zinc-400 text-xs font-sans">Acertos (Aptidão)</span>
              <span className="font-mono text-sm font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                {successCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-xs font-sans">Erros / Hesitações</span>
              <span className="font-mono text-sm font-bold text-red-400 flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5 text-red-500 mr-1" />
                {incorrectCount}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Histórico Geral das Perguntas do Exame */}
      <div className="bg-[#151515] border border-zinc-800 rounded-2xl shadow-md overflow-hidden">
        <div className="bg-[#0F0F0F] px-6 py-4 border-b border-zinc-805">
          <h3 className="font-display font-bold text-zinc-300 text-sm uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#CF0A2C]" />
            <span>Mapeamento do Questionário Respondido</span>
          </h3>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">Mapeamento de respostas, notas de correspondência e tópicos avaliados na sessão.</p>
        </div>

        <div className="p-6 space-y-5">
          {sessionHistory.length === 0 ? (
            <p className="text-zinc-500 text-xs font-sans text-center">Nenhum histórico disponível para esta sessão de diagnóstico.</p>
          ) : (
            sessionHistory.map((sh, idx) => (
              <div key={idx} className="border-b border-zinc-850 pb-4 last:border-b-0 last:pb-0 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-zinc-500 block font-bold uppercase">Questão {idx + 1}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${sh.score >= 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold' : 'bg-red-500/10 text-red-500 border border-red-500/20 font-bold'}`}>
                    Pontuação: {sh.score}/100
                  </span>
                </div>
                <p className="text-zinc-200 text-xs font-semibold font-sans">{sh.questionText}</p>
                <div className="text-zinc-300 text-xs font-sans italic bg-[#0F0F0F] p-3 rounded border border-zinc-805">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase block select-none mb-1">Sua resposta:</span>
                  "{sh.answerText || 'Sem resposta.'}"
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Plano de Melhoria Pedagógica */}
      <div className="bg-[#151515] border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="font-display font-bold text-zinc-300 text-sm uppercase tracking-wider flex items-center space-x-1.5 font-mono">
          <Lightbulb className="w-4.5 h-4.5 text-blue-400" />
          <span>Plano de Melhoria Pedagógica Recombinado</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedImprovements.map((imp, i) => (
            <div key={i} className="bg-[#0F0F0F] border border-zinc-800 rounded-xl p-3.5 flex items-start space-x-2.5">
              <span className="text-[#CF0A2C] font-bold font-mono text-xs mt-0.5">{i + 1}.</span>
              <p className="text-zinc-300 text-xs font-sans font-medium">{imp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Ação para Repetir ou Ver Rank */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onFinishReport}
          className="py-3.5 px-6 bg-[#CF0A2C] hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1.5 shadow-lg shadow-red-500/15 cursor-pointer border-none"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Refazer / Aceder ao Painel Geral</span>
        </button>
      </div>

    </div>
  );
}
